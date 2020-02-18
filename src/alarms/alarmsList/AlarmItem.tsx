import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Alarm} from '../model/Alarm';

interface Props {
    alarm: Alarm
}

interface State {

}

export class AlarmItem extends Component<Props, State> {

    public render() {
        return (
            <View style={styles.container} testID="alarmItem">

                <Text style={styles.name}>
                    {this.props.alarm.name}
                </Text>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    name: {
        fontSize: 15,
        textDecorationLine: 'underline',
    },
});
