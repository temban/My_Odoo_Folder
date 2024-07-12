from odoo import models, fields, api, _
from odoo.exceptions import UserError

# class ResUsers(models.Model):
#     _inherit = 'res.users'
#
#     @api.model
#     def send_password_reset_email(self, login):
#         user = self.search([('login', '=', login)], limit=1)
#         if not user:
#             raise UserError(_("No user found with the provided login."))
#
#         # Generate a new random password for the user.
#         new_password = self.env['ir.sequence'].next_by_code('res.users') or 'Password123'  # You can use a custom password generator.
#
#         # Set the new password for the user.
#         user.write({'password': new_password})
#
#         # Find the existing mail template for the password reset email.
#         template = self.env.ref('hubkilo_mails.mail_template_data_password_reset')
#
#         # Replace placeholders in the email body with actual values.
#         email_body = template.body_html.replace('${user}', user.name).replace('${new_password}', new_password)
#
#         # Send the email using the mail.template 'send_mail' method.
#         mail_values = {
#             'subject': template.subject,
#             'body_html': email_body,
#             'email_to': user.email,
#         }
#         mail_template = self.env['mail.mail'].sudo().create(mail_values)
#         mail_template.send()
#
#         return True
#
#

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    # Published Travels===========================================
    published_travels_email_template_id = fields.Many2one(
        'mail.template',
        string='Published Travel Email Template',
        config_parameter='hubkilo_mails.published_travels_email_template_id',
    )
    enable_published_travels_email = fields.Boolean(
        string='Enable Published Travels Email',
    )

    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        params = self.env['ir.config_parameter'].sudo()
        enable_published_travels_email = params.get_param('hubkilo_mails.enable_published_travels_email')
        published_travels_email_template_id = params.get_param('hubkilo_mails.published_travels_email_template_id')


        res.update(
            enable_published_travels_email=bool(enable_published_travels_email),
            published_travels_email_template_id=int(published_travels_email_template_id),

        )
        return res

    def set_values(self):
        super(ResConfigSettings, self).set_values()
        params = self.env['ir.config_parameter'].sudo()
        params.set_param('hubkilo_mails.enable_published_travels_email', self.enable_published_travels_email)
        params.set_param('hubkilo_mails.published_travels_email_template_id',
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
