#
{
    'name': "fidelity card",
    'version': '1.0.1',
    'sequence': 10,
    'depends': ['base', 'mail', 'base_setup', 'product', 'analytic', 'portal', 'digest', 'website_profile', 'web', 'account'],
    'category': 'Sales',
    'author': "SHINTHEO OÃœ",
    'website': "http://www.shintheo.com",
    'summary': 'fedility points',
    'description': "",
    # data files always loaded at installation
    'data': [
        'data/facturation_cron_job.xml',
        'data/bonus_mail_template.xml',
        'data/points_email_template.xml',
        'views/clients.xml',
        'views/manage.xml',
        # 'security/ir.model.access.csv',
    ],
    # data files containing optionally loaded demonstration data
    'license': 'LGPL-3',
    'installable': True,
    'application': True,
    'auto_install': False
}
