import React from 'react';
import {StackNavigationOptions} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {BaseScreen, ScreenProps, ScreenState} from '../../components/BaseScreen';
import {AlarmsListScreenView} from './AlarmsListScreenView';
import {Alarm} from '../model/Alarm';
import DiContainer from '../../di/Container';
import {AlarmsRepository} from '../AlarmsRepository';
import {Loading} from '../../components/Loading';

interface Props extends ScreenProps {
}

interface State extends ScreenState {
    alarms: Alarm[]
}

const strings = {
    screenTitle: 'Alarmas',
};

export class AlarmsListScreen extends BaseScreen<Props, State> {

    public static navigationOptions: StackNavigationOptions = {
        title: strings.screenTitle,
    };

    public state: State = {
        loading: false,
        error: '',
        alarms: [],
    };

    private alarmsRepository = DiContainer.get<AlarmsRepository>(AlarmsRepository);

    public async getAlarms(): Promise<void> {
        const alarms = await this.alarmsRepository.getAlarms();

        if (alarms.isSuccessful()) {
            this.setAlarms(alarms.getData());
        } else {
            this.setError(alarms.getError());
            this.setAlarms([]);
        }
    }

    private setAlarms(alarms: Alarm[]): void {
        this.setState({alarms: alarms});
    }

    public async componentDidMount(): Promise<void> {
        this.setLoading(true);
        await this.getAlarms();
        this.setLoading(false);
    }

    public render() {
        if (this.state.loading) {
            return (
                <Loading/>
            );
        }

        return (
            <AlarmsListScreenView
                alarms={this.state.alarms}
                error={this.state.error}
            />
        );
    }
}
