import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import {textStyles} from '../../../styles/TextStyles';

interface Props {
    signUp: () => void
}

interface State {

}

const strings = {
    signUpMessage: 'No tienes cuenta? ',
    signUp: 'Registrate!',
};

export class SignUpLink extends Component<Props, State> {

    private signUp = (): void => {
        this.props.signUp();
    };

    public render() {
        return (

            <Text style={styles.signUp}>
                {strings.signUpMessage}

                <Text testID="signUp" style={textStyles.link} onPress={this.signUp}>
                    {strings.signUp}
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
