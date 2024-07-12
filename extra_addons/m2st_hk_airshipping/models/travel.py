# -*- coding: utf-8 -*-
## PYTHON BUILT_IN IMPORT
from datetime import datetime, date
import time
from random import randint

## ODOO IMPORT
from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError


class TravelRejectReasonWizard(models.TransientModel):
    _name = 'm2st_hk_airshipping.travel.reject.reason'
    _description = 'Travel Rejection Reason Wizard'

    reason = fields.Text(string='Reason', required=True)
    date = fields.Date(string='Date', required=True, readonly=True,
                       default=fields.Date.today())
    travel_booking_id = fields.Many2one('m2st_hk_airshipping.travelbooking', string='Travel Booking', readonly=True, )

    def confirm_reason(self):
        self.travel_booking_id.set_to_rejected()
        return {'type': 'ir.actions.act_window_close'}


class TravelerVerification(models.Model):
    _name = 'm2st_hk_airshipping.traveler.verification'
    _description = 'Traveler Verification'

    flight_announcement_id = fields.Many2one('m2st_hk_airshipping.travelbooking', string='Air Travel Announcement',
                                             required=True)
    flight_ticket = fields.Binary(string='Flight Ticket', required=True)
    covid_test_proof = fields.Binary(string='COVID Test Proof', required=True)
    # eligible_to_travel = fields.Boolean(string='Is Eligible to Travel', default=False)
    date = fields.Date(string='Date', default=fields.Date.today, required=True)
    description = fields.Text(string='Any information to communicate?')

    # @api.onchange('eligible_to_travel')
    # def _onchange_eligible_to_travel(self):
    #     for r in self:
    #         if r.eligible_to_travel:
    #             print(r.flight_announcement_id.state)
    #             r.flight_announcement_id.state = 'negotiating'


class FlightLuggage(models.Model):
    _name = 'm2st_hk_airshipping.flight.luggage'
    _inherit = 'm0sthk.base'
    _description = 'Flight Luggage'

    @api.model
    def _get_default_partner(self):
        partner_obj = self.env.get('res.partner')
        return partner_obj.search([('related_user_id', '=', self.env.user.id)], limit=1)

    partner_id = fields.Many2one('res.partner', string='Flight Luggage Creator', default=_get_default_partner)
    luggage_type_id = fields.Many2one('m2st_hk_airshipping.luggage.type', string='Luggage Type', required=True)
    flight_announcement_id = fields.Many2one('m2st_hk_airshipping.travelbooking', string='Air Travel Announcement',
                                             ondelete='cascade')
    price = fields.Monetary(string='Unit Price', required=True, digits=(16, 2), currency_field='currency_id')
    quantity = fields.Float(string='Total Quantity', )
    currency_id = fields.Many2one(
        'res.currency',
        string='Currency:',
        compute='_compute_currency',
        readonly=True,
        store=True  # Store the computed value in the database for real-time display
    )
    is_kilo_luggage = fields.Boolean(compute='_compute_is_kilo_luggage', store=True)

    @api.depends('luggage_type_id')
    def _compute_is_kilo_luggage(self):
        for record in self:
            record.is_kilo_luggage = record.luggage_type_id.name == 'KILO'

    @api.depends('partner_id', 'luggage_type_id', 'flight_announcement_id')
    def _compute_currency(self):
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        currency_id = resconfigvalues['hk_base_config_currency_id']
        self.currency_id = currency_id


class TravelBooking(models.Model):
    _name = 'm2st_hk_airshipping.travelbooking'
    _inherit = 'm0sthk.base'
    _description = 'Air travels'
    _rec_name = 'code'

    ##------------------- DEFAULTS
    @api.model
    def _get_default_code(self):
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        travel_format_code = resconfigvalues['hk_base_config_travel_format_code']
        format_code_length = int(resconfigvalues['hk_base_config_format_code_length'])
        start = "%s-01-01" % time.strftime('%Y')
        end = "%s-12-31" % time.strftime('%Y')
        count = self.search_count([('booking_date', '>=', start), ('booking_date', '<=', end)]) + 1
        count = self._get_num_code(count=count, seq=format_code_length)

        if travel_format_code == 'travel_year_num':
            return u"AIRTRAVEL/%s/%s" % (time.strftime('%Y'), count)
        elif travel_format_code == 'travel_num_year':
            return u"AIRTRAVEL/%s/%s" % (count, time.strftime('%Y'))
        else:
            return u"%s/AIRTRAVEL/%s" % (count, time.strftime('%Y'))

    @api.model
    def _get_default_sender(self):
        partner_obj = self.env.get('res.partner')
        pargs = [('related_user_id', '=', self.env.user.id)]
        return partner_obj.search(pargs, limit=1)

    @api.model
    def _get_local_currency(self):
        return self.env.user.company_id.currency_id

    @api.model
    def _get_default_departure_city(self):
        partner_obj = self.env.get('res.partner')
        pargs = [('related_user_id', '=', self.env.user.id)]
        return partner_obj.search(pargs, limit=1).residence_city_id

    @api.model
    def _get_default_color(self):
        return randint(1, 11)

    ##-------------------- CONSTRAINS
    # @api.constrains('partner_id')

    @api.constrains('partner_id', 'state')
    def _check_partner_travel_state(self):
        for r in self:
            args = [('partner_id', '=', r.partner_id.id),
                    ('state', 'in', ['negotiating']), ('id', '!=', r.id)]
            doubles = self.search(args)

            if doubles:
                text = _(
                    u"Validation Error :  You cannot have simultaneous on system two Travels in Negotiation status! Close one of them first and try again")
                raise ValidationError(text)

        return True

    @api.depends('shipping_ids', 'state', 'computed')
    def _get_invoices(self):
        for r in self:
            invoices = r.mapped('shipping_ids.move_id').filtered(lambda m: m.state not in ['cancel'])
            r.update({'move_ids': invoices or None,
                      'invoice_count': invoices and len(invoices) or 0, })

    @api.depends('partner_id', 'computed', 'code')
    def _compute_currency(self):
        obj_list = ['res.currency', 'res.company']
        currency_obj, company_obj = self.get_model_pool(obj_list)
        company_def = company_obj.search([('name', '=', 'HUBKILO')], limit=1)
        resconfigvalues = self.env.get('res.config.settings').get_values()
        val = resconfigvalues['hk_base_config_currency_id']
        curr = currency_obj.browse(int(val))

        for r in self:
            r.local_currency_id = company_def.currency_id == curr and curr.id or company_def.currency_id.id

    ##--------------------- FIELDS
    name = fields.Char(string="Travel title", readonly=True,
                       help="The default title for this Booking", default="/",
                       states={'pending': [('readonly', False), ], }, )

    code = fields.Char(string='Travel code', readonly=True, default=_get_default_code)

    bank_account = fields.Char(string='Bank Account', required=True)

    booking_date = fields.Date(string="Travel date", required=True, default=fields.Date.today(),
                               readonly=True, states={'pending': [('readonly', False), ], }, )

    partner_id = fields.Many2one('res.partner', string="Traveler", readonly=True, required=True,
                                 default=_get_default_sender, )

    street = fields.Char(required=True, )
    street2 = fields.Char()
    zip = fields.Char(change_default=True)
    city = fields.Many2one('res.city', string="City", required=True)
    state_id = fields.Many2one("res.country.state", string='State', ondelete='restrict',
                               domain="[('country_id', '=?', country_id)]")
    country_id = fields.Many2one('res.country', string='Country', required=True, ondelete='restrict')

    shipping_ids = fields.One2many('m2st_hk_airshipping.shipping', inverse_name='travelbooking_id',
                                   readonly=True, )

    rejection_reason_ids = fields.One2many('m2st_hk_airshipping.travel.reject.reason', 'travel_booking_id',
                                           string='Rejection Reasons', readonly=True)

    luggage_types = fields.One2many('m2st_hk_airshipping.flight.luggage', 'flight_announcement_id',
                                    string='Luggage Types')

    flight_docs = fields.One2many('m2st_hk_airshipping.traveler.verification', 'flight_announcement_id',
                                  string='Traveler Documents Verification')

    booking_type = fields.Selection([('air', "Air")], string="Travel Type",
                                    required=True, default='air',
                                    readonly=True, states={'pending': [('readonly', False), ], }, )

    local_currency_id = fields.Many2one(comodel_name='res.currency', string="Local currency",
                                        default=_get_local_currency, readonly=True,
                                        compute='_compute_currency', store=True,
                                        help="This is the local currency for financial transactions", )

    departure_city_id = fields.Many2one('res.city', string="Departure town", required=True,
                                        default=_get_default_departure_city, )

    arrival_city_id = fields.Many2one('res.city', string="Arrival town", required=True, )

    departure_date = fields.Datetime(string='Departure date', required=True,
                                     default=fields.Datetime.now(),
                                     readonly=True, states={'pending': [('readonly', False), ], }, )

    arrival_date = fields.Datetime(string='Arrival date', required=True,
                                   readonly=True, states={'pending': [('readonly', False), ], }, )
    travel_due = fields.Boolean(string='Travel due')

    state = fields.Selection([
        ('pending', 'Pending / Draft'),
        ('negotiating', 'Published'),
        ('accepted', 'Accepted / Running'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected / Cancelled'),

    ], string='Status', default='pending')

    move_ids = fields.One2many(compute='_get_invoices', comodel_name='account.move', readonly=True, )

    color = fields.Integer(string='Color Index', default=_get_default_color)

    # shipping_count = fields.Integer(compute='_compute_shipping_ref', string="Number of shippings", store=True,
    #                                 readonly=True, help="This is the number of shipping(s) related to this Travel")

    invoice_count = fields.Integer(compute='_get_invoices', string="Number of invoices", store=True,
                                   readonly=True, help="This is the number of invoice(s) related to this Travel")

    @api.constrains('flight_docs')
    def _check_documents_uploaded(self):
        for booking in self:
            travel_doc = booking.flight_docs.filtered(lambda v: v.flight_ticket and v.covid_test_proof)
            if not travel_doc:
                text = _(
                    u"Both flight ticket and COVID test proof must be uploaded for traveler.")
                raise ValidationError(text)

    @api.constrains('luggage_types')
    def _check_luggage_types(self):
        for travel in self:
            travel_doc = travel.luggage_types.filtered(lambda v: v.luggage_type_id.name)
            if not travel_doc:
                text = _(
                    u"You can't create a flight travel announcement without selecting at least a luggage model.")
                raise ValidationError(text)

    def open_reject_reason_wizard(self):
        context = {
            'default_travelbooking_id': self.id,
        }
        return {
            'name': 'Reject Reason',
            'type': 'ir.actions.act_window',
            'res_model': 'm2st_hk_airshipping.travel.reject.reason',
            'view_mode': 'form',
            'view_id': self.env.ref('m2st_hk_airshipping.view_travelbooking_reject_reason_wizard_form').id,
            'target': 'new',
            'context': context,
        }

    ##--------------- ORM
    @api.model
    def create(self, vals):
        Travel = super(TravelBooking, self).create(vals)

        if not Travel.partner_id.is_traveler:
            Travel.partner_id.is_traveler = True
            Travel.partner_id.in_update()

        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        validate_travel = resconfigvalues['hk_base_config_auto_validate_travel']

        if validate_travel: Travel.set_to_negotiating()

        return Travel

    ##------------------------ WKF
    def set_to_pending(self):
        for r in self:
            if r.state not in ['rejected']:
                text = u"Workflow error : Only trips with rejected status can be upgraded to pending status"
                raise ValidationError(_(text))

        self.write({'state': 'pending'})

    def set_to_rejected(self):
        for r in self:
            if r.state not in ['pending']:
                text = u"Workflow error : Only trips with pending status can be upgraded to rejected status"
                raise ValidationError(_(text))

            # if len(r.mapped('shipping_ids')) > 0:
            #     text = u"Workflow error : You cannot cancel a travel with active Shippings! Move shippings first before to continue"
            #     raise ValidationError(_(text))

        self.write({'state': 'rejected'})

    def set_to_rejected_frontend(self):
        for r in self:
            if r.state not in ['pending']:
                text = u"Workflow error : Only trips with pending status can be upgraded to rejected status"
                raise ValidationError(_(text))

            # if len(r.mapped('shipping_ids')) > 0:
            #     text = u"Workflow error : You cannot cancel a travel with active Shippings! Move shippings first before to continue"
            #     raise ValidationError(_(text))

        self.write({'state': 'rejected'})

    def set_to_negotiating(self):
        for r in self:
            if r.state not in ['pending']:
                text = u"Workflow error : Only trips with pending status can be upgraded to negotiation status"
                raise ValidationError(_(text))
            r._check_attachment_conformity()
            r._check_documents_uploaded()
        self.write({'state': 'negotiating'})

    def set_to_accepted(self):
        for r in self:
            if r.state not in ['negotiating']:
                text = u"Workflow error : Only trips with negotiation status can be upgraded to accepted status"
                raise ValidationError(_(text))

        self.write({'state': 'accepted'})

        self.in_update()

    def set_to_completed(self):
        for r in self:
            if r.state not in ['accepted']:
                text = u"Workflow error : Only trips with accepted status can be upgraded to completed status"
                raise ValidationError(_(text))

            if any(r.mapped('shipping_ids').filtered(lambda s: s.state not in ['received'])):
                text = u"Workflow error : This trip cannot be mark as completed because all related shippings aren't to a Received status"
                raise ValidationError(_(text))

        self.write({'state': 'completed'})

        self.in_update()

    def _check_attachment_conformity(self):
        for r in self:
            attachments = r.partner_id.sudo().mapped('partner_attachment_ids'). \
                filtered(lambda att: att.attach_custom_type in ['cni', 'passport'])

            if not attachments:
                text = _(
                    u"Validation Error :  You cannot register a travel without saving first your ID Card or Passport!")
                raise ValidationError(text)

            if any(attachments.filtered(lambda t: not t.validity or not t.conformity)):
                text = _(u"Validation Error :  Your ID card or Passport expired or is not conform!")
                raise ValidationError(text)

        return True

    # def action_view_shipping(self, shippings=False):
    #     self.ensure_one()
    #     ship_obj = self.get_model_pool('m1st_hk_roadshipping.shipping')
    #
    #     if not shippings:
    #         shippings = ship_obj.search(
    #             [('travelbooking_id', '=', self.id)])  # ('state', 'not in', ['pending', 'rejected'])
    #         # self.sudo()._read(['invoice_ids'])
    #         # invoices = self.invoice_ids
    #
    #     result = self.env['ir.actions.act_window']._for_xml_id(
    #         'm1st_hk_roadshipping.action_view_m1st_hk_roadshipping_shipping_kanban')
    #     # choose the view_mode accordingly
    #     if len(shippings) > 1:
    #         result['domain'] = [('id', 'in', shippings.ids)]
    #     elif len(shippings) == 1:
    #         res = self.env.ref('m1st_hk_roadshipping.view_m1st_hk_roadshipping_shipping_form', False)
    #         # form_view = [(res and res.id or False, 'form')]
    #         result['views'] = [(res and res.id or False, 'form')]
    #         # if 'views' in result:
    #         #     result['views'] = form_view + [(state, view) for state, view in result['views'] if view != 'form']
    #         # else:
    #         #     result['views'] = form_view
    #         result['res_id'] = shippings.id
    #     else:
    #         result = {'type': 'ir.actions.act_window_close'}
    #
    #     return result

    def action_view_invoice(self, invoices=False):
        self.ensure_one()
        move_obj = self.get_model_pool('account.move')
        if not invoices:
            invoices = move_obj.search([('travelbooking_id', '=', self.id)])  # ('state', 'not in', ['cancel'])

        result = self.env['ir.actions.act_window']._for_xml_id('account.action_move_in_invoice_type')
        # choose the view_mode accordingly
        if len(invoices) > 1:
            result['domain'] = [('id', 'in', invoices.ids)]
        elif len(invoices) == 1:
            res = self.env.ref('account.view_move_form', False)
            form_view = [(res and res.id or False, 'form')]
            if 'views' in result:
                result['views'] = form_view + [(state, view) for state, view in result['views'] if view != 'form']
            else:
                result['views'] = form_view
            result['res_id'] = invoices.id
        else:
            result = {'type': 'ir.actions.act_window_close'}

        return result
