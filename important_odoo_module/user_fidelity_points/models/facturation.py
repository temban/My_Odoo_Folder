from datetime import date, datetime

from odoo import fields, models, api


class UserFidelitySendMail(models.Model):
    _name ='user.fidelity.send_mail'
    _auto = False


    def send_mails(self):
       invoices = self.env['account.move'].search([('invoice_date', '=', date.today()), ('payment_state', '=', 'paid')])
       template2 = self.env.ref('account.email_template_edi_invoice')
       for invoice in invoices:
           template2.send_mail(invoice.id, force_send=True)
