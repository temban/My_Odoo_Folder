# -*- coding: utf-8 -*-
## PYTHON BUILT_IN IMPORT
from datetime import datetime, date
import time
from random import randint
import websockets
import asyncio
import json
import threading
import ssl

## ODOO IMPORT
from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError
from odoo.addons.Shintheo_Websocket.models import server_models



class TravelBooking(models.Model):
    _name = 'm1st_hk_roadshipping.travelbooking'
    _inherit = 'm0sthk.base'
    _description = 'Booking of travels'
    _rec_name = 'code'

    ##------------------- DEFAULTS
    @api.model
    def _get_default_code(self):
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        travel_format_code = resconfigvalues['hk_base_config_travel_format_code']
        format_code_length = int(resconfigvalues['hk_base_config_format_code_length'])
        start = "%s-01-01" % time.strftime('%Y')
        end = "%s-12-31" % time.strftime('%Y')
        count = self.search_count([('booking_date', '>=', start), ('booking_date', '<=', end)]) + 1
        count = self._get_num_code(count=count, seq=format_code_length)

        if travel_format_code == 'travel_year_num':
            return u"TRAVEL/%s/%s" % (time.strftime('%Y'), count)
        elif travel_format_code == 'travel_num_year':
            return u"TRAVEL/%s/%s" % (count, time.strftime('%Y'))
        else:
            return u"%s/TRAVEL/%s" % (count, time.strftime('%Y'))

    @api.model
    def _get_default_sender(self):
        partner_obj = self.env.get('res.partner')
        pargs = [('related_user_id', '=', self.env.user.id)]
        return partner_obj.search(pargs, limit=1)

    @api.model
    def _get_local_currency(self):
        return self.env.user.company_id.currency_id

    @api.model
    def _get_default_departure_city(self):
        partner_obj = self.env.get('res.partner')
        pargs = [('related_user_id', '=', self.env.user.id)]
        return partner_obj.search(pargs, limit=1).residence_city_id

    @api.model
    def _get_default_color(self):
        return randint(1, 11)

    ##-------------------- CONSTRAINS
    # @api.constrains('partner_id')

    @api.constrains('partner_id', 'state')
    def _check_partner_travel_state(self):
        for r in self:
            args = [('partner_id', '=', r.partner_id.id),
                    ('state', 'in', ['negotiating']), ('id', '!=', r.id)]
            doubles = self.search(args)

            if doubles:
                text = _(
                    u"Validation Error :  You cannot have simultaneous on system two Travels in Negotiation status! Close one of them first and try again")
                raise ValidationError(text)

        return True

    ##--------------------- COMPUTED
    @api.depends('shipping_ids')
    def _compute_shipping_ref(self):
        for r in self:
            shippings = r.mapped('shipping_ids')
            luggage_ids = shippings.mapped('luggage_ids')
            price_total = sum(shippings.filtered(lambda s: s.state == 'accepted').mapped('shipping_price'))
            total_weight = sum(luggage_ids and luggage_ids.mapped('average_weight') or [0])
            shipping_count = len(shippings) or 0

            r.update({'booking_price': price_total,
                      'luggage_ids': luggage_ids and luggage_ids.mapped('id') or None,
                      'total_weight': total_weight,
                      'shipping_count': shipping_count, })

    @api.depends('partner_id', 'computed', 'code')
    def _compute_currency(self):
        obj_list = ['res.currency', 'res.company']
        currency_obj, company_obj = self.get_model_pool(obj_list)
        company_def = company_obj.search([('name', '=', 'HUBKILO')], limit=1)
        resconfigvalues = self.env.get('res.config.settings').get_values()
        val = resconfigvalues['hk_base_config_currency_id']
        curr = currency_obj.browse(int(val))

        for r in self:
            r.local_currency_id = company_def.currency_id == curr and curr.id or company_def.currency_id.id

    @api.depends('shipping_ids', 'state', 'computed')
    def _get_invoices(self):
        for r in self:
            invoices = r.mapped('shipping_ids.move_id').filtered(lambda m: m.state not in ['cancel'])
            r.update( {'move_ids': invoices  or None,
                       'invoice_count': invoices and len(invoices) or 0, } )


    @api.depends('travelmessage_ids')
    def _compute_messages_num(self):
        for r in self:
            r.message_count = len( r.mapped('travelmessage_ids.id') )


    ##--------------------- FIELDS
    name = fields.Char(string="Booking title", required=True, readonly=True,
                       help="The default title for this Booking", default="/",
                       states={'pending': [('readonly', False), ], }, )

    code = fields.Char(string='Booking code', readonly=True, default=_get_default_code)

    booking_date = fields.Date(string="Booking date", required=True, default=fields.Date.today(),
                               readonly=True, states={'pending': [('readonly', False), ], }, )

    partner_id = fields.Many2one('res.partner', string="Sender", readonly=True, required=True,
                                 default=_get_default_sender, )

    shipping_ids = fields.One2many('m1st_hk_roadshipping.shipping', inverse_name='travelbooking_id',
                                   readonly=True, )

    travelmessage_ids = fields.One2many('m1st_hk_roadshipping.travelmessage', 'travelbooking_id',
                                        string='Messages',
                                        states={'completed': [('readonly', True), ], }, )

    booking_type = fields.Selection([('road', "Road")], string="Booking Type",
                                    required=True, default='road',
                                    readonly=True, states={'pending': [('readonly', False), ], }, )

    luggage_ids = fields.One2many('m1st_hk_roadshipping.luggage', compute='_compute_shipping_ref',
                                  string="Lugagges", readonly=True, )

    total_weight = fields.Float(compute='_compute_shipping_ref', string="Average total weight",
                                readonly=True, help="This is the average total weight of luggages")

    booking_price = fields.Monetary(compute='_compute_shipping_ref', string='Total Shipping price', digits=(16, 2),
                                    currency_field='local_currency_id', store=True, )

    local_currency_id = fields.Many2one(comodel_name='res.currency', string="Local currency",
                                        default=_get_local_currency, readonly=True,
                                        compute='_compute_currency', store=True,
                                        help="This is the local currency for financial transactions", )

    departure_city_id = fields.Many2one('res.city', string="Departure town", required=True,
                                        default=_get_default_departure_city, )

    arrival_city_id = fields.Many2one('res.city', string="Arrival town", required=True, )

    departure_date = fields.Datetime(string='Departure date', required=True,
                                     default=fields.Datetime.now(),
                                     readonly=True, states={'pending': [('readonly', False), ], }, )

    arrival_date = fields.Datetime(string='Arrival date', required=True,
                                   readonly=True, states={'pending': [('readonly', False), ], }, )
    travel_due = fields.Boolean(string='Travel due')

    state = fields.Selection([
        ('pending', 'Pending / Draft'),
        ('negotiating', 'Published'),
        ('accepted', 'Accepted / Running'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected / Cancelled'),

    ], string='Status', default='pending')

    move_ids = fields.One2many(compute='_get_invoices', comodel_name='account.move', readonly=True, )

    color = fields.Integer(string='Color Index', default=_get_default_color)

    shipping_count = fields.Integer(compute='_compute_shipping_ref', string="Number of shippings", store=True,
                                    readonly=True, help="This is the number of shipping(s) related to this Travel")

    message_count = fields.Integer(compute='_compute_messages_num', string="Number of messages", store=True,
                                    readonly=True, help="This is the number of messages(s) related to this Travel")

    invoice_count = fields.Integer(compute='_get_invoices', string="Number of invoices", store=True,
                                   readonly=True, help="This is the number of invoice(s) related to this Travel")

    ##--------------- ORM
    @api.model
    def create(self, vals):
        Travel = super(TravelBooking, self).create(vals)

        if not Travel.partner_id.is_traveler:
            Travel.partner_id.is_traveler = True
            Travel.partner_id.in_update()

        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        validate_travel = resconfigvalues['hk_base_config_auto_validate_travel']

        if validate_travel: Travel.set_to_negotiating()

        return Travel

    # def travels_socket(self, data, room):
    #     async def websocket_logic():
    #         uri = f"wss://preprod.hubkilo.com:9090//{room}"  # Replace with your WebSocket server's URI and room identifier
    #         ssl_context = ssl.SSLContext()
    #         ssl_context.check_hostname = False  # Disable hostname verification
    #         ssl_context.verify_mode = ssl.CERT_NONE
    #
    #         async with websockets.connect(uri, ssl=ssl_context) as websocket:
    #             await websocket.send(json.dumps(data))
    #             print("Sent message...")
    #
    #             # Keep the connection open and handle incoming messages
    #             async for message in websocket:
    #                 # Handle the incoming message here
    #                 print(f"Received message: {message}")
    #
    #     # Start a new thread to run the asynchronous code
    #     asyncio_thread = threading.Thread(target=lambda: asyncio.run(websocket_logic()))
    #     asyncio_thread.start()


    ##------------------------ WKF
    def set_to_pending(self):
        for r in self:
            if r.state not in ['rejected']:
                text = u"Workflow error : Only trips with rejected status can be upgraded to pending status"
                raise ValidationError(_(text))

        self.write({'state': 'pending'})

    def set_to_rejected(self):
        for r in self:
            if r.state not in ['pending']:
                text = u"Workflow error : Only trips with pending status can be upgraded to rejected status"
                raise ValidationError(_(text))

            if len(r.mapped('shipping_ids')) > 0:
                text = u"Workflow error : You cannot cancel a travel with active Shippings! Move shippings first before to continue"
                raise ValidationError(_(text))

        self.write({'state': 'rejected'})


    def set_to_negotiating(self):
        for r in self:
            if r.state not in ['pending']:
                text = u"Workflow error : Only trips with pending status can be upgraded to negotiation status"
                raise ValidationError(_(text))

            r._check_attachment_conformity()
        for Travel in self:
            exist = bool(Travel.partner_id.image_1920)
            room = "all_rooms"
            travel_data = {
                'id': Travel.id,
                'partner_id': [Travel.partner_id.id, Travel.partner_id.name],
                'state': 'negotiating',
                'average_rating': Travel.partner_id.average_rating,
                'travel_due': Travel.travel_due,
                'booking_date': Travel.booking_date.strftime('%Y-%m-%d'),
                'shipping_ids': [(shipping.id, shipping.name) for shipping in Travel.shipping_ids],
                'travelmessage_ids': [(message.id, message.name) for message in Travel.travelmessage_ids],
                'booking_type': Travel.booking_type,
                'departure_city_id': [
                    Travel.departure_city_id.id,
                    Travel.departure_city_id.name + " (" + Travel.departure_city_id.country_name + ")",
                ],
                'arrival_city_id': [
                    Travel.arrival_city_id.id,
                    Travel.arrival_city_id.name + " (" + Travel.arrival_city_id.country_name + ")",
                ],
                'departure_date': Travel.departure_date.strftime('%Y-%m-%d'),
                'arrival_date': Travel.arrival_date.strftime('%Y-%m-%d'),

                # Add all the model fields here
                'name': Travel.name,
                'code': Travel.code,
                'luggage_ids': [(luggage.id, luggage.name) for luggage in Travel.luggage_ids],
                'total_weight': Travel.total_weight,
                'booking_price': Travel.booking_price,
                'local_currency_id': [Travel.local_currency_id.id, Travel.local_currency_id.currency_unit_label],
                'partner_image_1920': exist,
                'move_ids': [(move.id, move.name) for move in Travel.move_ids],
                'socket_operation': 'UPDATE'
            }
            server_models.server_websocket_call(travel_data, room)
        self.write({'state': 'negotiating'})


    def set_to_accepted(self):
        for r in self:
            if r.state not in ['negotiating']:
                text = u"Workflow error : Only trips with negotiation status can be upgraded to accepted status"
                raise ValidationError(_(text))

        ##            if r.booking_price == 0:
        ##                text= u"Workflow error : You cannot upgrade status to accepted with a null shipping price"
        ##                raise ValidationError( _(text) )

        self.write({'state': 'accepted'})

        self.in_update()

    def set_to_completed(self):
        for r in self:
            if r.state not in ['accepted']:
                text = u"Workflow error : Only trips with accepted status can be upgraded to completed status"
                raise ValidationError(_(text))

            if any(r.mapped('shipping_ids').filtered(lambda s: s.state not in ['received'])):
                text = u"Workflow error : This trip cannot be mark as completed because all related shippings aren't to a Received status"
                raise ValidationError(_(text))

        self.write({'state': 'completed'})

        self.in_update()


    def _check_attachment_conformity(self):
        for r in self:
            attachments = r.partner_id.sudo().mapped('partner_attachment_ids'). \
                filtered(lambda att: att.attach_custom_type in ['cni', 'passport'])

            if not attachments:
                text = _(
                    u"Validation Error :  You cannot register a travel without saving first your ID Card or Passport!")
                raise ValidationError(text)

            if any(attachments.filtered(lambda t: not t.validity or not t.conformity)):
                text = _(u"Validation Error :  Your ID card or Passport expired or is not conform!")
                raise ValidationError(text)

        return True

    def action_view_shipping(self, shippings=False):
        self.ensure_one()
        ship_obj = self.get_model_pool('m1st_hk_roadshipping.shipping')

        if not shippings:
            shippings = ship_obj.search([('travelbooking_id', '=', self.id)]) #('state', 'not in', ['pending', 'rejected'])
            # self.sudo()._read(['invoice_ids'])
            # invoices = self.invoice_ids

        result = self.env['ir.actions.act_window']._for_xml_id('m1st_hk_roadshipping.action_view_m1st_hk_roadshipping_shipping_kanban')
        # choose the view_mode accordingly
        if len(shippings) > 1:
            result['domain'] = [('id', 'in', shippings.ids)]
        elif len(shippings) == 1:
            res = self.env.ref('m1st_hk_roadshipping.view_m1st_hk_roadshipping_shipping_form', False)
            #form_view = [(res and res.id or False, 'form')]
            result['views'] = [(res and res.id or False, 'form')]
            # if 'views' in result:
            #     result['views'] = form_view + [(state, view) for state, view in result['views'] if view != 'form']
            # else:
            #     result['views'] = form_view
            result['res_id'] = shippings.id
        else:
            result = {'type': 'ir.actions.act_window_close'}

        return result



    def action_view_message(self, messages=False):
        self.ensure_one()
        msg_obj = self.get_model_pool('m1st_hk_roadshipping.travelmessage')

        if not messages:
            messages = msg_obj.search([('travelbooking_id', '=', self.id)])

        result = self.env['ir.actions.act_window']._for_xml_id('m1st_hk_roadshipping.action_view_m1st_hk_roadshipping_travelmessage_tree')
        # choose the view_mode accordingly
        if len(messages) >= 1:
            result['domain'] = [('id', 'in', messages.ids)]
        # elif len(messages) == 1:
        #     res = self.env.ref('m1st_hk_roadshipping.view_m1st_hk_roadshipping_shipping_form', False)
        #     #form_view = [(res and res.id or False, 'form')]
        #     result['views'] = [(res and res.id or False, 'form')]
        #     # if 'views' in result:
        #     #     result['views'] = form_view + [(state, view) for state, view in result['views'] if view != 'form']
        #     # else:
        #     #     result['views'] = form_view
        #     result['res_id'] = messages.id
        else:
            result = {'type': 'ir.actions.act_window_close'}

        return result


    def action_view_invoice(self, invoices=False):
        self.ensure_one()
        move_obj = self.get_model_pool('account.move')
        if not invoices:
            invoices = move_obj.search([('travelbooking_id', '=', self.id)]) #('state', 'not in', ['cancel'])

        result = self.env['ir.actions.act_window']._for_xml_id('account.action_move_in_invoice_type')
        # choose the view_mode accordingly
        if len(invoices) > 1:
            result['domain'] = [('id', 'in', invoices.ids)]
        elif len(invoices) == 1:
            res = self.env.ref('account.view_move_form', False)
            form_view = [(res and res.id or False, 'form')]
            if 'views' in result:
                result['views'] = form_view + [(state, view) for state, view in result['views'] if view != 'form']
            else:
                result['views'] = form_view
            result['res_id'] = invoices.id
        else:
            result = {'type': 'ir.actions.act_window_close'}

        return result