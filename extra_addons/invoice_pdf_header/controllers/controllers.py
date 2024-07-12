# -*- coding: utf-8 -*-
# from odoo import http


# class InvoicePdfHeader(http.Controller):
#     @http.route('/invoice_pdf_header/invoice_pdf_header', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/invoice_pdf_header/invoice_pdf_header/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('invoice_pdf_header.listing', {
#             'root': '/invoice_pdf_header/invoice_pdf_header',
#             'objects': http.request.env['invoice_pdf_header.invoice_pdf_header'].search([]),
#         })

#     @http.route('/invoice_pdf_header/invoice_pdf_header/objects/<model("invoice_pdf_header.invoice_pdf_header"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('invoice_pdf_header.object', {
#             'object': obj
#         })
