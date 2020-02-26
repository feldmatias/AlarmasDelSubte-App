import {fireEvent, RenderAPI} from 'react-native-testing-library';
import {GraphQLOperation} from '../../../src/graphql/GraphQLClient';
import {MockNavigation} from '../../screens/MockNavigation';
import {ScreenTestUtils} from '../../screens/ScreenTestUtils';
import MockGraphQLClient from '../../graphql/MockGraphQLClient';
import MockStorage from '../../storage/MockStorage';
import React from 'react';
import {AlarmsListScreen} from '../../../src/alarms/alarmsList/AlarmsListScreen';
import {AlarmsListQuery} from '../../../src/alarms/graphql/AlarmsListQuery';
import {Alarm} from '../../../src/alarms/model/Alarm';
import {AlarmFixture} from '../AlarmFixture';
import {AlarmSubwayFixture} from '../AlarmSubwayFixture';
import {DaysTranslator} from '../../../src/utils/DaysTranslator';
import {AlarmDeleteMutation} from '../../../src/alarms/graphql/AlarmDeleteMutation';
import {NavigationRoutes} from '../../../src/screens/NavigationRoutes';
import MockToast from '../../screens/MockToast';
import {alarmStrings} from '../../../src/strings/AlarmStrings';
import {strings} from '../../../src/strings/Strings';
import {Assert} from '../../utils/Assert';

describe('Alarms List Screen', () => {

    let renderApi: RenderAPI;
    let alarmsQuery: GraphQLOperation;
    let deleteAlarmMutation: GraphQLOperation;
    let navigation: MockNavigation;

    async function renderScreen(): Promise<void> {
        navigation = new MockNavigation();
        renderApi = await ScreenTestUtils.renderWithFocus(<AlarmsListScreen navigation={navigation.instance()}/>);
    }

    beforeEach(async () => {
        MockGraphQLClient.mock();
        MockStorage.mockWithAuthorizationToken();
        alarmsQuery = new AlarmsListQuery().getQuery();
        deleteAlarmMutation = new AlarmDeleteMutation(new Alarm()).getMutation();
    });

    afterEach(() => {
        MockGraphQLClient.reset();
        MockStorage.reset();
    });

    function setAlarmsSuccessResponse(alarms: Alarm[]) {
        const response =
            {
                getAlarms: alarms,
            };
        MockGraphQLClient.mockSuccess(alarmsQuery, response);
    }

    function setDeleteAlarmSuccessResponse(alarm: Alarm) {
        const response =
            {
                deleteAlarm: alarm.id,
            };
        MockGraphQLClient.mockSuccess(deleteAlarmMutation, response);
    }

    describe('Alarms list', () => {

        it('should show alarm if query returns 1 alarm', async () => {
            setAlarmsSuccessResponse([new AlarmFixture().get()]);
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

            setAlarmsSuccessResponse(alarms);
            await renderScreen();

            const items = renderApi.getAllByTestId('alarmItem');
            expect(items.length).toBe(alarmsCount);
        });

        it('should not show alarm if query returns 0 alarms', async () => {
            setAlarmsSuccessResponse([]);
            await renderScreen();

            const items = renderApi.queryByTestId('alarmItem');
            expect(items).toBeNull();
        });

    });

    describe('Alarm item', () => {

        it('should show alarm name', async () => {
            const alarmName = 'best alarm ever';
            const alarm = new AlarmFixture().withName(alarmName).get();

            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            const component = renderApi.getByText(alarmName);
            expect(component).toBeDefined();
        });

        it('should show alarm subway icon', async () => {
            const icon = 'subway.icon.url';
            const subway = new AlarmSubwayFixture().withIcon(icon).get();
            const alarm = new AlarmFixture().withSubways([subway]).get();

            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            const component = renderApi.getByTestId('alarmSubwayIcon');
            Assert.assertImageUrl(component, icon);
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

            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            const components = renderApi.getAllByTestId('alarmSubwayIcon');
            for (let i = 0; i < subwaysCount; i++) {
                Assert.assertImageUrl(components[i], icon + i);
            }
        });

        it('should show alarm start', async () => {
            const alarmStart = '12:34';
            const alarm = new AlarmFixture().withStart(alarmStart).get();

            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            const component = renderApi.getByTestId('alarmTimeRange');
            Assert.assertTextContains(component, alarmStart);
        });

        it('should show alarm end', async () => {
            const alarmEnd = '21:45';
            const alarm = new AlarmFixture().withEnd(alarmEnd).get();

            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            const component = renderApi.getByTestId('alarmTimeRange');
            Assert.assertTextContains(component, alarmEnd);
        });

        it('should show alarm day', async () => {
            const day = 'day';
            const alarm = new AlarmFixture().withDays([day]).get();

            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            const component = renderApi.getByTestId('alarmDays');
            Assert.assertTextContains(component, day);
        });

        it('should show all alarm days translated', async () => {
            const days = DaysTranslator.days.keys();
            const alarm = new AlarmFixture().withDays([...days]).get();

            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            const component = renderApi.getByTestId('alarmDays');

            for (let day of DaysTranslator.days.values()) {
                Assert.assertTextContains(component, day);
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
            setAlarmsSuccessResponse([new AlarmFixture().get()]);
            await renderScreen();
            expect(renderApi.queryByTestId('loading')).toBeNull();
        });

    });

    describe('Empty List', () => {

        it('should show empty message when 0 alarms', async () => {
            setAlarmsSuccessResponse([]);

            await renderScreen();

            const message = alarmStrings.alarmsListScreen.noAlarmsMessage;
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

            expect(renderApi.getByText(strings.defaultError)).toBeDefined();
        });

    });

    describe('Pull to refresh', () => {

        async function refreshAlarms(): Promise<void> {
            await fireEvent(renderApi.getByTestId('alarmsList'), 'onRefresh');
        }

        it('should show refreshing when refresh', async () => {
            setAlarmsSuccessResponse([]);
            await renderScreen();

            MockGraphQLClient.mockLoading(alarmsQuery);

            refreshAlarms();

            const list = renderApi.getByTestId('alarmsList');
            expect(list.props.refreshing).toBeTruthy();
        });

        it('should hide refreshing when refresh finishes', async () => {
            setAlarmsSuccessResponse([]);
            await renderScreen();

            setAlarmsSuccessResponse([]);

            await refreshAlarms();

            const list = renderApi.getByTestId('alarmsList');
            expect(list.props.refreshing).toBeFalsy();
        });

        it('should show alarm if 0 alarms and 1 after refresh', async () => {
            setAlarmsSuccessResponse([]);
            await renderScreen();

            const alarm = new AlarmFixture().get();
            setAlarmsSuccessResponse([alarm]);

            await refreshAlarms();

            const items = renderApi.getAllByTestId('alarmItem');
            expect(items.length).toBe(1);
        });

        it('should add alarm if is new after refresh', async () => {
            const alarm = new AlarmFixture().get();
            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            const newName = 'new';
            const newAlarm = new AlarmFixture().withId(123).withName(newName).get();
            setAlarmsSuccessResponse([alarm, newAlarm]);

            await refreshAlarms();

            const item = renderApi.getByText(newName);
            expect(item).toBeDefined();
        });

        it('should remove alarm if is removed after refresh', async () => {
            const alarm = new AlarmFixture().get();
            const oldName = 'old';
            const oldAlarm = new AlarmFixture().withId(123).withName(oldName).get();
            setAlarmsSuccessResponse([oldAlarm, alarm]);

            await renderScreen();

            setAlarmsSuccessResponse([alarm]);

            await refreshAlarms();

            const item = renderApi.queryByText(oldName);
            expect(item).toBeNull();
        });

        it('should update alarm name if changed after refresh', async () => {
            const oldName = 'old name for alarm';
            const newName = 'new name for alarm';

            const alarm = new AlarmFixture().withName(oldName).get();
            setAlarmsSuccessResponse([alarm]);

            await renderScreen();

            alarm.name = newName;
            setAlarmsSuccessResponse([alarm]);

            await refreshAlarms();

            expect(renderApi.getByText(newName)).toBeDefined();
            expect(renderApi.queryByText(oldName)).toBeNull();
        });

    });

    describe('Delete alarm', () => {

        function deleteAlarm(index = 0): void {
            const alarms = renderApi.getAllByTestId('alarmDelete');
            fireEvent.press(alarms[index]);
        }

        async function confirmDeleteAlarm(): Promise<void> {
            await fireEvent.press(renderApi.getByTestId('dialogConfirm'));
            await ScreenTestUtils.flushPromises();
        }

        function cancelDeleteAlarm(): void {
            fireEvent.press(renderApi.getByTestId('dialogCancel'));
        }

        it('should show delete confirmation dialog', async () => {
            const alarm = new AlarmFixture().get();
            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            deleteAlarm();

            expect(renderApi.getByTestId('confirmationDialog')).toBeDefined();
            const dialogMessage = alarmStrings.alarmsListScreen.deleteAlarmConfirm;
            expect(renderApi.getByText(dialogMessage)).toBeDefined();
        });

        it('should hide confirmation dialog when cancel delete in dialog', async () => {
            const alarm = new AlarmFixture().get();
            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            deleteAlarm();
            cancelDeleteAlarm();

            expect(renderApi.queryByTestId('confirmationDialog')).toBeNull();
        });

        it('should not delete when cancel delete in dialog', async () => {
            const alarm = new AlarmFixture().get();
            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            deleteAlarm();
            cancelDeleteAlarm();

            await MockGraphQLClient.assertMutationCalled(deleteAlarmMutation, 0);
        });

        it('should delete alarm with id when confirm delete in dialog', async () => {
            const alarmId = 364;
            const alarm = new AlarmFixture().withId(alarmId).get();
            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            deleteAlarm();
            confirmDeleteAlarm();

            await MockGraphQLClient.assertMutationCalledWith(deleteAlarmMutation, {id: alarmId});
        });

        it('should show loading when delete alarm', async () => {
            const alarm = new AlarmFixture().get();
            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            MockGraphQLClient.mockLoading(deleteAlarmMutation);

            deleteAlarm();
            await confirmDeleteAlarm();

            expect(renderApi.getByTestId('loading')).toBeDefined();
        });

        it('should hide loading when delete alarm finishes', async () => {
            const alarm = new AlarmFixture().get();
            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            setDeleteAlarmSuccessResponse(alarm);

            deleteAlarm();
            await confirmDeleteAlarm();

            expect(renderApi.queryByTestId('loading')).toBeNull();
        });

        it('should show error when delete alarm fails', async () => {
            const error = 'delete alarm api error';

            const alarm = new AlarmFixture().get();
            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            MockGraphQLClient.mockError(deleteAlarmMutation, error);

            deleteAlarm();
            await confirmDeleteAlarm();

            expect(renderApi.getByText(error)).toBeDefined();
        });

        it('should show error when delete alarm fails with network error', async () => {
            const alarm = new AlarmFixture().get();
            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            MockGraphQLClient.mockNetworkError(deleteAlarmMutation);

            deleteAlarm();
            await confirmDeleteAlarm();

            expect(renderApi.getByText(strings.defaultError)).toBeDefined();
        });

        it('should remove alarm from list when delete alarm success', async () => {
            const alarm = new AlarmFixture().get();
            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            setDeleteAlarmSuccessResponse(alarm);

            deleteAlarm();
            await confirmDeleteAlarm();

            const items = renderApi.queryAllByTestId('alarmItem');
            expect(items && items.length).toBe(0);
        });

        it('should remove correct alarm from list when delete alarm success', async () => {
            const alarm1 = new AlarmFixture().withId(1).withName('1').get();
            const alarm2 = new AlarmFixture().withId(2).withName('2').get();
            const alarm3 = new AlarmFixture().withId(3).withName('3').get();
            setAlarmsSuccessResponse([alarm1, alarm2, alarm3]);
            await renderScreen();

            setDeleteAlarmSuccessResponse(alarm2);

            deleteAlarm(1);
            await confirmDeleteAlarm();

            const items = renderApi.getAllByTestId('alarmItem');
            expect(items.length).toBe(2);
            expect(renderApi.getByText('1')).toBeDefined();
            expect(renderApi.queryByText('2')).toBeNull();
            expect(renderApi.getByText('3')).toBeDefined();
        });

        it('should show toast when delete alarm succeeds', async () => {
            const alarm = new AlarmFixture().get();
            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            setDeleteAlarmSuccessResponse(alarm);
            MockToast.mock();

            deleteAlarm();
            await confirmDeleteAlarm();

            MockToast.assertShown(alarmStrings.alarmsListScreen.successDeleteAlarm);
        });

        it('should not show toast when delete alarm fails', async () => {
            const alarm = new AlarmFixture().get();
            setAlarmsSuccessResponse([alarm]);
            await renderScreen();

            MockGraphQLClient.mockError(deleteAlarmMutation, 'error');
            MockToast.mock();

            deleteAlarm();
            await confirmDeleteAlarm();

            MockToast.assertNotShown();
        });

    });

    describe('Create Alarm', () => {

        it('should navigate to Alarm Form screen', async () => {
            setAlarmsSuccessResponse([]);

            await renderScreen();

            fireEvent.press(renderApi.getByTestId('fab'));

            navigation.assertNavigatedTo(NavigationRoutes.AlarmForm);
        });

    });

    describe('Edit Alarm', () => {

        it('should navigate to Alarm Form screen with alarm', async () => {
            const alarm = new AlarmFixture().withId(8456).get();
            setAlarmsSuccessResponse([alarm]);

            await renderScreen();

            fireEvent.press(renderApi.getByTestId('alarmEdit'));

            navigation.assertNavigatedWithParams(NavigationRoutes.AlarmForm, {alarm});
        });

        it('should navigate to Alarm Form screen with correct alarm', async () => {
            const alarmCount = 3;
            const alarms: Alarm[] = [];

            for (let i = 0; i < alarmCount; i++) {
                const alarm = new AlarmFixture().withId(i).get();
                alarms.push(alarm);
            }

            setAlarmsSuccessResponse(alarms);

            await renderScreen();

            for (let i = 0; i < alarmCount; i++) {
                fireEvent.press(renderApi.getAllByTestId('alarmEdit')[i]);
                navigation.assertNavigatedWithParams(NavigationRoutes.AlarmForm, {alarm: alarms[i]});
            }
        });

    });

});
