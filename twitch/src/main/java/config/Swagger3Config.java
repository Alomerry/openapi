package config;

import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;

@Configuration
public class Swagger3Config {

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("Swagger3接口文档")
                .description("更多请咨询服务开发者Ray。")
                .contact(new Contact("xxx.xxx","xxx.xxx","xxx.xxx"))
                .version("1.0")
                .build();
    }
}
