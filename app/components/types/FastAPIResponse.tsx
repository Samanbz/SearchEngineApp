class FastAPIResponse {
    config: Object;
    data: Object;
    headers: Object;
    request: XMLHttpRequest;
    status: number;
    statusText: string;

    constructor(
        config: Object,
        data: Object,
        headers: Object,
        request: XMLHttpRequest,
        status: number,
        statusText: string
    ) {
        this.config = config;
        this.data = data;
        this.headers = headers;
        this.request = request;
        this.status = status;
        this.statusText = statusText;
    }
}
