package dao;

import model.setting.po.Setting;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SettingDao extends MongoRepository<Setting, ObjectId> {
    Setting findSettingByUserId(String userId);
}
