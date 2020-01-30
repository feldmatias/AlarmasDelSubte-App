import 'react-native-gesture-handler';
import 'reflect-metadata';
import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import LoginScreen from "./auth/login/LoginScreen";

const AppNavigator = createStackNavigator({
    Login: LoginScreen
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
    public render() {
        return <AppContainer/>;
    }
}
