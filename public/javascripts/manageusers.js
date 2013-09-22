$(document).ready(function(){
	$("td[data-userid]").each(function(){
		var userid = $(this).data("userid")
		if (userid != '') {
			$(this).click(function(){
				$(this).children('span').wrap(function(){
					return "<button type='button' class='btn btn-danger btn-block btn-xs'>" + $(this).html() + "OK? </button>";
				});
				$(this).click(function(){
					var element = $(this)
					utils.issue("/user", JSON.stringify({user_id:userid}), "DELETE", function(err,stat,text){
						console.log(err,stat,text);
						if (stat == 200) {
							element.parents('tr').each(function(){
								$(this).poof()
							});
						} else if (stat == 403) {
							element.empty().html("<span class='text-danger'>Denied!</span>").unbind()
						} else {
							element.empty().html("<span class='text-danger'>Error!</span>").unbind()
						}
					});
				});
			});
		}
	});
	$("button[data-userid]").each(function(){
		var elem = $(this);
		var user_id = $(this).data("userid")
		var action = $(this).data("action")
		elem.click(function(){
			var send_obj = {
				user_id: user_id
			};
			var value_element;
			if (action == "permissions"){
				value_element = $("select[data-userid$="+user_id+"]")
			} else if (action == "password") {
				value_element = $("input[data-userid$="+user_id+"]")
			}
			send_obj[action] = value_element.val()
			utils.issue("/user/"+action, JSON.stringify(send_obj), "PUT", function (err,stat, text){
				if (stat == 200) {
					elem.addClass("btn-success")
					if (action == "password") value_element.val("");
					setTimeout(function(){
						elem.removeClass("btn-success")
					},1500)
				} else if (stat == 403) {
					elem.parent().empty().html("<span class='text-danger'>Denied!</span>").unbind()
				} else {
					elem.parent().empty().html("<span class='text-danger'>Error!</span>").unbind()
				}
			});
		});
	});
	$("#new_user").click(function(){
		var elem = $(this);
		var send_obj = {
			name: $("#new_user_name").val(),
			pass: $("#new_user_pass").val(),
			permissions: $("#new_user_perm").val()
		}
		utils.issue("/user/", JSON.stringify(send_obj), "POST", function(err,stat,text){
			if (stat == 200){
				location.reload()
			} else if (stat == 403) {
				elem.parent().empty().html("<span class='text-danger'>Denied!</span>");
			} else {
				elem.parent().empty().html("<span class='text-danger'>Error!</span>");
			}
		})
	})
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

