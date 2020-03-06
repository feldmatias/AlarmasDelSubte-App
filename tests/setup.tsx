import 'react-native';
import 'reflect-metadata';
import {NativeModules} from 'react-native';
import {MockNotificationsChannel} from './notifications/MockNotificationChannel';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

NativeModules.RNCAsyncStorage = {};

jest.useFakeTimers();


jest.mock('react-navigation', () => ({
    NavigationEvents: 'mockNavigationEvents',
    NavigationActions: {navigate: jest.fn().mockImplementation(x => x)},
    StackActions: {
        push: jest.fn().mockImplementation(x => ({...x, 'type': 'Navigation/PUSH'})),
        replace: jest.fn().mockImplementation(x => ({...x, 'type': 'Navigation/REPLACE'})),
        reset: jest.fn().mockImplementation(x => ({...x, 'type': 'Navigation/RESET'})),
    },
}));

jest.mock('react-native-firebase', () => ({
    notifications: {
        Android: {
            Channel: MockNotificationsChannel,
            Importance: {
                Max: {},
            },
        },
    },
}));
