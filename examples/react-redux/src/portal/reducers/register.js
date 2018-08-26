const initalState = {
	status: "success"
}

const registerReducer = (state = initalState, action) => {
  switch (action.type) {
    case 'CHANGE_STATUS':
      return action.status
    default:
      return state
  }
}

export default registerReducer