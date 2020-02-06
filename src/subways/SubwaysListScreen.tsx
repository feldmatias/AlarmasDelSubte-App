import React from 'react';
import {StackNavigationOptions} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {BaseScreen, ScreenProps, ScreenState} from '../components/BaseScreen';
import {Text} from 'react-native';

interface Props extends ScreenProps {
}

interface State extends ScreenState {

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
    };

    public render() {
        return (
            <Text>{'Subways list'}</Text>
        );
    }
}
