import React, {Component} from 'react';
import {FlatList, ListRenderItem, SafeAreaView, StyleSheet} from 'react-native';
import {screenStyles} from '../../styles/ScreenStyles';
import {Subway} from '../model/Subway';
import {SubwayItem} from './SubwayItem';
import {SubwaysListEmpty} from './components/SubwaysListEmpty';
import {ListItemSeparator} from '../../components/ListItemSeparator';
import {SubwaysListFooter} from './components/SubwaysListFooter';

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
            <SubwaysListEmpty error={this.props.error}/>
        );
    };

    private renderFooterComponent = () => {
        return (
            <SubwaysListFooter subways={this.props.subways}/>
        );
    };

    public render() {
        return (
            <SafeAreaView style={screenStyles.container}>
                <FlatList
                    testID="subwaysList"
                    contentContainerStyle={styles.listContentContainer}
                    style={[screenStyles.scroll, styles.list]}
                    data={this.props.subways}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.line}
                    ListEmptyComponent={this.renderEmptyListComponent}
                    ItemSeparatorComponent={ListItemSeparator}
                    ListHeaderComponent={ListItemSeparator}
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
    listContentContainer: {
        flexGrow: 1,
    },
});
