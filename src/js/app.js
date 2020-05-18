"use strict";

import $ from "jquery";
import "bootstrap";
import utils from "./utils.js";
import currencies from "./currencies.js";
import results from './results.js';
import "../css/style.scss";

let initialRangeValues = [35000, 10000000000, 500, 500, 7, 8, 32, 32];
let rangeValues = [];
let activeCurrency = 0;

let productivityResults;
let securityResults;
let agilityResults;


$(".range-slider__range, .amount").on("input change", function() {
  const sliderID = utils.parseID($(this).attr("id"));
  // const valID = utils.parseID($(this).attr("id"));
  let updatedValue = Number(this.value),
      value = $(".range-slider__value");
  
  $('#val' + sliderID).html(utils.commaSeparateNumber(this.value));
  // $(this).closest(value).html(utils.commaSeparateNumber(this.value));
  // console.log($(this).closest('.range-slider__value'));
  // $(this).find('.range-slider__value')
  // console.log($(this).find('.range-slider__value').html());
  rangeValues[sliderID] = updatedValue;

  setCategories();
  setEachAnnual();

  $("#total-annual-value, .results-total-annual-value").html(
    `${currencies[activeCurrency].currencySymbol}` +
      utils.commaSeparateNumber(calcAll())
  );
  // console.log(sliderID);
  fillBar();

});

let setCategories = function() {
  let totals = [calcProductivity(rangeValues), calcSecurity(rangeValues), calcAgility(rangeValues)];
  for(var i = 0; i < 3; i++) {
    $("#cat" + i).html(
      `${currencies[activeCurrency].currencySymbol}` +
        `${utils.commaSeparateNumber(totals[i])}`
    );
  }
}

let setEachAnnual = function() {
  let categories = ['productivity', 'security', 'agility'];
  let totals = [calcProductivity(rangeValues), calcSecurity(rangeValues), calcAgility(rangeValues)];

  for(var i = 0; i < 3; i++) {
    $(".annual-" + categories[i]).html(
      `${currencies[activeCurrency].currencySymbol}` +
        `${utils.commaSeparateNumber(totals[i])}`
    );
  }
}


let setInitialValues = function () {

  //   let activeCurrency = activeCurrency;
  let range = $(".range-slider__range"),
      value = $(".range-slider__value");
      value.each(function () {
        let value = $(this).prev().attr("value");

        $(this).html(utils.commaSeparateNumber(value));
        
        rangeValues.push(Number(value));

        setCategories();
        setEachAnnual();
      
        $("#total-annual-value, #results-total-annual-value").html(
          `${currencies[activeCurrency].currencySymbol}` +
            utils.commaSeparateNumber(calcAll())
        );
        
      });

      fillBar();
};

let calcProductivity = function (rangeValues) {
  let r = rangeValues;
  let p0 = utils.productivityBasic(r[0], r[7]);
  let p1 = utils.p1(r[0], r[7]);
  let p2 = utils.p2(r[2], r[3], r[6], r[7]);
  let p3 = utils.p3(r[2], r[6]);
  let p4 = utils.p4(r[6], r[5]);
  let p5 = utils.p5(r[0], r[7]);

  let sumProductivity = Number(p0 + p1 + p2 + p3 + p4 + p5);

  productivityResults = [p0, p1, p2, p3, p4, p5];

  for(var i = 0; i < 6; i++) {
    $("#r-productivity-" + i).html(
      `${currencies[activeCurrency].currencySymbol}` +
        `${utils.commaSeparateNumber(productivityResults[i])}`
    );
  }

  return sumProductivity;
};

let calcSecurity = function (rangeValues) {
  let r = rangeValues;
  let basicRef = currencies[activeCurrency].dataBreach;

  let s0 = Math.round(
    utils.securityBasic(Number(currencies[activeCurrency].dataBreach))
  );
  let s1 = Math.round(
    utils.s1(r[1], Number(currencies[activeCurrency].securityBreach))
  );
  let s2 = Math.round(
    utils.s2(r[0], r[3], r[4], r[2], r[5], r[4], Number(basicRef))
  );

  securityResults = [s0, s1, s2];
  

  for(var i = 0; i < 3; i++) {
    $("#r-security-" + i).html(
      `${currencies[activeCurrency].currencySymbol}` +
        `${utils.commaSeparateNumber(securityResults[i])}`
    );
  }

  let sumSecurity = s0 + s1 + s2;

  return Number(Math.round(sumSecurity));
};

let calcAgility = function (rangeValues) {
  let r = rangeValues;
  let a0 = utils.agilityBasic(r[2], r[3]);

  agilityResults = [a0];  

  let sumAgility = a0;

  $("#results-agility").html(
    `${currencies[activeCurrency].currencySymbol}` +
      `${utils.commaSeparateNumber(agilityResults[0])}`
  );

  return sumAgility;
};

let calcAll = function () {
  return (
    calcProductivity(rangeValues) +
    calcSecurity(rangeValues) +
    calcAgility(rangeValues)
  );
};

let fillBar = function () {
  let p = (calcProductivity(rangeValues) / calcAll()) * 100;
  let r = (calcSecurity(rangeValues) / calcAll()) * 100;
  let a = (calcAgility(rangeValues) / calcAll()) * 100;
  $("#fill-productivity").css({ width: p + "%" });
  $("#fill-security").css({ width: r + "%" });
  $("#fill-agility").css({ width: a + "%" });

};


let initResults = function() {
  let catArray = [...productivityResults, ...securityResults, ...agilityResults]
  let data = window.document.location.hash = utils.encodeData(catArray);
  window.history.pushState(null, "", window.location.href.replace("#", '?results' + `${data}`));
  console.log('category array', catArray);
}

$(document).ready(function () {

  utils.tooltip();
  
  
  $("select").on("input change", function () {
    activeCurrency = Number(this.value);
    $(".currency-symbol").html(`${currencies[activeCurrency].currencySymbol}`);
    $("#total-annual-value, .results-total-annual-value").html(
      `${currencies[activeCurrency].currencySymbol}` +
        utils.commaSeparateNumber(calcAll())
    );
    
    $("#range6, #range7").attr(
      "value",
      Number(currencies[activeCurrency].hourlyWage)
    );

    document.getElementById('range0').value = 35000;
    document.getElementById('range1').value = 10000000000;
    document.getElementById('range2').value = 500;
    document.getElementById('range3').value = 500;
    document.getElementById('range4').value = 7;
    document.getElementById('range5').value = 8;
    document.getElementById('range6').value = Number(currencies[activeCurrency].hourlyWage);
    document.getElementById('range7').value = Number(currencies[activeCurrency].hourlyWage);
    for(var i = 0; i < 6; i++) {
      rangeValues[i] = initialRangeValues[i];
      console.log(rangeValues[i]);
    }
    rangeValues[6] = Number(currencies[activeCurrency].hourlyWage);
    rangeValues[7] = Number(currencies[activeCurrency].hourlyWage);

    // last update that may have affected math below
    // setInitialValues();
    // end
      let value = $(".range-slider__value");
      value.each(function () {
        let value = $(this).prev().attr("value");
        $(this).html(utils.commaSeparateNumber(value));
      });
    setCategories();
    setEachAnnual();
    fillBar();
    // setInitialValues();
    console.log(rangeValues);
  });
  let readToggle = function (content) {
    console.log('innerhtml', content.html());
    if (content.html() === 'Collapse all') {
      content.html('Expand all');
    } else {
      content.html('Collapse all');
    }
  }
  $(".collapse-toggle").on("click", function () {
    readToggle($(this));
    if ($(this).hasClass("collapse-all")) {
      $(this).removeClass("collapse-all");
      $(".results-tab-content").removeClass("collapse");
      $(".results-tab-content").addClass("show");
      $(".toggle-advanced").attr("aria-expanded", "true");
    } else {
      $(this).addClass("collapse-all");
      $(".results-tab-content").removeClass("show");
      $(".results-tab-content").addClass("collapse");
      $(".toggle-advanced").attr("aria-expanded", "false");
    }
  });
  // $('input.number').keyup(function(event) {

  //   // skip for arrow keys
  //   if(event.which >= 37 && event.which <= 40) return;
  
  //   // format number
  //   $(this).val(function(index, value) {
  //     return value
  //     .replace(/\D/g, "")
  //     .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  //     ;
  //   });
  // });

  setInitialValues();


  $('.amount').on('input', function() {
      if (Number($(this).val().length) > Number($(this).attr('max').length)) {
        
        let v = $(this).val();
        let s = $('.range-slider__value').range;
        v = Number($(this).val().slice(0, $(this).attr('max').length));
        $('.range-slider__value').html(utils.commaSeparateNumber(v));
        console.log("yeap", $(this).attr('max').length, v)
      } else {
        console.log("nerp", $(this).val().length, $(this).attr('max').length);
      }
        // object.value = object.value.slice(0, object.max.length)
  })

  $('.amount').on('keypress', function(evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        let valID = utils.parseID($(this).attr("id"));
        key = String.fromCharCode (key);
        var regex = /[0-9]|\./;
        if ( !regex.test(key) ) {
          theEvent.returnValue = false;
          if(theEvent.preventDefault) theEvent.preventDefault();
        }
        if(evt.which == 13){
          $(this).blur();
          $(this).hide();   
          $('#val' + valID).show(); 
        }
        if($(this).is(':focus')) {
          console.log('focused');
        } else {
          $(this).hide();
        }
      console.log('pressed', theEvent, key);
})

$('.range-slider__value').on('click', function(e) {
  e.preventDefault();
  $(this).hide();
  $('#amount' + utils.parseID($(this).attr("id"))).show().focus();
})

$('.amount').on('focus click', function() {
  $(this)[0].setSelectionRange(0, $(this).val().length);
})

// document.addEventListener("click", function (event) {
//   if (event.target.className !== "amount") {
//       $('.amount').hide();
//       $('.range-slider__value').show();
//   } 
// });


    
  // function isNumeric (evt) {
  //   var theEvent = evt || window.event;
  //   var key = theEvent.keyCode || theEvent.which;
  //   key = String.fromCharCode (key);
  //   var regex = /[0-9]|\./;
  //   if ( !regex.test(key) ) {
  //     theEvent.returnValue = false;
  //     if(theEvent.preventDefault) theEvent.preventDefault();
  //   }
  //   console.log('is executing');
  // }

  // if (window.location.href.indexOf("results") > -1) {
  //     //Initialize results
  //     results.init();
  //     //Show the graph
  //     results.showFinal();
  //     console.log('RESULTS DETECTED');
  // } else {
  //   console.log('NO RESULTS DETECTED');

  //   initResults();
  // }
});
