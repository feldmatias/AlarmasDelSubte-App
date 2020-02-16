import React, {Component} from 'react';
import {Keyboard, StyleProp, ViewStyle} from 'react-native';
import {Button} from 'react-native-elements';
import {buttonStyles} from '../styles/ButtonStyles';

interface Props {
    title: string
    loading: boolean
    enabled: boolean
    onSubmit: () => void
    style: StyleProp<ViewStyle>
}

interface State {
}

export class SubmitButton extends Component<Props, State> {

    private onSubmit = async (): Promise<void> => {
        if (this.props.loading) {
            return;
        }

        Keyboard.dismiss();
        await this.props.onSubmit();
    };

    public render() {
        return (
            <Button testID="submit"
                    title={this.props.title}
                    buttonStyle={[buttonStyles.button, this.props.style]}
                    titleStyle={buttonStyles.title}
                    loading={this.props.loading}
                    disabled={!this.props.enabled}
                    onPress={this.onSubmit}/>
        );
    }
}
