import React, {Component} from "react";
import {Button, StyleSheet, Text, TextInput, View} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";

interface Props {

}

interface State {
    username: string,
    password: string
}

export default class LoginScreen extends Component<Props, State> {

    public state: State = {
        username: "",
        password: ""
    };

    private login(): void {

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
                               this.setState({username})
                           }}/>

                <TextInput testID="password"
                           placeholder={strings.password}
                           secureTextEntry={true}
                           style={styles.input}
                           onChangeText={password => {
                               this.setState({password})
                           }}/>

                <Button testID="login"
                        title={strings.login}
                        disabled={!this.isLoginEnabled()}
                        onPress={this.login}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        height: "100%",
        width: "100%",
        alignItems: "center"
    },
    input: {
        width: "75%",
        marginBottom: 15,
        borderColor: "gray",
        borderWidth: 1,
        paddingHorizontal: 17
    },
    title: {
        fontSize: 35,
        marginTop: 100,
        marginBottom: 40
    }
});

const strings = {
    title: "Alarmas del Subte",
    username: "Usuario",
    password: "Contraseña",
    login: "Ingresar"
};
