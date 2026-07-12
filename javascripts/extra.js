document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.md-clipboard').forEach(button => {
    const originalTitle = button.title;
    button.addEventListener('click', () => {
      button.title = 'Copied!';
      setTimeout(() => {
        button.title = originalTitle;
      }, 1500);
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
          history.pushState(null, '', targetId);
        }
      }
    });
  });

  // AFM syntax highlighting for code blocks in demo containers
  if (typeof hljs !== 'undefined') {
    document.querySelectorAll('.demo-code-content .highlight code').forEach(block => {
      const text = block.textContent;
      // Check if it looks like AFM (starts with YAML frontmatter)
      if (text.trimStart().startsWith('---')) {
        // Find the closing --- of frontmatter
        const lines = text.split('\n');
        let frontmatterEnd = -1;
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === '---') {
            frontmatterEnd = i;
            break;
          }
        }

        if (frontmatterEnd > 0) {
          const frontmatterLines = lines.slice(0, frontmatterEnd + 1);
          const bodyLines = lines.slice(frontmatterEnd + 1);

          const frontmatterText = frontmatterLines.join('\n');
          const bodyText = bodyLines.join('\n');

          const yamlHighlighted = hljs.highlight(frontmatterText, { language: 'yaml' }).value;
          const mdHighlighted = hljs.highlight(bodyText, { language: 'markdown' }).value;

          block.innerHTML = yamlHighlighted + mdHighlighted;
          block.classList.add('hljs');
        }
      }
    });
  }
});
