import 'react-native';
import MockGraphQLClient from '../../graphql/MockGraphQLClient';
import {fireEvent, render, RenderAPI} from 'react-native-testing-library';
import React from 'react';
import {SignUpScreen} from '../../../src/auth/signup/SignUpScreen';
import {GraphQLOperation} from '../../../src/graphql/GraphQLClient';
import {SignUpMutation} from '../../../src/auth/signup/SignUpMutation';
import {GraphQLService} from '../../../src/graphql/GraphQLService';
import {PasswordValidator} from '../../../src/auth/signup/PasswordValidator';

describe('SignUp Screen', () => {

    let renderApi: RenderAPI;
    let signUpMutation: GraphQLOperation;

    beforeEach(() => {
        MockGraphQLClient.mock();
        renderApi = render(<SignUpScreen/>);
        signUpMutation = new SignUpMutation('', '').getMutation();
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

    async function signUp(): Promise<void> {
        await fireEvent.press(renderApi.getByTestId('signUp'));
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

        it('login should be disabled when password but no username', () => {
            writePassword();

            assertSignUpButtonEnabled(false);
        });

        it('signup should be enabled when username and password', () => {
            writeUsername();
            writePassword();

            assertSignUpButtonEnabled(true);
        });
    });

    describe('Loading', () => {

        function assertIsLoading(loading: boolean): void {
            const signUpButton = renderApi.getByTestId('signUp');
            expect(signUpButton.props.loading).toBe(loading);
        }

        it('when signup then should be loading', async () => {
            MockGraphQLClient.mockLoading(signUpMutation);

            writeUsername();
            writePassword();

            signUp();

            assertIsLoading(true);
        });

        it('when signup response then should not be loading', async () => {
            MockGraphQLClient.mockNetworkError(signUpMutation);

            writeUsername();
            writePassword();

            await signUp();

            assertIsLoading(false);
        });

        it('when loading then should not signup twice', async () => {
            MockGraphQLClient.mockLoading(signUpMutation);

            writeUsername();
            writePassword();

            signUp();
            signUp();

            assertIsLoading(true);
            MockGraphQLClient.assertCalled(1);
        });
    });

    describe('Errors', () => {

        function assertErrorShown(error: string): void {
            expect(renderApi.getByText(error)).toBeDefined();
        }

        function assertErrorNotShown(): void {
            expect(renderApi.queryByTestId('error')).toBeNull();
        }

        it('when network error then show error', async () => {
            MockGraphQLClient.mockNetworkError(signUpMutation);

            writeUsername();
            writePassword();

            await signUp();

            assertErrorShown(GraphQLService.DEFAULT_ERROR);
        });

        it('when api error then show error', async () => {
            const error = 'some error';
            MockGraphQLClient.mockError(signUpMutation, error);

            writeUsername();
            writePassword();

            await signUp();

            assertErrorShown(error);
        });

        it('when api success then hide error', async () => {
            MockGraphQLClient.mockSuccess(signUpMutation, {registerUser: {token: 'token'}});

            writeUsername();
            writePassword();

            await signUp();

            assertErrorNotShown();
        });

        it('when signup with password 5 characters length then show error', async () => {
            writeUsername();
            writePassword('12345');

            await signUp();

            assertErrorShown(PasswordValidator.ERROR);
        });

        it('when signup with password 6 characters length then hide error', async () => {
            MockGraphQLClient.mockSuccess(signUpMutation, {registerUser: {token: 'token'}});

            writeUsername();
            writePassword('123456');

            await signUp();

            assertErrorNotShown();
        });

    });

    describe('Sign Up', () => {

        it('should signup with correct input', async () => {
            const username = 'my username';
            const password = 'my password';
            MockGraphQLClient.mockLoading(signUpMutation);

            writeUsername(username);
            writePassword(password);

            signUp();

            MockGraphQLClient.assertCalledWith({username, password});
        });

    });

});
