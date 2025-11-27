package com.academic.erp.salary.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
// @Component removed - filter is no longer automatically registered
// import org.springframework.stereotype.Component;

import java.io.IOException;

// @Component - REMOVED to disable this filter
public class JwtFilter implements Filter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        // allow auth endpoints and preflight requests
        String uri = request.getRequestURI();
        if (uri.startsWith("/api/auth") || "OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(req, res);
            return;
        }

        String token = request.getHeader("Authorization");

        if (token != null && token.startsWith("Bearer ")) {
            try {
                String email = jwtUtil.extractEmail(token.substring(7));

                // store email for later use in controller
                request.setAttribute("email", email);

            } catch (Exception ignored) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or missing token");
                return;
            }
        } else {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or missing token");
            return;
        }

        chain.doFilter(req, res);
    }
}
