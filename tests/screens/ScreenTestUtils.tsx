import {ReactElement} from 'react';
import {fireEvent, render, RenderAPI} from 'react-native-testing-library';

export class ScreenTestUtils {

    public static async render(component: ReactElement): Promise<RenderAPI> {
        const renderApi = render(component);
        await this.flushPromises(); // Wait for async componentDidMount
        return renderApi;
    }

    public static async renderWithFocus(component: ReactElement): Promise<RenderAPI> {
        const renderApi = render(component);
        fireEvent(renderApi.getByTestId('navigationEvents'), 'onWillFocus');
        await this.flushPromises(); // Wait for async onWillFocus
        return renderApi;
    }

    public static flushPromises() {
        return new Promise(resolve => setImmediate(resolve));
    }

}
