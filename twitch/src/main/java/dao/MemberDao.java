package dao;

import model.member.po.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MemberDao extends MongoRepository<User, ObjectId> {

//    User findByNameAndPasswdAndIsDeleted(String name, String passwd, boolean isDeleted);
//
//    User findByNameAndIsDeleted(String name, boolean isDeleted);
}
