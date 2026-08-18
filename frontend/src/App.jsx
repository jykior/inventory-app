import { useEffect, useState } from "react";
import "./App.css";
import ItemCard from "./components/ItemCard";
import { getItems } from "./api/itemApi";
import ItemModal from "./components/AddItemModal";

const getStockPercentage = (stock, alert) => {
  const difference = stock - alert;

  if (difference >= 6) {
    return { percentage: 100, color: "#c9a45c" };
  }
  if (difference >= 5) {
    return { percentage: 80, color: "#c9a45c" };
  }
  if (difference >= 4) {
    return { percentage: 60, color: "#c9a45c" };
  }
  if (difference >= 3) {
    return { percentage: 40, color: "#e8942f", backgroundColor: "#fff7ed" };
  }
  if (difference >= 1) {
    return { percentage: 20, color: "#d93636", backgroundColor: "#fff0ed" };
  }
  return { percentage: 0, color: "#d93636", backgroundColor: "#fff0ed" };
};

function App() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [stockChanges, setStockChanges] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getItems();
      setItems(data);
    };

    fetchItems();
  }, []);

  const updateStock = async (item, newStock) => {
    const response = await fetch(
      `http://localhost:8080/api/items/${item.id}/stock`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_stock: newStock,
        }),
      },
    );

    const updatedItem = await response.json();

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === updatedItem.id) {
          return updatedItem;
        } else {
          return item;
        }
      }),
    );
  };
  let filteredItems;
  if (selectedCategory === "すべて") {
    filteredItems = items;
  } else {
    filteredItems = items.filter(
      (item) => item.category.name === selectedCategory,
    );
  }
  const alertItems = items.filter(
    (item) => item.current_stock <= item.minStock,
  );

  return (
    <div className="app">
      <header className="header">
        <p className="logo">INVENTORY MANAGER</p>
        <h1>在庫管理</h1>
        <button onClick={() => setIsModalOpen(true)}>＋ 追加</button>
      </header>

      {alertItems.length > 0 && (
        <div className="alert-box">
          <span>⚠️ 在庫注意アイテム</span>
          {alertItems.length > 0 && (
            <span>
              {alertItems[0].name}・残{alertItems[0].current_stock}本
            </span>
          )}
        </div>
      )}

      <div className="category-buttons">
        <button onClick={() => setSelectedCategory("すべて")}>すべて</button>

        <button onClick={() => setSelectedCategory("カラー剤")}>
          カラー剤
        </button>

        <button onClick={() => setSelectedCategory("コスメ")}>コスメ</button>
      </div>
      {/* 商品一覧 */}
      {filteredItems.map((item) => {
        const { percentage, color, backgroundColor } = getStockPercentage(
          item.current_stock,
          item.minStock,
        );
        return (
          <ItemCard
            key={item.id}
            item={item}
            percentage={percentage}
            color={color}
            backgroundColor={backgroundColor}
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
            stockChanges={stockChanges}
            setStockChanges={setStockChanges}
            updateStock={updateStock}
          />
        );
      })}
      {/* 商品追加モーダル */}
      {isModalOpen && <ItemModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
export default App;
