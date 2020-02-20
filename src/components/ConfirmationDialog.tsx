import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {Colors} from '../styles/Colors';
import {Button} from 'react-native-elements';
import {buttonStyles} from '../styles/ButtonStyles';

interface Props {
    message: string
    onConfirm: () => Promise<void>
    instance: (dialog: ConfirmationDialog) => void
}

interface State {
    visible: boolean
}

const strings = {
    confirm: 'Confirmar',
    cancel: 'Cancelar',
};

export class ConfirmationDialog extends Component<Props, State> {

    public state: State = {
        visible: false,
    };

    public show = (): void => {
        this.setVisible(true);
    };

    private hide = (): void => {
        this.setVisible(false);
    };

    private confirm = (): void => {
        this.hide();
        this.props.onConfirm();
    };

    private setVisible(visible: boolean): void {
        this.setState({visible});
    }

    public componentDidMount(): void {
        this.props.instance(this);
    }

    public render() {
        return (
            <Modal testID="confirmationDialog" isVisible={this.state.visible}>

                <View style={styles.container}>

                    <Text style={styles.title}>
                        {this.props.message}
                    </Text>

                    <View style={styles.buttonContainer}>

                        <Button testID="dialogCancel"
                                title={strings.cancel}
                                buttonStyle={[buttonStyles.buttonCancel]}
                                titleStyle={buttonStyles.title}
                                onPress={this.hide}
                        />

                        <Button testID="dialogConfirm"
                                title={strings.confirm}
                                buttonStyle={[buttonStyles.button, styles.confirmButton]}
                                titleStyle={buttonStyles.title}
                                onPress={this.confirm}
                        />

                    </View>

                </View>

            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: 27,
        marginBottom: 25,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    confirmButton: {
        marginLeft: 10,
    },
});
