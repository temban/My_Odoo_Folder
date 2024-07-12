from odoo import models, fields, api, _


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    # Shipping price_proposed===========================================
    shipping_price_proposed_email_template_id_traveler = fields.Many2one(
        'mail.template',
        string='Traveler Shipping Price Proposal Email Template',
        config_parameter='HubKilo_Notifications.shipping_price_proposed_email_template_id_traveler',
    )
    enable_shipping_price_proposed_email_traveler = fields.Boolean(
        string='Enable Email of Traveller price proposition in Shipping',
    )

    shipping_price_proposed_email_template_id_sender = fields.Many2one(
        'mail.template',
        string='Sender Price Proposal Shipping Email Template',
        config_parameter='HubKilo_Notifications.shipping_price_proposed_email_template_id_sender',
    )
    enable_shipping_price_proposed_email_sender = fields.Boolean(
        string='Enable Email of Sender Price Proposition in Shipping',
    )

    # Shipping Sender price_validated===========================================
    shipping_price_validated_email_template_id_traveler = fields.Many2one(
        'mail.template',
        string='Traveler Shipping Price Validation Email Template',
        config_parameter='HubKilo_Notifications.shipping_price_validated_email_template_id_traveler',
    )
    enable_shipping_price_validated_email_traveler = fields.Boolean(
        string='Enable Email of Traveller price Validation in Shipping',
    )

    shipping_price_validated_email_template_id_sender = fields.Many2one(
        'mail.template',
        string='Sender Price Validation Shipping Email Template',
        config_parameter='HubKilo_Notifications.shipping_price_validated_email_template_id_sender',
    )
    enable_shipping_price_validated_email_sender = fields.Boolean(
        string='Enable Email of Sender Price Validation in Shipping',
    )

    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        params = self.env['ir.config_parameter'].sudo()

        enable_shipping_price_proposed_email_traveler = params.get_param(
            'HubKilo_Notifications.enable_shipping_price_proposed_email_traveler')
        shipping_price_proposed_email_template_id_traveler = params.get_param(
            'HubKilo_Notifications.shipping_price_proposed_email_template_id_traveler') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Traveler Shipment Price Proposition Notification')], limit=1).id

        enable_shipping_price_proposed_email_sender = params.get_param(
            'HubKilo_Notifications.enable_shipping_price_proposed_email_sender')
        shipping_price_proposed_email_template_id_sender = params.get_param(
            'HubKilo_Notifications.shipping_price_proposed_email_template_id_sender') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Sender Shipment Price Proposition Notification')], limit=1).id

        enable_shipping_price_validated_email_traveler = params.get_param(
            'HubKilo_Notifications.enable_shipping_price_validated_email_traveler')
        shipping_price_validated_email_template_id_traveler = params.get_param(
            'HubKilo_Notifications.shipping_price_validated_email_template_id_traveler') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Traveler Shipment Price Proposition Accepted Notification')], limit=1).id

        enable_shipping_price_validated_email_sender = params.get_param(
            'HubKilo_Notifications.enable_shipping_price_validated_email_sender')
        shipping_price_validated_email_template_id_sender = params.get_param(
            'HubKilo_Notifications.shipping_price_validated_email_template_id_sender') or self.env['mail.template'].sudo().search([('name', '=', 'HubKilo Road Sender Shipment Price Proposition Accepted Notification')], limit=1).id

        res.update(

            enable_shipping_price_proposed_email_traveler=bool(enable_shipping_price_proposed_email_traveler),
            shipping_price_proposed_email_template_id_traveler=int(shipping_price_proposed_email_template_id_traveler),
            enable_shipping_price_proposed_email_sender=bool(enable_shipping_price_proposed_email_sender),
            shipping_price_proposed_email_template_id_sender=int(shipping_price_proposed_email_template_id_sender),

            enable_shipping_price_validated_email_traveler=bool(enable_shipping_price_validated_email_traveler),
            shipping_price_validated_email_template_id_traveler=int(
                shipping_price_validated_email_template_id_traveler),
            enable_shipping_price_validated_email_sender=bool(enable_shipping_price_validated_email_sender),
            shipping_price_validated_email_template_id_sender=int(shipping_price_validated_email_template_id_sender),
        )
        return res

    def set_values(self):
        super(ResConfigSettings, self).set_values()
        params = self.env['ir.config_parameter'].sudo()

        params.set_param('HubKilo_Notifications.enable_shipping_price_proposed_email_traveler',
                         self.enable_shipping_price_proposed_email_traveler)
        params.set_param('HubKilo_Notifications.shipping_price_proposed_email_template_id_traveler',
                         self.shipping_price_proposed_email_template_id_traveler.id or False)
        params.set_param('HubKilo_Notifications.enable_shipping_price_proposed_email_sender',
                         self.enable_shipping_price_proposed_email_sender)
        params.set_param('HubKilo_Notifications.shipping_price_proposed_email_template_id_sender',
                         self.shipping_price_proposed_email_template_id_sender.id or False)

        params.set_param('HubKilo_Notifications.enable_shipping_price_validated_email_traveler',
                         self.enable_shipping_price_validated_email_traveler)
        params.set_param('HubKilo_Notifications.shipping_price_validated_email_template_id_traveler',
                         self.shipping_price_validated_email_template_id_traveler.id or False)
        params.set_param('HubKilo_Notifications.enable_shipping_price_validated_email_sender',
                         self.enable_shipping_price_validated_email_sender)
        params.set_param('HubKilo_Notifications.shipping_price_validated_email_template_id_sender',
                         self.shipping_price_validated_email_template_id_sender.id or False)


class TravelMessage(models.Model):
    _inherit = 'm1st_hk_roadshipping.travelmessage'

    @api.model
    def create(self, vals):
        # Call the create method from the parent class and get the created recordset
        shipping_price_proposed = super(TravelMessage, self).create(vals)

        # Check if the sender is the traveler
        sender_id = shipping_price_proposed.sender_partner_id.id
        traveler_id = shipping_price_proposed.shipping_id.travelbooking_id.partner_id.id

        # Check if it's the traveler's first message
        existing_messages = shipping_price_proposed.sudo().search([('sender_partner_id', '=', traveler_id)])
        messages_length = len(existing_messages)
        print("Sent Traveler ------------------------------", traveler_id, "seeee", sender_id, "rrrr",
              messages_length)
        sender_id_int = int(sender_id)
        traveler_id_int = int(traveler_id)
        if messages_length < 3 and sender_id_int == traveler_id_int:
            # It's the traveler's first message, proceed with sending the email
            if self.env['res.config.settings'].sudo().get_values().get(
                    'enable_shipping_price_proposed_email_traveler'):
                template_id = self.env['res.config.settings'].sudo().get_values().get(
                    'shipping_price_proposed_email_template_id_traveler')
                if template_id:
                    template = self.env['mail.template'].browse(template_id)
                    template.send_mail(shipping_price_proposed.id, force_send=True)
                    print("Sent Traveler for shipping proposed price Email ------------------------------")

            if self.env['res.config.settings'].sudo().get_values().get(
                    'enable_shipping_price_proposed_email_sender'):
                template_id = self.env['res.config.settings'].sudo().get_values().get(
                    'shipping_price_proposed_email_template_id_sender')
                if template_id:
                    template = self.env['mail.template'].browse(template_id)
                    template.send_mail(shipping_price_proposed.id, force_send=True)
                    print("Sent Sender for shipping proposed price Email ------------------------------")
        else:
            print("Exist")

        return shipping_price_proposed

    @api.model
    def write(self, vals):
        shipping_price_validated = super(TravelMessage, self).write(vals)
        if 'shipper_validate' in vals:
            if vals['shipper_validate']:
                config_settings = self.env['res.config.settings'].sudo().get_values()

                # Send Traveler Email
                if config_settings.get('enable_shipping_price_validated_email_traveler'):
                    template_id = config_settings.get('shipping_price_validated_email_template_id_traveler')
                    if template_id:
                        template = self.env['mail.template'].browse(template_id)
                        template.send_mail(self.id, force_send=True)
                        print("Sent Traveler Shipping Price validated Email ------------------------------")

                # Send Sender Email
                if config_settings.get('enable_shipping_price_validated_email_sender'):
                    template_id = config_settings.get('shipping_price_validated_email_template_id_sender')
                    if template_id:
                        template = self.env['mail.template'].browse(template_id)
                        template.send_mail(self.id, force_send=True)
                        print("Sent Sender Shipping Price validated Email ------------------------------")

        return shipping_price_validated
