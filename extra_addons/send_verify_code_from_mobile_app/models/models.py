from odoo import models, fields, api


class ResUsersInherit(models.Model):
    _inherit = 'res.users'

    @api.model
    def create(self, vals):
        user = super(ResUsersInherit, self).create(vals)

        if user and user.email:
            template = self.env.ref('send_verify_code_from_mobile_app.hub_verification')
            template.send_mail(user.id, force_send=True)
            print("Verification mail sent........................")
        return user


class ResPartnerInherit(models.Model):
    _inherit = 'res.partner'
