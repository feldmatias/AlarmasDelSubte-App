import React from 'react';
import {StackNavigationOptions} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {BaseScreen, ScreenProps, ScreenState} from '../../screens/BaseScreen';
import {AlarmsListScreenView} from './AlarmsListScreenView';
import {Alarm} from '../model/Alarm';
import DiContainer from '../../di/Container';
import {AlarmsRepository} from '../AlarmsRepository';
import {Loading} from '../../components/Loading';
import {NavigationRoutes} from '../../screens/NavigationRoutes';
import {View} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {Toast} from '../../screens/Toast';
import {alarmStrings} from '../../strings/AlarmStrings';

interface Props extends ScreenProps {
}

interface State extends ScreenState {
    alarms: Alarm[]
    refreshing: boolean
}

export class AlarmsListScreen extends BaseScreen<Props, State> {

    public static navigationOptions: StackNavigationOptions = {
        title: alarmStrings.alarmsListScreen.screenTitle,
    };

    public state: State = {
        loading: false,
        error: '',
        alarms: [],
        refreshing: false,
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

    private onFocus = async (): Promise<void> => {
        this.setLoading(true);
        await this.getAlarms();
        this.setLoading(false);
    };

    private refreshAlarms = async (): Promise<void> => {
        this.setRefreshing(true);
        await this.getAlarms();
        this.setRefreshing(false);
    };

    private setRefreshing(refreshing: boolean): void {
        this.setState({refreshing});
    }

    private deleteAlarm = async (alarm: Alarm): Promise<void> => {
        this.setLoading(true);
        const result = await this.alarmsRepository.deleteAlarm(alarm);
        this.setLoading(false);

        if (result.isSuccessful()) {
            this.setAlarms(this.state.alarms.filter(filter => filter.id !== alarm.id));
            Toast.show(alarmStrings.alarmsListScreen.successDeleteAlarm);
        } else {
            this.setError(result.getError());
            this.setAlarms([]);
        }
    };

    private createAlarm = (): void => {
        this.navigation().navigate(NavigationRoutes.AlarmForm);
    };

    public render() {
        if (this.state.loading) {
            return (
                <Loading/>
            );
        }

        return (
            <View>

                <NavigationEvents
                    testID="navigationEvents"
                    onWillFocus={this.onFocus}
                />

                <AlarmsListScreenView
                    alarms={this.state.alarms}
                    error={this.state.error}
                    refreshing={this.state.refreshing}
                    refresh={this.refreshAlarms}
                    deleteAlarm={this.deleteAlarm}
                    createAlarm={this.createAlarm}
                />

            </View>
        );
    }
}
