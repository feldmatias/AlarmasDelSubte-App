import {AlarmSubway} from './AlarmSubway';

export class Alarm {

    public id!: number;

    public name!: string;

    public days!: string[];

    public start!: string;

    public end!: string;

    public subways!: AlarmSubway[];
}
