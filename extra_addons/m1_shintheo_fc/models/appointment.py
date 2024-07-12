# -*- coding: utf-8 -*-
###############################################################################
#
#
###############################################################################
# PYTHON BUILT_IN IMPORT
import time
from datetime import datetime, date

# ODOO IMPORT
from odoo import models, fields, api, _
from odoo.exceptions import UserError, AccessError, ValidationError



class business_appointment(models.Model):
    _name = 'business.appointment'
    _inherit = ['business.appointment']

    READONLY_DRAFT = { 'reserved': [ ('readonly', False) ] }
    # ========================= FIELDS
    discount_type = fields.Selection([ ('none', "None"),
                                       ('percentage', "Percentage"),
                                       ('value', "Fixed Value"),
                                       ('bonus', "Loyalty card")], string="Discount Type", default='none',
                                      help="Allows you to choose which type of discount you would like to apply to the customer.\
                                        \n-/- None: The whole invoice will be paid without any discount applied.\
                                        \n-/- Percentage: You will be required to enter a percentage in whole value, for example 20, which will result in the system as 20%.\
                                        \n-/- Fixed Value: In this case you will have to select a value from the list below.\
                                        \n-/- loyalty card: Allows you to obtain a discount from your bonus points",
                                     readonly=True, states=READONLY_DRAFT) # en principe je dois hériter de la dernière valeur dans le module de bonus je mets ici pour ne pas oublier de le faire

    product_discount_id = fields.Many2one(comodel_name='product.product', string="Discount value", readonly=True, states=READONLY_DRAFT)

    percentage_value = fields.Float (string="Discount percentage", digits=(2, 2), readonly=True, states=READONLY_DRAFT)

    product_line_bonus_ids =  fields.One2many('associated.product.line.bonus', inverse_name='appointment_id',
                                              string="Product bonus lines")

    #========================= FUNCTION
    #-------------- CONSTRAINS
    @api.constrains('product_line_bonus_ids', 'discount_type', 'percentage_value')
    def _check_business_values(self):
        user_obj = self.env.get ('res.users')
        for record in self:
            if record.discount_type == 'percentage' and record.percentage_value  <= 0:
                text = u"You cannot have a percentage value equal or less than zero"
                raise ValidationError( _(text) )

            if record.discount_type == 'bonus':
                uargs = [ ('partner_id', '=', record.partner_id.id) ]
                cuser = user_obj.sudo ().search (uargs, limit=1)

                if not cuser:
                    text = u"The customer <%s> cannot use payment via bonuses because the system detects that he does not have an account" % record.partner_id.name
                    raise ValidationError (_ (text))

                if any( record.mapped('product_line_bonus_ids').filtered( lambda y: y.product_uom_qty < 1) ):
                    text = u"Quantity of bonus values cannot be less than 1"
                    raise ValidationError (_ (text))

                product_ids = []
                for p in record.mapped('product_line_bonus_ids'):
                    if p.product_id.id in product_ids:
                        text = u"You cannot choose the same bonus twice"
                        raise ValidationError (_ (text))
                    product_ids.append( p.product_id.id )

                bonus_point = sum ( record.mapped('product_line_bonus_ids.product_uom_qty') )
                if cuser.client_bonus < bonus_point:
                    text = u"The system cannot validate this operation because it detects that the customer <%s> has <%s bonus> left, " \
                           u"while he tries to pay with <%s bonus>" % (record.partner_id.name, cuser.client_bonus, bonus_point)
                    raise ValidationError (_ (text))

        return True


    #-------------- ORM

    #------------- wkf
    def action_mark_missed ( self ):
        for appointment in self:
            appointment.state = "missed"
            if appointment.order_id:
                appointment.order_id.action_cancel()

    def action_mark_done ( self ):
        for appointment in self:
            appointment.state = "done"
            if appointment.order_id:
                appointment.action_adapt_sale_order()
                appointment.order_id.action_confirm()


    #-------------- MISC
    def action_adapt_sale_order(self):
        self._cancel_order_line()

        return_value = super(business_appointment, self).action_adapt_sale_order()

        self.handle_sale ()

        return return_value



    def handle_sale(self):
        apl_obj = self.env.get ('associated.product.line')
        for record in self:
            if record.discount_type in [ 'percentage', 'bonus' ]:

                if record.discount_type == 'percentage' and record.percentage_value > 0:
                    record.order_id.mapped ('order_line').write ( { 'discount': record.percentage_value})

                if record.discount_type == 'bonus':
                    product_ids = [ ]
                    order_line  = [ ]
                    order_lines = record.order_id.mapped ('order_line')

                    for plb in record.mapped('product_line_bonus_ids'):
                        if plb.product_id.id not in order_lines.mapped('product_id.id'):
                            product_ids.append( plb.product_id.id )
                            apl_obj.create ({ 'product_id': plb.product_id.id, 'product_uom_qty': plb.product_uom_qty,
                                              'appointment_id': record.id })
                            order_line.append ((0, 0, {
                                "product_id": plb.product_id.id,
                                "product_uom": plb.product_id.uom_id.id,
                                "product_uom_qty": plb.product_uom_qty,
                                "appointment_id": record.id,
                                "is_bonus_used": True,
                            }))

                    record.order_id.write ({ 'order_line': order_line, })

            elif record.discount_type == 'value' and record.product_discount_id:
                apl_obj.create ({ 'product_id': record.product_discount_id.id, 'product_uom_qty': 1, 'appointment_id': record.id })
                order_line = [(0, 0, {
                        "product_id": record.product_discount_id.id,
                        "product_uom": record.product_discount_id.uom_id.id,
                        "product_uom_qty": 1,
                        "appointment_id": record.id,
                }) ]

                record.order_id.write ({ 'order_line': order_line, })

        return True


    def _return_main_line_qty ( self ):
        return 1.00


    def _cancel_order_line(self):
        apl_obj = self.env.get ('associated.product.line')
        for r in self:
            apl_obj.search ([ ('appointment_id', '=', r.id), ('from_web_mobile', '=', False) ]).unlink ()
            r.order_id.mapped ('order_line').sudo ().unlink ()

        return True


class product_template(models.Model):
    _name = 'product.template'
    _inherit = ['product.template']

    discount_management = fields.Selection([('discount', "It's a discount"), ('bonus', "Can be paid by a bonus"), ('none', "None")], string="Discount management", default='none',
                                           help="This field allows you to define the behavior of your item on discount management.\
                                            \n-/- Discount: means that this item will behave like a discount and in this case the sale price must be negative to signify the amount of the discount.\
                                            \n-/- Can be paid by a bonus: If you choose this option you mean to the system that this article, in the event that the customer would like to pay by a bonus, will make a discount of 100% of its amount")


class associated_product_line(models.Model):
    _name = 'associated.product.line'
    _inherit = [ 'associated.product.line' ]

    from_web_mobile = fields.Boolean(string="is Special?", readonly=True, )


class associated_product_line_bonus(models.Model):
    _name = 'associated.product.line.bonus'
    _description = "These are product lines for bonus"

    product_id = fields.Many2one('product.product', string="Product", required=True, )

    product_uom_qty = fields.Integer(string="Quantity", default=1, )

    appointment_id = fields.Many2one('business.appointment', string="Appointment", )