function Param(_){
	this.name = this.attribute('name');
	this.value = getParam('value', String(this.html()));
	this.html('');
}