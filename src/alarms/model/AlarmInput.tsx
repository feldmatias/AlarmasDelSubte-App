export class AlarmInput {

    public name: string = '';

    public days: string[] = [];

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

}
