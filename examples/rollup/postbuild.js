const fs = require('fs');
const posthtml = require('posthtml');
const { hash } = require('posthtml-hash');
const htmlnano = require('htmlnano');

const plugins = [
  /**
   * Hashes `bundle.css` and `bundle.js` in `build/`
   */
  hash({ path: 'build' }),

  /**
   * Minifies `build/index.html`
   */
  htmlnano()
];

const html = fs.readFileSync('build/index.html');

posthtml(plugins)
  .process(html)
  .then(result => fs.writeFileSync('build/index.html', result.html));
