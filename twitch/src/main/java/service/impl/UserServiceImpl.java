package service.impl;

import dao.MemberDao;
import dao.UserDao;
import exception.base.InvalidParameterException;
import model.user.po.User;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import service.UserService;

import javax.annotation.Resource;

@Service
public class UserServiceImpl implements UserService {
    @Resource
    private UserDao userDao;

    public boolean Login(String userName, String passwd) {
        User user = userDao.findByNameAndPasswordAndIsDeleted(userName, passwd, false);
        if (user != null)
            return true;
        else
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
        return userDao.findByNameAndIsDeleted(userName, false);
    }

    @Override
    public User FindByUserId(String userId) {
        return userDao.findBy_id(userId);
    }

    @Override
    public User SaveUser(User user) {
        return userDao.save(user);
    }
}
