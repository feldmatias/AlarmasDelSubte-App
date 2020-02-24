import {Toast} from '../../src/screens/Toast';

class MockToast {

    public mock(): void {
        jest.mock('../../src/screens/Toast');
        Toast.show = jest.fn();
    }

    public assertShown(message: string): void {
        expect(Toast.show).toHaveBeenCalledWith(message);
    }

    public assertNotShown(): void {
        expect(Toast.show).not.toHaveBeenCalled();
    }

}

export default new MockToast();
