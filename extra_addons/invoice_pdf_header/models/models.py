# -*- coding: utf-8 -*-

from odoo import models, fields, api


class invoice_pdf_header(models.Model):
    _inherit = 'account.move'

    def print_invoice(self):
        self.ensure_one()
        return self.env.ref('invoice_pdf_header.report_invoice_document_custom').report_action(self)