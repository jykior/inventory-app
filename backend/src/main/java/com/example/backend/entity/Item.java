package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
/**
 * 商品（在庫アイテム）を表すクラス。
 * カテゴリに紐づき、現在庫数・アラート通知数などの情報を持つ。
 */
@Entity
@Table(name = "items")
@Getter
@Setter

public class Item {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

@ManyToOne
@JoinColumn(name = "category_id",nullable = false)
  private Category category;

  @Column(nullable = false)
  private Integer current_stock;

  @Column(nullable = false)
  private Boolean alertEnabled;

  @Column(nullable = false)
  private Integer minStock;

  private Integer sortOder;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;
}
