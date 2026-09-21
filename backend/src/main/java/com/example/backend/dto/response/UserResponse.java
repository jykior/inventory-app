package com.example.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class UserResponse {

  private Long id;
  private String nickName;
  private String role;

  public UserResponse(Long id, String nickName, String role) {
    this.id = id;
    this.nickName = nickName;
    this.role = role;
  }
}

