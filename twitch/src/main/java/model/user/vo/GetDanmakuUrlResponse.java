package model.user.vo;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GetDanmakuUrlResponse {
    private String danmakuUrl;

    public GetDanmakuUrlResponse(String danmakuUrl) {
        this.danmakuUrl = danmakuUrl;
    }
}
