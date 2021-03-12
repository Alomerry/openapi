package aop;

import org.aspectj.lang.annotation.Aspect;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class RequestValidate implements Ordered {
    @Override
    public int getOrder() {
        return 0;
    }
}