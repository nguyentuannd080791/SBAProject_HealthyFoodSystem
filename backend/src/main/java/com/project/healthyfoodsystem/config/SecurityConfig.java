package com.project.healthyfoodsystem.config;

import com.project.healthyfoodsystem.module.auth.constant.RoleConstants;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@AllArgsConstructor
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                        .accessDeniedHandler(jwtAccessDeniedHandler)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/uploads/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers("/api/auth/change-password").authenticated()
                        .requestMatchers("/api/auth/**", "/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/payments/sepay/webhook").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/api/profile/**", "/profile/**").authenticated()
                        .requestMatchers("/api/addresses/**", "/addresses/**").authenticated()
                        .requestMatchers("/api/user/**", "/user/**").hasAnyAuthority(
                                RoleConstants.ROLE_PREFIX + RoleConstants.CUSTOMER,
                                RoleConstants.ROLE_PREFIX + RoleConstants.MANAGER,
                                RoleConstants.ROLE_PREFIX + RoleConstants.ADMINISTRATOR,
                                "ROLE_USER", "ROLE_ADMIN"
                        )
                        .requestMatchers("/api/staff/**").hasAuthority("ROLE_STAFF")
                        .requestMatchers("/api/manager/**", "/manager/**").hasAnyAuthority(
                                RoleConstants.ROLE_PREFIX + RoleConstants.MANAGER,
                                RoleConstants.ROLE_PREFIX + RoleConstants.ADMINISTRATOR,
                                "ROLE_ADMIN"
                        )
                        .requestMatchers("/api/admin/**", "/admin/**").hasAnyAuthority(
                                RoleConstants.ROLE_PREFIX + RoleConstants.ADMINISTRATOR,
                                "ROLE_ADMIN"
                        )
                        .anyRequest().authenticated())
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOriginPatterns(List.of(
                "http://localhost:[*]",
                "http://127.0.0.1:[*]",
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "*"
        ));
        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        corsConfiguration.setAllowedHeaders(List.of("*"));
        corsConfiguration.setExposedHeaders(List.of("Authorization", "Set-Cookie"));
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource configurationSource = new UrlBasedCorsConfigurationSource();
        configurationSource.registerCorsConfiguration("/**", corsConfiguration);

        return configurationSource;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
