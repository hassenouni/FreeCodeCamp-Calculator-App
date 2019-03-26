function draw(he, wi) {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');
    ctx.canvas.width = wi;
    ctx.canvas.height = he;
    var w = ctx.canvas.width;
    var h = ctx.canvas.height;
    var grad = ctx.createLinearGradient(0, h/1.4, w, h/1.4);
    grad.addColorStop(0, '#4fd14e');
    grad.addColorStop(1, '#99e58e');

    ctx.beginPath();
    ctx.moveTo(0,h/1.4);
    ctx.quadraticCurveTo(w/3, h/1.8, w/1.4, h/1.4);
    ctx.quadraticCurveTo(w/1.08, h/1.25, w/1.03, h/1.4);
    ctx.quadraticCurveTo(w/1.01, h/1.45, w/1.08, h/1.5);
    ctx.quadraticCurveTo(w/1.5, h/1.8, w/1.5, h/3);
    ctx.quadraticCurveTo(w/1.5, h/5, w/1.8, 0);
    ctx.lineTo(0, 0);
    ctx.fillStyle = grad;
    ctx.fill();
  }
};

$(document).ready(function() {
  var result = "";

  draw(window.innerHeight, window.innerWidth);
  $(window).resize(function() { draw(window.innerHeight, window.innerWidth) });
  
  $("form").submit(function(e) {
    e.preventDefault();
    evaluateResult();
  });
  $(document).keypress(function(event) {
    if (event.which == 49) $("#1").focus().click();
    if (event.which == 50) $("#2").focus().click();
    if (event.which == 51) $("#3").focus().click();
    if (event.which == 52) $("#4").focus().click();
    if (event.which == 53) $("#5").focus().click();
    if (event.which == 54) $("#6").focus().click();
    if (event.which == 55) $("#7").focus().click();
    if (event.which == 56) $("#8").focus().click();
    if (event.which == 57) $("#9").focus().click();
    if (event.which == 48) $("#0").focus().click();
    if (event.which == 13) $("#equal").focus().click();
    if (event.which == 47) $("#divide").focus().click();
    if (event.which == 42) $("#times").focus().click();
    if (event.which == 43) $("#plus").focus().click();
    if (event.which == 45) $("#minus").focus().click();
    if (event.which == 37) $("#mod").focus().click();
    if (event.which == 47) $("#divide").focus().click();
    if (event.which == 44 || event.which == 58) $("#dot").focus().click();
  });
  $(document).keydown(function(event) {
    if (event.which == 8) {
      event.preventDefault();
      $("#clr").focus().click();
    }
    if (event.which == 46) {
      event.preventDefault();
      $("#reset").focus().click();
    }
  });
  
  $("#1, #2, #3, #4, #5, #6, #7, #8, #9, #0, #dot, #plus, #minus, #times, #divide, #mod").click(addToResult);
  $("#clr").click(removeFromResult);
  $("#reset").click(clearResult);
  $("#equal").click(evaluateResult);

  function addToResult() {
    var lastOp = result.match(/\+|\-|×|÷|mod|\./gm);
    if (lastOp != null) lastOp = lastOp[lastOp.length - 1];
    if (!isNaN($(this).val())) {
      result += $(this).val();
      if (result.length > 10) handleBigResult();
      $("#result").val(result);
    } else {
      if ($(this).val() == "." && lastOp == ".") {
        event.preventDefault();
      } else if (!isNaN(result[result.length - 1]) && result.length > 0) {
        result += $(this).val();
        if (result.length > 10) handleBigResult();
        $("#result").val(result);
      } else if (result.length > 0) {
        if($(this).val() == ".") {
          event.preventDefault();
        } else {
          removeFromResult();
          result += $(this).val();
          if (result.length > 10) handleBigResult();
          $("#result").val(result);
        }
      }
    }
  }

  function removeFromResult() {
    if (result != 0 && result.length > 1) {
      result = result.slice(-0, -1);
      if (result.length <= 10) handleSmallResult();
      $("#result").val(result);
    } else {
      clearResult();
    }
  }

  function clearResult() {
    result = "";
    handleSmallResult();
    $("#result").val(0);
  }

  function evaluateResult() {
    if (result.length == 1 || result == "" || result == 0 || isNaN(result[result.length - 1])) {
      event.preventDefault();
    } else {
      var numbers = result.match(/\d+\.?\d*/g);
      var ops = result.match(/\+|\-|×|÷|mod/g);
      var highOps = ops.join().match(/×|÷|mod/g);
      var lowOps = ops.join().match(/\+|\-/g);
      highOps == null ? highOps = 0 : highOps = highOps.length;
      lowOps == null ? lowOps = 0 : lowOps = lowOps.length;

      while (numbers.length > 1) {
        var curNr = 0;
        var curOp = 0;
        while (highOps > 0) {
          switch (ops[curOp]) {
            case "×":
              numbers[curNr] = numbers[curNr] * numbers[curNr + 1];
              numbers.splice(curNr + 1, 1);
              ops.splice(curOp, 1);
              curNr--;
              curOp--;
              highOps--;
              break;
            case "÷":
              numbers[curNr] = numbers[curNr] / numbers[curNr + 1];
              numbers.splice(curNr + 1, 1);
              ops.splice(curOp, 1);
              curNr--;
              curOp--;
              highOps--;
              break;
            case "mod":
              numbers[curNr] = numbers[curNr] % numbers[curNr + 1];
              numbers.splice(curNr + 1, 1);
              ops.splice(curOp, 1);
              curNr--;
              curOp--;
              highOps--;
              break;
          }
          curNr++;
          curOp++;
        }
        curNr = 0;
        curOp = 0;
        while (lowOps > 0) {
          switch (ops[curOp]) {
            case "+":
              numbers[curNr] = parseFloat(numbers[curNr]) + parseFloat(numbers[curNr + 1]);
              numbers.splice(curNr + 1, 1);
              ops.splice(curOp, 1);
              curNr--;
              curOp--;
              lowOps--;
              break;
            case "-":
              numbers[curNr] = numbers[curNr] - numbers[curNr + 1];
              numbers.splice(curNr + 1, 1);
              ops.splice(curOp, 1);
              curNr--;
              curOp--;
              lowOps--;
              break;
          }
          curNr++;
          curOp++;
        }
      }

      result = numbers.join();
      if (result.length > 10) { handleBigResult(); }
      else { handleSmallResult(); }
      $("#result").val(result);
    }
    event.preventDefault();
  }

  function handleBigResult() {
    $("#result").css({
      'font-size': '14px',
      'line-height': '1.4',
      'word-wrap': 'break-word',
      'padding-top': '5px',
      'padding-bottom': '5px',
      'box-sizing': 'border-box',
      'overflow': 'hidden'});
  }
  
  function handleSmallResult() {
    $("#result").removeAttr( 'style' );
  }
  
});