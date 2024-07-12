# -*- coding: utf-8 -*-
from odoo import api, SUPERUSER_ID

from . import models
from . import controllers

##-------------------------------------------
def _add_rpn_implied_groups(cr, registry):
    env = api.Environment(cr, SUPERUSER_ID, {})
    group_obj       = env['res.groups']
    group_portal_id = env['ir.model.data'].sudo()._xmlid_to_res_id('base.group_portal', raise_if_not_found=False)
    group_public_id = env['ir.model.data'].sudo()._xmlid_to_res_id('base.group_public', raise_if_not_found=False)

    group_member_id = env['ir.model.data'].sudo()._xmlid_to_res_id('m0sh_rpn_base.group_m0sh_rpn_base_member', raise_if_not_found=False)
    group_manager_id  = env['ir.model.data'].sudo()._xmlid_to_res_id('m0sh_rpn_base.group_m0sh_rpn_base_manager', raise_if_not_found=False)

    #Implied Portal group
    group_obj.browse(group_portal_id).\
        write( {'implied_ids': [(4,group_member_id), (4,group_manager_id)]} )

    # Implied Public group
    group_obj.browse(group_public_id). \
        write({'implied_ids': [(4, group_member_id), (4, group_manager_id)]})