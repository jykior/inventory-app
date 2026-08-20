function ItemCard({
  item,
  percentage,
  color,
  backgroundColor,
  selectedItemId,
  setSelectedItemId,
  stockChanges,
  setStockChanges,
  updateStock,
}) {
  return (
    <div
      className="item-card"
      key={item.id}
      style={{ backgroundColor: backgroundColor }}
      onClick={() => setSelectedItemId(item.id)}
    >
      <div className="stock-status" style={{ backgroundColor: color }}></div>

      <div className="item-info">
        <div className="item-name">
          <h2>{item.name}</h2>
        </div>
        <div>
          <span className="item-category">{item.category?.name}</span>
          <span className="item-alert">アラート数 {item.minStock}本</span>
        </div>
      </div>

      <div className="item-stock">
        {selectedItemId === item.id && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setStockChanges((prev) => ({
                ...prev,
                [item.id]: (prev[item.id] || 0) - 1,
              }));
            }}
            disabled={item.current_stock === 0}
          >
            −
          </button>
        )}
        <div className="stock-number">
          {stockChanges[item.id] !== undefined &&
            stockChanges[item.id] !== 0 && (
              <span className="stock-change">
                {stockChanges[item.id] > 0 ? "+" : ""}
                {stockChanges[item.id]}
              </span>
            )}
          <strong>{item.current_stock}</strong>
        </div>
        {selectedItemId === item.id && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setStockChanges((prev) => ({
                ...prev,
                [item.id]: (prev[item.id] || 0) + 1,
              }));
            }}
          >
            ＋
          </button>
        )}
        <span>本</span>
        {selectedItemId === item.id && (
          <button
            onClick={(e) => {
              e.stopPropagation();

              const change = stockChanges[item.id] || 0;

              if (change !== 0) {
                updateStock(item, item.current_stock + change);
              }

              setStockChanges((prev) => ({
                ...prev,
                [item.id]: 0,
              }));

              setSelectedItemId(null);
            }}
          >
            決定
          </button>
        )}
        <div className="stock-meter">
          <div
            className="stock-meter-fill"
            style={{
              height: `${percentage}%`,
              backgroundColor: color,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
export default ItemCard;
