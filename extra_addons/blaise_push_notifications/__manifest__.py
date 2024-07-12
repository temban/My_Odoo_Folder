# -*- coding: utf-8 -*-
{
    'name': "Blaise_Push_Notifications",
    'summary': 'Send Firebase Cloud Messages from Odoo',
    'author': "Temban Blaise Ayim",
    'website': "http://www.yourcompany.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Tools',
    'version': '0.1',
    'sequence': 1,

    # any module necessary for this one to work correctly
    'depends': ['base', 'base_setup', 'web'],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        'views/fcm_notification_views.xml',
        'views/fcm_config_views.xml',
        'views/socket.xml',
    ],
    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
    'qweb': [
        'static/src/js/firebase_notifications.js',
    ],
    'license': 'LGPL-3',
    'installable': True,
    'application': True,
    'auto_install': False
}
