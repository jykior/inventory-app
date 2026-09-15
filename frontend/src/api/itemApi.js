export const getItems = async () => {
  const response = await fetch("http://localhost:8080/api/items", {
    credentials: "include",
  });
  return response.json();
};

export const getCategories = async () => {
  const response = await fetch("http://localhost:8080/api/categories", {
    credentials: "include",
  });
  return response.json();
};

export const createItem = async (item) => {
  const response = await fetch("http://localhost:8080/api/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("ITEM_FAILED");
    }
    throw new Error("ITEM_REQUEST_FAILED");
  }
  return response.json();
};

export const createCategory = async (category) => {
  const response = await fetch("http://localhost:8080/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(category),
  });
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("CATEGORY_FAILED");
    }
    throw new Error("CATEGORY_REQUEST_FAILED");
  }
  return response.json();
};

export const updateStock = async (item, newStock) => {
  const response = await fetch(
    `http://localhost:8080/api/items/${item.id}/stock`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        current_stock: newStock,
      }),
    },
  );

  return response.json();
};

export const deleteItem = async (id) => {
  const response = await fetch(`http://localhost:8080/api/items/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
};
