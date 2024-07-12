from odoo import models, fields

class City(models.Model):
    _name = 'res.city'
    _description = 'City'
    _order = 'name'
    
    name = fields.Char(string='City', required=True, translate=True)
    country_id = fields.Many2one('res.country', string='Country', required=True)
    capital = fields.Boolean(string='Capital', default=False)