from odoo import models, fields, api
from random import randint


class AssociationManager(models.Model):
    _name = 'association.manager'
    _description = 'Association Manager'

    @api.model
    def _get_default_color(self):
        return randint(1, 11)

    partner_id = fields.Many2one('res.partner', string='Manager', readonly=True)

    members = fields.Many2many('rpn.association.member', string='Members', readonly=True)

    member_partner_id = fields.Many2one('res.partner', string='Member Partner', readonly=True)

    color = fields.Integer(string='Color Index', default=_get_default_color)

    status = fields.Selection([
        ('canadian_citizen', 'Canadian Citizen'),
        ('resident_permit', 'Residence Permit'),
        ('student_permit', 'Study Permit'),
        ('refugee', 'Refugee'),
        ('visitor', 'Visitor'),
        ('tourist', 'Tourist'),
        ('work_permit', 'Work Permit'),
        ('other_status', 'Other Status')
    ], string='Status in Canada', readonly=True)
