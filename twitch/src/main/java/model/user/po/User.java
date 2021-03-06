package model.user.po;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;

@Data
@Document
public class User implements Serializable {
    @Id
    private String _id; // id
    private String name; // 用户名
    private String password; // 密码
    private String type; // 类型
    private String bio; // 签名
    private String logo;
    private String danmakuUrl; // 弹幕姬超链接
    @Deprecated
    private String twitchName; // twitchName
    private boolean isDisabled; // 是否禁用
    private boolean isDeleted; // 是否删除
    @CreatedDate
    private Date created_at;
    @LastModifiedDate
    private Date updated_at;

    public User(String name) {
        this.name = name;
    }
}