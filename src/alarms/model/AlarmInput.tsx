export class AlarmInput {

    public name: string = '';

    public days: string[] = [];

    public start = '00:00';

    public end = '23:59';

    public setName(name: string): AlarmInput {
        this.name = name;
        return this;
    }

    public addDay(day: string): AlarmInput {
        this.days.push(day);
        return this;
    }

    public removeDay(toRemove: string): AlarmInput {
        this.days = this.days.filter(day => day !== toRemove);
        return this;
    }

    public setStart(start: string): AlarmInput {
        this.start = start;
        return this;
    }

    public setEnd(end: string): AlarmInput {
        this.end = end;
        return this;
    }

}
