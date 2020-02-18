import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ErrorMessage} from './ErrorMessage';
import {screenContainerStyles} from '../styles/ScreenStyles';
import {Colors} from '../styles/Colors';

interface Props {
    error: string
    emptyMessage: string
}

interface State {

}

export class ListEmpty extends Component<Props, State> {

    public render() {
        if (this.props.error) {
            return (
                <View style={screenContainerStyles}>
                    <ErrorMessage error={this.props.error}/>
                </View>
            );
        }

        return (
            <View style={screenContainerStyles}>
                <Text style={styles.emptyMessage}>
                    {this.props.emptyMessage}
                </Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    emptyMessage: {
        textAlign: 'center',
        fontSize: 25,
        color: Colors.grey,
    },
});
