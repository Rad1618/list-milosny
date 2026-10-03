import { useState, useEffect, useRef } from 'react';
import sha256 from 'crypto-js/sha256';
import EntrancePage from './pages/Entrance';
import Members from './components/Members';
import Lobby from './pages/Lobby';
import GamePage from './pages/GamePage';
import './App.css';

let drone = null;

function App() {
  const [roomN, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState({
    mode: {"value": "base", "label": "Podstawa (16)"},
  });

  const [me, setMe] = useState(
    {
      color: "red",
      username: "noname",
      dev: false,
    }
  );

  const [members, setMembers] = useState([]);
  const [gameState, setGameState] = useState(null);

  const messagesRef = useRef();
  messagesRef.current = messages;
  const membersRef = useRef();
  membersRef.current = members;
  const meRef = useRef();
  meRef.current = me;
  const gameRef = useRef();
  gameRef.current = gameState;
  const optionsRef = useRef();
  optionsRef.current = options;

  function connectToScaledrone() {
    meRef.current.color = "green";
    
    drone = new window.Scaledrone('NU4fIyGsR6c0O6wp', {
      data: meRef.current,
    });
    drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      meRef.current.id = drone.clientId;
      setMe(meRef.current);
    });
    const room = drone.subscribe('observable-room-' + roomN);

    room.on('message', message => {
      if (!message?.data)
        return;
      const data = message.data;
      if (!data?.type || !data?.data)
        return;
      if (data.type === "message")
      {
        const m = {...message, data: data.data}
        setMessages([...messagesRef.current, m]);
      }
      else if (data.type === "game")
      {
        if (data.data === "Reset")
          setGameState(null);
        if ((data.data?.version ?? -1) <= (gameRef.current?.version ?? -2))
          return;
        // if (me.dev)
          console.log(data.data);
        setGameState(data.data ?? {});
      }
      else if (data.type === "members")
      {
        setMembers(data.data);
      }
      else if (data.type === "options")
      {
        // if (me?.dev)
          console.log(data.data);
        setOptions(data.data);
      }
    });
    room.on('members', members => {
      setMembers(members);
    });
    room.on('member_join', member => {
      setMembers([...membersRef.current, member]);
      const message = {type: "options", data: optionsRef.current};
        drone.publish({
          room: "observable-room-" + roomN,
          message
        });
      if (gameRef.current != null)
      {
        const message = {type: "game", data: gameRef.current};
        drone.publish({
          room: "observable-room-" + roomN,
          message
        });
      }
    });
    room.on('member_leave', ({id}) => {
      const index = membersRef.current.findIndex(m => m.id === id);
      const newMembers = [...membersRef.current];
      newMembers.splice(index, 1);
      setMembers(newMembers);
      if (!!gameRef.current)  // game is on
      {
        const seats = gameRef.current.seats;
        const events = gameRef.current?.events ?? [];
        for (let i = 0; i < seats.length; i++)
        {
          if (seats[i].id === id)
          {
            seats[i].removed = true;
            events.push({text: seats[i].username + " opuszcza grę.", visibility: "all"});
            return;
          }
        }
        onGameStateChange({...gameRef.current, seats: seats, events: events});
      }
    });
  }

  useEffect(() => {
    if (roomN == null)
      return;
    if (drone === null) {
      connectToScaledrone();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomN]);

  function setNames(roomName, userName)
  {
    if (roomName === "" || userName === "")
      return;
    setRoom(roomName);
    setMe({...me, username: userName});
  }

  function onGameStateChange(newGameState)
  {
    if (drone === null)
      return;
    if (newGameState)
      newGameState.version += 1;
    const message = {type: "game", data: newGameState};
    drone.publish({
      room: "observable-room-" + roomN,
      message
    });
  }

  function onOptionsChange(newOptions)
  {
    if (drone === null || gameState !== null)
      return;
    const message = {type: "options", data: newOptions};
    drone.publish({
      room: "observable-room-" + roomN,
      message
    });
  }

  function switchdev()
  {
    setMe({...me, dev: !me?.dev});
    const newMembers = members.map(m => m.id === me.id ? {...m, dev: !(m?.dev)} : m);
    const message = {type: "members", data: newMembers};
    drone.publish({
      room: "observable-room-" + roomN,
      message
    });
  }

  return (
    <div className="App">
      <header>
        <title>List Miłosny</title>
        <meta name='description' content='List Miłosny' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </header>
      <main className="appMain">
        <div className="appContent">
          {roomN ? <>
          <Members members={members} me={me} room={roomN}/>
          {
            gameState ?
            <GamePage gameState={gameState} setGameState={onGameStateChange} options={options} setOptions={onOptionsChange} members={members} me={me}/>
            :
            <Lobby gameState={gameState} setGameState={onGameStateChange} members={members} options={options} setOptions={onOptionsChange}/>
          }
          </> : 
          <EntrancePage setRoom={setNames}/>
          }
        </div>
      </main>
    </div>
  );
}

export default App;
