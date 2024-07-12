# -*- coding: utf-8 -*-
## PYTHON BUILT_IN IMPORT
from datetime import datetime, date

## ODOO IMPORT
from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError


# class EmergencyContact(models.Model):
#     _name = 'emergency.contact'
#     _description = 'Emergency Contact'
#
#     name = fields.Char(string='Full Name')
#     phone = fields.Char(string='Phone Number')
#     email = fields.Char(string='Contact Email')
#     address = fields.Many2one('res.city', string="City of residence")
#     partner_ids = fields.Many2many('res.partner', string='Related Partners')


class resPartner(models.Model):
    _name = 'res.partner'
    _inherit = ['res.partner', 'm0shrpn.base']

    ##--------------------- FIELDS
    # emergency_contact_ids = fields.Many2many('emergency.contact', string='Emergency Contacts')
    partner_attachment_ids = fields.One2many('ir.attachment', inverse_name='partner_id',
                                             string="Attachment", )

    birthdate = fields.Date(string='born on')

    current_date = fields.Date(compute='_compute_fields_hbk', string="Today", store=True, )

    gender = fields.Selection([('male', "Male"), ('female', "Female")], string="Gender", )

    sex = fields.Char(compute='_compute_fields_hbk', readonly=True, string="Gender(C)",
                      translate=True, store=True, )

    is_member = fields.Boolean(string="Member of RPN?",
                               help="If you check this box it's means that this person is a member", readonly=True,
                               default=False)

    is_manager = fields.Boolean(string="Is a Manager?",
                                help="If you check this box it's means that this person is a manager of other member(s) of RPN",
                                readonly=True, default=False)

    member_diseased = fields.Boolean(string="Is death?", default=False,  # Fixed 'default'
                                     help="Determines if a member has passed away.",  # Fixed 'requirements'
                                     readonly=True)

    related_user_id = fields.Many2one('res.users', compute='_compute_fields_hbk',
                                      string="Related User", readonly=True, store=True, )

    residence_city_id = fields.Many2one('res.city', string="City of residence")

    birth_city_id = fields.Many2one('res.city', string="City of birth")

    is_internal_user = fields.Boolean(string="Is Internal User", compute='_compute_is_internal_user', store=True)

    @api.depends('related_user_id')
    def _compute_is_internal_user(self):
        for record in self:
            if record.related_user_id:
                # Check the user's groups to determine if they are an internal user
                is_internal_user = record.sudo().related_user_id.has_group('base.group_user')
                record.is_internal_user = is_internal_user
            else:
                record.is_internal_user = False

    ##----------------- COMPUTE
    @api.depends('computed', 'gender')
    @api.depends('computed', 'gender')
    def _compute_fields_hbk(self):
        user_obj = self.env.get('res.users').sudo()
        for r in self:
            if r.gender == 'male':
                gender = "Male"
            elif r.gender == 'female':
                gender = "Female"
            else:
                gender = ""

            user = user_obj.search([('partner_id', '=', r.id)], limit=1)

            r.update({
                'current_date': fields.Date.today(),
                'sex': gender,
                'related_user_id': user and user.id or False,
            })
