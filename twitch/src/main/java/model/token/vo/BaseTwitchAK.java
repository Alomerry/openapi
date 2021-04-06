package model.token.vo;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "memberLoginResponse", description = "")
public class BaseTwitchAK {
    /**
     * accessToken 令牌信息
     */
    @ApiModelProperty(value = "token", hidden = false)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String access_token;
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Integer expires_in;
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String token_type;
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String[] scope;

    public BaseTwitchAK(String access_token, Integer expires_in, String token_type) {
        this.access_token = access_token;
        this.expires_in = expires_in;
        this.token_type = token_type;
    }

    public BaseTwitchAK() {
    }
}
