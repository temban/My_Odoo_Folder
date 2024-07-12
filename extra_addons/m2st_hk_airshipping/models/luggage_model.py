from odoo import models, fields, api
from random import randint


class LuggageType(models.Model):
    _name = 'm2st_hk_airshipping.luggage.type'
    _inherit = 'm0sthk.base'
    _description = 'Luggage Type'

    @api.model
    def _get_default_color(self):
        return randint(1, 11)

    name = fields.Char(string='Name', required=True)
    partner_id = fields.Many2one('res.partner', string='Luggage Creator')
    price_per_kilo = fields.Monetary(string='Price per Kilo', required=True)
    weight_in_kg = fields.Float(string='Weight in Kg', required=True)
    description = fields.Text(string='Description')
    image = fields.Binary(string='Image')
    color = fields.Integer(string='Color Index', default=_get_default_color)
    currency_id = fields.Many2one(
        'res.currency',
        string='Currency:',
        compute='_compute_currency',
        readonly=True,
        store=True  # Store the computed value in the database for real-time display
    )

    @api.model
    def create(self, values):
        # Convert the name to uppercase
        values['name'] = values.get('name', '').upper()

        # Create the LuggageType record
        luggage_type = super(LuggageType, self).create(values)

        # Create the corresponding product.template record
        product_template_values = {
            'name': 'HUBKILO ' + values.get('name', ''),
            'detailed_type': 'service',
            'default_code': 'HBK-' + values.get('name', ''),
            'sale_ok': True,
            'purchase_ok': False,
        }
        self.env['product.template'].create(product_template_values)

        return luggage_type

    def action_edit(self):
        # Implement the logic for editing the record
        # This method will be called when the "Edit" button is clicked
        return {
            'type': 'ir.actions.act_window',
            'res_model': 'm2st_hk_airshipping.luggage.type',
            'res_id': self.id,
            'view_mode': 'form',
            'view_id': self.env.ref('m2st_hk_airshipping.view_form_luggage_type').id,
            'target': 'new',
        }

    def action_delete(self):
        self.unlink()
        return {
            'type': 'ir.actions.client',
            'tag': 'reload',
        }

    @api.depends('partner_id', 'weight_in_kg', 'name', 'price_per_kilo')
    def _compute_currency(self):
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        currency_id = resconfigvalues['hk_base_config_currency_id']
        self.currency_id = currency_id


class AirResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    def _get_default_luggage_type_ids(self):
        return self.env['m2st_hk_airshipping.luggage.type'].sudo().search([])

    luggage_type_ids = fields.Many2many(
        'm2st_hk_airshipping.luggage.type',
        string='Luggage Types',
        default=_get_default_luggage_type_ids)

    def open_luggage_form(self):
        return {
            'name': 'Create Luggage',
            'view_mode': 'form',
            'res_model': 'm2st_hk_airshipping.luggage.type',
            'type': 'ir.actions.act_window',
            'view_id': self.env.ref('m2st_hk_airshipping.view_form_luggage_type').id,
            'target': 'new',
        }
