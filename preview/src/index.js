(() => {
  const root = document.getElementById('root');
  const code = document.getElementById('code');

  let activeIcon = null;

  function highlightIcon(node, moduleName) {
    if (activeIcon != null) {
      activeIcon.parentNode.classList.remove('active');
    }

    activeIcon = node;
    activeIcon.parentNode.classList.add('active');

    code.innerHTML = `<span style="color: #0f62fe">&lt;script&gt;</span>
  <span style="color: #a56eff">import</span> <span style="color: #002d9c;">${moduleName}</span> <span style="color: #a56eff">from</span> <span style="color: #002d9c;">"carbon-icons-svelte/lib/${moduleName}"</span>;
<span style="color: #0f62fe">&lt;/script&gt;</span>

<span style="color: #0f62fe">&lt;${moduleName} /&gt;</span>
`;
  }

  function handleClick(e) {
    const tagName = e.target.tagName;

    if (tagName === 'svg' || tagName === 'path') {
      const node = tagName === 'path' ? e.target.parentNode : e.target;
      const moduleName = node.getAttribute('data-module-name');
      highlightIcon(node, moduleName);
    }
  }

  document.body.addEventListener('click', handleClick);

  highlightIcon(document.querySelector('[data-module-name="Account32"]'), 'Account32');
})();
