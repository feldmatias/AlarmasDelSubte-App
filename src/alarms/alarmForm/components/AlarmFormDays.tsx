import React, {Component} from 'react';
import {FlatList, ListRenderItem, StyleSheet, Text} from 'react-native';
import {DaysTranslator} from '../../../utils/DaysTranslator';
import {Colors} from '../../../styles/Colors';

interface Props {
    selectedDays: string[]
    selectDay: (day: string) => void
    deselectDay: (day: string) => void
}

interface State {

}

export class AlarmFormDays extends Component<Props, State> {

    private getDays(): string[] {
        return Array.from(DaysTranslator.days.keys());
    }

    private getItemColor(day: string): string {
        return this.props.selectedDays.includes(day) ? Colors.black : Colors.grey;
    }

    private onDayPressed = (day: string): void => {
        if (this.props.selectedDays.includes(day)) {
            this.props.deselectDay(day);
        } else {
            this.props.selectDay(day);
        }
    };

    private renderItem: ListRenderItem<string> = ({item}) => (
        <Text
            testID={'alarmFormDay' + item}
            style={[{color: this.getItemColor(item)}, styles.day]}
            onPress={() => this.onDayPressed(item)}
        >
            {DaysTranslator.translate(item).charAt(0).toUpperCase()}
        </Text>
    );

    public render() {
        return (
            <FlatList
                horizontal={true}
                data={this.getDays()}
                renderItem={this.renderItem}
                keyExtractor={item => item}
            />
        );
    }

}

const styles = StyleSheet.create({
    day: {
        fontSize: 30,
        fontWeight: 'bold',
        marginHorizontal: 12,
    },
});
