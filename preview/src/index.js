(() => {
  const root = document.getElementById('root');
  const code = document.getElementById('code');

  let activeIcon = null;

  function highlightIcon(node, moduleName) {
    if (activeIcon != null) {
      activeIcon.style.fill = '#161616';
    }

    activeIcon = node;

    node.style.fill = '#0f62fe';
    code.innerHTML = `&lt;script&gt;
  import ${moduleName} from "carbon-icons-svelte/lib/${moduleName}";
&lt;/script&gt;

&lt;${moduleName} /&gt;
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
