from datetime import date, datetime

from odoo import fields, models, api

from datetime import datetime, timezone, time


class ConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    manager_required_bonus_points = fields.Integer(string="Required Points for a Bonus",
                                                   config_parameter='user_fidelity_points.manager_required_bonus_points')

    def set_values(self):
        super(ConfigSettings, self).set_values()
        self.env['ir.config_parameter'].sudo().set_param('user_fidelity_points.manager_required_bonus_points',
                                                         self.manager_required_bonus_points or '')

    @api.model
    def get_values(self):
        res = super(ConfigSettings, self).get_values()
        res.update(manager_required_bonus_points=self.env['ir.config_parameter'].sudo().get_param(
            'user_fidelity_points.manager_required_bonus_points'))
        return res


class ResUsers(models.Model):
    _inherit = 'res.users'


class ResAccount(models.Model):
    _inherit = 'account.account'


class ResPartner(models.Model):
    _inherit = 'res.partner'

    client_points = fields.Integer(string="Points")
    client_bonus = fields.Integer(string="Bonus")

    def write(self, vals):
        res = super(ResPartner, self).write(vals)
        template = self.env.ref('user_fidelity_points.points')
        template1 = self.env.ref('user_fidelity_points.bonus')
        manager_required_bonus_points = self.env['ir.config_parameter'].sudo().get_param(
            'user_fidelity_points.manager_required_bonus_points')
        if 'client_points' and 'client_bonus' in vals and self.ids:
            for rec in self:
                template.send_mail(rec.ids[0], force_send=True)
                template1.send_mail(rec.ids[0], force_send=True)
        elif 'client_bonus' in vals and self.ids:
            for rec in self:
                template1.send_mail(rec.ids[0], force_send=True)
        elif 'client_points' in vals and self.ids:
            for rec in self:
                if rec.client_points >= int(manager_required_bonus_points):
                    bonus = rec.client_points // int(manager_required_bonus_points)
                    remainder = rec.client_points % int(manager_required_bonus_points)
                    rec.client_points = remainder
                    rec.client_bonus += bonus
                template.send_mail(rec.ids[0], force_send=True)
        # print(rec.ids[0], rec.id, rec.ids)
        return res

