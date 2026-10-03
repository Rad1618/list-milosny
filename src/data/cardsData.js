import { Ban, ChessBishop, Heart, Gem, ChessQueen, ChessKing, ChessKnight, Crown, Castle,
  Landmark, MopSparkles, Rose, Coins, Flower, BookOpen, Church, Sword, HatGlasses,
  FaceGrinning, MoonStar
 } from "lucide-react";
import "../styles/cards.css"

export const CARDS = [
  {"name": "Biskup", "value": 9, "image": "biskup.png", "desc": "Odgadnij numer karty innego gracza, aby zdobyć Punkt Uznania", "short": "Zgadnij wartość karty, wygraj Punkt Uznania"},
  {"name": "Księżniczka", "value": 8, "image": "ksiezniczka.png", "desc": "Odpadasz z rundy, jeśli zagrasz, lub odrzucisz tę kartę", "short": "Odpadasz, jeśli zagrasz, lub odrzucisz"},
  {"name": "Hrabina", "value": 7, "image": "hrabina.png", "desc": "Musisz wybrać tę kartę, jeśli masz na ręce Króla, lub Księcia", "short": "Musisz wybrać, jeśli masz Króla, lub Księcia"},
  {"name": "Królowa Matka", "value": 7, "image": "krolowa_matka.png", "desc": "Porównaj karty z wybranym graczem. Wyższy numer odpada", "short": "Porównaj karty, wyższa odpada"},
  {"name": "Król", "value": 6, "image": "krol.png", "desc": "Wymień karty z wybranym graczem", "short": "Wymień karty z innym graczem"},
  {"name": "Koństabl", "value": 6, "image": "konstabl.png", "desc": "Zdobywasz Punkt Uznania, jeśli odpadniesz z rundy, mając zagraną tę kartę", "short": "Jeśli odpadniesz, dostaniesz Punkt Uznania"},
  {"name": "Książę", "value": 5, "image": "ksiaze.png", "desc": "Wybrany gracz musi odrzucić kartę i dobrać nową", "short": "Wybrany gracz odrzuca kartę"},
  {"name": "Hrabia", "value": 5, "image": "hrabia.png", "desc": "Na koniec rundy, dodaje +1 do wartości Twojej karty", "short": "+1 do wartości karty na koniec rundy"},
  {"name": "Kanclerz", "value": 5, "image": "kanclerz.png", "desc": "Dobierz 2 karty i zwróć 2 na spód talii", "short": "Dobierz i zwróć 2 karty"},
  {"name": "Pokojówka", "value": 4, "image": "pokojowka.png", "desc": "Nie możesz być celem działań innych kart do początku Twojej następnej tury", "short": "Immunitet na 1 turę"},
  {"name": "Pochlebca", "value": 4, "image": "pochlebca.png", "desc": "Wybierz, kto ma być celem działania następnej karty", "short": "Wybierz cel następnej karty"},
  {"name": "Baron", "value": 3, "image": "baron.png", "desc": "Porównaj karty z wybranym graczem. Niższy numer odpada", "short": "Porównaj karty, niższa odpada"},
  {"name": "Baronowa", "value": 3, "image": "baronowa.png", "desc": "Podglądnij karty 1, lub 2 graczy", "short": "Objerzyj karty 1, lub 2 graczy"},
  {"name": "Ksiądz", "value": 2, "image": "ksiadz.png", "desc": "Podglądnij kartę wybranego gracza", "short": "Obejrzyj kartę gracza"},
  {"name": "Kardynał", "value": 2, "image": "kardynal.png", "desc": "Wybierz dwóch innych graczy i zamień ich karty, podglądając jedną", "short": "Zamień karty dwóch graczy, obejrzyj jedną"},
  {"name": "Strażniczka", "value": 1, "image": "strazniczka.png", "desc": "Odgadnij numer karty innego gracza, aby wyeliminować go z rundy", "short": "Zgadnij wartość karty, wyeliminuj gracza"},
  {"name": "Szpieg", "value": 0, "image": "szpieg.png", "desc": "Zdobąć Punkt Uznania, jeśli jako jedyny wyłożyłeś szpiega i nie zostałeś wyeliminowany", "short": "Jedyny aktywny szpieg wygrywa Punkt Uznania"},
  {"name": "Błazen", "value": 0, "image": "blazen.png", "desc": "Wskaż gracza, jeśli wygra rundę, zdobywasz Punkt Uznania", "short": "Jeśli wybrany gracz wygra, wygrywasz Punkt Uznania"},
  {"name": "Skrytobójca", "value": 0, "image": "skrytobojca.png", "desc": "Jeżeli jesteś celem Strażniczki, zagrywający ją gracz odpada, wymień wtedy tę kartę", "short": "Zabija gracza ze Strażniczką, jeśli wskazany"},
];

export const SETS = {
  "base": {"Księżniczka": 1, "Hrabina": 1, "Król": 1, "Książę": 2, "Pokojówka": 2, "Baron": 2, "Ksiądz": 2, "Strażniczka": 5},
  "base+": {"Księżniczka": 1, "Hrabina": 1, "Król": 1, "Książę": 2, "Kanclerz": 2, "Pokojówka": 2, "Baron": 2, "Ksiądz": 2, "Strażniczka": 6, "Szpieg": 2},
  "extended": {"Biskup": 1, "Księżniczka": 1, "Hrabina": 1, "Królowa Matka": 1, "Król": 1, "Koństabl": 1, "Książę": 2, "Hrabia": 2, "Pokojówka": 2, "Pochlebca": 2,
    "Baron": 2, "Baronowa": 2, "Ksiądz": 2, "Kardynał": 2, "Strażniczka": 8, "Błazen": 1, "Skrytobójca": 1},
  "extended+": {"Biskup": 1, "Księżniczka": 1, "Hrabina": 1, "Królowa Matka": 1, "Król": 1, "Koństabl": 1, "Książę": 2, "Kanclerz": 2, "Hrabia": 2, "Pokojówka": 2, "Pochlebca": 2,
    "Baron": 2, "Baronowa": 2, "Ksiądz": 2, "Kardynał": 2, "Strażniczka": 9, "Szpieg": 2, "Błazen": 1, "Skrytobójca": 1},
}

export function getSymbol(cardName, size = 0)
{
  if (cardName === "Biskup")
    return <ChessBishop size={size}/>
  if (cardName === "Księżniczka")
    return <Heart size={size}/>
  if (cardName === "Hrabina")
    return <Gem size={size}/>
  if (cardName === "Królowa Matka")
    return <ChessQueen size={size}/>
  if (cardName === "Król")
    return <ChessKing size={size}/>
  if (cardName === "Koństabl")
    return <ChessKnight size={size}/>
  if (cardName === "Książę")
    return <Crown size={size}/>
  if (cardName === "Hrabia")
    return <Castle size={size}/>
  if (cardName === "Kanclerz")
    return <Landmark size={size}/>
  if (cardName === "Pokojówka")
    return <MopSparkles size={size}/>
  if (cardName === "Pochlebca")
    return <Rose size={size}/>
  if (cardName === "Baron")
    return <Coins size={size}/>
  if (cardName === "Baronowa")
    return <Flower size={size}/>
  if (cardName === "Ksiądz")
    return <BookOpen size={size}/>
  if (cardName === "Kardynał")
    return <Church size={size}/>
  if (cardName === "Strażniczka")
    return <Sword size={size}/>
  if (cardName === "Szpieg")
    return <HatGlasses size={size}/>
  if (cardName === "Błazen")
    return <FaceGrinning size={size}/>
  if (cardName === "Skrytobójca")
    return <MoonStar size={size}/>
  return <Ban size={size}/>
}