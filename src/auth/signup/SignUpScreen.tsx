import React, {Component} from 'react';
import {StackNavigationOptions} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {SignUpScreenView} from './SignUpScreenView';

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

    private signUp = async (_username: string, _password: string): Promise<void> => {
        this.setLoading(true);
        //const result = await this.authRepository.login(username, password);
        this.setLoading(false);
        //this.analyzeLoginResult(result);
    };

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
