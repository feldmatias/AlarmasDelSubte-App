import React, {Component} from 'react';
import {FlatList, ListRenderItem, SafeAreaView} from 'react-native';
import {screenStyles} from '../styles/ScreenStyles';
import {Subway} from './model/Subway';
import {SubwayItem} from './SubwayItem';

interface Props {
    subways: Subway[]
}

interface State {

}

export class SubwaysListScreenView extends Component<Props, State> {

    private renderItem: ListRenderItem<Subway> = ({item}) => (
        <SubwayItem subway={item}/>
    );

    public render() {
        return (
            <SafeAreaView style={screenStyles.container}>
                <FlatList
                    style={screenStyles.scroll}
                    data={this.props.subways}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.line}
                />
            </SafeAreaView>
        );
    }

}
