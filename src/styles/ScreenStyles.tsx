import {StyleSheet} from 'react-native';
import {Colors} from './Colors';

export const screenStyles = StyleSheet.create({
    scroll: {
        height: '100%',
        width: '100%',
        backgroundColor: Colors.white,
    },
    container: {
        alignItems: 'center',
    },
    centeredContainer: {
        justifyContent: 'center',
    },

});

export const screenContainerStyles = [screenStyles.scroll, screenStyles.container, screenStyles.centeredContainer];
