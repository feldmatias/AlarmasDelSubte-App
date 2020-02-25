import {fireEvent, RenderAPI} from 'react-native-testing-library';
import {MockNavigation} from '../../screens/MockNavigation';
import {ScreenTestUtils} from '../../screens/ScreenTestUtils';
import MockGraphQLClient from '../../graphql/MockGraphQLClient';
import MockStorage from '../../storage/MockStorage';
import React from 'react';
import {DaysTranslator} from '../../../src/utils/DaysTranslator';
import {AlarmFormScreen} from '../../../src/alarms/alarmForm/AlarmFormScreen';
import {Colors} from '../../../src/styles/Colors';
import {DateTimeUtils} from '../../../src/utils/DateTimeUtils';

describe('Alarm Form Screen', () => {

    let renderApi: RenderAPI;
    let navigation: MockNavigation;

    async function renderScreen(): Promise<void> {
        navigation = new MockNavigation();
        renderApi = await ScreenTestUtils.render(<AlarmFormScreen navigation={navigation.instance()}/>);
    }

    beforeEach(async () => {
        MockGraphQLClient.mock();
        MockStorage.mockWithAuthorizationToken();
    });

    afterEach(() => {
        MockGraphQLClient.reset();
        MockStorage.reset();
    });

    describe('Form Input', () => {

        describe('Alarm Days', () => {

            function assertDayIsEnabled(day: string) {
                const dayText = renderApi.getByTestId('alarmFormDay' + day);
                expect(dayText.props.style[0].color).toEqual(Colors.black);
            }

            function assertDayIsDisabled(day: string) {
                const dayText = renderApi.getByTestId('alarmFormDay' + day);
                expect(dayText.props.style[0].color).toEqual(Colors.grey);
            }

            function clickDay(day: string) {
                const dayText = renderApi.getByTestId('alarmFormDay' + day);
                fireEvent.press(dayText);
            }

            it('should show all days disabled', async () => {
                await renderScreen();

                for (let day in DaysTranslator.days.keys()) {
                    assertDayIsDisabled(day);
                }
            });

            it('should enable day when clicked', async () => {
                await renderScreen();

                const day = 'wednesday';

                clickDay(day);

                assertDayIsEnabled(day);
            });

            it('should disable day when enabled andclicked', async () => {
                await renderScreen();

                const day = 'wednesday';

                clickDay(day); // Enable
                clickDay(day); // Disable

                assertDayIsDisabled(day);
            });

        });

        describe('Alarm Start', () => {

            const DEFAULT_START_TIME = '00:00';

            function selectStart(time: string): void {
                fireEvent.press(renderApi.getByTestId('startOpenTimePicker'));
                const date = DateTimeUtils.timeToDate(time);
                fireEvent(renderApi.getByTestId('timePicker'), 'onChange', null, date);
            }

            function openDatePickerAndCancel(): void {
                fireEvent.press(renderApi.getByTestId('startOpenTimePicker'));
                fireEvent(renderApi.getByTestId('timePicker'), 'onChange', null, null);
            }

            it('default value should be 00:00', async () => {
                await renderScreen();

                const start = renderApi.getByTestId('startTime');
                expect(start.props.children).toEqual(DEFAULT_START_TIME);
            });

            it('should set start when selecting from timepicker', async () => {
                const startTime = '12:34';
                await renderScreen();

                selectStart(startTime);

                const start = renderApi.getByTestId('startTime');
                expect(start.props.children).toEqual(startTime);
            });

            it('should not set start when open timepicker but cancel', async () => {
                await renderScreen();

                openDatePickerAndCancel();

                const start = renderApi.getByTestId('startTime');
                expect(start.props.children).toEqual(DEFAULT_START_TIME);
            });

        });

        describe('Alarm End', () => {

            const DEFAULT_END_TIME = '23:59';

            function selectEnd(time: string): void {
                fireEvent.press(renderApi.getByTestId('endOpenTimePicker'));
                const date = DateTimeUtils.timeToDate(time);
                fireEvent(renderApi.getByTestId('timePicker'), 'onChange', null, date);
            }

            function openDatePickerAndCancel(): void {
                fireEvent.press(renderApi.getByTestId('endOpenTimePicker'));
                fireEvent(renderApi.getByTestId('timePicker'), 'onChange', null, null);
            }

            it('default value should be 23:59', async () => {
                await renderScreen();

                const end = renderApi.getByTestId('endTime');
                expect(end.props.children).toEqual(DEFAULT_END_TIME);
            });

            it('should set end when selecting from timepicker', async () => {
                const endTime = '18:45';
                await renderScreen();

                selectEnd(endTime);

                const end = renderApi.getByTestId('endTime');
                expect(end.props.children).toEqual(endTime);
            });

            it('should not set end when open timepicker but cancel', async () => {
                await renderScreen();

                openDatePickerAndCancel();

                const start = renderApi.getByTestId('endTime');
                expect(start.props.children).toEqual(DEFAULT_END_TIME);
            });

        });

    });

});
