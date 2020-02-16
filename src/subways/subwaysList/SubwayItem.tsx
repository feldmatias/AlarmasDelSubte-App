import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Subway} from '../model/Subway';

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

    public render() {
        return (
            <View style={styles.container}>
                <View style={styles.itemContainer}>

                    <Image
                        source={{uri: this.props.subway.icon}}
                        style={styles.icon}
                    />

                    <Text style={styles.title}>
                        {this.subwayTitle()}
                    </Text>

                    <Text style={styles.status}>
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
