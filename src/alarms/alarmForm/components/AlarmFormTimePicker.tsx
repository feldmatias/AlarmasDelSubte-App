import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TimePicker} from '../../../components/TimePicker';
import {inputStyles} from '../../../styles/InputStyles';
import {Colors} from '../../../styles/Colors';
import {Button} from 'react-native-elements';

interface Props {
    testID: string
    label: string
    time: string
    onChange: (time: string) => void
}

interface State {

}

export class AlarmFormTimePicker extends Component<Props, State> {

    private timePicker!: TimePicker;

    private openTimePicker = (): void => {
        this.timePicker.open();
    };

    public render() {
        return (
            <View style={styles.container}>

                <Text style={styles.time}>
                    {this.props.label}
                </Text>

                <View style={[inputStyles.text, styles.timeContainer]}>

                    <Text testID={this.props.testID + 'Time'} style={styles.time}>
                        {this.props.time}
                    </Text>

                    <Button
                        testID={this.props.testID + 'OpenTimePicker'}
                        buttonStyle={styles.button}
                        onPress={this.openTimePicker}
                        type="solid"
                        icon={{
                            name: 'alarm',
                            color: Colors.black,
                            size: 20,
                        }}
                    />

                    <TimePicker
                        reference={picker => {
                            this.timePicker = picker;
                        }}
                        time={this.props.time}
                        onChange={this.props.onChange}
                    />

                </View>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 30,
    },
    timeContainer: {
        flexDirection: 'row',
        paddingRight: 5,
        paddingVertical: 5,
    },
    time: {
        fontSize: 20,
        textAlignVertical: 'center',
        marginRight: 10,
    },
    button: {
        backgroundColor: Colors.lightGrey,
    },
});
