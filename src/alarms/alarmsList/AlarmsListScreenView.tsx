import React, {Component} from 'react';
import {FlatList, ListRenderItem, SafeAreaView, StyleSheet, View} from 'react-native';
import {screenStyles} from '../../styles/ScreenStyles';
import {ListEmpty} from '../../components/ListEmpty';
import {ListItemSeparator} from '../../components/ListItemSeparator';
import {listStyles} from '../../styles/ListStyles';
import {Alarm} from '../model/Alarm';
import {AlarmItem} from './AlarmItem';
import {FloatingActionButton} from '../../components/FloatingActionButton';
import {alarmStrings} from '../../strings/AlarmStrings';

interface Props {
    alarms: Alarm[]
    error: string
    refreshing: boolean
    refresh: () => Promise<void>
    deleteAlarm: (alarm: Alarm) => Promise<void>
    createAlarm: () => void
}

interface State {

}

export class AlarmsListScreenView extends Component<Props, State> {

    private renderItem: ListRenderItem<Alarm> = ({item}) => (
        <AlarmItem
            alarm={item}
            deleteAlarm={this.props.deleteAlarm}
        />
    );

    private renderEmptyListComponent = () => {
        return (
            <ListEmpty
                error={this.props.error}
                emptyMessage={alarmStrings.alarmsListScreen.noAlarmsMessage}
            />
        );
    };

    private renderHeaderFooterComponent = () => {
        if (this.props.alarms.length === 0) {
            return null;
        }

        return (
            <ListItemSeparator/>
        );
    };

    public render() {
        return (
            <View style={screenStyles.scroll}>
                <SafeAreaView style={[screenStyles.container, styles.list]}>

                    <FlatList
                        testID="alarmsList"
                        contentContainerStyle={listStyles.contentContainer}
                        style={screenStyles.scroll}
                        data={this.props.alarms}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id.toString()}
                        ListEmptyComponent={this.renderEmptyListComponent}
                        ItemSeparatorComponent={ListItemSeparator}
                        ListHeaderComponent={this.renderHeaderFooterComponent}
                        ListFooterComponent={this.renderHeaderFooterComponent}
                        refreshing={this.props.refreshing}
                        onRefresh={this.props.refresh}
                    />

                </SafeAreaView>

                <FloatingActionButton
                    icon="plus"
                    onPress={this.props.createAlarm}
                />

            </View>
        );
    }

}

const styles = StyleSheet.create({
    list: {
        marginVertical: 25,
    },
});
