import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Alarm} from '../model/Alarm';
import {AlarmItemSubways} from './components/AlarmItemSubways';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {DaysTranslator} from '../../utils/DaysTranslator';
import {Colors} from '../../styles/Colors';
import {Button} from 'react-native-elements';
import {ConfirmationDialog} from '../../components/ConfirmationDialog';
import {alarmStrings} from '../../strings/AlarmStrings';

interface Props {
    alarm: Alarm
    deleteAlarm: (alarm: Alarm) => Promise<void>
    editAlarm: (alarm: Alarm) => void
}

interface State {

}


export class AlarmItem extends Component<Props, State> {

    private deleteConfirmationDialog!: ConfirmationDialog;

    private getTimeRange(): string {
        return `${this.props.alarm.start}  -  ${this.props.alarm.end}`;
    }

    private getDays(): string {
        return this.props.alarm.days.map(day => {
            return DaysTranslator.translate(day);
        }).join(' | ');
    }

    private showConfirmDelete = (): void => {
        this.deleteConfirmationDialog.show();
    };

    private deleteAlarm = async (): Promise<void> => {
        await this.props.deleteAlarm(this.props.alarm);
    };

    private editAlarm = (): void => {
        this.props.editAlarm(this.props.alarm);
    };

    public render() {
        return (
            <View style={styles.container} testID="alarmItem">

                <Text style={styles.name}>
                    {this.props.alarm.name}
                </Text>

                <AlarmItemSubways subways={this.props.alarm.subways}/>

                <Text testID="alarmDays" style={styles.days}>
                    {this.getDays()}
                </Text>

                <View style={styles.timeRangeContainer}>

                    <Icon name="alarm" size={35}/>

                    <Text testID="alarmTimeRange" style={styles.timeRange}>
                        {this.getTimeRange()}
                    </Text>

                </View>

                <View style={styles.iconsContainer}>

                    <Button
                        testID="alarmEdit"
                        onPress={this.editAlarm}
                        type="clear"
                        icon={{
                            name: 'edit',
                            color: Colors.orange,
                            size: 35,
                        }}
                    />

                    <Button
                        testID="alarmDelete"
                        onPress={this.showConfirmDelete}
                        type="clear"
                        icon={{
                            name: 'delete-forever',
                            color: Colors.red,
                            size: 35,
                        }}
                    />

                </View>

                <ConfirmationDialog
                    message={alarmStrings.alarmsListScreen.deleteAlarmConfirm}
                    onConfirm={this.deleteAlarm}
                    reference={dialog => {
                        this.deleteConfirmationDialog = dialog;
                    }}
                />

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
        fontSize: 23,
        textDecorationLine: 'underline',
        marginBottom: 10,
    },
    days: {
        fontSize: 15,
        marginTop: 15,
        paddingHorizontal: 20,
        textAlign: 'center',
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
    iconsContainer: {
        flexDirection: 'row',
    },
});
