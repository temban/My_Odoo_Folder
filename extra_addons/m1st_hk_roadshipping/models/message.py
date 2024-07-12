# -*- coding: utf-8 -*-
## PYTHON BUILT_IN IMPORT
from datetime import datetime, date
import re
## ODOO IMPORT
from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError
# from odoo.addons.Shintheo_Websocket.models import server_models
import websockets
import asyncio
import json
import threading
import ssl


class TravelMessage(models.Model):
    _name = 'm1st_hk_roadshipping.travelmessage'
    _inherit = 'm0sthk.base'
    _description = 'Messaging Model'

    ##---------------- CONSTRAINS
    @api.constrains('price')
    def _check_price(self):
        for r in self:
            if r.price <= 0:
                text = _(u"Negative or null value is not allowed for the price")
                raise ValidationError(text)

        return True

    ##-------------------- COMPUTE
    @api.depends('travelbooking_id.partner_id', 'shipping_id.partner_id')
    def _compute_partner_ref(self):
        for r in self:
            r.update({'travel_partner_id': r.travelbooking_id.partner_id.id,
                      'shipping_partner_id': r.shipping_id.partner_id.id})

    ##---------------- FIELDS
    travelbooking_id = fields.Many2one('m1st_hk_roadshipping.travelbooking',
                                       string='Travel Booked', )

    shipping_id = fields.Many2one('m1st_hk_roadshipping.shipping', string="Shipping", )

    travel_partner_id = fields.Many2one(comodel_name='res.partner', compute='_compute_partner_ref',
                                        string='Sender', readonly=True, store=True, )

    shipping_partner_id = fields.Many2one(comodel_name='res.partner', compute='_compute_partner_ref',
                                          string='Receiver', readonly=True, store=True, )

    sender_partner_id = fields.Many2one(comodel_name='res.partner', string='Sender', required=True, )

    receiver_partner_id = fields.Many2one(comodel_name='res.partner', string='Receiver', required=True, )

    price = fields.Float(string='Message(Price)', required=True, default=1.0,
                         readonly=True,
                         states={'draft': [('readonly', False), ], }, )

    date = fields.Datetime(string='Date', default=fields.Datetime.now(), required=True,
                           readonly=True, )

    name = fields.Char(string="Short description", required=True, default="/",
                       readonly=True,
                       states={'draft': [('readonly', False), ], }, )

    parent_id = fields.Many2one('m1st_hk_roadshipping.travelmessage', index=True,
                                string="Parent message")

    child_ids = fields.One2many('m1st_hk_roadshipping.travelmessage', 'parent_id', string="Childs messages", )

    state = fields.Selection([('draft', "Draft"), ('validate', "Approve")],
                             string="State", default='draft', readonly=True,
                             required=True, )

    shipper_validate = fields.Boolean(string="Is Shipper validated?", readonly=True, )

    msg_flow = fields.Selection([('trav_ship', u"Traveler -> Shipper"),
                                 ('ship_trav', u"Shipper -> Traveler"), ],
                                string="Message flow", required=True, default='trav_ship', )

    mail_channel_id = fields.Many2one('mail.channel', string="Channel ID", readonly=True, )

    mail_record_name = fields.Char(string="Record name", readonly=True, )

    ##------------------ ORM
    @api.model
    def create(self, vals):
        if not vals.get('msg_flow', None):
            vals.update({'msg_flow': 'trav_ship'})
        # Create the TravelMessage record
        travelmessage = super(TravelMessage, self).create(vals)

        receiver_partner_id = self.env['res.partner'].sudo().search([('id', '=', int(travelmessage.receiver_partner_id.id))], limit=1)
        sender_partner_id = self.env['res.partner'].sudo().search([('id', '=', int(travelmessage.sender_partner_id.id))], limit=1)
        shipping_partner_id = self.env['res.partner'].sudo().search([('id', '=', int(travelmessage.shipping_partner_id.id))], limit=1)
        travel_partner_id = self.env['res.partner'].sudo().search([('id', '=', int(travelmessage.travel_partner_id.id))], limit=1)

        sender_image_exists = bool(sender_partner_id.image_1920)
        room = f"room{travelmessage.shipping_id.id}"
        message_data = {
            'id': travelmessage.id,
            'name': travelmessage.name,
            'date': travelmessage.date.strftime('%Y-%m-%d %H:%M:%S'),
            'price': travelmessage.price,
            'state': travelmessage.state,
            'shipper_validate': travelmessage.shipper_validate,
            'msg_flow': travelmessage.msg_flow,
            'child_ids': [child.name for child in travelmessage.child_ids],
            'travelbooking_id': travelmessage.travelbooking_id.id,
            'shipping_id': travelmessage.shipping_id.id,
            'mail_channel_id': travelmessage.mail_channel_id.name if travelmessage.mail_channel_id else None,
            'mail_record_name': travelmessage.mail_record_name,
            'parent_id': travelmessage.parent_id.name if travelmessage.parent_id else None,

            'sender_partner_id': [sender_partner_id.id, sender_partner_id.name],
            'receiver_partner_id': [receiver_partner_id.id, receiver_partner_id.name],
            'travel_partner_id': travel_partner_id.name if travel_partner_id.id else None,
            'shipping_partner_id': [shipping_partner_id.id, shipping_partner_id.name],
            'sender_image': sender_image_exists,
        }
        # server_models.server_websocket_call(message_data, room)
        # Return the created TravelMessage record
        return travelmessage


    ##------------------- WKF
    def mark_shipper_validation(self):
        self.ensure_one()
        self.shipper_validate = True

        ##J'envoie un mail message
        msg_obj = self.env.get('mail.message')

        # Mail.message
        mail_msg_vals = {
            'subject': u"%s - %s" % (self.shipping_id.travelbooking_id.code, self.shipping_id.name),
            'date': fields.Datetime.now(),
            'body': "<p>Shipper %s has validated the price [%s %s]</p>" % (
            self.shipping_id.partner_id.name, self.price, self.shipping_id.travelbooking_id.local_currency_id.symbol),
            'model': 'mail.channel',
            'res_id': self.mail_channel_id.id,
            'record_name': self.mail_record_name,
            'message_type': 'comment',
            'subtype_id': 1,
            'email_from': u"%s <%s>" % (self.shipping_id.partner_id.name, self.shipping_id.partner_id.email),
            'add_sign': True,
            'author_id': self.shipping_id.partner_id.id,
            'reply_to': u"%s <%s>" % (self.shipping_id.partner_id.name, self.shipping_id.partner_id.email),
        }

        mail_msg = msg_obj.create(mail_msg_vals)

        return True

    def messages_socket(self, data, room):
        async def websocket_logic():
            uri = f"wss://preprod.hubkilo.com:9090//{room}"  # Replace with your WebSocket server's URI and room identifier
            ssl_context = ssl.SSLContext()
            ssl_context.check_hostname = False  # Disable hostname verification
            ssl_context.verify_mode = ssl.CERT_NONE

            async with websockets.connect(uri, ssl=ssl_context) as websocket:
                await websocket.send(json.dumps(data))
                print("Sent message...")

                # Keep the connection open and handle incoming messages
                async for message in websocket:
                    # Handle the incoming message here
                    print(f"Received message: {message}")

            # Start a new thread to run the asynchronous code

        asyncio_thread = threading.Thread(target=lambda: asyncio.run(websocket_logic()))
        asyncio_thread.start()

    def set_to_validate(self):
        self.ensure_one()

        if not self.shipper_validate:
            text = _(
                u"Validation error : The price of the transaction cannot be validated without the shipper validating the price first")
            raise UserError(text)

        self.state = 'validate'
        self.shipping_id.shipping_price = self.price
        self.shipping_id.set_to_accepted()

        ##J'envoie un mail message
        msg_obj = self.env.get('mail.message')

        # Mail.message
        mail_msg_vals = {
            'subject': u"%s - %s" % (self.travelbooking_id.code, self.shipping_id.name),
            'date': fields.Datetime.now(),
            'body': "<p>Traveler %s has validated the price [%s %s]</p>" % (
            self.travelbooking_id.partner_id.name, self.price,
            self.shipping_id.travelbooking_id.local_currency_id.symbol),
            'model': 'mail.channel',
            'res_id': self.mail_channel_id.id,
            'record_name': self.mail_record_name,
            'message_type': 'comment',
            'subtype_id': 1,
            'email_from': u"%s <%s>" % (self.travelbooking_id.partner_id.name, self.travelbooking_id.partner_id.email),
            'add_sign': True,
            'author_id': self.travelbooking_id.partner_id.id,
            'reply_to': u"%s <%s>" % (self.travelbooking_id.partner_id.name, self.travelbooking_id.partner_id.email),
        }

        mail_msg = msg_obj.create(mail_msg_vals)

        return True


class Message(models.Model):
    _name = 'mail.message'
    _inherit = 'mail.message'

    @api.model_create_multi
    def create(self, values_list):
        messages = super(Message, self).create(values_list)
        pattern = "\\*[0-9]*\\.[0-9]*\\*"
        motif = re.compile(pattern)
        travel_obj = self.env.get('m1st_hk_roadshipping.travelbooking')
        ship_obj = self.env.get('m1st_hk_roadshipping.shipping')
        tmsg_obj = self.env.get('m1st_hk_roadshipping.travelmessage')
        ctx = dict(self._context, is_from_mail=True)

        for msg in messages:
            body = msg.body
            match = motif.search(body)
            amount = 0.0

            if match:
                body_part = re.split(pattern=pattern, string=body)
                for bp in body_part:
                    bp = re.escape(pattern=bp)
                    body = re.sub(bp, '', body, count=0, flags=0)

                ##Extract the amount
                final_body = re.sub('\\*', '', body, count=0, flags=0)
                amount = float(final_body)

            if amount > float(0):
                record_name = msg.record_name and msg.record_name.split(', ') or ''

                ##------ sender
                values_travelMessage = {
                    'sender_partner_id': msg.author_id.id,
                    'price': amount,
                    'mail_channel_id': msg.res_id,
                    'mail_record_name': "%s, %s" % (record_name[0], record_name[1]),
                }
                targs = [('partner_id', '=', msg.author_id.id),
                         ('state', 'in', ['negotiating']),
                         ('departure_date', '<=', fields.Date.today())]
                travelbooking = travel_obj.search(targs, limit=1)

                if travelbooking:  # sender is the traveler
                    # je check si le travel avait déjà les msg si oui le prend l'ancêtre
                    values_travelMessage.update({
                        'travelbooking_id': travelbooking.id,
                        'msg_flow': 'trav_ship',
                    })

                    if len(travelbooking.travelmessage_ids) > 0:
                        parents_msg = travelbooking.mapped('travelmessage_ids'). \
                            filtered(lambda m: m.parent_id is not None)
                        parent_msg = parents_msg and parents_msg[0]

                        values_travelMessage.update({
                            'shipping_id': parent_msg.shipping_id.id,
                            'parent_id': parent_msg.id,
                            'receiver_partner_id': parent_msg.receiver_partner_id.id,
                        })

                    else:
                        flag = False
                        for ship in travelbooking.mapped('shipping_ids'):
                            for recname in record_name:
                                if recname == ship.partner_id.name:
                                    values_travelMessage.update({
                                        'shipping_id': ship.id,
                                        'receiver_partner_id': ship.partner_id.id,
                                    })
                                    flag = True
                                    break
                        if not flag:
                            text = _(
                                u"Processing error : Unable to find related shipping for travel {%s}" % travelbooking.code)
                            raise UserError(text)


                else:  # means sender is the shipper
                    sargs = [('partner_id', '=', msg.author_id.id), ('state', 'in', ['pending']), ]
                    shippings = ship_obj.search(sargs)
                    flag = False

                    for ship in shippings:
                        for recname in record_name:
                            if recname == ship.travelbooking_id.partner_id.name:
                                values_travelMessage.update({
                                    'travelbooking_id': ship.travelbooking_id.id,
                                    'msg_flow': 'ship_trav',
                                    'shipping_id': ship.id,
                                    'receiver_partner_id': ship.travelbooking_id.partner_id.id,
                                })

                                flag = True

                                if len(ship.travelmessage_ids) > 0:
                                    parents_msg = ship.mapped('travelmessage_ids'). \
                                        filtered(lambda m: m.parent_id is not None)
                                    parent_msg = parents_msg and parents_msg[0]

                                    values_travelMessage.update({
                                        'parent_id': parent_msg.id,
                                    })
                                break

                    if not flag:
                        text = _(
                            u"Processing error : Unable to find related Travel for shipper {%s}" % msg.author_id.name)
                        raise UserError(text)

                ##Create msgTravel

                tmsg_obj.with_context(ctx).create(values_travelMessage)

        return messages
