# Bug Fix: Language Switcher Directory Tree Not Changing

## Problem Description

When switching languages in the documentation site, the directory tree (sidebar navigation) was not changing to the corresponding language. The URL would attempt to change, but navigation would fail or the sidebar would remain in the original language.

## Root Cause

The issue was caused by how the documentation was being served during local development. The original code assumed the documentation would always be served from a parent directory containing both `html-zh/` and `html-en/` subdirectories.

However, the README instructions recommended serving from within one of the language directories:
```bash
cd docs/build/html-zh
python -m http.server 8000
```

When served this way, the URL paths look like:
- `/index.html` (not `/html-zh/index.html`)
- `/zh_CN/introduction.html` (not `/html-zh/zh_CN/introduction.html`)

The language switcher's path replacement logic would try to replace `/html-zh/` with `/html-en/`, but since these strings weren't in the path, the replacement would fail or produce incorrect paths, causing navigation to non-existent files.

## Solution

The fix implements dual-mode path handling in the `switchLanguage()` method:

### Mode 1: Serving from Parent Build Directory
When paths contain `/html-zh/` or `/html-en/`, the switcher uses absolute path replacement:
- `/html-zh/index.html` → `/html-en/index_en.html`
- `/html-zh/zh_CN/introduction.html` → `/html-en/en/introduction.html`

### Mode 2: Serving from Language Directory
When paths don't contain build directory markers, the switcher calculates relative paths:
- `/index.html` → `../html-en/index_en.html`
- `/zh_CN/introduction.html` → `../../html-en/en/introduction.html`

## Technical Changes

### Modified Files

1. **`docs/source/_static/custom.js`**
   - Updated `switchLanguage()` method to detect serving mode
   - Added logic to handle both absolute and relative path scenarios
   - Calculates proper relative path depth using `../` prefixes

2. **`README.md`**
   - Updated serving instructions to recommend serving from parent `build/` directory
   - Added notes explaining both serving modes

3. **`LANGUAGE_SWITCHER_IMPROVEMENTS.md`**
   - Updated testing instructions to use recommended serving method
   - Added notes about dual-mode support

### Code Logic

```javascript
// Detect serving mode
const servingFromBuildDir = currentPath.includes('/html-zh/') || currentPath.includes('/html-en/');

if (servingFromBuildDir) {
    // Use absolute path replacement
    newPath = currentPath.replace(/\/html-zh\//g, '/html-en/');
} else {
    // Calculate relative path
    const pathDepth = currentPath.split('/').filter(s => s).length;
    const upLevels = '../'.repeat(pathDepth > 0 ? pathDepth : 0);
    newPath = upLevels + '../html-en' + currentPath;
}
```

## Testing

To verify the fix works:

1. **Test Mode 1 (Recommended):**
   ```bash
   cd docs/build
   python -m http.server 8000
   ```
   Visit `http://localhost:8000/html-zh/index.html` and switch languages

2. **Test Mode 2 (Legacy):**
   ```bash
   cd docs/build/html-zh
   python -m http.server 8000
   ```
   Visit `http://localhost:8000/index.html` and switch languages

In both cases:
- Language switching should navigate to the correct page
- The sidebar navigation (directory tree) should update to show the corresponding language's structure
- Chinese pages should show: 简介, 快速开始, API 参考, 示例
- English pages should show: Introduction, Quickstart, API Reference, Examples

## Benefits

1. **Backward Compatibility**: The fix works with both serving methods
2. **Robust Navigation**: Handles edge cases like nested pages and different path structures
3. **Clear Documentation**: Updated instructions guide users to the recommended approach
4. **No Build Changes**: No modifications needed to Sphinx configuration or Makefile

## Future Considerations

For production deployment:
- Serve from parent directory containing both language builds
- Use absolute URLs with proper domain configuration
- Consider using a reverse proxy or web server that can handle both directories
- Add proper language negotiation based on browser preferences
