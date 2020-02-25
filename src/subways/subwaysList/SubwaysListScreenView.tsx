import React, {Component} from 'react';
import {FlatList, ListRenderItem, SafeAreaView, StyleSheet} from 'react-native';
import {screenStyles} from '../../styles/ScreenStyles';
import {Subway} from '../model/Subway';
import {SubwayItem} from './SubwayItem';
import {ListEmpty} from '../../components/ListEmpty';
import {ListItemSeparator} from '../../components/ListItemSeparator';
import {SubwaysListFooter} from './components/SubwaysListFooter';
import {listStyles} from '../../styles/ListStyles';
import {subwayStrings} from '../../strings/SubwayStrings';

interface Props {
    subways: Subway[]
    error: string
    refreshing: boolean
    refresh: () => Promise<void>
}

interface State {

}

export class SubwaysListScreenView extends Component<Props, State> {

    private renderItem: ListRenderItem<Subway> = ({item}) => (
        <SubwayItem subway={item}/>
    );

    private renderEmptyListComponent = () => {
        return (
            <ListEmpty
                error={this.props.error}
                emptyMessage={subwayStrings.subwaysListScreen.noSubwaysMessage}
            />
        );
    };

    private renderFooterComponent = () => {
        return (
            <SubwaysListFooter subways={this.props.subways}/>
        );
    };

    private renderHeaderComponent = () => {
        if (this.props.subways.length === 0) {
            return null;
        }

        return (
            <ListItemSeparator/>
        );
    };

    public render() {
        return (
            <SafeAreaView style={screenStyles.container}>
                <FlatList
                    testID="subwaysList"
                    contentContainerStyle={listStyles.contentContainer}
                    style={[screenStyles.scroll, styles.list]}
                    data={this.props.subways}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.line}
                    ListEmptyComponent={this.renderEmptyListComponent}
                    ItemSeparatorComponent={ListItemSeparator}
                    ListHeaderComponent={this.renderHeaderComponent}
                    ListFooterComponent={this.renderFooterComponent}
                    refreshing={this.props.refreshing}
                    onRefresh={this.props.refresh}
                />
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({
    list: {
        paddingTop: 25,
    },
});
