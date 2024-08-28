package com.bai.usercenter.aop;

import com.bai.usercenter.common.ErrorCode;
import com.bai.usercenter.exception.BusinessException;
import com.bai.usercenter.model.domain.User;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import com.bai.usercenter.annotation.AuthCheck;
import javax.servlet.http.HttpServletRequest;

import static com.bai.usercenter.contant.UserConstant.USER_LOGIN_STATE;

@Aspect
@Component
public class AuthInterceptor {

    @Before("@annotation(authCheck)")
    public Object authInterceptor(AuthCheck authCheck) {
        String role = authCheck.mustRole();
        RequestAttributes requestAttributes = RequestContextHolder.currentRequestAttributes();
        HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
        // 仅管理员可查询
        Object userObj = request.getSession().getAttribute(USER_LOGIN_STATE);
        User user = (User) userObj;
        if (user == null || !user.getUserRole().equals(role)){
            throw new BusinessException(ErrorCode.NO_AUTH, "缺少权限");
        }
        return null;

    }

}
