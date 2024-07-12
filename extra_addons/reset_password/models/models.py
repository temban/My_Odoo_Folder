from odoo import models, fields, api
import random
import string


class ResUsers(models.Model):
    _inherit = 'res.users'

    mail_new_password = fields.Char(string="Reset Password", readonly=True)

    def reset_password_and_send_email(self, email):
        user = self.env['res.users'].sudo().search([('login', '=', email)], limit=1)
        if user:
            new_password = 'Hub'.join(random.choices(string.ascii_letters + string.digits, k=3))
            user.sudo().write({'password': new_password, 'mail_new_password': new_password})

            template = self.env.ref('reset_password.odoo_email_template_forgot_password')
            template.sudo().send_mail(user.id, force_send=True)
            # if mail_sent:
            #     user.sudo().write({'mail_new_password': new_password})
            #     print("mail_new_password", user.mail_new_password)
            #     return True
        return True
