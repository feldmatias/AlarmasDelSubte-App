import {ReactTestInstance} from 'react-test-renderer';

export class Assert {

    public static assertImageUrl(node: ReactTestInstance, url: string): void {
        expect(node.props.source.uri).toEqual(url);
    }

    public static assertColor(node: ReactTestInstance, color: string): void {
        const styles = node.props.style;
        styles.forEach((style: any) => {
            if (style.color) {
                expect(style.color).toEqual(color);
            }
        });
    }

    public static assertText(node: ReactTestInstance, text: string): void {
        expect(node.props.children).toEqual(text);
    }

    public static assertTextContains(node: ReactTestInstance, text: string): void {
        expect(node.props.children.includes(text)).toBeTruthy();
    }

    public static assertTextInput(node: ReactTestInstance, text: string): void {
        expect(node.props.value).toEqual(text);
    }

    public static assertListRefreshing(node: ReactTestInstance, refreshing: boolean): void {
        expect(node.props.refreshing).toEqual(refreshing);
    }

    public static assertButtonEnabled(node: ReactTestInstance, enabled: boolean): void {
        expect(node.props.disabled).toEqual(!enabled);
    }

    public static assertButtonLoading(node: ReactTestInstance, loading: boolean): void {
        expect(node.props.loading).toEqual(loading);
    }

}
