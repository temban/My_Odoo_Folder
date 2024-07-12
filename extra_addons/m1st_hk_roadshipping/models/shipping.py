# -*- coding: utf-8 -*-
## PYTHON BUILT_IN IMPORT
from datetime import datetime, date
from random import randint
import random
import string
import time

## ODOO IMPORT
from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError


class Luggage(models.Model):
    _name = 'm1st_hk_roadshipping.luggage'
    _description = "Luggages"

    ##-------------------- DEFAULTS
    @api.model
    def _get_default_color(self):
        return randint(1, 11)

    ##-------------- FIELDS
    name = fields.Char(string="Luggage desc", required=True, default='/')

    shipping_id = fields.Many2one('m1st_hk_roadshipping.shipping', string="Shipping", )

    img_bool_parcel_reception = fields.Boolean(string="Is it a reception?",
                                               compute='_compute_img_bool_parcel_reception', store=True)

    luggage_model_id = fields.Many2one('m0sthk.luggage_model', string="Luggage model", required=True, )

    average_width = fields.Float(string="average width",
                                 help="This is the average width for a type of luggage expressed in centimeters")

    average_height = fields.Float(string="average height",
                                  help="This is the average height for a type of luggage expressed in centimeters")

    average_weight = fields.Float(string="Average weight", help="This is the average weight expressed in kg")

    average_size = fields.Float(string="average size",
                                help="This is the average size for a type of luggage expressed in centimeters")

    luggage_image1 = fields.Image("Image 1", max_width=512, max_height=512, )

    luggage_image2 = fields.Image("image 2", max_width=256, max_height=256, )

    luggage_image3 = fields.Image("Image 3", max_width=128, max_height=128, )

    luggage_image4 = fields.Image("Image 4", max_width=512, max_height=512, )

    luggage_image5 = fields.Image("image 5", max_width=256, max_height=256, )

    luggage_image6 = fields.Image("Image 6", max_width=128, max_height=128, )


    luggage_image7 = fields.Image("Image 7", max_width=512, max_height=512, )

    luggage_image8 = fields.Image("image 8", max_width=256, max_height=256, )

    luggage_image9 = fields.Image("Image 9", max_width=128, max_height=128, )


    luggage_image10 = fields.Image("Image 10", max_width=512, max_height=512, )

    luggage_image11 = fields.Image("image 11", max_width=256, max_height=256, )

    luggage_image12 = fields.Image("Image 12", max_width=128, max_height=128, )

    color = fields.Integer(string='Color Index', default=_get_default_color)

    ##--------------------- MISC
    @api.depends('shipping_id.bool_parcel_reception')
    def _compute_img_bool_parcel_reception(self):
        for luggage in self:
            luggage.img_bool_parcel_reception = luggage.shipping_id.bool_parcel_reception

    @api.onchange('luggage_model_id')
    def onchange_luggage_model(self):
        if not self.luggage_model_id: return None

        self.name = self.luggage_model_id.name
        self.average_size = self.luggage_model_id.average_size
        self.average_height = self.luggage_model_id.average_height
        self.average_weight = self.luggage_model_id.average_weight
        self.average_width = self.luggage_model_id.average_width

    @api.constrains('average_width', 'average_height', 'average_weight', 'average_size', 'luggage_model_id')
    def _check_luggage_size(self):
        for record in self:
            if record.average_weight > record.luggage_model_id.max_weight:
                raise ValidationError(
                    "You may not exceed the maximum weight of %s" % (record.luggage_model_id.max_weight))

            if record.average_height > record.luggage_model_id.max_height:
                raise ValidationError(
                    "You may not exceed the maximum height of %s" % (record.luggage_model_id.max_height))

            if record.average_width > record.luggage_model_id.max_width:
                raise ValidationError(
                    "You may not exceed the maximum width of %s" % (record.luggage_model_id.max_width))

            if record.average_size > record.luggage_model_id.max_size:
                raise ValidationError("You may not exceed the maximum size of %s" % (record.luggage_model_id.max_size))


class RoadShipping(models.Model):
    _name = 'm1st_hk_roadshipping.shipping'
    _inherit = 'm0sthk.base'
    _description = 'Management of road shipments'

    ##--------------------- DEFAULTS
    @api.model
    def _get_default_name(self):
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        ship_format_code = resconfigvalues['hk_base_config_ship_format_code']
        format_code_length = int(resconfigvalues['hk_base_config_format_code_length'])
        start = "%s-01-01" % time.strftime('%Y')
        end = "%s-12-31" % time.strftime('%Y')
        count = self.search_count([('shipping_date', '>=', start), ('shipping_date', '<=', end)]) + 1
        count = self._get_num_code(count=count, seq=format_code_length)

        if ship_format_code == 'ship_year_num':
            return u"ROADSHIP/%s/%s" % (time.strftime('%Y'), count)
        elif ship_format_code == 'ship_num_year':
            return u"ROADSHIP/%s/%s" % (count, time.strftime('%Y'))
        else:
            return u"%s/RAODSHIP/%s" % (count, time.strftime('%Y'))

    @api.model
    def _get_default_partner(self):
        partner_obj = self.env.get('res.partner')
        return partner_obj.search([('related_user_id', '=', self.env.user.id)], limit=1)

    @api.model
    def _get_default_inlcude_luggage(self):
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        return bool(resconfigvalues['hk_base_config_include_luggage_price'])

    @api.model
    def _get_default_color(self):
        return randint(1, 11)

    @api.model
    def _get_default_departure_city(self):
        partner_obj = self.env.get('res.partner')
        pargs = [('related_user_id', '=', self.env.user.id)]
        return partner_obj.search(pargs, limit=1).residence_city_id

    ##---------------- CONSTRAINS

    ##----------------- COMPUTE
    @api.depends('computed', 'travelbooking_id')
    def _compute_booking_type(self):
        for r in self:
            if not r.travelbooking_id:
                r.booking_type = ''
            elif r.travelbooking_id.booking_type == 'road':
                r.booking_type = 'By Road'

    @api.depends('travelbooking_id.partner_id.partner_latitude',
                 'travelbooking_id.partner_id.partner_longitude',
                 'travelbooking_id')
    def _compute_travel_info(self):
        for r in self:
            disable = False
            if r.travelbooking_id.state in ['rejected']: disable = True

            r.update({'travel_partner_latitude': r.travelbooking_id.partner_id.partner_latitude,
                      'travel_partner_longitude': r.travelbooking_id.partner_id.partner_longitude,
                      'disable': disable, })

    @api.depends('receiver_partner_id')
    def _compute_receiver_info(self):
        for r in self:
            r.update({'receiver_email': r.receiver_partner_id.email,
                      'receiver_phone': u"%s / %s" % (
                          (r.receiver_partner_id.phone or ""), (r.receiver_partner_id.mobile or "")),
                      'receiver_address': u"%s -- %s" % (
                          (r.receiver_partner_id.residence_city_id.name or ""),
                          (r.receiver_partner_id.street or "")), })

    @api.depends('luggage_ids', 'shipping_price', 'include_luggage_price', 'move_id')
    def _compute_shipping_ref(self):
        inv_obj = self.get_model_pool('account.move')
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        config_amount_type = resconfigvalues['hk_base_config_amount_type']

        if config_amount_type == 'fixed':
            base_cost = float(resconfigvalues['hk_base_config_amount_fixed'])
        else:
            base_cost = 0

        for r in self:
            total_weight = 0
            luggage_cost = 0

            for luggage in r.luggage_ids:
                total_weight += luggage.average_weight
                luggage_cost += luggage.luggage_model_id.amount_to_deduct

            percentage = resconfigvalues['hk_base_config_percentage']

            if base_cost == 0:
                total = float(percentage) * float(r.shipping_price)
                cost = round(total / 100, 2)
            else:
                cost = base_cost

            # iargs = [('shipping_id', '=', r.id), ('travelbooking_id', '=', r.travelbooking_id.id),
            #          ('partner_id', '=', r.partner_id.id), ('move_type', '=', 'out_invoice')]
            #
            # invoice = inv_obj.search(iargs, limit=1)

            # total = (r.shipping_price - cost) + (invoice and invoice.amount_tax or float(0))
            total = r.move_id and r.move_id.amount_total or r.shipping_price

            if r.include_luggage_price:
                total += luggage_cost

            r.update({
                'total_weight': total_weight,
                'luggage_cost': luggage_cost,
                'amount_deducted': cost,
                'total_cost': total
            })

    @api.depends('travelbooking_id', 'computed')
    def _compute_related_travel_data(self):
        for r in self:
            if not r.travelbooking_id:
                r.update({'travel_code': "",
                          'travel_partner_name': "",
                          'travel_departure_city_name': "",
                          'travel_arrival_city_name': ""
                          })
                continue

            r.update({'travel_code': r.travelbooking_id.code,
                      'travel_partner_name': r.travelbooking_id.partner_id.name,
                      'travel_departure_city_name': u"%s (%s)" % (
                          r.travelbooking_id.departure_city_id.name, r.travelbooking_id.departure_city_id.country_name),
                      'travel_arrival_city_name': u"%s (%s)" % (
                          r.travelbooking_id.arrival_city_id.name, r.travelbooking_id.arrival_city_id.country_name)})

    ##--------------------- FIELDS
    name = fields.Char(string="Code", required=True, default=_get_default_name, readonly=True, )

    partner_id = fields.Many2one('res.partner', default=_get_default_partner, required=True,
                                 string="Sender",
                                 readonly=True, states={'pending': [('readonly', False), ], }, )

    travelbooking_id = fields.Many2one('m1st_hk_roadshipping.travelbooking',
                                       string="Travel booking", readonly=True, states={'pending': [('readonly', False), ], }, )

    booking_type = fields.Char(string='Travel type', readonly=True,
                               compute='_compute_booking_type', )

    state = fields.Selection([('pending', 'Pending'), ('accepted', 'Dispatched'),
                              ('paid', 'Paid'), ('confirm', "Received"),
                              ('received', "Delivered"), ('rejected', 'Rejected / Cancelled'),
                              ],
                             string='Status', default='pending', required=True, readonly=True, )

    parcel_received = fields.Boolean(string='Parcel received from shipper', default=False)

    disable = fields.Boolean(string='is Travel disabled?',
                             compute='_compute_travel_info', store=True, readonly=True)

    travel_partner_latitude = fields.Float(compute='_compute_travel_info',
                                           string='Geo Latitude', digits=(10, 7))

    travel_partner_longitude = fields.Float(compute='_compute_travel_info', string='Geo Longitude', digits=(10, 7))

    position = fields.Text(string='Localisation description', )

    luggage_ids = fields.One2many('m1st_hk_roadshipping.luggage', inverse_name='shipping_id', string="Lugagges",
                                  readonly=True, required=True,
                                  states={'pending': [('readonly', False), ], }, )

    total_weight = fields.Float(compute='_compute_shipping_ref', string="Average total weight",
                                readonly=True, help="This is the average total weight of luggages")

    receiver_partner_id = fields.Many2one('res.partner', string='Receiver', readonly=True,
                                          states={'pending': [('readonly', False), ], }, )

    receiver_email = fields.Char(compute='_compute_receiver_info', string='Receiver Email',
                                 readonly=True, store=True, )

    receiver_phone = fields.Char(compute='_compute_receiver_info', string='Receiver Phone',
                                 readonly=True, store=True, )

    receiver_address = fields.Text(compute='_compute_receiver_info', string='Receiver Address',
                                   readonly=True, store=True, )

    shipping_date = fields.Date(string='Shipping creation date', required=True,
                                default=fields.Date.today(), )

    travelmessage_ids = fields.One2many('m1st_hk_roadshipping.travelmessage', 'shipping_id',
                                        string='Messages',
                                        states={'received': [('readonly', True), ], }, )

    receiver_name_set = fields.Char(string='Receiver Name', readonly=True,
                                    states={'pending': [('readonly', False), ], }, )

    receiver_email_set = fields.Char(string='Receiver Email', readonly=True,
                                     states={'pending': [('readonly', False), ], }, )

    receiver_phone_set = fields.Char(string='Receiver Phone', readonly=True,
                                     states={'pending': [('readonly', False), ], }, )

    receiver_street_set = fields.Text(string='Street',
                                      readonly=True, states={'pending': [('readonly', False), ], }, )

    register_receiver = fields.Boolean(string="Register receiver infos?",
                                       readonly=True, states={'pending': [('readonly', False), ], }, )

    receiver_source = fields.Selection([('database', "My Directory Book"),
                                        ('manual', "Manual Entry")], string="Register receiver infos?",
                                       default='database', required=True,
                                       readonly=True, states={'pending': [('readonly', False), ], }, )

    receiver_city_id = fields.Many2one('res.city', string="Beneficiary's city of residence")

    directory_partner_list_ids = fields.Char(related='partner_id.directory_partner_list_ids',
                                             string="Partner directory IDS",
                                             store=True, )

    shipping_price = fields.Monetary(string="Shipping price", required=True, digits=(16, 2),
                                     currency_field='currency_id', )

    luggage_cost = fields.Monetary(string="Luggage Cost", digits=(16, 2), compute='_compute_shipping_ref',
                                   readonly=True, store=True, currency_field='currency_id', )

    amount_deducted = fields.Monetary(string="Fees cost", digits=(16, 2), compute='_compute_shipping_ref',
                                      readonly=True, store=True, currency_field='currency_id',
                                      help="this is the amount that will be deducted as a transaction fee", )

    total_cost = fields.Monetary(string="Transaction Cost", digits=(16, 2), compute='_compute_shipping_ref',
                                 readonly=True, store=True, currency_field='currency_id',
                                 help="this is the global amount ofg operation \
                                        \nTransaction Cost = shipping_price + luggage_cost + Fees cost", )

    currency_id = fields.Many2one(comodel_name='res.currency', string="Currency",
                                  related='travelbooking_id.local_currency_id', readonly=True, store=True,
                                  help="This is the local currency for financial transactions", )

    include_luggage_price = fields.Boolean(string="Include Luggages Price?", readonly=True,
                                           default=_get_default_inlcude_luggage, )

    color = fields.Integer(string='Color Index', default=_get_default_color)

    ##--------------- PAYMENTS OPTIONS
    is_paid = fields.Boolean(string="Is shipping Paid?", readonly=True, )

    payment_method_line_id = fields.Many2one('account.payment.method.line', string='Payment Method',
                                             readonly=False, copy=False,
                                             help="Manual: Pay or Get paid by any method outside of Odoo.\n"
                                                  "Payment Acquirers: Each payment acquirer has its own Payment Method. Request a transaction on/to a card thanks to a payment token saved by the partner when buying or subscribing online.\n"
                                                  "Check: Pay bills by check and print it from Odoo.\n"
                                                  "Batch Deposit: Collect several customer checks at once generating and submitting a batch deposit to your bank. Module account_batch_payment is necessary.\n"
                                                  "SEPA Credit Transfer: Pay in the SEPA zone by submitting a SEPA Credit Transfer file to your bank. Module account_sepa is necessary.\n"
                                                  "SEPA Direct Debit: Get paid in the SEPA zone thanks to a mandate your partner will have granted to you. Module account_sepa is necessary.\n")

    move_id = fields.Many2one('account.move', string="Ref Invoice", readonly=True,
                              help="The invoice related to this shipping")

    payment_link = fields.Char(related='move_id.payment_link', store=True,
                               string="Payment Link", readonly=True, )

    # --------- ABOUT DESTINATION
    shipping_departure_city_id = fields.Many2one('res.city', string="Departure town",
                                                 default=_get_default_departure_city, )

    shipping_arrival_city_id = fields.Many2one('res.city', string="Arrival town")

    shipping_departure_date = fields.Datetime(string='Departure date',
                                              default=fields.Datetime.now(),
                                              readonly=True, states={'pending': [('readonly', False), ], }, )

    shipping_arrival_date = fields.Datetime(string='Arrival date',
                                            readonly=True, states={'pending': [('readonly', False), ], }, )

    # -------- TRAVEL INFOS RELATED
    travel_code = fields.Char(compute='_compute_related_travel_data', string="Travel Code",
                              readonly=True, store=True, )

    travel_partner_name = fields.Char(compute='_compute_related_travel_data', string="Travel Partner Name",
                                      readonly=True, store=True, )

    travel_departure_city_name = fields.Char(compute='_compute_related_travel_data',
                                             string="Travel Departure city name",
                                             readonly=True, store=True, )

    travel_arrival_city_name = fields.Char(compute='_compute_related_travel_data',
                                           string="Travel Arrival city name",
                                           readonly=True, store=True, )

    msg_shipping_accepted = fields.Boolean(string="Shipping Message is Accepted!")

    # ---------------------Parcel Reception-------------------------------------

    bool_parcel_reception = fields.Boolean(string="Is it a reception?")

    parcel_reception_shipper = fields.Many2one('res.partner')

    parcel_reception_shipper_email = fields.Char(compute='_compute_parcel_reception_receiver_info', string='parcel_reception_shipper Email',
                                 readonly=True, store=True, )

    parcel_reception_shipper_phone = fields.Char(compute='_compute_parcel_reception_receiver_info', string='parcel_reception_shipper Phone',
                                 readonly=True, store=True, )

    parcel_reception_receiver_partner_id = fields.Many2one('res.partner', string='Parcel Reception Receiver' )

    parcel_reception_receiver_email = fields.Char(compute='_compute_parcel_reception_receiver_info', string='Receiver Email',
                                 readonly=True, store=True, )

    parcel_reception_receiver_phone = fields.Char(compute='_compute_parcel_reception_receiver_info', string='Receiver Phone',
                                 readonly=True, store=True, )

    parcel_reception_receiver_address = fields.Text(compute='_compute_parcel_reception_receiver_info', string='Receiver Address',
                                   readonly=True, store=True, )

    @api.depends('parcel_reception_receiver_partner_id', 'parcel_reception_shipper', 'bool_parcel_reception')
    def _compute_parcel_reception_receiver_info(self):
        for r in self:
            if r.bool_parcel_reception:  # Check if bool_parcel_reception is True
                r.update({
                    'parcel_reception_receiver_email': r.parcel_reception_receiver_partner_id.email,
                    'parcel_reception_shipper_email': r.parcel_reception_shipper.email,
                    'parcel_reception_shipper_phone': r.parcel_reception_shipper.phone,
                    'receiver_partner_id': r.parcel_reception_receiver_partner_id.id,
                    'partner_id': r.parcel_reception_receiver_partner_id.id,
                    'parcel_reception_receiver_phone': u"%s / %s" % (
                        (r.parcel_reception_receiver_partner_id.phone or ""),
                        (r.parcel_reception_receiver_partner_id.mobile or "")),
                    'parcel_reception_receiver_address': u"%s -- %s" % (
                        (r.parcel_reception_receiver_partner_id.residence_city_id.name or ""),
                        (r.parcel_reception_receiver_partner_id.street or ""))
                })

    ##------------------- ORM
    @api.model
    def create(self, vals):
        vals.update({'shipping_price': 0.0})
        shipping = super(RoadShipping, self).create(vals)
        receiver_source = vals.get('receiver_source', None)
        register_receiver = vals.get('register_receiver', False)

        if receiver_source == 'manual' and register_receiver:
            partner_obj, user_obj, \
                cat_obj, comp_obj = self.get_model_pool(
                ['res.partner', 'res.users', 'res.partner.category', 'res.company'])
            email = vals.get('receiver_email_set')
            mobile = vals.get('receiver_phone_set')
            city_id = vals.get('receiver_city_id')
            name = vals.get('receiver_name_set')
            image_1920 = vals.get('image_1920')
            partners = partner_obj.search([('email', '=', email)], limit=1)
            category = cat_obj.search([('name', '=', 'RECEIVER')], limit=1)
            if partners:  ##Update
                if not partners.mobile: partners.sudo().write({'mobile': mobile})
                if partners.mobile != mobile and partners.mobile != '': partners.sudo().write(
                    {'mobile': u"%s/%s" % (partners.mobile, mobile)})
                if not partners.residence_city_id: partners.sudo().write({'residence_city_id': city_id})
            else:  ##On create
                partner_vals = {
                    'name': name, 'email': email,
                    'image_1920': image_1920.decode('utf-8') if image_1920 else None,
                    'mobile': mobile, 'residence_city_id': city_id,
                    'street': vals.get('receiver_street_set'), 'category_id': [(6, 0, [category.id])],
                    'is_receiver': True, 'color': randint(1, 11), 'type': 'contact',
                }

                partner = partner_obj.sudo().create(partner_vals)
                str = "%s%s%s" % (string.ascii_lowercase, '0123456789', string.ascii_uppercase)
                group_portal_id = self.env['ir.model.data'].sudo()._xmlid_to_res_id('base.group_portal',
                                                                                    raise_if_not_found=False)
                user_vals = {
                    'login': email, 'name': name, 'partner_id': partner.id,
                    'password': ''.join(random.choice(str) for i in range(12)),
                    'company_id': comp_obj.search([('name', '=', 'HUBKILO')],
                                                  limit=1).id or self.env.user.company_id.id,
                    'groups_id': [(6, 0, [group_portal_id])],
                }
                user_obj.sudo().create(user_vals)

                shipping.write({'receiver_partner_id': partner.id, 'receiver_source': 'database'})

        shipping.partner_id.in_update()

        return shipping

    def write(self, vals):
        res = super(RoadShipping, self).write(vals)
        partner_obj, user_obj, \
            cat_obj, comp_obj = self.get_model_pool(
            ['res.partner', 'res.users', 'res.partner.category', 'res.company'])
        receiver_source = vals.get('receiver_source', None)
        register_receiver = vals.get('register_receiver', False)

        if receiver_source == 'manual' and register_receiver:
            email = vals.get('receiver_email_set')
            mobile = vals.get('receiver_phone_set')
            city_id = vals.get('receiver_city_id')
            name = vals.get('receiver_name_set')
            image_1920 = vals.get('image_1920')
            partners = partner_obj.search([('email', '=', email)], limit=1)
            category = cat_obj.search([('name', '=', 'RECEIVER')], limit=1)
            if partners:  ##Update
                if not partners.mobile: partners.sudo().write({'mobile': mobile})
                if partners.mobile != mobile and partners.mobile != '': partners.sudo().write(
                    {'mobile': u"%s/%s" % (partners.mobile, mobile)})
                if not partners.residence_city_id: partners.sudo().write({'residence_city_id': city_id})
            else:  ##On create
                partner_vals = {
                    'name': name, 'email': email,
                    'image_1920': image_1920.decode('utf-8') if image_1920 else None,
                    'mobile': mobile, 'residence_city_id': city_id,
                    'street': vals.get('receiver_street_set'), 'category_id': [(6, 0, [category.id])],
                    'is_receiver': True, 'color': randint(1, 11), 'type': 'contact',
                }

                partner = partner_obj.sudo().create(partner_vals)
                str = "%s%s%s" % (string.ascii_lowercase, '0123456789', string.ascii_uppercase)
                group_portal_id = self.env['ir.model.data'].sudo()._xmlid_to_res_id('base.group_portal',
                                                                                    raise_if_not_found=False)
                user_vals = {
                    'login': email, 'name': name, 'partner_id': partner.id,
                    'password': ''.join(random.choice(str) for i in range(12)),
                    'company_id': comp_obj.search([('name', '=', 'HUBKILO')],
                                                  limit=1).id or self.env.user.company_id.id,
                    'groups_id': [(6, 0, [group_portal_id])],
                }
                user_obj.sudo().create(user_vals)

                super(RoadShipping, self).write({'receiver_partner_id': partner.id, 'receiver_source': 'database'})

        return res

    ##-------------------- MISC
    @api.onchange('receiver_partner_id')
    def onchange_receiver_partner(self):
        if not self.receiver_partner_id: return None

        self.receiver_city_id = self.receiver_partner_id.residence_city_id.id

    @api.onchange('partner_id')
    def onchange_partner(self):
        if not self.partner_id: return None
        cursor = self.env.cr
        my_partner = self.get_model_pool('res.partner').browse(self.partner_id.id)

        sql_text = "UPDATE res_partner SET is_my_receiver=%s WHERE is_receiver=%s"
        cursor.execute(sql_text, (False, True))

        for receiver in my_partner.mapped('receiver_partner_ids'):
            sql_text = "UPDATE res_partner SET is_my_receiver=%s WHERE id=%s"
            cursor.execute(sql_text, (True, receiver.id))

    @api.onchange('receiver_source')
    def onchange_receiver_source(self):
        if not self.receiver_source: return None

        if self.receiver_source == 'manual':
            self.register_receiver = True
        else:
            self.register_receiver = False

    @api.model
    def _get_hubkilofees(self, shipping_price):
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        config_amount_type = resconfigvalues['hk_base_config_amount_type']

        if config_amount_type == 'fixed':
            base_cost = float(resconfigvalues['hk_base_config_amount_fixed'])
        else:
            percentage = resconfigvalues['hk_base_config_percentage']
            base_cost = round(float(percentage) * float(shipping_price) / 100, 2)

        return base_cost

    ##----------------- WKF
    def set_to_accepted(self):
        def _get_income_product_account(product):
            return product.property_account_income_id or product.categ_id.property_account_income_categ_id

        def _get_expense_product_account(product):
            return product.property_account_expense_id or product.categ_id.property_account_expense_categ_id

        def _remove_partner_in_move_line(invoice):
            invoice.mapped('line_ids').filtered(lambda l: l.account_id.internal_type not in ['receivable', 'payable']). \
                write({'partner_id': False})

            return invoice

        self.ensure_one()

        if self.state not in ['pending']:
            text = _(u"Workflow error : Only shipping on a pending status can be upgraded to accepted status!")
            raise UserError(text)

        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        payment_method = resconfigvalues['hk_base_config_payment_method']
        cursor = self.env.cr
        obj_list = ['account.move', 'account.move.line', 'res.partner', 'product.product',
                    'account.payment.register', 'account.payment']
        inv_obj, invl_obj, prt_obj, product_obj, \
            preg_obj, accpay_obj = self.get_model_pool(obj_list)

        ##----------------- INV FOR HUBKILO
        ##*********** CREATE AND VALIDATE
        # partner_hubkilo = prt_obj.search([('ref', '=', 'HUBKILO')], limit=1)
        pbank_ids = self.partner_id.mapped('bank_ids')
        hbk_sh_product = product_obj.search([('default_code', '=', 'HBK-SHFEES')], limit=1)
        taxes_ids = hbk_sh_product.mapped('taxes_id.id')
        invl_vals = {
            'account_id': _get_income_product_account(hbk_sh_product).id,
            'name': hbk_sh_product.name, 'quantity': 1.0,
            'price_unit': self.shipping_price, 'discount': 0.0,
            'date_maturity': fields.Date.today(), 'currency_id': self.currency_id.id,
            'product_uom_id': hbk_sh_product.uom_id.id, 'product_id': hbk_sh_product.id,
            'tax_ids': len(taxes_ids) != 0 and [(6, 0, taxes_ids)] or None,
        }

        inv_vals = {
            'ref': self.partner_id.ref,
            'narration': u"HUBKILO Fees for %s - %s" % (self.travelbooking_id.code, self.name),
            'move_type': 'out_invoice', 'currency_id': self.currency_id.id,
            'partner_id': self.partner_id.id,
            'invoice_line_ids': [(0, 0, invl_vals)],
            'partner_bank_id': pbank_ids and pbank_ids[0].id or False,
            # 'fiscal_position_id': partner_hubkilo.property_account_position_id.id or False,
            # 'invoice_user_id': partner_hubkilo.related_user_id.id or False,
            'invoice_date': fields.Date.today(), 'invoice_date_due': fields.Date.today(),
            'invoice_origin': self.name,
            'invoice_payment_term_id': self.partner_id.property_payment_term_id.id or False,
            'travelbooking_id': self.travelbooking_id.id,
            'shipping_id': self.id,
        }
        hubkilo_inv = inv_obj.create(inv_vals)
        hubkilo_inv.sudo().action_post()
        # hubkilo_inv.action_invoice_sent()
        hubkilo_inv.sudo().force_to_generate_payment_link()

        ##INV FOR TRAVELER
        partner_traveler = self.travelbooking_id.partner_id
        pbank_ids = partner_traveler.mapped('bank_ids')
        hbk_tr_product = product_obj.search([('default_code', '=', 'HBK-TRFEES')], limit=1)
        taxes_ids = hbk_tr_product.mapped('taxes_id.id')
        invl_vals = {
            'account_id': _get_expense_product_account(hbk_tr_product).id,
            'name': hbk_tr_product.name, 'quantity': 1.0,
            'price_unit': hubkilo_inv.amount_total, 'discount': 0.0,
            'date_maturity': fields.Date.today(), 'currency_id': self.currency_id.id,
            'product_uom_id': hbk_tr_product.uom_id.id, 'product_id': hbk_tr_product.id,
            'tax_ids': len(taxes_ids) != 0 and [(6, 0, taxes_ids)] or None,
        }

        hbk_product = product_obj.search([('default_code', '=', 'HBK-FEES')], limit=1)
        taxes_ids = hbk_product.mapped('taxes_id.id')
        hubilo_amount = self._get_hubkilofees(hubkilo_inv.amount_total)
        invl_vals2 = {
            'account_id': _get_income_product_account(hbk_product).id,
            'name': hbk_product.name, 'quantity': 1.0,
            'price_unit': hubilo_amount * -1, 'discount': 0.0,
            'date_maturity': fields.Date.today(), 'currency_id': self.currency_id.id,
            'product_uom_id': hbk_product.uom_id.id, 'product_id': hbk_product.id,
            'tax_ids': len(taxes_ids) != 0 and [(6, 0, taxes_ids)] or None,
        }

        inv_vals = {
            'ref': partner_traveler.ref,
            'narration': u"HUBKILO due for traveler %s - %s" % (self.travelbooking_id.code, self.name),
            'move_type': 'in_invoice', 'currency_id': self.currency_id.id,
            'partner_id': partner_traveler.id,
            'invoice_line_ids': [(0, 0, invl_vals), (0, 0, invl_vals2)],
            'partner_bank_id': pbank_ids and pbank_ids[0].id or False,
            'invoice_date_due': fields.Date.today(), 'invoice_date': fields.Date.today(),
            'invoice_origin': u"%s - %s" % (self.travelbooking_id.code, self.name),
            'invoice_payment_term_id': partner_traveler.property_supplier_payment_term_id.id or False,
            'travelbooking_id': self.travelbooking_id.id,
            'shipping_id': self.id,
        }
        travel_inv = inv_obj.create(inv_vals)
        # travel_inv.sudo().action_post()

        self.write({'state': 'accepted', 'move_id': hubkilo_inv.id})

        if payment_method == 'manual': return True

        return True

    def set_to_rejected(self):
        for r in self:
            if r.state not in ['pending']:
                text = _(u"Workflow error : Only shipping on a pending status can be upgraded to rejected status!")
                raise UserError(text)

        self.write({'state': 'rejected'})

    def set_to_pending(self):
        for r in self:
            if r.state not in ['rejected']:
                text = _(u"Workflow error : Only shipping on a rejected status can be upgraded to pending status!")
                raise UserError(text)

        self.write({'state': 'pending'})

    def set_to_confirm(self):
        for r in self:
            if r.state not in ['paid']:
                text = _(u"Workflow error : Only shipping on in Paid status can be upgraded to Received status!")
                raise UserError(text)

            if not r.is_paid:
                text = _(u"Workflow error : This shipping is awaiting for payment you cannot confirm!")
                raise UserError(text)

        self.write({'state': 'confirm'})

    def set_to_received(self):
        for r in self:
            if r.state not in ['confirm']:
                text = _(u"Workflow error : Only shipping on a Received status can be upgraded to Delivered status!")
                raise UserError(text)

            if not r.is_paid:
                text = _(
                    u"User error : You cannot set this shipping to a Receive status because the shipping is'nt paid yet!")
                raise UserError(text)

            r._validate_traveler_invoice()

        self.write({'state': 'received'})

    def test_paid(self):
        if any(self.filtered(lambda s: s.state not in ['accepted'])):
            text = _(
                u"User error : You cannot pay for a shipment that is not in Shipped status! ")
            raise UserError(text)

        # if not invoice:
        #     iargs = [('shipping_id', '=', self.id), ('travelbooking_id', '=', self.travelbooking_id.id),
        #              ('partner_id', '=', self.partner_id.id), ('move_type', '=', 'out_invoice'),
        #              ('state', '=', 'posted'), ('payment_state', '=', 'paid')]
        #
        #     invoice = inv_obj.search(iargs, limit=1)

        if not self.move_id:
            text = _(
                u"User error : You cannot pay this shipping because the related shipper invoice is'nt paid yet! ")
            raise UserError(text)

        return self

    def set_to_paid(self):
        self.ensure_one()
        return self.test_paid().write({'is_paid': True, 'state': 'paid'})  # 'move_id': hubkilo_inv.id,

    def _validate_traveler_invoice(self):
        inv_obj = self.get_model_pool('account.move')
        iargs = [('partner_id', '=', self.travelbooking_id.partner_id.id),
                 ('shipping_id', '=', self.id),
                 ('travelbooking_id', '=', self.travelbooking_id.id),
                 ('state', '=', 'draft')]
        invoices = inv_obj.search(iargs)

        if invoices:
            invoices.sudo().action_post()

        return invoices or None


class AccountMove(models.Model):
    _name = "account.move"
    _inherit = "account.move"

    travelbooking_id = fields.Many2one('m1st_hk_roadshipping.travelbooking', string="Travel booking",
                                       readonly=True, )

    shipping_id = fields.Many2one('m1st_hk_roadshipping.shipping', string="Shipping",
                                  readonly=True, )

    payment_link = fields.Char(string="Payement Link", readonly=True, )


    # @api.depends('payment_state')
    # def mark_shipping_as_paid(self):
    #     for move in self:
    #         if move.payment_state == 'paid' and move.move_type == 'out_invoice' and move.shipping_id and move.shipping_id.state == 'accepted':
    #             move.shipping_id.set_to_paid()

    @api.model
    def mark_shipping_as_paid(self):
        iargs = [('payment_state', 'in', ['paid']),
                 ('move_type', '=', 'out_invoice')]
        # ('shipping_id', 'not in', [False, None]),
        # ('shipping_id.state', 'in', ['accepted']),
        invoices = self.search(iargs)
        # print ('invoices', invoices)
        for inv in invoices:
            if inv.shipping_id:
                if inv.shipping_id.state in ['accepted']:
                    inv.shipping_id.set_to_paid()

    def write(self, vals):
        res = super(AccountMove, self).write(vals)
        self.mark_shipping_as_paid()
        return res

    def force_to_generate_payment_link(self):
        plwiz_obj = self.env.get('payment.link.wizard')
        ctx = dict(self._context, active_id=self.id, active_model='account.move')
        fields_list = ['res_model', 'res_id', 'amount', 'amount_max',
                       'currency_id', 'partner_id', 'description', 'acquirer_id']

        plwiz_vals = plwiz_obj.with_context(ctx).default_get(fields=fields_list)
        plwiz_rec = plwiz_obj.create(plwiz_vals)

        if not plwiz_rec.link: plwiz_rec._compute_values()

        self.payment_link = plwiz_rec.link
