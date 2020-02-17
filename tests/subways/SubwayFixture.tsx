import {Subway} from '../../src/subways/model/Subway';
import {SubwayStatus} from '../../src/subways/model/SubwayStatus';

export class SubwayFixture {

    private subway: Subway;

    public constructor() {
        this.subway = new Subway();
        this.subway.line = 'subway';
        this.subway.icon = 'icon';
        this.subway.status = 'status';
        this.subway.statusType = SubwayStatus.Normal;
        this.subway.updatedAt = new Date();
    }

    public withLine(line: string): SubwayFixture {
        this.subway.line = line;
        return this;
    }

    public withIcon(icon: string): SubwayFixture {
        this.subway.icon = icon;
        return this;
    }

    public withStatus(status: string): SubwayFixture {
        this.subway.status = status;
        return this;
    }

    public withStatusType(status: SubwayStatus): SubwayFixture {
        this.subway.statusType = status;
        return this;
    }

    public get(): Subway {
        return this.subway;
    }
}
