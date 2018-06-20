
export class UserRequest {
    start: Date;
    end: Date;

    constructor() {
        this.start = new Date(0);
        this.end = new Date();
    }

    toJSON() {
        return {
            start: Math.trunc(this.start.getTime() / 1000),
            end: Math.trunc(this.end.getTime() / 1000)
        };
    }

}
