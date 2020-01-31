import 'react-native-gesture-handler';
import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import {Routes} from './screens/Routes';
import {Colors} from './styles/Colors';
import {LoginScreen} from './auth/login/LoginScreen';

const AppNavigator = createStackNavigator({
    Login: LoginScreen,
}, {
    initialRouteName: Routes.Login,
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
    },
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
    public render() {
        return <AppContainer/>;
    }
}
