import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/items")
      .then((response) => response.json())
      .then((data) => setItems(data));
  }, []);

  return (
    <div className="app">
      <header className="header">
        <p className="logo">SALON INVENTORY</p>
        <h1>在庫管理</h1>
        <button>＋ 追加</button>
      </header>

      {items.map((item) => (
        <div className="item-card" key={item.id}>
          <h2>{item.name}</h2>
          <p className="stock">在庫：{item.current_stock}</p>
          <p>アラート数：{item.minStock}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
