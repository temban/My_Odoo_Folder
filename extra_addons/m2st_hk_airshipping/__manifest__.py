# -*- coding: utf-8 -*-

{
    'name': 'ShinTheo HubKilo Air Shipement',
    'version': '1.0.2',
    'summary': 'Air shipments management',
    'sequence': 6,
    'description': """
        Provides facilities for shipments management
        ====================
        - Management of air shipments for HUBKILO
    """,

    'author': u'SHINTHEO OÜ',
    'category': 'SHINTHEO SHIPPING',
    'website': 'https://shintheo.com/',
    'images': ['static/description/icon.png'],
    'depends': ['m0st_hk_base', 'base', 'web', 'op_res_city', 'hr', 'mail', 'payment', 'l10n_fr', 'account',
                'pits_fcm_notifications'],
    'data': [
        # SECURITY
        'security/ir.model.access.csv',

        # DATA
        'data/m2sthk_data.xml',

        # demo
        'demo/rejection_air_travel.xml',
        'demo/publish_air_travel.xml',
        'demo/traveller_new_shipping.xml',
        'demo/sender_new_shipping.xml',
        'demo/traveller_shipping_rejected.xml',
        'demo/sender_shipping_rejected.xml',
        # 'demo/traveller_shipping_cancelled.xml',
        # 'demo/sender_shipping_cancelled.xml',
        'demo/traveller_bills_paid_by_sender.xml',
        'demo/sender_bills_paid_by_sender.xml',
        'demo/recipient_delivery_code.xml',
        'demo/sender_delivery_code.xml',
        'demo/traveller_luggage_delivered.xml',
        'demo/sender_luggage_delivered.xml',
        'demo/recipient_luggage_delivered.xml',
        'demo/traveller_luggage_handed_to_traveller.xml',
        'demo/sender_luggage_handed_to_traveller.xml',
        'demo/recipient_luggage_handed_to_traveller.xml',

        # VIEWS

        'views/travel_view.xml',
        'views/shipping_view.xml',
        'views/partner_view.xml',
        'views/notifications_log.xml',
        'views/rating.xml',
        'views/res_config_settings_view.xml',
        # 'views/email_res_config_settings.xml',

        # MENUS
        'm2st_hk_airshipping_menus.xml',

    ],

    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
    'post_init_hook': '_create_products_and_luggage_model',

}

# 'depends': ['base', 'portal', 'website_profile', 'base', 'mail', 'base_setup', 'product', 'analytic', 'digest', 'web', 'website'],
