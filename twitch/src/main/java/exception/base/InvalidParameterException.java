package exception.base;

import core.ResultCode;

public class InvalidParameterException extends WebServiceInvokeErrorException {
    public InvalidParameterException(String message, Object[] params) {
        super(message, ResultCode.BAD_REQUEST, params);
    }
}
