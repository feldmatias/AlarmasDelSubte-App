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
                <View style={styles.itemContainer}>

                    <Text style={styles.title}>
                        {this.props.alarm.name}
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
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        marginLeft: 15,
    },
    icon: {
        width: 50,
        height: 50,
        marginLeft: 20,
    },
    status: {
        marginHorizontal: 28,
        flex: 1,
        fontSize: 16,
        textAlign: 'center',
    },
});
