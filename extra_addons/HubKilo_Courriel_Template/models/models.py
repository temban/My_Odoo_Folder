from odoo import models, fields, api


class ResUsers(models.Model):
    _inherit = 'res.users'


class MailTemplate(models.Model):
    _inherit = 'mail.template'


class AccountMove(models.Model):
    _inherit = "account.move"


class AccountPayment(models.Model):
    _inherit = "account.payment"
