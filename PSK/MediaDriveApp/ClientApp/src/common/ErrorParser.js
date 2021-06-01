const DEFAULT_ERROR = "Something went wrong. "

export default class ErrorParser {
    static parseError(response) {
      if (response.payload) {
        const { payload } = response;
          if (payload.status !== 400) { // If status code is not Bad Request status code, show default error
            return DEFAULT_ERROR;
          } else { // Use response from server as error message
            return payload.data;
          }
      }

      return DEFAULT_ERROR;
    }
  }