import React from 'react';
import {StackNavigationOptions} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {BaseScreen, ScreenProps, ScreenState} from '../../screens/BaseScreen';
import {alarmStrings} from '../../strings/AlarmStrings';
import {AlarmFormScreenView} from './AlarmFormScreenView';
import {Subway} from '../../subways/model/Subway';
import DiContainer from '../../di/Container';
import {SubwaysRepository} from '../../subways/SubwaysRepository';
import {Loading} from '../../components/Loading';
import {AlarmInput} from '../model/AlarmInput';
import {AlarmsRepository} from '../AlarmsRepository';

interface Props extends ScreenProps {
}

interface State extends ScreenState {
    subways: Subway[]
}

export class AlarmFormScreen extends BaseScreen<Props, State> {

    public static navigationOptions: StackNavigationOptions = {
        title: alarmStrings.alarmFormScreen.screenTitle,
    };

    public state: State = {
        loading: false,
        error: '',
        subways: [],
    };

    private alarmsRepository = DiContainer.get<AlarmsRepository>(AlarmsRepository);
    private subwaysRepository = DiContainer.get<SubwaysRepository>(SubwaysRepository);

    public async componentDidMount() {
        this.setLoading(true);
        this.setSubways(await this.subwaysRepository.getStoredSubways());
        this.setLoading(false);
    }

    private setSubways(subways: Subway[]): void {
        this.setState({subways});
    }

    private submit = async (alarm: AlarmInput): Promise<void> => {
        this.setLoading(true);
        const result = await this.alarmsRepository.createAlarm(alarm);
        this.setLoading(false);

        if (result.isSuccessful()) {

        } else {
            this.setError(result.getError());
        }
    };

    public render() {
        if (this.state.loading && this.state.subways.length === 0) {
            return (
                <Loading/>
            );
        }

        return (
            <AlarmFormScreenView
                subways={this.state.subways}
                loading={this.state.loading}
                error={this.state.error}
                submit={this.submit}
            />
        );
    }
}
