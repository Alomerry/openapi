package model.token.vo;

import lombok.Data;

@Data
public class GetAKRequest {
    private String client_id;
    private String client_secret;
    private String grant_type;
    private String[] scope;

    public GetAKRequest() {
    }

    public GetAKRequest(String grant_type, String[] scope) {
        this.grant_type = grant_type;
        this.scope = scope;
    }
}
