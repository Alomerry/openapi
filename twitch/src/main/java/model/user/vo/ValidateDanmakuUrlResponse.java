package model.user.vo;

import lombok.Data;

@Data
public class ValidateDanmakuUrlResponse {
    private String id;

    public ValidateDanmakuUrlResponse(String id) {
        this.id = id;
    }

    public ValidateDanmakuUrlResponse() {
    }
}
