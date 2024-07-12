# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models, _
#from odoo.tools.safe_eval import safe_eval
from odoo.exceptions import UserError

DICT_DEFAULT_VALUES = {
'hk_base_config_min_age' : 16,
'hk_base_config_amount_type' : 'percent',
'hk_base_config_amount_fixed' : 10.0,
'hk_base_config_percentage' : 10.0,
'hk_base_config_validity_delay' : 3,
'hk_base_config_alert_validity' : 'mail',
'hk_base_config_ship_format_code' : 'ship_year_num',
'hk_base_config_travel_format_code' : 'travel_year_num',
'hk_base_config_auto_validate_travel' : False,
'hk_base_config_format_code_length' : '6',
'hk_base_config_payment_method' : 'auto',
'hk_base_config_include_luggage_price' : False,

}

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'


    hk_base_config_min_age = fields.Integer(string="Minimal age", default=16,
                            help="Specifies the minimum age to register as a shipper on the platform")

    hk_base_config_amount_type = fields.Selection([('fixed', "Fixed amount"),
                                            ('percent', "Percentage")],
                                            string="Type of billing ", default='percent',
                                            help="This field allows you to manage the type of invoicing to deduct the amount of commissions (revenues from HUBKILO)\
                                            \n- Fixed amount: the system will base itself on a fixed amount regardless of the journey or the type of baggage.\
                                            \n- Percentage: The system will be based on a percentage that you must specify. The calculation will then be made by making a proportional sum (at the specified rate) of the amounts of the baggage and that of the journey. This option requires that the amounts on the types of baggage and the journeys be well specified.")


    hk_base_config_amount_fixed = fields.Monetary(string='Fixed amount', digits=(16,2),
                                    currency_field='hk_base_config_currency_id', default=10.0,
                                    help="The fixed amount to set")

    hk_base_config_currency_id = fields.Many2one (comodel_name='res.currency', string="Default currency",
                                        help="This is the local currency for financial transactions",
                                        default = lambda self: self.env.user.company_id.currency_id.id
                                     )

    hk_base_config_percentage = fields.Float(string='Percentage', digits=(2,2),
                                    help="The percentage to set")

    hk_base_config_validity_delay = fields.Integer(string="Validity Delay", default=3,
                                            help="Specifies the validity delay in month of ID Card of Passport")

    hk_base_config_alert_validity = fields.Selection([('chat', "Send a Chat Message"),
                                                   ('mail', "Send an email")],
                                                  string="Type of alert ", default='mail',
                                                  help="This field lets you specify how the system should behave when a user's credential is about to expire.\
                                                    \n-- Send a chat message: This will involve alerting them every week of the imminence of the deadline via chat messages specific to the platform.\
                                                    \n-- Send an email: The system will do exactly the same as in the previous case except that it will send an email to the partner's email")

    hk_base_config_ship_format_code = fields.Selection([('ship_year_num', "SHIP/YEAR/NUM"),
                                                            ('ship_num_year', "SHIP/NUM/YEAR"),
                                                            ('num_ship_year', "NUM/SHIP/YEAR")],
                                                     string="Shippment format code", default='ship_year_num',
                                                     help="Sets the code format for shipments")

    hk_base_config_travel_format_code = fields.Selection([('travel_year_num', "TRAVEL/YEAR/NUM"),
                                                            ('travel_num_year', "TRAVEL/NUM/YEAR"),
                                                            ('num_travel_year', "NUM/TRAVEL/YEAR")],
                                                           string="Travel format code", default='travel_year_num',
                                                           help="Sets the code format for travels")

    hk_base_config_auto_validate_travel = fields.Boolean(string='Auto Validate Travel?', default=True,
                                             help="By checking this box, the system will attempt to auto-validate the trip when it is created")

    hk_base_config_format_code_length = fields.Selection([("5", "5"),('6', "6"),('7', "7"),
                                                          ('8', "8"),('9', "9"),('10',"10")],
                                                         string="Format code length", default='6',
                                            help="This is the length of travels and shipping code")

    hk_base_config_payment_method = fields.Selection([('auto', "Automatic"),('manual', "Manual")],
                                                         string="Payment Method", default='auto',
                                            help="The default method for payment\
                                                 \n- Automatic : The system will automatically try to execute payment\
                                                 \n- Manual : The system will generate an invoice will be awaiting a validation performed be a HUBKILO employee.")

    hk_base_config_include_luggage_price = fields.Boolean(string='Include luggage price?',
                                                         help="By checking this box, the system will include luggage price to the global cost")

    authorization_key = fields.Char('Authorization Key', config_parameter='m0st_hk_base.authorization_key')

    auth_api_key = fields.Char('API Key', config_parameter='m0st_hk_base.auth_api_key')

    ##------------------- FUNCTIONS
    def set_values(self):
        super(ResConfigSettings, self).set_values()
        self.env['ir.config_parameter'].set_param('m0st_hk_base.authorization_key', self.authorization_key or '')
        self.env['ir.config_parameter'].set_param('m0st_hk_base.auth_api_key', self.auth_api_key or '')

        irConfig = self.env['ir.config_parameter'].sudo()

        if self.hk_base_config_validity_delay  <= 0 or  self.hk_base_config_validity_delay > 12:
            text = _(u"You can only set a value between 1 and 12 for the Validity Delay field ")
            raise UserError( text )


        irConfig.set_param('m0st_hk_base.hk_base_config_min_age', self.hk_base_config_min_age)
        irConfig.set_param('m0st_hk_base.hk_base_config_amount_type', self.hk_base_config_amount_type)
        irConfig.set_param('m0st_hk_base.hk_base_config_amount_fixed', self.hk_base_config_amount_fixed)
##        irConfig.set_param('m0st_hk_base.hk_base_config_currency_id', self.hk_base_config_currency_id.id)

        irConfig.set_param('m0st_hk_base.hk_base_config_percentage', self.hk_base_config_percentage)
        irConfig.set_param('m0st_hk_base.hk_base_config_validity_delay', self.hk_base_config_validity_delay)
        irConfig.set_param('m0st_hk_base.hk_base_config_alert_validity', self.hk_base_config_alert_validity)
        irConfig.set_param('m0st_hk_base.hk_base_config_ship_format_code', self.hk_base_config_ship_format_code)
        irConfig.set_param('m0st_hk_base.hk_base_config_travel_format_code', self.hk_base_config_travel_format_code)
        irConfig.set_param('m0st_hk_base.hk_base_config_auto_validate_travel', self.hk_base_config_auto_validate_travel)
        irConfig.set_param('m0st_hk_base.hk_base_config_format_code_length', self.hk_base_config_format_code_length)
        irConfig.set_param('m0st_hk_base.hk_base_config_payment_method', self.hk_base_config_payment_method)
        irConfig.set_param('m0st_hk_base.hk_base_config_include_luggage_price', self.hk_base_config_include_luggage_price)




    @api.model
    def get_values(self):
        res      = super(ResConfigSettings, self).get_values()
        res.update(authorization_key=self.env['ir.config_parameter'].sudo().get_param('m0st_hk_base.authorization_key'))
        res.update(auth_api_key=self.env['ir.config_parameter'].sudo().get_param('m0st_hk_base.auth_api_key'))
        irConfig = self.env['ir.config_parameter'].sudo()
        #currency_obj = self.env.get('res.currency')
        company_def = self.env.get('res.company').search([('name', '=', 'HUBKILO')], limit=1)

        hk_base_config_min_age    = irConfig.get_param('m0st_hk_base.hk_base_config_min_age') or DICT_DEFAULT_VALUES['hk_base_config_min_age']
        hk_base_config_amount_type    = irConfig.get_param('m0st_hk_base.hk_base_config_amount_type') or DICT_DEFAULT_VALUES['hk_base_config_amount_type']
        hk_base_config_amount_fixed    = irConfig.get_param('m0st_hk_base.hk_base_config_amount_fixed') or DICT_DEFAULT_VALUES['hk_base_config_amount_fixed']
        hk_base_config_currency_id    = company_def.currency_id.id or self.env.user.company_id.currency_id.id
        hk_base_config_percentage    = irConfig.get_param('m0st_hk_base.hk_base_config_percentage') or DICT_DEFAULT_VALUES['hk_base_config_percentage']
        hk_base_config_validity_delay = irConfig.get_param('m0st_hk_base.hk_base_config_validity_delay') or DICT_DEFAULT_VALUES['hk_base_config_validity_delay']
        hk_base_config_alert_validity = irConfig.get_param('m0st_hk_base.hk_base_config_alert_validity') or DICT_DEFAULT_VALUES['hk_base_config_alert_validity']
        hk_base_config_ship_format_code = irConfig.get_param('m0st_hk_base.hk_base_config_ship_format_code') or DICT_DEFAULT_VALUES['hk_base_config_ship_format_code']
        hk_base_config_travel_format_code = irConfig.get_param('m0st_hk_base.hk_base_config_travel_format_code') or DICT_DEFAULT_VALUES['hk_base_config_travel_format_code']
        hk_base_config_auto_validate_travel = irConfig.get_param('m0st_hk_base.hk_base_config_auto_validate_travel') or DICT_DEFAULT_VALUES['hk_base_config_auto_validate_travel']
        hk_base_config_format_code_length = irConfig.get_param('m0st_hk_base.hk_base_config_format_code_length') or DICT_DEFAULT_VALUES['hk_base_config_format_code_length']
        hk_base_config_payment_method = irConfig.get_param('m0st_hk_base.hk_base_config_payment_method') or DICT_DEFAULT_VALUES['hk_base_config_payment_method']
        hk_base_config_include_luggage_price = irConfig.get_param('m0st_hk_base.hk_base_config_include_luggage_price') or DICT_DEFAULT_VALUES['hk_base_config_include_luggage_price']

        res.update({ 'hk_base_config_min_age' : hk_base_config_min_age,
                    'hk_base_config_amount_type': hk_base_config_amount_type,
                    'hk_base_config_amount_fixed': hk_base_config_amount_fixed,
                    'hk_base_config_currency_id': hk_base_config_currency_id,
                    'hk_base_config_percentage': hk_base_config_percentage,
                     'hk_base_config_validity_delay': hk_base_config_validity_delay,
                     'hk_base_config_alert_validity': hk_base_config_alert_validity,
                     'hk_base_config_ship_format_code': hk_base_config_ship_format_code,
                     'hk_base_config_travel_format_code': hk_base_config_travel_format_code,
                     'hk_base_config_auto_validate_travel': hk_base_config_auto_validate_travel,
                     'hk_base_config_format_code_length': hk_base_config_format_code_length,
                     'hk_base_config_payment_method': hk_base_config_payment_method,
                     'hk_base_config_include_luggage_price': hk_base_config_include_luggage_price, })

        return res


##    @api.model
##    def get_values(self):
##        """
##        Overwrite to add new system params
##        """
##        Config  = self.env["ir.config_parameter"].sudo()
##        res     = super(res_config_settings, self).get_values()
##        values  = {}
##        for field_name, getter, default in PARAMS:
##            values[field_name] = getter(str(Config.get_param(field_name, default)))
##        res.update(**values)
##        return res
##
##    def set_values(self):
##        """
##        Overwrite to add new system params
##        """
##        Config = self.env["ir.config_parameter"].sudo()
##        super(res_config_settings, self).set_values()
##        for field_name, getter, default in PARAMS:
##            value = getattr(self, field_name, default)
##            Config.set_param(field_name, value)

##    def set_values(self):
##        super(ResConfigSettings, self).set_values()
##        # install a chart of accounts for the given company (if required)
##        if self.env.company == self.company_id and self.chart_template_id and self.chart_template_id != self.company_id.chart_template_id:
##            self.chart_template_id._load(15.0, 15.0, self.env.company)


