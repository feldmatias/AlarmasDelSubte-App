import React from 'react';
import {StackNavigationOptions} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {BaseScreen, ScreenProps, ScreenState} from '../../screens/BaseScreen';
import {alarmStrings} from '../../strings/AlarmStrings';
import {AlarmFormScreenView} from './AlarmFormScreenView';
import {Subway} from '../../subways/model/Subway';
import DiContainer from '../../di/Container';
import {SubwaysRepository} from '../../subways/SubwaysRepository';
import {Loading} from '../../components/Loading';

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

    private subwaysRepository = DiContainer.get<SubwaysRepository>(SubwaysRepository);

    public async componentDidMount() {
        this.setLoading(true);
        this.setSubways(await this.subwaysRepository.getStoredSubways());
        this.setLoading(false);
    }

    private setSubways(subways: Subway[]): void {
        this.setState({subways});
    }

    public render() {
        if (this.state.loading) {
            return (
                <Loading/>
            );
        }

        return (
            <AlarmFormScreenView
                subways={this.state.subways}
                error={this.state.error}
            />
        );
    }
}
