export class DaysTranslator {

    public static readonly days = new Map([
        ['monday', 'Lunes'],
        ['tuesday', 'Martes'],
        ['wednesday', 'Miércoles'],
        ['thursday', 'Jueves'],
        ['friday', 'Viernes'],
        ['saturday', 'Sábado'],
        ['sunday', 'Domingo'],
    ]);

    public static translate(day: string): string {
        return this.days.get(day) || day;
    }
}
