$(document).ready(function(){
	$("#demo").click(function(){
		console.log('poop')
		$("#name").val('demo')
		$("#pass").val('demo')
		$("#form").submit()
	});
});