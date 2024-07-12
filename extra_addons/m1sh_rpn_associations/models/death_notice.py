from odoo import models, fields, api
from datetime import datetime, date
from random import randint
import random
import string
import time
from odoo.exceptions import ValidationError


class hkBase(models.Model):
    _name = "m0shrpn.base"
    _inherit = 'm0shrpn.base'

    @api.model
    def _get_num_code(self, count, seq):
        if seq == 5: return self._get_num_code_5(count=count)
        if seq == 6: return self._get_num_code_6(count=count)
        if seq == 7: return self._get_num_code_7(count=count)
        if seq == 8: return self._get_num_code_8(count=count)
        if seq == 9: return self._get_num_code_9(count=count)
        if seq == 10: return self._get_num_code_10(count=count)

    @api.model
    def _get_num_code_5(self, count):
        if count >= 1 and count < 10:
            return "0000%s" % count
        elif count >= 10 and count < 100:
            return "000%s" % count
        elif count >= 100 and count < 1000:
            return "00%s" % count
        elif count >= 1000 and count < 10000:
            return "0%s" % count
        elif count >= 10000 and count < 100000:
            return "%s" % count

    @api.model
    def _get_num_code_6(self, count):
        if count >= 1 and count < 10:
            return "00000%s" % count
        elif count >= 10 and count < 100:
            return "0000%s" % count
        elif count >= 100 and count < 1000:
            return "000%s" % count
        elif count >= 1000 and count < 10000:
            return "00%s" % count
        elif count >= 10000 and count < 100000:
            return "0%s" % count
        elif count >= 100000 and count < 1000000:
            return "%s" % count

    @api.model
    def _get_num_code_7(self, count):
        if count >= 1 and count < 10:
            return "000000%s" % count
        elif count >= 10 and count < 100:
            return "00000%s" % count
        elif count >= 100 and count < 1000:
            return "0000%s" % count
        elif count >= 1000 and count < 10000:
            return "000%s" % count
        elif count >= 10000 and count < 100000:
            return "00%s" % count
        elif count >= 100000 and count < 1000000:
            return "0%s" % count
        elif count >= 1000000 and count < 10000000:
            return "%s" % count

    @api.model
    def _get_num_code_8(self, count):
        if count >= 1 and count < 10:
            return "0000000%s" % count
        elif count >= 10 and count < 100:
            return "000000%s" % count
        elif count >= 100 and count < 1000:
            return "00000%s" % count
        elif count >= 1000 and count < 10000:
            return "0000%s" % count
        elif count >= 10000 and count < 100000:
            return "000%s" % count
        elif count >= 100000 and count < 1000000:
            return "00%s" % count
        elif count >= 1000000 and count < 10000000:
            return "0%s" % count
        elif count >= 10000000 and count < 100000000:
            return "%s" % count

    @api.model
    def _get_num_code_9(self, count):
        if count >= 1 and count < 10:
            return "00000000%s" % count
        elif count >= 10 and count < 100:
            return "0000000%s" % count
        elif count >= 100 and count < 1000:
            return "000000%s" % count
        elif count >= 1000 and count < 10000:
            return "00000%s" % count
        elif count >= 10000 and count < 100000:
            return "0000%s" % count
        elif count >= 100000 and count < 1000000:
            return "000%s" % count
        elif count >= 1000000 and count < 10000000:
            return "00%s" % count
        elif count >= 10000000 and count < 100000000:
            return "0%s" % count
        elif count >= 100000000 and count < 1000000000:
            return "%s" % count

    @api.model
    def _get_num_code_10(self, count):
        if count >= 1 and count < 10:
            return "000000000%s" % count
        elif count >= 10 and count < 100:
            return "00000000%s" % count
        elif count >= 100 and count < 1000:
            return "0000000%s" % count
        elif count >= 1000 and count < 10000:
            return "000000%s" % count
        elif count >= 10000 and count < 100000:
            return "00000%s" % count
        elif count >= 100000 and count < 1000000:
            return "0000%s" % count
        elif count >= 1000000 and count < 10000000:
            return "000%s" % count
        elif count >= 10000000 and count < 100000000:
            return "00%s" % count
        elif count >= 100000000 and count < 1000000000:
            return "0%s" % count
        elif count >= 1000000000 and count < 10000000000:
            return "%s" % count


class DeathNoticeInitial(models.Model):
    _name = 'rpn.death.notice.initial'
    _inherit = ['m0shrpn.base']
    _description = 'Death Notice Initial Data'

    @api.model
    def _get_default_color(self):
        return randint(1, 11)

    @api.model
    def _get_default_partner(self):
        partner_obj = self.env.get('res.partner')
        return partner_obj.search([('related_user_id', '=', self.env.user.id)], limit=1)

    # member_id = fields.Many2one('rpn.association.member', string='Deceased Member', required=True)
    contributor_partner_id = fields.Many2one('res.partner', string='Contributors Member', default=_get_default_partner,
                                             required=True, readonly=True)
    member_id = fields.Many2one('res.partner', string='Deceased Member', readonly=True)

    move_id = fields.Many2one('account.move', string='Related Invoice', readonly=True)

    manager_name = fields.Char(string="Manager's Name", readonly=True)

    manager_id = fields.Many2one('association.manager', string='Manager', readonly=True)

    code = fields.Char(string="Code", readonly=True)
    date_of_death = fields.Date(string='Date of Death', readonly=True)
    cause_of_death = fields.Char(string='Cause of Death', readonly=True)
    description = fields.Text(string='Death Description', readonly=True)
    related_member = fields.Many2one('rpn.association.member', string='Related Member', readonly=True)
    color = fields.Integer(string='Color Index', default=_get_default_color)

    total_contribution = fields.Float(string='Total Contribution', readonly=True)

    contribution_per_member = fields.Float(string='My Personal Contribution', readonly=True)

    currency_id = fields.Many2one(
        'res.currency',
        string='Currency:',
        compute='_compute_currency',
        store=True  # Store the computed value in the database for real-time display
    )

    number_of_active_members = fields.Float(string='Number of Active Members', readonly=True)

    member_is = fields.Selection([
        ('internal', 'Internal'),
        ('external', 'External'),
    ], string='Member was?', readonly=True)

    @api.depends('contributor_partner_id', 'manager_name', 'manager_id', 'member_id')  # Adjust the dependency as per your logic
    def _compute_currency(self):
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        currency_id = resconfigvalues['rpn_base_config_currency_id']
        self.currency_id = currency_id

    def _create_notification_log(self, partner_id, message_title, message_body):
        self.env['rpn.notification.log'].sudo().create({
            'partner_id': partner_id,
            'message_title': message_title,
            'message_body': message_body,
            'is_seen': False,
            'disable': False,
        })

    @api.model
    def _send_dn_push(self, object):
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        push_bool = resconfigvalues['rpn_base_send_push_notifications']

        if push_bool:
            message_title = resconfigvalues['dn_debit_member_title']
            message_body = resconfigvalues['dn_debit_member_body'] % (
                object.total_contribution, object.currency_id.name, object.contribution_per_member, object.currency_id.name,
                object.contributor_partner_id.account_balance, object.currency_id.name, fields.Datetime.now())
            message_body += u" | RPN-DN ID:{%s}" % object.id
            object.contributor_partner_id.generate_fcm_notification(message_title=message_title, message_body=message_body)
            self._create_notification_log(object.contributor_partner_id.id, message_title, message_body)

    @api.model
    def create(self, vals):
        if 'no_recursive' in vals and vals['no_recursive']:
            vals.pop('no_recursive')

        death = super(DeathNoticeInitial, self).create(vals)
        self._send_dn_push(death)

        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        email_bool = resconfigvalues['rpn_base_send_emails']
        if email_bool:
            template_id = self.env.ref(
                'm1sh_rpn_associations.debite_member_account')
            template_id.sudo().send_mail(death.id, force_send=True)
            print('death.contributor_partner_id', death.id, death.contributor_partner_id.name,
                  death.contributor_partner_id.id)
        return death


class DeathNotice(models.Model):
    _name = 'rpn.death.notice'
    _inherit = 'm0shrpn.base'
    _description = 'Death Notice'

    @api.model
    def _get_default_death_code(self):
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        death_format_code = resconfigvalues['rpn_base_config_death_notice_code']
        format_code_length = int(resconfigvalues['rpn_base_config_format_code_length'])
        start = "%s-01-01" % time.strftime('%Y')
        end = "%s-12-31" % time.strftime('%Y')
        count = self.search_count([('date_of_death', '>=', start), ('date_of_death', '<=', end)]) + 1
        count = self._get_num_code(count=count, seq=format_code_length)

        if death_format_code == 'death_year_num':
            return u"DN/%s/%s" % (time.strftime('%Y'), count)
        elif death_format_code == 'death_num_year':
            return u"DN/%s/%s" % (count, time.strftime('%Y'))
        else:
            return u"%s/DN/%s" % (count, time.strftime('%Y'))

    @api.model
    def _get_local_currency(self):
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        currency_id = resconfigvalues['rpn_base_config_currency_id']
        return currency_id

    @api.model
    def _get_default_color(self):
        return randint(1, 11)

    @api.model
    def _get_default_partner(self):
        partner_obj = self.env.get('res.partner')
        return partner_obj.search([('related_user_id', '=', self.env.user.id)], limit=1)

    # member_id = fields.Many2one('rpn.association.member', string='Deceased Member', required=True)
    contributor_partner_id = fields.Many2one('res.partner', string='Contributors Member', default=_get_default_partner,
                                             required=True, readonly=True)
    member_id = fields.Many2one('res.partner', string='Deceased Member',
                                domain="[('is_member', '=', True),('state', '=', 'active')]")
    code = fields.Char(string="Code", required=True, default=_get_default_death_code, readonly=True)
    date_of_death = fields.Date(string='Date of Death', required=True)
    cause_of_death = fields.Char(string='Cause of Death', required=True)
    description = fields.Text(string='Death Description', required=True)
    manager_name = fields.Char(string="Manager's Name", compute='_compute_manager_id', store=True,
                               default=lambda self: self._get_default_manager_id(), readonly=True)
    manager_id = fields.Many2one('association.manager', string='Manager', compute='_compute_manager_id', store=True,
                                 default=lambda self: self._get_default_manager_id(), readonly=True)
    related_member = fields.Many2one('rpn.association.member', string='Related Member', readonly=True)

    color = fields.Integer(string='Color Index', default=_get_default_color)

    total_contribution = fields.Float(string='Total Contribution')

    contribution_per_member = fields.Float(string='Contribution per Member',
                                           compute='_compute_contribution_per_member', store=True,
                                           readonly=True)

    number_of_active_members = fields.Float(string='Number of Active Members',
                                            compute='_count_active_members', store=True,
                                            readonly=True)

    member_is = fields.Selection([
        ('internal', 'Internal'),
        ('external', 'External'),
    ], string='Member was?', default='internal', required=True)

    currency_id = fields.Many2one(
        'res.currency',
        string='Currency:',
        default=_get_local_currency,
        required=True, readonly=True
    )

    @api.depends('member_is')
    def _count_active_members(self):
        for record in self:
            members_is = record.member_is  # Access the 'member_is' field value

            if members_is == 'external':
                criteria = [('is_member', '=', True),('state', '=', 'active')]
                record.number_of_active_members = float(self.env['res.partner'].search_count(criteria))
                record.manager_name = f"External Member"
            elif members_is == 'internal':
                criteria = [('is_member', '=', True),('state', '=', 'active')]
                active_member_count = self.env['res.partner'].search_count(criteria)
                record.number_of_active_members = active_member_count - 1 if active_member_count > 0 else 0

    @api.constrains('total_contribution')
    def check_total_contribution(self):
        for record in self:
            if record.total_contribution <= 0:
                raise ValidationError("Total Contribution cannot be zero.")

    @api.depends('total_contribution', 'number_of_active_members')
    def _compute_contribution_per_member(self):
        # Retrieve the number of members meeting the specified criteria
        member_count = self.number_of_active_members

        for record in self:
            if member_count > 0:
                record.contribution_per_member = record.total_contribution / member_count
            elif member_count == 0:
                record.contribution_per_member = record.total_contribution / 1
            else:
                # Handle the case where no eligible members are found to avoid division by zero
                for record in self:
                    record.contribution_per_member = 0

    def _compute_code_group(self):
        for record in self:
            record.code_group = hash(record.code)

    @api.depends('member_id')
    def _compute_manager_id(self):
        for record in self:
            if record.member_id:
                # Assuming 'member_id' is a Many2one field pointing to 'res.partner'
                manager = self.env['association.manager'].search([('member_partner_id', '=', record.member_id.id)],
                                                                 limit=1)
                if manager:
                    record.manager_id = manager
                    record.manager_name = f"Manager {manager.partner_id.name}"
                else:
                    # Set a default value when no manager is found
                    record.manager_name = f"No Manager"
                    record.manager_id = self._get_default_manager_id()

    def _get_default_manager_id(self):
        # You can return a default value here, e.g., a string indicating no manager found
        return False

    def create_dn_for_all_members(self, death, vals):
        member_vals = vals.copy()
        eligible_partners = self.env['res.partner'].search(
            [('is_member', '=', True),('state', '=', 'active')])

        for member in eligible_partners:
            if member != death.member_id:  # Check if the member is not the deceased member
                member_vals['contributor_partner_id'] = member.id  # Set contributor_partner_id
                member_vals['code'] = death.code
                member_vals['manager_id'] = death.manager_id.id
                member_vals['manager_name'] = death.manager_name
                member_vals['number_of_active_members'] = death.number_of_active_members
                member_vals['contribution_per_member'] = death.contribution_per_member
                member_vals['no_recursive'] = True  # Add flag to prevent recursion
                self.env['rpn.death.notice.initial'].create(member_vals)
                new_balance = member.account_balance - death.contribution_per_member
                # Update the account_balance field for the partner
                member.write({'account_balance': new_balance})

    @api.model
    def create(self, vals):

        if 'no_recursive' in vals and vals['no_recursive']:
            vals.pop('no_recursive')
            return super(DeathNotice, self).create(vals)

        death = super(DeathNotice, self).create(vals)

        if death:
            self.create_dn_for_all_members(death, vals)

            # Set the is_member field to True in the related res.partner record
        if death.member_id:
            death.member_id.write({'state': 'is_death', 'member_diseased': True})

        return death

    def write(self, vals):
        if 'total_contribution' in vals:
            raise ValidationError(
                "You cannot update the Total Contribution directly because members has already been debited for their from their respective contributions.")
        elif 'member_is' in vals:
            raise ValidationError("You cannot update this fields, contributions has already been debited.")

        res = super(DeathNotice, self).write(vals)

        if vals:
            for death_record in self:
                # Update the related records in rpn.death.notice.initial
                initial_records = self.env['rpn.death.notice.initial'].search([
                    ('member_id', '=', death_record.member_id.id),
                    ('code', '=', death_record.code)
                ])
                initial_records.write(vals)
        return res

    # def write(self, vals):
    #     res = super(DeathNotice, self).write(vals)
    #     if vals:
    #         for death_record in self:
    #             # Update the related records in rpn.death.notice.initial
    #             initial_records = self.env['rpn.death.notice.initial'].search([
    #                 ('member_id', '=', death_record.member_id.id),
    #                 ('code', '=', death_record.code)
    #             ])
    #             initial_records.write(vals)
    #
    #             if 'total_contribution' in vals:
    #                 new_total_contribution = vals.get('total_contribution')
    #                 if new_total_contribution:
    #                     member_count = death_record.number_of_active_members
    #                     if member_count > 0:
    #                         contribution_per_member = new_total_contribution / member_count
    #                     else:
    #                         contribution_per_member = 0
    #
    #                     death_record.write({'contribution_per_member': contribution_per_member})
    #
    #                     # Update contribution_per_member in rpn.death.notice.initial
    #                     for initial_record in initial_records:
    #                         initial_record.write({'contribution_per_member': contribution_per_member})
    #     return res
