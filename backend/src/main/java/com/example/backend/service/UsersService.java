package com.example.backend.service;

import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.entity.Users;
import com.example.backend.repository.UsersRepository;
import java.util.List;
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
      throw new IllegalArgumentException();
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

  public void updateRole(Long id, String role) {
    if ("ADMIN".equals(role) && usersRepository.existsByRole("ADMIN")) {
      throw new IllegalArgumentException("ADMIN_ALREADY_EXISTS");
    }
    if (!"ADMIN".equals(role) && !"MANAGER".equals(role) && !"STAFF".equals(role) && !"GUEST".equals(role)) {
      throw new IllegalArgumentException();
    }

    Users users = usersRepository.findById(id).orElseThrow();

    users.setRole(role);

    usersRepository.save(users);
  }

  public List<UserResponse> findAll() {
    return usersRepository.findAll().stream()
        .map(users -> new UserResponse(
            users.getId(),
            users.getNickName(),
            users.getRole()
        )).toList();
  }
}
