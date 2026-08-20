import { useEffect, useState } from "react";
import { createItem, getCategories } from "../api/itemApi";

function AddItemModal({ onClose,onItemCreated }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentStock, setCurrentStock] = useState(0);
  const [minStock, setMinStock] = useState(0);
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError();

    if (!category) {
      setError("カテゴリを選択してください");
      return;
    }
    try {
      const item = {
        name,
        category: { id: Number(category) },
        current_stock: currentStock,
        minStock,
        alertEnabled,
      };

      await createItem(item);
      await onItemCreated();
      onClose();
    } catch (error) {
      setError("同じ商品名がすでに登録されています");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>商品を追加</h2>

          <button onClick={onClose}>×</button>
        </div>
        {error && <p className="form-error">{error}</p>}
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
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
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
