package com.example.backend.controller;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.LoginResponse;
import com.example.backend.entity.User;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class UserController {

  private final UserService userService;

  @PostMapping("/login")
  public LoginResponse login(@RequestBody LoginRequest request) {
    User user = userService.login(
        request.getEmail(),
        request.getPassword());

    return new LoginResponse(
        user.getId(),
        user.getNickname(),
        user.getRole());
  }
}
