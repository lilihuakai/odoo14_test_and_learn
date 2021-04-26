# Copyright 2018 ACSONE SA/NV
# License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl).
# -*- coding: utf-8 -*-

{
    "name": "Introduction to OWL in Odoo - Part 1",
    "summary": """Provides an example module for OWL.""",
    'description': """
Provides an example module for OWL.
    """,
    "version": "14.0.0.1",
    "author": "Liuzm",
    "category": "Tutorials",
    "license": "LGPL-3",
    "depends": ["sale_management"],
    "data": [
        "views/assets.xml",
        # "views/res_company_views.xml",
        "views/views.xml",
    ],
    "demo": [],
    "qweb": [
        "static/src/js/components/PartnerOrderSummary.xml",
        "static/src/xml/qqmap.xml",
    ],
    "installable": True,
    'application': False,
    'auto_install': False,
}
