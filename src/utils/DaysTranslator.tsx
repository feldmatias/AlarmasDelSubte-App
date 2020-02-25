import {strings} from '../strings/Strings';

export class DaysTranslator {

    public static readonly days = new Map([
        ['monday', strings.days.monday],
        ['tuesday', strings.days.tuesday],
        ['wednesday', strings.days.wednesday],
        ['thursday', strings.days.thursday],
        ['friday', strings.days.friday],
        ['saturday', strings.days.saturday],
        ['sunday', strings.days.sunday],
    ]);

    public static translate(day: string): string {
        return this.days.get(day) || day;
    }
}
