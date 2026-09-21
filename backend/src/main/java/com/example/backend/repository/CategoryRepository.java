package com.example.backend.repository;

import com.example.backend.entity.Category;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

  boolean existsByNameAndIsDemoAndGuestId(String name, Boolean isDemo, Long guestId);

  List<Category> findAllByIsDemoAndGuestId(Boolean isDemo, Long guestId);

  Optional<Category> findByIdAndIsDemoAndGuestId(Long id, Boolean isDemo, Long guestId);

  void deleteAllByIsDemoAndGuestId(Boolean isDemo, Long guestId);
}
