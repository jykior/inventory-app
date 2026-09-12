package com.example.backend.service;

import com.example.backend.dto.RegisterRequest;
import com.example.backend.entity.Users;
import com.example.backend.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * ユーザー情報の取得や認証に関する処理を提供するサービスクラス。
 */
@Service
@RequiredArgsConstructor

public class UsersService {

  private final UsersRepository usersRepository;
  private final AuthenticationManager authenticationManager;
  private final PasswordEncoder passwordEncoder;

  public Authentication login(String email, String password) {

    return authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            email,
            password));
  }

  public Users findByEmail(String email) {
    return usersRepository.findByEmail(email)
        .orElseThrow();
  }

  public Users register(RegisterRequest request) {
    if (usersRepository.existsByEmail(request.getEmail())) {
      throw new IllegalArgumentException("EMAIL_ALREADY_EXISTS");
    }
    if (!request.getPassword().equals(request.getConfirmPassword())) {
      throw new IllegalArgumentException("PASSWORD_MISMATCH");
    }
    Users users = new Users();

    users.setEmail(request.getEmail());
    users.setPasswordHash(
        passwordEncoder.encode(request.getPassword())
    );
    users.setRole("STAFF");
    users.setNickName(request.getNickName());

    return usersRepository.save(users);
  }
}
