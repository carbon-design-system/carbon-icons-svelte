import { template } from '../template';

test('icon matches the snapshot', () => {
  const icon = template({
    attrs: {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 32 32',
      width: 32,
      height: 32
    },
    content: [
      {
        elem: 'path',
        attrs: {
          d:
            'M8 9H4a2 2 0 0 0-2 2V23H4V18H8v5h2V11A2 2 0 0 0 8 9zM4 16V11H8v5zM22 11L25 11 25 21 22 21 22 23 30 23 30 21 27 21 27 11 30 11 30 9 22 9 22 11zM14 23H12V9h6a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H14zm0-7h4V11H14z'
        }
      }
    ],
    moduleName: 'Add32'
  });
  expect(icon).toMatchSnapshot();
});
