// =============  Custom jQuery shake animation =================

$(function(){
    $.fn.shake = function(){
        this.animate({
            marginLeft: '-6px'
        }, 30, function (el) {
            $(this).animate({
                marginLeft: '6px'
            }, 30, function (el) {
                $(this).animate({
                    marginLeft: '0'
                }, 30)
            });
        });
    }
});


// ===========  Utils module =============
var utils = (function(){
  return {
          // issues all ajax calls to server
      issue : function (url, Json, method, cb) {
          var error = null;
          if (Json == null){
            // request is a get
            $.ajax({
              url: url,
              type: method,
              error: function(dat){
                error = true;
              },
              complete: function(dat){
                cb(error,dat.status,dat.responseText);
                return
              }
            });
          } else {
            $.ajax({
              url: url,
              type: method,
		          contentType: 'application/json',
              data: Json,
              error: function(dat){
                error = true;
              },
              complete: function(dat){
                cb(error,dat.status,dat.responseText);
              }
            }); 
          }   
      },
      fitToContent:function(inp, maxHeight){
        for(i=0;i<inp.length;i++){    
            var text = inp[i] && inp[i].style ? inp[i] : document.getElementById(inp[i]);
            if ( !text ) return;
    
            /* Accounts for rows being deleted, pixel value may need adjusting */
            if (text.clientHeight == text.scrollHeight) {
                text.style.height = "30px";
            }       

            var adjustedHeight = text.clientHeight;
            if ( !maxHeight || maxHeight > adjustedHeight ) {
                adjustedHeight = Math.max(text.scrollHeight, adjustedHeight);
                if ( maxHeight )
                    adjustedHeight = Math.min(maxHeight, adjustedHeight);
                if ( adjustedHeight > text.clientHeight )
                    text.style.height = adjustedHeight + "px";
            }
        }
    },
  }
})();
