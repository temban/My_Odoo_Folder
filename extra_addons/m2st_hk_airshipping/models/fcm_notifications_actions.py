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


class NotificationLog(models.Model):
    _name = "air.notification.log"
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

    partner_air_notif_sent = fields.One2many('air.notification.log', 'sender_partner_id', string='Sent Notifications',
                                             domain=[('sender_partner_id', '!=', False)])

    partner_air_notif_received = fields.One2many('air.notification.log', 'receiver_partner_id',
                                                 string='Received Notifications',
                                                 domain=[('receiver_partner_id', '!=', False)])


class hkBase(models.Model):
    _name = "m0sthk.base"
    _inherit = 'm0sthk.base'

    @api.model
    def _hk_air_send_fcm_notification(self, msg_title, msg_body, shipping=None, travel=None):
        if not shipping and not travel:
            text = _(u"User Error : Unable to send notification! Set the Shipping record or the travel record!")
            raise UserError(text)

        if shipping:
            shipping.partner_id.generate_fcm_notification(message_title=msg_title, message_body=msg_body)
            shipping.travelbooking_id.partner_id.generate_fcm_notification(message_title=msg_title,
                                                                           message_body=msg_body)

        if travel:
            travel.partner_id.generate_fcm_notification(message_title=msg_title, message_body=msg_body)

    def _create_air_notification_log(self, sender_partner_id, receiver_partner_id, message_title, message_body):
        self.env['air.notification.log'].sudo().create({
            'sender_partner_id': sender_partner_id,
            'receiver_partner_id': receiver_partner_id,
            'message_title': message_title,
            'message_body': message_body,
            'is_seen_sender': False,
            'is_seen_receiver': False,
            'disable_sender': False,
            'disable_receiver': False,
        })


class RoadShipping(models.Model):
    _name = 'm2st_hk_airshipping.shipping'
    _inherit = 'm2st_hk_airshipping.shipping'

    ##--------------------- ORM
    ##------------------- ORM
    @api.model
    def create(self, vals):
        shipping = super(RoadShipping, self).create(vals)
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        air_hkpits_notif_enabled = resconfigvalues['air_hkpits_notif_enabled']

        if shipping.partner_id:
            if resconfigvalues['enable_air_shipping_email_traveler']:
                template_id = resconfigvalues['shipping_air_email_template_id_traveler']
                if template_id:
                    template = self.env['mail.template'].sudo().browse(template_id)
                    print(template)
                    template.send_mail(shipping.id, force_send=True)
                    print("sent air Traveler shipping on his travel Email ------------------------------")

            if resconfigvalues['enable_air_shipping_email_sender']:
                template_id = resconfigvalues['shipping_air_email_template_id_sender']
                if template_id:
                    template = self.env['mail.template'].sudo().browse(template_id)
                    template.send_mail(shipping.id, force_send=True)
                    print("sent Air Sender new shipping Email ------------------------------")

        if air_hkpits_notif_enabled:
            message_title = resconfigvalues['air_hkpits_shipping_notif_create_title']
            message_body = resconfigvalues['air_hkpits_shipping_notif_create_body'] % (
                shipping.name, shipping.travelbooking_id.code, fields.Datetime.now())
            message_body += u" | Air Shipping ID:{%s}" % shipping.id
            # message_body += f" | Shipping ID: ##{shipping.id}"

            self._hk_air_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                               shipping=shipping)
            self._create_air_notification_log(shipping.partner_id.id, shipping.travelbooking_id.partner_id.id,
                                              message_title, message_body)

        return shipping

    def write(self, vals):
        # Call the parent class's write method
        res = super(RoadShipping, self).write(vals)

        # Check if 'is_rated' is in vals and is True
        if 'is_rated' in vals and vals['is_rated']:
            # Retrieve the configuration values
            resconfigvalues = self.env['res.config.settings'].get_values()
            air_hkpits_notif_enabled = resconfigvalues['air_hkpits_notif_enabled']

            if air_hkpits_notif_enabled:
                message_title = resconfigvalues['air_hkpits_shipping_notif_rated_title']

                for r in self:
                    message_body = resconfigvalues['air_hkpits_shipping_notif_rated_body'] % (
                        r.name, fields.Datetime.now())
                    message_body += u" | Air Shipping ID:{%s}" % r.id
                    self._hk_air_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                                       shipping=r)
                    self._create_air_notification_log(self.partner_id.id, self.travelbooking_id.partner_id.id,
                                                      message_title, message_body)

        return res

    # def mark_traveler_disagree(self):
    #     self.ensure_one()
    #     super(RoadShipping, self).mark_traveler_disagree()
    #
    #     resconfigvalues = self.get_model_pool('res.config.settings').get_values()
    #     air_hkpits_notif_enabled = resconfigvalues['air_hkpits_notif_enabled']
    #
    #     if air_hkpits_notif_enabled:
    #         message_title = resconfigvalues['air_hkpits_shipping_notif_rejected_title']
    #         message_body = resconfigvalues['air_hkpits_shipping_notif_rejected_body'] % (
    #             self.name, fields.Datetime.now())
    #         message_body += u" | Shipping ID:{%s}" % self.id
    #         # message_body += f" | Shipping ID: ##{self.id}"
    #
    #         self._hk_air_send_fcm_notification(msg_title=message_title, msg_body=message_body,
    #                                        shipping=self)
    #         self._create_air_notification_log(self.partner_id.id, self.travelbooking_id.partner_id.id,
    #                                       message_title, message_body)

    def set_to_rejected(self):
        res = super(RoadShipping, self).set_to_rejected()
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        air_hkpits_notif_enabled = resconfigvalues['air_hkpits_notif_enabled']

        if air_hkpits_notif_enabled:
            message_title = resconfigvalues['air_hkpits_shipping_notif_cancelled_title']
            message_body = resconfigvalues['air_hkpits_shipping_notif_cancelled_body'] % (
                self.name, fields.Datetime.now())
            message_body += u" | Air Shipping ID:{%s}" % self.id
            # message_body += f" | Shipping ID: ##{self.id}"

            self._hk_air_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                               shipping=self)
            self._create_air_notification_log(self.partner_id.id, self.travelbooking_id.partner_id.id,
                                              message_title, message_body)
        return res

    def set_shipping_to_paid_emails(self):
        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_air_shipping_payment_complete_email_traveler'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'air_shipping_payment_complete_email_template_id')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent Traveler Shipping payment_complete Email ------------------------------")

        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_air_shipping_payment_complete_email_sender'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_air_payment_complete_email_template_id_sender')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent Sender Shipping payment_complete Email ------------------------------")

        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_air_shipping_delivery_code_email_sender'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_air_delivery_code_email_template_id_sender')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent sender Shipping delivery_code Email ------------------------------")

        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_air_shipping_delivery_code_email_recipient'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_air_delivery_code_email_receiver_template')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent recipient Shipping delivery_code Email ------------------------------")

    def set_to_paid(self):
        res = super(RoadShipping, self).set_to_paid()
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        air_hkpits_notif_enabled = resconfigvalues['air_hkpits_notif_enabled']

        if air_hkpits_notif_enabled:
            message_title = resconfigvalues['air_hkpits_shipping_notif_paid_title']
            message_body = resconfigvalues['air_hkpits_shipping_notif_paid_body'] % (
                self.name, fields.Datetime.now())
            message_body += u" | Air Shipping ID:{%s}" % self.id
            # message_body += f" | Shipping ID: ##{self.id}"

            self._hk_air_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                               shipping=self)
            self._create_air_notification_log(self.partner_id.id, self.travelbooking_id.partner_id.id,
                                              message_title, message_body)
        self.set_shipping_to_paid_emails()

        return res

    def set_to_confirm(self):
        res = super(RoadShipping, self).set_to_confirm()
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        air_hkpits_notif_enabled = resconfigvalues['air_hkpits_notif_enabled']

        if air_hkpits_notif_enabled:
            message_title = resconfigvalues['air_hkpits_shipping_notif_received_title']
            message_body = resconfigvalues['air_hkpits_shipping_notif_received_body'] % (
                self.name, fields.Datetime.now())
            message_body += u" | Air Shipping ID:{%s}" % self.id
            # message_body += f" | Shipping ID: ##{self.id}"

            self._hk_air_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                               shipping=self)
            self._create_air_notification_log(self.partner_id.id, self.travelbooking_id.partner_id.id,
                                              message_title, message_body)

        self.parcel_received()
        return res

    def parcel_received(self):
        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_air_shipping_traveller_parcel_received_email_traveler'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'air_shipping_traveller_parcel_received_email_template_id')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent Traveler Shipping traveller_parcel_received Email ------------------------------")

        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_air_shipping_traveller_parcel_received_email_sender'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'air_shipping_traveller_parcel_received_email_template_id_sender')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent Sender Shipping traveller_parcel_received Email ------------------------------")

        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_air_shipping_traveller_parcel_received_email_receiver'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'air_shipping_traveller_parcel_delivered_receiver_template')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent receipient Shipping traveller_parcel_received Email ------------------------------")

    def shipping_traveller_parcel_delivered(self):
        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_air_shipping_traveller_parcel_delivered_email_traveler'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'air_shipping_traveller_parcel_delivered_email_template_id')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent Traveler Shipping traveller_parcel_delivered Email ------------------------------")

        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_air_shipping_traveller_parcel_delivered_email_sender'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'air_shipping_traveller_parcel_delivered_sender_template')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent Sender Shipping traveller_parcel_delivered Email ------------------------------")

        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_air_shipping_traveller_parcel_delivered_email_recipient'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'air_shipping_traveller_parcel_delivered_receiver_template')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent recipient Shipping traveller_parcel_delivered Email ------------------------------")

    def set_to_received(self):
        res = super(RoadShipping, self).set_to_received()

        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        air_hkpits_notif_enabled = resconfigvalues['air_hkpits_notif_enabled']

        if air_hkpits_notif_enabled:
            message_title = resconfigvalues['air_hkpits_shipping_notif_delivered_title']
            message_body = resconfigvalues['air_hkpits_shipping_notif_delivered_body'] % (
                self.name, fields.Datetime.now())
            message_body += u" | Air Shipping ID:{%s}" % self.id
            # message_body += f" | Shipping ID: ##{self.id}"

            self._hk_air_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                               shipping=self)
            self._create_air_notification_log(self.partner_id.id, self.travelbooking_id.partner_id.id,
                                              message_title, message_body)

        self.shipping_traveller_parcel_delivered()

        return res


class TravelBooking(models.Model):
    _name = 'm2st_hk_airshipping.travelbooking'
    _inherit = 'm2st_hk_airshipping.travelbooking'

    @api.model
    def create(self, vals):
        Travel = super(TravelBooking, self).create(vals)
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        air_hkpits_notif_enabled = resconfigvalues['air_hkpits_notif_enabled']

        if air_hkpits_notif_enabled:
            message_title = resconfigvalues['air_hkpits_travel_notif_create_title']
            message_body = resconfigvalues['air_hkpits_travel_notif_create_body'] % (
                Travel.code, fields.Datetime.now())
            message_body += u" | Air Travel ID:{%s}" % Travel.id
            # message_body += f" | Travel ID: ##{Travel.id}"

            self._hk_air_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                               shipping=None, travel=Travel)
            self._create_air_notification_log(Travel.partner_id.id, None,
                                              message_title, message_body)

        return Travel

    def set_to_negotiating(self):
        res = super(TravelBooking, self).set_to_negotiating()
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        air_hkpits_notif_enabled = resconfigvalues['air_hkpits_notif_enabled']

        if air_hkpits_notif_enabled:
            message_title = resconfigvalues['air_hkpits_travel_notif_published_title']
            message_body = resconfigvalues['air_hkpits_travel_notif_published_body'] % (
                self.code, fields.Datetime.now())
            message_body += u" | Air Travel ID:{%s}" % self.id
            # message_body += f" | Travel ID: ##{self.id}"

            self._hk_air_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                               shipping=None, travel=self)
            self._create_air_notification_log(self.partner_id.id, None,
                                              message_title, message_body)

        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_air_travel_published_bool'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_published_air_travels_email')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("sent travel published mail------------------------------")

        return res

    def set_to_accepted(self):
        res = super(TravelBooking, self).set_to_accepted()
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        air_hkpits_notif_enabled = resconfigvalues['air_hkpits_notif_enabled']

        if air_hkpits_notif_enabled:
            message_title = resconfigvalues['air_hkpits_travel_notif_accepted_title']
            message_body = resconfigvalues['air_hkpits_travel_notif_accepted_body'] % (
                self.code, fields.Datetime.now())
            message_body += u" | Air Travel ID:{%s}" % self.id
            # message_body += f" | Travel ID: ##{self.id}"

            shippings = self.mapped('shipping_ids')

            if len(shippings) > 0:
                for s in shippings:
                    self._hk_air_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                                       shipping=s, travel=None)
                    self._create_air_notification_log(self.partner_id.id, None,
                                                      message_title, message_body)
            else:
                self._hk_air_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                                   shipping=None, travel=self)
                self._create_air_notification_log(self.partner_id.id, None,
                                                  message_title, message_body)
        return res

    def set_to_completed(self):
        res = super(TravelBooking, self).set_to_completed()
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        air_hkpits_notif_enabled = resconfigvalues['air_hkpits_notif_enabled']

        if air_hkpits_notif_enabled:
            message_title = resconfigvalues['air_hkpits_travel_notif_completed_title']
            message_body = resconfigvalues['air_hkpits_travel_notif_completed_body'] % (
                self.code, fields.Datetime.now())
            message_body += u" | Air Travel ID:{%s}" % self.id
            # message_body += f" | Travel ID: ##{self.id}"

            shippings = self.mapped('shipping_ids')

            if len(shippings) > 0:
                for s in shippings:
                    self._hk_air_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                                       shipping=s, travel=None)
                    self._create_air_notification_log(self.partner_id.id, None,
                                                      message_title, message_body)
            else:
                self._hk_air_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                                   shipping=None, travel=self)
                self._create_air_notification_log(self.partner_id.id, None,
                                                  message_title, message_body)
        return res

    def set_to_rejected(self):
        res = super(TravelBooking, self).set_to_rejected()
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        air_hkpits_notif_enabled = resconfigvalues['air_hkpits_notif_enabled']

        if air_hkpits_notif_enabled:
            message_title = resconfigvalues['air_hkpits_travel_notif_cancelled_title']
            message_body = resconfigvalues['air_hkpits_travel_notif_cancelled_body'] % (
                self.code, fields.Datetime.now())
            message_body += u" | Air Travel ID:{%s}" % self.id
            # message_body += f" | Travel ID: ##{self.id}"

            self._hk_air_send_fcm_notification(msg_title=message_title, msg_body=message_body,
                                               shipping=None, travel=self)
            self._create_air_notification_log(self.partner_id.id, None,
                                              message_title, message_body)

        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_air_travel_rejection_bool'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'travel_rejection_air_travels_email')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("sent travel rejection mail------------------------------")

        return res
