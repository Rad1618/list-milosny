import { getSymbol } from '../data/cardsData';
import '../styles/cards.css'

export default function GameCard({card, amount = null, onPlay = null, hrabina = false})
{
  const canBePlayed = !hrabina || card.name === "Hrabina";

  if (!card)
    return null;

  return (
    <div className='gameCardContainer'>
      {onPlay && <button className='gameCardButton'
        onClick={() => onPlay(card)}
        disabled={!canBePlayed}
      >
        Wybierz
      </button>}
      <div className='gameCard'>
        <h3>{card.name}</h3>
        {card.image && <img src={require('../images/' + card.image)}/>}
        <span>{card.desc}</span>
        <div className='gameCardNumberContainer'>
          <div className='gameCardNumber'>{card.value}</div>
          <div className='gameCardSymbol'>{getSymbol(card.name)}</div>
          <div></div>
          {amount && <div className='gameCardAmount'>x{amount}</div>}
        </div>
      </div>
    </div>
  );
}