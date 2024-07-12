# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models, _
#from odoo.tools.safe_eval import safe_eval
from odoo.exceptions import UserError

DICT_DEFAULT_VALUES = {
'hkpits_notif_enabled': True,

'hkpits_shipping_notif_create_title' : _(u"A new Shipping has been created"),
'hkpits_shipping_notif_create_body' : _(u"A new Shipping [%s] has just been added to the Travel [%s] \n--At : [%s]"),

'hkpits_shipping_notif_rejected_title' : _(u"Shipping rejected"),
'hkpits_shipping_notif_rejected_body' : _(u"The Shipping [%s] has been rejected. \n This Shipping needs to be transferred to another Travel! \n--At : [%s]"),

'hkpits_shipping_notif_cancelled_title' : _(u"Shipping Cancelled"),
'hkpits_shipping_notif_cancelled_body' : _(u"The Shipping [%s] was canceled! \n--At : [%s]"),

'hkpits_shipping_notif_price_submit_title' : _(u"New proposed price"),
'hkpits_shipping_notif_price_submit_body' : _(u"A new price [%s] was proposed in the negotiations for the shipping [%s]! \n--At : [%s]"),
'hkpits_shipping_notif_price_validate_by_shipper_title' : _(u"Price validated by Shipper"),
'hkpits_shipping_notif_price_validate_by_shipper_body' : _(u"Shipper confirmed price [%s] on shipping [%s]! \n--At : [%s]"),
'hkpits_shipping_notif_price_validate_by_traveler_title' : _(u"Price validated by Traveler"),
'hkpits_shipping_notif_price_validate_by_traveler_body' : _(u"Traveler confirmed price [%s] on shipping [%s]! \n--At : [%s]"),


'hkpits_shipping_notif_paid_title' : _(u"Shipping has been Paid"),
'hkpits_shipping_notif_paid_body' : _(u"The Shipping [%s] has been paid \n--At : [%s]"),

'hkpits_shipping_notif_received_title' : _(u"Packages has been received"),
'hkpits_shipping_notif_received_body' : _(u"Packages related to the shipping [%s] have been received by the traveler \n--At : [%s]"),

'hkpits_shipping_notif_delivered_title' : _(u"Packages has been delivered"),
'hkpits_shipping_notif_delivered_body' : _(u"Packages related to the shipping [%s] have been delivered to the receiver \n--At : [%s]"),

'hkpits_shipping_notif_rated_title' : _(u"Shipping has been rated"),
'hkpits_shipping_notif_rated_body' : _(u"The Shipping [%s] has been rated! \n--At : [%s]"),


'hkpits_travel_notif_create_title' : _(u"Travel Create"),
'hkpits_travel_notif_create_body' : _(u"The travel [%s] has been created! \n--At : [%s]"),

'hkpits_travel_notif_published_title' : _(u"Travel has been published"),
'hkpits_travel_notif_published_body' : _(u"The travel [%s] has been published! \n--At : [%s]"),

'hkpits_travel_notif_accepted_title' : _(u"Travel has been Accepted / Running"),
'hkpits_travel_notif_accepted_body' : _(u"The travel [%s] has been accepted! \n--At : [%s]"),

'hkpits_travel_notif_completed_title' : _(u"Travel has been Completed"),
'hkpits_travel_notif_completed_body' : _(u"The travel [%s] has been completed! \n--At : [%s]"),

'hkpits_travel_notif_cancelled_title' : _(u"Travel has been cancelled"),
'hkpits_travel_notif_cancelled_body' : _(u"The travel [%s] has been cencelled! \n--At : [%s]"),

}

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    hkpits_notif_enabled = fields.Boolean(default=True,)

    #====== SHIPPING CREATE
    hkpits_shipping_notif_create_title = fields.Char(size=128, translate=True)
    hkpits_shipping_notif_create_body = fields.Text( )

    #========= SHIPPING DISAGREE
    hkpits_shipping_notif_rejected_title = fields.Char(size=128, translate=True)
    hkpits_shipping_notif_rejected_body = fields.Text()


    #======== SHIPPING REJECTED
    hkpits_shipping_notif_cancelled_title = fields.Char(size=128, translate=True)
    hkpits_shipping_notif_cancelled_body = fields.Text()

    # ======== SHIPPING PRICE
    hkpits_shipping_notif_price_submit_title = fields.Char(size=128, translate=True)
    hkpits_shipping_notif_price_submit_body = fields.Text()
    hkpits_shipping_notif_price_validate_by_shipper_title = fields.Char(size=128, translate=True)
    hkpits_shipping_notif_price_validate_by_shipper_body = fields.Text()
    hkpits_shipping_notif_price_validate_by_traveler_title = fields.Char(size=128, translate=True)
    hkpits_shipping_notif_price_validate_by_traveler_body = fields.Text()

    # ======== SHIPPING PAID
    hkpits_shipping_notif_paid_title = fields.Char(size=128, translate=True)
    hkpits_shipping_notif_paid_body = fields.Text()

    # ======== SHIPPING RECEIVED
    hkpits_shipping_notif_received_title = fields.Char(size=128, translate=True)
    hkpits_shipping_notif_received_body = fields.Text()

    # ======== SHIPPING DELIVERED
    hkpits_shipping_notif_delivered_title = fields.Char(size=128, translate=True)
    hkpits_shipping_notif_delivered_body = fields.Text()

    # ======== SHIPPING HAS RATED
    hkpits_shipping_notif_rated_title = fields.Char(size=128, translate=True)
    hkpits_shipping_notif_rated_body = fields.Text()



    # ======== TRAVEL CREATE
    hkpits_travel_notif_create_title = fields.Char(size=128, translate=True)
    hkpits_travel_notif_create_body = fields.Text()

    # ======== TRAVEL PUBLISHED
    hkpits_travel_notif_published_title = fields.Char(size=128, translate=True)
    hkpits_travel_notif_published_body = fields.Text()

    # ======== TRAVEL ACCEPTED
    hkpits_travel_notif_accepted_title = fields.Char(size=128, translate=True)
    hkpits_travel_notif_accepted_body = fields.Text()

    # ======== TRAVEL COMPLETED
    hkpits_travel_notif_completed_title = fields.Char(size=128, translate=True)
    hkpits_travel_notif_completed_body = fields.Text()

    # ======== TRAVEL CANCELLED
    hkpits_travel_notif_cancelled_title = fields.Char(size=128, translate=True)
    hkpits_travel_notif_cancelled_body = fields.Text()




    ##------------------- FUNCTIONS
    def set_values(self):
        super(ResConfigSettings, self).set_values()

        irConfig = self.env['ir.config_parameter'].sudo()


        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_notif_enabled', self.hkpits_notif_enabled)

        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_create_title', self.hkpits_shipping_notif_create_title)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_create_body', self.hkpits_shipping_notif_create_body)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_rejected_title', self.hkpits_shipping_notif_rejected_title)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_rejected_body', self.hkpits_shipping_notif_rejected_body)

        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_cancelled_title', self.hkpits_shipping_notif_cancelled_title)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_cancelled_body', self.hkpits_shipping_notif_cancelled_body)

        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_price_submit_title', self.hkpits_shipping_notif_price_submit_title)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_price_submit_body', self.hkpits_shipping_notif_price_submit_body)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_price_validate_by_shipper_title', self.hkpits_shipping_notif_price_validate_by_shipper_title)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_price_validate_by_shipper_body', self.hkpits_shipping_notif_price_validate_by_shipper_body)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_price_validate_by_traveler_title', self.hkpits_shipping_notif_price_validate_by_traveler_title)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_price_validate_by_traveler_body', self.hkpits_shipping_notif_price_validate_by_traveler_body)

        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_paid_title', self.hkpits_shipping_notif_paid_title)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_paid_body', self.hkpits_shipping_notif_paid_body)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_received_title', self.hkpits_shipping_notif_received_title)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_received_body', self.hkpits_shipping_notif_received_body)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_delivered_title', self.hkpits_shipping_notif_delivered_title)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_delivered_body', self.hkpits_shipping_notif_delivered_body)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_rated_title', self.hkpits_shipping_notif_rated_title)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_rated_body', self.hkpits_shipping_notif_rated_body)

        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_create_title', self.hkpits_travel_notif_create_title)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_create_body', self.hkpits_travel_notif_create_body)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_published_title', self.hkpits_travel_notif_published_title)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_published_body', self.hkpits_travel_notif_published_body)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_accepted_title', self.hkpits_travel_notif_accepted_title)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_accepted_body', self.hkpits_travel_notif_accepted_body)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_completed_title', self.hkpits_travel_notif_completed_title)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_completed_body', self.hkpits_travel_notif_completed_body)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_cancelled_title', self.hkpits_travel_notif_cancelled_title)
        irConfig.set_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_cancelled_body', self.hkpits_travel_notif_cancelled_body)



    @api.model
    def get_values(self):
        res      = super(ResConfigSettings, self).get_values()
        irConfig = self.env['ir.config_parameter'].sudo()

        hkpits_notif_enabled = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_notif_enabled') or DICT_DEFAULT_VALUES['hkpits_notif_enabled']
        hkpits_shipping_notif_create_title    = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_create_title') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_create_title']
        hkpits_shipping_notif_create_body    = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_create_body') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_create_body']
        hkpits_shipping_notif_rejected_title = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_rejected_title') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_rejected_title']
        hkpits_shipping_notif_rejected_body = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_rejected_body') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_rejected_body']

        hkpits_shipping_notif_cancelled_title = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_cancelled_title') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_cancelled_title']
        hkpits_shipping_notif_cancelled_body = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_cancelled_body') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_cancelled_body']

        hkpits_shipping_notif_price_submit_title = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_price_submit_title') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_price_submit_title']
        hkpits_shipping_notif_price_submit_body = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_price_submit_body') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_price_submit_body']

        hkpits_shipping_notif_price_validate_by_shipper_title = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_price_validate_by_shipper_title') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_price_validate_by_shipper_title']
        hkpits_shipping_notif_price_validate_by_shipper_body = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_price_validate_by_shipper_body') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_price_validate_by_shipper_body']

        hkpits_shipping_notif_price_validate_by_traveler_title = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_price_validate_by_traveler_title') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_price_validate_by_traveler_title']
        hkpits_shipping_notif_price_validate_by_traveler_body = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_price_validate_by_traveler_body') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_price_validate_by_traveler_body']

        hkpits_shipping_notif_paid_title = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_paid_title') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_paid_title']
        hkpits_shipping_notif_paid_body = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_paid_body') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_paid_body']

        hkpits_shipping_notif_received_title = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_received_title') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_received_title']
        hkpits_shipping_notif_received_body = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_received_body') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_received_body']

        hkpits_shipping_notif_delivered_title = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_delivered_title') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_delivered_title']
        hkpits_shipping_notif_delivered_body = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_delivered_body') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_delivered_body']

        hkpits_shipping_notif_rated_title = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_rated_title') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_rated_title']
        hkpits_shipping_notif_rated_body = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_shipping_notif_rated_body') or DICT_DEFAULT_VALUES['hkpits_shipping_notif_rated_body']

        hkpits_travel_notif_create_title = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_create_title') or DICT_DEFAULT_VALUES['hkpits_travel_notif_create_title']
        hkpits_travel_notif_create_body = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_create_body') or DICT_DEFAULT_VALUES['hkpits_travel_notif_create_body']

        hkpits_travel_notif_published_title = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_published_title') or DICT_DEFAULT_VALUES['hkpits_travel_notif_published_title']
        hkpits_travel_notif_published_body = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_published_body') or DICT_DEFAULT_VALUES['hkpits_travel_notif_published_body']

        hkpits_travel_notif_accepted_title = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_accepted_title') or DICT_DEFAULT_VALUES['hkpits_travel_notif_accepted_title']
        hkpits_travel_notif_accepted_body = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_accepted_body') or DICT_DEFAULT_VALUES['hkpits_travel_notif_accepted_body']

        hkpits_travel_notif_completed_title = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_completed_title') or DICT_DEFAULT_VALUES['hkpits_travel_notif_completed_title']
        hkpits_travel_notif_completed_body = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_completed_body') or DICT_DEFAULT_VALUES['hkpits_travel_notif_completed_body']

        hkpits_travel_notif_cancelled_title = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_cancelled_title') or DICT_DEFAULT_VALUES['hkpits_travel_notif_cancelled_title']
        hkpits_travel_notif_cancelled_body = irConfig.get_param('m3st_hk_pits_fcm_notifications.hkpits_travel_notif_cancelled_body') or DICT_DEFAULT_VALUES['hkpits_travel_notif_cancelled_body']





        res.update({ 'hkpits_notif_enabled': hkpits_notif_enabled,
                    'hkpits_shipping_notif_create_title' : hkpits_shipping_notif_create_title,
                    'hkpits_shipping_notif_create_body': hkpits_shipping_notif_create_body,
                    'hkpits_shipping_notif_rejected_title': hkpits_shipping_notif_rejected_title,
                    'hkpits_shipping_notif_rejected_body': hkpits_shipping_notif_rejected_body,

                    'hkpits_shipping_notif_cancelled_title': hkpits_shipping_notif_cancelled_title,
                     'hkpits_shipping_notif_cancelled_body': hkpits_shipping_notif_cancelled_body,

                     'hkpits_shipping_notif_price_submit_title': hkpits_shipping_notif_price_submit_title,
                     'hkpits_shipping_notif_price_submit_body': hkpits_shipping_notif_price_submit_body,

                     'hkpits_shipping_notif_price_validate_by_shipper_title': hkpits_shipping_notif_price_validate_by_shipper_title,
                     'hkpits_shipping_notif_price_validate_by_shipper_body': hkpits_shipping_notif_price_validate_by_shipper_body,

                     'hkpits_shipping_notif_price_validate_by_traveler_title': hkpits_shipping_notif_price_validate_by_traveler_title,
                     'hkpits_shipping_notif_price_validate_by_traveler_body': hkpits_shipping_notif_price_validate_by_traveler_body,

                     'hkpits_shipping_notif_paid_title': hkpits_shipping_notif_paid_title,
                     'hkpits_shipping_notif_paid_body': hkpits_shipping_notif_paid_body,

                     'hkpits_shipping_notif_received_title': hkpits_shipping_notif_received_title,
                     'hkpits_shipping_notif_received_body': hkpits_shipping_notif_received_body,

                     'hkpits_shipping_notif_delivered_title': hkpits_shipping_notif_delivered_title,
                     'hkpits_shipping_notif_delivered_body': hkpits_shipping_notif_delivered_body,

                     'hkpits_shipping_notif_rated_title': hkpits_shipping_notif_rated_title,
                     'hkpits_shipping_notif_rated_body': hkpits_shipping_notif_rated_body,

                     'hkpits_travel_notif_create_title': hkpits_travel_notif_create_title,
                     'hkpits_travel_notif_create_body': hkpits_travel_notif_create_body,

                     'hkpits_travel_notif_published_title': hkpits_travel_notif_published_title,
                     'hkpits_travel_notif_published_body': hkpits_travel_notif_published_body,

                     'hkpits_travel_notif_accepted_title': hkpits_travel_notif_accepted_title,
                     'hkpits_travel_notif_accepted_body': hkpits_travel_notif_accepted_body,

                     'hkpits_travel_notif_completed_title': hkpits_travel_notif_completed_title,
                     'hkpits_travel_notif_completed_body': hkpits_travel_notif_completed_body,

                     'hkpits_travel_notif_cancelled_title': hkpits_travel_notif_cancelled_title,
                     'hkpits_travel_notif_cancelled_body': hkpits_travel_notif_cancelled_body,

                     })

        return res

