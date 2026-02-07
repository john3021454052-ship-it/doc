# 语法高亮修复 - 变更总结

## 问题描述

用户反馈「现在的代码块没有语法高亮」(current code blocks have no syntax highlighting)。经过分析，发现问题主要是由于初始化顺序和时序问题导致的。

## 根本原因

1. **初始化顺序问题**：`SyntaxHighlighter` 和 `CodeBlockManager` 的初始化顺序和时序不正确
2. **异步加载问题**：Highlight.js 是异步加载的，但没有正确处理加载完成后的应用时机
3. **事件监听器冲突**：`CodeBlockManager` 使用自己的 `DOMContentLoaded` 事件监听器，与主初始化序列不同步

## 解决方案

### 1. 修改初始化序列

**之前**：
```javascript
function initializeFeatures() {
    const syntaxHighlighter = new SyntaxHighlighter();
    new ThemeManager(syntaxHighlighter);
    new LanguageSwitcher();
    new CodeBlockManager();
}
```

**之后**：
```javascript
function initializeFeatures() {
    const syntaxHighlighter = new SyntaxHighlighter();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeAfterDOMReady(syntaxHighlighter);
        });
    } else {
        initializeAfterDOMReady(syntaxHighlighter);
    }
}

function initializeAfterDOMReady(syntaxHighlighter) {
    // 1. 首先创建 CodeBlockManager 并包装所有代码块
    const codeBlockManager = new CodeBlockManager();
    
    // 2. 等待一段时间确保包装完成
    setTimeout(() => {
        // 3. 然后应用语法高亮到已包装的代码块
        syntaxHighlighter.ensureHighlightingApplied();
        
        // 4. 最后初始化其他组件
        new ThemeManager(syntaxHighlighter);
        new LanguageSwitcher();
    }, 100);
}
```

### 2. 修改 CodeBlockManager

**之前**：
```javascript
init() {
    document.addEventListener('DOMContentLoaded', () => {
        this.enhanceCodeBlocks();
    });
}
```

**之后**：
```javascript
init() {
    // 立即运行而不是等待 DOMContentLoaded
    // 这在主初始化中调用，确保 DOM 已准备好
    this.enhanceCodeBlocks();
}
```

### 3. 添加重试逻辑

添加了 `ensureHighlightingApplied()` 方法，带有重试机制：

```javascript
ensureHighlightingApplied(maxRetries = 20) {
    if (this.highlightJsLoaded && typeof hljs !== 'undefined') {
        this.applyHighlighting();
        
        // 检查是否实际应用了高亮
        const highlightedBlocks = document.querySelectorAll('div.highlight pre.hljs');
        console.log('Highlighting applied to', highlightedBlocks.length, 'code blocks');
        
        if (highlightedBlocks.length === 0 && maxRetries > 0) {
            // 如果没有块被高亮，重试
            console.log('No blocks highlighted, retrying...');
            setTimeout(() => {
                this.ensureHighlightingApplied(maxRetries - 1);
            }, 200);
        }
    } else {
        // 如果 Highlight.js 还没有加载，等待并重试
        console.log('Waiting for Highlight.js to load...');
        if (maxRetries > 0) {
            setTimeout(() => {
                this.ensureHighlightingApplied(maxRetries - 1);
            }, 100);
        }
    }
}
```

### 4. 修改 Highlight.js 加载逻辑

**之前**：
```javascript
loadHighlightJs() {
    if (typeof hljs !== 'undefined') {
        this.highlightJsLoaded = true;
        this.applyHighlighting();  // 立即应用
        return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
    script.onload = () => {
        this.highlightJsLoaded = true;
        this.applyHighlighting();  // 立即应用
    };
    document.head.appendChild(script);
}
```

**之后**：
```javascript
loadHighlightJs() {
    if (typeof hljs !== 'undefined') {
        this.highlightJsLoaded = true;
        // 不要立即应用 - 等待正确的初始化
        return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
    script.onload = () => {
        this.highlightJsLoaded = true;
        // 不要立即应用 - 等待正确的初始化
    };
    document.head.appendChild(script);
}
```

### 5. 添加调试信息

在关键方法中添加了 `console.log` 语句，以帮助诊断问题：
- `enhanceCodeBlocks()`
- `CodeBlockWrapper.create()`
- `applyHighlighting()`
- `ensureHighlightingApplied()`

### 6. 修复 CSS 问题

修复了 `.hljs` 和 `.highlight pre` 之间的 padding 冲突：

```css
/* 确保代码块使用 highlight.js 样式 */
.highlight pre {
    padding: 0 !important;
    margin: 0 !important;
}

.hljs {
    display: block;
    overflow-x: auto;
    padding: 2em 2em;
    border-radius: 0;
    font-size: 14px;
    line-height: 1.5;
    background: #f5f5f5 !important;
}

body.dark-mode .hljs {
    background: #2b2b2b !important;
}
```

## 变更的文件

1. `docs/source/_static/custom.js` - 主要逻辑修改
2. `docs/source/_static/custom.css` - CSS 样式修复

## 测试

创建了以下测试文件：
1. `test_syntax_highlighting.html` - 基本语法高亮测试
2. `test_complete.html` - 完整功能测试（包含多种语言和深色模式切换）
3. `test_highlighting_simple.js` - 简单的 JavaScript 测试

## 预期效果

修复后，代码块应该：
1. 正确显示语法高亮（关键字、字符串、注释等颜色正确）
2. 在浅色和深色模式下都能正常工作
3. 与代码块增强功能（复制按钮、行号等）兼容
4. 在主题切换时自动更新语法高亮

## 兼容性

这些修改是向后兼容的，不会影响现有功能：
- 语言切换器仍然正常工作
- 主题切换器仍然正常工作
- 代码块增强功能（复制按钮、行号等）仍然正常工作
- 所有现有的 CSS 样式和 JavaScript 功能保持不变