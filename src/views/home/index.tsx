import { useEffect, useState } from "react";
import { useSocket } from "../../shared/hooks/useSocket";

type Card = {
  suit: string;
  value: number | string;
}

export default function Home() {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [hand, setHand] = useState<Card[]>([]);
  const { emit, listen, off } = useSocket();

  function recieveCard(card: Card) {
    setHand((oldHand) => [...oldHand, card]);
  }

  function gameEnded() {
    setGameFinished(true);
  }

  useEffect(() => {
    listen<Card>("deal_card", recieveCard);
    listen("game_end", gameEnded);

    return () => {
      off("deal_card");
      off("game_end");
    };
  }, []);

  function startGame() {
    setGameStarted(true);
    setHand([]);
    emit("start_game");
  }

  return (
    <div className="mx-auto sm:w-full sm:p-12 max-w-screen-2xl py-16">
      <h1 className="text-5xl font-black">Game</h1>
      {!gameStarted && (
        <button
          className="my-4 px-4 py-2 rounded shadow hover:shadow-md"
          onClick={startGame}
        >
          Start
        </button>
      )}
      <div className="my-4 flex flex-row gap-2 items-center w-full">
        {hand.map((card, index) => (
          <div
            key={index}
            className="w-32 h-48 py-16 px-4 flex flex-col items-center justify-center border border-slate-200 rounded shadow"
          >
            <span className="text-xl font-base">
              {card.suit}-{card.value}
            </span>
          </div>
        ))}
      </div>
      {gameStarted && gameFinished && (
        <button
          className="my-4 px-4 py-2 rounded shadow hover:shadow-md"
          onClick={startGame}
        >
          Play again
        </button>
      )}
    </div>
  );
}
