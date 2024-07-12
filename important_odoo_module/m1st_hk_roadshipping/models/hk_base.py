# -*- coding: utf-8 -*-
## PYTHON BUILT_IN IMPORT
from datetime import datetime, date
import time
from dateutil.relativedelta import relativedelta

## ODOO IMPORT
from odoo import models, fields, api, _
#from odoo.exceptions import UserError, ValidationError



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
