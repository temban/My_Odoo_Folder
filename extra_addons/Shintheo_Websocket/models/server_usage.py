from odoo import models, api
from . import server_models


class ServerWebSocketResPartner(models.Model):
    _inherit = 'res.partner'

    @api.model
    def get_server_partner_info_dict(self):
        partner_records = self.env['res.partner'].sudo().search([])
        partner_info_dict = {}

        for partner in partner_records:
            partner_info_dict[partner.id] = {
                'name': partner.name,
                'email': partner.email,
                'phone': partner.phone,
                'street': partner.street,
                'city': partner.city,
                'zip': partner.zip,
                'country_id': partner.country_id.name,
                'vat': partner.vat,
                # Add more fields as needed
            }

        return server_models.server_websocket_call(partner_info_dict, "room11")
