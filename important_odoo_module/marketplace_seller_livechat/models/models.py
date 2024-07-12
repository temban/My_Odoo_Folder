# -*- coding: utf-8 -*-
#################################################################################
# Author      : Webkul Software Pvt. Ltd. (<https://webkul.com/>)
# Copyright(c): 2015-Present Webkul Software Pvt. Ltd.
# License URL : https://store.webkul.com/license.html/
# All Rights Reserved.
#
#
#
# This program is copyright property of the author mentioned above.
# You can`t redistribute it and/or modify it.
#
#
# You should have received a copy of the License along with this program.
# If not, see <https://store.webkul.com/license.html/>
#################################################################################

from odoo import models, fields, api, _
import datetime, pytz
from odoo.tools import config, DEFAULT_SERVER_DATE_FORMAT, DEFAULT_SERVER_DATETIME_FORMAT

class Partner(models.Model):
    _inherit = 'res.partner'

    def _compute_im_status(self):
        super(Partner, self)._compute_im_status()
        for partner in self:
            if partner.seller:
                partner.im_status = 'online'

class ResUsers(models.Model):
    _inherit = "res.users"

    def _compute_im_status(self):
        super(ResUsers, self)._compute_im_status()
        for user in self:
            if user.check_user_is_seller():
                user.im_status = 'online'

class MailChannel(models.Model):
    _inherit="mail.channel"

    marketplace_seller_id = fields.Many2one("res.partner",string="Marketplace Seller Id")
    portal_user_id = fields.Many2one("res.users",string="Website User")

class MailMessage(models.Model):
    _inherit = "mail.message"

    def get_usr_chattime(self,date):
        user_tz = pytz.timezone(self.env.user.tz or 'UTC')
        message_time = pytz.utc.localize(date).strftime(DEFAULT_SERVER_DATETIME_FORMAT)
        return message_time

