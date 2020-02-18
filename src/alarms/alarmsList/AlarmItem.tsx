import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Alarm} from '../model/Alarm';
import {AlarmItemSubways} from './components/AlarmItemSubways';

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

                <AlarmItemSubways subways={this.props.alarm.subways}/>

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
        fontSize: 20,
        textDecorationLine: 'underline',
        marginBottom: 10,
    },
});
