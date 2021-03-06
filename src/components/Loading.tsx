import React, {Component} from 'react';
import {View} from 'react-native';
import {BarIndicator} from 'react-native-indicators';
import {Colors} from '../styles/Colors';
import {screenContainerStyles} from '../styles/ScreenStyles';

interface Props {

}

interface State {

}

export class Loading extends Component<Props, State> {

    public render() {
        return (
            <View testID="loading" style={screenContainerStyles}>
                <BarIndicator color={Colors.primary} count={6}/>
            </View>
        );
    }
}
