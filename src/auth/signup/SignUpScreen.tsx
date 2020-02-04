import React, {Component} from 'react';
import {StackNavigationOptions} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {Text} from 'react-native';

interface Props {

}

interface State {

}

const strings = {
    screenTitle: 'Nuevo Usuario',
};

export class SignUpScreen extends Component<Props, State> {

    public static navigationOptions: StackNavigationOptions = {
        title: strings.screenTitle,
    };

    public state: State = {};

    public render() {
        return (
            <Text>{'Sign up'}</Text>
        );
    }
}
