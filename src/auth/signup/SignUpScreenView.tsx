import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {screenStyles} from '../../styles/ScreenStyles';
import {ErrorMessage} from '../../components/ErrorMessage';
import {inputStyles} from '../../styles/InputStyles';
import {Colors} from '../../styles/Colors';
import {SubmitButton} from '../../components/SubmitButton';
import {authStrings} from '../../strings/AuthStrings';

interface Props {
    error: string
    loading: boolean
    signUp: (username: string, password: string) => Promise<void>
}

interface State {
    username: string
    password: string
}

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
        await this.props.signUp(this.state.username, this.state.password);
    };

    public render() {
        return (
            <ScrollView keyboardShouldPersistTaps="handled" style={screenStyles.scroll}>
                <View style={screenStyles.container}>

                    <Text style={styles.message}>
                        {authStrings.signUpScreen.message}
                    </Text>

                    <ErrorMessage error={this.props.error} style={styles.error}/>

                    <TextInput
                        testID="username"
                        placeholder={authStrings.form.username}
                        style={[inputStyles.text, styles.input]}
                        onChangeText={username => {
                            this.setUsername(username);
                        }}
                    />

                    <TextInput
                        testID="password"
                        placeholder={authStrings.form.password}
                        secureTextEntry={true}
                        style={[inputStyles.text, styles.input]}
                        onChangeText={password => {
                            this.setPassword(password);
                        }}
                    />

                    <SubmitButton
                        title={authStrings.signUpScreen.signUp}
                        style={styles.button}
                        loading={this.props.loading}
                        enabled={this.isSignUpEnabled()}
                        onSubmit={this.signUp}
                    />

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
        color: Colors.grey,
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
