import 'react-native';
import MockGraphQLClient from '../../graphql/MockGraphQLClient';
import {fireEvent, RenderAPI} from 'react-native-testing-library';
import React from 'react';
import {SignUpScreen} from '../../../src/auth/signup/SignUpScreen';
import {GraphQLOperation} from '../../../src/graphql/GraphQLClient';
import {SignUpMutation} from '../../../src/auth/signup/SignUpMutation';
import {GraphQLService} from '../../../src/graphql/GraphQLService';
import {PasswordValidator} from '../../../src/auth/signup/PasswordValidator';
import {MockNavigation} from '../../screens/MockNavigation';
import {AuthToken} from '../../../src/auth/AuthToken';
import MockStorage from '../../storage/MockStorage';
import {AuthStorage} from '../../../src/auth/AuthStorage';
import {Routes} from '../../../src/screens/Routes';
import {ScreenTestUtils} from '../../screens/ScreenTestUtils';

describe('SignUp Screen', () => {

    let renderApi: RenderAPI;
    let signUpMutation: GraphQLOperation;
    let navigation: MockNavigation;

    async function renderScreen(): Promise<void> {
        navigation = new MockNavigation();
        renderApi = await ScreenTestUtils.render(<SignUpScreen navigation={navigation.instance()}/>);
    }

    beforeEach(async () => {
        MockGraphQLClient.mock();
        MockStorage.mock();
        signUpMutation = new SignUpMutation('', '').getMutation();
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

    async function signUp(): Promise<void> {
        await fireEvent.press(renderApi.getByTestId('submit'));
    }

    async function signUpWithCredentials(): Promise<void> {
        writeUsername();
        writePassword();
        await signUp();
    }

    function signUpResponse(token = 'token') {
        return {
            registerUser:
                {token: token},
        };
    }

    describe('Validations', () => {

        function assertSignUpButtonEnabled(enabled: boolean): void {
            const signUpButton = renderApi.getByTestId('submit');
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
            const signUpButton = renderApi.getByTestId('submit');
            expect(signUpButton.props.loading).toBe(loading);
        }

        it('when signup then should be loading', async () => {
            MockGraphQLClient.mockLoading(signUpMutation);

            signUpWithCredentials();

            assertIsLoading(true);
        });

        it('when signup response then should not be loading', async () => {
            MockGraphQLClient.mockNetworkError(signUpMutation);

            await signUpWithCredentials();

            assertIsLoading(false);
        });

        it('when loading then should not signup twice', async () => {
            MockGraphQLClient.mockLoading(signUpMutation);

            signUpWithCredentials();
            signUp();

            assertIsLoading(true);
            await MockGraphQLClient.assertMutationCalled(signUpMutation, 1);
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

            await signUpWithCredentials();

            assertErrorShown(GraphQLService.DEFAULT_ERROR);
        });

        it('when api error then show error', async () => {
            const error = 'some error';
            MockGraphQLClient.mockError(signUpMutation, error);

            await signUpWithCredentials();

            assertErrorShown(error);
        });

        it('when api success then hide error', async () => {
            MockGraphQLClient.mockSuccess(signUpMutation, {registerUser: {token: 'token'}});

            await signUpWithCredentials();

            assertErrorNotShown();
        });

        it('when signup with password 5 characters length then show error', async () => {
            writeUsername();
            writePassword('12345');

            await signUp();

            assertErrorShown(PasswordValidator.ERROR);
        });

        it('when signup with password 6 characters length then hide error', async () => {
            MockGraphQLClient.mockSuccess(signUpMutation, signUpResponse());

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

            writeUsername(username);
            writePassword(password);

            MockGraphQLClient.mockLoading(signUpMutation);

            signUp();

            await MockGraphQLClient.assertMutationCalledWith(signUpMutation, {username, password});
        });

        it('should navigate to subways list when successful signup', async () => {
            MockGraphQLClient.mockSuccess(signUpMutation, signUpResponse());

            await signUpWithCredentials();

            navigation.assertNavigatedToMain(Routes.SubwaysList);
        });

    });

    describe('Auth Token', () => {

        it('should save auth token when successful signup', async () => {
            const token = new AuthToken();
            token.token = 'auth token';
            MockGraphQLClient.mockSuccess(signUpMutation, signUpResponse(token.token));

            await signUpWithCredentials();

            MockStorage.assertSaved(AuthStorage.AUTH_TOKEN_KEY, token);
        });

        it('should not save auth token when error signup', async () => {
            MockGraphQLClient.mockError(signUpMutation);

            await signUpWithCredentials();

            MockStorage.assertNotSaved(AuthStorage.AUTH_TOKEN_KEY);
        });

    });

});
