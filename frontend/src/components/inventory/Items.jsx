import { useState } from "react";
import { deleteItem } from "../../api/itemApi";
import { Package } from "lucide-react";
import "./Inventory.css";
/**
 * 商品一覧を表示する。
 *
 * 在庫数の変更や商品の削除も行う。
 */
function Items({
  displayItems,
  selectedItemId,
  setSelectedItemId,
  stockChange,
  setStockChange,
  updateStock,
  onItemDeleted,
  getStockStatus,
  setIsItemModalOpen,
  itemFilter,
}) {
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);

  const handleDeleteItem = async () => {
    await deleteItem(selectedItemId);
    await onItemDeleted();

    setSelectedItemId(null);
    setIsDeleteItemModalOpen(false);
  };

  return (
    <>
      <div className="items-header">
        <h1 className="page-title">
          <Package size={32} />
          商品一覧
        </h1>
        <button
          className="item-add-button"
          onClick={() => setIsItemModalOpen(true)}
        >
          ＋ 商品を追加
        </button>
      </div>

      {itemFilter}

      <table className="item-table">
        <thead>
          <tr>
            <th></th>
            <th>商品名</th>
            <th>カテゴリ</th>
            <th>現在の在庫</th>
            <th>状態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {displayItems.map((item) => {
            const status = getStockStatus(item.current_stock, item.minStock);

            return (
              <tr
                className="item"
                key={item.id}
                style={{ backgroundColor: status.alertBackgroundColor }}
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
                  <span
                    className="item-category"
                    style={{ backgroundColor: item.category?.colorCode }}
                  >
                    {item.category?.name}
                  </span>
                </td>

                <td>
                  <div className="item-stock">
                    {selectedItemId === item.id && (
                      <button
                        className="stock-control"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStockChange((prev) =>
                            Math.max(prev - 1, -item.current_stock),
                          );
                        }}
                        disabled={item.current_stock === 0}
                      >
                        −
                      </button>
                    )}
                    <span className="stock-number">
                      {selectedItemId === item.id && stockChange !== 0 && (
                        <span className="stock-change">
                          {stockChange > 0 ? "+" : ""}
                          {stockChange}
                        </span>
                      )}
                      <span>{item.current_stock}</span>
                    </span>
                    {selectedItemId === item.id && (
                      <button
                        className="stock-control"
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
                        className="stock-decision"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (stockChange !== 0) {
                            updateStock(item, item.current_stock + stockChange);
                          }
                          setStockChange(0);
                          setSelectedItemId(null);
                        }}
                      >
                        ✓
                      </button>
                    )}
                  </div>
                  <span>個</span>
                </td>

                <td>
                  <span
                    className="item-status"
                    style={{ color: status.alertColor }}
                  >
                    ● {status.stockStatus}
                  </span>
                </td>

                <td>
                  {selectedItemId === item.id && (
                    <button
                      className="item-delete"
                      onClick={async (e) => {
                        e.stopPropagation();
                        setSelectedItemId(item.id);
                        setIsDeleteItemModalOpen(true);
                      }}
                    >
                      🗑
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {isDeleteItemModalOpen && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>この商品を削除しますか？</h3>

            <div className="delete-modal-buttons">
              <button onClick={() => setIsDeleteItemModalOpen(false)}>
                キャンセル
              </button>

              <button
                className="delete-confirm-button"
                onClick={handleDeleteItem}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Items;
