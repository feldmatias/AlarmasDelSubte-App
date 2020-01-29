/**
 * @format
 */

import 'react-native';
import React from 'react';
import {render} from 'react-native-testing-library';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import HelloWorldApp from '../src/component';

it('renders correctly', () => {
    renderer.create(<HelloWorldApp/>);
});

const createTestProps = (props?: object) => ({
    ...props,
});

describe('App', () => {
    const props = createTestProps();
    const {getByText} = render(<HelloWorldApp {...props} />);

    it('should render a welcome', () => {
        expect(getByText(/welcome/i)).toBeDefined();
    });
});
