define(function (require) {
  var $ = require('jquery');

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
                headers: {
                  'csrf-token': _csrf
                },
                error: function (ev, status) {
                  cb(ev.getResponseHeader('error-message'), status, null);
                },
                success: function (data, status, ev) {
                  cb(null, status, data);
                  return
                }
              });
            } else {
              $.ajax({
                url: url,
                type: method,
                headers: {
                  'csrf-token': _csrf
                },
                contentType: 'application/json',
                data: Json,
                error: function (ev, status) {
                  cb(ev.getResponseHeader('error-message'), status, null);
                },
                success: function (data, status, ev) {
                  cb(null, status, data);
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
                      text.style.height = (adjustedHeight+25) + "px";
              }
          }
      },
      getQueryParams: function (qs) {
          qs = qs.split("+").join(" ");

          var params = {}, tokens,
              re = /[?&]?([^=]+)=([^&]*)/g;

          while (tokens = re.exec(qs)) {
              params[decodeURIComponent(tokens[1])]
                  = decodeURIComponent(tokens[2]);
          }

          return params;
      }
    }
  })();

  return utils;
});
