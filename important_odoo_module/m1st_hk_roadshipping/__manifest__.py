# -*- coding: utf-8 -*-

{
    'name': 'ShinTheo HubKilo Road Shipement',
    'version': '4.1.4',
    'summary': 'Road shipments management',
    'sequence': 110,
    'description': """
        Provides facilities for shipments management
        ====================
        - Management of road shipments for HUBKILO
    """,

    'author': u'SHINTHEO OÜ',
    'category': 'SHINTHEO SHIPPING',
    'website': 'https://shintheo.com/',
    'images': ['static/description/icon.png'],
    'depends': ['m0st_hk_base', 'mail', 'base_geolocalize', 'payment', 'l10n_fr', 'Shintheo_Websocket'],
    'data': [
        # SECURITY
        'security/ir.model.access.csv',

        # DATA
        'data/m1sthk_data.xml',
        'data/send_attachment_expiry_notification.xml',

        # VIEWS
        'views/travel_view.xml',
        'views/message.xml',
        'views/shipping_view.xml',
        'views/partner_view.xml',

        # MENUS
        'm1st_hk_roadshipping_menus.xml',
    ],

    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
    'post_init_hook': '_create_products',

}

# 'depends': ['base', 'portal', 'website_profile', 'base', 'mail', 'base_setup', 'product', 'analytic', 'digest', 'web', 'website'],
