# Darcula Theme Implementation and Testing Guide

## Overview

This document describes the implementation of Darcula Light and Dark themes for code blocks in the Sphinx documentation website, and provides instructions for testing the functionality.

## Implementation Details

### 1. Theme Configuration

The Darcula themes are implemented in `docs/source/_static/custom.css` with two distinct color schemes:

#### Darcula Light Theme (Day Mode)
- **Background**: `#f5f5f5` (light gray)
- **Text Color**: `#000000` (black)
- **Keywords**: `#000080` (navy blue, bold)
- **Strings**: `#008000` (dark green, bold)
- **Numbers**: `#0000ff` (blue)
- **Comments**: `#8c8c8c` (gray, italic)
- **Functions**: `#000000` (black, bold)
- **Built-ins**: `#30a0d0` (light blue)

#### Darcula Dark Theme (Night Mode)
- **Background**: `#2b2b2b` (dark gray, similar to JetBrains Darcula)
- **Text Color**: `#a9b7c6` (light gray)
- **Keywords**: `#cc7832` (orange, similar to IntelliJ IDEA)
- **Strings**: `#6a8759` (green)
- **Numbers**: `#6897bb` (light blue)
- **Comments**: `#808080` (gray, italic)
- **Functions**: `#ffc66d` (golden yellow)
- **Built-ins**: `#8888c6` (light purple)

### 2. JavaScript Implementation

The syntax highlighting is managed by the `SyntaxHighlighter` class in `docs/source/_static/custom.js`:

```javascript
class SyntaxHighlighter {
    // Loads Highlight.js from CDN
    loadHighlightJs()

    // Detects language from Sphinx Pygments classes
    detectLanguage(block)

    // Applies Highlight.js syntax highlighting
    applyHighlighting()

    // Reapplies highlighting when theme changes
    reapplyHighlighting()
}
```

### 3. Theme Switching Mechanism

The `ThemeManager` class handles theme switching:

1. **User clicks toggle button** → `toggle()` method is called
2. **Theme preference saved** → Stored in `localStorage`
3. **Theme applied** → Body class toggled (`dark-mode` added/removed)
4. **Syntax highlighting reapplied** → `reapplyHighlighting()` called after 100ms delay

This ensures code block colors update immediately when switching between day and night modes.

## CSS Selectors

The themes are applied using CSS selectors based on the body class:

```css
/* Light mode (default) - Darcula Light Theme */
body:not(.dark-mode) .hljs {
    background: #f5f5f5 !important;
    color: #000000 !important;
}

body:not(.dark-mode) .hljs-keyword {
    color: #000080 !important;
    font-weight: bold;
}

/* Dark mode - Darcula Dark Theme */
body.dark-mode .hljs {
    background: #2b2b2b !important;
    color: #a9b7c6 !important;
}

body.dark-mode .hljs-keyword {
    color: #cc7832 !important;
}
```

## Testing the Implementation

### Test Files Created

Two test files have been created to verify the Darcula themes:

1. **`test_syntax_highlighting.html`** - Comprehensive test with multiple languages
2. **`test_darcula_themes.html`** - Simple test to verify basic functionality

### How to Test

#### Option 1: Using Test Files

1. Start the HTTP server (already running on port 8000):
   ```bash
   cd /home/engine/project/docs/build
   python -m http.server 8000
   ```

2. Open the test files in your browser:
   - `http://localhost:8000/test_syntax_highlighting.html`
   - `http://localhost:8000/test_darcula_themes.html`

3. Verify the following:
   - **Day Mode (default)**: Code blocks use Darcula Light theme
     - Light gray background (#f5f5f5)
     - Navy blue keywords (#000080)
     - Dark green strings (#008000)
     - Blue numbers (#0000ff)

   - **Night Mode**: Code blocks use Darcula Dark theme
     - Click the toggle button to switch to night mode
     - Dark gray background (#2b2b2b)
     - Orange keywords (#cc7832)
     - Green strings (#6a8759)
     - Light blue numbers (#6897bb)

   - **Theme Switching**: Colors update immediately when toggling
   - **Multiple Languages**: All code blocks (Python, JavaScript, JSON, etc.) display correctly
   - **Persistence**: Theme preference is saved and restored on page refresh

#### Option 2: Testing with Sphinx Documentation

1. Navigate to the Sphinx documentation:
   - Chinese: `http://localhost:8000/html-zh/zh_CN/introduction.html`
   - English: `http://localhost:8000/html-en/en/introduction.html`

2. Scroll to any code block

3. Verify the theme:
   - Check if code blocks have syntax highlighting
   - Toggle the theme using the button in the sidebar
   - Verify colors update immediately
   - Refresh the page to verify theme persistence

### Expected Behavior

#### Light Mode (Day)
- Background: Light gray, easy on the eyes
- Keywords: Navy blue, bold and easy to identify
- Strings: Dark green, clear distinction from keywords
- Comments: Gray and italic, unobtrusive
- Good contrast for readability

#### Dark Mode (Night)
- Background: Dark gray, similar to JetBrains IDEs
- Keywords: Orange, matching IntelliJ IDEA Darcula theme
- Strings: Green, pleasant on dark background
- Comments: Gray and italic, not distracting
- Reduced eye strain for nighttime reading

### Supported Languages

The Darcula themes support all major programming languages:

- **Web**: JavaScript, TypeScript, HTML, CSS
- **Backend**: Python, Java, C++, C#, Go, Rust
- **Data**: SQL, JSON, YAML, XML
- **Scripting**: Bash/Shell
- **DevOps**: Dockerfile
- **And many more**...

## Troubleshooting

### Code blocks not highlighted

1. Check browser console for errors:
   - Press F12 to open developer tools
   - Look for JavaScript errors
   - Check if Highlight.js is loaded

2. Verify Highlight.js CDN is accessible:
   ```javascript
   // Check in browser console
   typeof hljs
   // Should return: "object"
   ```

3. Ensure custom.js is loaded:
   - Check Network tab in developer tools
   - Verify `custom.js` is loaded without errors

### Colors not switching

1. Check if body class is toggling:
   ```javascript
   // In browser console
   document.body.classList.contains('dark-mode')
   ```

2. Verify CSS is loaded:
   - Check `custom.css` in Network tab
   - Ensure file loads successfully

3. Clear browser cache:
   - Some browsers cache CSS aggressively
   - Clear cache and reload page

## Technical Specifications

- **Highlight.js Version**: 11.9.0
- **CDN**: CloudFlare CDN (`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js`)
- **Theme Application**: CSS-based with `body.dark-mode` class selector
- **Performance**: Minimal overhead, client-side only
- **Browser Compatibility**: Chrome, Firefox, Safari, Edge (all modern browsers)

## Files Modified

- `docs/source/_static/custom.css` - Darcula theme definitions
- `docs/source/_static/custom.js` - Syntax highlighting and theme switching logic

## Summary

The Darcula theme implementation provides:

✅ **Day Mode**: Darcula Light theme with IntelliJ-inspired colors
✅ **Night Mode**: Darcula Dark theme matching JetBrains IDEs
✅ **Automatic Switching**: Colors update when toggling themes
✅ **Wide Language Support**: All major programming languages
✅ **Performance Optimized**: Fast loading via CDN
✅ **User-Friendly**: Persistent theme preferences

The implementation is complete and ready for testing. Use the provided test files or the Sphinx documentation to verify the functionality.
