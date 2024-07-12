# -*- coding: utf-8 -*-
{
    'name': "hubkilo website",

    'summary': "Air and Road shipments management",

    'description': "Management of air and road shipments",

    'author': "Shintheo OÜ",
    'website': "https://shintheo.com/",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Shipping',
    'version': '15.0.1.2',
    'sequence': 10,

    # any module necessary for this one to work correctly
    'depends': ['base', 'web', 'website', 'portal', 'm1st_hk_roadshipping', 'account', 'account_payment', 'hub_kilo_review'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/views.xml',
        'views/templates.xml',
        'static/src/xml/my_portal.xml',
        'static/src/xml/hub_travels.xml',
        'static/src/xml/ajouter_voyage.xml',
        'static/src/xml/modifier_voyage.xml',
        'static/src/xml/hub_booking_page.xml',
        'static/src/xml/modifier_la_reservation.xml',
        'static/src/xml/updateProfile.xml',
        'static/src/xml/my_negociation.xml',
        'static/src/xml/hub_home.xml',
        'static/src/xml/identification.xml',
        'static/src/xml/hub_shippings.xml',
        'static/src/xml/hub_my_shippings.xml',
        'static/src/xml/hub_receiver.xml',
        'static/src/xml/hub_my_travels.xml',
        'static/src/xml/shipping_details.xml',
        'static/src/xml/shipping_traveler_details.xml',
        'static/src/xml/hub_create_travel.xml',
        'static/src/xml/hub_my_travel_details.xml',
        'static/src/xml/shipping.xml',
        'static/src/xml/id_page.xml',
        'static/src/xml/hub_create_shipping.xml',
        'static/src/xml/hub_shipping_offers.xml',
        'static/src/xml/hub_my_shipping_offers.xml',
        'static/src/xml/shipping_offer_details.xml',
        'static/src/xml/shipping_details_test.xml',
        # 'i18n/fr.po'
    ],
    'assets': {
        'web.assets_frontend': [
            # '/hubkilo_website/static/src/css/App.css',
            '/hubkilo_website/static/src/js/voyage_page.js',
            '/hubkilo_website/static/src/js/ajouter.js',
            '/hubkilo_website/static/src/js/shipping_details_test.js',
            # '/hubkilo_website/static/src/js/voyages.js',
        ],
        'web.assets_qweb': [
            'hubkilo_website/static/src/xml/*.xml',
        ],

    },

    # only loaded in demonstration mode
    'license': 'LGPL-3',
    'installable': True,
    'application': True,
    'auto_install': False
}
