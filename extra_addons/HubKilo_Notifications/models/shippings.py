from odoo import models, fields, api, _
from odoo.exceptions import MissingError


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    # New Shipping Order===========================================
    shipping_email_template_id_traveler = fields.Many2one(
        'mail.template',
        string='Traveler Shipping Email Template',
        config_parameter='HubKilo_Notifications.shipping_email_template_id_traveler',
    )
    enable_shipping_email_traveler = fields.Boolean(
        string='Enable Traveler Shipping Email',
    )

    shipping_email_template_id_sender = fields.Many2one(
        'mail.template',
        string='Sender Shipping Email Template',
        config_parameter='HubKilo_Notifications.shipping_email_template_id_sender',
    )
    enable_shipping_email_sender = fields.Boolean(
        string='Enable Sender Shipping Email',
    )

    # Shipping Rejected===========================================
    shipping_rejected_email_template_id_traveler = fields.Many2one(
        'mail.template',
        string='Traveler Shipping Rejected Email Template',
        config_parameter='HubKilo_Notifications.shipping_rejected_email_template_id_traveler',
    )
    enable_shipping_rejected_email_traveler = fields.Boolean(
        string='Enable Traveler Rejected Shipping Email',
    )

    shipping_rejected_email_template_id_sender = fields.Many2one(
        'mail.template',
        string='Sender Rejectd Shipping Email Template',
        config_parameter='HubKilo_Notifications.shipping_rejected_email_template_id_sender',
    )
    enable_shipping_rejected_email_sender = fields.Boolean(
        string='Enable Sender Rejected Shipping Email',
    )

    # Shipping Canncelled===========================================
    shipping_cancelled_email_template_id_traveler = fields.Many2one(
        'mail.template',
        string='Traveler Shipping Cancelled Email Template',
        config_parameter='HubKilo_Notifications.shipping_cancelled_email_template_id_traveler',
    )
    enable_shipping_cancelled_email_traveler = fields.Boolean(
        string='Enable Traveler Shipping Cancelled Email',
    )

    shipping_cancelled_email_template_id_sender = fields.Many2one(
        'mail.template',
        string='Sender Shipping Cancelled Email Template',
        config_parameter='HubKilo_Notifications.shipping_cancelled_email_template_id_sender',
    )
    enable_shipping_cancelled_email_sender = fields.Boolean(
        string='Enable Sender Shipping Cancelled Email',
    )

    # Shipping Traveller Price Validated===========================================
    shipping_traveller_price_validated_email_template_id_traveler = fields.Many2one(
        'mail.template',
        string='Traveler Shipping traveller price validated Email Template',
        config_parameter='HubKilo_Notifications.shipping_traveller_price_validated_email_template_id_traveler',
    )
    enable_shipping_traveller_price_validated_email_traveler = fields.Boolean(
        string='Enable Traveler Shipping traveller price validated Email',
    )

    shipping_traveller_price_validated_email_template_id_sender = fields.Many2one(
        'mail.template',
        string='Sender Shipping traveller price validated Email Template',
        config_parameter='HubKilo_Notifications.shipping_traveller_price_validated_email_template_id_sender',
    )
    enable_shipping_traveller_price_validated_email_sender = fields.Boolean(
        string='Enable Sender Shipping traveller price validated Email',
    )

    # Shipping Traveller parcel_received===========================================
    shipping_traveller_parcel_received_email_template_id_traveler = fields.Many2one(
        'mail.template',
        string='Traveler Shipping traveller parcel received Email Template',
        config_parameter='HubKilo_Notifications.shipping_traveller_parcel_received_email_template_id_traveler',
    )
    enable_shipping_traveller_parcel_received_email_traveler = fields.Boolean(
        string='Enable Traveler Shipping traveller parcel received Email',
    )

    shipping_traveller_parcel_received_email_template_id_sender = fields.Many2one(
        'mail.template',
        string='Sender Shipping traveller parcel received Email Template',
        config_parameter='HubKilo_Notifications.shipping_traveller_parcel_received_email_template_id_sender',
    )
    enable_shipping_traveller_parcel_received_email_sender = fields.Boolean(
        string='Enable Sender Shipping traveller parcel received Email',
    )

    shipping_traveller_parcel_received_email_template_id_receipient = fields.Many2one(
        'mail.template',
        string='Sender Shipping traveller parcel received Email Template',
        config_parameter='HubKilo_Notifications.shipping_traveller_parcel_received_email_template_id_receipient',
    )
    enable_shipping_traveller_parcel_received_email_receipient = fields.Boolean(
        string='Enable Receipient Shipping traveller parcel received Email',
    )

    # Shipping Traveller parcel_delivered===========================================
    shipping_traveller_parcel_delivered_email_template_id_traveler = fields.Many2one(
        'mail.template',
        string='Traveler Shipping traveller parcel delivered Email Template',
        config_parameter='HubKilo_Notifications.shipping_traveller_parcel_delivered_email_template_id_traveler',
    )
    enable_shipping_traveller_parcel_delivered_email_traveler = fields.Boolean(
        string='Enable Traveler Shipping traveller parcel delivered Email',
    )

    shipping_traveller_parcel_delivered_email_template_id_sender = fields.Many2one(
        'mail.template',
        string='Sender Shipping traveller parcel delivered Email Template',
        config_parameter='HubKilo_Notifications.shipping_traveller_parcel_delivered_email_template_id_sender',
    )
    enable_shipping_traveller_parcel_delivered_email_sender = fields.Boolean(
        string='Enable Sender Shipping traveller parcel delivered Email',
    )

    shipping_traveller_parcel_delivered_email_template_id_recipient = fields.Many2one(
        'mail.template',
        string='Sender Shipping traveller parcel delivered Email Template',
        config_parameter='HubKilo_Notifications.shipping_traveller_parcel_delivered_email_template_id_recipient',
    )
    enable_shipping_traveller_parcel_delivered_email_recipient = fields.Boolean(
        string='Enable Recipient Shipping traveller parcel delivered Email',
    )

    # Shipping Traveller payment Complete and Delivery Code===========================================
    shipping_payment_complete_email_template_id_traveler = fields.Many2one(
        'mail.template',
        string='Traveler Shipping traveller parcel Payement Complete Email Template',
        config_parameter='HubKilo_Notifications.shipping_payment_complete_email_template_id_traveler',
    )
    enable_shipping_payment_complete_email_traveler = fields.Boolean(
        string='Enable Traveler Shipping traveller parcel Payement Complete Email',
    )

    shipping_payment_complete_email_template_id_sender = fields.Many2one(
        'mail.template',
        string='Sender Shipping traveller parcel Payement Complete Email Template',
        config_parameter='HubKilo_Notifications.shipping_payment_complete_email_template_id_sender',
    )
    enable_shipping_payment_complete_email_sender = fields.Boolean(
        string='Enable Sender Shipping traveller parcel Payement Complete Email',
    )

    shipping_delivery_code_email_template_id_recipient = fields.Many2one(
        'mail.template',
        string='Sender Shipping traveller parcel Delivery Code Email Template',
        config_parameter='HubKilo_Notifications.shipping_delivery_code_email_template_id_recipient',
    )
    enable_shipping_delivery_code_email_recipient = fields.Boolean(
        string='Enable Recipient Shipping traveller parcel Delivery Code Email',
    )

    shipping_delivery_code_email_template_id_sender = fields.Many2one(
        'mail.template',
        string='Sender Shipping traveller parcel Delivery Code Email Template',
        config_parameter='HubKilo_Notifications.shipping_delivery_code_email_template_id_sender',
    )
    enable_shipping_delivery_code_email_sender = fields.Boolean(
        string='Enable sender Shipping traveller parcel Delivery Code Email',
    )

    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        params = self.env['ir.config_parameter'].sudo()

        enable_shipping_email_traveler = params.get_param('HubKilo_Notifications.enable_shipping_email_traveler')
        shipping_email_template_id_traveler = params.get_param('HubKilo_Notifications.shipping_email_template_id_traveler') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Traveler Shipment Notification')], limit=1).id

        enable_shipping_email_sender = params.get_param('HubKilo_Notifications.enable_shipping_email_sender')
        shipping_email_template_id_sender = params.get_param('HubKilo_Notifications.shipping_email_template_id_sender') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Sender Shipment Notification')], limit=1).id

        enable_shipping_rejected_email_traveler = params.get_param('HubKilo_Notifications.enable_shipping_rejected_email_traveler')
        shipping_rejected_email_template_id_traveler = params.get_param(
            'HubKilo_Notifications.shipping_rejected_email_template_id_traveler') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Traveler Rejected Shipment Notification')], limit=1).id

        enable_shipping_rejected_email_sender = params.get_param('HubKilo_Notifications.enable_shipping_rejected_email_sender')
        shipping_rejected_email_template_id_sender = params.get_param(
            'HubKilo_Notifications.shipping_rejected_email_template_id_sender') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Sender Rejected Shipment Notification')], limit=1).id

        enable_shipping_cancelled_email_traveler = params.get_param(
            'HubKilo_Notifications.enable_shipping_cancelled_email_traveler')
        shipping_cancelled_email_template_id_traveler = params.get_param(
            'HubKilo_Notifications.shipping_cancelled_email_template_id_traveler') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Traveler Shipment Cancelled Notification')], limit=1).id

        enable_shipping_cancelled_email_sender = params.get_param(
            'HubKilo_Notifications.enable_shipping_cancelled_email_sender')
        shipping_cancelled_email_template_id_sender = params.get_param(
            'HubKilo_Notifications.shipping_cancelled_email_template_id_sender') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Sender Shipment Cancelled Notification')], limit=1).id

        enable_shipping_traveller_price_validated_email_traveler = params.get_param(
            'HubKilo_Notifications.enable_shipping_traveller_price_validated_email_traveler')
        shipping_traveller_price_validated_email_template_id_traveler = params.get_param(
            'HubKilo_Notifications.shipping_traveller_price_validated_email_template_id_traveler')  or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Traveler Shipping Price Confirmation Notification')], limit=1).id


        enable_shipping_traveller_price_validated_email_sender = params.get_param(
            'HubKilo_Notifications.enable_shipping_traveller_price_validated_email_sender')
        shipping_traveller_price_validated_email_template_id_sender = params.get_param(
            'HubKilo_Notifications.shipping_traveller_price_validated_email_template_id_sender') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Sender Shipping Price Confirmation Notification')], limit=1).id

        enable_shipping_traveller_parcel_received_email_traveler = params.get_param(
            'HubKilo_Notifications.enable_shipping_traveller_parcel_received_email_traveler')
        shipping_traveller_parcel_received_email_template_id_traveler = params.get_param(
            'HubKilo_Notifications.shipping_traveller_parcel_received_email_template_id_traveler') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Traveler Shipment Luggage Handed Notification')], limit=1).id


        enable_shipping_traveller_parcel_received_email_sender = params.get_param(
            'HubKilo_Notifications.enable_shipping_traveller_parcel_received_email_sender')
        shipping_traveller_parcel_received_email_template_id_sender = params.get_param(
            'HubKilo_Notifications.shipping_traveller_parcel_received_email_template_id_sender') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Sender Shipment Luggage Handed Notification')], limit=1).id


        enable_shipping_traveller_parcel_received_email_receipient = params.get_param(
            'HubKilo_Notifications.enable_shipping_traveller_parcel_received_email_receipient')
        shipping_traveller_parcel_received_email_template_id_receipient = params.get_param(
            'HubKilo_Notifications.shipping_traveller_parcel_received_email_template_id_receipient') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Recipient Shipment Luggage Handed Notification')], limit=1).id

        enable_shipping_traveller_parcel_delivered_email_traveler = params.get_param(
            'HubKilo_Notifications.enable_shipping_traveller_parcel_delivered_email_traveler')
        shipping_traveller_parcel_delivered_email_template_id_traveler = params.get_param(
            'HubKilo_Notifications.shipping_traveller_parcel_delivered_email_template_id_traveler') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Traveler Shipment Luggage Delivery Notification')], limit=1).id


        enable_shipping_traveller_parcel_delivered_email_sender = params.get_param(
            'HubKilo_Notifications.enable_shipping_traveller_parcel_delivered_email_sender')
        shipping_traveller_parcel_delivered_email_template_id_sender = params.get_param(
            'HubKilo_Notifications.shipping_traveller_parcel_delivered_email_template_id_sender') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Sender Shipment Luggage Delivery Notification')], limit=1).id

        enable_shipping_traveller_parcel_delivered_email_recipient = params.get_param(
            'HubKilo_Notifications.enable_shipping_traveller_parcel_delivered_email_recipient')
        shipping_traveller_parcel_delivered_email_template_id_recipient = params.get_param(
            'HubKilo_Notifications.shipping_traveller_parcel_delivered_email_template_id_recipient') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Recipient Shipment Luggage Delivery Notification')], limit=1).id

        enable_shipping_payment_complete_email_traveler = params.get_param(
            'HubKilo_Notifications.enable_shipping_payment_complete_email_traveler')
        shipping_payment_complete_email_template_id_traveler = params.get_param(
            'HubKilo_Notifications.shipping_payment_complete_email_template_id_traveler') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Traveler Shipment Payment Confirmation Notification')], limit=1).id

        enable_shipping_payment_complete_email_sender = params.get_param(
            'HubKilo_Notifications.enable_shipping_payment_complete_email_sender')
        shipping_payment_complete_email_template_id_sender = params.get_param(
            'HubKilo_Notifications.shipping_payment_complete_email_template_id_sender') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Sender Shipment Payment Confirmation Notification')], limit=1).id

        enable_shipping_delivery_code_email_sender = params.get_param(
            'HubKilo_Notifications.enable_shipping_delivery_code_email_sender')
        shipping_delivery_code_email_template_id_sender = params.get_param(
            'HubKilo_Notifications.shipping_delivery_code_email_template_id_sender') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Sender Shipment Delivery Code Notification')], limit=1).id

        enable_shipping_delivery_code_email_recipient = params.get_param(
            'HubKilo_Notifications.enable_shipping_delivery_code_email_recipient')
        shipping_delivery_code_email_template_id_recipient = params.get_param(
            'HubKilo_Notifications.shipping_delivery_code_email_template_id_recipient') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Recipient Shipment Delivery Code Notification')], limit=1).id

        res.update(
            enable_shipping_email_traveler=bool(enable_shipping_email_traveler),
            shipping_email_template_id_traveler=int(shipping_email_template_id_traveler),
            enable_shipping_email_sender=bool(enable_shipping_email_sender),
            shipping_email_template_id_sender=int(shipping_email_template_id_sender),

            enable_shipping_rejected_email_traveler=bool(enable_shipping_rejected_email_traveler),
            shipping_rejected_email_template_id_traveler=int(shipping_rejected_email_template_id_traveler),
            enable_shipping_rejected_email_sender=bool(enable_shipping_rejected_email_sender),
            shipping_rejected_email_template_id_sender=int(shipping_rejected_email_template_id_sender),

            enable_shipping_cancelled_email_traveler=bool(enable_shipping_cancelled_email_traveler),
            shipping_cancelled_email_template_id_traveler=int(shipping_cancelled_email_template_id_traveler),
            enable_shipping_cancelled_email_sender=bool(enable_shipping_cancelled_email_sender),
            shipping_cancelled_email_template_id_sender=int(shipping_cancelled_email_template_id_sender),

            enable_shipping_traveller_price_validated_email_traveler=bool(
                enable_shipping_traveller_price_validated_email_traveler),
            shipping_traveller_price_validated_email_template_id_traveler=int(
                shipping_traveller_price_validated_email_template_id_traveler),
            enable_shipping_traveller_price_validated_email_sender=bool(
                enable_shipping_traveller_price_validated_email_sender),
            shipping_traveller_price_validated_email_template_id_sender=int(
                shipping_traveller_price_validated_email_template_id_sender),

            enable_shipping_traveller_parcel_received_email_traveler=bool(
                enable_shipping_traveller_parcel_received_email_traveler),
            shipping_traveller_parcel_received_email_template_id_traveler=int(
                shipping_traveller_parcel_received_email_template_id_traveler),
            enable_shipping_traveller_parcel_received_email_sender=bool(
                enable_shipping_traveller_parcel_received_email_sender),
            shipping_traveller_parcel_received_email_template_id_sender=int(
                shipping_traveller_parcel_received_email_template_id_sender),

            enable_shipping_traveller_parcel_received_email_receipient=bool(
                enable_shipping_traveller_parcel_received_email_receipient),
            shipping_traveller_parcel_received_email_template_id_receipient=int(
                shipping_traveller_parcel_received_email_template_id_receipient),

            enable_shipping_traveller_parcel_delivered_email_traveler=bool(
                enable_shipping_traveller_parcel_delivered_email_traveler),
            shipping_traveller_parcel_delivered_email_template_id_traveler=int(
                shipping_traveller_parcel_delivered_email_template_id_traveler),
            enable_shipping_traveller_parcel_delivered_email_sender=bool(
                enable_shipping_traveller_parcel_delivered_email_sender),
            shipping_traveller_parcel_delivered_email_template_id_sender=int(
                shipping_traveller_parcel_delivered_email_template_id_sender),

            enable_shipping_traveller_parcel_delivered_email_recipient=bool(
                enable_shipping_traveller_parcel_delivered_email_recipient),
            shipping_traveller_parcel_delivered_email_template_id_recipient=int(
                shipping_traveller_parcel_delivered_email_template_id_recipient),

            enable_shipping_payment_complete_email_traveler=bool(
                enable_shipping_payment_complete_email_traveler),
            shipping_payment_complete_email_template_id_traveler=int(
                shipping_payment_complete_email_template_id_traveler),
            enable_shipping_payment_complete_email_sender=bool(
                enable_shipping_payment_complete_email_sender),
            shipping_payment_complete_email_template_id_sender=int(
                shipping_payment_complete_email_template_id_sender),

            enable_shipping_delivery_code_email_sender=bool(
                enable_shipping_delivery_code_email_sender),
            shipping_delivery_code_email_template_id_sender=int(
                shipping_delivery_code_email_template_id_sender),

            enable_shipping_delivery_code_email_recipient=bool(
                enable_shipping_delivery_code_email_recipient),
            shipping_delivery_code_email_template_id_recipient=int(
                shipping_delivery_code_email_template_id_recipient),

        )
        return res

    def set_values(self):
        super(ResConfigSettings, self).set_values()
        params = self.env['ir.config_parameter'].sudo()

        params.set_param('HubKilo_Notifications.enable_shipping_email_traveler', self.enable_shipping_email_traveler)
        params.set_param('HubKilo_Notifications.shipping_email_template_id_traveler',
                         self.shipping_email_template_id_traveler.id or False)
        params.set_param('HubKilo_Notifications.enable_shipping_email_sender', self.enable_shipping_email_sender)
        params.set_param('HubKilo_Notifications.shipping_email_template_id_sender',
                         self.shipping_email_template_id_sender.id or False)

        params.set_param('HubKilo_Notifications.enable_shipping_rejected_email_traveler',
                         self.enable_shipping_rejected_email_traveler)
        params.set_param('HubKilo_Notifications.shipping_rejected_email_template_id_traveler',
                         self.shipping_rejected_email_template_id_traveler.id or False)
        params.set_param('HubKilo_Notifications.enable_shipping_rejected_email_sender',
                         self.enable_shipping_rejected_email_sender)
        params.set_param('HubKilo_Notifications.shipping_rejected_email_template_id_sender',
                         self.shipping_rejected_email_template_id_sender.id or False)

        params.set_param('HubKilo_Notifications.enable_shipping_cancelled_email_traveler',
                         self.enable_shipping_cancelled_email_traveler)
        params.set_param('HubKilo_Notifications.shipping_cancelled_email_template_id_traveler',
                         self.shipping_cancelled_email_template_id_traveler.id or False)
        params.set_param('HubKilo_Notifications.enable_shipping_cancelled_email_sender',
                         self.enable_shipping_cancelled_email_sender)
        params.set_param('HubKilo_Notifications.shipping_cancelled_email_template_id_sender',
                         self.shipping_cancelled_email_template_id_sender.id or False)

        params.set_param('HubKilo_Notifications.enable_shipping_traveller_price_validated_email_traveler',
                         self.enable_shipping_traveller_price_validated_email_traveler)
        params.set_param('HubKilo_Notifications.shipping_traveller_price_validated_email_template_id_traveler',
                         self.shipping_traveller_price_validated_email_template_id_traveler.id or False)
        params.set_param('HubKilo_Notifications.enable_shipping_traveller_price_validated_email_sender',
                         self.enable_shipping_traveller_price_validated_email_sender)
        params.set_param('HubKilo_Notifications.shipping_traveller_price_validated_email_template_id_sender',
                         self.shipping_traveller_price_validated_email_template_id_sender.id or False)

        params.set_param('HubKilo_Notifications.enable_shipping_traveller_parcel_received_email_traveler',
                         self.enable_shipping_traveller_parcel_received_email_traveler)
        params.set_param('HubKilo_Notifications.shipping_traveller_parcel_received_email_template_id_traveler',
                         self.shipping_traveller_parcel_received_email_template_id_traveler.id or False)
        params.set_param('HubKilo_Notifications.enable_shipping_traveller_parcel_received_email_sender',
                         self.enable_shipping_traveller_parcel_received_email_sender)
        params.set_param('HubKilo_Notifications.shipping_traveller_parcel_received_email_template_id_sender',
                         self.shipping_traveller_parcel_received_email_template_id_sender.id or False)

        params.set_param('HubKilo_Notifications.enable_shipping_traveller_parcel_received_email_receipient',
                         self.enable_shipping_traveller_parcel_received_email_receipient)
        params.set_param('HubKilo_Notifications.shipping_traveller_parcel_received_email_template_id_receipient',
                         self.shipping_traveller_parcel_received_email_template_id_receipient.id or False)

        params.set_param('HubKilo_Notifications.enable_shipping_traveller_parcel_delivered_email_traveler',
                         self.enable_shipping_traveller_parcel_delivered_email_traveler)
        params.set_param('HubKilo_Notifications.shipping_traveller_parcel_delivered_email_template_id_traveler',
                         self.shipping_traveller_parcel_delivered_email_template_id_traveler.id or False)
        params.set_param('HubKilo_Notifications.enable_shipping_traveller_parcel_delivered_email_sender',
                         self.enable_shipping_traveller_parcel_delivered_email_sender)
        params.set_param('HubKilo_Notifications.shipping_traveller_parcel_delivered_email_template_id_sender',
                         self.shipping_traveller_parcel_delivered_email_template_id_sender.id or False)

        params.set_param('HubKilo_Notifications.enable_shipping_traveller_parcel_delivered_email_recipient',
                         self.enable_shipping_traveller_parcel_delivered_email_recipient)
        params.set_param('HubKilo_Notifications.shipping_traveller_parcel_delivered_email_template_id_recipient',
                         self.shipping_traveller_parcel_delivered_email_template_id_recipient.id or False)

        params.set_param('HubKilo_Notifications.enable_shipping_payment_complete_email_traveler',
                         self.enable_shipping_payment_complete_email_traveler)
        params.set_param('HubKilo_Notifications.shipping_payment_complete_email_template_id_traveler',
                         self.shipping_payment_complete_email_template_id_traveler.id or False)
        params.set_param('HubKilo_Notifications.enable_shipping_payment_complete_email_sender',
                         self.enable_shipping_payment_complete_email_sender)
        params.set_param('HubKilo_Notifications.shipping_payment_complete_email_template_id_sender',
                         self.shipping_payment_complete_email_template_id_sender.id or False)

        params.set_param('HubKilo_Notifications.enable_shipping_delivery_code_email_sender',
                         self.enable_shipping_delivery_code_email_sender)
        params.set_param('HubKilo_Notifications.shipping_delivery_code_email_template_id_sender',
                         self.shipping_delivery_code_email_template_id_sender.id or False)

        params.set_param('HubKilo_Notifications.enable_shipping_delivery_code_email_recipient',
                         self.enable_shipping_delivery_code_email_recipient)
        params.set_param('HubKilo_Notifications.shipping_delivery_code_email_template_id_recipient',
                         self.shipping_delivery_code_email_template_id_recipient.id or False)


class RoadShippingMails(models.Model):
    _inherit = 'm1st_hk_roadshipping.shipping'

    def send_rejected_emails(self):
        if self.env['res.config.settings'].sudo().get_values().get('enable_shipping_rejected_email_traveler'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_rejected_email_template_id_traveler')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent Traveler Shipping Rejected Email ------------------------------")

        if self.env['res.config.settings'].sudo().get_values().get('enable_shipping_rejected_email_sender'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_rejected_email_template_id_sender')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent Sender Shipping Rejected Email ------------------------------")

    def send_cancelled_emails(self):
        if self.env['res.config.settings'].sudo().get_values().get('enable_shipping_cancelled_email_traveler'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_cancelled_email_template_id_traveler')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent Traveler Shipping cancelled Email ------------------------------")

        if self.env['res.config.settings'].sudo().get_values().get('enable_shipping_cancelled_email_sender'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_cancelled_email_template_id_sender')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent Sender Shipping Cancelled Email ------------------------------")

    def send_accepted_emails(self):
        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_shipping_traveller_price_validated_email_traveler'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_traveller_price_validated_email_template_id_traveler')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent Traveler Shipping traveller_price_validated Email ------------------------------")

        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_shipping_traveller_price_validated_email_sender'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_traveller_price_validated_email_template_id_sender')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent Sender Shipping traveller_price_validated Email ------------------------------")

    def parcel_received(self):
        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_shipping_traveller_parcel_received_email_traveler'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_traveller_parcel_received_email_template_id_traveler')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent Traveler Shipping traveller_parcel_received Email ------------------------------")

        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_shipping_traveller_parcel_received_email_sender'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_traveller_parcel_received_email_template_id_sender')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent Sender Shipping traveller_parcel_received Email ------------------------------")

        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_shipping_traveller_parcel_received_email_receipient'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_traveller_parcel_received_email_template_id_receipient')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent receipient Shipping traveller_parcel_received Email ------------------------------")

    def shipping_traveller_parcel_delivered(self):
        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_shipping_traveller_parcel_delivered_email_traveler'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_traveller_parcel_delivered_email_template_id_traveler')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent Traveler Shipping traveller_parcel_delivered Email ------------------------------")

        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_shipping_traveller_parcel_delivered_email_sender'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_traveller_parcel_delivered_email_template_id_sender')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent Sender Shipping traveller_parcel_delivered Email ------------------------------")

        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_shipping_traveller_parcel_delivered_email_recipient'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_traveller_parcel_delivered_email_template_id_recipient')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent recipient Shipping traveller_parcel_delivered Email ------------------------------")

    def send_shipping_emails(self):
        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_shipping_payment_complete_email_traveler'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_payment_complete_email_template_id_traveler')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent Traveler Shipping payment_complete Email ------------------------------")

        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_shipping_payment_complete_email_sender'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_payment_complete_email_template_id_sender')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent Sender Shipping payment_complete Email ------------------------------")

        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_shipping_delivery_code_email_sender'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_delivery_code_email_template_id_sender')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent sender Shipping delivery_code Email ------------------------------")

        if self.env['res.config.settings'].sudo().get_values().get(
                'enable_shipping_delivery_code_email_recipient'):
            template_id = self.env['res.config.settings'].sudo().get_values().get(
                'shipping_delivery_code_email_template_id_recipient')
            if template_id:
                template = self.env['mail.template'].browse(template_id)
                template.send_mail(self.id, force_send=True)
                print("Sent recipient Shipping delivery_code Email ------------------------------")

    @api.model
    def create(self, vals):
        shipping = super(RoadShippingMails, self).create(vals)
        if shipping.partner_id:
            if self.env['res.config.settings'].sudo().get_values().get('enable_shipping_email_traveler'):
                template_id = self.env['res.config.settings'].sudo().get_values().get(
                    'shipping_email_template_id_traveler')
                if template_id:
                    template = self.env['mail.template'].browse(template_id)
                    template.send_mail(shipping.id, force_send=True)
                    print("sent Traveler shipping on his travel Email ------------------------------")

            if self.env['res.config.settings'].sudo().get_values().get('enable_shipping_email_sender'):
                template_id = self.env['res.config.settings'].sudo().get_values().get(
                    'shipping_email_template_id_sender')
                if template_id:
                    template = self.env['mail.template'].browse(template_id)
                    template.send_mail(shipping.id, force_send=True)
                    print("sent Sender new shipping Email ------------------------------")
        return shipping

    def write(self, vals):
        if 'state' in vals and self.state != vals['state']:
            if vals['state'] == 'rejected':
                self.send_cancelled_emails()
            elif vals['state'] == 'accepted':
                self.send_accepted_emails()
            elif vals['state'] == 'confirm':
                self.parcel_received()
            elif vals['state'] == 'received':
                self.shipping_traveller_parcel_delivered()
        if 'parcel_received' in vals and vals['parcel_received']:
            self.parcel_received()
        if 'disagree' in vals and vals['disagree']:
            self.send_rejected_emails()
        if 'move_id' in vals:
            invoice_state = self.move_id.payment_state
            if invoice_state == 'paid':
                self.send_shipping_emails()
        return super(RoadShippingMails, self).write(vals)
