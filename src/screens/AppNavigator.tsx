import {createStackNavigator} from 'react-navigation-stack';
import {LoginScreen} from '../auth/login/LoginScreen';
import {SignUpScreen} from '../auth/signup/SignUpScreen';
import {SubwaysListScreen} from '../subways/subwaysList/SubwaysListScreen';
import {AlarmsListScreen} from '../alarms/alarmsList/AlarmsListScreen';
import {AlarmFormScreen} from '../alarms/alarmForm/AlarmFormScreen';
import {Colors} from '../styles/Colors';
import {createAppContainer} from 'react-navigation';
import {NavigationRoutes} from './NavigationRoutes';

const navigationRoutes = {
    Login: LoginScreen,
    SignUp: SignUpScreen,
    SubwaysList: SubwaysListScreen,
    AlarmsList: AlarmsListScreen,
    AlarmForm: AlarmFormScreen,
};

const navigationOptions = {
    initialRouteName: NavigationRoutes.Login,
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
    },
};

const AppNavigator = createStackNavigator(navigationRoutes, navigationOptions);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
