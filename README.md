# API Documentation Site

A comprehensive API documentation website built with Sphinx and Read the Docs theme, featuring advanced multilingual support and modern UI enhancements.

## Features

### ✅ 1. Markdown Support
- Full markdown documentation support via MyST Parser
- Organize documentation with `.md` files
- Code syntax highlighting for multiple languages

### ✅ 2. Chinese & English Search with Jieba Integration
- Integrated jieba for Chinese word segmentation
- Enhanced search functionality for both Chinese and English content
- Smart word filtering and stop-word removal

### ✅ 3. Night/Day Mode Toggle
- Single-button theme switcher located below the sidebar
- Eye-friendly color schemes optimized for reading
- Persistent theme preference using localStorage
- Smooth transitions between modes

### ✅ 4. Language Switcher
- Dropdown menu for language selection (Chinese/English)
- Located in the sidebar below the search box
- Seamless switching between language versions
- **Directory tree (sidebar navigation) changes when switching languages** - each language version has its own independent navigation structure generated from its respective index file

### ✅ 5. Multilingual Content Structure
- Separate documentation trees for Chinese and English
- Chinese docs: `docs/source/zh_CN/`
- English docs: `docs/source/en/`
- Independent navigation for each language

### ✅ 6. Enhanced Code Blocks
- Copy button: Click to copy code to clipboard with "Copied!" feedback
- Line numbers button: Toggle line numbers on/off
- Buttons positioned on the right side above each code block
- One line of spacing above all code blocks

## Project Structure

```
.
├── docs/
│   ├── source/
│   │   ├── _ext/                  # Custom Sphinx extensions
│   │   │   └── jieba_search.py    # Jieba integration for Chinese search
│   │   ├── _static/               # Static assets
│   │   │   ├── custom.css         # Custom styles (theme switcher, code blocks)
│   │   │   └── custom.js          # JavaScript functionality
│   │   ├── _templates/            # Custom templates
│   │   ├── zh_CN/                 # Chinese documentation
│   │   │   ├── introduction.md
│   │   │   ├── quickstart.md
│   │   │   ├── api_reference.md
│   │   │   └── examples.md
│   │   ├── en/                    # English documentation
│   │   │   ├── introduction.md
│   │   │   ├── quickstart.md
│   │   │   ├── api_reference.md
│   │   │   └── examples.md
│   │   ├── conf.py                # Sphinx configuration
│   │   ├── index.rst              # Chinese homepage
│   │   └── index_en.rst           # English homepage
│   └── Makefile                   # Build commands
├── requirements.txt               # Python dependencies
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

## Installation

1. Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Building Documentation

### Build Chinese version (default):
```bash
cd docs
make html
```

### Build English version:
```bash
cd docs
make html-en
```

### Build both versions:
```bash
cd docs
make all
```

### Clean build directory:
```bash
cd docs
make clean
```

## Viewing Documentation

After building, open the generated HTML files in your browser:

- Chinese version: `docs/build/html-zh/index.html`
- English version: `docs/build/html-en/index_en.html`

For local development with language switching support, you should serve from the parent build directory:
```bash
cd docs/build
python -m http.server 8000
```

Then visit:
- Chinese: `http://localhost:8000/html-zh/index.html`
- English: `http://localhost:8000/html-en/index_en.html`

**Note**: The language switcher works in both serving modes:
- When served from `build/`: Uses absolute paths (recommended for full functionality)
- When served from `build/html-zh/` or `build/html-en/`: Uses relative paths to navigate to the sibling directory

**Important Notes**:
- Each language version is built into a separate directory (`html-zh` and `html-en`)
- The language switcher in the sidebar will navigate between these directories
- When you switch languages, the entire page reloads from the other build directory
- **The directory tree (sidebar navigation) will change** - this is expected behavior as each language has its own TOC generated from its respective index file
- Current page context is maintained (e.g., if you're on `introduction.html` in Chinese, switching to English will take you to `introduction.html` in English)

## Architecture

### Clear Code Organization

The project follows a modular architecture with clear separation of concerns:

1. **Configuration Layer** (`conf.py`)
   - Centralized Sphinx configuration
   - Extension management
   - Theme settings

2. **Extension Layer** (`_ext/`)
   - Custom Sphinx extensions
   - Jieba search integration
   - Decoupled from core functionality

3. **Presentation Layer** (`_static/`)
   - CSS: Theme styling and component styles
   - JS: Feature implementations (theme switcher, language selector, code enhancements)
   - Modular classes for each feature

4. **Content Layer** (`zh_CN/`, `en/`)
   - Separate language-specific content
   - Markdown-based documentation
   - Clean separation of concerns

### JavaScript Architecture

The JavaScript code (`custom.js`) is organized into three main classes:

- **ThemeManager**: Handles day/night mode switching
- **LanguageSwitcher**: Manages language selection and navigation
- **CodeBlockEnhancer**: Adds copy and line number functionality to code blocks

Each class is self-contained and can be modified independently.

## Customization

### Adding New Documentation Pages

1. Create a new markdown file in the appropriate language directory:
   - Chinese: `docs/source/zh_CN/your_page.md`
   - English: `docs/source/en/your_page.md`

2. Add the page to the table of contents in `index.rst` or `index_en.rst`:
```rst
.. toctree::
   :maxdepth: 2
   :caption: Contents:

   zh_CN/your_page
```

### Customizing Colors

Edit `docs/source/_static/custom.css` to change color schemes:

```css
:root {
    --bg-color: #fcfcfc;           /* Light mode background */
    --text-color: #404040;         /* Light mode text */
    /* ... other variables ... */
}

body.dark-mode {
    --bg-color: #1e1e1e;           /* Dark mode background */
    --text-color: #d4d4d4;         /* Dark mode text */
    /* ... other variables ... */
}
```

### Extending Functionality

To add new features:

1. Add CSS in `_static/custom.css`
2. Add JavaScript in `_static/custom.js` (follow the class-based pattern)
3. Create custom Sphinx extensions in `_ext/` for advanced features

## Technology Stack

- **Sphinx**: Documentation generator
- **Read the Docs Theme**: Professional documentation theme
- **MyST Parser**: Markdown support for Sphinx
- **Jieba**: Chinese text segmentation
- **JavaScript (ES6)**: Client-side functionality
- **CSS3**: Modern styling with CSS variables

## License

This project is provided as-is for documentation purposes.

## Support

For issues or questions, please refer to the official documentation of:
- [Sphinx](https://www.sphinx-doc.org/)
- [Read the Docs Theme](https://sphinx-rtd-theme.readthedocs.io/)
- [MyST Parser](https://myst-parser.readthedocs.io/)
- [Jieba](https://github.com/fxsjy/jieba)
