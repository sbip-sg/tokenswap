package com.tokenswap.webserver;

public class APIResult {

    private int code;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    private String message;
    private Object data;

    public static APIResult createOk(Object data) {
        return createWithCodeAndData(ApiConstant.Code.OK, null, data);
    }

    public static APIResult createOKMessage(String message) {
        APIResult result = new APIResult();
        result.setCode(ApiConstant.Code.OK);
        result.setMessage(message);
        return result;
    }

    public static APIResult createNg(String message) {
        return createWithCodeAndData(ApiConstant.Code.NG, message, null);
    }

    public static APIResult createEg(String message){
        return createWithCodeAndData(ApiConstant.Code.EG, message,null);
    }

    private static APIResult createWithCodeAndData(int code, String message, Object data) {
        APIResult result = new APIResult();
        result.setCode(code);
        result.setMessage(message);
        result.setData(data);
        return result;
    }
    class ApiConstant{
        class Code{
            public static final int OK = 200;
            public static final int NG = 404;
            public static final int EG = 500;
        }
    }
}
