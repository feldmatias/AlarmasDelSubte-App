import React, {Component} from 'react';
import {ScrollView, StyleSheet, TextInput, View} from 'react-native';
import {AlarmInput} from '../model/AlarmInput';
import {screenStyles} from '../../styles/ScreenStyles';
import {inputStyles} from '../../styles/InputStyles';
import {alarmStrings} from '../../strings/AlarmStrings';
import {AlarmFormDays} from './components/AlarmFormDays';

interface Props {
}

interface State {
    alarm: AlarmInput
}

export class AlarmFormScreenView extends Component<Props, State> {

    public state: State = {
        alarm: new AlarmInput(),
    };

    private setAlarm(alarm: AlarmInput): void {
        this.setState({alarm});
    }

    public render() {
        return (
            <ScrollView keyboardShouldPersistTaps="handled" style={screenStyles.scroll}>
                <View style={screenStyles.container}>

                    <TextInput
                        testID="alarmName"
                        placeholder={alarmStrings.form.name}
                        style={[inputStyles.text, styles.input]}
                        onChangeText={name => {
                            this.setAlarm(this.state.alarm.setName(name));
                        }}
                    />

                    <AlarmFormDays
                        selectedDays={this.state.alarm.days}
                        selectDay={day => this.setAlarm(this.state.alarm.addDay(day))}
                        deselectDay={day => this.setAlarm(this.state.alarm.removeDay(day))}
                    />

                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        width: '75%',
        marginTop: 30,
        marginBottom: 20,
    },
});
