# -*- coding: utf-8 -*-
{
    'name': "Custom Invoice PDF",

    'summary': """
        Short (1 phrase/line) summary of the module's purpose, used as
        subtitle on modules listing or apps.openerp.com""",

    'description': """
        Long description of module's purpose
    """,

    'author': u'SHINTHEO OÜ',
    'category': 'SHINTHEO SHIPPING',
    'website': 'https://shintheo.com/',
    'images' : ['static/description/icon.png'],

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'report',
    'version': '1.0.1',

    # any module necessary for this one to work correctly
    'depends': ['base', 'mail', 'portal', 'web', 'base_setup',
                'auth_signup', 'account', 'account_payment',
                'auth_totp_mail', 'auth_totp', 'payment'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/views.xml',
        'views/templates.xml',
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
