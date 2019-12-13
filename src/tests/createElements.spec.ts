import { createElements } from '../createElements';

it('returns the correct result', () => {
  const result = createElements([
    { elem: 'path', attrs: { d: 'd' } },
    { elem: 'circle', attrs: { cx: 'cx', cy: 'cy', r: 'r' } },
    {
      elem: 'rect',
      attrs: { width: 'width', height: 'height', x: 'x', y: 'y', rx: 'rx' }
    }
  ]);

  expect(result).toEqual(
    "<path d='d'></path><circle cx='cx' cy='cy' r='r'></circle><rect width='width' height='height' x='x' y='y' rx='rx'></rect>"
  );
});
