package com.example.backend.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import com.example.backend.dto.Request.LoginRequest;
import com.example.backend.service.UsersService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class UsersControllerTest {

  @InjectMocks
  private UsersController usersController;
  @Mock
  private UsersService usersService;

  @Mock
  private SecurityContextRepository securityContextRepository;

  @Mock
  private HttpServletRequest httpServletRequest;

  @Mock
  private HttpServletResponse httpServletResponse;

  @Test
  void ログイン認証失敗の場合は401を返す() {

    when(usersService.login(any(), any())).thenThrow(new BadCredentialsException("Bad credentials"));

    com.example.backend.dto.Request.LoginRequest request = new LoginRequest();
    request.setEmail("test@example.com");
    request.setPassword("wrongPassword");

    ResponseStatusException exception = assertThrows(ResponseStatusException.class,
        () -> usersController.login(request, httpServletRequest, httpServletResponse));

    assertEquals(401, exception.getStatusCode().value());
  }

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders
        .standaloneSetup(usersController)
        .build();
  }

  @Test
  void ログイン認証失敗の場合はHTTP401を返す() throws Exception {

    when(usersService.login(any(), any()))
        .thenThrow(new BadCredentialsException("Bad credentials"));

    mockMvc.perform(post("/api/auth/login")
            .contentType("application/json")
            .content("""
                {
                "email": "test@example.com",
                "password": "wrongPassword"
                }
                """))
        .andExpect(status().isUnauthorized());
  }
}


