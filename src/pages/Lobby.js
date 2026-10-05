import { useMemo } from 'react';
import Select from 'react-select';
import GameCard from '../components/Card'
import { CARDS, SETS } from '../data/cardsData';
import '../styles/lobby.css'

const PLACEHOLDERS = 0;

export default function Lobby({gameState, setGameState, members, options, setOptions})
{
  const players = useMemo(() => members.filter(m => !m.dev).length, [members]);

  function createGame()
  {
    if (!SETS?.[options.mode.value])
      return;
    let unshufledDeck = [];
    Object.keys(SETS[options.mode.value]).forEach(role => {
      for (let i = 0; i < SETS[options.mode.value][role]; i++)
        unshufledDeck.push(role);
    })

    let deck = [];
    while (unshufledDeck.length > 0)
    {
      const cardId = Math.floor(Math.random() * unshufledDeck.length);
      deck.push(unshufledDeck[cardId]);
      unshufledDeck.splice(cardId, 1);
    }

    const extraCard = deck[0];
    deck.splice(0, 1);

    let unshufledSeats = [];
    for (let i = 0; i < members.length; i++)
    {
      if (members[i].dev)
        continue;
      unshufledSeats.push({id: members[i].id, cards: [deck[0]], discard: []});
      // unshufledSeats.push({id: members[i].id, cards: ["Pochlebca"], discard: []});
      deck.splice(0, 1);
    }
    for (let i = 0; i < PLACEHOLDERS; i++)
    {
      unshufledSeats.push({id: i, cards: [deck[0]], discard: []});
      deck.splice(0, 1);
    }

    // const seats = [...unshufledSeats];
    const seats = [];
    while (unshufledSeats.length > 0)
    {
      const seatId = Math.floor(Math.random() * unshufledSeats.length);
      seats.push(unshufledSeats[seatId]);
      unshufledSeats.splice(seatId, 1);
    }
    // deck = ["Baron", ...deck];

    const newState = {deck: deck, extraCard: extraCard, seats: seats, turn: 0, events: []};
    if (seats.length === 2)
    {
      newState.notUsedCards = [];
      for (let i = 0; i < 3; i++)
      {
        newState.notUsedCards.push(deck[0]);
        deck.splice(0, 1);
      }
      newState.deck = deck;
    }
    setGameState(newState);
  }

  return (
  <div>
    <div className="lobbyTitle">Game Lobby</div>
    <div className="lobbyTop">
      <button className="lobbyButtonStart" onClick={createGame} disabled={players <= 1}>Start</button>
      <Select classNamePrefix="lobbySelect"
        options={[
          {"value": "base", "label": "Podstawa (16)"},
          {"value": "base+", "label": "Podstawa Plus (21)"},
          {"value": "extended", "label": "Rozszerzenie (32)"},
          {"value": "extended+", "label": "Rozszerzenie Plus (37)"},
        ]}
        value={options.mode}
        onChange={(v) => setOptions({...options, mode: v})}
      />
    </div>
    <div className="lobbyGrid">
      {SETS?.[options.mode.value] && Object.keys(SETS[options.mode.value]).map(role => <GameCard key={role} card={CARDS.find(c => c.name === role)} amount={SETS[options.mode.value][role]}/>)}
    </div>
  </div>
  );
}