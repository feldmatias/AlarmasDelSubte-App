import React from 'react';
import {StackNavigationOptions} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {SignUpScreenView} from './SignUpScreenView';
import DiContainer from '../../di/Container';
import {AuthRepository} from '../AuthRepository';
import {Result} from '../../utils/Result';
import {AuthToken} from '../AuthToken';
import {PasswordValidator} from './PasswordValidator';
import {BaseScreen, NavigationParams, ScreenState} from '../../screens/BaseScreen';
import {NavigationRoutes} from '../../screens/NavigationRoutes';
import {authStrings} from '../../strings/AuthStrings';

interface Params extends NavigationParams {

}

interface State extends ScreenState {

}

export class SignUpScreen extends BaseScreen<State, Params> {

    public static navigationOptions: StackNavigationOptions = {
        title: authStrings.signUpScreen.screenTitle,
    };

    public state: State = {
        loading: false,
        error: '',
    };

    private authRepository = DiContainer.get<AuthRepository>(AuthRepository);

    private signUp = async (username: string, password: string): Promise<void> => {
        if (!this.validatePassword(password)) {
            return;
        }

        this.setLoading(true);
        const result = await this.authRepository.signUp(username, password);
        this.setLoading(false);
        this.analyzeSignUpResult(result);
    };

    private validatePassword(password: string) {
        const validation = PasswordValidator.validate(password);
        this.setError(validation.getError());
        return validation.isSuccessful();
    }

    private analyzeSignUpResult(result: Result<AuthToken>) {
        if (!result.isSuccessful()) {
            this.setError(result.getError());
            return;
        }

        this.navigation().navigateToMainScreen(NavigationRoutes.SubwaysList);
    }

    public render() {
        return (
            <SignUpScreenView loading={this.state.loading}
                              error={this.state.error}
                              signUp={this.signUp}
            />
        );
    }
}
