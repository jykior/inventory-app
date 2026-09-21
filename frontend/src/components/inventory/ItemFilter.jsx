
function ItemFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  searchKeyword,
  setSearchKeyword,
  sortOrder,
  setSortOrder,
}) {
  return (
    <div className="filter-area">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="すべて">すべてのカテゴリー</option>

        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="すべて">すべての状態</option>
        <option value="正常">正常</option>
        <option value="少ない">少ない</option>
        <option value="注意">注意</option>
      </select>

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="default">並び順(標準)</option>
        <option value="desc">在庫が多い順</option>
        <option value="asc">在庫が少ない順</option>
      </select>

      <div className="search-box">
        <span>⌕</span>

        <input
          type="text"
          placeholder="商品名で検索"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>
    </div>
  );
}

export default ItemFilter;