import 'react-native';
import MockGraphQLClient from '../graphql/MockGraphQLClient';
import {fireEvent, render, RenderAPI} from 'react-native-testing-library';
import {LoginScreen} from '../../src/auth/login/LoginScreen';
import React from 'react';
import {GraphQLService} from '../../src/graphql/GraphQLService';
import {GraphQLOperation} from '../../src/graphql/GraphQLClient';
import {LoginMutation} from '../../src/auth/login/LoginMutation';

describe('Login Screen', () => {

    let renderApi: RenderAPI;
    let loginMutation: GraphQLOperation;

    beforeEach(() => {
        MockGraphQLClient.mock();
        renderApi = render(<LoginScreen/>);
        loginMutation = new LoginMutation('', '').getMutation();
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

    async function login(): Promise<void> {
        await fireEvent.press(renderApi.getByTestId('login'));
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

    describe('Loading', () => {

        function assertIsLoading(loading: boolean): void{
            const loginButton = renderApi.getByTestId('login');
            expect(loginButton.props.loading).toBe(loading);
        }

        it('when login then should be loading', async () => {
            MockGraphQLClient.mockLoading(loginMutation);

            writeUsername();
            writePassword();

            login();

            assertIsLoading(true);
        });

        it('when login response then should not be loading', async () => {
            MockGraphQLClient.mockNetworkError(loginMutation);

            writeUsername();
            writePassword();

            await login();

            assertIsLoading(false);
        });

        it('when loading then should not login twice', async () => {
            MockGraphQLClient.mockLoading(loginMutation);

            writeUsername();
            writePassword();

            login();
            login();

            assertIsLoading(true);
            MockGraphQLClient.assertCalled(1);
        });
    });

    describe('Errors', () => {

        function assertErrorShown(error: string): void{
            expect(renderApi.getByText(error)).toBeDefined();
        }

        function assertErrorNotShown(): void{
            expect(renderApi.queryByTestId('error')).toBeNull();
        }

        it('when network error then show error', async () => {
            MockGraphQLClient.mockNetworkError(loginMutation);

            writeUsername();
            writePassword();

            await login();

            assertErrorShown(GraphQLService.DEFAULT_ERROR);
        });

        it('when api error then show error', async () => {
            const error = 'some error';
            MockGraphQLClient.mockError(loginMutation, error);

            writeUsername();
            writePassword();

            await login();

            assertErrorShown(error);
        });

        it('when api success then hide error', async () => {
            MockGraphQLClient.mockSuccess(loginMutation, {login: {token: 'token'}});

            writeUsername();
            writePassword();

            await login();

            assertErrorNotShown();
        });

    });

    describe('Login', () => {

        it('should login with correct input', async () => {
            const username = 'my username';
            const password = 'my password';
            MockGraphQLClient.mockLoading(loginMutation);

            writeUsername(username);
            writePassword(password);

            login();

            MockGraphQLClient.assertCalledWith({username, password});
        });

    });

});
