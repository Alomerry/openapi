package app;

import config.JwtConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import springfox.documentation.oas.annotations.EnableOpenApi;

@SpringBootApplication()
@EnableScheduling // 开启定时任务功能
@EnableMongoAuditing
@ComponentScan({"controller", "service", "config", "interceptor","aop","task"})
@EnableMongoRepositories("dao")
@EnableOpenApi
@EnableConfigurationProperties({
        JwtConfig.class,
})
public class WebApp {
    public static void main(String[] args) {
        SpringApplication.run(WebApp.class, args);
    }
}
