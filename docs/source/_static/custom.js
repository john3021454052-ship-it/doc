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
        this.currentBuildDir = this.detectBuildDir();
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    detectLanguage() {
        const path = window.location.pathname;
        if (path.includes('/html-en/') || path.includes('/en/') || path.includes('index_en.html')) {
            return 'en';
        }
        return 'zh';
    }

    detectBuildDir() {
        const path = window.location.pathname;
        if (path.includes('/html-en/')) {
            return 'html-en';
        }
        if (path.includes('/html-zh/')) {
            return 'html-zh';
        }
        return null;
    }

    getCurrentPage() {
        const path = window.location.pathname;
        // Extract just the filename or the last part of the path
        const segments = path.split('/').filter(s => s);
        if (segments.length === 0) {
            return 'index.html';
        }
        const lastSegment = segments[segments.length - 1];
        if (lastSegment.endsWith('.html')) {
            return lastSegment;
        }
        return 'index.html';
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

        // Detect if we're serving from parent build directory or from within a language directory
        const servingFromBuildDir = currentPath.includes('/html-zh/') || currentPath.includes('/html-en/');

        if (servingFromBuildDir) {
            // Serving from parent build directory (e.g., /build/)
            // Paths look like: /html-zh/index.html or /html-en/index_en.html
            if (lang === 'zh') {
                // Switch from English to Chinese
                newPath = currentPath.replace(/\/html-en\//g, '/html-zh/');
                newPath = newPath.replace('index_en.html', 'index.html');
                // If we're in a subpage, maintain the same page name
                if (newPath.includes('/en/')) {
                    newPath = newPath.replace(/\/en\//g, '/zh_CN/');
                }
            } else {
                // Switch from Chinese to English
                newPath = currentPath.replace(/\/html-zh\//g, '/html-en/');
                newPath = newPath.replace('index.html', 'index_en.html');
                // If we're in a subpage, maintain the same page name
                if (newPath.includes('/zh_CN/')) {
                    newPath = newPath.replace(/\/zh_CN\//g, '/en/');
                }
            }
        } else {
            // Serving from a single build directory (e.g., build/html or build/html-zh)
            // Paths look like: /index.html or /zh_CN/introduction.html
            if (lang === 'zh') {
                // Switch from English to Chinese
                newPath = currentPath.replace(/\/en\//g, '/zh_CN/');
                newPath = newPath.replace('index_en.html', 'index.html');
            } else {
                // Switch from Chinese to English
                newPath = currentPath.replace(/\/zh_CN\//g, '/en/');
                if (newPath === '/index.html' || newPath.endsWith('/index.html')) {
                    newPath = newPath.replace('index.html', 'index_en.html');
                }
            }
        }

        // Handle edge case: if path ends with /, append the appropriate index
        if (newPath.endsWith('/')) {
            newPath += lang === 'zh' ? 'index.html' : 'index_en.html';
        }

        localStorage.setItem('preferred_lang', lang);
        window.location.href = newPath;
    }

    getBuildPrefix(lang) {
        const currentPath = window.location.pathname;
        // Find how many directories we are deep from the build directory
        const depth = currentPath.split('/').length - (currentPath.includes('/html-') ? 4 : 2);
        const prefix = '../'.repeat(Math.max(0, depth));
        const buildDir = lang === 'zh' ? 'html-zh/' : 'html-en/';
        return prefix + buildDir;
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
