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
import {Subway} from '../../../src/subways/model/Subway';
import {SubwayFixture} from '../../subways/SubwayFixture';
import {SubwaysStorage} from '../../../src/subways/SubwaysStorage';
import {strings} from '../../../src/strings/Strings';

describe('Alarm Form Screen', () => {

    let renderApi: RenderAPI;
    let navigation: MockNavigation;

    function getDefaultSubways(): Subway[] {
        return [
            new SubwayFixture().withLine('1').get(),
            new SubwayFixture().withLine('2').get(),
            new SubwayFixture().withLine('3').get(),
        ];
    }

    async function renderScreen(): Promise<void> {
        navigation = new MockNavigation();
        renderApi = await ScreenTestUtils.render(<AlarmFormScreen navigation={navigation.instance()}/>);
    }

    async function renderScreenWithSubways(subways: Subway[] = getDefaultSubways()): Promise<void> {
        MockStorage.mockSavedValue(SubwaysStorage.SUBWAYS_KEY, subways);
        await renderScreen();
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

        describe('Alarm Subways', () => {

            function assertSubwayIsEnabled(subway: Subway) {
                const enabledSubway = renderApi.getByTestId('alarmFormSubwayEnabled' + subway.line);
                expect(enabledSubway).toBeDefined();
                const icon = enabledSubway.find(node => node.props.testID === 'subwayIcon');
                expect(icon.props.source.uri).toBe(subway.icon);
            }

            function assertSubwayIsDisabled(subway: Subway) {
                const disabledSubway = renderApi.getByTestId('alarmFormSubwayDisabled' + subway.line);
                expect(disabledSubway).toBeDefined();
            }

            function selectSubway(subway: Subway) {
                const disabledSubway = renderApi.getByTestId('alarmFormSubwayDisabled' + subway.line);
                fireEvent.press(disabledSubway);
            }

            function deselectSubway(subway: Subway) {
                const enabledSubway = renderApi.getByTestId('alarmFormSubwayEnabled' + subway.line);
                fireEvent.press(enabledSubway);
            }

            it('should show all subways disabled', async () => {
                const subways = getDefaultSubways();
                await renderScreenWithSubways(subways);

                subways.forEach(subway => assertSubwayIsDisabled(subway));
            });

            it('should enable subway when clicked', async () => {
                const subways = getDefaultSubways();
                const subway = new SubwayFixture().withLine('4').withIcon('icon.url.com').get();
                subways.push(subway);
                await renderScreenWithSubways(subways);

                selectSubway(subway);

                assertSubwayIsEnabled(subway);
            });

            it('should disable subway when enabled and clicked', async () => {
                const subways = getDefaultSubways();
                await renderScreenWithSubways(subways);

                const subway = subways[0];

                selectSubway(subway);
                deselectSubway(subway);

                assertSubwayIsDisabled(subway);
            });

        });

        describe('Alarm Days', () => {

            function assertDayIsEnabled(day: string) {
                const dayText = renderApi.getByTestId('alarmFormDay' + day);
                expect(dayText.props.style[0].color).toEqual(Colors.primary);
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
                await renderScreenWithSubways();

                for (let day in DaysTranslator.days.keys()) {
                    assertDayIsDisabled(day);
                }
            });

            it('should enable day when clicked', async () => {
                await renderScreenWithSubways();

                const day = 'wednesday';

                clickDay(day);

                assertDayIsEnabled(day);
            });

            it('should disable day when enabled and clicked', async () => {
                await renderScreenWithSubways();

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
                await renderScreenWithSubways();

                const start = renderApi.getByTestId('startTime');
                expect(start.props.children).toEqual(DEFAULT_START_TIME);
            });

            it('should set start when selecting from timepicker', async () => {
                const startTime = '12:34';
                await renderScreenWithSubways();

                selectStart(startTime);

                const start = renderApi.getByTestId('startTime');
                expect(start.props.children).toEqual(startTime);
            });

            it('should not set start when open timepicker but cancel', async () => {
                await renderScreenWithSubways();

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
                await renderScreenWithSubways();

                const end = renderApi.getByTestId('endTime');
                expect(end.props.children).toEqual(DEFAULT_END_TIME);
            });

            it('should set end when selecting from timepicker', async () => {
                const endTime = '18:45';
                await renderScreenWithSubways();

                selectEnd(endTime);

                const end = renderApi.getByTestId('endTime');
                expect(end.props.children).toEqual(endTime);
            });

            it('should not set end when open timepicker but cancel', async () => {
                await renderScreenWithSubways();

                openDatePickerAndCancel();

                const start = renderApi.getByTestId('endTime');
                expect(start.props.children).toEqual(DEFAULT_END_TIME);
            });

        });

    });

    describe('Initial Subways Load', () => {

        it('should show error when subways list is empty', async () => {
           await renderScreenWithSubways([]);

           expect(renderApi.getByText(strings.defaultError)).toBeDefined();
        });

        it('should not show error when subways list is not empty', async () => {
            await renderScreenWithSubways([new SubwayFixture().get()]);

            expect(renderApi.queryByText(strings.defaultError)).toBeNull();
        });

        it('should show error when subways list is not saved', async () => {
            await renderScreen();

            expect(renderApi.getByText(strings.defaultError)).toBeDefined();
        });

    });

});
