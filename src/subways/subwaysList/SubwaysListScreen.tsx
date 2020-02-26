import React from 'react';
import {BaseScreen, NavigationParams, ScreenState} from '../../screens/BaseScreen';
import {SubwaysListScreenView} from './SubwaysListScreenView';
import {Subway} from '../model/Subway';
import DiContainer from '../../di/Container';
import {SubwaysRepository} from '../SubwaysRepository';
import {Loading} from '../../components/Loading';
import {AlarmsHeaderButton} from '../../alarms/alarmsList/components/AlarmsHeaderButton';
import {NavigationRoutes} from '../../screens/NavigationRoutes';
import {NavigationStackProp} from 'react-navigation-stack';
import {subwayStrings} from '../../strings/SubwayStrings';

interface Params extends NavigationParams {

}

interface State extends ScreenState {
    subways: Subway[]
    refreshing: boolean
}

export class SubwaysListScreen extends BaseScreen<State, Params> {

    public static navigationOptions = ({navigation}: { navigation: NavigationStackProp }) => ({
        title: subwayStrings.subwaysListScreen.screenTitle,
        headerRight: () => <AlarmsHeaderButton onPress={() => navigation.navigate(NavigationRoutes.AlarmsList)}/>,
    });

    public state: State = {
        loading: false,
        error: '',
        subways: [],
        refreshing: false,
    };

    private subwaysRepository = DiContainer.get<SubwaysRepository>(SubwaysRepository);

    public async getSubways(): Promise<void> {
        const subways = await this.subwaysRepository.getSubways();

        if (subways.isSuccessful()) {
            this.setSubways(subways.getData());
        } else {
            this.setError(subways.getError());
            this.setSubways([]);
        }
    }

    private setSubways(subways: Subway[]): void {
        this.setState({subways: subways});
    }

    public async componentDidMount(): Promise<void> {
        this.setLoading(true);
        await this.getSubways();
        this.setLoading(false);
    }

    private refreshSubways = async (): Promise<void> => {
        this.setRefreshing(true);
        await this.getSubways();
        this.setRefreshing(false);
    };

    private setRefreshing(refreshing: boolean): void {
        this.setState({refreshing});
    }

    public render() {
        if (this.state.loading) {
            return (
                <Loading/>
            );
        }

        return (
            <SubwaysListScreenView
                subways={this.state.subways}
                error={this.state.error}
                refreshing={this.state.refreshing}
                refresh={this.refreshSubways}
            />
        );
    }
}

