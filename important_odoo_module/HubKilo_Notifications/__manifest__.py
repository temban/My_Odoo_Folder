# -*- coding: utf-8 -*-
{
    'name': "HubKilo_Notifications",

    'summary': """
        SHubKilo Mailing Module""",

    'description': """
        HubKilo Mailing Module for Travels and Shippings
    """,

    'author': "Shintheo OÜ",
    'website': "https://shintheo.com/",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Shipping',
    'version': '0.1',
    'sequence': 10,
    'images': ['static/description/icon.png'],
    # any module necessary for this one to work correctly
    'depends': ['base', 'mail', 'base_setup', 'product', 'analytic', 'portal', 'digest', 'm1st_hk_roadshipping', 'web', 'hr'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'data/HubKilo_Mail_Settings.xml',
        'data/new_travel.xml',
        'data/traveller_new_shipping.xml',
        'data/sender_new_shipping.xml',
        'data/traveller_shipping_rejected.xml',
        'data/sender_shipping_rejected.xml',
        'data/traveller_shipping_cancelled.xml',
        'data/sender_shipping_cancelled.xml',
        'data/traveller_shipping_price_proposal.xml',
        'data/sender_shipping_price_proposal.xml',
        'data/traveller_price_accepted_by_sender.xml',
        'data/sender_price_accepted_by_sender.xml',
        'data/traveller_confirmation_of_shipping_price_by_traveller.xml',
        'data/sender_confirmation_of_shipping_price_by_traveller.xml',
        'data/traveller_bills_paid_by_sender.xml',
        'data/sender_bills_paid_by_sender.xml',
        'data/recipient_delivery_code.xml',
        'data/sender_delivery_code.xml',
        'data/traveller_luggage_delivered.xml',
        'data/sender_luggage_delivered.xml',
        'data/recipient_luggage_delivered.xml',
        'data/traveller_luggage_handed_to_traveller.xml',
        'data/sender_luggage_handed_to_traveller.xml',
        'data/recipient_luggage_handed_to_traveller.xml',
        # 'data/templates.xml',

    ],
    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
    'license': 'LGPL-3',
    'installable': True,
    'application': True,
    'auto_install': False
}
