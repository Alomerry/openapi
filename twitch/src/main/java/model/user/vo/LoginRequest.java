package model.user.vo;

import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Data
public class LoginRequest implements Serializable {
    @NotNull(message = "name field can't be null")
    @Size(min = 6, max = 18, message = "name field length invalid")
    private String username;

    @NotNull(message = "password field can't be null")
    @Size(min = 6, max = 18, message = "password field length invalid")
    private String password;
}
