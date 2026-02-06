/**
 * Theme and Language Management for Sphinx RTD Theme
 */

// Theme management (Dark/Light mode)
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
        let newPath = currentPath;

        if (lang === 'zh') {
            // Switch from English to Chinese
            if (newPath.includes('/html-en/')) {
                newPath = newPath.replace('/html-en/', '/html-zh/');
            }
            if (newPath.includes('/en/')) {
                newPath = newPath.replace('/en/', '/zh_CN/');
            }
            if (newPath.includes('index_en.html')) {
                newPath = newPath.replace('index_en.html', 'index.html');
            }
        } else {
            // Switch from Chinese to English
            if (newPath.includes('/html-zh/')) {
                newPath = newPath.replace('/html-zh/', '/html-en/');
            }
            if (newPath.includes('/zh_CN/')) {
                newPath = newPath.replace('/zh_CN/', '/en/');
            }
            if (newPath.includes('index.html')) {
                newPath = newPath.replace('index.html', 'index_en.html');
            } else if (newPath.endsWith('/')) {
                newPath += 'index_en.html';
            }
        }

        // Final fallback: if newPath is still the same, we might need a more aggressive replacement
        if (newPath === currentPath) {
            if (lang === 'en') {
                newPath = 'index_en.html';
            } else {
                newPath = 'index.html';
            }
        }

        localStorage.setItem('preferred_lang', lang);
        window.location.href = newPath;
    }
}

// Code block enhancements (Copy & Line Numbers)
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
        
        codeBlocks.forEach((block) => {
            if (block.querySelector('.code-block-controls')) return;
            
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            
            block.parentNode.insertBefore(wrapper, block);
            wrapper.appendChild(block);
            
            const controls = this.createControls(block);
            wrapper.insertBefore(controls, block);
        });
    }

    createControls(codeBlock) {
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'code-block-controls';
        
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.className = 'copy-btn';
        copyBtn.addEventListener('click', () => this.copyCode(codeBlock, copyBtn));
        
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
        });
    }

    toggleLineNumbers(codeBlock, button) {
        const pre = codeBlock.querySelector('pre');
        if (!pre) return;

        if (pre.classList.contains('line-numbers')) {
            pre.classList.remove('line-numbers');
            const lines = pre.querySelectorAll('.line');
            lines.forEach(line => {
                const span = line;
                span.outerHTML = span.innerHTML;
            });
        } else {
            pre.classList.add('line-numbers');
            const code = pre.innerHTML;
            const lines = code.split('\n');
            const wrappedLines = lines.map(line => `<span class="line">${line}</span>`).join('\n');
            pre.innerHTML = wrappedLines;
        }
    }
}

// Initialization
function initializeFeatures() {
    new ThemeManager();
    new LanguageSwitcher();
    new CodeBlockEnhancer();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFeatures);
} else {
    initializeFeatures();
}
