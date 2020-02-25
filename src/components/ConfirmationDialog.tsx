import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {Colors} from '../styles/Colors';
import {Button} from 'react-native-elements';
import {buttonStyles} from '../styles/ButtonStyles';
import {confirmationDialogStrings} from '../strings/ConfirmationDialogStrings';

interface Props {
    message: string
    onConfirm: () => Promise<void>
    reference: (dialog: ConfirmationDialog) => void
}

interface State {
    visible: boolean
}

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

    private confirm = async (): Promise<void> => {
        this.hide();
        this.props.onConfirm();
    };

    private setVisible(visible: boolean): void {
        this.setState({visible});
    }

    public componentDidMount(): void {
        this.props.reference(this);
    }

    public render() {
        if (!this.state.visible) {
            return null;
        }

        return (
            <Modal isVisible={true}>

                <View testID="confirmationDialog" style={styles.container}>

                    <Text style={styles.title}>
                        {this.props.message}
                    </Text>

                    <View style={styles.buttonContainer}>

                        <Button testID="dialogCancel"
                                title={confirmationDialogStrings.cancel}
                                buttonStyle={[buttonStyles.buttonCancel]}
                                titleStyle={buttonStyles.title}
                                onPress={this.hide}
                        />

                        <Button testID="dialogConfirm"
                                title={confirmationDialogStrings.confirm}
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
