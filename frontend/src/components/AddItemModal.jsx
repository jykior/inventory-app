import { useState } from "react";
import { createItem } from "../api/itemApi";

function AddItemModal({ onClose }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState([]);
  const [currentStock, setCurrentStock] = useState(0);
  const [minStock, setMinStock] = useState(0);
  const [alertEnabled, setAlertEnabled] = useState(true);

  const handleSubmit = async () => {
    const item = {
      name,
      category,
      current_stock: currentStock,
      minStock,
      alertEnabled,
    };

    await createItem(item);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>商品を追加</h2>

          <button onClick={onClose}>×</button>
        </div>

        <label>
          商品名
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          カテゴリ
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">選択してください</option>
            <option value="カラー剤">カラー剤</option>
            <option value="パーマ剤">パーマ剤</option>
          </select>
        </label>

        <label>
          現在の在庫数
          <input
            type="number"
            value={currentStock}
            onChange={(e) => setCurrentStock(Number(e.target.value))}
          />
        </label>

        <label className="alert-setting">
          <input
            type="checkbox"
            checked={alertEnabled}
            onChange={(e) => setAlertEnabled(e.target.checked)}
          />
          アラートを設定する
        </label>

        <label>
          アラート数
          <input
            type="number"
            value={minStock}
            onChange={(e) => setMinStock(Number(e.target.value))}
          />
        </label>

        <button className="save-button" onClick={handleSubmit}>
          保存する
        </button>
      </div>
    </div>
  );
}

export default AddItemModal;
