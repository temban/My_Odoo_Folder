#
{
    'name': "fidelity card",
    'version': '2.0.0',
    'sequence': 10,
    'depends': ['base', 'mail', 'base_setup', 'product', 'analytic', 'portal', 'digest', 'web',
                'account', 'website'],
    'category': 'fidelity',
    'author': "SHINTHEO OÃœ",
    'website': "http://www.shintheo.com",
    'summary': 'fedility points',
    'description': "",
    # data files always loaded at installation
    'data': [
        'security/ir.model.access.csv',
        'views/qr_code.xml',
        'data/facturation_cron_job.xml',
        'data/bonus_mail_template.xml',
        'data/points_email_template.xml',
        'views/clients.xml',
        'views/manage.xml',
    ],
    # data files containing optionally loaded demonstration data
    'license': 'LGPL-3',
    'installable': True,
    'application': True,
    'auto_install': False
}
