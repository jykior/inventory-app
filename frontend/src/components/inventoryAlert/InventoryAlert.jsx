import "./InventoryAlert.css";

function InventoryAlert({ alertItems, fewItems, getStockStatus }) {
  const allAlertItems = [...alertItems, ...fewItems];

  return (
    <div className="inventory-alert-page">
      <h1>在庫注意</h1>

      <div className="alert-summary">
        <div className="alert-summary-card">
          <div>
            <span>●</span>
            <span>少ない</span>
          </div>
          <span className="alert-summary-number">{fewItems.length}</span>
          <span>件</span>
        </div>

        <div className="alert-summary-card">
          <div>
            <span>●</span>
            <span>注意</span>
          </div>
          <span className="alert-summary-number">{alertItems.length}</span>
          <span>件</span>
        </div>

        <div className="alert-summary-card">
          <div>
            <span>合計</span>
          </div>
          <span className="alert-summary-number">
            {fewItems.length + alertItems.length}
          </span>
          <span>件</span>
        </div>
      </div>

      <div className="inventory-alert-list">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>商品名</th>
              <th>カテゴリー</th>
              <th>現在の在庫</th>
              <th>アラート数</th>
              <th>状態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {allAlertItems.map((item) => {
              const status = getStockStatus(item.current_stock, item.minStock);

              return (
                <tr
                  key={item.id}
                  style={{ backgroundColor: status.alertBackgroundColor }}
                >
                  <td>
                    <span
                      className="status-dot"
                      style={{ color: item.category?.colorCode }}
                    >
                      ◆
                    </span>
                  </td>
                  <td>{item.name}</td>

                  <td>
                    <span style={{ backgroundColor: item.category?.colorCode }}>
                      {item.category.name}
                    </span>
                  </td>

                  <td>
                    <div>{item.current_stock}</div> <span>個</span>
                  </td>

                  <td>
                    <div>{item.minStock}</div> <span>個</span>
                  </td>

                  <td style={{ color: status.alertColor }}>
                    ● {status.stockStatus}
                  </td>
                  <td>
                    <div className="alert-actions">
                      <button>✎</button>
                      <button>🗑</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryAlert;
