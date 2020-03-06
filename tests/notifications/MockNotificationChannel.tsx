export class MockNotificationsChannel {

    public channelId: string;
    public name: string;
    public description?: string;

    public constructor(channelId: string, name: string, _importance: number) {
        this.channelId = channelId;
        this.name = name;
    }

    public setDescription(description: string): MockNotificationsChannel {
        this.description = description;
        return this;
    }
}
