package core;

import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * 统一API响应结果封装
 */
public class Result {
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private int code;
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String message;
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String[] params;
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Object data;
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Object error;

    public String getMessage() {
        return message;
    }

    public Result setMessage(String message) {
        this.message = message;
        return this;
    }

    public Object getData() {
        return data;
    }

    public Result setData(Object data) {
        this.data = data;
        return this;
    }

    public Object getError() {
        return error;
    }

    public Result setError(Object error) {
        this.error = error;
        return this;
    }

    public int getCode() {
        return code;
    }

    public Result setCode(ResultCode code) {
        this.code = code.code();
        return this;
    }

    public String[] getParams() {
        return params;
    }

    public Result setParams(String[] params) {
        this.params = params;
        return this;
    }

    @Override
    public String toString() {
        // todo @alomerry 解决 return null
        System.out.printf("测试[%v]", JSON.toJSONString(this));
        return JSON.toJSONString(this);
    }
}