import { useState } from "react";
import { createCategory } from "../api/itemApi";

function AddCategoryModal({ onClose }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if(!name.trim()){
      setError("カテゴリ名を入力してください");
      return;
    }
    try {
      await createCategory({ name: name.trim() });
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

        <button className="save-button" onClick={handleSubmit}>
          追加する
        </button>
      </div>
    </div>
  );
}
export default AddCategoryModal;
