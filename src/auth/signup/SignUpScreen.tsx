import React, {Component} from 'react';
import {StackNavigationOptions} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {SignUpScreenView} from './SignUpScreenView';
import DiContainer from '../../di/Container';
import {AuthRepository} from '../AuthRepository';
import {Result} from '../../utils/Result';
import {AuthToken} from '../AuthToken';
import {PasswordValidator} from './PasswordValidator';

interface Props {

}

interface State {
    loading: boolean
    error: string
}

const strings = {
    screenTitle: 'Nuevo Usuario',
};

export class SignUpScreen extends Component<Props, State> {

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

        //TODO: handle success
    }

    private setLoading(loading: boolean): void {
        this.setState({loading});
        if (loading) {
            this.setError('');
        }
    }

    private setError(error: string): void {
        this.setState({error});
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
