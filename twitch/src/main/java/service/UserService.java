package service;

import model.member.po.User;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    /**
     * 用户登录
     * @param userName 用户名
     * @param passwd 密码
     * @return 是否登录成功
     */
    boolean Login(String userName, String passwd);

    /**
     * 用户注册
     * @param userName 用户名
     * @param passwd 密码
     * @param repeatPasswd 重复密码
     * @return 是否注册成功
     */
    boolean Register(String userName, String passwd, String repeatPasswd) throws Exception;

    /**
     * 根据用户名查找用户
     * @param userName 用户名
     * @return
     */
    User FindUserByName(String userName);
}
