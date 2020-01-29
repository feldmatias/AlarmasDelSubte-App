import 'react-native-gesture-handler';
import 'reflect-metadata';
import React from 'react';
import HelloWorldApp from './component';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import {DetailsScreen} from './component2';

const AppNavigator = createStackNavigator({
    Home: {
        screen: HelloWorldApp,
    },
    details: DetailsScreen,
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
    public render() {
        return <AppContainer />;
    }
}
