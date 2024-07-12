from odoo import models, fields, api


class AirResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    # Published Travels===========================================
    shipping_published_air_travels_email = fields.Many2one(
        'mail.template',
        string='Published Air Travel Email Template',
        config_parameter='m2st_hk_airshipping.shipping_published_air_travels_email',
    )
    enable_air_travel_published_bool = fields.Boolean(
        string='Enable Air Travel Published Email'
    )

    #Travel Rejecteds===========================================
    travel_rejection_air_travels_email = fields.Many2one(
        'mail.template',
        string='Rejection Air Travel Email Template',
        config_parameter='m2st_hk_airshipping.shipping_published_air_travels_email',
    )
    enable_air_travel_rejection_bool = fields.Boolean(
        string='Enable Air Travel Published Email'
    )


    # New Shipping Order===========================================
    shipping_air_email_template_id_traveler = fields.Many2one(
        'mail.template',
        string='Traveler Shipping Email Template',
        config_parameter='m2st_hk_airshipping.shipping_air_email_template_id_traveler',
    )
    enable_air_shipping_email_traveler = fields.Boolean(
        string='Enable Traveler Shipping Email',
    )

    shipping_air_email_template_id_sender = fields.Many2one(
        'mail.template',
        string='Sender Shipping Email Template',
        config_parameter='m2st_hk_airshipping.shipping_air_email_template_id_sender',
    )
    enable_air_shipping_email_sender = fields.Boolean(
        string='Enable Sender Shipping Email',
    )

    # Shipping Rejected===========================================
    shipping_air_rejected_email_template_id_traveler = fields.Many2one(
        'mail.template',
        string='Traveler Shipping Rejected Email Template',
        config_parameter='m2st_hk_airshipping.shipping_air_rejected_email_template_id_traveler',
    )
    enable_air_shipping_rejected_email_traveler = fields.Boolean(
        string='Enable Traveler Rejected Shipping Email',
    )

    shipping_air_rejected_email_template_id_sender = fields.Many2one(
        'mail.template',
        string='Sender Rejectd Shipping Email Template',
        config_parameter='m2st_hk_airshipping.shipping_air_rejected_email_template_id_sender',
    )
    enable_air_shipping_rejected_email_sender = fields.Boolean(
        string='Enable Sender Rejected Shipping Email',
    )

    # Shipping Canncelled===========================================
    # shipping_cancelled_email_template_id_traveler = fields.Many2one(
    #     'mail.template',
    #     string='Traveler Shipping Cancelled Email Template',
    #     config_parameter='m2st_hk_airshipping.shipping_cancelled_email_template_id_traveler',
    # )
    # enable_shipping_cancelled_email_traveler = fields.Boolean(
    #     string='Enable Traveler Shipping Cancelled Email',
    # )

    # shipping_cancelled_email_template_id_sender = fields.Many2one(
    #     'mail.template',
    #     string='Sender Shipping Cancelled Email Template',
    #     config_parameter='m2st_hk_airshipping.shipping_cancelled_email_template_id_sender',
    # )
    # enable_shipping_cancelled_email_sender = fields.Boolean(
    #     string='Enable Sender Shipping Cancelled Email',
    # )

    # Shipping Traveller parcel_received===========================================
    air_shipping_traveller_parcel_received_email_template_id = fields.Many2one(
        'mail.template',
        string='Traveler Shipping traveller parcel received Email Template',
        config_parameter='m2st_hk_airshipping.air_shipping_traveller_parcel_received_email_template_id',
    )
    enable_air_shipping_traveller_parcel_received_email_traveler = fields.Boolean(
        string='Enable Traveler Shipping traveller parcel received Email',
    )

    air_shipping_traveller_parcel_received_email_template_id_sender = fields.Many2one(
        'mail.template',
        string='Sender Shipping traveller parcel received Email Template',
        config_parameter='m2st_hk_airshipping.shipping_air_traveller_parcel_received_email_template_id_sender',
    )
    enable_air_shipping_traveller_parcel_received_email_sender = fields.Boolean(
        string='Enable Sender Shipping traveller parcel received Email',
    )

    air_shipping_traveller_parcel_received_email_template_id_receiv = fields.Many2one(
        'mail.template',
        string='Recipient Shipping traveller parcel received Email Template',
        config_parameter='m2st_hk_airshipping.air_shipping_traveller_parcel_received_email_template_id_receiv',
    )
    enable_air_shipping_traveller_parcel_received_email_receiver = fields.Boolean(
        string='Enable Recipient Shipping traveller parcel received Email',
    )

    # # Shipping Traveller parcel_delivered===========================================
    air_shipping_traveller_parcel_delivered_email_template_id = fields.Many2one(
        'mail.template',
        string='Traveler Shipping traveller parcel delivered Email Template',
        config_parameter='m2st_hk_airshipping.air_shipping_traveller_parcel_delivered_email_template_id',
    )
    enable_air_shipping_traveller_parcel_delivered_email_traveler = fields.Boolean(
        string='Enable Traveler Shipping traveller parcel delivered Email',
    )

    air_shipping_traveller_parcel_delivered_sender_template = fields.Many2one(
        'mail.template',
        string='Sender Shipping traveller parcel delivered Email Template',
        config_parameter='m2st_hk_airshipping.air_shipping_traveller_parcel_delivered_sender_template',
    )
    enable_air_shipping_traveller_parcel_delivered_email_sender = fields.Boolean(
        string='Enable Sender Shipping traveller parcel delivered Email',
    )

    air_shipping_traveller_parcel_delivered_receiver_template = fields.Many2one(
        'mail.template',
        string='Sender Shipping traveller parcel delivered Email Template',
        config_parameter='m2st_hk_airshipping.air_shipping_traveller_parcel_delivered_receiver_template',
    )
    enable_air_shipping_traveller_parcel_delivered_email_recipient = fields.Boolean(
        string='Enable Recipient Shipping traveller parcel delivered Email',
    )

    # Shipping Traveller payment Complete and Delivery Code===========================================
    air_shipping_payment_complete_email_template_id = fields.Many2one(
        'mail.template',
        string='Traveler Shipping traveller parcel Payement Complete Email Template',
        config_parameter='m2st_hk_airshipping.air_shipping_payment_complete_email_template_id',
    )
    enable_air_shipping_payment_complete_email_traveler = fields.Boolean(
        string='Enable Traveler Shipping traveller parcel Payement Complete Email',
    )

    shipping_air_payment_complete_email_template_id_sender = fields.Many2one(
        'mail.template',
        string='Sender Shipping traveller parcel Payement Complete Email Template',
        config_parameter='m2st_hk_airshipping.shipping_air_payment_complete_email_template_id_sender',
    )
    enable_air_shipping_payment_complete_email_sender = fields.Boolean(
        string='Enable Sender Shipping traveller parcel Payement Complete Email',
    )

    shipping_air_delivery_code_email_receiver_template = fields.Many2one(
        'mail.template',
        string='Sender Shipping traveller parcel Delivery Code Email Template',
        config_parameter='m2st_hk_airshipping.shipping_air_delivery_code_email_receiver_template',
    )
    enable_air_shipping_delivery_code_email_recipient = fields.Boolean(
        string='Enable Recipient Shipping traveller parcel Delivery Code Email',
    )

    shipping_air_delivery_code_email_template_id_sender = fields.Many2one(
        'mail.template',
        string='Sender Shipping traveller parcel Delivery Code Email Template',
        config_parameter='m2st_hk_airshipping.shipping_air_delivery_code_email_template_id_sender',
    )
    enable_air_shipping_delivery_code_email_sender = fields.Boolean(
        string='Enable sender Shipping traveller parcel Delivery Code Email',
    )

    @api.model
    def get_values(self):
        res = super(AirResConfigSettings, self).get_values()
        params = self.env['ir.config_parameter'].sudo()

        enable_air_travel_published_bool = params.get_param('m2st_hk_airshipping.enable_air_travel_published_bool')
        shipping_published_air_travels_email = params.get_param('m2st_hk_airshipping.shipping_published_air_travels_email') or self.env['mail.template'].sudo().search(
            [('name', '=', 'HubKilo Air Travel Published Notification')], limit=1).id

        enable_air_travel_rejection_bool = params.get_param('m2st_hk_airshipping.enable_air_travel_rejection_bool')
        travel_rejection_air_travels_email = params.get_param('m2st_hk_airshipping.travel_rejection_air_travels_email') or self.env['mail.template'].sudo().search(
            [('name', '=', 'HubKilo Air Travel Rejection Notification')], limit=1).id


        enable_air_shipping_email_traveler = params.get_param('m2st_hk_airshipping.enable_air_shipping_email_traveler')
        shipping_air_email_template_id_traveler = params.get_param(
            'm2st_hk_airshipping.shipping_air_email_template_id_traveler') or self.env['mail.template'].sudo().search(
            [('name', '=', 'HubKilo Air Traveler Shipment Notification')], limit=1).id

        enable_air_shipping_email_sender = params.get_param('m2st_hk_airshipping.enable_air_shipping_email_sender')
        shipping_air_email_template_id_sender = params.get_param(
            'm2st_hk_airshipping.shipping_air_email_template_id_sender') or self.env['mail.template'].sudo().search(
            [('name', '=', 'HubKilo Air Sender Shipment Notification')], limit=1).id

        enable_air_shipping_rejected_email_traveler = params.get_param(
            'm2st_hk_airshipping.enable_air_shipping_rejected_email_traveler')
        shipping_air_rejected_email_template_id_traveler = params.get_param(
            'm2st_hk_airshipping.shipping_air_rejected_email_template_id_traveler') or self.env[
                                                               'mail.template'].sudo().search(
            [('name', '=', 'HubKilo Air Traveler Rejected Shipment Notification')], limit=1).id

        enable_air_shipping_rejected_email_sender = params.get_param(
            'm2st_hk_airshipping.enable_air_shipping_rejected_email_sender')
        shipping_air_rejected_email_template_id_sender = params.get_param(
            'm2st_hk_airshipping.shipping_air_rejected_email_template_id_sender') or self.env[
                                                             'mail.template'].sudo().search(
            [('name', '=', 'HubKilo Air Sender Rejected Shipment Notification')], limit=1).id

        # enable_shipping_cancelled_email_traveler = params.get_param(
        #     'm2st_hk_airshipping.enable_shipping_cancelled_email_traveler')
        # shipping_cancelled_email_template_id_traveler = params.get_param(
        #     'm2st_hk_airshipping.shipping_cancelled_email_template_id_traveler') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Air Traveler Shipment Cancelled Notification')], limit=1).id

        # enable_shipping_cancelled_email_sender = params.get_param(
        #     'm2st_hk_airshipping.enable_shipping_cancelled_email_sender')
        # shipping_cancelled_email_template_id_sender = params.get_param(
        #     'm2st_hk_airshipping.shipping_cancelled_email_template_id_sender') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Air Sender Shipment Cancelled Notification')], limit=1).id

        enable_air_shipping_traveller_parcel_received_email_traveler = params.get_param(
            'm2st_hk_airshipping.enable_air_shipping_traveller_parcel_received_email_traveler')
        air_shipping_traveller_parcel_received_email_template_id = params.get_param(
            'm2st_hk_airshipping.air_shipping_traveller_parcel_received_email_template_id') or self.env[
                                                                                'mail.template'].sudo().search(
            [('name', '=', 'HubKilo Air Traveler Shipment Luggage Handed Notification')], limit=1).id

        enable_air_shipping_traveller_parcel_received_email_sender = params.get_param(
            'm2st_hk_airshipping.enable_air_shipping_traveller_parcel_received_email_sender')
        air_shipping_traveller_parcel_received_email_template_id_sender = params.get_param(
            'm2st_hk_airshipping.air_shipping_traveller_parcel_received_email_template_id_sender') or self.env[
                                                                              'mail.template'].sudo().search(
            [('name', '=', 'HubKilo Air Sender Shipment Luggage Handed Notification')], limit=1).id

        enable_air_shipping_traveller_parcel_received_email_receiver = params.get_param(
            'm2st_hk_airshipping.enable_air_shipping_traveller_parcel_received_email_receiver')
        air_shipping_traveller_parcel_received_email_template_id_receiv = params.get_param(
            'm2st_hk_airshipping.air_shipping_traveller_parcel_received_email_template_id_receiv') or self.env[
                                                                                  'mail.template'].sudo().search(
            [('name', '=', 'HubKilo Air Recipient Shipment Luggage Handed Notification')], limit=1).id

        enable_air_shipping_traveller_parcel_delivered_email_traveler = params.get_param(
            'm2st_hk_airshipping.enable_air_shipping_traveller_parcel_delivered_email_traveler')
        air_shipping_traveller_parcel_delivered_email_template_id = params.get_param(
            'm2st_hk_airshipping.air_shipping_traveller_parcel_delivered_email_template_id') or self.env[
                                                                                 'mail.template'].sudo().search(
            [('name', '=', 'HubKilo Air Traveler Shipment Luggage Delivery Notification')], limit=1).id

        enable_air_shipping_traveller_parcel_delivered_email_sender = params.get_param(
            'm2st_hk_airshipping.enable_air_shipping_traveller_parcel_delivered_email_sender')
        air_shipping_traveller_parcel_delivered_sender_template = params.get_param(
            'm2st_hk_airshipping.air_shipping_traveller_parcel_delivered_sender_template') or self.env[
                                                                               'mail.template'].sudo().search(
            [('name', '=', 'HubKilo Air Sender Shipment Luggage Delivery Notification')], limit=1).id

        enable_air_shipping_traveller_parcel_delivered_email_recipient = params.get_param(
            'm2st_hk_airshipping.enable_air_shipping_traveller_parcel_delivered_email_recipient')
        air_shipping_traveller_parcel_delivered_receiver_template = params.get_param(
            'm2st_hk_airshipping.air_shipping_traveller_parcel_delivered_receiver_template') or self.env[
                                                                                  'mail.template'].sudo().search(
            [('name', '=', 'HubKilo Air Recipient Shipment Luggage Delivery Notification')], limit=1).id

        enable_air_shipping_payment_complete_email_traveler = params.get_param(
            'm2st_hk_airshipping.enable_air_shipping_payment_complete_email_traveler')
        air_shipping_payment_complete_email_template_id = params.get_param(
            'm2st_hk_airshipping.air_shipping_payment_complete_email_template_id') or self.env[
                                                                       'mail.template'].sudo().search(
            [('name', '=', 'HubKilo Air Traveler Shipment Payment Confirmation Notification')], limit=1).id

        enable_air_shipping_payment_complete_email_sender = params.get_param(
            'm2st_hk_airshipping.enable_air_shipping_payment_complete_email_sender')
        shipping_air_payment_complete_email_template_id_sender = params.get_param(
            'm2st_hk_airshipping.shipping_air_payment_complete_email_template_id_sender') or self.env[
                                                                     'mail.template'].sudo().search(
            [('name', '=', 'HubKilo Air Sender Shipment Payment Confirmation Notification')], limit=1).id

        enable_air_shipping_delivery_code_email_sender = params.get_param(
            'm2st_hk_airshipping.enable_air_shipping_delivery_code_email_sender')
        shipping_air_delivery_code_email_template_id_sender = params.get_param(
            'm2st_hk_airshipping.shipping_air_delivery_code_email_template_id_sender') or self.env[
                                                                  'mail.template'].sudo().search(
            [('name', '=', 'HubKilo Air Sender Shipment Delivery Code Notification')], limit=1).id

        enable_air_shipping_delivery_code_email_recipient = params.get_param(
            'm2st_hk_airshipping.enable_air_shipping_delivery_code_email_recipient')
        shipping_air_delivery_code_email_receiver_template = params.get_param(
            'm2st_hk_airshipping.shipping_air_delivery_code_email_receiver_template') or self.env[
                                                                     'mail.template'].sudo().search(
            [('name', '=', 'HubKilo Air Recipient Shipment Delivery Code Notification')], limit=1).id

        res.update(

            enable_air_travel_published_bool=bool(enable_air_travel_published_bool),
            shipping_published_air_travels_email=int(shipping_published_air_travels_email),

            enable_air_travel_rejection_bool=bool(enable_air_travel_rejection_bool),
            travel_rejection_air_travels_email=int(travel_rejection_air_travels_email),

            enable_air_shipping_email_traveler=bool(enable_air_shipping_email_traveler),
            shipping_air_email_template_id_traveler=int(shipping_air_email_template_id_traveler),
            enable_air_shipping_email_sender=bool(enable_air_shipping_email_sender),
            shipping_air_email_template_id_sender=int(shipping_air_email_template_id_sender),

            enable_air_shipping_rejected_email_traveler=bool(enable_air_shipping_rejected_email_traveler),
            shipping_air_rejected_email_template_id_traveler=int(shipping_air_rejected_email_template_id_traveler),
            enable_air_shipping_rejected_email_sender=bool(enable_air_shipping_rejected_email_sender),
            shipping_air_rejected_email_template_id_sender=int(shipping_air_rejected_email_template_id_sender),

            # enable_shipping_cancelled_email_traveler=bool(enable_shipping_cancelled_email_traveler),
            # shipping_cancelled_email_template_id_traveler=int(shipping_cancelled_email_template_id_traveler),
            # enable_shipping_cancelled_email_sender=bool(enable_shipping_cancelled_email_sender),
            # shipping_cancelled_email_template_id_sender=int(shipping_cancelled_email_template_id_sender),

            enable_air_shipping_traveller_parcel_received_email_traveler=bool(
                enable_air_shipping_traveller_parcel_received_email_traveler),
            air_shipping_traveller_parcel_received_email_template_id=int(
                air_shipping_traveller_parcel_received_email_template_id),

            enable_air_shipping_traveller_parcel_received_email_sender=bool(
                enable_air_shipping_traveller_parcel_received_email_sender),
            air_shipping_traveller_parcel_received_email_template_id_sender=int(
                air_shipping_traveller_parcel_received_email_template_id_sender),

            enable_air_shipping_traveller_parcel_received_email_receiver=bool(
                enable_air_shipping_traveller_parcel_received_email_receiver),
            air_shipping_traveller_parcel_received_email_template_id_receiv=int(
                air_shipping_traveller_parcel_received_email_template_id_receiv),

            enable_air_shipping_traveller_parcel_delivered_email_traveler=bool(
                enable_air_shipping_traveller_parcel_delivered_email_traveler),
            air_shipping_traveller_parcel_delivered_email_template_id=int(
                air_shipping_traveller_parcel_delivered_email_template_id),
            enable_air_shipping_traveller_parcel_delivered_email_sender=bool(
                enable_air_shipping_traveller_parcel_delivered_email_sender),
            air_shipping_traveller_parcel_delivered_sender_template=int(
                air_shipping_traveller_parcel_delivered_sender_template),

            enable_air_shipping_traveller_parcel_delivered_email_recipient=bool(
                enable_air_shipping_traveller_parcel_delivered_email_recipient),
            air_shipping_traveller_parcel_delivered_receiver_template=int(
                air_shipping_traveller_parcel_delivered_receiver_template),

            enable_air_shipping_payment_complete_email_traveler=bool(
                enable_air_shipping_payment_complete_email_traveler),
            air_shipping_payment_complete_email_template_id=int(
                air_shipping_payment_complete_email_template_id),
            enable_air_shipping_payment_complete_email_sender=bool(
                enable_air_shipping_payment_complete_email_sender),
            shipping_air_payment_complete_email_template_id_sender=int(
                shipping_air_payment_complete_email_template_id_sender),

            enable_air_shipping_delivery_code_email_sender=bool(
                enable_air_shipping_delivery_code_email_sender),
            shipping_air_delivery_code_email_template_id_sender=int(
                shipping_air_delivery_code_email_template_id_sender),

            enable_air_shipping_delivery_code_email_recipient=bool(
                enable_air_shipping_delivery_code_email_recipient),
            shipping_air_delivery_code_email_receiver_template=int(
                shipping_air_delivery_code_email_receiver_template),

        )
        return res

    def set_values(self):
        super(AirResConfigSettings, self).set_values()
        params = self.env['ir.config_parameter'].sudo()

        params.set_param('m2st_hk_airshipping.enable_air_travel_published_bool',
                         self.enable_air_travel_published_bool)
        params.set_param('m2st_hk_airshipping.shipping_published_air_travels_email',
                         self.shipping_published_air_travels_email.id or False)

        params.set_param('m2st_hk_airshipping.enable_air_travel_rejection_bool',
                         self.enable_air_travel_rejection_bool)
        params.set_param('m2st_hk_airshipping.travel_rejection_air_travels_email',
                         self.travel_rejection_air_travels_email.id or False)

        params.set_param('m2st_hk_airshipping.enable_air_shipping_email_traveler',
                         self.enable_air_shipping_email_traveler)
        params.set_param('m2st_hk_airshipping.shipping_air_email_template_id_traveler',
                         self.shipping_air_email_template_id_traveler.id or False)
        params.set_param('m2st_hk_airshipping.enable_air_shipping_email_sender', self.enable_air_shipping_email_sender)
        params.set_param('m2st_hk_airshipping.shipping_air_email_template_id_sender',
                         self.shipping_air_email_template_id_sender.id or False)

        params.set_param('m2st_hk_airshipping.enable_air_shipping_rejected_email_traveler',
                         self.enable_air_shipping_rejected_email_traveler)
        params.set_param('m2st_hk_airshipping.shipping_air_rejected_email_template_id_traveler',
                         self.shipping_air_rejected_email_template_id_traveler.id or False)
        params.set_param('m2st_hk_airshipping.enable_air_shipping_rejected_email_sender',
                         self.enable_air_shipping_rejected_email_sender)
        params.set_param('m2st_hk_airshipping.shipping_air_rejected_email_template_id_sender',
                         self.shipping_air_rejected_email_template_id_sender.id or False)

        # params.set_param('m2st_hk_airshipping.enable_shipping_cancelled_email_traveler',
        #                  self.enable_shipping_cancelled_email_traveler)
        # params.set_param('m2st_hk_airshipping.shipping_cancelled_email_template_id_traveler',
        #                  self.shipping_cancelled_email_template_id_traveler.id or False)
        # params.set_param('m2st_hk_airshipping.enable_shipping_cancelled_email_sender',
        #                  self.enable_shipping_cancelled_email_sender)
        # params.set_param('m2st_hk_airshipping.shipping_cancelled_email_template_id_sender',
        #                  self.shipping_cancelled_email_template_id_sender.id or False)

        params.set_param('m2st_hk_airshipping.enable_air_shipping_traveller_parcel_received_email_traveler',
                         self.enable_air_shipping_traveller_parcel_received_email_traveler)
        params.set_param('m2st_hk_airshipping.air_shipping_traveller_parcel_received_email_template_id',
                         self.air_shipping_traveller_parcel_received_email_template_id.id or False)

        params.set_param('m2st_hk_airshipping.enable_air_shipping_traveller_parcel_received_email_sender',
                         self.enable_air_shipping_traveller_parcel_received_email_sender)
        params.set_param('m2st_hk_airshipping.air_shipping_traveller_parcel_received_email_template_id_sender',
                         self.air_shipping_traveller_parcel_received_email_template_id_sender.id or False)

        params.set_param('m2st_hk_airshipping.enable_air_shipping_traveller_parcel_received_email_receiver',
                         self.enable_air_shipping_traveller_parcel_received_email_receiver)
        params.set_param('m2st_hk_airshipping.air_shipping_traveller_parcel_received_email_template_id_receiv',
                         self.air_shipping_traveller_parcel_received_email_template_id_receiv.id or False)

        params.set_param('m2st_hk_airshipping.enable_air_shipping_traveller_parcel_delivered_email_traveler',
                         self.enable_air_shipping_traveller_parcel_delivered_email_traveler)
        params.set_param('m2st_hk_airshipping.air_shipping_traveller_parcel_delivered_email_template_id',
                         self.air_shipping_traveller_parcel_delivered_email_template_id.id or False)
        params.set_param('m2st_hk_airshipping.enable_air_shipping_traveller_parcel_delivered_email_sender',
                         self.enable_air_shipping_traveller_parcel_delivered_email_sender)
        params.set_param('m2st_hk_airshipping.air_shipping_traveller_parcel_delivered_sender_template',
                         self.air_shipping_traveller_parcel_delivered_sender_template.id or False)

        params.set_param('m2st_hk_airshipping.enable_air_shipping_traveller_parcel_delivered_email_recipient',
                         self.enable_air_shipping_traveller_parcel_delivered_email_recipient)
        params.set_param('m2st_hk_airshipping.air_shipping_traveller_parcel_delivered_receiver_template',
                         self.air_shipping_traveller_parcel_delivered_receiver_template.id or False)

        params.set_param('m2st_hk_airshipping.enable_air_shipping_payment_complete_email_traveler',
                         self.enable_air_shipping_payment_complete_email_traveler)
        params.set_param('m2st_hk_airshipping.air_shipping_payment_complete_email_template_id',
                         self.air_shipping_payment_complete_email_template_id.id or False)
        params.set_param('m2st_hk_airshipping.enable_air_shipping_payment_complete_email_sender',
                         self.enable_air_shipping_payment_complete_email_sender)
        params.set_param('m2st_hk_airshipping.shipping_air_payment_complete_email_template_id_sender',
                         self.shipping_air_payment_complete_email_template_id_sender.id or False)

        params.set_param('m2st_hk_airshipping.enable_air_shipping_delivery_code_email_sender',
                         self.enable_air_shipping_delivery_code_email_sender)
        params.set_param('m2st_hk_airshipping.shipping_air_delivery_code_email_template_id_sender',
                         self.shipping_air_delivery_code_email_template_id_sender.id or False)

        params.set_param('m2st_hk_airshipping.enable_air_shipping_delivery_code_email_recipient',
                         self.enable_air_shipping_delivery_code_email_recipient)
        params.set_param('m2st_hk_airshipping.shipping_air_delivery_code_email_receiver_template',
                         self.shipping_air_delivery_code_email_receiver_template.id or False)
