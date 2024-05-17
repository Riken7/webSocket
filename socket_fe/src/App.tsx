import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import './App.css'

function App() {
  const [socket, setSocket ] = useState<null | WebSocket>(null);
  const [message, setMessage] = useState<String[]>([]);
  const [sendMsg, setSendMsg] = useState('');
  const [connected, setConnected] = useState(true);
  const dryrun = useCallback(() => {
    const newSocket = new WebSocket('ws://localhost:8080');
    newSocket.onopen = () => {
      console.log('connected');
      setSocket(newSocket);
    }
    newSocket.onmessage = (msg) =>{
      console.log(msg.data);
      setMessage(m => [...m,msg.data]);
    }
  }, []);

  useMemo(() => {
    dryrun();
  }, []);

  if(socket==null){
    return <div>Connecting...</div>
  }
  
  return (
    
    <>
    <input value={sendMsg} onChange={(e) => setSendMsg(e.target.value)}></input>
    <button onClick={()=>{
      socket.send(sendMsg);
      if(sendMsg === 'exit'){
        setMessage([]);
        socket.close();
        setConnected(false);
      }
      else if(sendMsg === 'connect'){
        setConnected(true);
        dryrun();
      }
      setSendMsg('');
    }}>Send</button>
    <button onClick={()=>{
      setMessage([]);
    }}>clear</button>
      {!connected && <div>Disconnected</div>}
      
      { connected &&
        message.map((msg,index)=>{
        return <div key={index}>{msg}</div>
        })
      }

    </>
    
  )
}

export default App

