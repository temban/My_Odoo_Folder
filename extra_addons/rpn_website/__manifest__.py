# -*- coding: utf-8 -*-
{
    'name': "RPN Website",

    'summary': "RPN Website",

    'author': "SHINTHEO OÜ",
    'website': "https://shintheo.com/",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'SHINTHEO RPN',
    'version': '1.0.5',
    'sequence': 3,

    # any module necessary for this one to work correctly
    'depends': ['base','web', 'website', 'portal'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/views.xml',
        'views/templates.xml',
        'static/src/xml/rpn_portal.xml',
        'static/src/xml/rpn_member_creation.xml',
    ],
    # only loaded in demonstration mode
    'assets': {
        'web.assets_frontend': [
            '/rpn_website/static/src/js/Portal.js',
        ],

    },
    'demo': [
        'demo/demo.xml',
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
