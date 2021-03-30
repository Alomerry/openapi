package service.impl;

import dao.MemberDao;
import exception.base.InvalidParameterException;
import model.member.po.User;
import org.springframework.stereotype.Service;
import service.UserService;

import javax.annotation.Resource;

@Service
public class UserServiceImpl implements UserService {
//    @Resource
//    private MemberDao memberDao;

    public boolean Login(String userName, String passwd) {
//        User member = memberDao.findByNameAndPasswdAndIsDeleted(userName, passwd, false);
//        if (member != null)
//            return true;
//        else
        return false;
    }

    @Override
    public boolean Register(String userName, String passwd, String repeatPasswd) {
        if (!passwd.equals(repeatPasswd)) {
            throw new InvalidParameterException("两次密码不一致", new Object[]{"password", "repeat password"});
        }
//        if (memberDao.findByNameAndIsDeleted(userName, false) != null) {
//            throw new InvalidParameterException("用户名已存在", new Object[]{"user name"});
//        }
//        if (memberDao.insert(new User(userName, passwd)) != null) {
//            return true;
//        }
        throw new InvalidParameterException("未知错误", null);
    }

    public User FindUserByName(String userName) {
//        return memberDao.findByNameAndIsDeleted(userName, false);
        return null;
    }
}
