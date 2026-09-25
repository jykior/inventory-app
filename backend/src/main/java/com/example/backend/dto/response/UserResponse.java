package com.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class UserResponse {

  private Long id;
  private String email;
  private String nickName;
  private String role;

  public UserResponse(Long id, String email, String nickName, String role) {
    this.id = id;
    this.email = email;
    this.nickName = nickName;
    this.role = role;
  }
}

