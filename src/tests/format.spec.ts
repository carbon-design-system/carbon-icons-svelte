import { formatName } from '../format';

it('formats the icon name correctly', () => {
  expect(formatName({ name: 'caret--up', size: undefined })).toEqual(null);
  expect(formatName({ name: 'zoom--pan', size: 16 })).toEqual('ZoomPan16');
  expect(formatName({ name: '3DICa', size: 16 })).toEqual(
    'WatsonHealth3DICa16'
  );
  expect(formatName({ name: 'angle', size: 16 })).toEqual(
    'WatsonHealthAngle16'
  );
  expect(formatName({ name: '4K', size: 16 })).toEqual('_4K16');
});
