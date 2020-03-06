import 'react-native-gesture-handler';
import 'reflect-metadata';
import React from 'react';
import AppContainer from './screens/AppNavigator';
import {PushNotificationsService} from "./notifications/PushNotificationsService";


export default class App extends React.Component {

    private pushNotificationsService = new PushNotificationsService();

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
