import { CarbonIconContent } from './createComponent';

function createElements(content: CarbonIconContent) {
  const elements: string[] = [];

  content.forEach(item => {
    switch (item.elem) {
      case 'path':
        elements.push(`<path d='${item.attrs.d}'></path>`);
        break;
      case 'circle':
        elements.push(
          `<circle cx='${item.attrs.cx}' cy='${item.attrs.cy}' r='${item.attrs.r}'></circle>`
        );
        break;
      case 'rect':
        elements.push(
          `<rect width='${item.attrs.width}' height='${item.attrs.height}' x='${item.attrs.x}' y='${item.attrs.y}' rx='${item.attrs.rx}'></rect>`
        );
        break;
    }
  });

  return elements.join('');
}

export { createElements };
