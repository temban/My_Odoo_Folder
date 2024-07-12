from odoo import models, fields, api, _


class TravelBookingModel(models.Model):
    _inherit = 'm1st_hk_roadshipping.travelbooking'


class TravelMessageController(models.Model):
    _inherit = 'm1st_hk_roadshipping.travelmessage'


class BaseUsers(models.Model):
    _inherit = 'res.partner'

    image_1920 = fields.Binary(default='/hubkilo_website/static/src/img/avatar-profile.png')


class City(models.Model):
    _inherit = 'res.city'

    name = fields.Char(string='City', required=True, translate=True)
    country_id = fields.Many2one('res.country', string='Country', required=True)
    capital = fields.Boolean(string='Capital', default=False)


class ResPartnerRating(models.Model):
    _inherit = 'res.partner.rating'

class BaseUsers(models.Model):
    _inherit = 'res.users'