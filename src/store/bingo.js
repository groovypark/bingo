const START = 'bingo/START';
const RESTART = 'bingo/RESTART';
const P1_CHECK = 'bingo/P1_CHECK';
const P2_CHECK = 'bingo/P2_CHECK';

export const start = ({p1Map, p2Map}) => {
  return ({
    type: START,
    payload: {
      p1Map,
      p2Map
    }
  });
};
export const restart = ({p1Map, p2Map}) => {
  return ({
    type: RESTART,
    payload: {
      p1Map,
      p2Map
    }
  });
};

export const p1Check = ({x, y}) => {
  return ({
    type: P1_CHECK,
    payload: {
      x,
      y
    }
  });
};

export const p2Check = ({x, y}) => {
  return ({
    type: P2_CHECK,
    payload: {
      x,
      y
    }
  });
};

const copyMap = map => {
  return map.map(line => line.map(card => ({...card})))
};

export const WAITING = "WAITING";
export const P1_TURN = "P1_TURN";
export const P2_TURN = "P2_TURN";

const initialState = {
  status: WAITING,
  p1Map: null,
  p2Map: null,
  p1Bingos: [],
  p2Bingos: []
};

const getBingos = ({y, x, map}) => {
  const bingos = [];

  if (y === x) {
    const leftDiagonalCards = map.reduce((acc, lst) => [...acc, ...lst.filter((card)=> card.checked && card.x === card.y)], []);
    if (leftDiagonalCards.length === map.length) {
      bingos.push(leftDiagonalCards)
    }
  }

  if (x+y === map.length-1) {
    const rightDiagonalCards = map.reduce((acc, lst) => [...acc, ...lst.filter((card)=> card.checked && card.x + card.y === 4)], []);
    if (rightDiagonalCards.length === map.length) {
      bingos.push(rightDiagonalCards)
    }
  }

  const horizontalCards = map[y].filter((card) => card.checked);
  if (horizontalCards.length === map.length) {
    bingos.push(horizontalCards)
  }

  const verticalCards = map.map(lst => lst[x]).filter(card => card.checked);
  if (verticalCards.length === map.length) {
    bingos.push(verticalCards)
  }
  return bingos
};

export default function bingo(state = initialState, action) {
  switch (action.type) {
    case START: {
      const {
        p1Map, p2Map
      } = action.payload;
      return {
        ...state,
        status: P1_TURN,
        p1Map,
        p2Map,
        p1Bingos: [],
        p2Bingos: []
      };
    }
    case RESTART: {
      const {
        p1Map, p2Map
      } = action.payload;

      return {
        ...state,
        status: P1_TURN,
        p1Map,
        p2Map,
        p1Bingos: [],
        p2Bingos: []
      };
    }

    case P1_CHECK: {
      const { x, y } = action.payload;
      const nextState = {
        ...state,
        status: P2_TURN,
        p1Map: copyMap(state.p1Map),
        p2Map: copyMap(state.p2Map)
      };

      const p1Card = nextState.p1Map[y][x];
      p1Card.checked = true;

      const p1NewBingos = getBingos({y, x, map: nextState.p1Map});
      nextState.p1Bingos = nextState.p1Bingos.concat(p1NewBingos);


      const p2Card = nextState.p2Map.reduce((found, lst) => {
        if (found) {
          return found
        }
        return lst.find(card => card.value === p1Card.value)
      }, undefined);
      p2Card.checked = true;

      const p2NewBingos = getBingos({y: p2Card.y, x: p2Card.x, map: nextState.p2Map});
      nextState.p2Bingos = nextState.p2Bingos.concat(p2NewBingos);


      return nextState
    }

    case P2_CHECK: {
      const { x, y } = action.payload;
      const nextState = {
        ...state,
        status: P1_TURN,
        p1Map: copyMap(state.p1Map),
        p2Map: copyMap(state.p2Map)
      };

      const p2Card = nextState.p2Map[y][x];
      p2Card.checked = true;

      const p2NewBingos = getBingos({y, x, map: nextState.p2Map});
      nextState.p2Bingos = nextState.p2Bingos.concat(p2NewBingos);


      const p1Card = nextState.p1Map.reduce((found, lst) => {
        if (found) {
          return found
        }
        return lst.find(card => card.value === p2Card.value)
      }, undefined);
      p1Card.checked = true;

      const p1NewBingos = getBingos({y: p1Card.y, x: p1Card.x, map: nextState.p1Map});
      nextState.p1Bingos = nextState.p1Bingos.concat(p1NewBingos);

      return nextState
    }

    default:
      return state;
  }
}