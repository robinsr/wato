


function rssfeedsetup(){
var feedurl="http://feeds.feedburner.com/nettuts";
var feedlimit=5;
var feedpointer=new google.feeds.Feed(feedurl); //Google Feed API method
feedpointer.setNumEntries(feedlimit); //Google Feed API method
feedpointer.load(displayfeed); //Google Feed API method
}

function displayfeed(result){
var feedcontainer=document.getElementById("feeddiv");
var rssoutput="<h2>Latest from nettuts</h2><ul>";
	if (!result.error){
		var thefeeds=result.feed.entries;
		for (var i=0; i<thefeeds.length; i++){
			rssoutput+="<li><a href='" + thefeeds[i].link + "'>" + thefeeds[i].title + "</a></li><li class='feed_desc'>" + thefeeds[i].contentSnippet + "</li>";
			}
		rssoutput+="</ul>";
		feedcontainer.innerHTML=rssoutput;
	
	}else{
	alert("Error fetching feeds!")
	}
}