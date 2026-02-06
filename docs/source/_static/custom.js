// Theme management
class ThemeManager {
    constructor() {
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

        const toggleDiv = document.createElement('div');
        toggleDiv.className = 'theme-toggle';
        
        const button = document.createElement('button');
        button.id = 'theme-toggle-btn';
        this.updateButtonText(button);
        
        button.addEventListener('click', () => this.toggle());
        
        toggleDiv.appendChild(button);
        navSide.appendChild(toggleDiv);
    }

    updateButtonText(button) {
        const btn = button || document.getElementById('theme-toggle-btn');
        if (btn) {
            btn.textContent = this.isDark ? '☀️ 白天模式 / Day Mode' : '🌙 夜间模式 / Night Mode';
        }
    }
}

// Language switcher
class LanguageSwitcher {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.init();
    }

    detectLanguage() {
        const path = window.location.pathname;
        // Check if we're in the English build or English content path
        if (path.includes('/html-en/') || path.includes('/en/') || path.includes('index_en.html')) {
            return 'en';
        }
        return 'zh';
    }

    init() {
        this.createSwitcher();
    }

    createSwitcher() {
        const navContent = document.querySelector('.wy-nav-content');
        if (!navContent) return;

        const switcherDiv = document.createElement('div');
        switcherDiv.className = 'language-switcher';

        const select = document.createElement('select');
        select.id = 'language-select';

        const optionZh = document.createElement('option');
        optionZh.value = 'zh';
        optionZh.textContent = '中文';

        const optionEn = document.createElement('option');
        optionEn.value = 'en';
        optionEn.textContent = 'English';

        select.appendChild(optionZh);
        select.appendChild(optionEn);
        select.value = this.currentLang;

        select.addEventListener('change', (e) => this.switchLanguage(e.target.value));

        switcherDiv.appendChild(select);
        navContent.insertBefore(switcherDiv, navContent.firstChild);
    }

    switchLanguage(lang) {
        const currentPath = window.location.pathname;
        const hasHtmlEn = currentPath.includes('/html-en/');
        const hasHtmlZh = currentPath.includes('/html-zh/');
        let newPath = currentPath;

        if (lang === 'zh') {
            // Switch to Chinese (html-zh directory)
            if (hasHtmlEn) {
                newPath = newPath.replace('/html-en/', '/html-zh/');
            } else if (!hasHtmlZh && this.currentLang === 'en') {
                newPath = `/html-zh${newPath.startsWith('/') ? '' : '/'}${newPath}`;
            }
            newPath = newPath.replace('index_en.html', 'index.html');
            // Also replace /en/ with /zh_CN/ in the path
            newPath = newPath.replace(/\/en\//, '/zh_CN/');
        } else {
            // Switch to English (html-en directory)
            if (hasHtmlZh) {
                newPath = newPath.replace('/html-zh/', '/html-en/');
            } else if (!hasHtmlEn && this.currentLang === 'zh') {
                newPath = `/html-en${newPath.startsWith('/') ? '' : '/'}${newPath}`;
            }
            newPath = newPath.replace('index.html', 'index_en.html');
            // Also replace /zh_CN/ with /en/ in the path
            newPath = newPath.replace(/\/zh_CN\//, '/en/');
        }

        // If the path hasn't changed, we're likely already on the correct language version
        if (newPath === currentPath) {
            return;
        }

        window.location.href = newPath;
    }
}

// Code block enhancements
class CodeBlockEnhancer {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.enhanceCodeBlocks();
        });
    }

    enhanceCodeBlocks() {
        const codeBlocks = document.querySelectorAll('.highlight');
        
        codeBlocks.forEach((block, index) => {
            if (block.querySelector('.code-block-controls')) return;
            
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            
            block.parentNode.insertBefore(wrapper, block);
            wrapper.appendChild(block);
            
            const controls = this.createControls(block, index);
            wrapper.insertBefore(controls, block);
        });
    }

    createControls(codeBlock, index) {
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'code-block-controls';
        
        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.className = 'copy-btn';
        copyBtn.addEventListener('click', () => this.copyCode(codeBlock, copyBtn));
        
        // Line numbers button
        const lineBtn = document.createElement('button');
        lineBtn.textContent = 'Line';
        lineBtn.className = 'line-btn';
        lineBtn.addEventListener('click', () => this.toggleLineNumbers(codeBlock, lineBtn));
        
        controlsDiv.appendChild(copyBtn);
        controlsDiv.appendChild(lineBtn);
        
        return controlsDiv;
    }

    copyCode(codeBlock, button) {
        const pre = codeBlock.querySelector('pre');
        if (!pre) return;

        const code = pre.textContent;
        
        navigator.clipboard.writeText(code).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            button.textContent = 'Failed';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        });
    }

    toggleLineNumbers(codeBlock, button) {
        const pre = codeBlock.querySelector('pre');
        if (!pre) return;

        if (pre.classList.contains('line-numbers')) {
            // Remove line numbers
            pre.classList.remove('line-numbers');
            const lines = pre.querySelectorAll('.line');
            lines.forEach(line => {
                const span = line;
                span.outerHTML = span.innerHTML;
            });
        } else {
            // Add line numbers
            pre.classList.add('line-numbers');
            const code = pre.innerHTML;
            const lines = code.split('\n');
            
            const wrappedLines = lines.map(line => {
                return `<span class="line">${line}</span>`;
            }).join('\n');
            
            pre.innerHTML = wrappedLines;
        }
    }
}

// Initialize all features when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFeatures);
} else {
    initializeFeatures();
}

function initializeFeatures() {
    new ThemeManager();
    new LanguageSwitcher();
    new CodeBlockEnhancer();
}
