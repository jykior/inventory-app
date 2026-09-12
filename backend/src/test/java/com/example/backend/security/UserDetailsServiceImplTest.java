package com.example.backend.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import com.example.backend.entity.Users;
import com.example.backend.repository.UsersRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;


@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

  @InjectMocks
  private UserDetailsServiceImpl userDetailsService;

  @Mock
  private UsersRepository usersRepository;

  @Test
  void 存在しないメールアドレスの場合はBadCredentialsException() {

    when(usersRepository.findByEmail("test@example.com")).thenReturn(java.util.Optional.empty());

    assertThrows(BadCredentialsException.class, () -> userDetailsService.loadUserByUsername("test@example.com"));
  }

  @Test
  void 存在するメールアドレスの場合はUserDetailsを返す() {
    Users users = new Users();
    users.setEmail("test@example.com");
    users.setPasswordHash("passwordHash");
    users.setRole("USER");

    when(usersRepository.findByEmail("test@example.com")).thenReturn(Optional.of(users));

    UserDetails result = userDetailsService.loadUserByUsername("test@example.com");

    assertNotNull(result);
    assertEquals("test@example.com", result.getUsername());
    assertEquals("passwordHash", result.getPassword());
    assertEquals("ROLE_USER", result.getAuthorities().iterator().next().getAuthority());
  }
}
