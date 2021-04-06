package dao;

import model.user.po.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserDao extends MongoRepository<User, ObjectId> {
    User findByNameAndPasswordAndIsDeleted(String name, String passwd, boolean isDeleted);

    User findByNameAndIsDeleted(String name, boolean isDeleted);

    User findBy_id(String id);
}

