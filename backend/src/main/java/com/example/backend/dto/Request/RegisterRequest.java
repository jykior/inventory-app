package com.example.backend.dto.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
  private String email;
  private String password;
  private String confirmPassword;
  private String nickName;
}