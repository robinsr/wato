define(function (require) {
  var $ = require('jquery');
  var ko = require('ko');
  var codeMirror = require('codemirror!jade|markdown|css');

  ko.bindingHandlers.codeMirror = {
    init: function(elem, val) {
      var value = val();
      var $elem = $(elem);
      var initialValue = $elem.text();
      $elem.empty();

      value(initialValue);

      var codeArea = new codeMirror(elem, {
        value: initialValue,
        mode: $elem.data('code-mirror-mode'),
        lineNumbers: true,
        lineWrapping: true,
        viewportMargin: Infinity
      });

      codeArea.on('focus', function () {
        $elem.data("focus", true);
      })

      codeArea.on('blur', function (ev) {
        $elem.data("focus", false);
        value(ev.doc.getValue());
      });

      codeArea.on('keydown', function (ev) {
        value(ev.doc.getValue())
      });

      value.subscribe(function (val) {
        if ($elem.data('focus')) return;
        codeArea.doc.setValue(val)
      });

      codeArea.refresh();
    }
  }

  ko.bindingHandlers.deleteUser = {
    init: function (elem, val, all, vm, root) {
      var user = val();
      $(elem).click(function () {
        var confirmButton = $("<button type='button' class='btn btn-danger btn-block btn-sm'>OK?</button>");
        
        confirmButton.on('click', function () {
          user.deleteUser(function (err, status, text) {
            if (err) {
              return alert('There was a problem deleting this user');
            }
            root.$root.users.remove(vm);
          });
        });

        $(elem).children('span').replaceWith(confirmButton);
      });
    }
  }

  ko.bindingHandlers.saveUser = {
    init: function (elem, val, all, vm, root) {
      var user = val();
      $(elem).click(function () {
        user.save(function (err, status, text) {
          if (err) {
            return alert('There was a problem deleting this user');
          }
          
          if (status === 400) {
            return alert('You do not have sufficient permissions to make this change');
          }

          alert('User updated');
        });
      });
    }
  }

  ko.bindingHandlers.notificationType = {
    update: function (elem, val) {
      var type = val();

      var map = {
        'error': 'alert-danger',
        'warning': 'alert-warning',
        'success': 'alert-success' 
      }

      $(elem).addClass(map[type]);
    }
  }

  ko.bindingHandlers.contentEditable = {
    init: function(elem, val) {
      var value = val();

      // set initial state of the focus
      $(elem).data("focus",false);

      // toggle data-focus
      $(elem).focus(function(){
        $(elem).data("focus",true);
      });
      $(elem).blur(function(){
        $(elem).data("focus",false);
        // on blur, copy value to viewmodel
        value(elem.innerText);
      });

      // on keydown, copy value to viewmodel
      $(elem).on('keydown',function(){
        value(elem.innerText)
      });

      // shim for 'tab' key (would lose focus otherwise)
      $(elem).on('keydown',function(e){
        if (e.keyCode == 9 && $(elem).data('enableTab') == true){
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
    update: function(elem, val) {
      var value = val();
      var $elem = $(elem);
      if ($elem.data("focus")) return;
      $elem.text(value());
    }
  }

  ko.bindingHandlers.pushEnter = {
    init: function(elem, val) {
      var value = val();
      
      $(elem).on('keydown',function(e){
        if (e.keyCode == 13){
          e.preventDefault();
          value();
          $(elem).empty();
        }
      });

      $(elem).focus(function(){
        $(elem).empty();
      });

      $(elem).blur(function(){
        $(elem).text($(elem).data('refresh'));
      });
    }
  }

  ko.bindingHandlers.addSuccessLabel = {
    update: function(element, val) {
      var value = val();
      if (value() == $(element).text()){
        $(element).removeClass('label-info').addClass('label-success')
      } else {
        $(element).removeClass('label-success').addClass('label-info')
      }  
    }
 }
})