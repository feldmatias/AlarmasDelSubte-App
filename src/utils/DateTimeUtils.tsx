import moment from 'moment';

export class DateTimeUtils {

    public static timeToDate(time: string): Date {
        const [hours, minutes] = time.split(':');

        return moment()
            .hours(parseInt(hours, 10))
            .minutes(parseInt(minutes, 10))
            .toDate();
    }

}
