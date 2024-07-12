# See LICENSE file for full copyright and licensing details.

{
    'name': 'All World Cities',
    'version': '15.0',
    'author': 'Odoopedia',
    'category': 'Extra Tools',
    'summary': """Cities
                  All cities
                  World cities
                  City
    """,
    'currency': 'USD',
    'price': '9.99',
    'maintainer': 'Odoopedia',
    'website': 'https://www.odoopedia.com',
    'description': """
    All cities
    """,
    'license': 'OPL-1',
    'depends': [
        'base', 'contacts'
    ],
    'data': [
        'views/res_city_view.xml',
        'security/ir.model.access.csv',
        'data/res_city_data.xml'
    ],
    'images': ['static/description/banner.gif'],
    'installable': True,
    'auto_install': True,
}
