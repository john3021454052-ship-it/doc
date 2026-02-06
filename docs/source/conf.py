import os
import sys

# Add custom extensions directory to path
sys.path.insert(0, os.path.abspath('_ext'))

project = 'API Documentation'
copyright = '2026, Your Company'
author = 'Your Company'
release = '1.0.0'

extensions = [
    'myst_parser',
    'sphinx.ext.autodoc',
    'sphinx.ext.viewcode',
    'sphinx.ext.napoleon',
    'jieba_search',
]

myst_enable_extensions = [
    "colon_fence",
    "deflist",
]

templates_path = ['_templates']
exclude_patterns = []

language = 'zh_CN'
locale_dirs = ['locales/']
gettext_compact = False

html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']
html_css_files = [
    'custom.css',
]
html_js_files = [
    'custom.js',
]

html_theme_options = {
    'navigation_depth': 4,
    'collapse_navigation': False,
    'sticky_navigation': True,
    'includehidden': True,
    'titles_only': False,
}

source_suffix = {
    '.rst': 'restructuredtext',
    '.md': 'markdown',
}

html_search_language = 'zh'
