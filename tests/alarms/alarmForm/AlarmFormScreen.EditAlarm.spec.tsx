import {fireEvent, RenderAPI} from 'react-native-testing-library';
import {MockNavigation} from '../../screens/MockNavigation';
import {ScreenTestUtils} from '../../screens/ScreenTestUtils';
import MockGraphQLClient from '../../graphql/MockGraphQLClient';
import MockStorage from '../../storage/MockStorage';
import React from 'react';
import {DaysTranslator} from '../../../src/utils/DaysTranslator';
import {AlarmFormScreen} from '../../../src/alarms/alarmForm/AlarmFormScreen';
import {Colors} from '../../../src/styles/Colors';
import {Subway} from '../../../src/subways/model/Subway';
import {SubwayFixture} from '../../subways/SubwayFixture';
import {SubwaysStorage} from '../../../src/subways/SubwaysStorage';
import {alarmStrings} from '../../../src/strings/AlarmStrings';
import {GraphQLOperation} from '../../../src/graphql/GraphQLClient';
import {AlarmInput} from '../../../src/alarms/model/AlarmInput';
import {AlarmFixture} from '../AlarmFixture';
import MockToast from '../../screens/MockToast';
import {Alarm} from '../../../src/alarms/model/Alarm';
import {AlarmEditMutation} from '../../../src/alarms/graphql/AlarmEditMutation';
import {strings} from '../../../src/strings/Strings';

describe('Alarm Form Screen', () => {

    let renderApi: RenderAPI;
    let navigation: MockNavigation;
    let editAlarmMutation: GraphQLOperation;

    function getDefaultSubways(): Subway[] {
        return [
            new SubwayFixture().withLine('1').get(),
            new SubwayFixture().withLine('2').get(),
            new SubwayFixture().withLine('3').get(),
        ];
    }

    async function renderScreenWithAlarm(alarm: Alarm): Promise<void> {
        navigation = new MockNavigation();
        navigation.setParam('alarm', alarm);
        MockStorage.mockSavedValue(SubwaysStorage.SUBWAYS_KEY, getDefaultSubways());
        renderApi = await ScreenTestUtils.render(<AlarmFormScreen navigation={navigation.instance()}/>);
    }

    beforeEach(async () => {
        MockGraphQLClient.mock();
        MockStorage.mockWithAuthorizationToken();
        editAlarmMutation = new AlarmEditMutation(new AlarmInput(), new Alarm()).getMutation();
    });

    afterEach(() => {
        MockGraphQLClient.reset();
        MockStorage.reset();
    });

    function editAlarmResponse() {
        const alarm = new AlarmFixture().get();
        return {
            editAlarm: alarm,
        };
    }

    async function submit(): Promise<void> {
        await fireEvent.press(renderApi.getByTestId('submit'));
    }

    describe('Edit alarm', () => {

        describe('Form initialization', () => {

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

            function assertDayIsEnabled(day: string) {
                const dayText = renderApi.getByTestId('alarmFormDay' + day);
                expect(dayText.props.style[0].color).toEqual(Colors.primary);
            }

            function assertDayIsDisabled(day: string) {
                const dayText = renderApi.getByTestId('alarmFormDay' + day);
                expect(dayText.props.style[0].color).toEqual(Colors.grey);
            }

            it('should initialize with alarm name', async () => {
                const name = 'alarm to edit';
                const alarm = new AlarmFixture().withName(name).get();

                await renderScreenWithAlarm(alarm);

                const nameInput = renderApi.getByTestId('alarmName');
                expect(nameInput.props.value).toEqual(name);
            });

            it('should initialize with alarm start', async () => {
                const start = '15:51';
                const alarm = new AlarmFixture().withStart(start).get();

                await renderScreenWithAlarm(alarm);

                const startInput = renderApi.getByTestId('startTime');
                expect(startInput.props.children).toEqual(start);
            });

            it('should initialize with alarm end', async () => {
                const end = '14:41';
                const alarm = new AlarmFixture().withEnd(end).get();

                await renderScreenWithAlarm(alarm);

                const endInput = renderApi.getByTestId('endTime');
                expect(endInput.props.children).toEqual(end);
            });

            it('should initialize with selected subways', async () => {
                const subways = getDefaultSubways();
                const selectedSubways = subways.slice(0, 1);
                const alarm = new AlarmFixture().withSubways(selectedSubways).get();

                await renderScreenWithAlarm(alarm);

                subways.forEach(subway => {
                    if (selectedSubways.includes(subway)) {
                        assertSubwayIsEnabled(subway);
                    } else {
                        assertSubwayIsDisabled(subway);
                    }
                });
            });

            it('should initialize with selected days', async () => {
                const selectedDays = ['monday', 'friday', 'wednesday'];
                const alarm = new AlarmFixture().withDays(selectedDays).get();

                await renderScreenWithAlarm(alarm);

                for (let day in DaysTranslator.days.keys()) {
                    if (selectedDays.includes(day)) {
                        assertDayIsEnabled(day);
                    } else {
                        assertDayIsDisabled(day);
                    }
                }
            });

        });

        describe('Submit', () => {

            beforeEach(async () => {
                const alarm = new AlarmFixture().get();
                await renderScreenWithAlarm(alarm);
            });

            it('when edit alarm succeeds then navigate to back', async () => {
                MockGraphQLClient.mockSuccess(editAlarmMutation, editAlarmResponse());

                await submit();

                navigation.assertNavigatedToBack();
            });

            it('should show toast when edit alarm succeeds', async () => {
                MockGraphQLClient.mockSuccess(editAlarmMutation, editAlarmResponse());
                MockToast.mock();

                await submit();

                MockToast.assertShown(alarmStrings.alarmFormScreen.successEditAlarm);
            });

            it('should not show toast when edit alarm fails', async () => {
                MockGraphQLClient.mockError(editAlarmMutation, 'error');
                MockToast.mock();

                await submit();

                MockToast.assertNotShown();
            });

            describe('Loading', () => {

                function assertIsLoading(loading: boolean): void {
                    const button = renderApi.getByTestId('submit');
                    expect(button.props.loading).toBe(loading);
                }

                it('when edit then should be loading', async () => {
                    MockGraphQLClient.mockLoading(editAlarmMutation);

                    submit();

                    assertIsLoading(true);
                });

                it('when edit response then should not be loading', async () => {
                    MockGraphQLClient.mockNetworkError(editAlarmMutation);

                    await submit();

                    assertIsLoading(false);
                });

                it('when loading then should not submit twice', async () => {
                    MockGraphQLClient.mockLoading(editAlarmMutation);

                    submit();
                    submit();

                    assertIsLoading(true);
                    await MockGraphQLClient.assertMutationCalled(editAlarmMutation, 1);
                });
            });

            describe('Errors', () => {

                function assertErrorShown(error: string): void {
                    expect(renderApi.getByText(error)).toBeDefined();
                }

                it('when network error then show error', async () => {
                    MockGraphQLClient.mockNetworkError(editAlarmMutation);

                    await submit();

                    assertErrorShown(strings.defaultError);
                });

                it('when api error then show error', async () => {
                    const error = 'edit alarm api error';
                    MockGraphQLClient.mockError(editAlarmMutation, error);

                    await submit();

                    assertErrorShown(error);
                });

            });

        });

        describe('Submit Parameters', () => {

            beforeEach(() => {
                MockGraphQLClient.mockNetworkError(editAlarmMutation);
            });

            async function assertEditAlarmCalledWith<T>(params: T): Promise<void> {
                const expected = expect.objectContaining({input: expect.objectContaining(params)});
                await MockGraphQLClient.assertMutationCalledWith(editAlarmMutation, expected);
            }

            it('should call submit with correct name', async () => {
                const name = 'alarm edit name';
                const alarm = new AlarmFixture().withName(name).get();
                await renderScreenWithAlarm(alarm);

                await submit();

                await assertEditAlarmCalledWith({name: name});
            });

            it('should call submit with correct subway when one selected', async () => {
                const subway = getDefaultSubways()[0];
                const alarm = new AlarmFixture().withSubways([subway]).get();
                await renderScreenWithAlarm(alarm);

                await submit();

                await assertEditAlarmCalledWith({subwayLines: [subway.line]});
            });

            it('should call submit with correct subways when multiple selected', async () => {
                const subways = getDefaultSubways().slice(0,2);
                const alarm = new AlarmFixture().withSubways(subways).get();
                await renderScreenWithAlarm(alarm);

                await submit();

                const expectedSubwayLines = subways.map(subway => subway.line);
                await assertEditAlarmCalledWith({subwayLines: expectedSubwayLines});
            });

            it('should call submit with correct day when one selected', async () => {
                const day = 'sunday';
                const alarm = new AlarmFixture().withDays([day]).get();
                await renderScreenWithAlarm(alarm);

                await submit();

                await assertEditAlarmCalledWith({days: [day]});
            });

            it('should call submit with correct days when multiple selected', async () => {
                const days = ['friday', 'monday'];
                const alarm = new AlarmFixture().withDays(days).get();
                await renderScreenWithAlarm(alarm);

                await submit();

                await assertEditAlarmCalledWith({days: days});
            });

            it('should call submit with correct start', async () => {
                const start = '15:51';
                const alarm = new AlarmFixture().withStart(start).get();
                await renderScreenWithAlarm(alarm);

                await submit();

                await assertEditAlarmCalledWith({start: start});
            });

            it('should call submit with correct end', async () => {
                const end = '14:41';
                const alarm = new AlarmFixture().withEnd(end).get();
                await renderScreenWithAlarm(alarm);

                await submit();

                await assertEditAlarmCalledWith({end: end});
            });

            it('should call submit with correct alarm id', async () => {
                const id = 9157;
                const alarm = new AlarmFixture().withId(id).get();
                await renderScreenWithAlarm(alarm);

                await submit();

                const expected = expect.objectContaining({id});
                await MockGraphQLClient.assertMutationCalledWith(editAlarmMutation, expected);
            });

        });

    });

});

