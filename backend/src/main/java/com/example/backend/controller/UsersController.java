package com.example.backend.controller;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.LoginResponse;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.RegisterResponse;
import com.example.backend.entity.Users;
import com.example.backend.service.UsersService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * ユーザー認証に関するAPIを提供するコントローラークラス。
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class UsersController {

  private final UsersService usersService;
  private final SecurityContextRepository securityContextRepository;

  @PostMapping("/login")
  public LoginResponse login(
      @RequestBody LoginRequest request,
      HttpServletRequest httpServletRequest,
      HttpServletResponse httpServletResponse) {

    Authentication authentication = usersService.login(
        request.getEmail(),
        request.getPassword()
    );

    SecurityContext context = SecurityContextHolder.createEmptyContext();

    context.setAuthentication(authentication);

    SecurityContextHolder.setContext(context);

    securityContextRepository.saveContext(
        context,
        httpServletRequest,
        httpServletResponse
    );

    Users users = usersService.findByEmail(authentication.getName());

    return new LoginResponse(
        users.getId(),
        users.getNickName(),
        users.getRole());
  }

  @PostMapping("/register")
  public RegisterResponse register(@RequestBody RegisterRequest request) {
    Users users =usersService.register(request);
    return new RegisterResponse(
        users.getId(),
        users.getEmail(),
        users.getNickName(),
        users.getRole()
    );
  }
}
