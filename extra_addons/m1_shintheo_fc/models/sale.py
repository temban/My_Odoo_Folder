# -*- coding: utf-8 -*-
###############################################################################
#
#
###############################################################################
# PYTHON BUILT_IN IMPORT

# ODOO IMPORT
from odoo import models, fields, api, _
from odoo.exceptions import UserError, AccessError, ValidationError


class SaleOrder(models.Model):
    _name = "sale.order"
    _inherit = ['sale.order']


    ##==================================== FIELDS
    def action_confirm ( self ):
        user_obj = self.env.get ('res.users')

        return_value = super(SaleOrder, self).action_confirm()

        #==== CREATE INVOICE
        self._create_invoices(final=True).action_post()

        # @TODO ==== Here i will compute the bonus with triggers
        for sale in self:
            order_line_bonus = sale.mapped ('order_line').filtered (lambda ol: ol.is_bonus_used)
            bonus_point_used = sum ( order_line_bonus.mapped('product_uom_qty') )

            if bonus_point_used == 0: continue

            uargs = [ ('partner_id', '=', sale.partner_id.id) ]
            cuser = user_obj.sudo ().search (uargs, limit=1)
            cuser.sudo().write( {'client_bonus': cuser.client_bonus - bonus_point_used} )

        return return_value




class SaleOrderLine(models.Model):
    _name = 'sale.order.line'
    _inherit = [ 'sale.order.line' ]


    is_bonus_used = fields.Boolean(string="Bonus?", readonly=True,
                                   help="If checked, it means that the related product affected to this order line have used bonus to be paid", )