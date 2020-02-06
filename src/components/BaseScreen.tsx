import {NavigationStackProp} from 'react-navigation-stack';
import {Component} from 'react';
import {Navigation} from '../screens/Navigation';

export interface ScreenProps {
    navigation: NavigationStackProp
}

export interface ScreenState {
    loading: boolean
    error: string
}

export abstract class BaseScreen<Props extends ScreenProps, State extends ScreenState> extends Component<Props, State> {

    protected setLoading(loading: boolean): void {
        this.setState({loading});
        if (loading) {
            this.setError('');
        }
    }

    protected setError(error: string): void {
        this.setState({error});
    }

    protected navigation(): Navigation {
        return new Navigation(this.props.navigation);
    }
}
