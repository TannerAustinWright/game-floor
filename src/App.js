import "./App.css";
import { PhoenixSocketProvider } from "./socket/socketContext";
import BlackJack from "./blackJack/blackJack";
import CreatePlayer from "./blackJack/createPlayer";
import { useEffect, useState } from "react";
import axios from "axios";
const PLAYER_KEY = "casino-player";
const CREATE_CASINO_PLAYER = 'http://localhost:4000/player';

const GET_CASINO_PLAYER = (id) => `http://localhost:4000/player/${id}`;
const App = () => {
  const [player, setPlayer] = useState();

  const setNewPlayer = (player) => {
    localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
    setPlayer(player);
  };

  useEffect(() => {
    const playerFromStorage = JSON.parse(localStorage.getItem(PLAYER_KEY));

    if (!!playerFromStorage) {
      axios
        .get(GET_CASINO_PLAYER(playerFromStorage.id))
        .then((response) => {
          if (!!response.data.error) {
            console.log({nonExisting: response});

            axios.post(CREATE_CASINO_PLAYER, { name: playerFromStorage.name, id: playerFromStorage.id }).then((response) => {
              console.log({created: response})
              setNewPlayer(response.data);
           });
          } else {
            console.log({existing: response});
            setNewPlayer(response.data);
          }
        });
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {player?.id ? (
          <PhoenixSocketProvider playerId={player.id}>
            <BlackJack player={player}/>
          </PhoenixSocketProvider>
        ) : (
          <CreatePlayer setNewPlayer={setNewPlayer} />
        )}
      </header>
    </div>
  );
};

export default App;
