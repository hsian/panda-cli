class Permission{
	ANONYOUS = 1
    MEMBER = 2
    ADMINISTER = 4

    roles = {
    	anonyous: [this.ANONYOUS],
    	member: [this.ANONYOUS, this.MENBER],
    	administrator: [this.ANONYOUS, this.MEMBER, this.ADMINISTER]
    }

    hasPermiss(user, perm){
    	const role = user.role;
    	let userPerm;
    	if(this.roles[role]){
    		userPerm = this.roles[role].reduce((last, r) => {
    			return last + r
    		}, 0);
    	}else{
    		return false;
    	}
    	return (userPerm & perm) == perm
    }

    isAdmin(user){
    	return this.hasPermiss(user, this.ADMINISTER)
    }
}
    
export default new Permission();
