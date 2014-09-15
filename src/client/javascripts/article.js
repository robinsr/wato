/*
 *  article.js 
 *  Ryan Robinson
 *  ryan.b.robinson@gmail.com
 *
 */


 // object representing a file; used for makeing dropdowns
 function file(title,type,selected){
 	this.title = title;
 	this.type = type;
 	this.selected = ko.observable(selected);
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

 function Article(opt){
 	var self = this;

 	self.title = ko.observable('pooop');
 }

var articleMap = {
	create: function(opt){
		console.log('creating')
		return new Article(opt.data)
	}
}


 function AppViewModel(){
 	var self = this;
 	self.modified = ko.observable(true);
 	self.previousCategories = ko.observableArray([])
 	self.showParams = ko.observable(false);
 	self.clickShowParams = function(){
 		if (self.showParams()){
 			self.showParams(false);
 		} else {
 			self.showParams(true);
 		}
 	}

 	// self.article = {
 	// 	_id: null,
 	// 	title : ko.observable(''),
 	// 	url : ko.observable(''),
 	// 	publishDate : ko.observable(),
 	// 	content : ko.observable(),
 	// 	tags : ko.observableArray([]),
 	// 	category : ko.observable(),
 	// 	hideTitle : ko.observable(false),
 	// 	previewtext : ko.observable(),
 	// 	headerTags : ko.observable(),
 	// 	destination : ko.observable('Select'),
 	// 	css : ko.observableArray([]),
	 // }

	self.article = ko.mapping.fromJS({});

	self.alert = ko.observableArray([]);
	self.dragElement = ko.observable(null);

	self.getFile = function(title){
		utils.issue('/article/'+title+'?json=true',null,"GET",function(err,stat,text){
			if (err || stat != 200){
				self.alert.push(new alert('error','Error!','Failed to load '+me.title))
			} else {
				var parsed = JSON.parse(text)

				// self.article.title(parsed.title)
				// self.article.url(parsed.url)
				// self.article.publishDate(parsed.publishDate)

				// self.article.content(parsed.content);

				// self.article.tags.removeAll();
				// $(parsed.tags).each(function(ind,obj){
				// 	self.article.tags.push(obj)
				// })

				// self.article.category(parsed.category)
				// self.article.hideTitle(parsed.hideTitle)
				// self.article.previewtext(parsed.previewtext)
				// self.article.headerTags(parsed.headerTags)
				// self.article.destination(parsed.destination)
				// self.article._id = (parsed._id);

				// ko.utils.arrayForEach(self.cssFiles(), function(file) {
				// 	file.selected(false) 
				// 	$(parsed.css).each(function(){
				// 		if (this.file == file.title){
				// 			file.selected(true)
				// 		}
				// 	})
				// });
				ko.mapping.fromJS(parsed, articleMap, self.article);
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
		//self.findFooters();
		//self.findHeaders();
	}

	// =================================
	// UI controls - respond to user clicks and such

	self.newTag = ko.observable();
	self.deleteTag = function(element){
		self.article.tags.remove(element);
	}
	self.addTag = function(){
		self.article.tags.push(self.newTag())
		self.newTag('');
	}

	self.newCat = ko.observable();
	self.deleteCat = function(element){
		self.article.categories.remove(element);
	}
	self.addCat = function(){
		self.previousCategories.push(self.newCat())
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
		self.article._id = null;
		self.article.title('New Article');
		self.article.url('');
		self.article.publishDate();
		self.article.content();
		self.article.tags([]);
		self.article.category();
		self.article.hideTitle(false);
		self.article.previewtext('');
		self.article.headerTags('');
		self.article.destination('Select');
		self.article.css([]);
		self.article.writeAccess(0);
	}
	self.exportFile = function(){}
	self.preview = function(){
		self.findIncludedFiles();
		utils.issue("/article",ko.toJSON(self.article),"PUT", function(err,stat,text){
			if (err || stat != 200){
				self.alert.push(new alert('error','Error!','There was a problem generating your preview'))
			} else {
				window.open('/article/__preview');
			}
		})
	}
	self.save = function(){
		self.findIncludedFiles();
		if (self.article.css().length == 0){
			self.alert.push(new alert('warning','Warning!','You did not include any CSS files'))
		} else if (self.article.destination() == '' || typeof self.article.destination() == 'Select '){
			self.alert.push(new alert('warning','Warning!','Please select a save destination'))
		} else {
			console.log(ko.toJS(self.article))
			utils.issue('/article',ko.toJSON(self.article),"POST", function(err,stat,text){
				if (err || stat != 200){
					self.alert.push(new alert('error','Error!',text))
				} else {
					self.alert.push(new alert('success','Success!','File Saved Successfully'))
					self.article._id = text;
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
	})
	$(_templates).each(function(ind, obj){
		wato.viewmodel.templates.push(new file(obj,'template',false))
	})
	$(_category).each(function(ind, obj){
		wato.viewmodel.previousCategories.push(obj)
	})
	$('.dropdown-menu').click(function(event){
      if($(this).hasClass('keep-open')){
       event.stopPropagation();
     }
   });
});