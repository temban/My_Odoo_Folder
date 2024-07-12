# -*- coding: utf-8 -*-
{
    'name': 'ShinTheo Mails Template',
    'version': '1.0',
    'summary': 'Shintheo mail template',
    'description': 'This module applies the shintheo email template to all Odoo account creation emails.',
    'category': 'Custom',
    'author': 'Shintheo OÜ',
    'depends': ['base', 'mail'],
    'data': [
        'views/templates.xml',
    ],
    'installable': True,
    'auto_install': False,
}