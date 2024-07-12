from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError
from random import randint
from datetime import datetime


class Association_Member(models.Model):
    _name = 'rpn.association.member'
    _inherit = 'm0shrpn.base'
    _description = 'Association Member'

    @api.model
    def _get_default_partner(self):
        partner_obj = self.env.get('res.partner')
        return partner_obj.search([('related_user_id', '=', self.env.user.id)], limit=1)

    @api.model
    def _get_default_color(self):
        return randint(1, 11)

    partner_id = fields.Many2one('res.partner', string='Member', default=_get_default_partner, required=True)

    manager_id = fields.Many2one('res.partner',
                                 string='My Manager',
                                 domain="[('is_member', '=', True), ('state', '=', 'active')]")

    departure_date = fields.Datetime(string='Departure date')
    street = fields.Char(required=True)
    street2 = fields.Char()
    zip = fields.Char(change_default=True)
    birth_date = fields.Datetime(string='Birth date', required=True)
    birth_city_id = fields.Many2one('res.city', string="Birth City", required=True)
    city_id = fields.Many2one('res.city', string="City", required=True)
    state_id = fields.Many2one("res.country.state", string='State', domain="[('country_id', '=?', country_id)]")
    nationality_id = fields.Many2one('res.country', string='Nationality', required=True, readonly=True,
                                 default=lambda self: self.env['res.country'].search([('code', '=', 'CM')], limit=1))
    country_id = fields.Many2one('res.country', string='Country', required=True, readonly=True,
                                 default=lambda self: self.env['res.country'].search([('code', '=', 'CA')], limit=1))

    color = fields.Integer(string='Color Index', default=_get_default_color)

    status = fields.Selection([
        ('canadian_citizen', 'Canadian Citizen'),
        ('resident_permit', 'Residence Permit'),
        ('student_permit', 'Study Permit'),
        ('refugee', 'Refugee'),
        ('visitor', 'Visitor'),
        ('tourist', 'Tourist'),
        ('work_permit', 'Work Permit'),
        ('other_status', 'Other Status')
    ], required=True, string='Status in Canada')

    currency_id = fields.Many2one(
        'res.currency',
        string='Currency:',
        compute='_compute_currency',
        store=True  # Store the computed value in the database for real-time display
    )

    @api.depends('partner_id.account_balance')
    def _compute_account_balance(self):
        for record in self:
            record.account_balance = record.partner_id.account_balance

    account_balance = fields.Monetary(string='Account Balance', compute='_compute_account_balance', store=True,
                                      readonly=True)

    @api.depends('partner_id', 'manager_id', 'status', 'country_id')  # Adjust the dependency as per your logic
    def _compute_currency(self):
        resconfigvalues = self.env['res.config.settings'].sudo().get_values()
        currency_id = resconfigvalues['rpn_base_config_currency_id']
        self.currency_id = currency_id

    @api.constrains('manager_id')
    def _onchange_partner_id(self):
        if self.partner_id == self.manager_id:
            raise ValidationError(_("You can't choose yourself as your manager."))

    @api.constrains('partner_id')
    def _check_partner_attachment(self):
        for member in self:
            # Check if the partner has the required attachment type ('cni' or 'passport')
            attachment_type = 'cni or passport'  # Change this to the desired attachment type
            attachment = self.env['ir.attachment'].search([
                ('partner_id', '=', member.partner_id.id)
            ])
            if not attachment:
                raise ValidationError(
                    _(u"The partner must have an attachment of type '%s' before creating this member.") % attachment_type)

    def _create_notification_log(self, partner_id, message_title, message_body):
        self.env['rpn.notification.log'].sudo().create({
            'partner_id': partner_id,
            'message_title': message_title,
            'message_body': message_body,
            'is_seen': False,
            'disable': False,
        })

    @api.model
    def _send_manager_push(self, object):
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        push_bool = resconfigvalues['rpn_base_send_push_notifications']
        if push_bool:
            message_title = resconfigvalues['member_selected_as_manager_title']
            message_body = resconfigvalues['member_selected_as_manager_body'] % (
                object.manager_id.name, object.partner_id.name, fields.Datetime.now())
            message_body += u" | RPN-MG ID:{%s}" % object.id
            object.manager_id.generate_fcm_notification(message_title=message_title, message_body=message_body)
            self._create_notification_log(object.manager_id.id, message_title, message_body)

    @api.model
    def create(self, vals):

        # Check if an association.member with the same partner already exists
        partner_id = vals.get('partner_id', False)  # Get the partner_id from vals

        if partner_id:
            existing_member = self.env['rpn.association.member'].search([
                ('partner_id', '=', partner_id)
            ])
            if existing_member:
                raise ValidationError(
                    "You have already provided information on your membership. If something is wrong, you can edit it.")

        # Create the association member
        member = super(Association_Member, self).create(vals)

        # Set the is_member field to True in the related res.partner record
        if member.partner_id:
            member.partner_id.write({'is_member': True,
                                     'account_balance': member.partner_id.account_balance})  # Make sure 'is_member' is a valid field in res.partner model.

        if member.manager_id:
            member.manager_id.write(
                {'is_manager': True})  # Make sure 'is_manager' is a valid field in res.partner model.

        if member.manager_id:
            resconfigvalues = self.get_model_pool('res.config.settings').get_values()
            email_bool = resconfigvalues['rpn_base_send_emails']
            if email_bool:
                template_id = self.env.ref(
                    'm1sh_rpn_associations.member_selected_as_manager')
                template_id.sudo().send_mail(member.id, force_send=True)
                print('Manager email', member.id)

            # Make sure 'association.manager' model and fields are correctly defined before creating a record here.
            manager_vals = {
                'partner_id': member.manager_id.id,
                'members': member,
                'status': member.status,
                'member_partner_id': member.partner_id.id,
            }
            self.env['association.manager'].sudo().create(manager_vals)
            self._send_manager_push(member)



        return member

    def account_dis_activated(self):
        print("account_dis_activated")
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        push_bool = resconfigvalues['rpn_base_send_push_notifications']
        mail_bool = resconfigvalues['rpn_base_send_emails']
        current_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        template_id = self.env.ref('m1sh_rpn_associations.member_account_dis_activated')
        template_id2 = self.env.ref('m1sh_rpn_associations.managers_member_account_dis_activated')
        members_to_dis_activate = self.search([
            ('status', '=', 'visitor'),
            ('departure_date', '<=', current_date),
            ('departure_date', '!=', False)
        ])
        for member in members_to_dis_activate:
            if member.partner_id.state == 'active':
                member.partner_id.state = 'suspended'
                if template_id:
                    if mail_bool:
                        # Call send_mail with the correct parameters
                        template_id.send_mail(member.id, force_send=True)

                    if push_bool:
                        member_message_title = u"RPN Member Account Suspended"
                        member_message_body = (
                                                  u"Hello %s! We are sorry to inform you that your RPN account has "
                                                  u"been suspended. Your canadian status was %s and the "
                                                  u"departure date was %s which is over-due, reason why your account "
                                                  u"was suspended."
                                              ) % (member.partner_id.name, member.status,
                                                   member.departure_date)
                        member.partner_id.generate_fcm_notification(message_title=member_message_title,
                                                                    message_body=member_message_body)
                        member._create_notification_log(member.partner_id.id, member_message_title,
                                                        member_message_body)

                if template_id2 and member.manager_id:
                    if mail_bool:
                        # Call send_mail with the correct parameters
                        template_id2.send_mail(member.id, force_send=True)

                    if push_bool:
                        manager_message_title = u"RPN Manager's Member Account SuspendedZZZ"
                        manager_message_body = (
                                                   u"Hello %s! This message is to inform you that your RPN associated member %s "
                                                   u"account has been suspended. Because his/her canadian status was %s"
                                                   u"and the departure date was %s which is over-due, reason why the "
                                                   u"account was suspended.") % (
                                                   member.manager_id.name, member.partner_id.name,
                                                   member.status, member.departure_date
                                               )
                        member.manager_id.generate_fcm_notification(message_title=manager_message_title,
                                                                    message_body=manager_message_body)
                        member._create_notification_log(member.manager_id.id, manager_message_title,
                                                        manager_message_body)

    def check_account_balance_and_send_email(self):
        # print("check_account_balance_and_send_email")
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        push_bool = resconfigvalues['rpn_base_send_push_notifications']
        mail_bool = resconfigvalues['rpn_base_send_emails']

        min_amount_in_account = resconfigvalues['rpn_base_config_min_amount_in_account']
        for member in self.search([]):
            # Check if partner_id exists
            if member.partner_id:
                if float(member.partner_id.account_balance) <= float(
                        min_amount_in_account) and member.partner_id.state == 'active':
                    # Update fields if condition is met
                    member.partner_id.state = 'deactivated'

                    template_id = self.env.ref('m1sh_rpn_associations.member_account_set_to_dormant')
                    template_id2 = self.env.ref('m1sh_rpn_associations.managers_member_account_set_to_dormant')
                    if template_id:
                        if mail_bool:
                            template_id.send_mail(member.id, force_send=True)
                        # Call send_mail with the correct parameters
                        if push_bool:
                            member_set_dormant_message_title = u"RPN Member Account Set to Dis-Activation"
                            member_set_dormant_message_body = (
                                                                  u"Hello %s! We are sorry to inform you that your RPN account"
                                                                  u" has been set to dormant state. Because you cross the "
                                                                  u"negative balance of %s%s."
                                                                  u" Sign in to your RPN account re-activate your account.") % (
                                                                  member.partner_id.name, member.partner_id.account_balance,
                                                                  member.currency_id.name if member.currency_id else ''
                                                              )
                            member.partner_id.generate_fcm_notification(message_title=member_set_dormant_message_title,
                                                                        message_body=member_set_dormant_message_body)
                            member._create_notification_log(member.partner_id.id, member_set_dormant_message_title,
                                                            member_set_dormant_message_body)
                        print("dormant member", member.partner_id.name)

                    if template_id2 and member.manager_id:
                        if mail_bool:
                            # Call send_mail with the correct parameters
                            template_id2.send_mail(member.id, force_send=True)
                        if push_bool:
                            managers_member_set_dormant_message_title = u"RPN Manager's Member Account Set to Dis-Activation"
                            managers_member_set_dormant_message_body = (
                                                                           u"Hello %s! This message is to inform you that your  "
                                                                           u"RPN associated member %s account has been set to dormant state."
                                                                           u" Because it crossed the negative balance of  %s%s.") % (
                                                                           member.manager_id.name,
                                                                           member.partner_id.name,
                                                                           member.partner_id.account_balance,
                                                                           member.currency_id.name if member.currency_id else ''
                                                                       )
                            member.manager_id.generate_fcm_notification(
                                message_title=managers_member_set_dormant_message_title,
                                message_body=managers_member_set_dormant_message_body)
                            member._create_notification_log(member.manager_id.id,
                                                            managers_member_set_dormant_message_title,
                                                            managers_member_set_dormant_message_body)
                        print("dormant member", member.partner_id.name)

                if member.partner_id.account_balance < -1 and member.partner_id.state == 'active':
                    # Check if the template is found
                    account_balance_reminder_template_id = self.env.ref(
                        'm1sh_rpn_associations.member_negative_account_reminder')
                    account_balance_reminder_template_id2 = self.env.ref(
                        'm1sh_rpn_associations.mangers_member_negative_account_reminder')

                    if account_balance_reminder_template_id:
                        if mail_bool:
                            # Call send_mail with the correct parameters
                            account_balance_reminder_template_id.send_mail(member.id, force_send=True)

                        if push_bool:
                            member_account_balance_reminder_message_title = u"RPN Negative Account Balance Reminder"
                            member_account_balance_reminder_message_body = (
                                                                               u"Hello %s! This message is to inform "
                                                                               u"you of your negative balance of %s "
                                                                               u"%s and if nothing is done, "
                                                                               u"your account will be de-activated."
                                                                               ) % (
                                                                               member.partner_id.name,
                                                                               member.partner_id.account_balance,
                                                                               member.currency_id.name if member.currency_id else ''
                                                                           )
                            member.partner_id.generate_fcm_notification(
                                message_title=member_account_balance_reminder_message_title,
                                message_body=member_account_balance_reminder_message_body)
                            member._create_notification_log(member.partner_id.id,
                                                            member_account_balance_reminder_message_title,
                                                            member_account_balance_reminder_message_body)

                    if account_balance_reminder_template_id2 and member.manager_id:
                        if mail_bool:
                            # Call send_mail with the correct parameters
                            account_balance_reminder_template_id2.send_mail(member.id, force_send=True)

                        if push_bool:
                            manager_account_balance_reminder_message_title = u"RPN Manager's Member Negative Account Balance Reminder"
                            manager_account_balance_reminder_message_body = (
                                                                                u"Hello %s! This message is to inform you of your RPN associated"
                                                                                u"member %s of a negative balance of %s %s and if nothing is done"
                                                                                u"his/her account will be de-activated.") % (
                                                                                member.manager_id.name,
                                                                                member.partner_id.name,
                                                                                member.partner_id.account_balance,
                                                                                member.currency_id.name if member.currency_id else ''
                                                                            )
                            member.manager_id.generate_fcm_notification(
                                message_title=manager_account_balance_reminder_message_title,
                                message_body=manager_account_balance_reminder_message_body)
                            member._create_notification_log(member.manager_id.id,
                                                            manager_account_balance_reminder_message_title,
                                                            manager_account_balance_reminder_message_body)

                    print("member set to Dormant", member.partner_id.name)
