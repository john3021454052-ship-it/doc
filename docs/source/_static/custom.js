/**
 * Theme and Language Management for Sphinx RTD Theme
 */

// Syntax Highlighting Manager
class SyntaxHighlighter {
    constructor() {
        this.highlightJsLoaded = false;
        this.init();
    }

    init() {
        this.loadHighlightJs();
    }

    loadHighlightJs() {
        // 如果 highlight.js 已经加载，直接标记为已加载
        if (typeof hljs !== 'undefined') {
            this.highlightJsLoaded = true;
            return;
        }

        // 检查是否已经在加载中
        if (document.querySelector('script[src*="highlight.js"]')) {
            // 脚本标签已存在，等待加载完成
            this.waitForHighlightJs();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
        script.async = true;

        // 使用 bind 确保 this 上下文正确
        script.onload = function() {
            this.highlightJsLoaded = true;
            // 触发自定义事件通知加载完成
            document.dispatchEvent(new CustomEvent('highlightjs-loaded'));
        }.bind(this);

        script.onerror = function() {
            console.error('Failed to load Highlight.js');
        }.bind(this);

        document.head.appendChild(script);
    }

    // 等待 highlight.js 加载完成的轮询方法
    waitForHighlightJs(maxAttempts = 50) {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            attempts++;
            if (typeof hljs !== 'undefined') {
                clearInterval(checkInterval);
                this.highlightJsLoaded = true;
                document.dispatchEvent(new CustomEvent('highlightjs-loaded'));
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.error('Timeout waiting for Highlight.js to load');
            }
        }, 100);
    }

    detectLanguage(block) {
        const parent = block.parentElement;
        
        if (parent) {
            const classList = Array.from(parent.classList);
            for (const className of classList) {
                if (className.startsWith('highlight-')) {
                    const lang = className.replace('highlight-', '');
                    const langMap = {
                        'python': 'python',
                        'javascript': 'javascript',
                        'js': 'javascript',
                        'typescript': 'typescript',
                        'ts': 'typescript',
                        'java': 'java',
                        'cpp': 'cpp',
                        'c++': 'cpp',
                        'c': 'c',
                        'csharp': 'csharp',
                        'cs': 'csharp',
                        'go': 'go',
                        'rust': 'rust',
                        'ruby': 'ruby',
                        'php': 'php',
                        'swift': 'swift',
                        'kotlin': 'kotlin',
                        'scala': 'scala',
                        'bash': 'bash',
                        'sh': 'bash',
                        'shell': 'bash',
                        'sql': 'sql',
                        'json': 'json',
                        'xml': 'xml',
                        'html': 'html',
                        'css': 'css',
                        'yaml': 'yaml',
                        'yml': 'yaml',
                        'markdown': 'markdown',
                        'md': 'markdown',
                        'dockerfile': 'dockerfile',
                        'http': 'http',
                        'default': null
                    };
                    return langMap[lang.toLowerCase()] || null;
                }
            }
        }
        
        return null;
    }

    applyHighlighting() {
        if (!this.highlightJsLoaded || typeof hljs === 'undefined') {
            console.log('Highlight.js not loaded yet, skipping highlighting');
            return;
        }

        console.log('Applying syntax highlighting to code blocks');
        document.querySelectorAll('div.highlight pre').forEach((block) => {
            if (!block.classList.contains('hljs')) {
                // Clear Pygments-generated markup and get pure text
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

    // Method to ensure highlighting is applied, with retry logic
    ensureHighlightingApplied(maxRetries = 20) {
        // 检查 highlight.js 是否已加载
        if (!this.highlightJsLoaded || typeof hljs === 'undefined') {
            // 如果 Highlight.js 还未加载，等待加载完成事件
            console.log('Waiting for Highlight.js to load...');

            // 监听加载完成事件
            const onLoaded = () => {
                document.removeEventListener('highlightjs-loaded', onLoaded);
                this.ensureHighlightingApplied(maxRetries);
            };
            document.addEventListener('highlightjs-loaded', onLoaded);

            // 同时设置超时重试
            if (maxRetries > 0) {
                setTimeout(() => {
                    document.removeEventListener('highlightjs-loaded', onLoaded);
                    this.ensureHighlightingApplied(maxRetries - 1);
                }, 200);
            }
            return;
        }

        // highlight.js 已加载，应用高亮
        this.applyHighlighting();

        // 检查是否成功应用高亮
        const highlightedBlocks = document.querySelectorAll('div.highlight pre.hljs');
        console.log('Highlighting applied to', highlightedBlocks.length, 'code blocks');

        // 如果没有代码块被高亮，可能是代码块还未被渲染，稍后重试
        const totalCodeBlocks = document.querySelectorAll('div.highlight pre').length;
        if (highlightedBlocks.length < totalCodeBlocks && maxRetries > 0) {
            console.log('Not all blocks highlighted, retrying...');
            setTimeout(() => {
                this.ensureHighlightingApplied(maxRetries - 1);
            }, 200);
        }
    }

    reapplyHighlighting() {
        if (!this.highlightJsLoaded || typeof hljs === 'undefined') {
            return;
        }

        document.querySelectorAll('div.highlight pre').forEach((block) => {
            if (block.classList.contains('hljs')) {
                // Clear Pygments-generated markup and get pure text
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
}

// Theme management (Dark/Light mode)
class ThemeManager {
    constructor(syntaxHighlighter) {
        this.syntaxHighlighter = syntaxHighlighter;
        this.isDark = localStorage.getItem('theme') === 'dark';
        this.init();
    }

    init() {
        this.applyTheme();
        this.createToggleButton();
    }

    applyTheme() {
        if (this.isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        if (this.syntaxHighlighter) {
            setTimeout(() => {
                this.syntaxHighlighter.reapplyHighlighting();
            }, 100);
        }
    }

    toggle() {
        this.isDark = !this.isDark;
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
        this.applyTheme();
        this.updateButtonText();
    }

    createToggleButton() {
        const navSide = document.querySelector('.wy-nav-side');
        if (!navSide) return;

        // Create container for buttons in sidebar
        let sidebarControls = document.querySelector('.sidebar-controls');
        if (!sidebarControls) {
            sidebarControls = document.createElement('div');
            sidebarControls.className = 'sidebar-controls';
            navSide.appendChild(sidebarControls);
        }

        const toggleDiv = document.createElement('div');
        toggleDiv.className = 'theme-toggle';
        
        const button = document.createElement('button');
        button.id = 'theme-toggle-btn';
        this.updateButtonText(button);
        
        button.addEventListener('click', () => this.toggle());
        
        toggleDiv.appendChild(button);
        sidebarControls.appendChild(toggleDiv);
    }

    updateButtonText(button) {
        const btn = button || document.getElementById('theme-toggle-btn');
        if (btn) {
            btn.textContent = this.isDark ? '☀️ Day Mode' : '🌙 Night Mode';
        }
    }
}

// Language switcher logic
class LanguageSwitcher {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.init();
    }

    detectLanguage() {
        const path = window.location.pathname;
        if (path.includes('/html-en/') || path.includes('/en/') || path.includes('index_en.html')) {
            return 'en';
        }
        return 'zh';
    }

    init() {
        this.createSwitcher();
        this.persistPreference();
    }

    persistPreference() {
        localStorage.setItem('preferred_lang', this.currentLang);
    }

    createSwitcher() {
        const sideNavSearch = document.querySelector('.wy-side-nav-search');
        if (!sideNavSearch) return;

        const switcherDiv = document.createElement('div');
        switcherDiv.className = 'language-switcher-sidebar';

        const label = document.createElement('label');
        label.textContent = this.currentLang === 'zh' ? '切换语言 / Language' : 'Language / 语言';

        const select = document.createElement('select');
        select.id = 'language-select';

        const optionZh = document.createElement('option');
        optionZh.value = 'zh';
        optionZh.textContent = '简体中文';
        optionZh.selected = this.currentLang === 'zh';

        const optionEn = document.createElement('option');
        optionEn.value = 'en';
        optionEn.textContent = 'English';
        optionEn.selected = this.currentLang === 'en';

        select.appendChild(optionZh);
        select.appendChild(optionEn);

        select.addEventListener('change', (e) => this.switchLanguage(e.target.value));

        switcherDiv.appendChild(label);
        switcherDiv.appendChild(select);

        // Insert after the search box or home link
        sideNavSearch.appendChild(switcherDiv);
    }

    switchLanguage(lang) {
        if (lang === this.currentLang) return;

        const currentPath = window.location.pathname;
        const segments = currentPath.split('/').filter(s => s);
        
        const isEn = lang === 'en';
        const targetBuildDir = isEn ? 'html-en' : 'html-zh';
        const targetContentDir = isEn ? 'en' : 'zh_CN';
        const targetIndexPage = isEn ? 'index_en.html' : 'index.html';
        const oldIndexPage = isEn ? 'index.html' : 'index_en.html';

        let newPath = '';

        if (currentPath.includes('html-zh') || currentPath.includes('html-en')) {
            // Mode 1: Absolute path from build root
            newPath = currentPath.replace(/html-zh|html-en/g, targetBuildDir);
            newPath = newPath.replace(/\/zh_CN\/|\/en\//g, `/${targetContentDir}/`);
            newPath = newPath.replace(oldIndexPage, targetIndexPage);
        } else {
            // Mode 2: Relative path from current serving root
            const currentPage = segments.length > 0 ? segments[segments.length - 1] : '';
            const inSubDir = segments.length > 1 || (segments.length === 1 && !segments[0].endsWith('.html'));
            
            let upToParent = '../'; // Base up to get out of current build dir
            if (inSubDir) {
                upToParent += '../'; // One more up to get out of content dir (zh_CN/ or en/)
            }
            
            newPath = upToParent + targetBuildDir + '/';
            if (inSubDir) {
                newPath += targetContentDir + '/';
                newPath += currentPage ? currentPage.replace(oldIndexPage, targetIndexPage) : targetIndexPage;
            } else {
                newPath += currentPage ? currentPage.replace(oldIndexPage, targetIndexPage) : targetIndexPage;
            }
        }
        
        // Final fallback to ensure the index page is correct for the language
        if (isEn && newPath.endsWith('index.html')) {
            newPath = newPath.replace('index.html', 'index_en.html');
        } else if (!isEn && newPath.endsWith('index_en.html')) {
            newPath = newPath.replace('index_en.html', 'index.html');
        }

        localStorage.setItem('preferred_lang', lang);
        window.location.href = newPath;
    }
}

// Button Component - Base class for all buttons
class ButtonComponent {
    constructor(options = {}) {
        this.options = {
            className: '',
            title: '',
            icon: '',
            ...options
        };
        this.button = null;
    }

    create() {
        const btn = document.createElement('button');
        btn.className = this.options.className;
        btn.title = this.options.title;
        btn.innerHTML = this.options.icon;
        btn.setAttribute('type', 'button');
        this.button = btn;
        this.attachEvents();
        return btn;
    }

    attachEvents() {
        this.button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleClick();
        });
    }

    handleClick() {
    }
}

// Edit Button Component
class CodeBlockEditButton extends ButtonComponent {
    constructor(codeBlock) {
        super({
            className: 'edit-btn',
            title: 'Edit Code',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>'
        });
        this.codeBlock = codeBlock;
    }

    handleClick() {
        console.log('Edit button clicked for code block');
    }
}

// Copy Button Component
class CodeBlockCopyButton extends ButtonComponent {
    constructor(codeBlock) {
        super({
            className: 'copy-btn',
            title: 'Copy Code',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>'
        });
        this.codeBlock = codeBlock;
        this.originalIcon = this.options.icon;
    }

    handleClick() {
        this.copyCode();
    }

    copyCode() {
        const pre = this.codeBlock.querySelector('pre');
        if (!pre) return;
        
        let code = '';
        if (pre.classList.contains('line-numbers')) {
            const lines = pre.querySelectorAll('.line');
            if (lines.length > 0) {
                code = Array.from(lines).map(line => line.textContent).join('\n');
            } else {
                code = pre.textContent;
            }
        } else {
            code = pre.textContent;
        }
        
        navigator.clipboard.writeText(code).then(() => {
            this.button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            this.button.classList.add('copied');
            setTimeout(() => {
                this.button.innerHTML = this.originalIcon;
                this.button.classList.remove('copied');
            }, 2000);
        });
    }
}

// Header Component - Top reserved line for copy button
class CodeBlockHeader {
    constructor(codeBlock) {
        this.codeBlock = codeBlock;
        this.copyButton = null;
    }

    create() {
        const headerDiv = document.createElement('div');
        headerDiv.className = 'code-block-header';

        this.copyButton = new CodeBlockCopyButton(this.codeBlock);
        headerDiv.appendChild(this.copyButton.create());

        return headerDiv;
    }
}

// Controls Component - Contains mac dots and language only
class CodeBlockControls {
    constructor(codeBlock, outerBlock) {
        this.codeBlock = codeBlock;
        this.outerBlock = outerBlock;
    }

    create() {
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'code-block-controls';
        
        const dotsDiv = document.createElement('div');
        dotsDiv.className = 'mac-dots';
        dotsDiv.innerHTML = '<span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>';
        controlsDiv.appendChild(dotsDiv);

        const langSpan = document.createElement('span');
        langSpan.className = 'code-lang';
        
        // 从内层代码块的data属性获取语言类型
        const lang = this.codeBlock.dataset.language || 'CODE';
        langSpan.textContent = lang.toUpperCase();
        
        controlsDiv.appendChild(langSpan);
        
        return controlsDiv;
    }
}

// Wrapper Component - Orchestrates header, controls, and code block
class CodeBlockWrapper {
    constructor(codeBlock, outerBlock) {
        this.codeBlock = codeBlock;
        this.outerBlock = outerBlock;
        this.wrapper = null;
        this.header = null;
        this.controls = null;
    }

    create() {
        console.log('Creating wrapper for code block');
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'code-block-wrapper';

        this.codeBlock.parentNode.insertBefore(this.wrapper, this.codeBlock);

        this.header = new CodeBlockHeader(this.codeBlock);
        this.wrapper.appendChild(this.header.create());

        this.controls = new CodeBlockControls(this.codeBlock, this.outerBlock);
        this.wrapper.appendChild(this.controls.create());

        this.wrapper.appendChild(this.codeBlock);

        console.log('Wrapper created successfully');
        return this.wrapper;
    }
}

// Code Block Line Numbers Component
class CodeBlockLineNumbers {
    constructor(codeBlock) {
        this.codeBlock = codeBlock;
    }

    toggle() {
        const pre = this.codeBlock.querySelector('pre');
        if (!pre) return;

        if (pre.classList.contains('line-numbers')) {
            pre.classList.remove('line-numbers');
            if (pre.dataset.originalHtml) {
                pre.innerHTML = pre.dataset.originalHtml;
            }
        } else {
            if (!pre.dataset.originalHtml) {
                pre.dataset.originalHtml = pre.innerHTML;
            }
            pre.classList.add('line-numbers');
            const code = pre.textContent;
            const lines = code.split('\n');
            pre.innerHTML = '';
            lines.forEach((lineText, index) => {
                if (index === lines.length - 1 && lineText === '') return;
                const span = document.createElement('span');
                span.className = 'line';
                span.textContent = lineText;
                pre.appendChild(span);
                pre.appendChild(document.createTextNode('\n'));
            });
        }
    }
}

// Code Block Manager - Orchestrates all components
class CodeBlockManager {
    constructor() {
        this.wrappers = new Map();
        this.init();
    }

    init() {
        // Run immediately instead of waiting for DOMContentLoaded
        // This is called after DOM is ready in the main initialization
        this.enhanceCodeBlocks();
    }

    enhanceCodeBlocks() {
        console.log('Enhancing code blocks...');
        // 选择 Sphinx 生成的代码块的最外层容器
        const codeBlocks = document.querySelectorAll('div[class*="highlight-"]');
        console.log('Found', codeBlocks.length, 'code blocks to enhance');
        
        codeBlocks.forEach((outerBlock, index) => {
            if (outerBlock.dataset.enhanced) {
                console.log('Code block', index, 'already enhanced, skipping');
                return;
            }
            
            // 查找内层的 div.highlight（实际的代码块容器）
            const innerHighlight = outerBlock.querySelector('div.highlight');
            if (!innerHighlight) {
                console.log('Code block', index, 'has no inner highlight div, skipping');
                outerBlock.dataset.enhanced = 'true';
                return;
            }
            
            console.log('Enhancing code block', index);
            
            // 从外层容器获取语言类型
            const langClass = Array.from(outerBlock.classList).find(cls => cls.startsWith('highlight-'));
            if (langClass) {
                innerHighlight.dataset.language = langClass.replace('highlight-', '');
            }
            
            const wrapper = new CodeBlockWrapper(innerHighlight, outerBlock);
            wrapper.create();
            
            this.wrappers.set(innerHighlight, wrapper);
            outerBlock.dataset.enhanced = 'true';
        });
        
        console.log('Code block enhancement complete');
    }
}


// Initialization
function initializeFeatures() {
    const syntaxHighlighter = new SyntaxHighlighter();
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeAfterDOMReady(syntaxHighlighter);
        });
    } else {
        initializeAfterDOMReady(syntaxHighlighter);
    }
}

function initializeAfterDOMReady(syntaxHighlighter) {
    // First, create CodeBlockManager and wrap all code blocks
    const codeBlockManager = new CodeBlockManager();

    // 初始化其他组件（主题管理器、语言切换器）
    const themeManager = new ThemeManager(syntaxHighlighter);
    new LanguageSwitcher();

    // 使用 requestAnimationFrame 确保 DOM 完全渲染后再应用高亮
    // 这比 setTimeout 更可靠，因为它在浏览器绘制之前执行
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // 双重 RAF 确保代码块已经完全渲染
            syntaxHighlighter.ensureHighlightingApplied();
        });
    });
}

initializeFeatures();
