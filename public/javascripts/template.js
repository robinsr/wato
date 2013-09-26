 function alert(type,title,message){
 	this.type = type;
 	this.title = title;
 	this.message = message;
 }

function AppViewModel(){
	var self = this;

	self.template = {
		content: ko.observable(),
		filename: ko.observable(),
		previewFile: ko.observable()
	}
	self.alert = ko.observableArray([]);
	self.showParams = ko.observable(false);
 	self.clickShowParams = function(){
 		if (self.showParams()){
 			self.showParams(false);
 		} else {
 			self.showParams(true);
 		}
 	}
 	self.showHints = ko.observable(false);
 	self.clickShowHints = function(){
 		if (self.showHints()){
 			self.showHints(false);
 		} else {
 			self.showHints(true);
 		}
 	}

	self.getFile = function(title){
		utils.issue('/template/'+title,null,"GET",function(err,stat,text){
			if (err || stat != 200){
				self.alert.push(new alert('error','Error!','Failed to load '+title))
			} else {
				self.template.filename(title);
				self.template.content(text)
			}
		})
	}
	self.save = function(){
		utils.issue("/template/", ko.toJSON(self.template), "POST", function (err,stat,text){
			if (err || stat != 200){
				self.alert.push(new alert('error','Error!',text))
			} else {
				self.alert.push(new alert('success','Success!','File Saved Successfully'))
				self.article._id = text;
			}
		})
	}
	self.preview = function(){
		utils.issue("/template/", ko.toJSON(self.template), "PUT", function (err,stat,text){
			if (err || stat != 200){
				self.alert.push(new alert('error','Error!','There was a problem generating your preview'))
			} else {
				window.open('/__template?previewFile='+self.template.previewFile());
			}
		})
	}
	self.dismiss = function(me){
		self.alert.remove(me);
	}

}

var wato = { viewmodel: new AppViewModel()};

$(document).ready(function(){
	if (window.location.search) {
		var query = window.location.search.replace('?','');
		var parts = query.split('&');
		var queryObject = {};
		for (i=0;i<parts.length;i++){
			var keyValue = parts[i].split('=');
			queryObject[keyValue[0]] = keyValue[1]
		}
		if (queryObject.file){
			wato.viewmodel.getFile(queryObject.file)
		}
		ko.applyBindings(wato.viewmodel);
	} else {
		ko.applyBindings(wato.viewmodel);
	}
});