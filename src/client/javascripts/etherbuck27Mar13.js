var mypage = {
	ajaxFunction:function(){
        var xmlhttp; 
        try { xmlhttp = new XMLHttpRequest();}
        catch (e) {
            try { xmlhttp = new ActiveXObject("Msxml2.XMLHTTP"); }
            catch (e) {
                try { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); }
                catch (e) { console.log('no ajax?'); return false; }
            }
        }
        return xmlhttp;
    },
    loaded:null,
    get:function(code,article){
      var newcontent;
      var url;
      var switcher = document.getElementById("switcher");
      if(mypage.loaded == null){
         url = code;
         mypage.loaded = true;
         switcher.innerHTML = 'Back to article';
      } else {
         url = article;
         mypage.loaded = null;
         switcher.innerHTML = 'Full Code';
      }
      var xmlhttp = mypage.ajaxFunction();
      xmlhttp.open("GET", url, true);
      xmlhttp.send();
      xmlhttp.onreadystatechange = function(){
         if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)){
            newcontent = xmlhttp.responseText; 
            mypage.makeswitch(newcontent);
         }
      }
   },
   makeswitch:function(stuffs){
      var dummy = document.createElement('div');
      dummy.innerHTML = stuffs;
      var code = dummy.getElementsByTagName('article')[1];
      var target = document.getElementsByTagName("article")[1];
      target.innerHTML = '';
      target.appendChild(code);
      prettyPrint();
   },
   changeCSSRule:function(oldElement, newElement){
        oldElement=oldElement.toLowerCase();
        var allCSSinOneFile = [];
        if (document.styleSheets){
            for (var i=0; i<document.styleSheets.length; i++){
                var mystylesheet = document.styleSheets[i];
                var ii = 0;
                var cssRule = false;
                do {
                    //console.log('iterating over '+mystylesheet.href);
                    cssRule = mystylesheet.cssRules[ii];
                    
                    if (cssRule && cssRule.selectorText) {
                        if (cssRule.selectorText.toLowerCase() == oldElement){
                            cssRule.selectorText = newElement;
                        }
                    }
                    ii++;
                } while (cssRule);
            }
            return allCSSinOneFile;  
        } else {
            console.log('I cannot play with stylesheets');
        }
   },
   
   sessionCheck:function(){
      if (sessionStorage){
        var key = localStorage.getItem("WATOKEY");
        if (key){
          console.log("found session key!, "+key);
          var xmlhttp = mypage.ajaxFunction();
          xmlhttp.open("POST", "/api/testSession", true);
          xmlhttp.send(key);
          xmlhttp.onreadystatechange = function(){
            if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)){
              var head = document.querySelector('head');
              var newSheet = document.createElement('link');
              newSheet.setAttribute("type","text/css");
              newSheet.setAttribute("rel","stylesheet");
              newSheet.setAttribute("href","/resources/CSS/live_edit.css");

              head.appendChild(newSheet);

              var newScripts = ['/resources/_JS/base64.js','/resources/_JS/live_edit.js','http://d1n0x3qji82z53.cloudfront.net/src-min-noconflict/ace.js']

              for (var i = newScripts.length - 1; i >= 0; i--) {
                var ns = document.createElement('script');
                ns.setAttribute("type","text/javascript");
                ns.setAttribute("src",newScripts[i]);
                head.appendChild(ns);
              };

              var bod = document.querySelector('body');
             
              var div = document.createElement('div');
              div.id = 'slidetable';
              div.style.width = window.innerWidth+'px';
              div.style.height = window.innerHeight+'px';
              div.style.overflow = 'scroll';
              
              //div.style.cssText = document.defaultView.getComputedStyle(bod, "").cssText;
              
              mypage.changeCSSRule('body','#slidetable');

              while(document.body.firstChild){
                  div.appendChild(document.body.firstChild);
              }
              var bg = document.createElement('div');
              bg.className = "backboard";
              //bg.style.height = window.innerHeight+'px';
              //bg.style.overflow = 'hidden';
              var edit = document.createElement('div');
              edit.id = "live_edit_space";
              edit.innerHTML = xmlhttp.responseText
              //edit.style.height = window.innerHeight+'px';
              
              bg.appendChild(edit);
              bg.appendChild(div);
              document.body.appendChild(bg);
              
              var slidebutton = document.createElement('button');
              slidebutton.id = 'EnableLiveEditButton';
              slidebutton.setAttribute("onclick","mypage.slidethetable();");
              document.body.appendChild(slidebutton);


            }
          }
        } else {
              console.log("no key found");
        }
      } 
    },
    slidethetable:function(){
        var sliders = document.querySelector('body');
        sliders.classList.toggle("live_controls_enabled");
    }
}

