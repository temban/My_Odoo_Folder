from odoo import models, fields, api

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    # Published Travels===========================================
    published_travels_email_template_id = fields.Many2one(
        'mail.template',
        string='Published Travel Email Template',
        config_parameter='HubKilo_Notifications.published_travels_email_template_id',
    )
    enable_published_travels_email = fields.Boolean(
        string='Enable Published Travels Email',
    )

    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        params = self.env['ir.config_parameter'].sudo()
        enable_published_travels_email = params.get_param('HubKilo_Notifications.enable_published_travels_email')
        published_travels_email_template_id = params.get_param('HubKilo_Notifications.published_travels_email_template_id')


        res.update(
            enable_published_travels_email=bool(enable_published_travels_email),
            published_travels_email_template_id=int(published_travels_email_template_id),

        )
        return res

    def set_values(self):
        super(ResConfigSettings, self).set_values()
        params = self.env['ir.config_parameter'].sudo()
        params.set_param('HubKilo_Notifications.enable_published_travels_email', self.enable_published_travels_email)
        params.set_param('HubKilo_Notifications.published_travels_email_template_id',
                         self.published_travels_email_template_id.id or False)


class TravelBookingMails(models.Model):
    _inherit = 'm1st_hk_roadshipping.travelbooking'

    @api.model
    def write(self, vals):
        travel = super(TravelBookingMails, self).write(vals)

        if 'state' in vals and vals['state'] == 'negotiating':
            for travel in self:
                if travel.partner_id and self.env['res.config.settings'].sudo().get_values().get(
                        'enable_published_travels_email'):
                    template_id = self.env['res.config.settings'].sudo().get_values().get(
                        'published_travels_email_template_id')
                    if template_id:
                        template = self.env['mail.template'].browse(template_id)
                        template.send_mail(travel.id, force_send=True)
                        print("sent travel published mail------------------------------")

        return travel
