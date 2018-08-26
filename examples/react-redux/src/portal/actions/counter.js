export const increment = () => ({
  type: 'INCREMENT',
})

export const decrement = () => ({
  type: 'DECREMENT',
})

export const incrementAyncAction = () => {
	return (dispatch) => {
		return fetch("http://localhost:3000/posts/1").then(data => {
			return data.text()
		}).then( data => {
			console.log(data)
		})
	}
}
