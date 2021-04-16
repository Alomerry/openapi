package model.user.vo;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Date;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class UserVO {
    private String _id; // id
    private String name; // 用户名
    private String password; // 密码
    private String type; // 类型
    private String bio; // 签名
    private String logo;
    private String danmakuUrl; // 弹幕姬超链接
    private String twitchName; // twitchName
    private boolean isDisabled; // 是否禁用
    private boolean isDeleted; // 是否删除
    private Date created_at;
    private Date updated_at;
}
