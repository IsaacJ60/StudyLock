import * as React from 'react';
import renderer from 'react-test-renderer';

import { ThemedText } from '../ThemedText';

it('renders ThemedText correctly (AAA pattern)', () => {
  // Arrange: Prepare the component with props
  const children = 'Snapshot test!';

  // Act: Render the component
  const tree = renderer.create(<ThemedText>{children}</ThemedText>).toJSON();

  // Assert: Check the snapshot
  expect(tree).toMatchSnapshot();
});
