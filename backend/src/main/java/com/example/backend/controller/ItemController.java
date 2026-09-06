package com.example.backend.controller;

import com.example.backend.entity.Item;
import com.example.backend.service.ItemService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

  private final ItemService itemService;

  @GetMapping
  public List<Item> getItem() {
    return itemService.findAll();
  }

  @PostMapping
  public Item createItem(@RequestBody Item item) {
    return itemService.createItem(item);
  }

  @DeleteMapping("/{id}")
  public void deleteItem(@PathVariable Long id) {
    itemService.deleteItem(id);
  }

  @PutMapping("/{id}")
  public Item updateItem(@PathVariable Long id, @RequestBody Item item) {
    return itemService.updateItem(id, item);
  }

  @PatchMapping("/{id}/stock")
  public Item updateStock(@PathVariable Long id, @RequestBody Map<String, Integer> request) {
    return itemService.updateStock(id, request.get("current_stock"));
  }
}
