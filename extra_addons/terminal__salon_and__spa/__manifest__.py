# -*- coding: utf-8 -*-
{
    'name': "Terminal Salon and SPA",
    'summary': 'A customized POS interface for a barbing salon business model.',
    'description': 'A custom POS interface with features tailored for a barbing salon.',
    'category': 'Point of Sale',
    'author': "Shintheo OÜ",
    'website': "https://shintheo.com/",
    'version': '0.1',
    'sequence': 10,
    'images': ['static/description/icon.png'],
    # any module necessary for this one to work correctly
    'depends': ['base', 'point_of_sale'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/pos_interface.xml',
        # 'templates/order_summary.xml',
    ],
    # 'qweb': [
    #     'static/src/xml/order_summary.xml',
    # ],
    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
    'license': 'LGPL-3',
    'installable': True,
    'application': True,
    'auto_install': False
}
