$(document).ready(function(){
	$("td[data-filename]").each(function(){
		var filename = $(this).data("filename")
		if (filename != '') {
			$(this).click(function(){
				$(this).children('span').wrap(function(){
					return "<button type='button' class='btn btn-danger btn-block btn-xs'>" + $(this).html() + "OK? </button>";
				});
				$(this).click(function(){
					var element = $(this)
					utils.issue("/article", JSON.stringify({_id:filename}), "DELETE", function(err,stat,text){
						console.log(err,stat,text);
						if (stat == 200) {
							element.parents('tr').each(function(){
								$(this).poof()
							});
						} else if (stat == 403) {
							element.empty().html("<span class='text-danger'>Denied!</span>").unbind()
						} else {
							element.empty().html("<span class='text-danger'>Denied!</span>").unbind()
						}
					});
				});
			});
		}
	});
});
$(function(){
    $.fn.poof = function(){
      console.log('poofing started')
      var elem = this;
        elem.fadeTo(200,0,function(){
        	setTimeout(function(){
        		elem.remove();
        	},500)
        });
    }
});

