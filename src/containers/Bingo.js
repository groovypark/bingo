import React from 'react';
import { WAITING } from "../store/bingo";
import { useDispatch } from "react-redux";

const Bingo = ({
  map,
  status,
  bingos,
  isCurrentTurn,
  name,
  check
}) => {

  const dispatch = useDispatch();

  if (status === WAITING) {
    return (
      <div>
        WAITING...
      </div>
    )
  }

  const handleClick = ({x, y}) => {
    if (isCurrentTurn) {
      dispatch(check({y, x}));
    } else {
      alert("잘못된 차례입니다.")
    }
  };

  return (
    <div>
      current turn: {isCurrentTurn.toString()}
      <table>
        <tbody>
          {map.map((lst, y) => {
            return (
              <tr key={y}>
                {
                  lst.map((card, x) => {
                    if (card.checked) {
                      return (
                        <td className={"card"} style={{backgroundColor: "red"}} key={`${name}|${y}|${x}`}>
                          {card.value}
                        </td>
                      );
                    } else {
                      return (
                        <td className={"card"} key={`${name}|${y}|${x}`} onClick={() => handleClick({y, x})}>
                          {card.value}
                        </td>
                      );
                    }
                  })
                }
              </tr>
            )
          })}
        </tbody>
      </table>
      <h2>Bingo List</h2>
      {bingos.map((bingo, idx) => {
        return (
          <div key={idx}>{bingo.map(card => card.value).join(" ")}</div>
        )
      })}
    </div>
  );
};

export default Bingo;
