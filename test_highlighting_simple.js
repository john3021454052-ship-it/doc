// Simple test to verify syntax highlighting
console.log('Starting syntax highlighting test...');

// Mock the DOM structure that Sphinx generates
const testContainer = document.createElement('div');
testContainer.innerHTML = `
    <div class="highlight-python notranslate">
        <div class="highlight">
            <pre><span></span><span class="kn">def</span><span class="w"> </span><span class="nf">hello</span><span class="p">():</span>
    <span class="nb">print</span><span class="p">(</span><span class="s1">'Hello World'</span><span class="p">)</span>
</pre></div>
    </div>
`;

document.body.appendChild(testContainer);

// Load Highlight.js
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
script.onload = () => {
    console.log('Highlight.js loaded');
    
    // Test the syntax highlighter logic
    const block = document.querySelector('div.highlight pre');
    console.log('Found code block:', block);
    
    if (block) {
        // Clear Pygments markup
        const plainText = block.textContent;
        block.textContent = plainText;
        
        // Add language class
        block.classList.add('language-python');
        
        // Apply highlighting
        hljs.highlightElement(block);
        
        console.log('Highlighting applied. Block classes:', block.classList);
        console.log('Has hljs class:', block.classList.contains('hljs'));
    }
};

document.head.appendChild(script);