import 'react-native';
import MockGraphQLClient from '../../graphql/MockGraphQLClient';
import {fireEvent, render, RenderAPI} from 'react-native-testing-library';
import React from 'react';
import {SignUpScreen} from '../../../src/auth/signup/SignUpScreen';

describe('SignUp Screen', () => {

    let renderApi: RenderAPI;

    beforeEach(() => {
        MockGraphQLClient.mock();
        renderApi = render(<SignUpScreen/>);
    });

    afterEach(() => {
        MockGraphQLClient.reset();
    });

    function writeUsername(username = 'username'): void {
        fireEvent.changeText(renderApi.getByTestId('username'), username);
    }

    function writePassword(password = 'password'): void {
        fireEvent.changeText(renderApi.getByTestId('password'), password);
    }



    describe('Validations', () => {

        function assertSignUpButtonEnabled(enabled: boolean): void {
            const signUpButton = renderApi.getByTestId('signUp');
            expect(signUpButton.props.disabled).toBe(!enabled);
        }

        it('signup should be disabled when no username and no password', () => {
            assertSignUpButtonEnabled(false);
        });

        it('signup should be disabled when username but no password', () => {
            writeUsername();

            assertSignUpButtonEnabled(false);
        });

        it('login should be disabled when valid password but no username', () => {
            writePassword();

            assertSignUpButtonEnabled(false);
        });

        it('signup should be enabled when username and valid password', () => {
            writeUsername();
            writePassword();

            assertSignUpButtonEnabled(true);
        });
    });

});
