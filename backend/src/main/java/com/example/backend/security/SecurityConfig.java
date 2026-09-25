package com.example.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

/**
 * Spring Securityの認証・認可に関する設定を行うクラス。
 */
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

  private final UserDetailsServiceImpl userDetailsService;

  @Bean
  public AuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder) {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder);
    return provider;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
    return configuration.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider authenticationProvider) throws Exception {
    http.cors(cors -> {
        }).csrf(csrf -> csrf.disable())
        .securityContext(context -> context.securityContextRepository(securityContextRepository()))
        .authenticationProvider(authenticationProvider)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/login", "/api/auth/register", "/api/guest/login", "/error").permitAll()
            .requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
            // 商品・カテゴリ操作
            .requestMatchers(HttpMethod.GET, "/api/items","/api/categories")
            .hasAnyRole("ADMIN", "MANAGER", "STAFF", "GUEST")

            .requestMatchers(HttpMethod.POST, "/api/items","/api/categories")
            .hasAnyRole("ADMIN", "MANAGER", "GUEST")

            .requestMatchers(HttpMethod.PUT, "/api/items/*")
            .hasAnyRole("ADMIN", "MANAGER", "GUEST")

            .requestMatchers(HttpMethod.DELETE, "/api/items/*","/api/categories/*")
            .hasAnyRole("ADMIN", "MANAGER", "GUEST")

            // 在庫数操作
            .requestMatchers(HttpMethod.PATCH, "/api/items/*/stock")
            .hasAnyRole("ADMIN", "MANAGER", "STAFF", "GUEST")

            // 権限変更
            .requestMatchers(HttpMethod.PATCH, "/api/auth/*/role")
            .hasAnyRole("ADMIN")

            // メールアドレス変更
            .requestMatchers(HttpMethod.PATCH, "/api/auth/email")
            .hasAnyRole("ADMIN", "MANAGER", "STAFF", "GUEST")

            .anyRequest()
            .authenticated()
        );
    return http.build();
  }

  @Bean
  public SecurityContextRepository securityContextRepository() {
    return new HttpSessionSecurityContextRepository();
  }
}
