import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import {textStyles} from '../../../styles/TextStyles';
import {authStrings} from '../../../strings/AuthStrings';

interface Props {
    signUp: () => void
}

interface State {

}

export class SignUpLink extends Component<Props, State> {

    private signUp = (): void => {
        this.props.signUp();
    };

    public render() {
        return (

            <Text style={styles.signUp}>
                {authStrings.loginScreen.signUpMessage}

                <Text testID="signUp" style={textStyles.link} onPress={this.signUp}>
                    {authStrings.loginScreen.signUp}
                </Text>

            </Text>
        );
    }
}

const styles = StyleSheet.create({
    signUp: {
        fontSize: 16,
    },
});
