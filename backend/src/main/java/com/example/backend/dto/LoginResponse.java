package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class LoginResponse {

  private Long id;
  private String nickName;
  private String role;

  public LoginResponse(Long id, String nickName, String role) {
    this.id = id;
    this.nickName = nickName;
    this.role = role;
  }
}
