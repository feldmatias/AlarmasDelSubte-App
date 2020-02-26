import {gql} from 'apollo-boost';

export const alarmResponseData = gql`
    fragment AlarmResponseData on Alarm {
        id
        name
        days
        start
        end
        subways {
            line
            icon
        }
    }
`;
