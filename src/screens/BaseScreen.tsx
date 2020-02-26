import {NavigationStackProp} from 'react-navigation-stack';
import {Component} from 'react';
import {Navigation} from './Navigation';
import {NavigationRoute} from 'react-navigation';

export interface NavigationParams {

}

interface ScreenProps<T extends NavigationParams> {
    navigation: NavigationStackProp<NavigationRoute, T>
}

export interface ScreenState {
    loading: boolean
    error: string
}

export abstract class BaseScreen<State extends ScreenState, Params extends NavigationParams> extends Component<ScreenProps<Params>, State> {

    protected setLoading(loading: boolean): void {
        this.setState({loading});
        if (loading) {
            this.setError('');
        }
    }

    protected setError(error: string): void {
        this.setState({error});
    }

    protected navigation(): Navigation<Params> {
        return new Navigation(this.props.navigation);
    }
}
