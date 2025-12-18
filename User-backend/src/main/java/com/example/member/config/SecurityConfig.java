package com.example.member.config;

import com.example.member.jwt.JwtAuthenticationFilter;
import com.example.member.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final TokenProvider tokenProvider;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception{
        http
                .cors((cors -> cors.configurationSource(corsConfigurationSource)))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/member/signIn", "/api/member/signUp").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        new JwtAuthenticationFilter(tokenProvider),
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class
                );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource () {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList(
                "http://192.168.0.71:3000",
                "http://192.168.0.33:3000",
                "http://192.168.0.33:8082",
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:8080",
                "http://127.0.0.1:8080",
                "http://[EC2_FRONTEND_IP]",       // 프론트엔드가 EC2에서 기본 80/443 포트로 서비스되는 경우
                "http://[EC2_API_IP]:8081",       // Sign API 백엔드 포트 (프론트가 직접 호출하지 않더라도, 필요할 수 있음)
                "http://[EC2_API_IP]:8082"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.addAllowedHeader("*");;
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}