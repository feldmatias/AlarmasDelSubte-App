import React, {Component} from 'react';
import {Keyboard, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Button} from 'react-native-elements';
import {screenStyles} from '../../styles/ScreenStyles';
import {inputStyles} from '../../styles/InputStyles';
import {buttonStyles} from '../../styles/ButtonStyles';
import {errorStyles} from '../../styles/ErrorStyles';

interface Props {
    loading: boolean
    error: string
    login: (username: string, password: string) => Promise<void>
    signUp: () => void
}

interface State {
    username: string
    password: string
}

const strings = {
    title: 'Alarmas del Subte',
    username: 'Usuario',
    password: 'Contraseña',
    login: 'Ingresar',
    signUp: 'Registrarse',
};

export class LoginScreenView extends Component<Props, State> {

    public state: State = {
        username: '',
        password: '',
    };

    private setUsername(username: string): void {
        this.setState({username});
    }

    private setPassword(password: string): void {
        this.setState({password});
    }

    private isLoginEnabled(): boolean {
        if (!this.state.username || !this.state.password) {
            return false;
        }
        return true;
    }

    private login = async (): Promise<void> => {
        if (this.props.loading) {
            return;
        }

        Keyboard.dismiss();
        await this.props.login(this.state.username, this.state.password);
    };

    private renderError() {
        if (!this.props.error) {
            return null;
        }

        return (
            <Text testID="error" style={[errorStyles.error, styles.error]}>
                {this.props.error}
            </Text>);
    }

    public render() {
        return (
            <ScrollView keyboardShouldPersistTaps="handled" style={screenStyles.scroll}>
                <View style={screenStyles.container}>

                    <Text style={styles.title}>
                        {strings.title}
                    </Text>

                    {this.renderError()}

                    <TextInput testID="username"
                               placeholder={strings.username}
                               style={[inputStyles.text, styles.input]}
                               onChangeText={username => {
                                   this.setUsername(username);
                               }}/>

                    <TextInput testID="password"
                               placeholder={strings.password}
                               secureTextEntry={true}
                               style={[inputStyles.text, styles.input]}
                               onChangeText={password => {
                                   this.setPassword(password);
                               }}/>

                    <Button testID="login"
                            title={strings.login}
                            buttonStyle={[buttonStyles.button, styles.button]}
                            titleStyle={buttonStyles.title}
                            loading={this.props.loading}
                            disabled={!this.isLoginEnabled()}
                            onPress={this.login}/>

                    <Text testID="signUp" style={styles.signUp} onPress={this.props.signUp}>
                        {strings.signUp}
                    </Text>

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
    input: {
        width: '75%',
        marginBottom: 15,
    },
    button: {
        marginVertical: 12,
    },
    error: {
        marginBottom: 17,
    },
    signUp: {
        marginTop: 15,
    },
});
