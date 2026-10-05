import { useMemo } from 'react';

import '../styles/modals.css';

export default function SelectNumberModal({open, setOpen, biskup, onSelect, options})
{
  const NUMBERS = useMemo(() => {
    if (biskup)
      return [0, 1, 2, 3, 4, 5, 6, 7, 8];
    if (options.mode.value === "base")
      return [2, 3, 4, 5, 6, 7, 8];
    if (options.mode.value === "base+")
      return [0, 2, 3, 4, 5, 6, 7, 8];
    return [0, 2, 3, 4, 5, 6, 7, 8, 9];
  }, [options]);

  if (!open)
    return null;

  return <div className="modalOverlay">
    <div className="modalPanel">
      <div className="modalHeader">Wskaż wartość karty wybranego gracza</div>
      <div className='modalNumbersGrid'>
        {NUMBERS.map(n => <div key={n} onClick={() => {onSelect(n); setOpen(false);}}>{n}</div>)}
      </div>
    </div>
  </div>
}