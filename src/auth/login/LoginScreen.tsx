import React, {Component} from 'react';
import {Keyboard, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {StackNavigationOptions} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {Colors} from '../../styles/Colors';
import {AuthRepository} from '../AuthRepository';
import container from '../../di/Container';
import {Button} from 'react-native-elements';
import {Result} from '../../utils/Result';
import {AuthToken} from '../AuthToken';

interface Props {

}

interface State {
    username: string,
    password: string,
    loading: boolean,
    error: string
}

const strings = {
    title: 'Alarmas del Subte',
    username: 'Usuario',
    password: 'Contraseña',
    login: 'Ingresar',
};

export class LoginScreen extends Component<Props, State> {

    public static navigationOptions: StackNavigationOptions = {
        title: strings.title,
    };

    public state: State = {
        username: '',
        password: '',
        loading: false,
        error: '',
    };

    private authRepository = container.get<AuthRepository>(AuthRepository);

    private login = async () => {
        if (this.state.loading) {
            return;
        }

        this.setLoading(true);
        const result = await this.authRepository.login(this.state.username, this.state.password);
        this.setLoading(false);
        this.analyzeLoginResult(result);
    };

    private analyzeLoginResult(result: Result<AuthToken>) {
        if (!result.isSuccessful()) {
            this.setError(result.getError());
            return;
        }

        this.setError('success'); //TODO: remove this
    }

    private setLoading(loading: boolean): void {
        this.setState({loading});
        if (loading) {
            this.setError('');
            Keyboard.dismiss();
        }
    }

    private setError(error: string): void {
        this.setState({error});
    }

    private isLoginEnabled(): boolean {
        if (!this.state.username || !this.state.password) {
            return false;
        }
        return true;
    }

    public render() {
        return (
            <ScrollView keyboardShouldPersistTaps='handled' style={styles.scroll}>
                <View style={styles.container}>

                    <Text style={styles.title}>{strings.title}</Text>

                    <Text style={styles.error}>{this.state.error}</Text>

                    <TextInput testID="username"
                               placeholder={strings.username}
                               style={styles.input}
                               onChangeText={username => {
                                   this.setState({username});
                               }}/>

                    <TextInput testID="password"
                               placeholder={strings.password}
                               secureTextEntry={true}
                               style={styles.input}
                               onChangeText={password => {
                                   this.setState({password});
                               }}/>

                    <Button testID="login"
                            title={strings.login}
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonTitle}
                            loading={this.state.loading}
                            disabled={!this.isLoginEnabled()}
                            onPress={this.login}/>

                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 35,
        marginTop: 100,
        marginBottom: 40,
    },
    scroll: {
        height: '100%',
        width: '100%',
        backgroundColor: Colors.white,
    },
    container: {
        alignItems: 'center',
    },
    input: {
        width: '75%',
        marginBottom: 15,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 17,
        borderRadius: 10,
    },
    button: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 37,
        paddingVertical: 9,
        marginTop: 12,
    },
    buttonTitle: {
        fontSize: 20,
    },
    error: {
        color: Colors.error,
        fontSize: 17,
        marginBottom: 17,
    },
});
