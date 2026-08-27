export const getItems = async () => {
  const response = await fetch("http://localhost:8080/api/items");

  return response.json();
};

export const getCategories = async () => {
  const response = await fetch("http://localhost:8080/api/categories");
  return response.json();
};

export const createItem = async (item) => {
  const response = await fetch("http://localhost:8080/api/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error();
  }
  return response.json();
};

export const createCategory = async (category) => {
  const response = await fetch("http://localhost:8080/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
    if (!response.ok) {
    throw new Error();
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
  });
};
