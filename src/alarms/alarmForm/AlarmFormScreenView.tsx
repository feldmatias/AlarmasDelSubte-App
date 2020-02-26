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
import {SubmitButton} from '../../components/SubmitButton';
import {ErrorMessage} from '../../components/ErrorMessage';
import {Alarm} from '../model/Alarm';

interface Props {
    subways: Subway[]
    loading: boolean
    error: string
    submit: (alarm: AlarmInput) => Promise<void>
    alarm?: Alarm
}

interface State {
    alarm: AlarmInput
}

export class AlarmFormScreenView extends Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.state.alarm = new AlarmInput(props.alarm);
    }

    public state: State = {
        alarm: new AlarmInput(),
    };

    private setAlarm(alarm: AlarmInput): void {
        this.setState({alarm});
    }

    private getError = () : string => {
        if (!this.state.alarm.isValidTimeRange()) {
            return alarmStrings.form.invalidTimeRange;
        }

        return this.props.error;
    };

    private submit = async (): Promise<void> => {
        await this.props.submit(this.state.alarm);
    };

    public render() {
        if (this.props.subways.length === 0) {
            return (
                <ListEmpty emptyMessage={strings.defaultError}/>
            );
        }

        return (
            <ScrollView keyboardShouldPersistTaps="handled" style={screenStyles.scroll}>
                <View style={screenStyles.container}>

                    <ErrorMessage error={this.getError()} style={styles.error}/>

                    <TextInput
                        testID="alarmName"
                        placeholder={alarmStrings.form.name}
                        style={[inputStyles.text, styles.name]}
                        value={this.state.alarm.name}
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

                    <SubmitButton
                        title={alarmStrings.form.submit}
                        style={styles.submit}
                        loading={this.props.loading}
                        enabled={this.state.alarm.isValid()}
                        onSubmit={this.submit}
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
    submit: {
        marginTop: 40,
    },
    error: {
        marginTop: 20,
    },
});
