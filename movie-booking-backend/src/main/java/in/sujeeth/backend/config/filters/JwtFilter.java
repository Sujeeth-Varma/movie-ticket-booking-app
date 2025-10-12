package in.sujeeth.backend.config.filters;

import in.sujeeth.backend.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        if (token != null && jwtService.verifyToken(token)) {
            // Extract user info from token
            String email = jwtService.extractEmail(token);
            Long userId = jwtService.extractUserId(token);

            // Create Authentication object — tells Spring Security user is authenticated
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            email,      // principal (we can also use a User object)
                            null,       // credentials (null since we already validated)
                            Collections.emptyList() // no roles/authorities for now
                    );

            // Set the authentication in context
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }
}

