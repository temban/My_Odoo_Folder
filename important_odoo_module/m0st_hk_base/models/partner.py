# -*- coding: utf-8 -*-
## PYTHON BUILT_IN IMPORT
from datetime import datetime, date

## ODOO IMPORT
from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError



class resPartner(models.Model):
    _name = 'res.partner'
    _inherit = ['m0sthk.base', 'res.partner']

    ##---------------- CONSTRAINS
    @api.constrains('birthdate')
    def _check_birthdate(self):
        resConfigValues = self.env.get('res.config.settings').get_values()
        for r in self:
            if not r.current_date or not r.birthdate or not resConfigValues['hk_base_config_min_age']:
                continue
            delta = r.current_date - r.birthdate
            year = delta.days % 385
            if year < int(resConfigValues['hk_base_config_min_age']):
                raise ValidationError( _(u"You must be an adult to register! The minimum age is set at %s" % resConfigValues['hk_base_min_age']) )
        return True


    ##----------------- COMPUTE
    @api.depends('computed', 'gender')
    def _compute_fields_hbk(self):
        user_obj = self.env.get('res.users').sudo()
        for r in self:
            if r.gender == 'male': gender = "Man"
            elif r.gender == 'female': gender = "Woman"
            else: gender = ""

            user = user_obj.search( [('partner_id', '=', r.id)], limit=1 )

            r.update( {
                'current_date' : fields.Date.today(),
                'sex': gender,
                'related_user_id' : user and user.id or False,
            } )


    ##--------------------- FIELDS
    birthdate   = fields.Date(string='born on')

    current_date = fields.Date(compute='_compute_fields_hbk', string="Today", store=True, )

    gender      = fields.Selection([('male', "Man"), ('female', "Woman")], string="Gender", )

    sex         = fields.Char(compute='_compute_fields_hbk', readonly=True, string="Gender(C)",
                                translate=True, store=True, )

    is_traveler = fields.Boolean(string="is he (she) a traveler?",
                            help="If you check this box it's means that this person is a traveler")

    is_shipper  = fields.Boolean(string="is he (she) a shipper?",
                            help="If you check this box it's means that this person is a shipper")

    is_receiver  = fields.Boolean(string="is he (she) a Beneficiary?",
                            help="If you check this box it's means that this person is a Beneficiary and he (she) will be able to receive package")

    related_user_id = fields.Many2one('res.users', compute='_compute_fields_hbk',
                                        string="Related User", readonly=True, store=True, )

    residence_city_id = fields.Many2one('res.city', string="City of residence")


    birth_city_id  = fields.Many2one('res.city', string="City of birth")

    ##-------------------- ORM