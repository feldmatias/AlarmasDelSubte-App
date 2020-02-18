import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Alarm} from '../model/Alarm';
import {AlarmItemSubways} from './components/AlarmItemSubways';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
    alarm: Alarm
}

interface State {

}

export class AlarmItem extends Component<Props, State> {

    private getTimeRange(): string {
        return `${this.props.alarm.start}  -  ${this.props.alarm.end}`;
    }

    public render() {
        return (
            <View style={styles.container} testID="alarmItem">

                <Text style={styles.name}>
                    {this.props.alarm.name}
                </Text>

                <AlarmItemSubways subways={this.props.alarm.subways}/>

                <View style={styles.timeRangeContainer}>

                    <Icon name="alarm" size={35}/>

                    <Text testID="alarmTimeRange" style={styles.timeRange}>
                        {this.getTimeRange()}
                    </Text>

                </View>

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
    timeRangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    timeRange: {
        marginLeft: 10,
        fontSize: 24,
    },
});
