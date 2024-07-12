# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models, _
#from odoo.tools.safe_eval import safe_eval
from odoo.exceptions import UserError

DICT_DEFAULT_VALUES = {
'air_hkpits_notif_enabled': True,

'air_hkpits_shipping_notif_create_title' : _(u"A new Air Shipping has been created"),
'air_hkpits_shipping_notif_create_body' : _(u"A new Air Shipping [%s] has just been added to the Travel [%s] \n--At : [%s]"),

'air_hkpits_shipping_notif_rejected_title' : _(u"Air Shipping rejected"),
'air_hkpits_shipping_notif_rejected_body' : _(u"The Shipping [%s] has been rejected. \n This Shipping needs to be transferred to another Travel! \n--At : [%s]"),

'air_hkpits_shipping_notif_cancelled_title' : _(u"Air Shipping Cancelled"),
'air_hkpits_shipping_notif_cancelled_body' : _(u"The Air Shipping [%s] was canceled! \n--At : [%s]"),

'air_hkpits_shipping_notif_paid_title' : _(u"Air Shipping has been Paid"),
'air_hkpits_shipping_notif_paid_body' : _(u"The Shipping [%s] has been paid \n--At : [%s]"),

'air_hkpits_shipping_notif_received_title' : _(u"Air Shipping Packages has been received"),
'air_hkpits_shipping_notif_received_body' : _(u"Packages related to the air shipping [%s] have been received by the traveler \n--At : [%s]"),

'air_hkpits_shipping_notif_delivered_title' : _(u"Air Shipping Packages has been delivered"),
'air_hkpits_shipping_notif_delivered_body' : _(u"Packages related to the air shipping [%s] have been delivered to the receiver \n--At : [%s]"),

'air_hkpits_shipping_notif_rated_title' : _(u"Air Shipping has been rated"),
'air_hkpits_shipping_notif_rated_body' : _(u"The Air Shipping [%s] has been rated! \n--At : [%s]"),


'air_hkpits_travel_notif_create_title' : _(u"Air Travel Create"),
'air_hkpits_travel_notif_create_body' : _(u"The air travel [%s] has been created! \n--At : [%s]"),

'air_hkpits_travel_notif_published_title' : _(u"Air Travel has been published"),
'air_hkpits_travel_notif_published_body' : _(u"The air travel [%s] has been published! \n--At : [%s]"),

'air_hkpits_travel_notif_accepted_title' : _(u"Air Travel has been Accepted / Running"),
'air_hkpits_travel_notif_accepted_body' : _(u"The air travel [%s] has been accepted! \n--At : [%s]"),

'air_hkpits_travel_notif_completed_title' : _(u"Air Travel has been Completed"),
'air_hkpits_travel_notif_completed_body' : _(u"The air travel [%s] has been completed! \n--At : [%s]"),

'air_hkpits_travel_notif_cancelled_title' : _(u"Air Travel has been cancelled"),
'air_hkpits_travel_notif_cancelled_body' : _(u"The air travel [%s] has been cencelled! \n--At : [%s]"),

}

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    air_hkpits_notif_enabled = fields.Boolean(default=True,)

    #====== SHIPPING CREATE
    air_hkpits_shipping_notif_create_title = fields.Char(size=128, translate=True)
    air_hkpits_shipping_notif_create_body = fields.Text( )

    #========= SHIPPING DISAGREE
    air_hkpits_shipping_notif_rejected_title = fields.Char(size=128, translate=True)
    air_hkpits_shipping_notif_rejected_body = fields.Text()


    #======== SHIPPING REJECTED
    air_hkpits_shipping_notif_cancelled_title = fields.Char(size=128, translate=True)
    air_hkpits_shipping_notif_cancelled_body = fields.Text()

    # ======== SHIPPING PAID
    air_hkpits_shipping_notif_paid_title = fields.Char(size=128, translate=True)
    air_hkpits_shipping_notif_paid_body = fields.Text()

    # ======== SHIPPING RECEIVED
    air_hkpits_shipping_notif_received_title = fields.Char(size=128, translate=True)
    air_hkpits_shipping_notif_received_body = fields.Text()

    # ======== SHIPPING DELIVERED
    air_hkpits_shipping_notif_delivered_title = fields.Char(size=128, translate=True)
    air_hkpits_shipping_notif_delivered_body = fields.Text()

    # ======== SHIPPING HAS RATED
    air_hkpits_shipping_notif_rated_title = fields.Char(size=128, translate=True)
    air_hkpits_shipping_notif_rated_body = fields.Text()



    # ======== TRAVEL CREATE
    air_hkpits_travel_notif_create_title = fields.Char(size=128, translate=True)
    air_hkpits_travel_notif_create_body = fields.Text()

    # ======== TRAVEL PUBLISHED
    air_hkpits_travel_notif_published_title = fields.Char(size=128, translate=True)
    air_hkpits_travel_notif_published_body = fields.Text()

    # ======== TRAVEL ACCEPTED
    air_hkpits_travel_notif_accepted_title = fields.Char(size=128, translate=True)
    air_hkpits_travel_notif_accepted_body = fields.Text()

    # ======== TRAVEL COMPLETED
    air_hkpits_travel_notif_completed_title = fields.Char(size=128, translate=True)
    air_hkpits_travel_notif_completed_body = fields.Text()

    # ======== TRAVEL CANCELLED
    air_hkpits_travel_notif_cancelled_title = fields.Char(size=128, translate=True)
    air_hkpits_travel_notif_cancelled_body = fields.Text()




    ##------------------- FUNCTIONS
    def set_values(self):
        super(ResConfigSettings, self).set_values()

        irConfig = self.env['ir.config_parameter'].sudo()


        irConfig.set_param('m2st_hk_airshipping.air_hkpits_notif_enabled', self.air_hkpits_notif_enabled)

        irConfig.set_param('m2st_hk_airshipping.air_hkpits_shipping_notif_create_title', self.air_hkpits_shipping_notif_create_title)
        irConfig.set_param('m2st_hk_airshipping.air_hkpits_shipping_notif_create_body', self.air_hkpits_shipping_notif_create_body)
        irConfig.set_param('m2st_hk_airshipping.air_hkpits_shipping_notif_rejected_title', self.air_hkpits_shipping_notif_rejected_title)
        irConfig.set_param('m2st_hk_airshipping.air_hkpits_shipping_notif_rejected_body', self.air_hkpits_shipping_notif_rejected_body)

        irConfig.set_param('m2st_hk_airshipping.air_hkpits_shipping_notif_cancelled_title', self.air_hkpits_shipping_notif_cancelled_title)
        irConfig.set_param('m2st_hk_airshipping.air_hkpits_shipping_notif_cancelled_body', self.air_hkpits_shipping_notif_cancelled_body)

        irConfig.set_param('m2st_hk_airshipping.air_hkpits_shipping_notif_paid_title', self.air_hkpits_shipping_notif_paid_title)
        irConfig.set_param('m2st_hk_airshipping.air_hkpits_shipping_notif_paid_body', self.air_hkpits_shipping_notif_paid_body)

        irConfig.set_param('m2st_hk_airshipping.air_hkpits_shipping_notif_received_title', self.air_hkpits_shipping_notif_received_title)
        irConfig.set_param('m2st_hk_airshipping.air_hkpits_shipping_notif_received_body', self.air_hkpits_shipping_notif_received_body)

        irConfig.set_param('m2st_hk_airshipping.air_hkpits_shipping_notif_delivered_title', self.air_hkpits_shipping_notif_delivered_title)
        irConfig.set_param('m2st_hk_airshipping.air_hkpits_shipping_notif_delivered_body', self.air_hkpits_shipping_notif_delivered_body)

        irConfig.set_param('m2st_hk_airshipping.air_hkpits_shipping_notif_rated_title', self.air_hkpits_shipping_notif_rated_title)
        irConfig.set_param('m2st_hk_airshipping.air_hkpits_shipping_notif_rated_body', self.air_hkpits_shipping_notif_rated_body)

        irConfig.set_param('m2st_hk_airshipping.air_hkpits_travel_notif_create_title', self.air_hkpits_travel_notif_create_title)
        irConfig.set_param('m2st_hk_airshipping.air_hkpits_travel_notif_create_body', self.air_hkpits_travel_notif_create_body)
        irConfig.set_param('m2st_hk_airshipping.air_hkpits_travel_notif_published_title', self.air_hkpits_travel_notif_published_title)
        irConfig.set_param('m2st_hk_airshipping.air_hkpits_travel_notif_published_body', self.air_hkpits_travel_notif_published_body)
        irConfig.set_param('m2st_hk_airshipping.air_hkpits_travel_notif_accepted_title', self.air_hkpits_travel_notif_accepted_title)
        irConfig.set_param('m2st_hk_airshipping.air_hkpits_travel_notif_accepted_body', self.air_hkpits_travel_notif_accepted_body)
        irConfig.set_param('m2st_hk_airshipping.air_hkpits_travel_notif_completed_title', self.air_hkpits_travel_notif_completed_title)
        irConfig.set_param('m2st_hk_airshipping.air_hkpits_travel_notif_completed_body', self.air_hkpits_travel_notif_completed_body)
        irConfig.set_param('m2st_hk_airshipping.air_hkpits_travel_notif_cancelled_title', self.air_hkpits_travel_notif_cancelled_title)
        irConfig.set_param('m2st_hk_airshipping.air_hkpits_travel_notif_cancelled_body', self.air_hkpits_travel_notif_cancelled_body)



    @api.model
    def get_values(self):
        res      = super(ResConfigSettings, self).get_values()
        irConfig = self.env['ir.config_parameter'].sudo()

        air_hkpits_notif_enabled = irConfig.get_param('m2st_hk_airshipping.air_hkpits_notif_enabled') or DICT_DEFAULT_VALUES['air_hkpits_notif_enabled']
        air_hkpits_shipping_notif_create_title    = irConfig.get_param('m2st_hk_airshipping.air_hkpits_shipping_notif_create_title') or DICT_DEFAULT_VALUES['air_hkpits_shipping_notif_create_title']
        air_hkpits_shipping_notif_create_body    = irConfig.get_param('m2st_hk_airshipping.air_hkpits_shipping_notif_create_body') or DICT_DEFAULT_VALUES['air_hkpits_shipping_notif_create_body']
        air_hkpits_shipping_notif_rejected_title = irConfig.get_param('m2st_hk_airshipping.air_hkpits_shipping_notif_rejected_title') or DICT_DEFAULT_VALUES['air_hkpits_shipping_notif_rejected_title']
        air_hkpits_shipping_notif_rejected_body = irConfig.get_param('m2st_hk_airshipping.air_hkpits_shipping_notif_rejected_body') or DICT_DEFAULT_VALUES['air_hkpits_shipping_notif_rejected_body']

        air_hkpits_shipping_notif_cancelled_title = irConfig.get_param('m2st_hk_airshipping.air_hkpits_shipping_notif_cancelled_title') or DICT_DEFAULT_VALUES['air_hkpits_shipping_notif_cancelled_title']
        air_hkpits_shipping_notif_cancelled_body = irConfig.get_param('m2st_hk_airshipping.air_hkpits_shipping_notif_cancelled_body') or DICT_DEFAULT_VALUES['air_hkpits_shipping_notif_cancelled_body']


        air_hkpits_shipping_notif_paid_title = irConfig.get_param('m2st_hk_airshipping.air_hkpits_shipping_notif_paid_title') or DICT_DEFAULT_VALUES['air_hkpits_shipping_notif_paid_title']
        air_hkpits_shipping_notif_paid_body = irConfig.get_param('m2st_hk_airshipping.air_hkpits_shipping_notif_paid_body') or DICT_DEFAULT_VALUES['air_hkpits_shipping_notif_paid_body']

        air_hkpits_shipping_notif_received_title = irConfig.get_param('m2st_hk_airshipping.air_hkpits_shipping_notif_received_title') or DICT_DEFAULT_VALUES['air_hkpits_shipping_notif_received_title']
        air_hkpits_shipping_notif_received_body = irConfig.get_param('m2st_hk_airshipping.air_hkpits_shipping_notif_received_body') or DICT_DEFAULT_VALUES['air_hkpits_shipping_notif_received_body']

        air_hkpits_shipping_notif_delivered_title = irConfig.get_param('m2st_hk_airshipping.air_hkpits_shipping_notif_delivered_title') or DICT_DEFAULT_VALUES['air_hkpits_shipping_notif_delivered_title']
        air_hkpits_shipping_notif_delivered_body = irConfig.get_param('m2st_hk_airshipping.air_hkpits_shipping_notif_delivered_body') or DICT_DEFAULT_VALUES['air_hkpits_shipping_notif_delivered_body']

        air_hkpits_shipping_notif_rated_title = irConfig.get_param('m2st_hk_airshipping.air_hkpits_shipping_notif_rated_title') or DICT_DEFAULT_VALUES['air_hkpits_shipping_notif_rated_title']
        air_hkpits_shipping_notif_rated_body = irConfig.get_param('m2st_hk_airshipping.air_hkpits_shipping_notif_rated_body') or DICT_DEFAULT_VALUES['air_hkpits_shipping_notif_rated_body']

        air_hkpits_travel_notif_create_title = irConfig.get_param('m2st_hk_airshipping.air_hkpits_travel_notif_create_title') or DICT_DEFAULT_VALUES['air_hkpits_travel_notif_create_title']
        air_hkpits_travel_notif_create_body = irConfig.get_param('m2st_hk_airshipping.air_hkpits_travel_notif_create_body') or DICT_DEFAULT_VALUES['air_hkpits_travel_notif_create_body']

        air_hkpits_travel_notif_published_title = irConfig.get_param('m2st_hk_airshipping.air_hkpits_travel_notif_published_title') or DICT_DEFAULT_VALUES['air_hkpits_travel_notif_published_title']
        air_hkpits_travel_notif_published_body = irConfig.get_param('m2st_hk_airshipping.air_hkpits_travel_notif_published_body') or DICT_DEFAULT_VALUES['air_hkpits_travel_notif_published_body']

        air_hkpits_travel_notif_accepted_title = irConfig.get_param('m2st_hk_airshipping.air_hkpits_travel_notif_accepted_title') or DICT_DEFAULT_VALUES['air_hkpits_travel_notif_accepted_title']
        air_hkpits_travel_notif_accepted_body = irConfig.get_param('m2st_hk_airshipping.air_hkpits_travel_notif_accepted_body') or DICT_DEFAULT_VALUES['air_hkpits_travel_notif_accepted_body']

        air_hkpits_travel_notif_completed_title = irConfig.get_param('m2st_hk_airshipping.air_hkpits_travel_notif_completed_title') or DICT_DEFAULT_VALUES['air_hkpits_travel_notif_completed_title']
        air_hkpits_travel_notif_completed_body = irConfig.get_param('m2st_hk_airshipping.air_hkpits_travel_notif_completed_body') or DICT_DEFAULT_VALUES['air_hkpits_travel_notif_completed_body']

        air_hkpits_travel_notif_cancelled_title = irConfig.get_param('m2st_hk_airshipping.air_hkpits_travel_notif_cancelled_title') or DICT_DEFAULT_VALUES['air_hkpits_travel_notif_cancelled_title']
        air_hkpits_travel_notif_cancelled_body = irConfig.get_param('m2st_hk_airshipping.air_hkpits_travel_notif_cancelled_body') or DICT_DEFAULT_VALUES['air_hkpits_travel_notif_cancelled_body']





        res.update({ 'air_hkpits_notif_enabled': air_hkpits_notif_enabled,
                    'air_hkpits_shipping_notif_create_title' : air_hkpits_shipping_notif_create_title,
                    'air_hkpits_shipping_notif_create_body': air_hkpits_shipping_notif_create_body,
                    'air_hkpits_shipping_notif_rejected_title': air_hkpits_shipping_notif_rejected_title,
                    'air_hkpits_shipping_notif_rejected_body': air_hkpits_shipping_notif_rejected_body,

                    'air_hkpits_shipping_notif_cancelled_title': air_hkpits_shipping_notif_cancelled_title,
                     'air_hkpits_shipping_notif_cancelled_body': air_hkpits_shipping_notif_cancelled_body,

                     'air_hkpits_shipping_notif_paid_title': air_hkpits_shipping_notif_paid_title,
                     'air_hkpits_shipping_notif_paid_body': air_hkpits_shipping_notif_paid_body,

                     'air_hkpits_shipping_notif_received_title': air_hkpits_shipping_notif_received_title,
                     'air_hkpits_shipping_notif_received_body': air_hkpits_shipping_notif_received_body,

                     'air_hkpits_shipping_notif_delivered_title': air_hkpits_shipping_notif_delivered_title,
                     'air_hkpits_shipping_notif_delivered_body': air_hkpits_shipping_notif_delivered_body,

                     'air_hkpits_shipping_notif_rated_title': air_hkpits_shipping_notif_rated_title,
                     'air_hkpits_shipping_notif_rated_body': air_hkpits_shipping_notif_rated_body,

                     'air_hkpits_travel_notif_create_title': air_hkpits_travel_notif_create_title,
                     'air_hkpits_travel_notif_create_body': air_hkpits_travel_notif_create_body,

                     'air_hkpits_travel_notif_published_title': air_hkpits_travel_notif_published_title,
                     'air_hkpits_travel_notif_published_body': air_hkpits_travel_notif_published_body,

                     'air_hkpits_travel_notif_accepted_title': air_hkpits_travel_notif_accepted_title,
                     'air_hkpits_travel_notif_accepted_body': air_hkpits_travel_notif_accepted_body,

                     'air_hkpits_travel_notif_completed_title': air_hkpits_travel_notif_completed_title,
                     'air_hkpits_travel_notif_completed_body': air_hkpits_travel_notif_completed_body,

                     'air_hkpits_travel_notif_cancelled_title': air_hkpits_travel_notif_cancelled_title,
                     'air_hkpits_travel_notif_cancelled_body': air_hkpits_travel_notif_cancelled_body,

                     })

        return res

