import bingo, { p1Check, start } from './bingo';

it('bingo', () => {

  // test
  const p1Map = [
    [{value: 1, checked:false, y:0, x:0}, {value: 2, checked:false, y:0, x:1}],
    [{value: 3, checked:false, y:1, x:0}, {value: 4, checked:false, y:1, x:1}]
  ];

  const p2Map = [
    [{value: 4, checked:false, y:0, x:0}, {value: 3, checked:false, y:0, x:1}],
    [{value: 2, checked:false, y:1, x:0}, {value: 1, checked:false, y:1, x:1}]
  ];

  let state = bingo(undefined, {type: 'INIT'});
  // console.log(JSON.stringify(state, null, 2));

  state = bingo(state, start({p1Map, p2Map}));
  // console.log(JSON.stringify(state, null, 2));

  state = bingo(state, p1Check({x: 0, y: 0}));
  // console.log(JSON.stringify(state, null, 2));

  state = bingo(state, p1Check({x: 1, y: 1}));

  expect(state.p1Bingos.length).toBe(1);
  expect(state.p2Bingos.length).toBe(1);

});
