const initalState = {
	status: "defalut",
	submitting: false
}

const loginReducer = (state = initalState, action) => {
  switch (action.type) {
    case 'CHANGE_STATUS':
      return {
      	...initalState,
      	...action.status
      }
    default:
      return state
  }
}

export default loginReducer