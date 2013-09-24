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

 // ========== Custom Bindings ==========

 ko.bindingHandlers.hideTitle = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    	$(element).click(function(){
    		var value = valueAccessor();
        	value() ? value(false) : value(true);
    	});
    	$(element).hover(
    		function(){
    			$(this).children('p').text(' Display Title')
    		},
    		function(){
    			$(this).children('p').text('');
    		}
    	)
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor();
        console.log(value());

        if (value() == false){
        	$(element).attr('title','Title not hidden')
        	.addClass("btn-primary")
        	.removeClass("btn-danger")
        	.children('span')
        		.removeClass("glyphicon glyphicon-ban-circle")
        		.addClass("glyphicon glyphicon-ok")
        } else {
        	$(element).attr('title','Title will be hidden')
        	.addClass("btn-danger")
        	.removeClass("btn-primary")
        	.children('span')
        		.removeClass("glyphicon glyphicon-ok")
        		.addClass("glyphicon glyphicon-ban-circle")
        }
    }
 }
 ko.bindingHandlers._selectCat = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    	var value = valueAccessor()
    	$(element).click(function(){
    		value($(this).text())
    	});
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor();
        if (value() == $(element).text()){
        	$(element).removeClass('label-info').addClass('label-success')
        } else {
    		$(element).removeClass('label-success').addClass('label-info')
        }  
    }
 }
 ko.bindingHandlers.markdown = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    	var value = valueAccessor();
    	$(element).data("focus",false)
    	$(element).focus(function(){
    		$(element).data("focus",true)
    	});
		$(element).blur(function(){
			$(element).data("focus",false)
    		value(element.innerText)
    	});
		$(element).on('keydown',function(){
    		value(element.innerText)
    	});
    	$(element).on('keydown',function(e){
    		if (e.keyCode == 9){
    			console.log('tab')
    			e.preventDefault();
    			var sel, range, html;
			    if (window.getSelection) {
			        sel = window.getSelection();
			        if (sel.getRangeAt && sel.rangeCount) {
			            range = sel.getRangeAt(0);
			            range.deleteContents();
			            range.insertNode( document.createTextNode("    ") );
			        }
			    } else if (document.selection && document.selection.createRange) {
			        document.selection.createRange().text = "    ";
			    }
    		}
    	})
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor();
        if ($(element).data("focus") == false && value()){
        	element.innerText = value();
        }
    }
 }
  ko.bindingHandlers.pushEnter = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    	var value = valueAccessor();
    	$(element).on('keydown',function(e){
    		if (e.keyCode == 13){
    			e.preventDefault();
    			value();
    			$(element).empty();
    		}
    	})
    	$(element).focus(function(){
        	$(element).empty();
        })
        $(element).blur(function(){
        	$(element).text($(element).data('refresh'));
        })
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        
    }
 }
 ko.bindingHandlers.showParams = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor();
        if (value()){
        	
        	$(element).addClass('open')
        } else {
        	$(element).removeClass('open')
        }
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

 	self.article = {
 		_id: null,
 		title : ko.observable(''),
 		url : ko.observable(''),
 		publishDate : ko.observable(),
 		content : ko.observable(),
 		tags : ko.observableArray([]),
 		category : ko.observable(),
 		hideTitle : ko.observable(false),
 		previewtext : ko.observable(),
 		headerTags : ko.observable(),
 		destination : ko.observable('Select'),
 		css : ko.observableArray([]),
	 }

	self.alert = ko.observableArray([]);
	self.dragElement = ko.observable(null);

	self.getFile = function(title){
		utils.issue('/article/'+title+'?json=true',null,"GET",function(err,stat,text){
			if (err || stat != 200){
				self.alert.push(new alert('error','Error!','Failed to load '+me.title))
			} else {
				var parsed = JSON.parse(text)

				self.article.title(parsed.title)
				self.article.url(parsed.url)
				self.article.publishDate(parsed.publishDate)

				self.article.content(parsed.content);

				self.article.tags.removeAll();
				$(parsed.tags).each(function(ind,obj){
					self.article.tags.push(obj)
				})

				self.article.category(parsed.category)
				self.article.hideTitle(parsed.hideTitle)
				self.article.previewtext(parsed.previewtext)
				self.article.headerTags(parsed.headerTags)
				self.article.destination(parsed.destination)
				self.article._id = (parsed._id);

				ko.utils.arrayForEach(self.cssFiles(), function(file) {
					file.selected(false) 
					$(parsed.css).each(function(){
						if (this.file == file.title){
							file.selected(true)
						}
					})
				});
				utils.fitToContent($('textarea'),10000)
				//$("#articledraft").sortable();
				//$( "#sortable" ).disableSelection();
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
