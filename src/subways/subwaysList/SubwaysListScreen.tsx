import React from 'react';
import {StackNavigationOptions} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {BaseScreen, ScreenProps, ScreenState} from '../../components/BaseScreen';
import {SubwaysListScreenView} from './SubwaysListScreenView';
import {Subway} from '../model/Subway';
import DiContainer from '../../di/Container';
import {SubwaysRepository} from '../SubwaysRepository';
import {Loading} from '../../components/Loading';

interface Props extends ScreenProps {
}

interface State extends ScreenState {
    subways: Subway[]
}

const strings = {
    screenTitle: 'Estado del Subte',
};

export class SubwaysListScreen extends BaseScreen<Props, State> {

    public static navigationOptions: StackNavigationOptions = {
        title: strings.screenTitle,
    };

    public state: State = {
        loading: false,
        error: '',
        subways: [],
    };

    private subwaysRepository = DiContainer.get<SubwaysRepository>(SubwaysRepository);

    public async getSubways(): Promise<void> {
        this.setLoading(true);
        const subways = await this.subwaysRepository.getSubways();
        this.setLoading(false);
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
        await this.getSubways();
    }

    public render() {
        if (this.state.loading) {
            return (
                <Loading />
            );
        }

        return (
            <SubwaysListScreenView
                subways={this.state.subways}
                error={this.state.error}
            />
        );
    }
}

