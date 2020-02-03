import React, {Component} from 'react';
import {StackNavigationOptions} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {AuthRepository} from '../AuthRepository';
import DiContainer from '../../di/Container';
import {Result} from '../../utils/Result';
import {AuthToken} from '../AuthToken';
import {LoginScreenView} from './LoginScreenView';

interface Props {

}

interface State {
    loading: boolean,
    error: string
}

const strings = {
    screenTitle: 'Alarmas del Subte',
};

export class LoginScreen extends Component<Props, State> {

    public static navigationOptions: StackNavigationOptions = {
        title: strings.screenTitle,
    };

    public state: State = {
        loading: false,
        error: '',
    };

    private authRepository = DiContainer.get<AuthRepository>(AuthRepository);

    private login = async (username: string, password: string) => {
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
            <LoginScreenView
                loading={this.state.loading}
                error={this.state.error}
                login={this.login}
            />
        );
    }
}
