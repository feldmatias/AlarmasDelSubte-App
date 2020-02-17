import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Subway} from '../model/Subway';
import {SubwayStatus} from '../model/SubwayStatus';
import {Colors} from '../../styles/Colors';

interface Props {
    subway: Subway
}

interface State {

}

const strings = {
    subwayTitle: 'Subte',
};

export class SubwayItem extends Component<Props, State> {

    private subwayTitle(): string {
        return strings.subwayTitle + ' ' + this.props.subway.line;
    }

    private getStatusColor(): string {
        switch (this.props.subway.statusType){
            case SubwayStatus.Normal:
                return Colors.green;
            case SubwayStatus.Limited:
                return Colors.orange;
            case SubwayStatus.Closed:
                return Colors.red;
        }
    }

    public render() {
        return (
            <View style={styles.container} testID="subwayItem">
                <View style={styles.itemContainer}>

                    <Image
                        testID="subwayIcon"
                        source={{uri: this.props.subway.icon}}
                        style={styles.icon}
                    />

                    <Text style={styles.title}>
                        {this.subwayTitle()}
                    </Text>

                    <Text testID="subwayStatus" style={[{color: this.getStatusColor()}, styles.status]}>
                        {this.props.subway.status}
                    </Text>

                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        marginLeft: 15,
    },
    icon: {
        width: 50,
        height: 50,
        marginLeft: 20,
    },
    status: {
        marginHorizontal: 28,
        flex: 1,
        fontSize: 16,
        textAlign: 'center',
    },
});
