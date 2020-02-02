import 'react-native';
import MockGraphQLClient from '../graphql/MockGraphQLClient';
import {fireEvent, render, RenderAPI} from 'react-native-testing-library';
import {LoginScreen} from '../../src/auth/login/LoginScreen';
import React from 'react';

describe('Login Screen', () => {

    let renderApi: RenderAPI;

    beforeEach(() => {
        MockGraphQLClient.mock();
        renderApi = render(<LoginScreen/>);
    });

    afterEach(() => {
        MockGraphQLClient.reset();
    });

    function writeUsername(username = 'username') {
        fireEvent.changeText(renderApi.getByTestId('username'), username);
    }

    function writePassword(password = 'password') {
        fireEvent.changeText(renderApi.getByTestId('password'), password);
    }

    describe('Validations', () => {

        function assertLoginButtonEnabled(enabled: boolean): void{
            const loginButton = renderApi.getByTestId('login');
            expect(loginButton.props.disabled).toBe(!enabled);
        }

        it('login should be disabled when no username and no password', () => {
           assertLoginButtonEnabled(false);
        });

        it('login should be disabled when username but no password', () => {
            writeUsername();

            assertLoginButtonEnabled(false);
        });

        it('login should be disabled when password but no username', () => {
            writePassword();

            assertLoginButtonEnabled(false);
        });

        it('login should be enabled when username and password', () => {
            writeUsername();
            writePassword();

            assertLoginButtonEnabled(true);
        });
    });

});
