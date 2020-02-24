import 'react-native';
import {NativeModules} from 'react-native';

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
