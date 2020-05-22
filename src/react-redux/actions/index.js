export const addAction = (num)=> {
  return {
    type: 'ADD_NUM',
    payload: {
      num
    }
  }
}

export const reduceAction=(num)=> {
  return {
    type: 'REDUCE_NUM',
    payload: {
      num
    }
  }
}