import React, { useEffect, useState } from "react";

function ApiTest() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5002/api/health")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("Error connecting to backend:", err));
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Backend Connection Test</h2>
      <p>{message ? message : "Connecting to backend..."}</p>
    </div>
  );
}

export default ApiTest;