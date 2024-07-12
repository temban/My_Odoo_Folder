# -*- coding: utf-8 -*-

from odoo import models, fields, api


class WillOnHairProduct(models.Model):
    _inherit = "appointment.product"


class WillOnHairBusinessCore(models.Model):
    _inherit = "business.appointment.core"


class WillOnHairBusinessAppointment(models.Model):
    _inherit = "business.appointment"


class ResPartner(models.Model):
    _inherit = 'res.partner'


class ResUsers(models.Model):
    _inherit = 'res.users'
