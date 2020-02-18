import {RenderAPI} from 'react-native-testing-library';
import {GraphQLOperation} from '../../../src/graphql/GraphQLClient';
import {MockNavigation} from '../../screens/MockNavigation';
import {ScreenTestUtils} from '../../screens/ScreenTestUtils';
import MockGraphQLClient from '../../graphql/MockGraphQLClient';
import MockStorage from '../../storage/MockStorage';
import {GraphQLService} from '../../../src/graphql/GraphQLService';
import React from 'react';
import {AlarmsListScreen} from '../../../src/alarms/alarmsList/AlarmsListScreen';
import {AlarmsListQuery} from '../../../src/alarms/alarmsList/AlarmsListQuery';
import {Alarm} from '../../../src/alarms/model/Alarm';
import {AlarmFixture} from '../AlarmFixture';
import {AlarmSubwayFixture} from '../AlarmSubwayFixture';
import {DaysTranslator} from '../../../src/utils/DaysTranslator';

describe('Alarms List Screen', () => {

    let renderApi: RenderAPI;
    let alarmsQuery: GraphQLOperation;
    let navigation: MockNavigation;

    async function renderScreen(): Promise<void> {
        navigation = new MockNavigation();
        renderApi = await ScreenTestUtils.render(<AlarmsListScreen navigation={navigation.instance()}/>);
    }

    beforeEach(async () => {
        MockGraphQLClient.mock();
        MockStorage.mockWithAuthorizationToken();
        alarmsQuery = new AlarmsListQuery().getQuery();
    });

    afterEach(() => {
        MockGraphQLClient.reset();
        MockStorage.reset();
    });

    function alarmsResponse(alarms: Alarm[]) {
        return {
            getAlarms: alarms,
        };
    }

    describe('Alarms list', () => {

        it('should show alarm if query returns 1 alarm', async () => {
            MockGraphQLClient.mockSuccess(alarmsQuery, alarmsResponse([new AlarmFixture().get()]));
            await renderScreen();

            const items = renderApi.getAllByTestId('alarmItem');
            expect(items.length).toBe(1);
        });

        it('should show all alarms if query returns n alarms', async () => {
            const alarmsCount = 10;
            const alarms = [];
            for (let i = 0; i < alarmsCount; i++) {
                const alarm = new AlarmFixture().withId(i).get();
                alarms.push(alarm);
            }

            MockGraphQLClient.mockSuccess(alarmsQuery, alarmsResponse(alarms));
            await renderScreen();

            const items = renderApi.getAllByTestId('alarmItem');
            expect(items.length).toBe(alarmsCount);
        });

        it('should not show alarm if query returns 0 alarms', async () => {
            MockGraphQLClient.mockSuccess(alarmsQuery, alarmsResponse([]));
            await renderScreen();

            const items = renderApi.queryByTestId('alarmItem');
            expect(items).toBeNull();
        });

    });

    describe('Alarm item', () => {

        it('should show alarm name', async () => {
            const alarmName = 'best alarm ever';
            const alarm = new AlarmFixture().withName(alarmName).get();

            MockGraphQLClient.mockSuccess(alarmsQuery, alarmsResponse([alarm]));
            await renderScreen();

            const component = renderApi.getByText(alarmName);
            expect(component).toBeDefined();
        });

        it('should show alarm subway icon', async () => {
            const icon = 'subway.icon.url';
            const subway = new AlarmSubwayFixture().withIcon(icon).get();
            const alarm = new AlarmFixture().withSubways([subway]).get();

            MockGraphQLClient.mockSuccess(alarmsQuery, alarmsResponse([alarm]));
            await renderScreen();

            const component = renderApi.getByTestId('alarmSubwayIcon');
            expect(component.props.source.uri).toBe(icon);
        });

        it('should show alarm subways icons', async () => {
            const subwaysCount = 5;
            const icon = 'subway.icon.url';

            const subways = [];
            for (let i = 0; i < subwaysCount; i++) {
                const subway = new AlarmSubwayFixture().withLine(i.toString()).withIcon(icon + i).get();
                subways.push(subway);
            }
            const alarm = new AlarmFixture().withSubways(subways).get();

            MockGraphQLClient.mockSuccess(alarmsQuery, alarmsResponse([alarm]));
            await renderScreen();

            const components = renderApi.getAllByTestId('alarmSubwayIcon');
            for (let i = 0; i < subwaysCount; i++) {
                const subwayComponent = components.find(component => {
                    return component.props.source.uri === icon + i;
                });
                expect(subwayComponent).toBeDefined();
            }
        });

        it('should show alarm start', async () => {
            const alarmStart = '12:34';
            const alarm = new AlarmFixture().withStart(alarmStart).get();

            MockGraphQLClient.mockSuccess(alarmsQuery, alarmsResponse([alarm]));
            await renderScreen();

            const component = renderApi.getByTestId('alarmTimeRange');
            expect(component.props.children.includes(alarmStart)).toBeTruthy();
        });

        it('should show alarm end', async () => {
            const alarmEnd = '21:45';
            const alarm = new AlarmFixture().withEnd(alarmEnd).get();

            MockGraphQLClient.mockSuccess(alarmsQuery, alarmsResponse([alarm]));
            await renderScreen();

            const component = renderApi.getByTestId('alarmTimeRange');
            expect(component.props.children.includes(alarmEnd)).toBeTruthy();
        });

        it('should show alarm day', async () => {
            const day = 'day';
            const alarm = new AlarmFixture().withDays([day]).get();

            MockGraphQLClient.mockSuccess(alarmsQuery, alarmsResponse([alarm]));
            await renderScreen();

            const component = renderApi.getByTestId('alarmDays');
            expect(component.props.children.includes(day)).toBeTruthy();
        });

        it('should show all alarm days translated', async () => {
            const days = DaysTranslator.days.keys();
            const alarm = new AlarmFixture().withDays([...days]).get();

            MockGraphQLClient.mockSuccess(alarmsQuery, alarmsResponse([alarm]));
            await renderScreen();

            const component = renderApi.getByTestId('alarmDays');

            for (let day of DaysTranslator.days.values()) {
                expect(component.props.children.includes(day)).toBeTruthy();
            }
        });

    });

    describe('Loading', () => {

        it('should show loading when loading alarms', async () => {
            MockGraphQLClient.mockLoading(alarmsQuery);
            await renderScreen();
            expect(renderApi.getByTestId('loading')).toBeDefined();
        });

        it('should hide loading when alarms arrive', async () => {
            MockGraphQLClient.mockSuccess(alarmsQuery, alarmsResponse([new AlarmFixture().get()]));
            await renderScreen();
            expect(renderApi.queryByTestId('loading')).toBeNull();
        });

    });

    describe('Empty List', () => {

        it('should show empty message when 0 alarms', async () => {
            MockGraphQLClient.mockSuccess(alarmsQuery, alarmsResponse([]));

            await renderScreen();

            const message = 'No tienes ninguna alarma creada';
            expect(renderApi.getByText(message)).toBeDefined();
        });

        it('should show error when api fails', async () => {
            const error = 'some alarms api error';
            MockGraphQLClient.mockError(alarmsQuery, error);

            await renderScreen();

            expect(renderApi.getByText(error)).toBeDefined();
        });

        it('should show error when network error', async () => {
            MockGraphQLClient.mockNetworkError(alarmsQuery);

            await renderScreen();

            expect(renderApi.getByText(GraphQLService.DEFAULT_ERROR)).toBeDefined();
        });

    });

});
