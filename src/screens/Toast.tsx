import {ToastAndroid} from 'react-native';

export class Toast {

    public static show(message: string): void {
        ToastAndroid.show(message, ToastAndroid.LONG);
    }
}
