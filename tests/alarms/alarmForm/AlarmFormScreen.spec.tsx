import {fireEvent, RenderAPI} from 'react-native-testing-library';
import {MockNavigation} from '../../screens/MockNavigation';
import {ScreenTestUtils} from '../../screens/ScreenTestUtils';
import MockGraphQLClient from '../../graphql/MockGraphQLClient';
import MockStorage from '../../storage/MockStorage';
import React from 'react';
import {DaysTranslator} from '../../../src/utils/DaysTranslator';
import {AlarmFormScreen} from '../../../src/alarms/alarmForm/AlarmFormScreen';
import {Colors} from '../../../src/styles/Colors';

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

    });

});
