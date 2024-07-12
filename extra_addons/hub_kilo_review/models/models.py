# -*- coding: utf-8 -*-
from odoo import fields, models, api, _
from odoo.exceptions import UserError, ValidationError


class ResPartnerRating(models.Model):
    _name = 'res.partner.rating'
    _description = 'Partner Rating'

    RATING_SELECTION = [
        ('1', '★'),
        ('2', '★★'),
        ('3', '★★★'),
        ('4', '★★★★'),
        ('5', '★★★★★')
    ]

    rater_id = fields.Many2one('res.partner', string='Shipper', required=True)
    rated_id = fields.Many2one('res.partner', string='Traveler', required=True)
    rating = fields.Selection(
        RATING_SELECTION,
        string='Rating',
        required=True,
        default='3',
    )
    comment = fields.Text(string='Comment')
    rating_date = fields.Date(string='Rating Date', default=fields.Date.today, readonly=True)
    average_rating = fields.Float(string='Average Rating', compute='_compute_average_rating', store=True,)
    shipping_id = fields.Many2one('m1st_hk_roadshipping.shipping', string='Shipping')

    #=========================== FUNCTIONS
    @api.depends('rated_id.rating_ids.rating')
    def _compute_average_rating(self):
        for rating in self:
            ratings = rating.rated_id.rating_ids.filtered(lambda r: r.rating > '0')
            total_ratings = len(ratings)
            if total_ratings > 0:
                total_sum = sum(int(r.rating) for r in ratings)
                rating.average_rating = total_sum / total_ratings
            else:
                rating.average_rating = 0.0

    #=================== MISC
    @api.onchange('shipping_id')
    def onchange_shipping_id(self):
        if not self.shipping_id: return None
        self.rater_id = self.shipping_id.partner_id.id
        self.rated_id = self.shipping_id.travelbooking_id.partner_id.id

    #======================= CONSTRAINS
    @api.constrains('shipping_id')
    def _check_is_rated(self):
        for r in self:
            if r.shipping_id.is_rated:
                text = _(u"Validation error : You are not able to rated more than one time this shipping %s!" % r.shipping_id.name)
                raise ValidationError(text)

        return True


    #======================== ORM
    @api.model
    def create(self, vals):
        rating = super(ResPartnerRating, self).create(vals)
        rating.shipping_id.is_rated = True

        return rating



class ResPartner(models.Model):
    _inherit = 'res.partner'

    rating_ids = fields.One2many('res.partner.rating', 'rated_id', string='Ratings Received')
    given_rating_ids = fields.One2many('res.partner.rating', 'rater_id', string='Ratings Given')
    average_rating = fields.Float(string='Average Rating', compute='_compute_average_rating',
                                  store=True,)

    @api.depends('rating_ids.rating')
    def _compute_average_rating(self):
        for partner in self:
            ratings = partner.rating_ids.filtered(lambda r: r.rating > '0')
            total_ratings = len(ratings)
            if total_ratings > 0:
                total_sum = sum(int(r.rating) for r in ratings)
                partner.average_rating = total_sum / total_ratings
            else:
                partner.average_rating = 0.0


class TravelBooking(models.Model):
    _name = 'm1st_hk_roadshipping.travelbooking'
    _inherit = 'm1st_hk_roadshipping.travelbooking'


    average_rating = fields.Float(related='partner_id.average_rating',
                                  string='Average Rating', store=True, )


    def action_view_rating(self, ratings=False):
        self.ensure_one()
        rating_obj = self.get_model_pool('res.partner.rating')

        if not ratings:
            ratings = rating_obj.search([('rated_id', '=', self.partner_id.id)])

        result = self.env['ir.actions.act_window']._for_xml_id('hub_kilo_review.hubkilo_action_partner_rating')
        # choose the view_mode accordingly
        if len(ratings) > 1:
            result['domain'] = [('id', 'in', ratings.ids)]
        elif len(ratings) == 1:
            res = self.env.ref('hub_kilo_review.hubkilo_view_partner_rating_tree', False)
            #form_view = [(res and res.id or False, 'form')]
            result['views'] = [(res and res.id or False, 'form')]
            # if 'views' in result:
            #     result['views'] = form_view + [(state, view) for state, view in result['views'] if view != 'form']
            # else:
            #     result['views'] = form_view
            result['res_id'] = ratings.id
        else:
            result = {'type': 'ir.actions.act_window_close'}

        return result


class RoadShipping(models.Model):
    _name = 'm1st_hk_roadshipping.shipping'
    _inherit = 'm1st_hk_roadshipping.shipping'


    average_rating = fields.Float(related='travelbooking_id.partner_id.average_rating',
                                  string='Average Rating', store=True, )

    is_rated = fields.Boolean(string="Is rated?", readonly=True,
                              help="If this box is checked means that this Shipping is already rated")

    disagree = fields.Boolean(string="Is traveler disagree?", readonly=True,
                              help="This field is activated if the traveler disagree this Shipping")


    #==================== CONSTRAINS
    @api.constrains('state')
    def _check_is_not_disagree(self):
        for r in self:
            if r.disagree:
                text = _(u"Validation error : The Shipping (%s) cannot be modified any more. Please unmark disagree state first!" % (
                r.shipping_id.name))
                raise ValidationError(text)
        return True


    #====================== WKF
    def mark_traveler_disagree(self):
        self.write( {'disagree': True} )

    def unmark_traveler_disagree(self):
        self.write( {'disagree': False} )


    #======================= MISC
    def action_view_rating(self, ratings=False):
        self.ensure_one()
        rating_obj = self.get_model_pool('res.partner.rating')

        if not ratings:
            ratings = rating_obj.search([('rated_id', '=', self.travelbooking_id.partner_id.id)])

        result = self.env['ir.actions.act_window']._for_xml_id('hub_kilo_review.hubkilo_action_partner_rating')
        # choose the view_mode accordingly
        if len(ratings) > 1:
            result['domain'] = [('id', 'in', ratings.ids)]
        elif len(ratings) == 1:
            res = self.env.ref('hub_kilo_review.hubkilo_view_partner_rating_tree', False)
            #form_view = [(res and res.id or False, 'form')]
            result['views'] = [(res and res.id or False, 'form')]
            # if 'views' in result:
            #     result['views'] = form_view + [(state, view) for state, view in result['views'] if view != 'form']
            # else:
            #     result['views'] = form_view
            result['res_id'] = ratings.id
        else:
            result = {'type': 'ir.actions.act_window_close'}

        return result