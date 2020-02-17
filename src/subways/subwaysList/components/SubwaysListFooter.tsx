import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../../styles/Colors';
import {Subway} from '../../model/Subway';
import {ListItemSeparator} from '../../../components/ListItemSeparator';
import moment from 'moment';

interface Props {
    subways: Subway[]
}

interface State {

}

const strings = {
    updated: 'Actualizado:',
};

export class SubwaysListFooter extends Component<Props, State> {

    private readonly dateFormat = 'DD/MM HH:mm';

    private getUpdatedMessage(): string {
        return strings.updated + ' ' + this.getSubwaysUpdated();
    }

    private getSubwaysUpdated(): string {
        const minUpdatedAt = this.props.subways.map(subway => subway.updatedAt)
            .reduce((a, b) => a < b ? a : b, new Date());
        return moment(minUpdatedAt).format(this.dateFormat);
    }

    public render() {
        if (this.props.subways.length === 0) {
            return null;
        }

        return (
            <View>

                <ListItemSeparator/>

                <Text testID="subwayLastUpdate" style={styles.updated}>
                    {this.getUpdatedMessage()}
                </Text>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    updated: {
        textAlign: 'center',
        color: Colors.grey,
        marginTop: 15,
    },
});
