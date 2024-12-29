import React, { useEffect, useRef, useState } from "react";
// import { Peer } from "https://esm.sh/peerjs@1.5.4?bundle-deps";
import Peer from "peerjs";
function App() {
  const [myId, setMyId] = useState("");
  const [destId, setDestId] = useState("");
  const isInitiater = useRef(false);
  const [msgs, setMsgs] = useState([]);
  const [msg, setMsg] = useState("");
  const peerRef = useRef(null);
  const conn = useRef(null);
  useEffect(() => {
    peerRef.current = new Peer();
    peerRef.current.on("open", function (id) {
      setMyId(id);
    });
    peerRef.current.on("connection", function (receivedConnection) {
      alert("incoming request");
      if (!isInitiater.current) {
        conn.current = receivedConnection;
        receivedConnection.on("data", function (data) {
          setMsgs((p) => [...p, data]);
        });
      }
    });
  }, []);

  const connectHandler = () => {
    console.log("inside connect handler");
    isInitiater.current = true;
    const initiaterConnection = peerRef.current.connect(destId);
    conn.current = initiaterConnection;
    initiaterConnection.on("data", function (data) {
      setMsgs((p) => [...p, data]);
    });
  };

  const handleSendMessage = () => {
    setMsgs((p) => [...p, msg]);
    setMsg("");
    conn.current.send(msg);
  };

  return (
    <>
      <label htmlFor="myId">myId</label>
      <input id="myId" type="text" value={myId} />
      <label htmlFor="destId"> Destination Id</label>
      <input
        id="destId"
        type="text"
        value={destId}
        onChange={(e) => setDestId(e.target.value)}
      />
      <button onClick={connectHandler}>Connect</button>
      <label htmlFor="msg"> type your message here</label>
      <input
        id="msg"
        type="text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <button onClick={handleSendMessage}>send</button>
      {msgs.map((ele) => {
        return (
          <div style={{ border: "2px solid red", height: "50px" }}>{ele}</div>
        );
      })}
    </>
  );
}

export default App;

