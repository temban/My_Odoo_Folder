# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models, _
# from odoo.tools.safe_eval import safe_eval
from odoo.exceptions import UserError

DICT_DEFAULT_VALUES = {
    'rpn_base_config_min_account_balance': 25.0,
    'rpn_base_config_min_amount_in_account': -500,
    'rpn_base_config_re_activation_fee': 20.0,
    'rpn_base_config_min_membership_amount': 20.0,
    'rpn_base_config_percentage': 7.0,
    'rpn_base_config_death_notice_code': 'death_year_num',
    'rpn_base_config_format_code_length': '6',
    'rpn_base_config_payment_method': 'auto',
    'rpn_base_send_emails': False,
    'rpn_base_send_push_notifications': False
}


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    rpn_base_config_min_account_balance = fields.Monetary(string="Minimum account recharge", digits=(16, 2),
                                                          currency_field='rpn_base_config_currency_id',
                                                          default=25.0,
                                                          help="Set the minimum amount that can be recharged in an account.")

    rpn_base_config_min_amount_in_account = fields.Monetary(string="Minimum amount in account", digits=(16, 2),
                                                            currency_field='rpn_base_config_currency_id',
                                                            default=-5000.0,
                                                            help="Set the minimum amount in account that when cross member is dis-activated.")

    rpn_base_config_re_activation_fee = fields.Monetary(string="Amount for Re-activating account", digits=(16, 2),
                                                        currency_field='rpn_base_config_currency_id',
                                                        default=20.0,
                                                        help="Set the amount for re-activating an account when the member is dis-activated.")

    rpn_base_config_min_membership_amount = fields.Monetary(string='Membership fee',
                                                            digits=(16, 2),
                                                            currency_field='rpn_base_config_currency_id', default=25.0,
                                                            help="Set the amount that can be paid to become a member.")

    rpn_base_config_percentage = fields.Float(string='Administrative fee in Percentage(%)', digits=(2, 2),
                                             help="The percentage to set For administrative fee deduction")

    rpn_base_config_currency_id = fields.Many2one(comodel_name='res.currency', string="Default currency",
                                                  help="This is the local currency for financial transactions",
                                                  default=lambda self: self.env.user.company_id.currency_id.id)

    rpn_base_config_death_notice_code = fields.Selection([('death_year_num', "DN/YEAR/NUM"),
                                                          ('death_num_year', "DN/NUM/YEAR"),
                                                          ('num_death_year', "NUM/DN/YEAR")],
                                                         string="Death notice format code", default='death_year_num',
                                                         help="Sets the code format for a death notice.")

    rpn_base_config_format_code_length = fields.Selection([("5", "5"), ('6', "6"), ('7', "7"),
                                                           ('8', "8"), ('9', "9"), ('10', "10")],
                                                          string="Format code length", default='6',
                                                          help="This is the length of a death notice code")

    rpn_base_config_payment_method = fields.Selection([('auto', "Automatic"), ('manual', "Manual")],
                                                      string="Payment Method", default='auto',
                                                      help="The default method for payment\
                                                 \n- Automatic : The system will automatically try to execute payment\
                                                 \n- Manual : The system will generate an invoice will be awaiting a validation performed be a RPN staff.")

    rpn_base_send_emails = fields.Boolean(string="Send Emails", default=False, help="Activate sending emails")
    rpn_base_send_push_notifications = fields.Boolean(string="Send Push Notifications", default=False,
                                                      help="Activate sending push notifications")

    authorization_key = fields.Char('Authorization Key', config_parameter='m0sh_rpn_base.authorization_key')

    auth_api_key = fields.Char('API Key', config_parameter='m0sh_rpn_base.auth_api_key')

    ##------------------- FUNCTIONS
    def set_values(self):
        super(ResConfigSettings, self).set_values()

        irConfig = self.env['ir.config_parameter'].sudo()

        irConfig.set_param('m0sh_rpn_base.authorization_key', self.authorization_key)
        irConfig.set_param('m0sh_rpn_base.auth_api_key', self.auth_api_key)

        irConfig.set_param('m0sh_rpn_base.rpn_base_config_min_account_balance',
                           self.rpn_base_config_min_account_balance)
        irConfig.set_param('m0sh_rpn_base.rpn_base_config_min_amount_in_account',
                           self.rpn_base_config_min_amount_in_account)
        irConfig.set_param('m0sh_rpn_base.rpn_base_config_re_activation_fee',
                           self.rpn_base_config_re_activation_fee)
        irConfig.set_param('m0sh_rpn_base.rpn_base_config_min_membership_amount',
                           self.rpn_base_config_min_membership_amount)
        irConfig.set_param('m0sh_rpn_base.rpn_base_config_percentage',
                           self.rpn_base_config_percentage)
        irConfig.set_param('m0sh_rpn_base.rpn_base_config_death_notice_code', self.rpn_base_config_death_notice_code)
        irConfig.set_param('m0sh_rpn_base.rpn_base_config_format_code_length', self.rpn_base_config_format_code_length)
        irConfig.set_param('m0sh_rpn_base.rpn_base_config_payment_method', self.rpn_base_config_payment_method)
        irConfig.set_param('m0sh_rpn_base.rpn_base_send_emails', self.rpn_base_send_emails)
        irConfig.set_param('m0sh_rpn_base.rpn_base_send_push_notifications', self.rpn_base_send_push_notifications)

    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        irConfig = self.env['ir.config_parameter'].sudo()

        res.update({
            'authorization_key': irConfig.get_param('m0sh_rpn_base.authorization_key'),
            'auth_api_key': irConfig.get_param('m0sh_rpn_base.auth_api_key')
        })
        company_def = self.env.get('res.company').search([('name', '=', 'RPN Association')], limit=1)

        rpn_base_config_min_account_balance = irConfig.get_param('m0sh_rpn_base.rpn_base_config_min_account_balance') or \
                                              DICT_DEFAULT_VALUES['rpn_base_config_min_account_balance']

        rpn_base_config_min_amount_in_account = irConfig.get_param(
            'm0sh_rpn_base.rpn_base_config_min_amount_in_account') or \
                                                DICT_DEFAULT_VALUES['rpn_base_config_min_amount_in_account']

        rpn_base_config_re_activation_fee = irConfig.get_param(
            'm0sh_rpn_base.rpn_base_config_re_activation_fee') or \
                                            DICT_DEFAULT_VALUES['rpn_base_config_re_activation_fee']

        rpn_base_config_min_membership_amount = irConfig.get_param(
            'm0sh_rpn_base.rpn_base_config_min_membership_amount') or DICT_DEFAULT_VALUES[
                                                    'rpn_base_config_min_membership_amount']

        rpn_base_config_percentage = irConfig.get_param(
            'm0sh_rpn_base.rpn_base_config_percentage') or DICT_DEFAULT_VALUES[
                                         'rpn_base_config_percentage']

        rpn_base_config_currency_id = company_def.currency_id.id or self.env.user.company_id.currency_id.id

        rpn_base_config_death_notice_code = irConfig.get_param('m0sh_rpn_base.rpn_base_config_death_notice_code') or \
                                            DICT_DEFAULT_VALUES['rpn_base_config_death_notice_code']

        rpn_base_config_format_code_length = irConfig.get_param('m0sh_rpn_base.rpn_base_config_format_code_length') or \
                                             DICT_DEFAULT_VALUES['rpn_base_config_format_code_length']

        rpn_base_config_payment_method = irConfig.get_param('m0sh_rpn_base.rpn_base_config_payment_method') or \
                                         DICT_DEFAULT_VALUES['rpn_base_config_payment_method']

        rpn_base_send_emails = irConfig.get_param('m0sh_rpn_base.rpn_base_send_emails') or DICT_DEFAULT_VALUES[
            'rpn_base_send_emails']

        rpn_base_send_push_notifications = irConfig.get_param('m0sh_rpn_base.rpn_base_send_push_notifications') or \
                                           DICT_DEFAULT_VALUES['rpn_base_send_push_notifications']

        res.update({'rpn_base_config_min_account_balance': rpn_base_config_min_account_balance,
                    'rpn_base_config_min_amount_in_account': rpn_base_config_min_amount_in_account,
                    'rpn_base_config_re_activation_fee': rpn_base_config_re_activation_fee,
                    'rpn_base_config_min_membership_amount': rpn_base_config_min_membership_amount,
                    'rpn_base_config_percentage': rpn_base_config_percentage,
                    'rpn_base_config_currency_id': rpn_base_config_currency_id,
                    'rpn_base_config_death_notice_code': rpn_base_config_death_notice_code,
                    'rpn_base_config_format_code_length': rpn_base_config_format_code_length,
                    'rpn_base_config_payment_method': rpn_base_config_payment_method,
                    'rpn_base_send_emails': rpn_base_send_emails,
                    'rpn_base_send_push_notifications': rpn_base_send_push_notifications})

        return res
