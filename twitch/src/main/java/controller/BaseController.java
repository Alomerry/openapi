package controller;

import core.Err;
import core.Result;
import exception.base.WebServiceInvokeErrorException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class BaseController {

    @ExceptionHandler(WebServiceInvokeErrorException.class)
    @ResponseBody
    public Result WebServiceInvokeErrorExceptionHandler(WebServiceInvokeErrorException e) throws Exception {
        Map<String, Object> extra = new HashMap<>();
        extra.put("service", "123");
        return new Result().setCode(e.getCode()).setError(new Err().setDesc(e.getMessage()).
                setExtra(extra)).
                setParams(Arrays.stream(e.getParams()).toArray(String[]::new));
    }
}
