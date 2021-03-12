package controller;

import config.JwtConfig;
import exception.base.InvalidParameterException;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import model.member.vo.LoginRequest;
import model.member.vo.LoginResponse;
import model.member.vo.RegisterRequest;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import service.UserService;

import javax.annotation.Resource;
import javax.validation.Valid;

@RestController
public class UserController extends BaseController {

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
        if (userService.Login(request.getName(), request.getPassword())) {
//            return new LoginResponse(user.getId(), user.getName(), jwtConfig.createToken(user.getId()));
            return null;
        } else {
            throw new InvalidParameterException("账号或密码错误", null);
        }
    }

    @PostMapping(value = "/register")
    Object Register(@Valid @RequestBody RegisterRequest request, BindingResult result) throws Exception {
            return null;
    }
}
