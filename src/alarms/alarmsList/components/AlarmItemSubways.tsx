import React, {Component} from 'react';
import {FlatList, Image, ListRenderItem, StyleSheet} from 'react-native';
import {AlarmSubway} from '../../model/AlarmSubway';

interface Props {
    subways: AlarmSubway[]
}

interface State {

}

export class AlarmItemSubways extends Component<Props, State> {

    private renderItem: ListRenderItem<AlarmSubway> = ({item}) => (
        <Image
            testID="alarmSubwayIcon"
            source={{uri: item.icon}}
            style={styles.icon}
        />
    );

    public render() {
        return (
            <FlatList
                horizontal={true}
                data={this.props.subways}
                renderItem={this.renderItem}
                keyExtractor={item => item.line}
            />
        );
    }

}

const styles = StyleSheet.create({
    icon: {
        width: 30,
        height: 30,
        marginHorizontal: 5,
    },
});
