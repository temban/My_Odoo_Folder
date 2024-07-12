# -*- coding: utf-8 -*-
{
    'name': "HubKilo_Courriel_Template",

    'summary': """
        Module HubKilo Mails""",

    'description': """
        Customize Odoo Mails for HubkILO
    """,

    'author': "Shintheo OÜ",
    'website': "https://shintheo.com/",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Auth',
    'version': '0.1',
    'sequence': 10,
    'images': ['static/description/icon.png'],
    # any module necessary for this one to work correctly
    'depends': ['base', 'mail', 'portal', 'web', 'base_setup',
                'auth_signup', 'account', 'account_payment',
                'auth_totp_mail', 'auth_totp', 'payment'],

    # always loaded
    'data': [
        'views/mail_new_account.xml',
        'views/mail_reset_password.xml',
        'views/mail_connection.xml',
        'views/mail_unregistered_users.xml',
        'views/mail_credit_note.xml',
        'views/auth_totp_mail.xml',
        'views/mail_portal_user_invitation.xml',
        'views/mail_edi_invoice.xml',
        'views/mail_payment_receipt.xml',
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
