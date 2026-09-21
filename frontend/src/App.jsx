import { useEffect, useState } from "react";
import "./App.css";
import {
  getItems,
  getCategories,
  updateStock as updateStockApi,
} from "./api/itemApi";
import { guestLogout } from "./api/authApi";
import { getStockStatus } from "./utils/stockStatus";
import Items from "./components/inventory/Items";
import ItemFilter from "./components/inventory/ItemFilter";
import ItemModal from "./components/inventory/AddItemModal";
import Sidebar from "./components/common/Sidebar";
import Login from "./components/auth/Login";
import Admin from "./components/admin/Admin";
import Home from "./components/home/Home";
import InventoryAlert from "./components/inventoryAlert/InventoryAlert";
import Setting from "./components/setting/Setting";

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

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
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
  /**
   * ログイン成功時の処理を行う。
   *
   * ユーザー情報をstateとsessionStorageに保存し、
   * ログイン後に商品・カテゴリ一覧を取得する。
   */
  const handleLogin = async (user) => {
    setUser(user);
    setIsLoggedIn(true);
    sessionStorage.setItem("user", JSON.stringify(user));

    await fetchItems();
    await fetchCategories();
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }
  /**
   * ログアウト処理を行う。
   *
   * sessionStorageからユーザー情報を削除し、
   * ログイン状態をリセットする。
   */
  const handleLogout = async () => {
    if (user?.role === "GUEST") {
      await guestLogout();
    }

    sessionStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
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

  const normalItems = items.filter(
    (item) =>
      getStockStatus(item.current_stock, item.minStock).status === "正常",
  );

  const fewItems = items.filter(
    (item) =>
      getStockStatus(item.current_stock, item.minStock).status === "少ない",
  );

  const alertItems = items.filter(
    (item) =>
      getStockStatus(item.current_stock, item.minStock).status === "注意",
  );
  /**
   * 商品の在庫数を更新する。
   *
   * 在庫数を更新した後、
   * 更新された商品だけをitemsのstateに反映する。
   */
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
          {/*HOME画面*/}
          {currentPage === "home" && (
            <Home
              items={items}
              normalItems={normalItems}
              fewItems={fewItems}
              alertItems={alertItems}
              getStockStatus={getStockStatus}
              setCurrentPage={setCurrentPage}
            />
          )}

          {/* 商品一覧画面 */}
          {currentPage === "items" && (
            <>
              {/* 在庫注意簡易表示 */}
              {alertItems.length > 0 && (
                <div className="alert-box">
                  <span>⚠️ 在庫注意</span>
                  <span>
                    <span>{alertItems.length}件の商品があります</span>
                  </span>
                </div>
              )}

              {/* 商品一覧 */}
              <Items
                displayItems={displayItems}
                selectedItemId={selectedItemId}
                setSelectedItemId={setSelectedItemId}
                stockChange={stockChange}
                setStockChange={setStockChange}
                updateStock={updateStock}
                onItemDeleted={fetchItems}
                getStockStatus={getStockStatus}
                setIsItemModalOpen={setIsItemModalOpen}
                itemFilter={
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
                }
              />
            </>
          )}
          {/*在庫注意画面*/}
          {currentPage === "inventoryAlert" && (
            <InventoryAlert
              alertItems={alertItems}
              fewItems={fewItems}
              getStockStatus={getStockStatus}
            />
          )}

          {currentPage === "setting" && <Setting />}

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
