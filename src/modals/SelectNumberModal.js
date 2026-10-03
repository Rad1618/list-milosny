import '../styles/modals.css';

export default function SelectNumberModal({open, setOpen, biskup, onSelect})
{
  const NUMBERS = biskup ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : [0, 2, 3, 4, 5, 6, 7, 8, 9];

  if (!open)
    return null;

  return <div className="modalOverlay">
    <div className="modalPanel">
      <div className="modalHeader">Wskaż wartość karty wybranego gracza</div>
      <div className='modalNumbersGrid'>
        {NUMBERS.map(n => <div key={n} onClick={() => {onSelect(n); setOpen(false);}}>{n}</div>)}
      </div>
      {/* <div>Wyrzucenie {targetSeat.username} z obozu</div>
      <div>Czy jeteś za?</div>
      <div className="modalButtons">
        <button className="modalButtonYes" onClick={(e) => castVote(e, true)}>Tak</button>
        <button className="modalButtonNo" onClick={(e) => castVote(e, false)}>Nie</button>
      </div> */}
    </div>
  </div>
}