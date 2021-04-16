package model.setting.po;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;

@Data
@NoArgsConstructor
@Document
public class Setting implements Serializable {
    @Id
    private String _id; // id
    @CreatedDate
    private Date created_at;
    @LastModifiedDate
    private Date updated_at;
    private DanmakuSetting danmakuSetting;
    private ObjectId userId;

    public Setting(String userId) {
        this.userId = new ObjectId(userId);
    }
}

