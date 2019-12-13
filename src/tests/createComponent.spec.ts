import * as icons from '@carbon/icons';
import { createComponent } from '../createComponent';

test('icon matches the snapshot', () => {
  const icon = createComponent(icons.ArrowLeft16);
  expect(icon).toMatchSnapshot();
});
