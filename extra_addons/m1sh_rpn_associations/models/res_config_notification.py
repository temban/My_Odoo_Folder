# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models, _
# from odoo.tools.safe_eval import safe_eval
from odoo.exceptions import UserError

DICT_DEFAULT_VALUES = {
    'new_member_staff_notif_title': _(u"New Membership Activated."),
    'new_member_staff_notif_body': _(u"The member [%s] has just been activated his/her RPN account\n--At : [%s]"),

    'member_activation_notif_title': _(u"Account Activation."),
    'member_activation_notif_body': _(
        u" Congratulation! You are now a full member of RPN Association, with a recharged amount of [%s%s] and a total deposit of [%s%s] including your membership fee and first recharge.\n--At : [%s]"),

    'confirm_payment_recharge_title': _(u"New Recharge"),
    'confirm_payment_recharge_body': _(
        u"A Recharge of [%s%s] was made in your RPN Account. Your current Account Balance is [%s%s]. \n--At : [%s]"),

    'dn_debit_member_title': _(u"New DN Contribution."),
    'dn_debit_member_body': _(
        u"A new death notice has been recorded in RPN Association, with a total contribution of [%s%s] and a contribution of [%s%s] per member of which you account has been debited. Your current Account Balance is [%s%s]. \n--At : [%s]"),

    'member_selected_as_manager_title': _(u"RPN Manager Selected"),
    'member_selected_as_manager_body': _(
        u"Hello [%s] you have been selected as manager by [%s], member of RPN Association. \n--At : [%s]")
}


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    # ======  STAFF
    new_member_staff_notif_title = fields.Char(size=128, translate=True)
    new_member_staff_notif_body = fields.Text()

    # ========= MEMBER
    member_activation_notif_title = fields.Char(size=128, translate=True)
    member_activation_notif_body = fields.Text()

    # ======== RECHARGE
    confirm_payment_recharge_title = fields.Char(size=128, translate=True)
    confirm_payment_recharge_body = fields.Text()

    # ======== CONTRIBUTION
    dn_debit_member_title = fields.Char(size=128, translate=True)
    dn_debit_member_body = fields.Text()

    # ======== MANAGER
    member_selected_as_manager_title = fields.Char(size=128, translate=True)
    member_selected_as_manager_body = fields.Text()

    ##------------------- FUNCTIONS
    def set_values(self):
        super(ResConfigSettings, self).set_values()

        irConfig = self.env['ir.config_parameter'].sudo()

        irConfig.set_param('m1sh_rpn_associations.new_member_staff_notif_title',
                           self.new_member_staff_notif_title)
        irConfig.set_param('m1sh_rpn_associations.new_member_staff_notif_body',
                           self.new_member_staff_notif_body)

        irConfig.set_param('m1sh_rpn_associations.member_activation_notif_title',
                           self.member_activation_notif_title)
        irConfig.set_param('m1sh_rpn_associations.member_activation_notif_body',
                           self.member_activation_notif_body)

        irConfig.set_param('m1sh_rpn_associations.confirm_payment_recharge_title',
                           self.confirm_payment_recharge_title)
        irConfig.set_param('m1sh_rpn_associations.confirm_payment_recharge_body',
                           self.confirm_payment_recharge_body)

        irConfig.set_param('m1sh_rpn_associations.dn_debit_member_title',
                           self.dn_debit_member_title)
        irConfig.set_param('m1sh_rpn_associations.dn_debit_member_body',
                           self.dn_debit_member_body)

        irConfig.set_param('m1sh_rpn_associations.member_selected_as_manager_title',
                           self.member_selected_as_manager_title)
        irConfig.set_param('m1sh_rpn_associations.member_selected_as_manager_body',
                           self.member_selected_as_manager_body)

    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        irConfig = self.env['ir.config_parameter'].sudo()

        new_member_staff_notif_title = irConfig.get_param(
            'm1sh_rpn_associations.new_member_staff_notif_title') or DICT_DEFAULT_VALUES[
                                           'new_member_staff_notif_title']
        new_member_staff_notif_body = irConfig.get_param(
            'm1sh_rpn_associations.new_member_staff_notif_body') or DICT_DEFAULT_VALUES[
                                          'new_member_staff_notif_body']

        member_activation_notif_title = irConfig.get_param(
            'm1sh_rpn_associations.member_activation_notif_title') or DICT_DEFAULT_VALUES[
                                            'member_activation_notif_title']
        member_activation_notif_body = irConfig.get_param(
            'm1sh_rpn_associations.member_activation_notif_body') or DICT_DEFAULT_VALUES[
                                           'member_activation_notif_body']

        confirm_payment_recharge_title = irConfig.get_param(
            'm1sh_rpn_associations.confirm_payment_recharge_title') or DICT_DEFAULT_VALUES[
                                             'confirm_payment_recharge_title']
        confirm_payment_recharge_body = irConfig.get_param(
            'm1sh_rpn_associations.confirm_payment_recharge_body') or DICT_DEFAULT_VALUES[
                                            'confirm_payment_recharge_body']

        dn_debit_member_title = irConfig.get_param(
            'm1sh_rpn_associations.dn_debit_member_title') or DICT_DEFAULT_VALUES[
                                    'dn_debit_member_title']
        dn_debit_member_body = irConfig.get_param(
            'm1sh_rpn_associations.dn_debit_member_body') or DICT_DEFAULT_VALUES[
                                   'dn_debit_member_body']

        member_selected_as_manager_title = irConfig.get_param(
            'm1sh_rpn_associations.member_selected_as_manager_title') or \
                                           DICT_DEFAULT_VALUES[
                                               'member_selected_as_manager_title']
        member_selected_as_manager_body = irConfig.get_param(
            'm1sh_rpn_associations.member_selected_as_manager_body') or \
                                          DICT_DEFAULT_VALUES[
                                              'member_selected_as_manager_body']

        res.update({
            'new_member_staff_notif_title': new_member_staff_notif_title,
            'new_member_staff_notif_body': new_member_staff_notif_body,

            'member_activation_notif_title': member_activation_notif_title,
            'member_activation_notif_body': member_activation_notif_body,

            'confirm_payment_recharge_title': confirm_payment_recharge_title,
            'confirm_payment_recharge_body': confirm_payment_recharge_body,

            'dn_debit_member_title': dn_debit_member_title,
            'dn_debit_member_body': dn_debit_member_body,

            'member_selected_as_manager_title': member_selected_as_manager_title,
            'member_selected_as_manager_body': member_selected_as_manager_body,
        })

        return res
