import subprocess
from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError


class NotificationLog(models.Model):
    _name = "rpn.notification.log"
    _description = "RPN Notification Log"

    partner_id = fields.Many2one('res.partner', string='Concerned Member',
                                 domain="[('is_member', '=', True), ('state', '!=', 'is_death')]")
    message_title = fields.Char(string='Message Title')
    message_body = fields.Text(string='Message Body')
    is_seen = fields.Boolean(string='Seen', default=False)
    disable = fields.Boolean(string='Disabled', default=False)
    date = fields.Datetime(string='Date', default=lambda self: fields.Datetime.now(), readonly=True)


class memberPartner(models.Model):
    _name = 'res.partner'
    _inherit = ['res.partner', 'm0shrpn.base']

    @api.model
    def _get_default_payment_term(self):
        return self.env['account.payment.term'].search([('name', '=', 'Immediate Payment')], limit=1)

    def action_open_member_form(self):
        return {
            'name': 'Become a Member',
            'type': 'ir.actions.act_window',
            'res_model': 'rpn.association.member',
            'view_mode': 'form',
            'view_id': self.env.ref('m1sh_rpn_associations.member_form_view').id,
            'target': 'new',
            'context': {'default_partner_id': self.id},
        }

    def open_first_account_recharge_wizard(self):
        return {
            'name': 'First Recharge',
            'type': 'ir.actions.act_window',
            'res_model': 'account.recharge',
            'view_mode': 'form',
            'view_id': self.env.ref('m1sh_rpn_associations.view_first_other_account_recharge_form').id,
            'view_type': 'form',
            'context': {
                'default_partner_id': self.id,
                # Add any other default values for the first wizard
            },
            'target': 'new',
        }

    def open_second_account_recharge_wizard(self):
        return {
            'name': 'Account Recharge',
            'type': 'ir.actions.act_window',
            'res_model': 'account.recharge',
            'view_mode': 'form',
            'view_id': self.env.ref('m1sh_rpn_associations.view_other_account_recharge_form').id,
            'view_type': 'form',
            'context': {
                'default_partner_id': self.id,
                # Add any other default values for the second wizard
            },
            'target': 'new',
        }

    def open_account_re_activation_recharge_wizard(self):
        return {
            'name': 'Account Re-activation',
            'type': 'ir.actions.act_window',
            'res_model': 'account.recharge',
            'view_mode': 'form',
            'view_id': self.env.ref('m1sh_rpn_associations.view_re_activation_feet_recharge_form').id,
            'view_type': 'form',
            'context': {
                'default_partner_id': self.id,
                # Add any other default values for the second wizard
            },
            'target': 'new',
        }

    ##--------------------- FIELDS
    member_id = fields.One2many('rpn.association.member',
                                inverse_name='partner_id', string="Member")

    manager_id = fields.One2many('association.manager',
                                 inverse_name='partner_id', string="Manager")

    partner_attachment_ids = fields.One2many('ir.attachment', inverse_name='partner_id',
                                             string="Attachment", )

    partner_notif = fields.One2many('rpn.notification.log', inverse_name='partner_id', string='RPN Sent Notifications',
                                    readonly=True)

    accounts = fields.One2many('account.recharge',
                               inverse_name='partner_id', string="Account info")

    move_id = fields.One2many('account.move',
                              inverse_name='partner_id', string="Account info")

    death_notice_ids = fields.One2many('rpn.death.notice.initial', 'contributor_partner_id', string='Death Notices')

    property_payment_term_id = fields.Many2one('account.payment.term', company_dependent=True,
                                               string='Customer Payment Terms',
                                               default=_get_default_payment_term,
                                               domain="[('company_id', 'in', [current_company_id, False])]",
                                               help="This payment term will be used instead of the default one for sales orders and customer invoices")
    account_balance = fields.Monetary(string='Account Balance', compute='_compute_account_balance', store=True,
                                      readonly=True)

    state = fields.Selection([
        ('pending', 'Pending / Draft'),
        ('active', 'Active'),
        ('suspended', 'Suspended'),
        ('deactivated', 'De-activated'),
        ('is_death', 'Deceased'),
    ], string='Status', default='pending')

    def _create_notification_log(self, partner_id, message_title, message_body):
        self.env['rpn.notification.log'].sudo().create({
            'partner_id': partner_id,
            'message_title': message_title,
            'message_body': message_body,
            'is_seen': False,
            'disable': False,
        })

    def set_to_suspend(self):
        for r in self:
            if r.state not in ['active']:
                text = u"Workflow error : Only members with active status can be set to suspended status"
                raise ValidationError(_(text))
        self.write({'state': 'suspended'})
        template_id = self.env.ref('m1sh_rpn_associations.member_account_set_to_suspended')
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        push_bool = resconfigvalues['rpn_base_send_push_notifications']
        mail_bool = resconfigvalues['rpn_base_send_emails']
        if template_id and mail_bool:
            # Call send_mail with the correct parameters
            template_id.send_mail(self.id, force_send=True)
        if push_bool:
            member_message_title = u"RPN Member Account Suspended"
            member_message_body = (u"Hello %s! We are sorry to inform you that your RPN account was suspended.") % (
                self.name)
            self.generate_fcm_notification(message_title=member_message_title,
                                           message_body=member_message_body)
            self._create_notification_log(self.id, member_message_title,
                                          member_message_body)
        print("dormant member", self.name)

    def re_open_account(self):
        for r in self:
            if r.state not in ['suspended']:
                text = u"Workflow error : Only members with suspended status can be set to active status"
                raise ValidationError(_(text))
        self.write({'state': 'active'})
        template_id = self.env.ref('m1sh_rpn_associations.member_account_set_to_active')
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        push_bool = resconfigvalues['rpn_base_send_push_notifications']
        mail_bool = resconfigvalues['rpn_base_send_emails']
        if template_id and mail_bool:
            # Call send_mail with the correct parameters
            template_id.send_mail(self.id, force_send=True)
        if push_bool:
            member_message_title = u"RPN Member Account Re-activation"
            member_message_body = (u"Hello %s! your RPN account was re-activated.") % (self.name)
            self.generate_fcm_notification(message_title=member_message_title,
                                           message_body=member_message_body)
            self._create_notification_log(self.id, member_message_title,
                                          member_message_body)
        print("dormant member", self.name)

    def set_to_active(self):
        self.write({'state': 'active'})
        # template_id = self.env.ref('m1sh_rpn_associations.member_account_set_to_active')
        # resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        # push_bool = resconfigvalues['rpn_base_send_push_notifications']
        # mail_bool = resconfigvalues['rpn_base_send_emails']
        # if template_id and mail_bool:
        #     # Call send_mail with the correct parameters
        #     template_id.send_mail(self.id, force_send=True)
        # if push_bool:
        #     member_message_title = u"RPN Member Account Re-activation"
        #     member_message_body = (u"Hello %s! your RPN account was re-activated.") % (self.name)
        #     self.generate_fcm_notification(message_title=member_message_title,
        #                                    message_body=member_message_body)
        #     self._create_notification_log(self.id, member_message_title,
        #                                   member_message_body)
        # print("dormant member", self.name)

    @api.depends('accounts.move_id.payment_state', 'accounts.move_id.amount_total', 'accounts.amount',
                 'account_balance')
    def _compute_account_balance(self):
        resconfigvalues = self.env['res.config.settings'].get_values()
        email_bool = resconfigvalues.get('rpn_base_send_emails')
        for partner in self:
            paid_moves = partner.accounts.filtered(
                lambda
                    move: move.move_id.payment_state == 'paid' and move.move_id.added_to_account_balance == 'not_added' and move.move_id.contribution_type != ''
            )
            partner.account_balance += sum(paid_moves.mapped('amount'))

            if paid_moves:
                first_recharge_invoices = paid_moves.move_id.filtered(
                    lambda
                        move: move.contribution_type == 'first_recharge' and move.payment_state == 'paid' and move.added_to_account_balance == 'not_added'
                )
                if first_recharge_invoices:
                    self._send_emails(first_recharge_invoices, email_bool, 'm1sh_rpn_associations.activated_membership',
                                      True, False)
                    self._send_staff_email(first_recharge_invoices, email_bool)
                    paid_moves.move_id.write({'added_to_account_balance': 'added'})
                    partner.state = 'active'

                other_recharge_invoices = paid_moves.move_id.filtered(
                    lambda
                        move: move.contribution_type == 'other_recharge' and move.payment_state == 'paid' and move.added_to_account_balance == 'not_added'
                )
                if other_recharge_invoices:
                    self._send_emails(other_recharge_invoices, email_bool,
                                      'm1sh_rpn_associations.confirm_paid_recharge', False, True)
                    paid_moves.move_id.write({'added_to_account_balance': 'added'})

                re_activation_invoices = paid_moves.move_id.filtered(
                    lambda
                        move: move.contribution_type == 're_activation' and move.payment_state == 'paid' and move.added_to_account_balance == 'not_added'
                )
                if re_activation_invoices:
                    self._send_emails(re_activation_invoices, email_bool,
                                      'm1sh_rpn_associations.re_activation_recharge', False, True)
                    paid_moves.move_id.write({'added_to_account_balance': 'added'})
                    partner.state = 'active'

    @api.model
    def _send_staff_email(self, invoices, email_bool):
        member = invoices.partner_id.name
        if invoices:
            internal_user_members = self.env['res.partner'].search(
                [('is_internal_user', '=', True), ('is_member', '=', True)])
            for user in internal_user_members:
                self._send_staff_push(member, user)
                if email_bool:
                    self.env.ref('m1sh_rpn_associations.activation_email_to_staff').sudo().send_mail(user.id,
                                                                                                     force_send=True)
                    print('Staff email sent to:', user.name)

    @api.model
    def _send_staff_push(self, member, object):
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        push_bool = resconfigvalues['rpn_base_send_push_notifications']

        if push_bool:
            message_title = resconfigvalues['new_member_staff_notif_title']
            message_body = resconfigvalues['new_member_staff_notif_body'] % (
                member, fields.Datetime.now())
            message_body += u" | RPN-STAFF ID:{%s}" % object.id
            object.generate_fcm_notification(message_title=message_title, message_body=message_body)
            self._create_notification_log(object.id, message_title, message_body)

    @api.model
    def _send_emails(self, invoices, email_bool, template_ref, first, other):
        if invoices:
            template_id = self.env.ref(template_ref)
            print(template_ref, invoices)
            for invoice in invoices:
                self._send_member_push(invoice, first, other)
                if email_bool:
                    template_id.sudo().send_mail(invoice.id, force_send=True)
                    print(f'Paid {invoice.contribution_type} recharge invoice: {invoice.name}')

    @api.model
    def _send_member_push(self, object, first, other):
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        push_bool = resconfigvalues['rpn_base_send_push_notifications']
        if push_bool:
            if first:
                message_title = resconfigvalues['member_activation_notif_title']
                message_body = resconfigvalues['member_activation_notif_body'] % (
                    object.recharge.amount, object.currency_id.name, object.amount_total, object.currency_id.full_name,
                    fields.Datetime.now())
                message_body += u" | RPN-RC ID:{%s}" % object.id
                object.partner_id.generate_fcm_notification(message_title=message_title, message_body=message_body)
                self._create_notification_log(object.partner_id.id, message_title, message_body)
            elif other:
                message_title = resconfigvalues['confirm_payment_recharge_title']
                message_body = resconfigvalues['confirm_payment_recharge_body'] % (
                    object.recharge.amount, object.currency_id.name, object.partner_id.account_balance,
                    object.currency_id.name,
                    fields.Datetime.now())
                message_body += u" | RPN-RC ID:{%s}" % object.id
                object.partner_id.generate_fcm_notification(message_title=message_title, message_body=message_body)
                self._create_notification_log(object.partner_id.id, message_title, message_body)

    # def odoo_reinitialise(self):
    #     command = "sudo /etc/init.d/odoo restart"
    #     try:
    #         subprocess.run(command, shell=True, check=True, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE,
    #                        stderr=subprocess.PIPE)
    #     except subprocess.CalledProcessError as e:
    #         print("Error:", e)
