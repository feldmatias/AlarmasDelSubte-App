/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import {render} from 'react-native-testing-library';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<App />);
});

const createTestProps = (props?: object) => ({
  ...props,
});

describe('App', () => {
  const props = createTestProps();
  const {getByText} = render(<App {...props} />);

  it('should render a welcome', () => {
    expect(getByText(/welcome/i)).toBeDefined();
  });
});
