# .hljs 样式问题修复说明

## 问题描述

用户反馈 `.hljs` 设置完全不起作用。

## 根本原因分析

### 1. Sphinx 的语法高亮机制
Sphinx 默认使用 **Pygments** 进行语法高亮。当文档被构建时，Pygments 会生成带有特定 CSS 类的 HTML 元素，例如：

```html
<div class="highlight-python notranslate">
    <div class="highlight">
        <pre><span class="kn">from</span> <span class="nn">example_api</span> <span class="kn">import</span> <span class="n">Client</span>
<span class="n">client</span> <span class="o">=</span> <span class="n">Client</span><span class="p">(</span><span class="n">api_key</span><span class="o">=</span><span class="s1">'your_api_key'</span><span class="p">)</span>
<span class="nb">print</span><span class="p">(</span><span class="s1">'Hello World'</span><span class="p">)</span></pre>
    </div>
</div>
```

Pygments 生成的类包括：
- `kn` - 关键字（keyword）
- `nn` - 命名空间（namespace）
- `n` - 名称（name）
- `o` - 操作符（operator）
- `p` - 标点（punctuation）
- `s1` - 字符串（string）
- 等等...

### 2. 冲突的产生

`custom.js` 中的 `SyntaxHighlighter` 类试图使用 **highlight.js** 重新对代码进行高亮，但是：

1. **Pygments 的标记未被清除**：代码块中仍然保留着 Pygments 生成的 `<span>` 元素
2. **highlight.js 无法正常工作**：`hljs.highlightElement()` 无法处理已经被 Pygments 高亮的 HTML
3. **CSS 样式无法应用**：`.hljs` 的 CSS 样式只会应用于带有 `hljs` 类的元素，而 Pygments 生成的 `<span>` 元素没有这个类

### 3. 为什么 `.hljs` 样式不起作用

CSS 文件中定义了大量的 `.hljs` 样式：

```css
/* 浅色模式 */
body:not(.dark-mode) .hljs {
    background: #f5f5f5 !important;
    color: #000000 !important;
}

body:not(.dark-mode) .hljs-keyword {
    color: #000080 !important;
}

/* 深色模式 */
body.dark-mode .hljs {
    background: #2b2b2b !important;
    color: #a9b7c6 !important;
}
```

但是，这些样式的选择器是 `.hljs` 或 `.hljs-*`，而实际的 HTML 元素使用的是 Pygments 的类（如 `.kn`, `.nn` 等），因此这些样式无法生效。

## 解决方案

修改 `custom.js` 文件，在应用 highlight.js 之前**清除 Pygments 生成的所有标记**，只保留纯文本。

### 修改内容

#### 1. `applyHighlighting()` 函数

```javascript
applyHighlighting() {
    if (!this.highlightJsLoaded || typeof hljs === 'undefined') {
        return;
    }

    document.querySelectorAll('div.highlight pre').forEach((block) => {
        if (!block.classList.contains('hljs')) {
            // 清除 Pygments 生成的标记，获取纯文本
            const plainText = block.textContent;
            block.textContent = plainText;

            const language = this.detectLanguage(block);
            if (language) {
                block.classList.add('language-' + language);
            }
            hljs.highlightElement(block);
        }
    });
}
```

#### 2. `reapplyHighlighting()` 函数

```javascript
reapplyHighlighting() {
    if (!this.highlightJsLoaded || typeof hljs === 'undefined') {
        return;
    }

    document.querySelectorAll('div.highlight pre').forEach((block) => {
        if (block.classList.contains('hljs')) {
            // 清除 Pygments 生成的标记，获取纯文本
            const plainText = block.textContent;
            block.textContent = plainText;

            block.classList.remove('hljs');
            const classes = Array.from(block.classList).filter(c => c.startsWith('language-'));
            classes.forEach(c => block.classList.remove(c));
        }
        const language = this.detectLanguage(block);
        if (language) {
            block.classList.add('language-' + language);
        }
        hljs.highlightElement(block);
    });
}
```

### 修改原理

1. **提取纯文本**：`block.textContent` 会获取所有文本内容，忽略 HTML 标签
2. **清除标记**：`block.textContent = plainText` 会用纯文本替换所有 Pygments 生成的 HTML 结构
3. **应用高亮**：`hljs.highlightElement(block)` 会对纯文本进行语法高亮，并添加 `hljs` 类
4. **CSS 生效**：现在 `<pre>` 元素有 `hljs` 类，CSS 样式可以正确应用

## 效果验证

### 修改前
- 代码块使用 Pygments 的样式（由 Sphinx 主题提供）
- `.hljs` CSS 样式无法生效
- 主题切换时代码颜色不会改变

### 修改后
- 代码块使用 highlight.js 的样式
- `.hljs` CSS 样式正常生效
- 主题切换时代码颜色会自动更新（浅色/深色模式）
- 代码高亮更加美观和专业

## 测试

创建了测试页面 `test_hljs_fix.html` 用于验证修复效果：

1. 打开 `test_hljs_fix.html`
2. 检查代码块是否有语法高亮
3. 点击"切换到深色模式"按钮
4. 验证代码块的颜色是否正确切换

## 相关文件

- `docs/source/_static/custom.js` - 修改的 JavaScript 文件
- `docs/source/_static/custom.css` - CSS 样式文件（无需修改）
- `test_hljs_fix.html` - 新增的测试页面

## 注意事项

1. **清除 Pygments 标记**：这个修改会移除 Sphinx 默认的 Pygments 高亮，完全依赖 highlight.js
2. **样式一致性**：所有代码块将使用 highlight.js 的 Darcula 主题，与 Sphinx 主题可能有所不同
3. **性能影响**：由于在客户端进行语法高亮，初始加载时间可能略有增加
4. **语言检测**：确保 `detectLanguage()` 函数能够正确识别所有需要的编程语言
