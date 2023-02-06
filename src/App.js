import React, { useState, useEffect } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

//Die = plural, dice = singular (Later I found this was wrong)

export default function App() {
  const [dieArry, setDieArry] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);

  useEffect(() => {
    const allHeld = dieArry.every((dice) => dice.isHeld);
    const firstValue = dieArry[0].value;
    const allSameValue = dieArry.every((dice) => dice.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dieArry]);

  function generateNewDice() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const randArry = [];
    for (let i = 0; i < 10; i++) {
      randArry.push(generateNewDice());
    }
    return randArry;
  }

  function roll() {
    if (tenzies) {
      setTenzies(false);
      setDieArry(allNewDice());
    } else {
      setDieArry((prevDieArry) =>
        prevDieArry.map((dice) => {
          return dice.isHeld ? dice : generateNewDice();
        })
      );
    }
  }

  function holdDice(id) {
    setDieArry((prevArry) => {
      return prevArry.map((dice) =>
        dice.id === id
          ? {
              ...dice,
              isHeld: !dice.isHeld,
            }
          : dice
      );
    });
  }

  const diceElements = dieArry.map((dice) => {
    return (
      <Die
        key={dice.id}
        value={dice.value}
        isHeld={dice.isHeld}
        holdDice={() => holdDice(dice.id)}
      />
    );
  });

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="die-container">{diceElements}</div>
      <button className="button" onClick={roll}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
