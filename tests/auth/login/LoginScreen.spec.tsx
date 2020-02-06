import 'react-native';
import MockGraphQLClient from '../../graphql/MockGraphQLClient';
import {fireEvent, RenderAPI} from 'react-native-testing-library';
import {LoginScreen} from '../../../src/auth/login/LoginScreen';
import React from 'react';
import {GraphQLService} from '../../../src/graphql/GraphQLService';
import {GraphQLOperation} from '../../../src/graphql/GraphQLClient';
import {LoginMutation} from '../../../src/auth/login/LoginMutation';
import {MockNavigation} from '../../screens/MockNavigation';
import {Routes} from '../../../src/screens/Routes';
import MockStorage from '../../storage/MockStorage';
import {AuthStorage} from '../../../src/auth/AuthStorage';
import {AuthToken} from '../../../src/auth/AuthToken';
import {ScreenTestUtils} from '../../screens/ScreenTestUtils';

describe('Login Screen', () => {

    let renderApi: RenderAPI;
    let loginMutation: GraphQLOperation;
    let navigation: MockNavigation;

    async function renderScreen(): Promise<void> {
        navigation = new MockNavigation();
        renderApi = await ScreenTestUtils.render(<LoginScreen navigation={navigation.instance()}/>);
    }

    beforeEach(async () => {
        MockGraphQLClient.mock();
        MockStorage.mock();
        loginMutation = new LoginMutation('', '').getMutation();
        await renderScreen();
    });

    afterEach(() => {
        MockGraphQLClient.reset();
        MockStorage.reset();
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

    async function loginWithCredentials(): Promise<void> {
        writeUsername();
        writePassword();
        await login();
    }

    function loginResponse(token = 'token') {
        return {
            login:
                {token: token},
        };
    }

    describe('Validations', () => {

        function assertLoginButtonEnabled(enabled: boolean): void {
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

        function assertIsLoading(loading: boolean): void {
            const loginButton = renderApi.getByTestId('login');
            expect(loginButton.props.loading).toBe(loading);
        }

        it('when login then should be loading', async () => {
            MockGraphQLClient.mockLoading(loginMutation);

            loginWithCredentials();

            assertIsLoading(true);
        });

        it('when login response then should not be loading', async () => {
            MockGraphQLClient.mockNetworkError(loginMutation);

            await loginWithCredentials();

            assertIsLoading(false);
        });

        it('when loading then should not login twice', async () => {
            MockGraphQLClient.mockLoading(loginMutation);

            loginWithCredentials();
            login();

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
            MockGraphQLClient.mockNetworkError(loginMutation);

            await loginWithCredentials();

            assertErrorShown(GraphQLService.DEFAULT_ERROR);
        });

        it('when api error then show error', async () => {
            const error = 'some error';
            MockGraphQLClient.mockError(loginMutation, error);

            await loginWithCredentials();

            assertErrorShown(error);
        });

        it('when api success then hide error', async () => {
            MockGraphQLClient.mockSuccess(loginMutation, loginResponse());

            await loginWithCredentials();

            assertErrorNotShown();
        });

    });

    describe('Sign Up', () => {

        function signUp(): void {
            fireEvent.press(renderApi.getByTestId('signUp'));
        }

        it('should navigate to sign up screen when click sign up', async () => {
            signUp();
            navigation.assertNavigatedTo(Routes.SignUp);
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

        it('should navigate to subways list when successful login', async () => {
            MockGraphQLClient.mockSuccess(loginMutation, loginResponse());

            await loginWithCredentials();

            navigation.assertNavigatedToMain(Routes.SubwaysList);
        });

        it('should navigate to subways list if already logged in', async () => {
            const token = new AuthToken();
            token.token = 'existing auth token';
            MockStorage.mockSavedValue(AuthStorage.AUTH_TOKEN_KEY, token);

            await renderScreen(); //Render to trigger componentDidMountEvent

            navigation.assertNavigatedToMain(Routes.SubwaysList);
        });

    });

    describe('Auth Token', () => {

        it('should save auth token when successful login', async () => {
            const token = new AuthToken();
            token.token = 'auth token';
            MockGraphQLClient.mockSuccess(loginMutation, loginResponse(token.token));

            await loginWithCredentials();

            MockStorage.assertSaved(AuthStorage.AUTH_TOKEN_KEY, token);
        });

        it('should not save auth token when error login', async () => {
            MockGraphQLClient.mockError(loginMutation);

            await loginWithCredentials();

            MockStorage.assertNotSaved(AuthStorage.AUTH_TOKEN_KEY);
        });

    });

});
