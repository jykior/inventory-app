import { deleteItem } from "../api/itemApi";

function Items({
  item,
  alertColor,
  alertBackgroundColor,
  stockStatus,
  selectedItemId,
  setSelectedItemId,
  stockChange,
  setStockChange,
  updateStock,
  onItemDeleted,
}) {
  return (
    <tr
      className="item"
      key={item.id}
      style={{ backgroundColor: alertBackgroundColor }}
      onClick={() => {
        setSelectedItemId(item.id);
        setStockChange(0);
      }}
    >
      <td>
        <span
          className="category-color"
          style={{ color: item.category?.colorCode }}
        >
          ◆
        </span>
      </td>
      <td>
        <span className="item-name">{item.name}</span>
      </td>

      <td>
        <span className="item-category">{item.category?.name}</span>
      </td>

      <td>
        <div className="item-stock">
          {selectedItemId === item.id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setStockChange((prev) => prev - 1);
              }}
              disabled={item.current_stock === 0}
            >
              −
            </button>
          )}
          <span className="stock-number">
            {selectedItemId === item.id && stockChange !== 0 && (
              <small className="stock-change">
                {stockChange > 0 ? "+" : ""}
                {stockChange}
              </small>
            )}
            <strong>{item.current_stock}</strong>
          </span>
          {selectedItemId === item.id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setStockChange((prev) => prev + 1);
              }}
            >
              ＋
            </button>
          )}
          {selectedItemId === item.id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const change = stockChange;
                if (change !== 0) {
                  updateStock(item, item.current_stock + change);
                }
                setStockChange(0);
                setSelectedItemId(null);
              }}
            >
              決定
            </button>
          )}
        </div>
        <span>本</span>
      </td>

      <td>
        <span className="item-status" style={{ color: alertColor }}>
          ● {stockStatus}
        </span>
      </td>

      <td>
        {selectedItemId === item.id && (
          <button
            onClick={async (e) => {
              e.stopPropagation();
              await deleteItem(item.id);
              await onItemDeleted();
            }}
          >
            削除
          </button>
        )}
      </td>
    </tr>
  );
}
export default Items;
