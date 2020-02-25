import {Subway} from '../../subways/model/Subway';

export class AlarmInput {

    public name: string = '';

    public days: string[] = [];

    public start: string =  '00:00';

    public end: string =  '23:59';

    public subwayLines: string[] = [];

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

    public addSubway(subway: Subway): AlarmInput {
        this.subwayLines.push(subway.line);
        return this;
    }

    public removeSubway(toRemove: Subway): AlarmInput {
        this.subwayLines = this.subwayLines.filter(line => line !== toRemove.line);
        return this;
    }

    public isValid(): boolean {
        return this.name !== '' &&
            this.days.length !== 0 &&
            this.subwayLines.length !== 0 &&
            this.isValidTimeRange();
    }

    public isValidTimeRange(): boolean {
        return this.start < this.end;
    }

}
