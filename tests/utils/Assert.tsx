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

}
