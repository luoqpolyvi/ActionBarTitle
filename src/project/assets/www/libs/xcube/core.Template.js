function Template(_){
	
	this.get = function(name, param){
		return this.named(name).clone(true).attachData(param);
	}
	
		
}