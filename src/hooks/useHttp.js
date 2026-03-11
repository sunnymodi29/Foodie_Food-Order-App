import { useCallback, useEffect, useState } from "react";

async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  let resData;

  try {
    resData = await response.json();
  } catch (err) {
    const text = await response.text();
    console.error("Non-JSON response:", text);
    throw new Error("Server returned non JSON response");
  }

  if (!response.ok) {
    throw new Error(
      resData.message || "Something went wrong, failed to send request."
    );
  }

  return resData;
}

export default function useHttp(url, config, initialData) {
  const [data, setData] = useState(initialData);
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState();

  function clearData() {
    setData(initialData);
  }

  const sendRequest = useCallback(
    async function sendRequest(data, secondUrl) {
      const urllink = secondUrl ? secondUrl : url;
      if (!urllink) return;
      setisLoading(true);
      try {
        const resData = await sendHttpRequest(urllink, {
          ...config,
          body: data,
        });
        setData(resData);
        setisLoading(false);
        return resData;
      } catch (error) {
        setError(error.message || "Something went wrong!");
        setisLoading(false);
        throw error;
      }
    },
    [url, config],
  );

  useEffect(() => {
    if (!config || config.method === "GET") {
      sendRequest();
    }
  }, [sendRequest, config]);

  return {
    data,
    isLoading,
    error,
    sendRequest,
    clearData,
  };
}
