import React from 'react';
import {StackNavigationOptions} from 'react-navigation-stack/lib/typescript/src/vendor/types';
import {BaseScreen, ScreenProps, ScreenState} from '../components/BaseScreen';
import {SubwaysListScreenView} from './SubwaysListScreenView';
import {Subway} from './model/Subway';
import {SubwayStatus} from './model/SubwayStatus';

interface Props extends ScreenProps {
}

interface State extends ScreenState {

}

const strings = {
    screenTitle: 'Estado del Subte',
};

export class SubwaysListScreen extends BaseScreen<Props, State> {

    public static navigationOptions: StackNavigationOptions = {
        title: strings.screenTitle,
    };

    public state: State = {
        loading: false,
        error: '',
    };

    public render() {
        return (
            <SubwaysListScreenView subways={subways}/>
        );
    }
}

const subways = [
    createSubway('A'),
    createSubway('B'),
    createSubway('C'),
    createSubway('D'),
    createSubway('E'),
    createSubway('F'),
    createSubway('G'),
    createSubway('H'),
    createSubway('I'),
    createSubway('J'),
    createSubway('K'),
    createSubway('L'),
    createSubway('M'),
    createSubway('N'),
    createSubway('O'),
];

function createSubway(line: string): Subway {
    const subway = new Subway();
    subway.line = line;
    subway.icon = 'https://raw.githubusercontent.com/feldmatias/AlarmasDelSubte/master/static/images/lineC.png';
    subway.status = 'The subway is normal but it will be broken in 1 hour and a half';
    subway.statusType = SubwayStatus.Normal;
    subway.updatedAt = new Date();
    return subway;
}
