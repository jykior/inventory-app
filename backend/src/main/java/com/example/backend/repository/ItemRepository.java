package com.example.backend.repository;

import com.example.backend.entity.Item;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {

  boolean existsByName(String name);

  List<Item> findAllByOrderBySortOrderAsc();
}
