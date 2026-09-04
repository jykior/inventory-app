import { useEffect, useState } from "react";
import "./App.css";
import {
  getItems,
  getCategories,
  updateStock as updateStockApi,
} from "./api/itemApi";
import Items from "./components/Items";
import ItemModal from "./components/AddItemModal";
import Sidebar from "./components/Sidebar";

const getStockStatus = (stock, alert) => {
  const difference = stock - alert;

  if (difference >= 4) {
    return { status: "正常", alertColor: "#289046" };
  }
  if (difference >= 3) {
    return {
      status: "注意",
      alertColor: "#e8942f",
      alertBackgroundColor: "#fff7ed",
      stockStatus: "注",
    };
  }
  return {
    status: "危険",
    alertColor: "#d93636",
    alertBackgroundColor: "#fff0ed",
    stockStatus: "危",
  };
};

function App() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [stockChange, setStockChange] = useState(0);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("items");

  const fetchItems = async () => {
    const data = await getItems();
    setItems(data);
  };
  useEffect(() => {
    fetchItems();
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    fetchItems();
    fetchCategories();
  }, []);

  const updateStock = async (item, newStock) => {
    const updatedItem = await updateStockApi(item, newStock);

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

  let displayItems;
  if (selectedCategory === "すべて") {
    displayItems = items;
  } else {
    displayItems = items.filter(
      (item) => item.category.name === selectedCategory,
    );
  }
  
  const alertItems = items.filter(
    (item) => item.current_stock <= item.minStock,
  );

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="content-area">
        <header className="app-header">
          <div className="header-user">
            <div className="notification">
              🔔
              <span>3</span>
            </div>

            <div className="user-avatar"></div>

            <span className="user-name">スタッフ</span>

            <span className="user-arrow">⌄</span>
          </div>
        </header>
        <div className="main-area">
          {/*ホーム画面*/}
          {currentPage === "home" && (
            <>
              <div>
                <h1>ホーム</h1>
                <p>在庫の全体状況を確認できます。</p>
              </div>
            </>
          )}

          {/* 商品一覧画面 */}
          {currentPage === "items" && (
            <>
              {alertItems.length > 0 && (
                <div className="alert-box">
                  <span>⚠️ 在庫注意</span>
                  <span>
                    <span>{alertItems.length}件の商品があります</span>
                  </span>
                </div>
              )}
              <div className="items-header">
                <h1>商品一覧</h1>
                <button
                  className="item-add-button"
                  onClick={() => setIsItemModalOpen(true)}
                >
                  ＋ 商品を追加
                </button>
              </div>
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

                <select>
                  <option value="すべて">すべての状態</option>
                  <option value="正常">正常</option>
                  <option value="注意">注意</option>
                  <option value="危険">危険</option>
                </select>

                <div className="search-box">
                  <span>⌕</span>
                  <input type="text" placeholder="商品名で検索" />
                </div>
              </div>
              {/* 商品一覧 */}
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
                  {displayItems.map((item) => (
                    <Items
                      key={item.id}
                      item={item}
                      alertColor={
                        getStockStatus(item.current_stock, item.minStock)
                          .alertColor
                      }
                      alertBackgroundColor={
                        getStockStatus(item.current_stock, item.minStock)
                          .alertBackgroundColor
                      }
                      stockStatus={
                        getStockStatus(item.current_stock, item.minStock)
                          .stockStatus
                      }
                      selectedItemId={selectedItemId}
                      setSelectedItemId={setSelectedItemId}
                      stockChange={stockChange}
                      setStockChange={setStockChange}
                      updateStock={updateStock}
                      onItemDeleted={fetchItems}
                    />
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/*在庫注意画面*/}
          {currentPage === "alerts" && (
            <>
              <div>
                <h1>在庫注意</h1>
              </div>
            </>
          )}

          {/*設定画面*/}
          {currentPage === "setting" && (
            <>
              <div>
                <h1>設定</h1>
              </div>
            </>
          )}
        </div>

        {/* 商品追加モーダル */}
        {isItemModalOpen && (
          <ItemModal
            onClose={() => setIsItemModalOpen(false)}
            onItemCreated={fetchItems}
          />
        )}
      </div>
    </div>
  );
}
export default App;
