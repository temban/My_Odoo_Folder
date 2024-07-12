from odoo import http
from odoo.http import request
import json

class CitiesController(http.Controller):

    @http.route('/get_cities_with_country_names_fr', type='http', auth="none", csrf=False, website=True,
                methods=['GET'], cors='*')
    def get_cities_with_country_names_fr(self, **kw):
        cities = request.env['res.city'].sudo().search([('name_fr', '!=', False)])

        city_data = []
        for city in cities:
            city_data.append({
                'id': city.id,
                'city_fr': city.name_fr,
                'city_en': city.name,
                'capital': city.capital,
                'country_code': city.country_code,
                'country': city.country_id.name
            })

        return json.dumps(city_data, ensure_ascii=False)