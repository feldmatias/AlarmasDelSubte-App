import React from 'react';
import {StackNavigationOptions} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {BaseScreen, ScreenProps, ScreenState} from '../../screens/BaseScreen';
import {alarmStrings} from '../../strings/AlarmStrings';
import {AlarmFormScreenView} from './AlarmFormScreenView';

interface Props extends ScreenProps {
}

interface State extends ScreenState {
}

export class AlarmFormScreen extends BaseScreen<Props, State> {

    public static navigationOptions: StackNavigationOptions = {
        title: alarmStrings.alarmFormScreen.screenTitle,
    };

    public state: State = {
        loading: false,
        error: '',
    };

    public render() {
        return (
            <AlarmFormScreenView/>
        );
    }
}
