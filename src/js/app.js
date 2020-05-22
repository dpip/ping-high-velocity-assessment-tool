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

  if($(this).val().length === 0 || isNaN(updatedValue) === true) {
    console.log('please enter value to continue');
    $('#assessment-cta').attr('disabled', true);
    alert('Please enter numerical value')
  } else {
    $('#assessment-cta').attr('disabled', false);
  }

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
      
        $("#total-annual-value, .results-total-annual-value").html(
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


// let initResults = function() {
//   let catArray = [...productivityResults, ...securityResults, ...agilityResults]
//   let data = window.document.location.hash = utils.encodeData(catArray);
//   window.history.pushState(null, "", window.location.href.replace("#", '?results' + `${data}`));
//   console.log('category array', catArray);
// }

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

    document.getElementById('amount0').value = 35000;
    document.getElementById('amount1').value = 10000000000;
    document.getElementById('amount2').value = 500;
    document.getElementById('amount3').value = 500;
    document.getElementById('amount4').value = 7;
    document.getElementById('amount5').value = 8;
    document.getElementById('amount6').value = Number(currencies[activeCurrency].hourlyWage);
    document.getElementById('amount7').value = Number(currencies[activeCurrency].hourlyWage);
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
          $('#off' + valID).hide();
          $('#edit' + valID).show();
        }
        if($(this).is(':focus')) {
          console.log('focused');
        } else {
          // $(this).hide();
        }
      console.log('pressed', theEvent, key);
})

$('.icon-edit-off').on('click', function() {
    let valID = utils.parseID($(this).attr("id"));
      $('#amount' + valID).blur();
      $('#amount' + valID).hide();   
      $('#val' + valID).show(); 
      $('#off' + valID).hide();
      $('#edit' + valID).show();
      console.log('clicked', '#amount' + valID);
})

$('.range-slider__value, .icon-edit').on('click', function(e) {
  e.preventDefault();
  let valID = utils.parseID($(this).attr("id"));
  $('#val' + utils.parseID($(this).attr("id"))).hide();
  $('#amount' + utils.parseID($(this).attr("id"))).show().focus();
  $('#edit' + valID).hide();
  $('#off' + valID).show();
})

$('.amount').on('focus click', function() {
  $(this)[0].setSelectionRange(0, $(this).val().length);
})
    
  function isNumeric (evt) {
    evt.preventDefault();

    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode (key);
    var regex = /[0-9]|\./;
    if ( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }
    console.log('is executing');
  }

  $('#assessment-cta').on('click', function(e) {
    e.preventDefault();
    let mkfields = [];
    $('input[name^="cL"]').each(function(i, obj){
      // console.log('btn selected:: inputs', i, obj);
      mkfields.push(obj.name);

      $('input[name=' + `${obj.name}`+ ']')
      console.log($('input[name=' + `${obj.name}`+ ']'))
    });
    for(var i = 0; i < 8; i++) {
      $('input[name=' + `${mkfields[i]}`+ ']').val(rangeValues[i]);
    }
    $('input[name="cLSecurityValueAdded"]').val(Number(calcSecurity(rangeValues)));
    $('input[name="cLProductivityValueAdded"]').val(Number(calcProductivity(rangeValues)));
    $('input[name="cLAgilityValueAdded"]').val(Number(calcAgility(rangeValues)));
    $('input[name="cLTotalAnnualValueAdded"]').val(Number(calcAll(rangeValues)));
    
    console.log('btn selected', mkfields, $('input[name="cLTotalAnnualValueAdded"]').val());
  });
  
  $('.button__schedule').on('click', function(e) {
    e.preventDefault();
    let mkfields = [];
    $('input[name^="cL"]').each(function(i, obj){
      // console.log('btn selected:: inputs', i, obj);
      mkfields.push(obj.name);

      $('input[name=' + `${obj.name}`+ ']')
      console.log($('input[name=' + `${obj.name}`+ ']'))
    });
    for(var i = 0; i < 8; i++) {
      $('input[name=' + `${mkfields[i]}`+ ']').val(rangeValues[i]);
    }
    $('input[name="cLSecurityValueAdded"]').val(Number(calcSecurity(rangeValues)));
    $('input[name="cLProductivityValueAdded"]').val(Number(calcProductivity(rangeValues)));
    $('input[name="cLAgilityValueAdded"]').val(Number(calcAgility(rangeValues)));
    $('input[name="cLTotalAnnualValueAdded"]').val(Number(calcAll(rangeValues)));
      });



      // Results expand all colapse all functionality

      // if there are no open tabs display expand all and toggle functionality of button to open all tabs
      // otherwise display collapse all button and closing functionality for all tabs (based on parent wraper ID)

      $('.tab-pane .toggle-advanced').mouseup(function() {
        let catId = $(this).parent().parent().attr('id');

        if($('#' + catId).find('.show').length !== 1) {
          
          $('#' + catId).find('.toggle-all').addClass('active');
          $('#' + catId).find('.toggle-all').html('Collapse all');
          console.log('show class exists', );
        } else {
          console.log('show class does not exist');
          $('#' + catId).find('.toggle-all').removeClass('active');
          $('#' + catId).find('.toggle-all').html('Expand all');
        }
      });

      // Core toggle (collapse/expand) all functionality

      $(".toggle-all").on("click", function () {

        let toggleId = $(this).parent().attr("id");

            if($(this).hasClass('active')) {
              console.log('active')
              $(this).html('Expand all');
              $('#' + toggleId + ' > .results-tab-content').each(function() {
                // console.log($(this))
                $(this).removeClass('show').addClass('collapse');
                console.log($(this));
            })
            $(this).toggleClass("active");
            $(".toggle-advanced").attr("aria-expanded", "false");
            } else {
              console.log('no active')
              $(this).html('Collapse all');
              $('#' + toggleId + ' > .results-tab-content').each(function() {
                // console.log($(this))
                $(this).removeClass('collapse').addClass('show');
                console.log($(this));
            })
            $(this).toggleClass("active");
            $(".toggle-advanced").attr("aria-expanded", "true");
            }
       });

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
