package com.example.backend.service;


import com.example.backend.entity.Item;
import com.example.backend.repository.ItemRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 在庫商品の取得や管理を行うクラス。
 */
@Service
@RequiredArgsConstructor
public class ItemService {

  private final ItemRepository itemRepository;

  public List<Item> findAll() {
    return itemRepository.findAll();
  }

  public Item createItem(Item item) {
    return itemRepository.save(item);
  }

  public void deleteItem(Long id) {
    itemRepository.deleteById(id);
  }

  public Item updateItem(Long id, Item updateItem) {
    Item item = itemRepository.findById(id).orElseThrow();
    item.setName(updateItem.getName());
    item.setCategory(updateItem.getCategory());
    item.setCurrent_stock(updateItem.getCurrent_stock());
    item.setMinStock(updateItem.getMinStock());
    return itemRepository.save(item);
  }

  public Item updateStock(Long id, Integer newStock) {
    Item item = itemRepository.findById(id).orElseThrow();
    item.setCurrent_stock(newStock);
    return itemRepository.save(item);
  }
}
