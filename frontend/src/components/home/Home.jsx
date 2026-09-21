import "./Home.css";

function Home({
  items,
  normalItems,
  fewItems,
  alertItems,
  getStockStatus,
  setCurrentPage,
}) {
  return (
    <>
      <div>
        <h1>ホーム</h1>

        <div className="home-summary">
          <div className="summary-card">
            <div className="icon" style={{ color: " #b08d57" }}>
              ▣
            </div>
            <div className="summary-text">
              <p style={{ color: " #b08d57" }}>全商品数</p>
              <div className="summary-number">
                <h2>{items.length}</h2>
                <span>商品</span>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="icon" style={{ color: "#289046" }}>
              ✓
            </div>
            <div className="summary-text">
              <p style={{ color: "#289046" }}>正常</p>
              <div className="summary-number">
                <h2>{normalItems.length}</h2>
                <span>商品</span>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="icon" style={{ color: "#e8942f" }}>
              !
            </div>
            <div className="summary-text">
              <p style={{ color: "#e8942f" }}>少ない</p>
              <div className="summary-number">
                <h2>{fewItems.length}</h2>
                <span>商品</span>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="icon" style={{ color: "#d93636" }}>
              ⚠
            </div>
            <div className="summary-text">
              <p style={{ color: "#d93636" }}>注意</p>
              <div className="summary-number">
                <h2>{alertItems.length}</h2>
                <span>商品</span>
              </div>
            </div>
          </div>
        </div>
        <div className="home-stock-sections">
          <div className="home-alert">
            <h2>在庫注意の商品</h2>

            {alertItems.slice(0, 3).map((item) => (
              <div key={item.id} className="alert-item">
                <span
                  style={{
                    color: getStockStatus(item.current_stock, item.minStock)
                      .alertColor,
                  }}
                >
                  ●
                </span>
                <span>{item.name}</span>
                <span>{item.category.name}</span>
                <span>{item.current_stock}個</span>
                <span
                  style={{
                    color: getStockStatus(item.current_stock, item.minStock)
                      .alertColor,
                  }}
                >
                  {getStockStatus(item.current_stock, item.minStock).status}
                </span>
              </div>
            ))}
            <button
              className="alert-list-button"
              onClick={() => setCurrentPage("inventoryAlert")}
            >
              一覧を見る
            </button>
          </div>
          <div className="home-few">
            <h2>在庫が少ない商品</h2>

            {fewItems.slice(0, 3).map((item) => (
              <div key={item.id} className="few-item">
                <span
                  style={{
                    color: getStockStatus(item.current_stock, item.minStock)
                      .alertColor,
                  }}
                >
                  ●
                </span>
                <span>{item.name}</span>
                <span>{item.category.name}</span>
                <span>{item.current_stock}個</span>
                <span
                  style={{
                    color: getStockStatus(item.current_stock, item.minStock)
                      .alertColor,
                  }}
                >
                  {getStockStatus(item.current_stock, item.minStock).status}
                </span>
              </div>
            ))}
            <button
              className="few-list-button"
              onClick={() => setCurrentPage("inventoryAlert")}
            >
              一覧を見る
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
