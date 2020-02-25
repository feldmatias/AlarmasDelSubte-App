import React, {Component} from 'react';
import {FlatList, Image, ListRenderItem, StyleSheet, Text, TouchableHighlight} from 'react-native';
import {Subway} from '../../../subways/model/Subway';
import {Colors} from '../../../styles/Colors';

interface Props {
    subways: Subway[]
    selectedSubwayLines: string[]
    selectSubway: (subway: Subway) => void
    deselectSubway: (subway: Subway) => void
}

interface State {

}

export class AlarmFormSubways extends Component<Props, State> {

    private isSelected(subway: Subway): boolean {
        return this.props.selectedSubwayLines.includes(subway.line);
    }

    private renderItem: ListRenderItem<Subway> = ({item}) => {
        if (this.isSelected(item)) {
            return this.renderSelectedItem(item);
        }
        return this.renderNotSelectedItem(item);
    };

    private renderSelectedItem(subway: Subway) {
        return (
            <TouchableHighlight
                testID={'alarmFormSubwayEnabled' + subway.line}
                onPress={() => this.props.deselectSubway(subway)}
                underlayColor={Colors.transparent}
            >

                <Image
                    testID="subwayIcon"
                    source={{uri: subway.icon}}
                    style={styles.icon}
                />

            </TouchableHighlight>
        );
    }

    private renderNotSelectedItem(subway: Subway) {
        return (
            <Text
                testID={'alarmFormSubwayDisabled' + subway.line}
                style={styles.notSelectedSubway}
                onPress={() => this.props.selectSubway(subway)}
            >
                {subway.line}
            </Text>
        );
    }

    public render() {
        return (
            <FlatList
                style={styles.list}
                horizontal={true}
                data={this.props.subways}
                renderItem={this.renderItem}
                keyExtractor={item => item.line}
            />
        );
    }
}

const styles = StyleSheet.create({
    list: {
      marginVertical: 20,
    },
    icon: {
        width: 37,
        height: 37,
        marginHorizontal: 5,
    },
    notSelectedSubway:{
        fontSize: 25,
        fontWeight: 'bold',
        height: 37,
        width: 37,
        backgroundColor: Colors.lightGrey,
        color: Colors.white,
        textAlign: 'center',
        textAlignVertical: 'center',
        marginHorizontal: 5,
        borderRadius: 999,
    },
});
