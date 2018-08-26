import React from 'react';
import ReactDOM from 'react-dom';
import styles from "./index.less";

class AppContainer extends React.Component{
	render(){
		return(
			<div className={styles.div}>
				app container</div>	
			</div>
		)
	}
}

ReactDOM.render(<AppContainer />, document.getElementById('root'));
