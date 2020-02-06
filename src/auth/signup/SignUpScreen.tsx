import React from 'react';
import {StackNavigationOptions} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {SignUpScreenView} from './SignUpScreenView';
import DiContainer from '../../di/Container';
import {AuthRepository} from '../AuthRepository';
import {Result} from '../../utils/Result';
import {AuthToken} from '../AuthToken';
import {PasswordValidator} from './PasswordValidator';
import {BaseScreen, ScreenProps, ScreenState} from '../../components/BaseScreen';
import {Routes} from '../../screens/Routes';

interface Props extends ScreenProps {

}

interface State extends ScreenState {

}

const strings = {
    screenTitle: 'Nueva Cuenta',
};

export class SignUpScreen extends BaseScreen<Props, State> {

    public static navigationOptions: StackNavigationOptions = {
        title: strings.screenTitle,
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

        this.navigation().navigateToMainScreen(Routes.SubwaysList);
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
