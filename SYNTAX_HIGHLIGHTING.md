# Syntax Highlighting Implementation

## Overview

This documentation site now features advanced syntax highlighting powered by Highlight.js with custom Darcula-inspired themes that automatically adapt to day/night mode.

## Features

### 🎨 Theme Support

- **Light Mode (Day)**: Custom Darcula-light theme with IntelliJ-inspired color scheme
- **Dark Mode (Night)**: Custom Darcula-dark theme matching JetBrains IDEs
- **Automatic Theme Switching**: Syntax highlighting automatically updates when switching between day/night modes

### 🌐 Language Support

The syntax highlighter supports all major programming languages including:

- **Web**: JavaScript, TypeScript, HTML, CSS
- **Backend**: Python, Java, C++, C#, Go, Rust, Ruby, PHP
- **Mobile**: Swift, Kotlin
- **Scripting**: Bash/Shell
- **Data**: SQL, JSON, YAML, XML
- **Markup**: Markdown
- **DevOps**: Dockerfile
- **Protocol**: HTTP

### 🎯 Key Features

1. **Automatic Language Detection**: The system automatically detects the language from Sphinx code block directives
2. **Dynamic Theme Switching**: Syntax colors update instantly when toggling between day and night modes
3. **Professional Color Schemes**: Based on JetBrains' popular Darcula theme
4. **Performance Optimized**: Highlight.js loads efficiently via CDN
5. **Consistent Styling**: All code blocks maintain consistent appearance across the documentation

## Implementation Details

### JavaScript Integration

The `SyntaxHighlighter` class in `custom.js`:
- Dynamically loads Highlight.js from CDN
- Detects language from Sphinx's `highlight-*` CSS classes
- Applies syntax highlighting to all code blocks
- Re-applies highlighting when theme changes

### CSS Styling

Two comprehensive theme implementations:
- **Light Mode**: Colors optimized for readability on light backgrounds
  - Keywords: Navy blue (#000080)
  - Strings: Dark green (#008000)
  - Numbers: Blue (#0000ff)
  - Comments: Gray (#8c8c8c)
  
- **Dark Mode**: Colors matching IntelliJ IDEA's Darcula theme
  - Keywords: Orange (#cc7832)
  - Strings: Green (#6a8759)
  - Numbers: Light blue (#6897bb)
  - Comments: Gray (#808080)

### Architecture

```
SyntaxHighlighter
├── loadHighlightJs()         # Load library from CDN
├── detectLanguage()           # Extract language from Sphinx classes
├── applyHighlighting()        # Initial highlighting
└── reapplyHighlighting()      # Re-highlight on theme change

ThemeManager
└── toggle()                   # Triggers syntax re-highlighting
```

## Usage in Documentation

Simply use standard Sphinx code block syntax:

### Python Example
```python
def hello_world():
    print("Hello, World!")
    return True
```

### JavaScript Example
```javascript
const greeting = "Hello, World!";
console.log(greeting);
```

### Multiple Languages

The system supports dozens of languages automatically:

```bash
# Shell script
echo "Installing dependencies..."
npm install
```

```json
{
  "name": "example",
  "version": "1.0.0"
}
```

```typescript
interface User {
  name: string;
  age: number;
}
```

## Technical Specifications

- **Library**: Highlight.js v11.9.0
- **CDN**: CloudFlare CDN (reliable, fast)
- **Load Strategy**: Async loading on page initialization
- **Theme Application**: CSS-based with body class selectors
- **Performance**: Minimal impact, CDN-cached, client-side only

## Benefits

1. **Enhanced Readability**: Professional syntax coloring improves code comprehension
2. **Eye Comfort**: Theme-matched colors reduce eye strain in both modes
3. **Developer Familiar**: Colors match popular IDEs like IntelliJ IDEA, VS Code
4. **Consistent Experience**: Same highlighting across all documentation pages
5. **No Build Changes**: Pure client-side implementation, no Sphinx configuration changes needed

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (Chromium-based)
- Firefox
- Safari
- Opera

## Maintenance

The syntax highlighting system is self-contained in:
- `/docs/source/_static/custom.js` - JavaScript logic
- `/docs/source/_static/custom.css` - Theme styles

No additional dependencies or build steps required.
