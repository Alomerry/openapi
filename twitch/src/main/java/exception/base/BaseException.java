package exception.base;

import core.ResultCode;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Collection;

public class BaseException extends RuntimeException {

    private static final long serialVersionUID = 1382325479852800914L;

    /**
     * The message key
     */
    @Getter
    @Setter
    private ResultCode code;

    /**
     * The message parameters
     */
    @Getter
    @Setter
    private Object[] params;

    /**
     * The detail information, expected to appear in the response payload
     */
    @Getter
    private Collection<?> details = new ArrayList<>();

    public BaseException(String message, Throwable cause, ResultCode code) {
        super(message, cause);
        setCode(code);
    }

    public BaseException(String message, ResultCode code) {
        super(message);
        setCode(code);
    }

    public BaseException(String message, ResultCode code, Object[] params) {
        super(message);
        setCode(code);
        setParams(params);
    }

    public BaseException(String message, Throwable cause, ResultCode code, Object[] params) {
        super(message, cause);
        setCode(code);
        setParams(params);
    }

    public BaseException(String message, Throwable cause, ResultCode code, Collection<?> details) {
        super(message, cause);
        setCode(code);
        setDetails(details);
    }

    public BaseException(String message, ResultCode code, Collection<?> details) {
        super(message);
        setCode(code);
        setDetails(details);
    }

    public BaseException(String message, ResultCode code, Object[] params, Collection<?> details) {
        super(message);
        setCode(code);
        setParams(params);
        setDetails(details);
    }

    public BaseException(String message, Throwable cause, ResultCode code, Object[] params, Collection<?> details) {
        super(message, cause);
        setCode(code);
        setParams(params);
        setDetails(details);
    }

    public BaseException(String message, Throwable cause) {
        super(message, cause);
    }

    public BaseException(Throwable cause) {
        super(cause);
    }

    public BaseException(String message) {
        super(message);
    }

    public Collection<?> getDetails() {
        return details;
    }

    public void setDetails(Collection<?> details) {
        // cast AbstractList (from Arrays.asList) to ArrayList, so that the list can add items;
        if (details instanceof ArrayList == false) {
            this.details = new ArrayList<Object>(details);
        } else {
            this.details = details;
        }
    }
}
