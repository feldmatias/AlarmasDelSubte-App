import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ErrorMessage} from '../../../components/ErrorMessage';
import {screenContainerStyles} from '../../../styles/ScreenStyles';
import {Colors} from '../../../styles/Colors';

interface Props {
    error: string
}

interface State {

}

const strings = {
    emptyMessage: 'No hay datos del subte en este momento',
};

export class SubwaysListEmpty extends Component<Props, State> {

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
                    {strings.emptyMessage}
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
