import React from 'react';
import {StackNavigationOptions} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {AuthRepository} from '../AuthRepository';
import DiContainer from '../../di/Container';
import {Result} from '../../utils/Result';
import {AuthToken} from '../AuthToken';
import {LoginScreenView} from './LoginScreenView';
import {Routes} from '../../screens/Routes';
import {BaseScreen, ScreenProps, ScreenState} from '../../components/BaseScreen';

interface Props extends ScreenProps {
}

interface State extends ScreenState {

}

const strings = {
    screenTitle: 'Alarmas del Subte',
};

export class LoginScreen extends BaseScreen<Props, State> {

    public static navigationOptions: StackNavigationOptions = {
        title: strings.screenTitle,
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

        this.navigation().navigateToMainScreen(Routes.SubwaysList);
    }

    private signUp = (): void => {
        this.navigation().navigate(Routes.SignUp);
    };

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
