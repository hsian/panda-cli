const initalState = {
	username: "",
  role: "anonyous"
}

const userReducer = (state = initalState, action) => {
  switch (action.type) {
    case 'SET_USER':
    	const user = action.status || {};
      return {
      	...initalState,
      	...user
      }
    default:
      return state
  }
}

export default userReducer