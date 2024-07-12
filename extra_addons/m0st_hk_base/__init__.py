# -*- coding: utf-8 -*-
from odoo import api, SUPERUSER_ID

from . import models
from . import controllers

##-------------------------------------------
def _add_implied_groups(cr, registry):
    env = api.Environment(cr, SUPERUSER_ID, {})
    group_obj       = env['res.groups']
    group_portal_id = env['ir.model.data'].sudo()._xmlid_to_res_id('base.group_portal', raise_if_not_found=False)
    group_public_id = env['ir.model.data'].sudo()._xmlid_to_res_id('base.group_public', raise_if_not_found=False)

    group_traveler_id = env['ir.model.data'].sudo()._xmlid_to_res_id('m0st_hk_base.group_hkbase_traveler', raise_if_not_found=False)
    group_shipper_id  = env['ir.model.data'].sudo()._xmlid_to_res_id('m0st_hk_base.group_hkbase_shipper', raise_if_not_found=False)
    group_receiver_id = env['ir.model.data'].sudo()._xmlid_to_res_id('m0st_hk_base.group_hkbase_receiver', raise_if_not_found=False)

    #Implied Portal group
    group_obj.browse(group_portal_id).\
        write( {'implied_ids': [(4,group_traveler_id), (4,group_shipper_id), (4,group_receiver_id)]} )

    # Implied Public group
    group_obj.browse(group_public_id). \
        write({'implied_ids': [(4, group_traveler_id), (4, group_shipper_id), (4, group_receiver_id)]})

