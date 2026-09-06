package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class UserService {

  private final UserRepository userRepository;

  public User findByEmail(String email){
    return userRepository.findByEmail(email).orElseThrow();
  }

  public User login(String email,String password){

    User user =findByEmail(email);

    if (!password.equals(user.getPasswordHash())){
      throw new IllegalArgumentException("メールアドレスまたはパスワードが正しくありません");
    }
    return user;
  }
}
