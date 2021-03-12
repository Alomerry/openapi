package exception.base;

import core.ResultCode;

import java.util.Collection;

public class WebServiceInvokeErrorException extends BaseException {
    public WebServiceInvokeErrorException(String message, Throwable cause, ResultCode code) {
        super(message, cause, code);
    }

    public WebServiceInvokeErrorException(String message, ResultCode code) {
        super(message, code);
    }

    public WebServiceInvokeErrorException(String message, ResultCode code, Object[] params) {
        super(message, code, params);
    }

    public WebServiceInvokeErrorException(String message, Throwable cause, ResultCode code, Object[] params) {
        super(message, cause, code, params);
    }

    public WebServiceInvokeErrorException(String message, Throwable cause, ResultCode code, Collection<?> details) {
        super(message, cause, code, details);
    }

    public WebServiceInvokeErrorException(String message, ResultCode code, Collection<?> details) {
        super(message, code, details);
    }

    public WebServiceInvokeErrorException(String message, ResultCode code, Object[] params, Collection<?> details) {
        super(message, code, params, details);
    }

    public WebServiceInvokeErrorException(String message, Throwable cause, ResultCode code, Object[] params, Collection<?> details) {
        super(message, cause, code, params, details);
    }

    public WebServiceInvokeErrorException(String message, Throwable cause) {
        super(message, cause);
    }

    public WebServiceInvokeErrorException(Throwable cause) {
        super(cause);
    }

    public WebServiceInvokeErrorException(String message) {
        super(message);
    }
}
