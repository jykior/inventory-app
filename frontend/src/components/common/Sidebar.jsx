import "./Common.css";

function Sidebar({ currentPage, setCurrentPage, user }) {
  return (
    <aside className="sidebar">
      <h1>INVENTORY MANAGER</h1>
      <img src="/logo.png" alt="Inventory Manager" className="logo" />

      <nav>
        <button
          className={currentPage === "home" ? "active" : ""}
          onClick={() => setCurrentPage("home")}
        >
          ⌂ ホーム
        </button>
        <button
          className={currentPage === "items" ? "active" : ""}
          onClick={() => setCurrentPage("items")}
        >
          ▣ 商品一覧
        </button>
        <button
          className={currentPage === "alerts" ? "active" : ""}
          onClick={() => setCurrentPage("alerts")}
        >
          ⚠ 在庫注意
        </button>
        <button
          className={currentPage === "setting" ? "active" : ""}
          onClick={() => setCurrentPage("setting")}
        >
          ⚙ 設定
        </button>
        {user?.role === "ADMIN" && (
          <button
            className={currentPage === "users" ? "active" : ""}
            onClick={() => setCurrentPage("admin")}
          >
            ♙ ユーザー管理
          </button>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
