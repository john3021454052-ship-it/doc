# Language Switcher Improvements

## Issue
Previously, when switching languages in the documentation, the directory tree (sidebar navigation) did not change. Users would see the same navigation structure regardless of the selected language, which was confusing and incorrect.

## Solution
The language switcher has been completely re-implemented to properly navigate between separate Sphinx build directories. This ensures that:

1. **The directory tree (sidebar navigation) changes when switching languages**
2. Each language version has its own TOC generated from its respective index file:
   - Chinese version uses `index.rst` with references to `zh_CN/*.md` files
   - English version uses `index_en.rst` with references to `en/*.md` files
3. Users see the correct navigation structure for the language they've selected
4. Current page context is maintained (e.g., introduction.md in Chinese ↔ introduction.md in English)

## Technical Implementation

### Changes to `docs/source/_static/custom.js`

The `LanguageSwitcher` class has been completely rewritten with the following improvements:

#### New Methods

1. **`detectBuildDir()`**: Detects which build directory the user is currently in (`html-zh` or `html-en`)

2. **`getCurrentPage()`**: Extracts the current page name from the URL path to maintain context when switching

3. **`getBuildPrefix(lang)`**: Calculates the relative path prefix to navigate between build directories

#### Enhanced `switchLanguage()` Method

The language switching logic now:
- Properly handles navigation between `html-zh/` and `html-en/` directories
- Replaces build directory paths in URLs (e.g., `/html-zh/` → `/html-en/`)
- Replaces index file names (e.g., `index.html` → `index_en.html`)
- Replaces content directory paths (e.g., `/zh_CN/` → `/en/`)
- Maintains current page context during language switch
- Handles edge cases with fallback logic

### Key Behavior

**Before:**
- Language switching attempted to replace paths within the same directory
- Sidebar navigation remained static
- Users saw the same TOC regardless of language

**After:**
- Language switching navigates between different build directories
- Full page reload occurs with language-specific content
- Sidebar navigation changes to match the selected language
- Each language version has its own Sphinx build with its own TOC

### Example Navigation Paths

| Current Page | After Switch to English | After Switch to Chinese |
|--------------|----------------------|----------------------|
| `html-zh/index.html` | `html-en/index_en.html` | - |
| `html-zh/zh_CN/introduction.html` | `html-en/en/introduction.html` | - |
| `html-en/index_en.html` | - | `html-zh/index.html` |
| `html-en/en/introduction.html` | - | `html-zh/zh_CN/introduction.html` |

## Documentation Updates

Updated documentation files to reflect the changes:
- `README.md`: Clarified language switcher behavior and directory structure
- `IMPLEMENTATION_COMPLETE.md`: Updated feature description and usage instructions
- Added explicit notes about directory tree changing when switching languages

## Testing

To test the improved language switcher:

1. Build both language versions:
   ```bash
   cd docs
   make all
   ```

2. Start a local server:
   ```bash
   cd build/html-zh
   python -m http.server 8000
   ```

3. Open `http://localhost:8000` in your browser

4. Use the language switcher dropdown in the sidebar to switch between Chinese and English

5. **Verify that**: The directory tree (sidebar navigation) changes to reflect the selected language

## Files Modified

- `docs/source/_static/custom.js` - LanguageSwitcher class completely rewritten
- `README.md` - Updated language switcher description and usage instructions
- `IMPLEMENTATION_COMPLETE.md` - Updated feature documentation

## Backward Compatibility

This change maintains backward compatibility with the existing build system and file structure. The Makefile remains unchanged, and the build process works exactly as before.
