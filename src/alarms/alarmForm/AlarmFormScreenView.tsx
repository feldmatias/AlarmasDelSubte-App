import React, {Component} from 'react';
import {ScrollView, StyleSheet, TextInput, View} from 'react-native';
import {AlarmInput} from '../model/AlarmInput';
import {screenStyles} from '../../styles/ScreenStyles';
import {inputStyles} from '../../styles/InputStyles';
import {alarmStrings} from '../../strings/AlarmStrings';
import {AlarmFormDays} from './components/AlarmFormDays';
import {AlarmFormTimePicker} from './components/AlarmFormTimePicker';
import {Subway} from '../../subways/model/Subway';
import {ListEmpty} from '../../components/ListEmpty';
import {strings} from '../../strings/Strings';
import {AlarmFormSubways} from './components/AlarmFormSubways';

interface Props {
    subways: Subway[]
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
        if (this.props.subways.length === 0) {
            return (
                <ListEmpty emptyMessage={strings.defaultError}/>
            );
        }

        return (
            <ScrollView keyboardShouldPersistTaps="handled" style={screenStyles.scroll}>
                <View style={screenStyles.container}>

                    <TextInput
                        testID="alarmName"
                        placeholder={alarmStrings.form.name}
                        style={[inputStyles.text, styles.name]}
                        onChangeText={name => {
                            this.setAlarm(this.state.alarm.setName(name));
                        }}
                    />

                    <AlarmFormSubways
                        subways={this.props.subways}
                        selectedSubwayLines={this.state.alarm.subwayLines}
                        selectSubway={subway => this.setAlarm(this.state.alarm.addSubway(subway))}
                        deselectSubway={subway => this.setAlarm(this.state.alarm.removeSubway(subway))}
                    />

                    <AlarmFormDays
                        selectedDays={this.state.alarm.days}
                        selectDay={day => this.setAlarm(this.state.alarm.addDay(day))}
                        deselectDay={day => this.setAlarm(this.state.alarm.removeDay(day))}
                    />

                    <AlarmFormTimePicker
                        testID="start"
                        label={alarmStrings.form.start}
                        time={this.state.alarm.start}
                        onChange={time => this.setAlarm(this.state.alarm.setStart(time))}
                    />

                    <AlarmFormTimePicker
                        testID="end"
                        label={alarmStrings.form.end}
                        time={this.state.alarm.end}
                        onChange={time => this.setAlarm(this.state.alarm.setEnd(time))}
                    />

                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    name: {
        width: '75%',
        marginTop: 30,
        marginBottom: 10,
    },
});
