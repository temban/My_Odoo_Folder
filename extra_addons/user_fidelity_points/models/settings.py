from odoo import api, fields, models, _
# from odoo.tools.safe_eval import safe_eval
from odoo.exceptions import UserError


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    authorization_key = fields.Char('Authorization Key', config_parameter='m0st_hk_base.authorization_key')

    auth_api_key = fields.Char('API Key', config_parameter='m0st_hk_base.auth_api_key')

    ##------------------- FUNCTIONS
    def set_values(self):
        super(ResConfigSettings, self).set_values()
        self.env['ir.config_parameter'].set_param('m0st_hk_base.authorization_key', self.authorization_key or '')
        self.env['ir.config_parameter'].set_param('m0st_hk_base.auth_api_key', self.auth_api_key or '')

    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        res.update(authorization_key=self.env['ir.config_parameter'].sudo().get_param('m0st_hk_base.authorization_key'))
        res.update(auth_api_key=self.env['ir.config_parameter'].sudo().get_param('m0st_hk_base.auth_api_key'))
        return res
