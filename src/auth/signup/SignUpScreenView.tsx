import React, {Component} from 'react';
import {Keyboard, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {screenStyles} from '../../styles/ScreenStyles';
import {ErrorMessage} from '../../components/ErrorMessage';
import {inputStyles} from '../../styles/InputStyles';
import {Button} from 'react-native-elements';
import {buttonStyles} from '../../styles/ButtonStyles';
import {Colors} from '../../styles/Colors';

interface Props {
    error: string
    loading: boolean
    signUp: (username: string, password: string) => Promise<void>
}

interface State {
    username: string
    password: string
}

const strings = {
    message: 'Crea una cuenta para poder empezar a crear alarmas del subte y recibir notificaciones!',
    username: 'Usuario',
    password: 'Contraseña',
    signUp: 'Crear cuenta',
};

export class SignUpScreenView extends Component<Props, State> {

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

    private isSignUpEnabled(): boolean {
        if (!this.state.username || !this.state.password) {
            return false;
        }
        return true;
    }

    private signUp = async (): Promise<void> => {
        if (this.props.loading) {
            return;
        }

        Keyboard.dismiss();
        await this.props.signUp(this.state.username, this.state.password);
    };

    public render() {
        return (
            <ScrollView keyboardShouldPersistTaps="handled" style={screenStyles.scroll}>
                <View style={screenStyles.container}>

                    <Text style={styles.message}>
                        {strings.message}
                    </Text>

                    <ErrorMessage error={this.props.error} style={styles.error}/>

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

                    <Button testID="signUp"
                            title={strings.signUp}
                            buttonStyle={[buttonStyles.button, styles.button]}
                            titleStyle={buttonStyles.title}
                            loading={this.props.loading}
                            disabled={!this.isSignUpEnabled()}
                            onPress={this.signUp}/>

                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    message: {
        fontSize: 20,
        marginTop: 75,
        marginBottom: 40,
        marginHorizontal: 25,
        textAlign: 'center',
        color: Colors.lightGrey,
    },
    input: {
        width: '75%',
        marginBottom: 15,
    },
    button: {
        marginTop: 12,
        marginBottom: 35,
    },
    error: {
        marginBottom: 17,
    },
});
