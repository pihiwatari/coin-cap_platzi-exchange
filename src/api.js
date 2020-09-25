const url = "https://api.coincap.io/v2";

const getAssets = async () => {
  const assets = await fetch(`${url}/assets?limit=20`);
  const response = await assets.json();
  return response.data;
};

const getAsset = async (coin) => {
  const assets = await fetch(`${url}/assets/${coin}`);
  const response = await assets.json();
  return response.data;
};

const getAssetHistory = async (coin) => {
  //generamos una nueva fecha con el dia actual
  const now = new Date();
  //generamos una impresion de la hora actual
  const end = now.getTime();
  //le restamos 1 dia a la fecha actual, para obtener un rango de cambios de un dia
  now.setDate(now.getDate() - 1);
  //generamos el inicio del rango de fechas
  const start = now.getTime();
  //hacemos una peticion a la api con los cambios de precio en los ultimos 24 horas
  const fetchHistory = await fetch(
    `${url}/assets/${coin}/history?interval=h1&start=${start}&end=${end}`
  );
  const response = await fetchHistory.json();
  return response.data;
};

const getMarkets = async (coin) => {
  const fetchData = await fetch(`${url}/assets/${coin}/markets?limit=5`);
  const markets = await fetchData.json();
  return markets.data;
};

const getExchange = async (id) => {
  const fetchData = await fetch(`${url}/exchanges/${id}`);
  const exchange = await fetchData.json();
  return exchange.data;
};

export default {
  getAssets,
  getAsset,
  getAssetHistory,
  getMarkets,
  getExchange,
};
