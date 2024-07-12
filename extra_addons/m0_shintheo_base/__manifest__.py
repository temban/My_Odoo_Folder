# -*- coding: utf-8 -*-

{
    'name' : 'ShinTheo Base',
    'version' : '1.0',
    'summary': 'Provides basic menu utilities',
    'sequence': 100,
    'description': """
Provides basic menu utilities
====================
- Remove links in user menu.
    """,
    'author': u'SHINTHEO OÜ',
    'category': 'SHINTHEO BUSINESS',
    'website': 'https://saas24.shintheo.com',
    'images' : ['static/description/icon.png'],
    'depends' : ['base', 'web'],
    'data': [ ],

    'assets': {
        'web.assets_backend': [
            'm0_shintheo_base/static/src/js/*',
        ],
        'web.assets_qweb': [
            'm0_shintheo_base/static/src/xml/user_menu.xml',
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': True,
    'license': 'AGPL-3',

}
