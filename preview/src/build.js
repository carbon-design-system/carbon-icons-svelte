import * as icons from '@carbon/icons';
import { formatAttributes, getAttributes, toString } from '@carbon/icon-helpers';

const attributes = getAttributes();

function createIcon(icon, key) {
  return {
    element: `<div class="icon"><svg data-module-name="${key}" ${formatAttributes(
      icon.attrs
    )} preserveAspectRatio="${attributes.preserveAspectRatio}">${icon.content
      .map(element => toString(element))
      .join('')}</svg></div>`
  };
}

export function build(limit) {
  const list = [];

  Object.keys(icons)
    .filter(
      iconKey =>
        ![
          'ChevronDownGlyph',
          'ChevronLeftGlyph',
          'ChevronRightGlyph',
          'ChevronUpGlyph',
          'CaretDownGlyph',
          'CaretLeftGlyph',
          'CaretRightGlyph',
          'CaretUpGlyph'
        ].includes(iconKey)
    )
    .forEach((iconKey, i) => {
      if (i < limit) {
        const icon = createIcon(icons[iconKey], iconKey);

        if (i % 4 === 0) {
          list.push(
            '<div class="icon--row">',
            `<div class="icon--name">
            <div class="icon--technical-name">${icons[iconKey].name}</div>
            <div class="icon--module-name">${iconKey.slice(0, -2)}XX</div>
          </div>`,
            '<div class="icon--elements">'
          );
        }

        list.push(icon.element);

        if (i % 4 === 3) {
          list.push('</div>', '</div>');
        }
      }
    });

  return list.join('');
}
