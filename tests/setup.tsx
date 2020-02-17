import 'react-native';
import {NativeModules} from 'react-native';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
NativeModules.RNCAsyncStorage = {};
jest.useFakeTimers();
