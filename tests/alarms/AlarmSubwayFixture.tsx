import {AlarmSubway} from '../../src/alarms/model/AlarmSubway';

export class AlarmSubwayFixture {

    private alarmSubway: AlarmSubway;

    public constructor() {
        this.alarmSubway = new AlarmSubway();
        this.alarmSubway.line = 'line';
        this.alarmSubway.icon = 'icon';
    }

    public withLine(line: string): AlarmSubwayFixture {
        this.alarmSubway.line = line;
        return this;
    }

    public withIcon(icon: string): AlarmSubwayFixture {
        this.alarmSubway.icon = icon;
        return this;
    }

    public get(): AlarmSubway {
        return this.alarmSubway;
    }
}
