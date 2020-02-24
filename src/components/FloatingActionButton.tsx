import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';
import {Colors} from '../styles/Colors';

interface Props {
    icon: string,
    onPress: () => void
}

interface State {

}

export class FloatingActionButton extends Component<Props, State> {

    public render() {
        return (
            <FAB
                testID="fab"
                style={styles.fab}
                icon={this.props.icon}
                onPress={this.props.onPress}
            />
        );
    }
}

const styles = StyleSheet.create({
    fab: {
        color: Colors.white,
        backgroundColor: Colors.primary,
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 0,
    },
});
