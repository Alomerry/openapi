package model.member.po;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;

@Data
@Document
public class Member implements Serializable {
    @Id
    private String _id; // id
    private String name; // 用户名
    private String type; // 类型
    private String bio; // 签名
    @CreatedDate
    private Date created_at;
    @LastModifiedDate
    private Date updated_at;
    private String logo;

    public Member(String name) {
        this.name = name;
    }
}
