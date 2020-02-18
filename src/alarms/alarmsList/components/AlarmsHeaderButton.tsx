import React, {Component} from 'react';
import {Colors} from '../../../styles/Colors';
import {Button} from 'react-native-elements';

interface Props {
    onPress: () => void
}

interface State {

}

export class AlarmsHeaderButton extends Component<Props, State> {

    public render() {
        return (
            <Button
                testID="alarmsHeaderButton"
                onPress={this.props.onPress}
                type="clear"
                icon={{
                    name: 'alarm',
                    color: Colors.white,
                    size: 35,
                }}
            />
        );
    }
}
