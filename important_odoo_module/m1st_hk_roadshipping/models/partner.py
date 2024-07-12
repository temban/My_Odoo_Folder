# -*- coding: utf-8 -*-
## PYTHON BUILT_IN IMPORT
from datetime import datetime, date

## ODOO IMPORT
from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError



class resPartner(models.Model):
    _name = 'res.partner'
    _inherit = 'res.partner'


    ##----------------- DEFAULT
    @api.model
    def _get_default_payment_term(self):
        return self.env['account.payment.term'].search([('name', '=', 'Immediate Payment')], limit=1)

    ##--------------------- FIELDS
    shipping_ids = fields.One2many('m1st_hk_roadshipping.shipping',
                                    inverse_name='partner_id', string="Shippings", readonly=True, )

    travelbooking_ids = fields.One2many('m1st_hk_roadshipping.travelbooking',
                                        inverse_name='partner_id', string="Travels", readonly=True, )

    partner_attachment_ids = fields.One2many('ir.attachment', inverse_name='partner_id',
                                        string="Attachment", )

    receiver_partner_ids = fields.Many2many(comodel_name='res.partner', compute='_get_receivers', string="My Receivers")


    directory_partner_ids = fields.Char(compute='_get_receivers', string="Partner directory IDS",
                                             store=True, )

    directory_partner_names = fields.Char(compute='_get_receivers', string="Partner directory Names",
                                        store=True, )

    directory_partner_list_ids = fields.Char(compute='_get_receivers', string="Partner directory List IDS",
                                        store=True, )

    is_my_receiver = fields.Boolean(string="Technical field", readonly=True, )


    property_payment_term_id = fields.Many2one('account.payment.term', company_dependent=True,
                                               string='Customer Payment Terms',
                                               default=_get_default_payment_term,
                                               domain="[('company_id', 'in', [current_company_id, False])]",
                                               help="This payment term will be used instead of the default one for sales orders and customer invoices")

    property_supplier_payment_term_id = fields.Many2one('account.payment.term', company_dependent=True,
                                                        string='Vendor Payment Terms',
                                                        default=_get_default_payment_term,
                                                        domain="[('company_id', 'in', [current_company_id, False])]",
                                                        help="This payment term will be used instead of the default one for purchase orders and vendor bills")


    ##--------------------- COMPUTED
    @api.depends('computed', 'is_receiver')
    def _get_receivers(self):
        ship_obj = self.env.get('m1st_hk_roadshipping.shipping')
        for r in self:
            all_shippings = ship_obj.search([('partner_id', '=', r.id), ('state', 'not in', ['rejected'])])
            receiver_partner_ids        = all_shippings.mapped('receiver_partner_id') or None
            directory_partner_list_ids  = ''
            directory_partner_names     = ''
            seq                         = 0

            if receiver_partner_ids is not None:
                for dpid in receiver_partner_ids:
                    if seq == 0 :
                        directory_partner_list_ids  = u"%s" % dpid.id
                        directory_partner_names     = u"(%s,%s)" % (dpid.id, dpid.name)
                    else:
                        directory_partner_list_ids = u"%s,%s" % (directory_partner_list_ids, dpid.id)
                        directory_partner_names    = u"%s;(%s,%s)" % (directory_partner_names, dpid.id, dpid.name)
                    seq += 1

            directory_partner_ids       = directory_partner_list_ids
            directory_partner_list_ids  = u"%s%s%s" % (u'[', directory_partner_list_ids, u']')
            directory_partner_names     = u"%s%s%s" % (u'{', directory_partner_names, u'}')
            r.update( {'receiver_partner_ids': receiver_partner_ids,
                       'directory_partner_list_ids': directory_partner_list_ids,
                       'directory_partner_ids': directory_partner_ids,
                       'directory_partner_names': directory_partner_names, } )



    ##------------------- MISC





