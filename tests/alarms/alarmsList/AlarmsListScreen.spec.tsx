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
            const error = 'some api error';
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
