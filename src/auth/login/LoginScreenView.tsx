import React, {Component} from 'react';
import {Keyboard, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Button} from 'react-native-elements';
import {Colors} from '../../styles/Colors';

interface Props {
    loading: boolean,
    error: string
    login: (username: string, password: string) => Promise<void>
}

interface State {
    username: string,
    password: string
}

const strings = {
    title: 'Alarmas del Subte',
    username: 'Usuario',
    password: 'Contraseña',
    login: 'Ingresar',
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

        return (<Text testID="error" style={styles.error}>
            {this.props.error}
        </Text>);
    }

    public render() {
        return (
            <ScrollView keyboardShouldPersistTaps="handled" style={styles.scroll}>
                <View style={styles.container}>

                    <Text style={styles.title}>
                        {strings.title}
                    </Text>

                    {this.renderError()}

                    <TextInput testID="username"
                               placeholder={strings.username}
                               style={styles.input}
                               onChangeText={username => {
                                   this.setUsername(username);
                               }}/>

                    <TextInput testID="password"
                               placeholder={strings.password}
                               secureTextEntry={true}
                               style={styles.input}
                               onChangeText={password => {
                                   this.setPassword(password);
                               }}/>

                    <Button testID="login"
                            title={strings.login}
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonTitle}
                            loading={this.props.loading}
                            disabled={!this.isLoginEnabled()}
                            onPress={this.login.bind(this)}/>

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
