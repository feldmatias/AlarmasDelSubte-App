import React from 'react';
import {StackNavigationOptions} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {AuthRepository} from '../AuthRepository';
import DiContainer from '../../di/Container';
import {Result} from '../../utils/Result';
import {AuthToken} from '../AuthToken';
import {LoginScreenView} from './LoginScreenView';
import {NavigationRoutes} from '../../screens/NavigationRoutes';
import {BaseScreen, NavigationParams, ScreenState} from '../../screens/BaseScreen';
import {authStrings} from '../../strings/AuthStrings';

interface Params extends NavigationParams {

}

interface State extends ScreenState {

}

export class LoginScreen extends BaseScreen<State, Params> {

    public static navigationOptions: StackNavigationOptions = {
        title: authStrings.loginScreen.title,
    };

    public state: State = {
        loading: false,
        error: '',
    };

    private authRepository = DiContainer.get<AuthRepository>(AuthRepository);

    private login = async (username: string, password: string): Promise<void> => {
        this.setLoading(true);
        const result = await this.authRepository.login(username, password);
        this.setLoading(false);
        this.analyzeLoginResult(result);
    };

    private analyzeLoginResult(result: Result<AuthToken>) {
        if (!result.isSuccessful()) {
            this.setError(result.getError());
            return;
        }

        this.navigation().navigateToMainScreen(NavigationRoutes.SubwaysList);
    }

    private signUp = (): void => {
        this.navigation().navigate(NavigationRoutes.SignUp);
    };

    public async componentDidMount(): Promise<void> {
        const isLoggedIn = await this.authRepository.autoLogin();
        if (isLoggedIn) {
            this.navigation().navigateToMainScreen(NavigationRoutes.SubwaysList);
        }
    }

    public render() {
        return (
            <LoginScreenView
                loading={this.state.loading}
                error={this.state.error}
                login={this.login}
                signUp={this.signUp}
            />
        );
    }
}
