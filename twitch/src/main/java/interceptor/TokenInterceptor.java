package interceptor;

import config.JwtConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.SignatureException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class TokenInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtConfig jwtConfig;

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws SignatureException {
        /** 地址过滤 */
        String uri = request.getRequestURI();
        // todo
        if (uri.contains("/login") || uri.contains("/register") || uri.contains("/error") || uri.contains("swagger") || uri.contains("api")) {
            return true;
        }
        /** Token 验证 */
        String token = request.getHeader(jwtConfig.getHeader());
        if (StringUtils.isEmpty(token)) {
            token = request.getParameter(jwtConfig.getHeader());
        }
        if (StringUtils.isEmpty(token)) {
            throw new SignatureException("令牌不能为空");
        }

        Claims claims = null;
        try {
            claims = jwtConfig.getTokenClaim(token);
            if (claims == null || jwtConfig.isTokenExpired(claims.getExpiration())) {
                throw new SignatureException("令牌过期，请重新登录。");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new SignatureException("令牌失效，请重新登录。");
        }

        /** 设置 userId 用户ID */
        request.setAttribute("userId", claims.getSubject());
        return true;
    }
}
