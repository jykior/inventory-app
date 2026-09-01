package com.example.backend.controller;

import com.example.backend.entity.Category;
import com.example.backend.service.CategoryService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/categories")
public class CategoryController {

  private final CategoryService categoryService;

  public CategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @GetMapping
  public List<Category> getCategories() {
    return categoryService.findAll();
  }

  @PostMapping
  public Category createCategory(@RequestBody Category category) {
    return categoryService.createCategory(category);
  }

  @DeleteMapping("/{id}")
  public void deleteCategory(@PathVariable Long id) {
    categoryService.deleteCategory(id);
  }
}
