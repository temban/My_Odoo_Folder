# -*- coding: utf-8 -*-

{
    'name' : 'ShinTheo Full Custom Sales / invoicing',
    'version' : '1.0',
    'summary': 'Appointment extension with sale and invoicing',
    'sequence': 130,
    'description': """
Appointment extension with sale and invoicing
====================
- Provides facilities for using the sales and invoicing modules in combination with the appointment management module.
- It modifies the workflow of appointments by directly allowing the generation of sales quotation
- It allows the automatic generation of the invoice after validation of the sales quotation
    """,
    'author': u'SHINTHEO OÜ',
    'category': 'SHINTHEO BUSINESS',
    'website': 'https://saas24.shintheo.com',
    'images' : ['static/description/icon.png'],
    'depends' : ['m0_shintheo_base', 'account', 'product', 'sale', 'business_appointment', 'business_appointment_sale', 'user_fidelity_points'],
    'data': [
        #security
        'security/ir.model.access.csv',
        #Data
        'data/m1_shintheo_fc_data.xml',

        #Views
        'views/appointment_view.xml',

        #Menu

    ],

    'installable': True,
    'application': True,
    'auto_install': False,
    'price': 2000,
    'currency': 'EUR',
    'license': 'AGPL-3',
}
