export const loginChangeAction = (status) => ({
  type: 'CHANGE_STATUS',
  status,
})

export const LogoutAction = () => ({
	type: 'LOGOUT'
})

export const loginAsyncAction = (values) => {
	return (dispath) => {
		return fetch('http://127.0.0.1:3000/login', {
	        method: "POST",
	        headers: {
		      'Accept': 'application/json' 
		    },
	        body: JSON.stringify({
	          "role": "administrator",
	          "statusCode": 200,
	          ...values
	        })
	    }).then(res => {
	    	dispath(loginChangeAction("success"));
	        return res.json()
	    })
	}
}