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
import {alarmStrings} from '../../../src/strings/AlarmStrings';
import {GraphQLOperation} from '../../../src/graphql/GraphQLClient';
import {AlarmCreateMutation} from '../../../src/alarms/alarmForm/AlarmCreateMutation';
import {AlarmInput} from '../../../src/alarms/model/AlarmInput';
import {AlarmFixture} from '../AlarmFixture';
import MockToast from '../../screens/MockToast';

describe('Alarm Form Screen', () => {

    let renderApi: RenderAPI;
    let navigation: MockNavigation;
    let createAlarmMutation: GraphQLOperation;

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
        await renderScreenWithSubways();
        createAlarmMutation = new AlarmCreateMutation(new AlarmInput()).getMutation();
    });

    afterEach(() => {
        MockGraphQLClient.reset();
        MockStorage.reset();
    });

    function createAlarmResponse() {
        const alarm = new AlarmFixture().get();
        return {
            createAlarm: alarm,
        };
    }

    function writeName(name: string): void {
        fireEvent.changeText(renderApi.getByTestId('alarmName'), name);
    }

    function selectDay(day: string): void {
        const dayText = renderApi.getByTestId('alarmFormDay' + day);
        fireEvent.press(dayText);
    }

    function selectSubway(subwayLine: string): void {
        const disabledSubway = renderApi.getByTestId('alarmFormSubwayDisabled' + subwayLine);
        fireEvent.press(disabledSubway);
    }

    function deselectSubway(subwayLine: string) {
        const enabledSubway = renderApi.getByTestId('alarmFormSubwayEnabled' + subwayLine);
        fireEvent.press(enabledSubway);
    }

    function selectStart(start: string): void {
        fireEvent.press(renderApi.getByTestId('startOpenTimePicker'));
        selectTimeOnPicker(start);
    }

    function selectEnd(end: string): void {
        fireEvent.press(renderApi.getByTestId('endOpenTimePicker'));
        selectTimeOnPicker(end);
    }

    function selectTimeOnPicker(time: string): void {
        const date = DateTimeUtils.timeToDate(time);
        fireEvent(renderApi.getByTestId('timePicker'), 'onChange', null, date);
    }

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

                selectSubway(subway.line);

                assertSubwayIsEnabled(subway);
            });

            it('should disable subway when enabled and clicked', async () => {
                const subways = getDefaultSubways();
                await renderScreenWithSubways(subways);

                const subway = subways[0];

                selectSubway(subway.line);
                deselectSubway(subway.line);

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

            it('should show all days disabled', async () => {
                for (let day in DaysTranslator.days.keys()) {
                    assertDayIsDisabled(day);
                }
            });

            it('should enable day when clicked', async () => {
                const day = 'wednesday';

                selectDay(day);

                assertDayIsEnabled(day);
            });

            it('should disable day when enabled and clicked', async () => {
                const day = 'wednesday';

                selectDay(day); // Enable
                selectDay(day); // Disable

                assertDayIsDisabled(day);
            });

        });

        describe('Alarm Start', () => {

            const DEFAULT_START_TIME = '00:00';

            function openDatePickerAndCancel(): void {
                fireEvent.press(renderApi.getByTestId('startOpenTimePicker'));
                fireEvent(renderApi.getByTestId('timePicker'), 'onChange', null, null);
            }

            it('default value should be 00:00', async () => {
                const start = renderApi.getByTestId('startTime');
                expect(start.props.children).toEqual(DEFAULT_START_TIME);
            });

            it('should set start when selecting from timepicker', async () => {
                const startTime = '12:34';
                selectStart(startTime);

                const start = renderApi.getByTestId('startTime');
                expect(start.props.children).toEqual(startTime);
            });

            it('should not set start when open timepicker but cancel', async () => {
                openDatePickerAndCancel();

                const start = renderApi.getByTestId('startTime');
                expect(start.props.children).toEqual(DEFAULT_START_TIME);
            });

        });

        describe('Alarm End', () => {

            const DEFAULT_END_TIME = '23:59';

            function openDatePickerAndCancel(): void {
                fireEvent.press(renderApi.getByTestId('endOpenTimePicker'));
                fireEvent(renderApi.getByTestId('timePicker'), 'onChange', null, null);
            }

            it('default value should be 23:59', async () => {
                const end = renderApi.getByTestId('endTime');
                expect(end.props.children).toEqual(DEFAULT_END_TIME);
            });

            it('should set end when selecting from timepicker', async () => {
                const endTime = '18:45';
                selectEnd(endTime);

                const end = renderApi.getByTestId('endTime');
                expect(end.props.children).toEqual(endTime);
            });

            it('should not set end when open timepicker but cancel', async () => {
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
            MockStorage.reset();
            MockStorage.mock();
            await renderScreen();

            expect(renderApi.getByText(strings.defaultError)).toBeDefined();
        });

    });

    describe('Validations', () => {

        it('should show error when start is after end', async () => {
            selectStart('16:00');
            selectEnd('15:59');

            expect(renderApi.getByText(alarmStrings.form.invalidTimeRange)).toBeDefined();
        });

        it('should show error when start equals end', async () => {
            selectStart('15:00');
            selectEnd('15:00');

            expect(renderApi.getByText(alarmStrings.form.invalidTimeRange)).toBeDefined();
        });

        it('should not show error when start is before end', async () => {
            selectStart('14:00');
            selectEnd('14:01');

            expect(renderApi.queryByText(alarmStrings.form.invalidTimeRange)).toBeNull();
        });

    });

    describe('Submit', () => {

        const NAME = 'alarm name';
        const DEFAULT_DAY = 'friday';
        const DEFAULT_SUBWAY_LINE = '1';
        const START = '12:21';
        const END = '20:02';

        function inputValidData(): void {
            writeName(NAME);
            selectDay(DEFAULT_DAY);
            selectSubway(DEFAULT_SUBWAY_LINE);
            selectStart(START);
            selectEnd(END);
        }

        async function submit(): Promise<void> {
            await fireEvent.press(renderApi.getByTestId('submit'));
        }

        async function submitWithValidData(): Promise<void> {
            inputValidData();
            await submit();
        }

        describe('Enabled Submit button', () => {

            function assertSubmitButtonEnabled(enabled: boolean): void {
                const button = renderApi.getByTestId('submit');
                expect(button.props.disabled).toBe(!enabled);
            }

            it('should be disabled when name is empty', async () => {
                inputValidData();

                writeName('');

                assertSubmitButtonEnabled(false);
            });

            it('should be disabled when no subway selected', async () => {
                inputValidData();

                fireEvent.press(renderApi.getByTestId('alarmFormSubwayEnabled' + DEFAULT_SUBWAY_LINE));

                assertSubmitButtonEnabled(false);
            });

            it('should be disabled when no day selected', async () => {
                inputValidData();

                selectDay(DEFAULT_DAY);

                assertSubmitButtonEnabled(false);
            });

            it('should be disabled when start is after end', async () => {
                inputValidData();

                selectStart('15:00');
                selectEnd('14:59');

                assertSubmitButtonEnabled(false);
            });

            it('should be disabled when start equals end', async () => {
                inputValidData();

                selectStart('15:00');
                selectEnd('15:00');

                assertSubmitButtonEnabled(false);
            });

            it('should be enabled when input data is valid', async () => {
                inputValidData();
                assertSubmitButtonEnabled(true);
            });

        });

        describe('Loading', () => {

            function assertIsLoading(loading: boolean): void {
                const button = renderApi.getByTestId('submit');
                expect(button.props.loading).toBe(loading);
            }

            it('when submit then should be loading', async () => {
                MockGraphQLClient.mockLoading(createAlarmMutation);

                submitWithValidData();

                assertIsLoading(true);
            });

            it('when submit response then should not be loading', async () => {
                MockGraphQLClient.mockNetworkError(createAlarmMutation);

                await submitWithValidData();

                assertIsLoading(false);
            });

            it('when loading then should not submit twice', async () => {
                MockGraphQLClient.mockLoading(createAlarmMutation);

                submitWithValidData();
                submit();

                assertIsLoading(true);
                await MockGraphQLClient.assertMutationCalled(createAlarmMutation, 1);
            });
        });

        describe('Errors', () => {

            function assertErrorShown(error: string): void {
                expect(renderApi.getByText(error)).toBeDefined();
            }

            it('when network error then show error', async () => {
                MockGraphQLClient.mockNetworkError(createAlarmMutation);

                await submitWithValidData();

                assertErrorShown(strings.defaultError);
            });

            it('when api error then show error', async () => {
                const error = 'create alarm api error';
                MockGraphQLClient.mockError(createAlarmMutation, error);

                await submitWithValidData();

                assertErrorShown(error);
            });

        });

        describe('Submit Parameters', () => {

            beforeEach(() => {
                MockGraphQLClient.mockNetworkError(createAlarmMutation);
            });

            async function assertCreateAlarmCalledWith<T>(params: T): Promise<void> {
                const expected = {input: expect.objectContaining(params)};
                await MockGraphQLClient.assertMutationCalledWith(createAlarmMutation, expected);
            }

            it('should call submit with correct name', async () => {
                await submitWithValidData();

                await assertCreateAlarmCalledWith({name: NAME});
            });

            it('should call submit with correct subway when one selected', async () => {
                await submitWithValidData();

                await assertCreateAlarmCalledWith({subwayLines: [DEFAULT_SUBWAY_LINE]});
            });

            it('should call submit with correct subways when multiple selected', async () => {
                const otherSubway = '3';
                inputValidData();
                selectSubway(otherSubway);

                await submit();

                await assertCreateAlarmCalledWith({subwayLines: [DEFAULT_SUBWAY_LINE, otherSubway]});
            });

            it('should call submit with correct day when one selected', async () => {
                await submitWithValidData();

                await assertCreateAlarmCalledWith({days: [DEFAULT_DAY]});
            });

            it('should call submit with correct days when multiple selected', async () => {
                const otherDay = 'sunday';
                inputValidData();
                selectDay(otherDay);

                await submit();

                await assertCreateAlarmCalledWith({days: [DEFAULT_DAY, otherDay]});
            });

            it('should call submit with correct start', async () => {
                await submitWithValidData();

                await assertCreateAlarmCalledWith({start: START});
            });

            it('should call submit with correct end', async () => {
                await submitWithValidData();

                await assertCreateAlarmCalledWith({end: END});
            });

        });

        describe('Create alarm', () => {

            it('when submit succeeds then navigate to back', async () => {
                MockGraphQLClient.mockSuccess(createAlarmMutation, createAlarmResponse());

                await submitWithValidData();

                navigation.assertNavigatedToBack();
            });

            it('should show toast when create alarm succeeds', async () => {
                MockGraphQLClient.mockSuccess(createAlarmMutation, createAlarmResponse());
                MockToast.mock();

                await submitWithValidData();

                MockToast.assertShown(alarmStrings.alarmFormScreen.successCreateAlarm);
            });

            it('should not show toast when create alarm fails', async () => {
                MockGraphQLClient.mockError(createAlarmMutation, 'error');
                MockToast.mock();

                await submitWithValidData();

                MockToast.assertNotShown();
            });

        });

    });

});
