import { useEffect, useState } from "react";
import "./App.css";
import {
  getItems,
  getCategories,
  updateStock as updateStockApi,
} from "./api/itemApi";
import Items from "./components/inventory/Items";
import ItemFilter from "./components/inventory/ItemFilter";
import ItemModal from "./components/inventory/AddItemModal";
import Sidebar from "./components/common/Sidebar";
import Login from "./components/auth/Login";
import Admin from "./components/admin/Admin";

const getStockStatus = (stock, alert) => {
  if (stock >= alert + 3) {
    return { status: "正常", alertColor: "#289046" };
  }
  if (stock > alert) {
    return {
      status: "少ない",
      alertColor: "#e8942f",
      alertBackgroundColor: "#fff7ed",
      stockStatus: "少",
    };
  }
  return {
    status: "注意",
    alertColor: "#d93636",
    alertBackgroundColor: "#fff0ed",
    stockStatus: "注意",
  };
};

function App() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [selectedStatus, setSelectedStatus] = useState("すべて");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [stockChange, setStockChange] = useState(0);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("items");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const fetchItems = async () => {
    const data = await getItems();
    setItems(data);
  };
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    const savedUser = sessionStorage.getItem("user");

    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUser(user);
      setIsLoggedIn(true);

      fetchItems();
      fetchCategories();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".header-user")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
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

  let displayItems = [...items];

  // カテゴリ絞り込み
  if (selectedCategory !== "すべて") {
    displayItems = displayItems.filter(
      (item) => item.category?.name === selectedCategory,
    );
  }

  // 商品名検索
  if (searchKeyword.trim() !== "") {
    displayItems = displayItems.filter((item) =>
      item.name.toLowerCase().includes(searchKeyword.toLowerCase()),
    );
  }

  // 状態絞り込み
  if (selectedStatus !== "すべて") {
    displayItems = displayItems.filter((item) => {
      const status = getStockStatus(item.current_stock, item.minStock);
      return status.status === selectedStatus;
    });
  }

  // 在庫数並び替え
  if (sortOrder === "desc") {
    displayItems.sort((a, b) => b.current_stock - a.current_stock);
  }
  if (sortOrder === "asc") {
    displayItems.sort((a, b) => a.current_stock - b.current_stock);
  }

  const alertItems = items.filter(
    (item) => item.current_stock <= item.minStock,
  );

  const handleLogin = (user) => {
    setUser(user);
    setIsLoggedIn(true);
    sessionStorage.setItem("user", JSON.stringify(user));
  };
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="app">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
      />

      <div className="content-area">
        <header className="app-header">
          <div className="header-user">
            <div className="user-avatar">👤</div>

            <span className="user-name">{user?.nickName}</span>

            <button
              className="user-arrow"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              ⌄
            </button>
            {showUserMenu && (
              <div className="user-menu">
                <button onClick={handleLogout}>ログアウト</button>
              </div>
            )}
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
              <ItemFilter
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
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

          {/*ユーザー管理*/}
          {currentPage === "admin" && <Admin />}
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
