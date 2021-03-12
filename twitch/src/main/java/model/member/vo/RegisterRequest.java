package model.member.vo;

import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Data
public class RegisterRequest implements Serializable {
    @NotNull(message = "name field can't be null")
    @Size(min = 6, max = 18, message = "name field length invalid")
    private String name;

    @NotNull(message = "passwd field can't be null")
    @Size(min = 6, max = 18, message = "name field length invalid")
    private String password;

    @NotNull(message = "passwd field can't be null")
    @Size(min = 6, max = 18, message = "name field length invalid")
    private String repeatPassword;
}
