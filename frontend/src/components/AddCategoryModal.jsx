import { useState } from "react";
import { createCategory } from "../api/itemApi";

function AddCategoryModal({ onClose,onCategoryCreated }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [colorCode, setColorCode] = useState();

  const colors = [
    "rgba(108, 195, 196, 0.5)",
    "rgba(230, 230, 14,0.5)",    ,
    "rgba(64, 0, 239, 0.5)",
    "rgba(29, 201, 34,0.5)",
    "rgba(218, 133, 212,0.5)",
    "rgba(237, 127, 18,0.5)",
  ];

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("カテゴリ名を入力してください");
      return;
    }
    try {
      await createCategory({ name: name.trim(),colorCode:colorCode });
      await onCategoryCreated();
      onClose();
    } catch (error) {
      setError("同じカテゴリ名がすでに登録されています");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="category-modal">
        <div className="category-modal-header">
          <h2>カテゴリを追加</h2>
          <button onClick={onClose}>×</button>
        </div>
        {error && <p className="form-error">{error}</p>}
        <label>
          カテゴリ名
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>カテゴリカラ―</label>

        <div className="category-color-kist">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className={`category-color ${
                colorCode === color ? "selected" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setColorCode(color)}
            />
          ))}
        </div>

        <button className="save-button" onClick={handleSubmit}>
          追加する
        </button>
      </div>
    </div>
  );
}
export default AddCategoryModal;
