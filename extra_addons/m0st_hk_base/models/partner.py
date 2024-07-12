# -*- coding: utf-8 -*-
## PYTHON BUILT_IN IMPORT
from datetime import datetime, date
from dateutil.relativedelta import relativedelta

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


    partner_attachment_ids = fields.One2many('ir.attachment', inverse_name='partner_id',
                                        string="Attachment", )

    ##-------------------- ORM


class hkBase(models.Model):
    _name = "m0sthk.base"
    _inherit = 'm0sthk.base'


    @api.model
    def send_chat_message(self):
        return True ##@Todo implement features for sending chat message

    @api.model
    def send_email_message(self):
        return True ##@Todo implement features for sending chat message


    @api.model
    def computed_partner_attachment(self):
        attachs = self.get_model_pool('res.partner').search([]).mapped('partner_attachment_ids').\
            filtered( lambda ab: ab.attach_custom_type in ['cni', 'passport'])

        attachs.in_update()  #on Update

        resconfigvalues = self.env.get('res.config.settings').get_values()
        alert_validity = resconfigvalues['hk_base_config_alert_validity']
        validity_delay = int(resconfigvalues['hk_base_config_validity_delay'])

        for att in attachs:
            if not att.validity:
                if alert_validity == 'chat' :
                    self.send_chat_message()
                elif alert_validity == 'mail' :
                    self.send_email_message()

                ## Delete all expired attachments
                if att.conformity: att.toggle_conformity()
                att.unlink()


            if not att.conformity:
                if alert_validity == 'chat' :
                    self.send_chat_message()
                elif alert_validity == 'mail' :
                    self.send_email_message()



            start = fields.Date.from_string( fields.Date.today() )
            end   = (start + relativedelta(months=validity_delay) - relativedelta(days=1) )
            date_stop = end.strftime('%Y-%m-%d')

            if date_stop > att.date_end:
                if alert_validity == 'chat' :
                    self.send_chat_message()
                elif alert_validity == 'mail' :
                    self.send_email_message()

        return True


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
        if count >= 1 and count < 10: return "0000%s" % count
        elif count >= 10 and count < 100: return "000%s" % count
        elif count >= 100 and count < 1000: return "00%s" % count
        elif count >= 1000 and count < 10000: return "0%s" % count
        elif count >= 10000 and count < 100000: return "%s" % count


    @api.model
    def _get_num_code_6(self, count):
        if count >= 1 and count < 10: return "00000%s" % count
        elif count >= 10 and count < 100: return "0000%s" % count
        elif count >= 100 and count < 1000: return "000%s" % count
        elif count >= 1000 and count < 10000: return "00%s" % count
        elif count >= 10000 and count < 100000: return "0%s" % count
        elif count >= 100000 and count < 1000000: return "%s" % count

    @api.model
    def _get_num_code_7(self, count):
        if count >= 1 and count < 10: return "000000%s" % count
        elif count >= 10 and count < 100: return "00000%s" % count
        elif count >= 100 and count < 1000: return "0000%s" % count
        elif count >= 1000 and count < 10000: return "000%s" % count
        elif count >= 10000 and count < 100000: return "00%s" % count
        elif count >= 100000 and count < 1000000: return "0%s" % count
        elif count >= 1000000 and count < 10000000: return "%s" % count

    @api.model
    def _get_num_code_8(self, count):
        if count >= 1 and count < 10: return "0000000%s" % count
        elif count >= 10 and count < 100: return "000000%s" % count
        elif count >= 100 and count < 1000: return "00000%s" % count
        elif count >= 1000 and count < 10000: return "0000%s" % count
        elif count >= 10000 and count < 100000: return "000%s" % count
        elif count >= 100000 and count < 1000000: return "00%s" % count
        elif count >= 1000000 and count < 10000000: return "0%s" % count
        elif count >= 10000000 and count < 100000000: return "%s" % count

    @api.model
    def _get_num_code_9(self, count):
        if count >= 1 and count < 10: return "00000000%s" % count
        elif count >= 10 and count < 100: return "0000000%s" % count
        elif count >= 100 and count < 1000: return "000000%s" % count
        elif count >= 1000 and count < 10000: return "00000%s" % count
        elif count >= 10000 and count < 100000: return "0000%s" % count
        elif count >= 100000 and count < 1000000: return "000%s" % count
        elif count >= 1000000 and count < 10000000: return "00%s" % count
        elif count >= 10000000 and count < 100000000: return "0%s" % count
        elif count >= 100000000 and count < 1000000000: return "%s" % count

    @api.model
    def _get_num_code_10(self, count):
        if count >= 1 and count < 10: return "000000000%s" % count
        elif count >= 10 and count < 100: return "00000000%s" % count
        elif count >= 100 and count < 1000: return "0000000%s" % count
        elif count >= 1000 and count < 10000: return "000000%s" % count
        elif count >= 10000 and count < 100000: return "00000%s" % count
        elif count >= 100000 and count < 1000000: return "0000%s" % count
        elif count >= 1000000 and count < 10000000: return "000%s" % count
        elif count >= 10000000 and count < 100000000: return "00%s" % count
        elif count >= 100000000 and count < 1000000000: return "0%s" % count
        elif count >= 1000000000 and count < 10000000000: return "%s" % count
