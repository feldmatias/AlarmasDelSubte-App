import {Alarm} from '../../src/alarms/model/Alarm';
import {AlarmSubwayFixture} from './AlarmSubwayFixture';
import {AlarmSubway} from '../../src/alarms/model/AlarmSubway';

export class AlarmFixture {

    private alarm: Alarm;

    public constructor() {
        this.alarm = new Alarm();
        this.alarm.id = 1;
        this.alarm.name = 'alarm';
        this.alarm.start = '10:01';
        this.alarm.end = '20:02';
        this.alarm.days = ['day'];
        this.alarm.subways = [new AlarmSubwayFixture().get()];
    }

    public withId(id: number): AlarmFixture {
        this.alarm.id = id;
        return this;
    }

    public withName(name: string): AlarmFixture {
        this.alarm.name = name;
        return this;
    }

    public withStart(start: string): AlarmFixture {
        this.alarm.start = start;
        return this;
    }

    public withEnd(end: string): AlarmFixture {
        this.alarm.end = end;
        return this;
    }

    public withDays(days: string[]): AlarmFixture {
        this.alarm.days = days;
        return this;
    }

    public withSubways(subways: AlarmSubway[]): AlarmFixture {
        this.alarm.subways = subways;
        return this;
    }

    public get(): Alarm {
        return this.alarm;
    }
}
