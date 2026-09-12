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
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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

    try {
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
    } catch (AuthenticationException e) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }
  }

  @PostMapping("/register")
  public RegisterResponse register(@RequestBody RegisterRequest request) {
    try {
      Users users = usersService.register(request);
      return new RegisterResponse(
          users.getId(),
          users.getEmail(),
          users.getNickName(),
          users.getRole()
      );
    } catch (IllegalArgumentException e) {
      if ("EMAIL_ALREADY_EXISTS".equals(e.getMessage())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT);
      }
      if ("PASSWORD_MISMATCH".equals(e.getMessage())) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
      }
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }
  }
}
