package model.setting.vo;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import model.setting.po.DanmakuSetting;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class SettingVO implements Serializable {
    private String _id; // id
    private Date created_at;
    private Date updated_at;
    private DanmakuSettingVO danmakuSetting;
}

