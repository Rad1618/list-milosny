import { useState, useMemo, useEffect } from 'react';
import Seat from '../components/Seat';
import GameCard from '../components/Card';
import { CARDS, SETS } from '../data/cardsData'
import SelectNumberModal from '../modals/SelectNumberModal';
import { IterationCw } from 'lucide-react';
import '../styles/game.css'

export default function GamePage({gameState, setGameState, options, setOptions, members, me})
{
  const [cheatsheetPage, setCheatsheetPage] = useState(0);
  const [state, setState] = useState(gameState);
  const [mySeat, setMySeat] = useState(-1);
  const [myTurn, setMyTurn] = useState(false);
  const [myTurnPhase, setMyTurnPhase] = useState("");
  const [possibleTargets, setPossibleTargets] = useState([]);
  const [numberOfTargets, setNumberOfTargets] = useState(0);
  const [targets, setTargets] = useState([]);
  const [showNextRoundButton, setShowNextRoundButton] = useState(false);

  const [openSelectNumber, setOpenSelectNumber] = useState(false);

  useEffect(() => {
    const myId = gameState.seats.findIndex(s => s.id === me.id);
    if (myTurn && myId >= 0 && gameState.turn === myId)
      return;
    setState({...gameState, newRound: false});
    if (mySeat < 0)
      setMySeat(myId);
    setState({...gameState});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState])

  const cheetsheetCards = useMemo(() => {
    const cards = [];
    const keys = Object.keys(SETS[options.mode.value]);
    for (let i = 10*cheatsheetPage; i < Math.min(10*(cheatsheetPage + 1), keys.length); i++)
      cards.push(keys[i]);
    return cards;
  }, [cheatsheetPage, options])

  useEffect(() => {
    if (mySeat < 0 || myTurn || state.turn < 0)
      return;
    if (state.seats[state.turn].id === me.id)
    {
      setMyTurn(true);
      setMyTurnPhase("discard");
      const seats = [...state.seats];
      seats[mySeat].cards.push(state.deck[0]);
      seats[mySeat].protected = false;
      const newState = {...state, deck: state.deck.slice(1), seats: seats, nextRound: false};
      setState(newState);
      setGameState(newState);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.turn, mySeat])

  function showEvent(event)
  {
    if (event.target === "all" || event.target === me.id)
      return true;
    return false;
  }

  function chooseCard(card)
  {
    if (mySeat < 0 || !myTurn)
      return;
    const seats = [...state.seats];
    seats[mySeat].discard.push(card.name);
    const idx = seats[mySeat].cards.findIndex(c => c === card.name);
    if (idx >= 0)
      seats[mySeat].cards.splice(idx, 1);
    const newState = {...state, seats: seats, events: [...state.events, {text: `Gracz ${me.username} zagrał kartę ${card.name}.`, target: "all"}]};
    setState(newState);
    setMyTurnPhase("resolve");
    activateCardEffect(card.name, newState);
  }

  function returnCard(card)
  {
    if (mySeat < 0 || !myTurn)
      return;
    const seats = [...state.seats];
    const deck = [...state.deck];
    const idx = seats[mySeat].cards.findIndex(c => c === card.name);
    if (idx >= 0)
      seats[mySeat].cards.splice(idx, 1);
    deck.push(card.name);

    let newState = {...state, seats: seats, deck: deck};
    if (seats[mySeat].cards.length <= 1)
      newState = endTurn(newState);

    setState(newState);
    setGameState(newState);
  }

  function activateCardEffect(card, state)
  {
    let seats = [...state.seats];
    let events = [...state.events];
    let deck = [...state.deck];
    let endTurnFlag = false;
    let pochlebcaFlag = false;
    if (card === "Biskup")
      [events, endTurnFlag, pochlebcaFlag] = targetsPhase(card, state, events, endTurnFlag, "Biskupa", 1);
    else if (card === "Księżniczka")
    {
      [seats, events] = eliminate(mySeat, seats, events, true);
      endTurnFlag = true;
    }
    else if (card === "Hrabina")
      endTurnFlag = true;
    else if (card === "Królowa Matka")
      [events, endTurnFlag, pochlebcaFlag] = targetsPhase(card, state, events, endTurnFlag, "Królowej Matki", 1);
    else if (card === "Król")
      [events, endTurnFlag, pochlebcaFlag] = targetsPhase(card, state, events, endTurnFlag, "Króla", 1);
    else if (card === "Koństabl")
      endTurnFlag = true;
    else if (card === "Książę")
      [events, endTurnFlag, pochlebcaFlag] = targetsPhase(card, state, events, endTurnFlag, "Księcia", 1);
    else if (card === "Hrabia")
      endTurnFlag = true;
    else if (card === "Kanclerz")
    {
      if (deck.length === 0)
      {
        events.push({text: 'Brak kart do dobrania, akcja pominięta.', target: 'all'});
        endTurnFlag = true;
      }
      else
      {
        setMyTurnPhase("Kanclerz");
        if (deck.length >= 2)
          events.push({text: 'Druga karta trafi na sam spód.', target: me.id});
        for (let i = 0; i < Math.min(2, deck.length); i++)
        {
          seats[mySeat].cards.push(deck[0]);
          deck.splice(0, 1);
        }
      }
    }
    else if (card === "Pokojówka")
    {
      seats[mySeat].protected = true;
      endTurnFlag = true;
    }
    else if (card === "Pochlebca")
      [events, endTurnFlag, pochlebcaFlag] = targetsPhase(card, state, events, endTurnFlag, "Pochlebcy", 1);
    else if (card === "Baron")
      [events, endTurnFlag, pochlebcaFlag] = targetsPhase(card, state, events, endTurnFlag, "Barona", 1);
    else if (card === "Baronowa")
      [events, endTurnFlag, pochlebcaFlag] = targetsPhase(card, state, events, endTurnFlag, "Baronowej", 2);
    else if (card === "Ksiądz")
      [events, endTurnFlag, pochlebcaFlag] = targetsPhase(card, state, events, endTurnFlag, "Księdza", 1);
    else if (card === "Kardynał")
      [events, endTurnFlag, pochlebcaFlag] = targetsPhase(card, state, events, endTurnFlag, "Kardynała", 2);
    else if (card === "Strażniczka")
      [events, endTurnFlag, pochlebcaFlag] = targetsPhase(card, state, events, endTurnFlag, "Strażniczki", 1);
    else if (card === "Szpieg")
      endTurnFlag = true;
    else if (card === "Błazen")
      [events, endTurnFlag, pochlebcaFlag] = targetsPhase(card, state, events, endTurnFlag, "Błazna", 1);
    else if (card === "Skrytobójca")
      endTurnFlag = true;

    let newState = {...state, seats: seats, events: events, deck: deck};
    if (pochlebcaFlag)
      newState.pochlebca = null;
    if (endTurnFlag)
      newState = endTurn(newState);
    setState(newState);
    setGameState(newState);
  }

  function targetsPhase(card, state, events, endTurnFlag, name, number)
  {
    let pochlebcaFlag = false;
    const possibleTargets = findPossibleTargets(card, state);
    if (state.pochlebca)
    {
      if (state.seats.filter((seat, idx) => possibleTargets.includes(idx) && seat.id === state.pochlebca).length === 0)
      {
        possibleTargets.push(state.seats.findIndex(seat => seat.id === state.pochlebca));
        // events.push({text: `Cel Pochlebcy niekompatybilny.`, target: "all"});
        // pochlebcaFlag = true;
      }
    }
    if (possibleTargets.length === 0 || (myTurnPhase === "Kardynał" && possibleTargets.length < 2))
    {
      events.push({text: `Brak osób do wskazania, akcja ${name} pominięta.`, target: "all"});
      endTurnFlag = true;
    }
    else
    {
      setMyTurnPhase(card);
      setPossibleTargets(possibleTargets);
      setNumberOfTargets(number);
      setTargets([]);
    }
    return [events, endTurnFlag, pochlebcaFlag];
  }

  function eliminate(id, seats, events, ksiezniczka = false)
  {
    const username = members.find(m => m.id === seats[id].id)?.clientData?.username ?? seats[id].id;

    if (ksiezniczka)
      events.push({text: `Gracz ${username} wyeliminował się z rundy.`, target: "all"});
    else
      events.push({text: `Gracz ${username} odpada z rundy.`, target: "all"});
    seats[id].eliminated = true;

    if (seats[id].discard.includes("Koństabl"))
    {
      events.push({text: `Gracz ${username} zdobywa Punkt Uznania za Koństabla.`, target: "all"});
      seats[id].points = (seats[id]?.points ?? 0) + 1;
    }

    while (seats[id].cards.length > 0)
    {
      seats[id].discard.push(seats[id].cards[0]);
      events.push({text: `Gracz ${username} odrzuca kartę ${seats[id].cards[0]}.`, target: "all"});
      seats[id].cards.splice(0, 1);
    }
    return [seats, events];
  }

  function endTurn(state)
  {
    const seatsCount = state.seats.length;
    if (state.deck.length === 0)
      return endRound(state)
    if (state.seats.filter(s => !s?.eliminated).length <= 1)
      return endRound(state);
    for (let i = 0; i < seatsCount - 1; i++)
    {
      const newId = (i + state.turn + 1) % seatsCount;
      if (!state.seats[newId].eliminated)  // choosing next not eliminated player
      {
        setMyTurn(false);
        setMyTurnPhase("");
        setPossibleTargets([]);
        setNumberOfTargets(0);
        setTargets([]);
        return {...state, pochlebca: null, turn: newId, events: [...state.events, {text: "end-turn", target: "all"}]};
      }
    }
    return endRound(state);
  }

  function endRound(state)
  {
    let winners = [];
    let seats = [...state.seats];
    let events = [...state.events];
    if (seats.filter(s => !s?.eliminated).length === 0)
      events.push({text: "ERROR: Nie wykryto żywego gracza. Coś poszło nie tak.", target: "all"});
    else if (seats.filter(s => !s?.eliminated).length === 1)
      winners = [seats.filter(s => !s?.eliminated)[0].id];
    else {
      const winnersData = seats.reduce((win, s) => {
        if (s?.eliminated || win?.ksiezniczka)
          return win;
        if (s?.cards[0] === "Księżniczka")
          return {winners: [s.id], ksiezniczka: true};
        let cardValue = CARDS.find(card => card.name === s?.cards[0]).value;
        cardValue += s.discard.filter(c => c === "Hrabia").length;
        const discardValue = s.discard.reduce((sum, c) => sum + CARDS.find(card => card.name === c).value, 0);
        if (cardValue < win.cardValue)
          return win;
        if (cardValue > win.cardValue)
          return {winners: [s.id], cardValue: cardValue, discardValue: discardValue};
        if (discardValue < win.discardValue)
          return win;
        if (discardValue > win.discardValue)
          return {winners: [s.id], cardValue: cardValue, discardValue: discardValue};
        return {...win, winners: [...win.winners, s.id]};
      }, {winners: [], cardValue: -1, discardValue: -1});
      console.log(winnersData);
      winners = winnersData.winners;
    }
    for (let i = 0; i < winners.length; i++)
    {
      const winnerName = members.find(m => m.id === winners[i])?.clientData?.username ?? winners[i];
      events.push({text: `Rundę zwyciężył Gracz ${winnerName}`, target: "all"});
      seats.find(s => s.id === winners[i]).points = (seats.find(s => s.id === winners[i])?.points ?? 0) + 1;
    }
    if (winners.filter(w => seats.find(s => s.id === w)?.blazen))  // Błazen target won
    {
      const blazenIdx = seats.findIndex(s => s.discard.includes("Błazen"));
      if (blazenIdx >= 0)
      {
        const blazenName = members.find(m => m.id === seats[blazenIdx].id)?.clientData?.username ?? seats[blazenIdx].id;
        events.push({text: `Gracz ${blazenName} zdobywa Punkt Uznania za poprawne odbstawienie zwycięzcy.`, target: "all"});
        seats[blazenIdx].points = (seats[blazenIdx]?.points ?? 0) + 1;
      }
    }
    if (seats.filter(s => !s?.eliminated && s.discard.includes("Szpieg")).length === 1)
    {
      const szpiegIdx = seats.findIndex(s => !s?.eliminated && s.discard.includes("Szpieg"));
      const szpiegName = members.find(m => m.id === seats[szpiegIdx].id)?.clientData?.username ?? seats[szpiegIdx].id;
      events.push({text: `Gracz ${szpiegName} zdobywa Punkt Uznania za bycie jedynym niewyeliminowanym szpiegiem.`, target: "all"});
      seats[szpiegIdx].points = (seats[szpiegIdx]?.points ?? 0) + 1;
    }

    events.push({text: "end-round", target: "all"});
    setMyTurn(false);
    setMyTurnPhase("");
    setPossibleTargets([]);
    setNumberOfTargets(0);
    setTargets([]);
    setShowNextRoundButton(true);
    return {...state, endRound: true, winners: winners, seats: seats, events: events, turn: -1};
  }

  function findPossibleTargets(card, state)
  {
    const targets = [];
    for (let i = 0; i < state.seats.length; i++)
    {
      if (i === mySeat && !["Książę", "Pochlebca"].includes(card))
        continue;
      if (state.seats[i]?.protected || state.seats[i]?.eliminated)
        continue;
      targets.push(i);
    }
    return targets;
  }

  function selectTarget(idx)
  {
    let newTargets = [...targets];
    if (targets.includes(idx))
      newTargets.splice(targets.indexOf(idx), 1);
    else if (idx !== -2)   // -2 is a flag to end selection
      newTargets.push(idx);
    setTargets(newTargets);
  
    if (newTargets.length === Math.min(numberOfTargets, possibleTargets.length) || idx === -2)
    {
      setPossibleTargets([]);
      let seats = [...state.seats];
      let events = [...state.events];
      let deck = [...state.deck];
      let extraCard = state.extraCard;
      let endTurnFlag = true;
      let pochlebca = null;
      
      if (myTurnPhase === "Biskup" || myTurnPhase === "Strażniczka")
      {
        setOpenSelectNumber(true);
        endTurnFlag = false;
      }
      else if (myTurnPhase === "Królowa Matka" || myTurnPhase === "Baron")
      {
        const myValue = CARDS.find(c => c.name === seats[mySeat].cards?.[0])?.value ?? -1;
        const targetValue = CARDS.find(c => c.name === seats[newTargets[0]].cards?.[0])?.value ?? -1;
        const targetName = members.find(m => m.id === seats[newTargets[0]].id)?.clientData?.username ?? seats[newTargets[0]].id;
        events.push({text: `Gracz ${me.username} wybiera Gracza ${targetName} do porównania kart.`, target: "all"});
        events.push({text: `Gracz ${targetName} ma kartę ${seats[newTargets[0]].cards?.[0]} (${targetValue})`, target: me.id});
        events.push({text: `Gracz ${me.username} ma kartę ${seats[mySeat].cards?.[0]} (${myValue})`, target: seats[newTargets[0]].id});

        const sign = myTurnPhase === "Królowa Matka" ? 1 : -1;
        if (sign * myValue > sign * targetValue)
          [seats, events] = eliminate(mySeat, seats, events);
        else if (sign * myValue < sign * targetValue)
          [seats, events] = eliminate(newTargets[0], seats, events);
        else
          events.push({"text": "Nikt nie odpada.", "target": "all"});
        if (seats.filter(s => !s?.eliminated).length <= 1)
          endTurnFlag = true;
      }
      else if (myTurnPhase === "Król")
      {
        const targetName = members.find(m => m.id === seats[newTargets[0]].id)?.clientData?.username ?? seats[newTargets[0]].id;
        events.push({text: `Gracz ${me.username} zamienia się kartami z Graczem ${targetName}.`, target: "all"});
        const bufor = [...seats[mySeat].cards];
        seats[mySeat].cards = [...seats[newTargets[0]].cards];
        seats[newTargets[0]].cards = bufor;
      }
      else if (myTurnPhase === "Książę")
      {
        const targetName = members.find(m => m.id === seats[newTargets[0]].id)?.clientData?.username ?? seats[newTargets[0]].id;
        if (newTargets[0] === mySeat)
          events.push({text: `Gracz ${me.username} wybiera samego siebie.`, target: "all"});
        else
          events.push({text: `Gracz ${me.username} wybiera Gracze ${targetName}.`, target: "all"});

        while (seats[newTargets[0]].cards.length > 0)
        {
          seats[newTargets[0]].discard.push(seats[newTargets[0]].cards[0]);
          events.push({text: `Gracz ${targetName} odrzuca kartę ${seats[newTargets[0]].cards[0]}.`, target: "all"});
          if (seats[newTargets[0]].cards[0] === "Księżniczka")
          {
            seats[newTargets[0]].eliminated = true;
            events.push({text: `Gracz ${targetName} odpada z rundy.`, target: "all"});
            if (seats[newTargets[0]].discard.includes("Koństabl"))
            {
              events.push({text: `Gracz ${targetName} zdobywa Punkt Uznania za Koństabla.`, target: "all"});
              seats[newTargets[0]].points = (seats[newTargets[0]]?.points ?? 0) + 1;
            }
          }
          seats[newTargets[0]].cards.splice(0, 1);
        }
        if (!seats[newTargets[0]]?.eliminated)
        {
          if (deck.length > 0)
          {
            seats[newTargets[0]].cards.push(deck[0]);
            deck.splice(0, 1);
          }
          else
          {
            seats[newTargets[0]].cards.push(extraCard);
            extraCard = null;
          }
        }
      }
      else if (myTurnPhase === "Pochlebca")
      {
        const targetName = members.find(m => m.id === seats[newTargets[0]].id)?.clientData?.username ?? seats[newTargets[0]].id;
        if (newTargets[0] === mySeat)
          events.push({text: `Gracz ${me.username} wybiera samego siebie.`, target: "all"});
        else
          events.push({text: `Gracz ${me.username} wybiera Gracza ${targetName}.`, target: "all"});
        pochlebca = seats[newTargets[0]].id;
      }
      else if (myTurnPhase === "Baronowa" || myTurnPhase === "Ksiądz")
      {
        for (let i = 0; i < newTargets.length; i++)
        {
          const targetName = members.find(m => m.id === seats[newTargets[i]].id)?.clientData?.username ?? seats[newTargets[i]].id;
          events.push({text: `Gracz ${me.username} wybiera Gracza ${targetName}.`, target: "all"});
          events.push({text: `Gracz ${targetName} ma kartę ${seats[newTargets[i]].cards?.[0]}.`, target: me.id});
          if (myTurnPhase === "Ksiądz")
            break;
        }
      }
      else if (myTurnPhase === "Kardynał")
      {
        if (newTargets.length >= 2)
        {
          endTurnFlag = false;
          const targetName1 = members.find(m => m.id === seats[newTargets[0]].id)?.clientData?.username ?? seats[newTargets[0]].id;
          const targetName2 = members.find(m => m.id === seats[newTargets[1]].id)?.clientData?.username ?? seats[newTargets[1]].id;
          events.push({text: `Gracz ${targetName1} i Gracz ${targetName2} wymieniają się kartami.`, target: "all"});
          events.push({text: `Wybierz gracza, którego kartę chcesz podejrzeć.`, target: me.id});
          const bufor = [...seats[newTargets[0]].cards];
          seats[newTargets[0]].cards = [...seats[newTargets[1]].cards];
          seats[newTargets[1]].cards = bufor;
          pochlebca = state.pochlebca; // pochlebca musi zostać jeszcze na drugi wybór
          setPossibleTargets(newTargets);
          setTargets([]);
          setNumberOfTargets(1);
        }
        else
        {
          const targetName = members.find(m => m.id === seats[newTargets[0]].id)?.clientData?.username ?? seats[newTargets[0]].id;
          events.push({text: `Gracz ${me.username} podgląda kartę Gracza ${targetName}.`, target: "all"});
          events.push({text: `Gracz ${targetName} ma kartę ${seats[newTargets[0]].cards?.[0]}.`, target: me.id});
          events.push({text: `Twoja karta została podglądnięta.`, target: seats[newTargets[0]].id});
        }
      }
      else if (myTurnPhase === "Błazen")
      {
        const targetName = members.find(m => m.id === seats[newTargets[0]].id)?.clientData?.username ?? seats[newTargets[0]].id;
        events.push({text: `Gracz ${me.username} obstawia Gracza ${targetName}.`, target: "all"});
        seats[newTargets[0]].blazen = true;
      }

      let newState = {...state, seats: seats, events: events, deck: deck, extraCard: extraCard};
      if (endTurnFlag)
        newState = endTurn(newState);
      newState.pochlebca = pochlebca;
      setState(newState);
      setGameState(newState);
    }
  }

  function selectNumber(number)
  {
    let seats = [...state.seats];
    let events = [...state.events];
    let deck = [...state.deck];
    let extraCard = state.extraCard;
    let endTurnFlag = true;
    if (myTurnPhase === "Biskup")
    {
      if (targets.length > 0)
      {
        const targetCard = seats[targets[0]].cards[0];
        const targetName = members.find(m => m.id === seats[targets[0]].id)?.clientData?.username ?? seats[targets[0]].id;
        const targetValue = CARDS.find(c => c.name === targetCard)?.value ?? -1;
        events.push({text: `Gracz ${me.username} uważa, że Gracz ${targetName} ma kartę o wartości ${number}.`, target: "all"});
        if (number === targetValue)
        {
          events.push({text: `Gracz ${me.username} odgadł wartość karty Gracza ${targetName} i zdobywa Punkt Uznania.`, target: "all"});
          seats[mySeat].points = (seats[mySeat]?.points ?? 0) + 1;
        }
        else
          events.push({text: `Gracz ${me.username} nie odgadł wartości karty Gracza ${targetName}.`, target: "all"});
      }
    }
    else if (myTurnPhase === "Strażniczka")
    {
      if (targets.length > 0)
      {
        const targetCard = seats[targets[0]].cards[0];
        const targetName = members.find(m => m.id === seats[targets[0]].id)?.clientData?.username ?? seats[targets[0]].id;
        const targetValue = CARDS.find(c => c.name === targetCard)?.value ?? -1;
        events.push({text: `Gracz ${me.username} uważa, że Gracz ${targetName} ma kartę o wartości ${number}.`, target: "all"});
        if (targetCard === "Skrytobójca")
        {
          events.push({text: `Gracz ${targetName} miał kartę Skrytobójca.`, target: "all"});
          [seats, events] = eliminate(mySeat, seats, events);
          if (!seats[targets[0]]?.eliminated)
          {
            events.push({text: `Gracz ${targetName} odrzuca kartę Skrytobójca.`, target: "all"});
            seats[targets[0]].discard.push(seats[targets[0]].cards[0]);
            seats[targets[0]].cards.splice(0, 1);
          }
          if (seats[targets[0]].cards.length === 0 && !seats[targets[0]]?.eliminated)
          {
            if (deck.length > 0)
            {
              seats[targets[0]].cards.push(deck[0]);
              deck.splice(0, 1);
            }
            else
            {
              seats[targets[0]].cards.push(extraCard);
              extraCard = null;
            }
          }
        }
        else
        {
          if (number === targetValue)
          {
            events.push({text: `Gracz ${me.username} odgadł wartość karty Gracza ${targetName}.`, target: "all"});
            [seats, events] = eliminate(targets[0], seats, events);
          }
          else
            events.push({text: `Gracz ${me.username} nie odgadł wartości karty Gracza ${targetName}.`, target: "all"});
        }
      }
    }

    let newState = {...state, seats: seats, events: events, deck: deck, extraCard: extraCard};
    if (endTurnFlag)
      newState = endTurn(newState);
    setState(newState);
    setGameState(newState);
  }

  function nextRound()
  {
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

    const seats = state.seats.map(s => {
      const newSeat = ({
        id: s.id,
        cards: [deck[0]],
        discard: [],
        points: s?.points ?? 0,
      });
      deck.splice(0, 1);
      return newSeat;
    })
    const newState = {version: state.version, seats: seats, events: state.events, deck: deck, extraCard: extraCard};
    if (state?.winners.length > 0)
      newState.turn = state.seats.findIndex(s => s.id === state.winners[0]);
    else
      newState.turn = 0;

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

    // setState(newState);
    setGameState(newState);
  }

  if (!options.mode.value || !SETS?.[options.mode.value])
    return null;

  return <div className='gamePage'>
    <div className='gameUpperHalf'>
      <div className='gameDeckContainer'>
        {state.notUsedCards && <div className='gameNotUsedCards'>
            Odrzucone karty:
            {state.notUsedCards.map((card, idx) => <div key={idx}>
              {card}
            </div>)}
          </div>}
        {state.deck.length > 2 && <div className='gameDeckCard c1'>{state.deck.length}</div>}
        {state.deck.length > 1 && <div className='gameDeckCard c2'>{state.deck.length}</div>}
        {state.deck.length > 0 && <div className='gameDeckCard c3'>{state.deck.length}</div>}
        {state.extraCard && <div className='gameExtraCard'/>}
      </div>
      <div className='gameUpperHalfSeats'>
        {state.seats.map((seat, idx) => <Seat
          key={seat.id} 
          seat={seat}
          members={members}
          hisTurn={state.turn === idx}
          canBeTargetted={possibleTargets.includes(idx)}
          isTargetted={targets.includes(idx)}
          onTarget={() => selectTarget(idx)}
          pochlebca={targets.length === 0 && state.pochlebca}
          endRound={state?.endRound ?? false}
        />)}
      </div>
    </div>
    <div className='gameSpecialButtons'>
      {myTurnPhase === "Baronowa" && targets.length === 1 && <button
        className='gameSpecialButton'
        onClick={() => selectTarget(-2)}
      >Tylko 1</button>}
      {showNextRoundButton && <button
        className='gameSpecialButton'
        onClick={() => {nextRound(); setShowNextRoundButton(false);}}
      >Następna runda</button>}
    </div>
    <div className='gameLowerHalf'>
      <div className='gameEvents'>
        <div className='gameEventsEnd'/>
        {state?.events && state.events.filter(event => showEvent(event))
        .map((event, idx) => {
          if (event.text === "end-turn")
            return (<div key={idx} className='gameEventSeparator'/>);
          else if ((event.text === "end-round"))
            return (<div key={idx} className='gameEventSeparatorBig'/>);
          return (<div key={idx} className={`gameEvent ${event.target !== 'all' ? 'strong' : ''}`}>
            {event.text}
          </div>);
        })}
      </div>
      <div>
        {mySeat >= 0 && <div className='gameHand'>
          {state.seats[mySeat].cards.map((c, idx) => <GameCard
            key={idx}
            card={CARDS.find(card => card.name === c)}
            onPlay={myTurnPhase === "discard" ? chooseCard : (myTurnPhase === "Kanclerz" ? returnCard : null)}
            hrabina={
              state.seats[mySeat].cards.includes("Hrabina") &&
              (state.seats[mySeat].cards.includes("Król") ||
              state.seats[mySeat].cards.includes("Książę"))
            }
          />)}
        </div>}
      </div>
      <div className='gameCheatsheet'>
        <ul>
          {cheetsheetCards.map(role => <li key={role}>
            <strong>{CARDS.find(c => c.name === role).value}-{role} ({SETS[options.mode.value][role]}): </strong> 
            {CARDS.find(c => c.name === role).short}
          </li>)}
        </ul>
        {Object.keys(SETS[options.mode.value]).length > 10 && <IterationCw 
          className='gameCheatsheetFlip'
          onClick={() => setCheatsheetPage(1 - cheatsheetPage)}  
        />}
      </div>
    </div>
    <SelectNumberModal
      open={openSelectNumber}
      setOpen={setOpenSelectNumber}
      biskup={myTurnPhase==="Biskup"}
      onSelect={(n) => selectNumber(n)}
      options={options}
    />
  </div>
}