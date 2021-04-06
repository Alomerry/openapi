package task.user;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SyncUserDaily {
    @Scheduled(cron = "*/15 * * * * ?")
    public void execute() {
//        System.out.println("测试任务");
    }
}
