import {StyleSheet} from 'react-native';
import {Colors} from './Colors';

export const buttonStyles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 37,
        paddingVertical: 9,
        borderRadius: 10,
    },
    buttonCancel: {
        backgroundColor: Colors.red,
        paddingHorizontal: 37,
        paddingVertical: 9,
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
    },
});
