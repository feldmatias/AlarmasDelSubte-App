import React, {Component} from 'react';
import {FlatList, ListRenderItem, SafeAreaView, StyleSheet} from 'react-native';
import {screenStyles} from '../../styles/ScreenStyles';
import {Subway} from '../model/Subway';
import {SubwayItem} from './SubwayItem';
import {SubwaysListEmpty} from './components/SubwaysListEmpty';

interface Props {
    subways: Subway[]
    error: string
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

    public render() {
        return (
            <SafeAreaView style={screenStyles.container}>
                <FlatList
                    contentContainerStyle={styles.listContentContainer}
                    style={screenStyles.scroll}
                    data={this.props.subways}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.line}
                    ListEmptyComponent={this.renderEmptyListComponent}
                />
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({
    listContentContainer: {
        flexGrow: 1,
    },
});
