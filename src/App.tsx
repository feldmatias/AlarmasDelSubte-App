import 'react-native-gesture-handler';
import 'reflect-metadata';
import React from 'react';
import AppContainer from './screens/AppNavigator';
import {PushNotificationsService} from './notifications/PushNotificationsService';
import DiContainer from './di/Container';


export default class App extends React.Component {

    private pushNotificationsService = DiContainer.get<PushNotificationsService>(PushNotificationsService);

    public async componentDidMount() {
        await this.pushNotificationsService.start();
    }

    public componentWillUnmount() {
        this.pushNotificationsService.stop();
    }

    public render() {
        return <AppContainer/>;
    }
}
