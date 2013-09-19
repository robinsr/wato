/*
 *  article.js 
 *  Ryan Robinson
 *  ryan.b.robinson@gmail.com
 *
 */

 if (Modernizr.draganddrop) {
 	console.log('drag drop yes')
 } else {
 	console.log('drag drop no')
 }

 // object representing a file; used for makeing dropdowns
 function file(title,type,selected){
 	this.title = title;
 	this.type = type;
 	this.selected = ko.observable(selected);
 }

 // object for category or tag 
 function catTag(name){
 	this.name = name;
 }

 // object for piece of content
 function contentBlock(type,order,text){
 	var self = this;
 	this.type = type ? ko.observable(type) : ko.observable('p');
 	this.order = ko.observable(order);
 	this.text = text ? ko.observable(text) : ko.observable();
 }

 function alert(type,title,message){
 	this.type = type;
 	this.title = title;
 	this.message = message;
 }

 function AppViewModel(){
 	var self = this;

 	self.article = {
 		title : ko.observable('New Article'),
 		url : ko.observable(''),
 		publishDate : ko.observable(new Date()),
 		content : ko.observableArray([]),
 		tags : ko.observableArray([]),
 		category : ko.observable(),
 		hideTitle : ko.observable(false),
 		previewtext : ko.observable(''),
 		headerTags : ko.observable(''),
 		selectedDestination : ko.observable(''),
 		css : ko.observableArray([]),
 		header : ko.observableArray([]),
 		footer : ko.observableArray([]),

	 	// write access specifies basic permissions

	 	writeAccess : ko.observable(0)
	 }

	self.alert = ko.observableArray([]);
	self.dragElement = ko.observable(null);

	self.getFile = function(title){
		console.log(title);
		utils.issue('/article/'+title+'?json=true',null,function(err,stat,text){
			console.log(err,stat,text);
			if (err || stat != 200){
				self.alert.push(new alert('error','Error!','Failed to load '+me.title))
			} else {
				var parsed = JSON.parse(text)

				self.article.title(parsed.title)
				self.article.url(parsed.url)
				self.article.publishDate(parsed.publishDate)

				self.article.content.removeAll();
				$(parsed.content).each(function(index){
					self.article.content.push(new contentBlock(this.type,index,this.text))
				})

				self.article.tags.removeAll();
				$(parsed.tags).each(function(){
					if ($.type(this) == 'object'){
						self.article.tags.push(new catTag(this.name))
					} else if ($.type(this) == 'string'){
						self.article.tags.push(new catTag(this))
					}
				})

				self.article.category(parsed.category)
				self.article.hideTitle(parsed.hideTitle)
				self.article.previewtext(parsed.previewtext)
				self.article.headerTags(parsed.headerTags)
				self.article.selectedDestination(parsed.selectedDestination)
				self.article.writeAccess(parsed.writeAccess);

				ko.utils.arrayForEach(self.cssFiles(), function(file) {
					file.selected(false) 
					$(parsed.css).each(function(){
						if (this.file == file.title){
							file.selected(true)
						}
					})
				});
				ko.utils.arrayForEach(self.headerFiles(), function(file) {
					file.selected(false) 
					$(parsed.header).each(function(){
						if (this.file == file.title){
							file.selected(true)
						}
					})
				});
				ko.utils.arrayForEach(self.footerFiles(), function(file) {
					file.selected(false) 
					$(parsed.footer).each(function(){
						if (this.file == file.title){
							file.selected(true)
						}
					})
				});
				utils.fitToContent($('textarea'),10000)
				$("#articledraft").sortable();
				$( "#sortable" ).disableSelection();
			}
		})
}

	// =================================
	// Controls for the menu lists - finds selected files and adds to article model

	self.findCss = function(){
		self.article.css.removeAll();
		ko.utils.arrayForEach(self.cssFiles(), function (file) {
			if (file.selected() == true) {
				self.article.css.push({file:file.title})
			}
		})
	}
	self.findHeaders = function(){
		self.article.header.removeAll();
		ko.utils.arrayForEach(self.headerFiles(), function (file) {
			if (file.selected() == true) {
				self.article.header.push({file:file.title})
			}
		})
	}
	self.findFooters = function(){
		self.article.footer.removeAll();
		ko.utils.arrayForEach(self.footerFiles(), function (file) {
			if (file.selected() == true) {
				self.article.footer.push({file:file.title})
			}
		})
	}
	self.findIncludedFiles = function(){
		self.findCss();
		self.findFooters();
		self.findHeaders();
	}

	// =================================
	// UI controls - respond to user clicks and such

	self.newTag = ko.observable();
	self.deleteTag = function(element){
		self.article.tags.remove(element);
		console.log(element);
	}
	self.addTag = function(){
		self.article.tags.push(new catTag(self.newTag()))
		self.newTag('');
	}

	self.newCat = ko.observable();
	self.deleteCat = function(element){
		self.article.categories.remove(element);
	}
	self.addCat = function(){
		self.article.categories.push(new catTag(self.newCat()))
		self.newCat('');
	}

	self.newParagraph = function(){
		self.article.content.push(new contentBlock('p',null,null))
	}
	self.newCode = function(){
		self.article.content.push(new contentBlock('pre',null,null))
	}
	self.newHeading = function(){
		self.article.content.push(new contentBlock('h2',null,null))
	}
	self.newHtml = function(){
		self.article.content.push(new contentBlock('HTML',null,null))
	}
	self.newPicture = function(){

	}
	self.pop = function(me){
		self.article.content.splice(self.article.content.indexOf(me),1)
	}
	self.clone = function(me){
		self.article.content.splice(self.article.content.indexOf(me),0,me);
		utils.fitToContent();
	}
	self.dismiss = function(me){
		console.log(me);
		self.alert.remove(me);
	}

	// =================================
	// UI Animations

	self.showContent = function(elem){
		if (elem.nodeType === 1) $(elem).hide().slideDown()
	}
	self.hideContent = function(elem){
		if (elem.nodeType === 1) $(elem).slideUp(function() { $(elem).remove(); })
	}

	// =================================
	// Drag and drop handler

	self.reorderModel = function(movingElementIndex,destinationIndex){
		self.article.content.splice(destinationIndex,0,self.article.content.splice(movingElementIndex,1)[0]);
		utils.fitToContent($('textarea'),10000);

		var count = 0;
		ko.utils.arrayForEach(self.article.content(),function(piece){
			piece.order(count);
			count++
			return
		});

	}

	// =================================
	// document options

	self.newDocument = function(){
		self.article.title('New Article');
		self.article.url('');
		self.article.publishDate(new Date());
		self.article.content([]);
		self.article.tags([]);
		self.article.categories([]);
		self.article.hideTitle(false);
		self.article.previewtext('');
		self.article.headerTags('');
		self.article.selectedDestination('');
		self.article.css([]);
		self.article.header([]);
		self.article.footer([]);
		self.article.writeAccess(0);
	}
	self.exportFile = function(){}
	self.preview = function(){
		self.findIncludedFiles();
		utils.issue("/auth/quickpreview",ko.toJSON(self.article),function(err,stat,text){
			if (err || stat != 200){
				self.alert.push(new alert('error','Error!','There was a problem generating your preview'))
			} else {
				window.open('/auth/preview.html');
			}
		})
	}
	self.save = function(){
		self.findIncludedFiles();
		if (self.article.css().length == 0){
			self.alert.push(new alert('','Warning!','You did not include and CSS files'))
		} else if (self.article.selectedDestination() == '' || typeof self.article.selectedDestination() == 'undefined'){
			self.alert.push(new alert('','Warning!','Please select a save destination'))
		} else {
			utils.issue('/auth/article',ko.toJSON(self.article),function(err,stat,text){
				if (err || stat != 200){
					self.alert.push(new alert('error','Error!',text))
				} else {
					self.alert.push(new alert('success','Success!',text))
				}
			})
		}
	}
	self.uploadImage = function(){}

	self.pressEnter = function(event){
		console.log(event.target)
	}

	// =================================
	// modal status controls visible modal

	self.modalStatus = ko.observable();
	self.closeModal = function(){
		self.modalStatus('');
	}
	self.showSettings = function(){
		self.modalStatus('settings')
	}
	self.showRequests = function(){
		self.modalStatus('requests')
	}
	self.showDebug = function(){
		self.modalStatus('debug')
	}

	// =================================
	// useful bits

	self.cssFiles = ko.observableArray([]);
	self.templates = ko.observableArray([])
	self.dragActive = ko.observable(true);

	var directories = {
		'Articles':'jsondocs',
		'Drafts':'drafts',
		'Landing Pages':'landingpages',
		'Error Pages':'errorpages'
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
	$(_cssFiles).each(function(ind, obj){
	wato.viewmodel.cssFiles.push(new file(obj,'css',false))
	$(_templates).each(function(ind, obj){
	wato.viewmodel.templates.push(new file(obj,'css',false))
})
})
});
