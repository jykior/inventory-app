package com.example.backend.controller;

import com.example.backend.entity.Item;
import com.example.backend.service.ItemService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173/")
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
  public void deleteItem(@PathVariable Long id){
    itemService.deleteItem(id);
  }
}
