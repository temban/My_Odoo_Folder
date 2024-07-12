from odoo import http
from odoo.http import request

class MyPortal(http.Controller):
    @http.route('/my_portal', website=True, auth='public')
    def portal_main(selfself, **kwargs):
        return request.render('odoo_portal.portal_page', {})
