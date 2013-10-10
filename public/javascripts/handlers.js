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
    		if (e.keyCode == 9 && $(element).data('enableTab') == true){
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