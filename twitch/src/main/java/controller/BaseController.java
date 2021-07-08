package controller;

import config.JwtConfig;
import core.Err;
import core.Result;
import exception.base.WebServiceInvokeErrorException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.SignatureException;
import model.user.po.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import service.UserService;

import javax.annotation.Resource;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
public class BaseController {

    @Autowired
    private JwtConfig jwtConfig;

    @Resource
    private UserService userService;

    @ExceptionHandler(WebServiceInvokeErrorException.class)
    @ResponseBody
    public Result WebServiceInvokeErrorExceptionHandler(WebServiceInvokeErrorException e) throws Exception {
        Map<String, Object> extra = new HashMap<>();
        extra.put("service", "123");
        return new Result().setCode(e.getCode()).setError(new Err().setDesc(e.getMessage()).
                setExtra(extra)).
                setParams(Arrays.stream(e.getParams()).toArray(String[]::new));
    }

    protected User GetUser(HttpHeaders headers) {
        String token = headers.get("accessToken").get(0);
        Claims claims = null;
        try {
            claims = jwtConfig.getTokenClaim(token);
            if (claims == null || jwtConfig.isTokenExpired(claims.getExpiration())) {
                throw new SignatureException("令牌过期，请重新登录。");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new SignatureException("令牌失效，请重新登录。");
        }
        // todo check
        return userService.FindByUserId(claims.getSubject());
    }
}
