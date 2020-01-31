import React, {Component} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {StackNavigationOptions} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {Colors} from '../../styles/Colors';
import {AuthRepository} from '../AuthRepository';
import container from '../../di/Container';

interface Props {

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

export class LoginScreen extends Component<Props, State> {

    public static navigationOptions: StackNavigationOptions = {
        title: strings.title,
    };

    public state: State = {
        username: '',
        password: '',
    };

    private authRepository = container.get<AuthRepository>(AuthRepository);

    private login = async () => {
        await this.authRepository.login(this.state.username, this.state.password);
    };

    private isLoginEnabled(): boolean {
        if (!this.state.username || !this.state.password) {
            return false;
        }
        return true;
    }

    public render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{strings.title}</Text>

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
                        color={Colors.primary}
                        disabled={!this.isLoginEnabled()}
                        onPress={this.login}/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        height: '100%',
        width: '100%',
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
    title: {
        fontSize: 35,
        marginTop: 100,
        marginBottom: 40,
    },
});
