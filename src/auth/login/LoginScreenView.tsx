import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {screenStyles} from '../../styles/ScreenStyles';
import {inputStyles} from '../../styles/InputStyles';
import {SignUpLink} from './components/SignUpLink';
import {ErrorMessage} from '../../components/ErrorMessage';
import {SubmitButton} from '../../components/SubmitButton';
import {authStrings} from '../../strings/AuthStrings';

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
        await this.props.login(this.state.username, this.state.password);
    };

    public render() {
        return (
            <ScrollView keyboardShouldPersistTaps="handled" style={screenStyles.scroll}>
                <View style={screenStyles.container}>

                    <Text style={styles.title}>
                        {authStrings.loginScreen.title}
                    </Text>

                    <ErrorMessage error={this.props.error} style={styles.error}/>

                    <TextInput
                        testID="username"
                        placeholder={authStrings.form.username}
                        style={[inputStyles.text, styles.input]}
                        onChangeText={username => {
                            this.setUsername(username);
                        }}/>

                    <TextInput
                        testID="password"
                        placeholder={authStrings.form.password}
                        secureTextEntry={true}
                        style={[inputStyles.text, styles.input]}
                        onChangeText={password => {
                            this.setPassword(password);
                        }}/>

                    <SubmitButton
                        title={authStrings.loginScreen.login}
                        style={styles.button}
                        loading={this.props.loading}
                        enabled={this.isLoginEnabled()}
                        onSubmit={this.login}/>

                    <SignUpLink signUp={this.props.signUp}/>

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
        marginTop: 12,
        marginBottom: 35,
    },
    error: {
        marginBottom: 17,
    },
});
