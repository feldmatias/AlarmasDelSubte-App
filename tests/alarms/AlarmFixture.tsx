import {Alarm} from '../../src/alarms/model/Alarm';

export class AlarmFixture {

    private alarm: Alarm;

    public constructor() {
        this.alarm = new Alarm();
        this.alarm.id = 1;
        this.alarm.name = 'alarm';
    }

    public withId(id: number): AlarmFixture {
        this.alarm.id = id;
        return this;
    }

    public withName(name: string): AlarmFixture {
        this.alarm.name = name;
        return this;
    }

    public get(): Alarm {
        return this.alarm;
    }
}
