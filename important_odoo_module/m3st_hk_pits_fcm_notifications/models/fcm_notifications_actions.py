# -*- coding: utf-8 -*-

## ODOO IMPORT
## PYTHON BUILT_IN IMPORT
from datetime import datetime, date
from random import randint
import random
import string
import time
from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError


class NotificationLog(models.Model):
    _name = "notification.log"
    _description = "Notification Log"

    sender_partner_id = fields.Many2one('res.partner', string='Partner Sent From')
    receiver_partner_id = fields.Many2one('res.partner', string='Receiver Partner')
    message_title = fields.Char(string='Message Title')
    message_body = fields.Text(string='Message Body')
    is_seen_sender = fields.Boolean(string='Sender Seen', default=False)
    is_seen_receiver = fields.Boolean(string='Receiver Seen', default=False)
    disable_sender = fields.Boolean(string='Sender Disabled', default=False)
    disable_receiver = fields.Boolean(string='Receiver Disabled', default=False)
    date = fields.Datetime(string='Date', default=lambda self: fields.Datetime.now(), readonly=True)


class ResPartner(models.Model):
    _inherit = 'res.partner'

    partner_notif_sent = fields.One2many('notification.log', 'sender_partner_id', string='Sent Notifications',
                                         domain=[('sender_partner_id', '!=', False)])

    partner_notif_received = fields.One2many('notification.log', 'receiver_partner_id', string='Received Notifications',
                                             domain=[('receiver_partner_id', '!=', False)])


class hkBase(models.Model):
    _name = "m0sthk.base"
    _inherit = 'm0sthk.base'

    @api.model
    def _hk_send_fcm_notification(self, msg_title, msg_body, shipping=None, travel=None):
        if not shipping and not travel:
            text = _(u"User Error : Unable to send notification! Set the Shipping record or the travel record!")
            raise UserError(text)

        if shipping:
            shipping.partner_id.generate_fcm_notification(message_title=msg_title, message_body=msg_body)
            shipping.travelbooking_id.partner_id.generate_fcm_notification(message_title=msg_title,
                                                                           message_body=msg_body)

        if travel:
            travel.partner_id.generate_fcm_notification(message_title=msg_title, message_body=msg_body)

    def _create_notification_log(self, sender_partner_id, receiver_partner_id, message_title, message_body):
        self.env['notification.log'].sudo().create({
            'sender_partner_id': sender_partner_id,
            'receiver_partner_id': receiver_partner_id,
            'message_title': message_title,
            'message_body': message_body,
            'is_seen_sender': False,
            'is_seen_receiver': False,
            'disable_sender': False,
            'disable_receiver': False,
        })


class TravelMessage(models.Model):
    _name = 'm1st_hk_roadshipping.travelmessage'
    _inherit = 'm1st_hk_roadshipping.travelmessage'

    @api.model
    def create(self, vals):
        ctx = self._context
        travelmsg = super(TravelMessage, self.with_context(ctx)).create(vals)
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        hkpits_notif_enabled = resconfigvalues['hkpits_notif_enabled']

        if hkpits_notif_enabled:
            message_title = resconfigvalues['hkpits_shipping_notif_price_submit_title']
            message_body = resconfigvalues['hkpits_shipping_notif_price_submit_body'] % (
                travelmsg.price, travelmsg.shipping_id.name, fields.Datetime.now())
            message_body += u" | Shipping ID:{%s}" % travelmsg.shipping_id.id
            # message_body += f" | Shipping ID: ##{travelmsg.shipping_id.id}"

            self._hk_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                           shipping=travelmsg.shipping_id)

            self._create_notification_log(travelmsg.sender_partner_id.id, travelmsg.receiver_partner_id.id,
                                          message_title, message_body)

        return travelmsg

    def mark_shipper_validation(self):
        res = super(TravelMessage, self).mark_shipper_validation()
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        hkpits_notif_enabled = resconfigvalues['hkpits_notif_enabled']

        if hkpits_notif_enabled:
            message_title = resconfigvalues['hkpits_shipping_notif_price_validate_by_shipper_title']
            message_body = resconfigvalues['hkpits_shipping_notif_price_validate_by_shipper_body'] % (
                self.price, self.shipping_id.name, fields.Datetime.now())
            message_body += u" | Shipping ID:{%s}" % self.shipping_id.id
            # message_body += f" | Shipping ID: ##{self.shipping_id.id}"

            self._hk_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                           shipping=self.shipping_id)
            self._create_notification_log(self.sender_partner_id.id, self.receiver_partner_id.id,
                                          message_title, message_body)

        return res

    def set_to_validate(self):
        res = super(TravelMessage, self).set_to_validate()
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        hkpits_notif_enabled = resconfigvalues['hkpits_notif_enabled']

        if hkpits_notif_enabled:
            message_title = resconfigvalues['hkpits_shipping_notif_price_validate_by_traveler_title']
            message_body = resconfigvalues['hkpits_shipping_notif_price_validate_by_traveler_body'] % (
                self.price, self.shipping_id.name, fields.Datetime.now())
            message_body += u" | Shipping ID:{%s}" % self.shipping_id.id
            # message_body += f" | Shipping ID: ##{self.shipping_id.id}"

            self._hk_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                           shipping=self.shipping_id)
            self._create_notification_log(self.sender_partner_id.id, self.receiver_partner_id.id,
                                          message_title, message_body)

        return res


class RoadShipping(models.Model):
    _name = 'm1st_hk_roadshipping.shipping'
    _inherit = 'm1st_hk_roadshipping.shipping'

    ##--------------------- ORM
    ##------------------- ORM
    @api.model
    def create(self, vals):
        shipping = super(RoadShipping, self).create(vals)
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        hkpits_notif_enabled = resconfigvalues['hkpits_notif_enabled']

        if hkpits_notif_enabled:
            message_title = resconfigvalues['hkpits_shipping_notif_create_title']
            message_body = resconfigvalues['hkpits_shipping_notif_create_body'] % (
                shipping.name, shipping.travelbooking_id.code, fields.Datetime.now())
            message_body += u" | Shipping ID:{%s}" % shipping.id
            # message_body += f" | Shipping ID: ##{shipping.id}"

            self._hk_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                           shipping=shipping)
            self._create_notification_log(shipping.partner_id.id, shipping.travelbooking_id.partner_id.id,
                                          message_title, message_body)

        return shipping

    def write(self, vals):
        # Call the parent class's write method
        res = super(RoadShipping, self).write(vals)

        # Check if 'is_rated' is in vals and is True
        if 'is_rated' in vals and vals['is_rated']:
            # Retrieve the configuration values
            resconfigvalues = self.env['res.config.settings'].get_values()
            hkpits_notif_enabled = resconfigvalues['hkpits_notif_enabled']

            if hkpits_notif_enabled:
                message_title = resconfigvalues['hkpits_shipping_notif_rated_title']

                for r in self:
                    message_body = resconfigvalues['hkpits_shipping_notif_rated_body'] % (
                        r.name, fields.Datetime.now())
                    message_body += u" | Shipping ID:{%s}" % r.id
                    self._hk_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                                   shipping=r)
                    self._create_notification_log(self.partner_id.id, self.travelbooking_id.partner_id.id,
                                                  message_title, message_body)

        return res

    def mark_traveler_disagree(self):
        self.ensure_one()
        super(RoadShipping, self).mark_traveler_disagree()

        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        hkpits_notif_enabled = resconfigvalues['hkpits_notif_enabled']

        if hkpits_notif_enabled:
            message_title = resconfigvalues['hkpits_shipping_notif_rejected_title']
            message_body = resconfigvalues['hkpits_shipping_notif_rejected_body'] % (
                self.name, fields.Datetime.now())
            message_body += u" | Shipping ID:{%s}" % self.id
            # message_body += f" | Shipping ID: ##{self.id}"

            self._hk_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                           shipping=self)
            self._create_notification_log(self.partner_id.id, self.travelbooking_id.partner_id.id,
                                          message_title, message_body)

    def set_to_rejected(self):
        res = super(RoadShipping, self).set_to_rejected()
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        hkpits_notif_enabled = resconfigvalues['hkpits_notif_enabled']

        if hkpits_notif_enabled:
            message_title = resconfigvalues['hkpits_shipping_notif_cancelled_title']
            message_body = resconfigvalues['hkpits_shipping_notif_cancelled_body'] % (
                self.name, fields.Datetime.now())
            message_body += u" | Shipping ID:{%s}" % self.id
            # message_body += f" | Shipping ID: ##{self.id}"

            self._hk_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                           shipping=self)
            self._create_notification_log(self.partner_id.id, self.travelbooking_id.partner_id.id,
                                          message_title, message_body)
        return res

    def set_to_paid(self):
        res = super(RoadShipping, self).set_to_paid()
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        hkpits_notif_enabled = resconfigvalues['hkpits_notif_enabled']

        if hkpits_notif_enabled:
            message_title = resconfigvalues['hkpits_shipping_notif_paid_title']
            message_body = resconfigvalues['hkpits_shipping_notif_paid_body'] % (
                self.name, fields.Datetime.now())
            message_body += u" | Shipping ID:{%s}" % self.id
            # message_body += f" | Shipping ID: ##{self.id}"

            self._hk_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                           shipping=self)
            self._create_notification_log(self.partner_id.id, self.travelbooking_id.partner_id.id,
                                          message_title, message_body)

        return res

    def set_to_confirm(self):
        res = super(RoadShipping, self).set_to_confirm()
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        hkpits_notif_enabled = resconfigvalues['hkpits_notif_enabled']

        if hkpits_notif_enabled:
            message_title = resconfigvalues['hkpits_shipping_notif_received_title']
            message_body = resconfigvalues['hkpits_shipping_notif_received_body'] % (
                self.name, fields.Datetime.now())
            message_body += u" | Shipping ID:{%s}" % self.id
            # message_body += f" | Shipping ID: ##{self.id}"

            self._hk_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                           shipping=self)
            self._create_notification_log(self.partner_id.id, self.travelbooking_id.partner_id.id,
                                          message_title, message_body)

        return res

    def set_to_received(self):
        res = super(RoadShipping, self).set_to_received()

        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        hkpits_notif_enabled = resconfigvalues['hkpits_notif_enabled']

        if hkpits_notif_enabled:
            message_title = resconfigvalues['hkpits_shipping_notif_delivered_title']
            message_body = resconfigvalues['hkpits_shipping_notif_delivered_body'] % (
                self.name, fields.Datetime.now())
            message_body += u" | Shipping ID:{%s}" % self.id
            # message_body += f" | Shipping ID: ##{self.id}"

            self._hk_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                           shipping=self)
            self._create_notification_log(self.partner_id.id, self.travelbooking_id.partner_id.id,
                                          message_title, message_body)

        return res


class TravelBooking(models.Model):
    _name = 'm1st_hk_roadshipping.travelbooking'
    _inherit = 'm1st_hk_roadshipping.travelbooking'

    @api.model
    def create(self, vals):
        Travel = super(TravelBooking, self).create(vals)
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        hkpits_notif_enabled = resconfigvalues['hkpits_notif_enabled']

        if hkpits_notif_enabled:
            message_title = resconfigvalues['hkpits_travel_notif_create_title']
            message_body = resconfigvalues['hkpits_travel_notif_create_body'] % (
                Travel.code, fields.Datetime.now())
            message_body += u" | Travel ID:{%s}" % Travel.id
            # message_body += f" | Travel ID: ##{Travel.id}"

            self._hk_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                           shipping=None, travel=Travel)
            self._create_notification_log(Travel.partner_id.id, False,
                                          message_title, message_body)

        return Travel

    def set_to_negotiating(self):
        res = super(TravelBooking, self).set_to_negotiating()
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        hkpits_notif_enabled = resconfigvalues['hkpits_notif_enabled']

        if hkpits_notif_enabled:
            message_title = resconfigvalues['hkpits_travel_notif_published_title']
            message_body = resconfigvalues['hkpits_travel_notif_published_body'] % (
                self.code, fields.Datetime.now())
            message_body += u" | Travel ID:{%s}" % self.id
            # message_body += f" | Travel ID: ##{self.id}"

            self._hk_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                           shipping=None, travel=self)
            self._create_notification_log(self.partner_id.id, False,
                                          message_title, message_body)

        return res

    def set_to_accepted(self):
        res = super(TravelBooking, self).set_to_accepted()
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        hkpits_notif_enabled = resconfigvalues['hkpits_notif_enabled']

        if hkpits_notif_enabled:
            message_title = resconfigvalues['hkpits_travel_notif_accepted_title']
            message_body = resconfigvalues['hkpits_travel_notif_accepted_body'] % (
                self.code, fields.Datetime.now())
            message_body += u" | Travel ID:{%s}" % self.id
            # message_body += f" | Travel ID: ##{self.id}"

            shippings = self.mapped('shipping_ids')

            if len(shippings) > 0:
                for s in shippings:
                    self._hk_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                                   shipping=s, travel=None)
                    self._create_notification_log(self.partner_id.id, False,
                                                  message_title, message_body)
            else:
                self._hk_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                               shipping=None, travel=self)
                self._create_notification_log(self.partner_id.id, False,
                                              message_title, message_body)
        return res

    def set_to_completed(self):
        res = super(TravelBooking, self).set_to_completed()
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        hkpits_notif_enabled = resconfigvalues['hkpits_notif_enabled']

        if hkpits_notif_enabled:
            message_title = resconfigvalues['hkpits_travel_notif_completed_title']
            message_body = resconfigvalues['hkpits_travel_notif_completed_body'] % (
                self.code, fields.Datetime.now())
            message_body += u" | Travel ID:{%s}" % self.id
            # message_body += f" | Travel ID: ##{self.id}"

            shippings = self.mapped('shipping_ids')

            if len(shippings) > 0:
                for s in shippings:
                    self._hk_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                                   shipping=s, travel=None)
                    self._create_notification_log(self.partner_id.id, False,
                                                  message_title, message_body)
            else:
                self._hk_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                               shipping=None, travel=self)
                self._create_notification_log(self.partner_id.id, False,
                                              message_title, message_body)
        return res

    def set_to_rejected(self):
        res = super(TravelBooking, self).set_to_rejected()
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        hkpits_notif_enabled = resconfigvalues['hkpits_notif_enabled']

        if hkpits_notif_enabled:
            message_title = resconfigvalues['hkpits_travel_notif_cancelled_title']
            message_body = resconfigvalues['hkpits_travel_notif_cancelled_body'] % (
                self.code, fields.Datetime.now())
            message_body += u" | Travel ID:{%s}" % self.id
            # message_body += f" | Travel ID: ##{self.id}"

            self._hk_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                           shipping=None, travel=self)
            self._create_notification_log(self.partner_id.id, False,
                                          message_title, message_body)

        return res
