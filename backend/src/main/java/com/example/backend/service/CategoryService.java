package com.example.backend.service;

import com.example.backend.entity.Category;
import com.example.backend.repository.CategoryRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * カテゴリの取得や管理を行うクラス
 */

@Service
@RequiredArgsConstructor
public class CategoryService {

  private final CategoryRepository categoryRepository;

  public List<Category> findAll() {
    return categoryRepository.findAll();
  }

  public Category createCategory(Category category) {
    /*カテゴリ名の重複チェック*/
    if (categoryRepository.existsByName(category.getName())) {
      throw new IllegalArgumentException();
    }
    return categoryRepository.save(category);
  }
}
