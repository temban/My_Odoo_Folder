# -*- coding: utf-8 -*-

from odoo import models, fields, api


class CustomPosOrder(models.Model):
    _inherit = 'pos.order'

    custom_field = fields.Char(string='Custom Field')

#     _name = 'terminal__salon_and__spa.terminal__salon_and__spa'
#     _description = 'terminal__salon_and__spa.terminal__salon_and__spa'

#     name = fields.Char()
#     value = fields.Integer()
#     value2 = fields.Float(compute="_value_pc", store=True)
#     description = fields.Text()
#
#     @api.depends('value')
#     def _value_pc(self):
#         for record in self:
#             record.value2 = float(record.value) / 100
