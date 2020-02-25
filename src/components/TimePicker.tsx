import React, {Component} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {DateTimeUtils} from '../utils/DateTimeUtils';

interface Props {
    reference: (picker: TimePicker) => void
    time: string
    onChange: (time: string) => void
}

interface State {
    visible: boolean
}

export class TimePicker extends Component<Props, State> {

    public state: State = {
        visible: false,
    };

    public open = (): void => {
        this.setVisible(true);
    };

    private close = (): void => {
        this.setVisible(false);
    };

    private setVisible(visible: boolean): void {
        this.setState({visible});
    }

    private getDate(): Date {
        return DateTimeUtils.timeToDate(this.props.time);
    }

    private onChange = (event: any, date?: Date): void => {
        this.close();
        if (date) {
            const time = moment(date).format('HH:mm');
            this.props.onChange(time);
        }
    };

    public componentDidMount(): void {
        this.props.reference(this);
    }

    public render() {
        if (!this.state.visible) {
            return null;
        }

        return (
            <DateTimePicker
                testID="timePicker"
                value={this.getDate()}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={this.onChange}
            />
        );
    }
}
