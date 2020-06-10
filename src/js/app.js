"use strict";

import $ from "jquery";
import "bootstrap";
import utils from "./utils.js";
import currencies from "./currencies.js";
import "../css/style.scss";

const width  = window.innerWidth || document.documentElement.clientWidth || 
document.body.clientWidth;
const height = window.innerHeight|| document.documentElement.clientHeight|| 
document.body.clientHeight;


let autoFill = [];
let rangeValues = [];
let activeCurrency = 0;
let initialRangeValues = [35000, 10000000000, 500, 500, 7, 8, 32, 32];

let productivityResults;
let securityResults;
let agilityResults;

let categoryTotals;



$(".range-slider__range, .amount").on("input change", function() {
  const sliderID = utils.parseID($(this).attr("id"));
  // const valID = utils.parseID($(this).attr("id"));
  let updatedValue = Number(this.value),
      value = $(".range-slider__value");
  
  $('#val' + sliderID).html(utils.commaSeparateNumber(this.value));
  
  rangeValues[sliderID] = updatedValue;

  setCategories(activeCurrency);
  setEachAnnual(rangeValues, activeCurrency);

  $("#total-annual-value, .results-total-annual-value").html(
    `${currencies[activeCurrency].currencySymbol}` +
      utils.commaSeparateNumber(calcAll(rangeValues, activeCurrency))
  );
  // console.log(sliderID);
  fillBar();

  if($(this).val().length === 0 || isNaN(updatedValue) === true) {
    console.log('please enter value to continue');
    $('.validation-alert').show();
    $('#assessment-cta').attr('disabled', true);
  } else {
    $('.validation-alert').hide();
    $('#assessment-cta').attr('disabled', false);
  }

  console.log('range values', rangeValues)

});

let setCategories = function(currency) {
  let totals = [calcProductivity(rangeValues, currency), calcSecurity(rangeValues, currency), calcAgility(rangeValues, currency)];
  console.log('set category', rangeValues)
  for(var i = 0; i < 3; i++) {
    $("#cat" + i).html(
      `${currencies[currency].currencySymbol}` +
        `${utils.commaSeparateNumber(totals[i])}`
    );
  }
}

let setEachAnnual = function(val, currency) {

  let categories = ['productivity', 'security', 'agility'];
  let totals = [calcProductivity(val, currency), calcSecurity(val, currency), calcAgility(val)];
  categoryTotals = totals;
  for(var i = 0; i < 3; i++) {
    $(".annual-" + categories[i]).html(
      `${currencies[currency].currencySymbol}` +
        `${utils.commaSeparateNumber(totals[i])}`
    );
  }
}


let setInitialValues = function (rv, c) {

  //   let activeCurrency = activeCurrency;

  // HERE initial values are not be set for currency or are being overwritten on page load
  let range = $(".range-slider__range"),
      value = $(".range-slider__value");
      value.each(function () {
        let value = $(this).prev().attr("value");

        $(this).html(utils.commaSeparateNumber(value));
        
        rangeValues.push(Number(value));

        setCategories(c);
        setEachAnnual(rv, c);
      
        $("#total-annual-value, .results-total-annual-value").html(
          `${currencies[c].currencySymbol}` +
            utils.commaSeparateNumber(calcAll(rv, c))
        );
        
      });
      // $('input[name="cLRegion"]').val(Number(c));

      console.log('from initial values', c)

      fillBar();
};

let calcProductivity = function (rv, currency) {
  let r = rv;
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
      `${currencies[currency].currencySymbol}` +
        `${utils.commaSeparateNumber(productivityResults[i])}`
    );
  }

  console.log('currency from productivity', currency)

  return Number(Math.round(sumProductivity));
};

let calcSecurity = function (rv, currency) {
  let r = rv;
  let basicRef = currencies[currency].dataBreach;

  let s0 = Math.round(
    utils.securityBasic(Number(currencies[currency].dataBreach))
  );
  let s1 = Math.round(
    utils.s1(r[1], Number(currencies[currency].securityBreach))
  );
  let s2 = Math.round(
    utils.s2(r[0], r[3], r[4], r[2], r[5], r[4], Number(basicRef))
  );

  securityResults = [s0, s1, s2];
  
  for(var i = 0; i < 3; i++) {
    $("#r-security-" + i).html(
      `${currencies[currency].currencySymbol}` +
        `${utils.commaSeparateNumber(securityResults[i])}`
    );
  }

  let sumSecurity = s0 + s1 + s2;

  return Number(Math.round(sumSecurity));
};

let calcAgility = function (rv, currency) {
  let r = rv;
  let a0 = utils.agilityBasic(r[2], r[3]);

  agilityResults = [a0];  

  let sumAgility = a0;

  $("#results-agility").html(
    `${currencies[activeCurrency].currencySymbol}` +
      `${utils.commaSeparateNumber(agilityResults[0])}`
  );

  return Number(Math.round(sumAgility));
};

let calcAll = function (val, currency) {

  console.log('val and currency', val, currency)

  return (
    calcProductivity(val, activeCurrency) +
    calcSecurity(val, activeCurrency) +
    calcAgility(val, activeCurrency)
  );


};

let fillBar = function () {
  let p = (calcProductivity(rangeValues, activeCurrency) / calcAll(rangeValues, activeCurrency)) * 100;
  let r = (calcSecurity(rangeValues, activeCurrency) / calcAll(rangeValues, activeCurrency)) * 100;
  let a = (calcAgility(rangeValues, activeCurrency) / calcAll(rangeValues, activeCurrency)) * 100;
  $("#fill-productivity").css({ width: p + "%" });
  $("#fill-security").css({ width: r + "%" });
  $("#fill-agility").css({ width: a + "%" });

};


let initResults = function() {

  // set urls params with hash at root
  window.document.location.hash = utils.encodeData(rangeValues) + '&tava=' + calcAll(rangeValues, activeCurrency) + '&region=' + activeCurrency;
  // replace hash and with results query string
  window.history.pushState(null, "", window.location.href.replace("#", '?results&'));
}

$(document).ready(function () {
  
  setInitialValues(rangeValues, activeCurrency);

  if (window.location.href.indexOf("?results&") > -1) {
    // let catArray = [...productivityResults, ...securityResults, ...agilityResults, calcAll(rangeValues)]
    
    // render results view components
    let assessmentWrap = $('#assessment-wrap');
    let mainBanner = $('.main-banner');
    let resultsBanner = $('.results-banner');
    let resultsWrap = $('#results-wrap');
    let buttonSchedule = document.getElementsByClassName('button__schedule');

    assessmentWrap.hide();
    mainBanner.hide();
    resultsBanner.show();
    resultsWrap.show();
    buttonSchedule[0].setAttribute('style', 'display: flex');

    // set category results from url params
    let initialParams = utils.getUrlVars();
    let currencyParam = Number(utils.getSpecific()["region"]);

    console.log('get url vars from app.js', initialParams, currencyParam)
    
    // here
    calcProductivity(initialParams, currencyParam);
    calcSecurity(initialParams, currencyParam);
    calcAgility(initialParams, currencyParam);
    setEachAnnual(initialParams, currencyParam);
    // change back here maybe
    // calcAll(initialParams, currencyParam);

    console.log('testing here', initialParams, currencyParam);

  
    $("#total-annual-value, .results-total-annual-value").html(
      `${currencies[currencyParam].currencySymbol}` +
        utils.commaSeparateNumber(utils.getSpecific()["tava"])
    );

    setEachAnnual(initialParams, currencyParam);
    // activeCurrency = currencies[currencyParam];

    // setInitialValues(initialParams, currencyParam);

    // activeCurrency = currencyParam;
    
    // $('.if-results').html('Calculating your results');
    // $('.button__schedule').css('display', 'flex');
    
    } else {
      // $('input[name="cLRegion"]').val(activeCurrency);
      console.log('NO RESULTS DETECTED', activeCurrency);
    }

  // on load - first::: set initial input values and calculation values 
  
  // on load - initialize bootstrap tooltip listeners
  utils.tooltip();

  // on load - check for URL params
  // if params are found
  

    // Primary functionality for range and textarea (numbers) components
    $(".range-slider__range, .amount").on("input change", function() {
      const sliderID = utils.parseID($(this).attr("id"));
      // const valID = utils.parseID($(this).attr("id"));
      let updatedValue = Number(this.value),
          value = $(".range-slider__value");
      
      $('#val' + sliderID).html(utils.commaSeparateNumber(this.value));
      
      rangeValues[sliderID] = updatedValue;
    
      setCategories(activeCurrency);
      setEachAnnual(rangeValues, activeCurrency);
    
      $("#total-annual-value, .results-total-annual-value").html(
        `${currencies[activeCurrency].currencySymbol}` +
          utils.commaSeparateNumber(calcAll(rangeValues, activeCurrency))
      );
      // console.log(sliderID);
      fillBar();
    
      if($(this).val().length === 0 || isNaN(updatedValue) === true) {
        console.log('please enter value to continue');
        $('.validation-alert').show();
        $('#assessment-cta').attr('disabled', true);
      } else {
        $('.validation-alert').hide();
        $('#assessment-cta').attr('disabled', false);
      }
    
      console.log('range values', rangeValues)
    
    });
  

  // set region currency values, recalculate, and reset range positions 
  $("select").on("input change", function () {

    // Note: selection does not convert currency.
    // Hourly wages are changed effecting some calculations

    // set new active region currency
    activeCurrency = Number(this.value);


    // set currency symbol for assessment view
    $(".currency-symbol").html(`${currencies[activeCurrency].currencySymbol}`);

    // set currency symbol for and commaSeperated val for total values
    $("#total-annual-value, .results-total-annual-value").html(
      `${currencies[activeCurrency].currencySymbol}` +
        utils.commaSeparateNumber(calcAll(rangeValues, activeCurrency))
    );

    // set new region selection values for the region ranges
    $("#range6, #range7").attr(
      "value",
      Number(currencies[activeCurrency].hourlyWage)
    );

    // NOTE: attempts to refactor below produced the wrong results
    // Only specific vanilla selectors gave desired outcomes

    // reset all range values to initial values upon new region selection
    document.getElementById('range0').value = 35000;
    document.getElementById('range1').value = 10000000000;
    document.getElementById('range2').value = 500;
    document.getElementById('range3').value = 500;
    document.getElementById('range4').value = 7;
    document.getElementById('range5').value = 8;
    document.getElementById('range6').value = Number(currencies[activeCurrency].hourlyWage);
    document.getElementById('range7').value = Number(currencies[activeCurrency].hourlyWage);
    
    // reset all display amounts to initial values upon new region selection
    document.getElementById('amount0').value = 35000;
    document.getElementById('amount1').value = 10000000000;
    document.getElementById('amount2').value = 500;
    document.getElementById('amount3').value = 500;
    document.getElementById('amount4').value = 7;
    document.getElementById('amount5').value = 8;
    document.getElementById('amount6').value = Number(currencies[activeCurrency].hourlyWage);
    document.getElementById('amount7').value = Number(currencies[activeCurrency].hourlyWage);
    
    // set updated wage values and range toggle position
    rangeValues[6] = Number(currencies[activeCurrency].hourlyWage);
    rangeValues[7] = Number(currencies[activeCurrency].hourlyWage);
    
    // set range values array for utility calculations to reference
    
    for(var i = 0; i < 6; i++) {
      rangeValues[i] = initialRangeValues[i];
      console.log('range value arry and initial value arry', rangeValues[i]);
    }

    // set each comma seperated number with updated values
    let value = $(".range-slider__value");
    value.each(function () {
      let value = $(this).prev().attr("value");
      $(this).html(utils.commaSeparateNumber(value));
    });
    $("#val6, #val7").html(Number(currencies[activeCurrency].hourlyWage));

    // set sum for the assessment view visual section and update the bar fill widths
    setCategories(activeCurrency);
    // setEachAnnual(rangeValues, activeCurrency);
    fillBar();

    $('input[name="cLRegion"]').val(activeCurrency);

  });

  // limit string length in text areas to max value char length 
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

  // Close input amount and reveal comma seperated number
  // if a user presses the enter key
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
      console.log('pressed', theEvent, key);
    })


    // toggle comma seperated numbers and text areas on click
    $('.range-slider__value').on('click', function(e) {
      e.preventDefault();
      let valID = utils.parseID($(this).attr("id"));
      $('#val' + utils.parseID($(this).attr("id"))).hide();
      $('#amount' + utils.parseID($(this).attr("id"))).show().focus();
      $('#edit' + valID).hide();
      $('#off' + valID).show();
    })

    // on focus of input amount move cursor to the end of the input value's length
    $('.amount').on('focus', function() {
      $(this)[0].setSelectionRange($(this).val().length, $(this).val().length);
    })
    

    // on submission of the assessment form categoryTotals, set marketo field values
    $('#assessment-cta').on('click', function() {

      let mkfields = [];

      // push each field name starting with the chars 'cL' to the mkfield array
      $('input[name^="cL"]').each(function(i, obj){
        $('input[name=' + `${obj.name}`+ ']')
        mkfields.push(obj.name);
        // console.log('this', this, mkfields)
      });

      // for each hidden form field, set corresponding range values
      for(var i = 0; i < 9; i++) {
        $('input[name=' + `${mkfields[i]}`+ ']').val(rangeValues[i]);
        console.log('from for loop  setting fields:::', mkfields[i], rangeValues[i]);
      }

      // set category fields and total sum field
      $('input[name="cLSecurityValueAdded"]').val(Number(calcSecurity(rangeValues, activeCurrency)));
      $('input[name="cLProductivityValueAdded"]').val(Number(calcProductivity(rangeValues, activeCurrency)));
      $('input[name="cLAgilityValueAdded"]').val(Number(calcAgility(rangeValues, activeCurrency)));
      $('input[name="cLTotalAnnualValueAdded"]').val(Number(calcAll(rangeValues, activeCurrency)));
      $('input[name="cLRegion"]').val(Number(activeCurrency));

      // cLAverageHourlyWageOrg
      // cLTotalRevenue

      // protoype field array and remove duplicate keys
      // mkfields = utils.removeDuplicates(mkfields);

      // console.log('mkfields', mkfields);
      
    });

    // onclick of initial marketo cta set autofil array values
    $(document).on('click', '.mktoButton', function(e) {
      autoFill[0] = $('#mktoForm_3445 input[name="FirstName"]').val();    
      autoFill[1] = $('#mktoForm_3445 input[name="LastName"]').val();
      autoFill[2] = $('#mktoForm_3445 input[name="Email"]').val();
      autoFill[3] = $('#mktoForm_3445 input[name="Phone"]').val();
      // initResults();
      console.log('autofill form', autoFill)
    });

    // on click of marketo submit button set autofill values to generated input fields in results
    $(document).on('click', '.button__schedule, .results-banner-schedule-link', function(e) {
      console.log('clicked')
      $('input[name="FirstName"]').val(autoFill[0]);    
      $('input[name="LastName"]').val(autoFill[1]);
      $('input[name="Email"]').val(autoFill[2]);
      $('input[name="Phone"]').val(autoFill[3]);
    });
    // on click of third spe submit button set autofill 

    // on submit initialize function sets results params
    $('#mktoForm_3445').on('submit', function() {
      initResults();
    })

    // Results expand all colapse all added functionality to bootstrap tab components

    // if there are no open tabs display expand all and toggle functionality of button to open all tabs
    // otherwise display collapse all button and closing functionality for all tabs (based on parent wraper ID)

    $('.toggle-advanced').mouseup(function() {
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

      // Core toggle (collapse/expand) all functionality for results tabs:
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

        // if a user clicks outside of a text area, display the amount
        // with comma seperated number in its place
        $(document).on("focusout",".amount",function(){
          let valID = utils.parseID($(this).attr("id"));
          $(this).hide();   
          $('#val' + valID).show(); 
          $('#off' + valID).hide();
          $('#edit' + valID).show();
          
      });

      
      $(document).scroll(function() {
        
        console.log('width and height HERE', width, height);
        var y = $(this).scrollTop();
        if (y > 100 && width > 576) {
          $('.nav_scroll').css('display', 'flex');
          console.log('in view')
        } else {
          $('.nav_scroll').fadeOut();
          console.log('not in view')
        }
      });

});
