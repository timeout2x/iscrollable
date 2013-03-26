// ----------------------------------------------------------------------------
// iScrollable - iOs-like scrollbar, JQuery plugin
// v 1.0
// Dual licensed under the MIT and GPL licenses.
// ----------------------------------------------------------------------------
// Copyright (C) 2013 Sergey Varlamov
// https://github.com/timeout2x/
// ----------------------------------------------------------------------------
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// ----------------------------------------------------------------------------

jQuery.fn.iscrollable=function() {
  $.iscrollable = $.iscrollable || { };
  
  $(this).each(function() {
    $(this).data('iscrollable', new Scrollbar($(this)));
  });
  
  function Scrollbar($parent) {
    var $height, $scrollHeight, $dy = 0.2, $bar, $track, $dragStart, $dragTop,
    $hasTouch = ( 'ontouchstart' in document.documentElement ) ? true : false, $scrolling = false;
    
    $scrollHeight = $parent.get(0).scrollHeight;
    $height = $parent.height();
    
    if ($height >= $scrollHeight) return;

    /* append html */
    $bar = $('<div class="scrollbar"></div>').appendTo($parent);
    $track = $('<div class="track"></div>').appendTo($bar);
    $parent.addClass('iscrollable');
    $scrollHeight = $parent.get(0).scrollHeight;
    $track.css('height', ($height/$scrollHeight*100)+'%');

    setEvents();
    reposition(1);
    
    /* assign events */
    function setEvents() {
      if (!$hasTouch) {
        $bar.bind('mousedown', start);
        $bar.bind('mouseup', drag);
      }
      else {
        $parent.ontouchstart = function(event) {   
          if (event.touches.length === 1) {
            start(event.touches[0]);
            event.stopPropagation();
          }
        };
      }

      if(window.addEventListener) {
        window.addEventListener('DOMMouseScroll', wheel, false);
        window.addEventListener('mousewheel', wheel, false);
      }
      else {
        window.onmousewheel = document.onmousewheel = wheel;
      }
      
      $parent.on('mouseenter', function() {
        $scrolling = true;
      });
      $parent.on('mouseleave', function() {
        $scrolling = false;
      });
    }

    function start(event) {
      $dragTop = $track.position().top;
      $dragStart = event.pageY;
            
      $('body').addClass('noSelect');
      if(!$hasTouch) {
        $(document).bind('mousemove', drag);
        $(document).bind('mouseup', end);
        $track.bind('mouseup', end);
      }
      else {
        document.ontouchmove = function(event) {
          event.preventDefault();
          drag(event.touches[0]);
        };
        document.ontouchend = end;        
      }
    }

    function wheel(event) {
      var oEvent = event || window.event, delta = oEvent.wheelDelta?oEvent.wheelDelta/120:-oEvent.detail/3;
      if (!$scrolling) return;
      
      event.preventDefault();

      $parent.get(0).scrollTop -= $dy*$height*delta;
      reposition(1);
    }
    
    function reposition(track) {
      $bar.css('top', $parent.get(0).scrollTop);
      if (track) $track.css('top', ($parent.get(0).scrollTop/$parent.get(0).scrollHeight*100)+'%');
    }

    function drag(event) {
      var dy = event.pageY - $dragStart + $dragTop;

      if (dy < 0) dy = 0;
      if (dy > $height-$track.height()) dy = $height-$track.height();
      $track.css('top', dy+'px');
      $parent.get(0).scrollTop = (dy*$scrollHeight)/$height;
      reposition();
    }
        
    function end() {
      $('body').removeClass('noSelect');
      $(document).unbind('mousemove', drag);
      $(document).unbind('mouseup', end);
      $track.unbind( 'mouseup', end);
      document.ontouchmove = document.ontouchend = null;
    }
    

  }

};