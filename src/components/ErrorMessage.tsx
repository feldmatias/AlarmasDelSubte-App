import React, {Component} from 'react';
import {Text} from 'react-native';
import {errorStyles} from '../styles/ErrorStyles';

interface Props {
    error: string,
    style: any
}

interface State {

}

export class ErrorMessage extends Component<Props, State> {

    public render() {
        if (!this.props.error) {
            return null;
        }

        return (
            <Text testID="error" style={[errorStyles.error, this.props.style]}>
                {this.props.error}
            </Text>
        );
    }
}
