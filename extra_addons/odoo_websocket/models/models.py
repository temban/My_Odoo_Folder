from odoo import models

class AccountMove(models.Model):
    _inherit = 'account.move'

    def print_invoice(self):
        self.ensure_one()
        return self.env.ref('custom_invoice_header.report_invoice_document_custom').report_action(self)
