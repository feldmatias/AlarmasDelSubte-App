import {ReactElement} from 'react';
import {render, RenderAPI} from 'react-native-testing-library';

export class ScreenTestUtils {

    public static async render(component: ReactElement): Promise<RenderAPI> {
        const renderApi = render(component);
        await this.flushPromises(); // Wait for async componentDidMount
        return renderApi;
    }

    private static flushPromises() {
        return new Promise(resolve => setImmediate(resolve));
    }

}
