package model.user.vo;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;

@Data
@ApiModel(value = "memberLoginResponse", description = "")
public class LoginResponse implements Serializable {
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String id;
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String name;

    /**
     * accessToken 令牌信息
     */
    @ApiModelProperty(value = "token", hidden = false)
    private String accessToken;

    public LoginResponse(String id, String name, String accessToken) {
        this.id = id;
        this.name = name;
        this.accessToken = accessToken;
    }
}
