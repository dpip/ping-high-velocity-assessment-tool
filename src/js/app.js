"use strict";

import $ from "jquery";
import "bootstrap";
import utils from "./utils.js";
import currencies from "./currencies.js";
import results from './results.js';
import "../css/style.scss";

let rangeValues = [];
let activeCurrency = 0;

let productivityResults;
let securityResults;
let agilityResults;

$(".range-slider__range").on("input change", function() {
  const sliderID = utils.parseID($(this).attr("id"));
  let updatedValue = Number(this.value),
      value = $(".range-slider__value");
  
  $(this).next(value).html(utils.commaSeparateNumber(this.value));
  rangeValues[sliderID] = updatedValue;

  setCategories();
  setEachAnnual();

  $("#total-annual-value, .results-total-annual-value").html(
    `${currencies[activeCurrency].currencySymbol}` +
      utils.commaSeparateNumber(calcAll())
  );

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
      range.each(function () {
        let value = $(this).prev().attr("value");
        $(this).next(value).html(utils.commaSeparateNumber(this.value));
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
    $("#range-6, #range-7").attr(
      "value",
      Number(currencies[activeCurrency].hourlyWage)
    );
    rangeValues[6] = Number(currencies[activeCurrency].hourlyWage);
    rangeValues[7] = Number(currencies[activeCurrency].hourlyWage);
    // last update that may have affected math below
    setInitialValues();
    // end
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

  setInitialValues();

  if (window.location.href.indexOf("results") > -1) {
      //Initialize results
      results.init();
      //Show the graph
      results.showFinal();
      console.log('RESULTS DETECTED');
  } else {
    console.log('NO RESULTS DETECTED');

    initResults();
  }
});
