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
                const text = line.textContent;
                line.replaceWith(document.createTextNode(text + '\n'));
            });
            // This is a bit of a hack, might need better logic to perfectly restore
            location.reload(); 
        } else {
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
