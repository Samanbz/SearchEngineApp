class FastAPIError extends Error {
    response: FastAPIResponse;
    constructor(response: FastAPIResponse, message: string) {
        super(message);
        this.response = response;
        this.name = "HTTPError ";
    }
}
export default FastAPIError;
