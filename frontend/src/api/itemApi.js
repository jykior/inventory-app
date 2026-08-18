export const getItems = async () => {
  const response = await fetch("http://localhost:8080/api/items");

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

  return response.json();
};