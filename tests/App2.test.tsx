/**
 * @format
 */

import 'react-native';
//import React from 'react';
/*import {fireEvent, render} from 'react-native-testing-library';
// Note: test renderer must be required after react-native.
import ApolloClient from 'apollo-boost';
import fetch from 'isomorphic-fetch';
import {GRAPHQL_DI} from '../src/graphql/GraphQLClient';
import container from '../src/di/Container';
import {LoginScreen} from '../src/auth/login/LoginScreen';

const createTestProps = (props?: object) => ({
    ...props,
});*/

describe('App', () => {

    it('pass', () => {

    });

   /* beforeEach(() => {
        const GRAPHQL_URL = 'http://192.168.0.11dsad:3000/graphql';

        const client = new ApolloClient({
            uri: GRAPHQL_URL,
            fetch: fetch,
        });

        //const _oldClient = container.get<GraphQLClient>(GRAPHQL_DI);
        container.rebind(GRAPHQL_DI).toConstantValue(client);
    });


    const props = createTestProps();

    it('should render a welcome', async () => {
        const {getByTestId} = render(<LoginScreen {...props} />);

        fireEvent.changeText(getByTestId('username'), 'username');
        fireEvent.changeText(getByTestId('password'), 'username');
        await fireEvent.press(getByTestId('login'));
    });*/
});


