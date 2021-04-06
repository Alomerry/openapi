package controller;

import component.redis.JedisUtil;
import config.JwtConfig;
import exception.base.InvalidParameterException;
import interceptor.annotation.AuthCheck;
import interceptor.annotation.RequiredType;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import model.user.vo.GetDanmakuUrlResponse;
import model.user.vo.LoginRequest;
import model.user.vo.LoginResponse;
import model.member.vo.RegisterRequest;
import model.user.po.User;
import model.user.vo.ValidateDanmakuUrlResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import service.UserService;
import utils.StringUtils;

import javax.annotation.Resource;
import javax.validation.Valid;

@RestController
public class UserController extends BaseController {

    private static final String STREAMER_DANMAKU_URL_KEY = "streamerDanmakuUrl";

    @Resource
    private JedisUtil jedisUtil;

    @Resource
    private UserService userService;

    @Resource
    private JwtConfig jwtConfig;

    @PostMapping(value = "/login")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "test")
    })
    LoginResponse Login(@Valid @RequestBody LoginRequest request, BindingResult result) throws Exception {
        if (result.hasErrors()) {
            throw new InvalidParameterException(result.getFieldError().getDefaultMessage(), new String[]{result.getFieldError().getField()});
        }
        if (userService.Login(request.getUsername(), request.getPassword())) {
            User user = userService.FindUserByName(request.getUsername());
            return new LoginResponse(user.get_id(), user.getName(), jwtConfig.createToken(user.get_id()));
        } else {
            System.out.println("账号或密码错误");
            throw new InvalidParameterException("账号或密码错误", null);
        }
    }

    @PostMapping(value = "/register")
    Object Register(@Valid @RequestBody RegisterRequest request, BindingResult result) throws Exception {
        return null;
    }

    @AuthCheck({RequiredType.ADMIN})
    @GetMapping(value = "/getDanmakuUrl")
    public GetDanmakuUrlResponse getDanmakuUrl(@RequestHeader HttpHeaders headers) throws Exception {
        User user = GetUser(headers);
        if ("".equals(user.getDanmakuUrl())) {
            user.setDanmakuUrl(StringUtils.generateString(18));
            user = userService.SaveUser(user);
            // todo check error
            System.out.println("结果：" + jedisUtil.hset(STREAMER_DANMAKU_URL_KEY, user.getDanmakuUrl(), user.get_id()));
        }
        return new GetDanmakuUrlResponse(user.getDanmakuUrl());
    }

    // todo not auth check
    @GetMapping(value = "/users/{id}")
    // todo return response
    public User getUserById(@PathVariable String id) throws Exception {
        // todo check
        User user = userService.FindByUserId(id);
        user.setPassword("");
        user.setDanmakuUrl("");
        return user;
    }

    @GetMapping(value = "/danmaku/validate")
    public ValidateDanmakuUrlResponse validateDanmakuUrl(@RequestParam(value = "danmakuUrl", defaultValue = "") String danmakuUrl) throws Exception {
        if (jedisUtil.hexists(STREAMER_DANMAKU_URL_KEY, danmakuUrl)) {
            return new ValidateDanmakuUrlResponse(jedisUtil.hget(STREAMER_DANMAKU_URL_KEY, danmakuUrl));
        }
        throw new InvalidParameterException("url 不存在", null);
    }
}
