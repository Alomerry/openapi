package exception.base;

import core.ResultCode;

public class NotExistException extends WebServiceInvokeErrorException {
    public NotExistException(String message, Object[] params) {
        super(message, ResultCode.BAD_REQUEST, params);
    }
}
