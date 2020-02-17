import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Colors} from '../styles/Colors';

interface Props {

}

interface State {

}

export class ListItemSeparator extends Component<Props, State> {

    public render() {
        return (
            <View style={styles.separator}/>
        );
    }
}

const styles = StyleSheet.create({
    separator: {
        height: 1,
        width: '90%',
        backgroundColor: Colors.grey,
        alignSelf: 'center',
    },
});
