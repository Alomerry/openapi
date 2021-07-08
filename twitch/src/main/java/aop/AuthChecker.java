package aop;

import config.JwtConfig;
import core.Result;
import core.ResultCode;
import interceptor.annotation.AuthCheck;
import interceptor.annotation.RequiredType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.SignatureException;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Aspect
@Component
public class AuthChecker {

    final static Set<String> NO_NEED_CHECK_AUTH_PATHS = Stream.of("/getAK", "/register", "/login", "/danmaku/validate", "/users/{id}", "/settings/{userId}").collect(Collectors.toCollection(HashSet<String>::new));
    @Autowired
    private JwtConfig jwtConfig;

    @AfterReturning(pointcut = "execution(* controller.*.*(..))", returning = "returnValue")
    public void ControllerLog(JoinPoint joinPoint, Object returnValue){
        System.out.println("@AfterReturning：模拟日志记录功能...");
        System.out.println("@AfterReturning：目标方法为：" +
                joinPoint.getSignature().getDeclaringTypeName() +
                "." + joinPoint.getSignature().getName());
    }

    @Around("@annotation(interceptor.annotation.AuthCheck)")
    public Object checkAuthCheckByAnnotation(ProceedingJoinPoint joinPoint) throws Throwable {
        Class<?> clasz = joinPoint.getTarget().getClass();
        String methodName = joinPoint.getSignature().getName();
//        logger.info("拦截方法[{}]成功", methodName);
        Class[] argClass = ((MethodSignature) joinPoint.getSignature()).getParameterTypes();

        Method method = null;
        try {
            method = clasz.getMethod(methodName, argClass);
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }

        AuthCheck acer = null;

        if (method.isAnnotationPresent(AuthCheck.class)) {
            acer = method.getAnnotation(AuthCheck.class);
            Object res = checkAuth(acer);
//            logger.info("result[{}]", res == null ? "验证成功" : "验证失败");

            if (res != null) {
                return res;
            }
        }
        return joinPoint.proceed();
    }

    @Around("execution(* controller.*.*(..))")
    public Object checkAuthByURL(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("**  测试打印反射信息" + joinPoint.getSignature().getName() + "  **");
        Method method = ((MethodSignature) joinPoint.getSignature()).getMethod();
//        handleAnnotations(method.getAnnotations());
        return joinPoint.proceed();
    }

    /**
     * @param acer 权限要求注解实体
     * @return Result结果
     */
    private Object checkAuth(AuthCheck acer) {
        RequiredType[] requiredTypes = acer.value();
        for (RequiredType type : requiredTypes) {
//            logger.debug("注解要求检测[{}]权限", type);
            ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (requestAttributes == null) {
//                logger.info("ServletRequestAttributes空指正");
                return new Result().setCode(ResultCode.INTERNAL_SERVER_ERROR).setMessage("Session错误");
            }
            switch (type) {
                case ADMIN: {
//                    String level = (String) JWTUtils.getBodyValue((requestAttributes.getRequest().getHeader("jwt")), "level");
//                    if (!PermissionManager.isAdmin(level)) {
//                        result = new Result();
//                        result.setCode(ResultCode.FORBIDDEN).setMessage("权限不足");
//                        return result;
//                    }
//                    break;
                }
                case LOGIN: {
                /*从session里面获取对应的值
                logger.info("session-v1:[{}]", requestAttributes.getAttribute(ONLINEJUDGE_SESSION_UER, RequestAttributes.SCOPE_SESSION));
                logger.info("session-v2:[{}]", requestAttributes.getRequest().getSession().getAttribute(ONLINEJUDGE_SESSION_UER));*/
//                    User user = null;
//                    user = (User) requestAttributes.getRequest().getSession().getAttribute(ONLINEJUDGE_SESSION_UER);
//                    logger.info("request:session:key[{}]:values[{}]", ONLINEJUDGE_SESSION_UER, user);
//                    if (user == null) {
//                        result = new Result();
//                        result.setCode(ResultCode.UNAUTHORIZED).setMessage("请登录后操作");
//                        return result;
//                    } else {
//                        return null;
//                    }
                }
            }
        }

        return null;
    }

    private void handleAnnotations(Annotation[] annotations) {
        for (int i = 0; i < annotations.length; i++) {
            if (isMapper(annotations[i]) && needCheckToken(getMapperPath(annotations[i]))) {
                // check token
                System.out.println("需要验证 token");
                RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
                HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
                String token = request.getHeader("accessToken");
                System.out.println("token:" + token);
                try {
                    Claims claims = jwtConfig.getTokenClaim(token);
                    if (claims == null || jwtConfig.isTokenExpired(claims.getExpiration())) {
                        throw new SignatureException("令牌过期，请重新登录。");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    throw new SignatureException("令牌失效，请重新登录。");
                }
            }
        }
        System.out.println("token 验证完毕");
    }

    private boolean isMapper(Annotation annotation) {
        if (annotation instanceof PostMapping) {
            return true;
        }
        if (annotation instanceof RequestMapping) {
            return true;
        }
        if (annotation instanceof GetMapping) {
            return true;
        }
        return false;
    }

    private String getMapperPath(Annotation annotation) {
        if (annotation instanceof PostMapping) {
            return ((PostMapping) annotation).value()[0];
        }
        if (annotation instanceof RequestMapping) {
            return ((RequestMapping) annotation).value()[0];
        }
        if (annotation instanceof GetMapping) {
            return ((GetMapping) annotation).value()[0];
        }

        // todo
        return "";
    }

    private boolean needCheckToken(String path) {
        System.out.println("CheckTokenUrl:" + path);
        return !NO_NEED_CHECK_AUTH_PATHS.contains(path);
    }
}