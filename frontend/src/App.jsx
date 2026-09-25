import { useEffect, useState } from "react";
import "./App.css";
import {
  getItems,
  getCategories,
  updateStock as updateStockApi,
} from "./api/itemApi";
import { getStockStatus } from "./utils/stockStatus";
import { guestLogout } from "./api/authApi";
import { User, OctagonAlert } from "lucide-react";
import Items from "./components/inventory/Items";
import ItemFilter from "./components/inventory/ItemFilter";
import ItemModal from "./components/inventory/AddItemModal";
import Sidebar from "./components/common/Sidebar";
import Login from "./components/auth/Login";
import Admin from "./components/admin/Admin";
import Home from "./components/home/Home";
import Setting from "./components/setting/Setting";

function App() {
  const [items, setItems] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState("setting");
  const [initialStatus, setInitialStatus] = useState("すべて");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [stockChange, setStockChange] = useState(0);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const fetchItems = async () => {
    const data = await getItems();
    setItems(data);
    setDisplayItems(data);
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

  const handleUserUpdated = (updatedUser) => {
    setUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const handleAccountDeleted = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

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
            <div className="user-avatar">
              <User size={24} />
            </div>
            <span className="user-name">{user?.nickName}</span>
            <button className="logout-button" onClick={handleLogout}>
              ログアウト
            </button>
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
              setInitialStatus={setInitialStatus}
            />
          )}

          {/* 商品一覧画面 */}
          {currentPage === "items" && (
            <>
              {/* 在庫注意簡易表示 */}
              {alertItems.length > 0 && (
                <div className="alert-box">
                  <span className="alert-box-icon">
                    <OctagonAlert size={20} /> 在庫注意
                  </span>
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
                    items={items}
                    setDisplayItems={setDisplayItems}
                    categories={categories}
                    initialStatus={initialStatus}
                  />
                }
              />
            </>
          )}

          {currentPage === "setting" && (
            <Setting
              user={user}
              onUserUpdated={handleUserUpdated}
              onAccountDeleted={handleAccountDeleted}
            />
          )}

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
