
import { Fragment } from "react";
import { getSymbol, CARDS } from "../data/cardsData";
import { PlayingCards, Skull, Crosshair, Trophy, Shield, MapPin } from "lucide-react";

export default function Seat({seat, members, hisTurn, canBeTargetted, isTargetted, onTarget, pochlebca, endRound})
{
  const player = members.find(m => m.id === seat.id)?.clientData?.username ?? `bot-${seat.id}`;

  function extraValue()
  {
    const plus = seat.discard.filter(card => card === "Hrabia").length;
    if (plus === 0)
      return "";
    else
      return ` + ${plus} = ${CARDS.find(c => c.name === seat.cards[0]).value + plus}`;
  }

  function sumDiscard()
  {
    return seat.discard.reduce((sum, card) => sum + CARDS.find(c => c.name === card).value, 0);
  }

  return <div className="gameSeat">
    <h3>{player}{hisTurn && !endRound && <PlayingCards size={26} className="gameIcon"/>}</h3>
    <div key="key" className="gameSeatSymbols">
      <Fragment key="points">
        {seat?.points > 0 && [...Array(seat.points)].map(n => <Trophy key={n} className="gameIcon gold"/>)}
      </Fragment>
      {seat?.protected && <Shield key="shield" className="gameIcon"/>}
      {pochlebca && pochlebca === seat.id && <Crosshair key="target" className="gameIcon red"/>}
      {seat?.blazen && <MapPin key="pin" className="gameIcon green"/>}
      {seat?.eliminated && <Skull key="skull" className="gameIcon gray"/>}
    </div>
    <ol>
      {seat.discard.map((card, idx) => <li key={`${card}-${idx}`}>
        {getSymbol(card, 12)} {card} ({CARDS.find(c => c.name === card).value})
      </li>)}
    </ol>
    {endRound && <>
      <hr/>
      {!seat?.eliminated && seat.cards.length > 0 && <div className="endRoundInfo">
        {getSymbol(seat.cards[0], 12)} {seat.cards[0]} ({CARDS.find(c => c.name === seat.cards[0]).value}) {extraValue()}
      </div>}
      {!seat?.eliminated && <div className="endRoundInfo">Odrzucone: {sumDiscard()}</div>}
      {!seat?.eliminated && seat.cards.length > 0 && seat.cards.includes("Księżniczka") && <div className="endRoundInfo">
        Księżniczka zawsze wygrywa
      </div>}
    </>}
    {(canBeTargetted || isTargetted) && (!pochlebca || pochlebca === seat.id) && <div
      className={`gameSeatCrosshair ${isTargetted ? "targetted" : ""}`}
      onClick={() => canBeTargetted && onTarget()}
    >
      <Crosshair/>
    </div>}
  </div>
}