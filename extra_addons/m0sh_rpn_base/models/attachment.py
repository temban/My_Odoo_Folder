# -*- coding: utf-8 -*-
###############################################################################
#
#
###############################################################################
# PYTHON BUILT_IN IMPORT
import base64
import time
from datetime import datetime, date, timedelta
# import os
import logging

# ODOO IMPORT
from odoo import models, fields, api, _
# from odoo.tools import human_size
from odoo.exceptions import UserError, ValidationError

_logger = logging.getLogger(__name__)


class ir_attachment(models.Model):
    _name = 'ir.attachment'
    _inherit = ['ir.attachment']

    ##------------------ CONSTRAINS
    @api.depends('attach_custom_type')
    def _check_attach(self):
        for r in self:
            args = [('attach_custom_type', '=', r.attach_custom_type),
                    ('partner_id', '=', r.partner_id.id), ('id', '!=', r.id), ]  # ('validity', '=', True)
            attachs = self.search(args)
            if attachs:
                text = _(u"Validation Error : Another attachment is already register as Id Card or Passport! \
                \nPlease delete it first before to register the another one")
                raise ValidationError(text)

        return True

    ##-------------- COMPUTED
    @api.depends('date_start', 'date_end', 'computed')
    def _cal_duration(self):
        for record in self:
            if not record.date_start or not record.date_end:
                record.update({'duration': 0, 'validity': False, 'duration_rest': 0, })
                continue

            asplit = str(record.date_start)
            bsplit = str(record.date_end)
            a = asplit.split('-')
            b = bsplit.split('-')
            c = [time.strftime('%Y'), time.strftime('%m'), time.strftime('%d')]
            date_a = date(int(a[0]), int(a[1]), int(a[2]))
            date_b = date(int(b[0]), int(b[1]), int(b[2]))
            date_c = date(int(c[0]), int(c[1]), int(c[2]))
            nbre = (date_b - date_a).days
            rest = (date_b - date_c).days
            record.update({'duration': nbre, 'duration_rest': rest, 'validity': rest > 0 and True or False})

    def set_and_delete_invalid_attachments(self):
        today = fields.Date.today()
        attachments = self.sudo().search([])
        for attachment in attachments:
            if attachment.date_end:
                if today > attachment.date_end:
                    attachment.sudo().write({'validity': False})

        _logger.info("Deleting invalid attachments...")
        all_attachments = self.sudo().search([])

        invalid_attachments = all_attachments.filtered(
            lambda att: not att.validity
        )

        _logger.info("Invalid attachments found: %s", invalid_attachments)
        print("Invalid attachments found")
        # invalid_attachments.sudo().unlink()

    def send_attachment_expiry_notification(self):
        today = fields.Date.today()
        for days_remaining in range(3, 0, -1):
            expiry_date_threshold = today + timedelta(days=days_remaining)

            attachments = self.search([
                ('date_end', '=', expiry_date_threshold),
                ('validity', '=', True),  # Ensure that the attachment is still valid
            ])

            for attachment in attachments:
                template = self.env.ref(
                    'm0sh_rpn_base.rpn_send_attachment_expiry_notification')  # Replace 'your_module.email_template_id' with the actual email template ID
                if template:
                    template.with_context(attachment=attachment).sudo().send_mail(attachment.id, force_send=True)

        return True

    ##==================================== FIELDS

    reference = fields.Char(string="Reference", size=255,
                            help="This is the code that uniquely identifies the attachment")

    partner_id = fields.Many2one(comodel_name='res.partner', string="Partner Ref.",
                                 help="The related field with partners database")

    attach_custom_type = fields.Selection([('cni', "ID Card / Residence Card"), ('passport', "Passport"),
                                           ('working_license', 'Working license'),
                                           ('student_permit', 'Study Permit'),
                                           ('visitor', 'Visitor'),
                                           ('other', 'Other')
                                           ], string='Related Document', required=True)

    validity = fields.Boolean(string="Is it valid?", readonly=True, compute='_cal_duration', store=True,
                              help="indique si la pièce est valide c'est à dire si sa période de validité est toujours en cours.",
                              required=True)

    # conformity = fields.Boolean(string="Est conforme?", readonly=True,
    #                             help="Spécifie si la pièce est conforme du point de vue légal") #cet état va se changer via un bouton (valider la conformité de cette pièce)

    date_start = fields.Date(string="date de début",
                             help="Il s'agit de la date à partir de laquelle la validité de la pièce débute",
                             required=True)

    date_end = fields.Date(string="date de fin",
                           help="Il s'agit de la date à laquelle la validité de la pièce expire", required=True)

    duration = fields.Integer(compute='_cal_duration', string="Nbre de jours de Validité",
                              help="Il s'agit du nombre de jours de validité", required=True)

    duration_rest = fields.Integer(compute='_cal_duration', string="Nbre de jours restant",
                                   help="Il s'agit du nombre de jours de validité restante", required=True)

    computed = fields.Integer(string="Calcul?", readonly=True, default=0)

    ##------------------------ ORM

    def in_update(self):
        for r in self: r.computed = not bool(r.computed)
