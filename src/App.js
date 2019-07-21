import React from 'react';
import './App.css';
import Bingo from "./containers/Bingo";
import { useDispatch, useSelector } from "react-redux";
import { P1_TURN, p1Check, P2_TURN, p2Check, restart, start, WAITING } from "./store/bingo"

function shuffle(o) {
  o.sort(function () {
    return 0.5 - Math.random()
  });
  return o;
}

const createRandomMap = (size) => {
  const numArr = [...(new Array(size * size))].map((_, i) => i);
  const shuffledNumArr = shuffle(numArr);

  const map = shuffledNumArr.reduce((acc, cur) => {
    const lastLst = acc[acc.length - 1];
    if (lastLst.length < size) {
      lastLst.push({
        value: cur,
        checked: false,
        y: acc.length - 1,
        x: lastLst.length
      })
    } else {
      acc.push([
        {
          value: cur,
          checked: false,
          y: acc.length,
          x: 0
        }
      ])
    }
    return acc
  }, [
    []
  ]);

  return map;
};

function App() {
  const dispatch = useDispatch();
  const bingo = useSelector(state => state.bingo);
  const size = 5;
  const handleStart = () => {
    dispatch(start({
      p1Map: createRandomMap(size),
      p2Map: createRandomMap(size)
    }))
  };

  const handleRestart = () => {
    dispatch(restart({
      p1Map: createRandomMap(size),
      p2Map: createRandomMap(size),
    }))
  };

  if (bingo.status !== WAITING) {
    if (bingo.p1Bingos.length === 5 && bingo.p2Bingos.length === 5) {
      alert("무승부입니다.");
      handleRestart()
    } else if (bingo.p1Bingos.length === 5) {
      alert('1P가 빙고를 완성했습니다.');
      handleRestart()
    } else if (bingo.p2Bingos.length === 5) {
      alert('2P가 빙고를 완성했습니다.');
      handleRestart()
    }
  }

  return (
    <div className="App">
      <Bingo
        map={bingo.p1Map}
        status={bingo.status}
        bingos={bingo.p1Bingos}
        isCurrentTurn={bingo.status === P1_TURN}
        check={p1Check}
        name={"P1"}
      />
      <Bingo
        map={bingo.p2Map}
        status={bingo.status}
        bingos={bingo.p2Bingos}
        isCurrentTurn={bingo.status === P2_TURN}
        check={p2Check}
        name={"P2"}
      />
      {bingo.status === WAITING ? (
        <button onClick={handleStart}>게임 시작</button>
      ) : (
        <button onClick={handleRestart}>재시작</button>
      )}
    </div>
  );
}

export default App;
