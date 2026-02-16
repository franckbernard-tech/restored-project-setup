const BASEROW_API_URL = 'http://localhost:8000/api/v0/'; // Remplacez par l'URL de votre instance Baserow
const BASEROW_DATABASE_ID = 'YOUR_DATABASE_ID'; // Remplacez par l'ID de votre base de données
const BASEROW_TABLE_ID = 'YOUR_TABLE_ID'; // Remplacez par l'ID de votre table
const BASEROW_API_TOKEN = 'YOUR_API_TOKEN'; // Remplacez par votre token d'API

export const getArticles = async () => {
  try {
    const response = await fetch(
      `${BASEROW_API_URL}database/rows/table/${BASEROW_TABLE_ID}/?user_field_names=true`,
      {
        method: 'GET',
        headers: {
          Authorization: `Token ${BASEROW_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};
