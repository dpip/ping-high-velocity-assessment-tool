"use strict";

import $ from "jquery";
import "bootstrap";
import utils from "./utils.js";
import "../css/style.scss";

let rangeValues = [];
let activeCurrency = 0;
let currencies = [
  {
    type: "us",
    currencySymbol: "$",
    dataBreach: 8190000,
    securityBreach: 0.07,
    hourlyWage: 32,
  },
  {
    type: "uk",
    currencySymbol: "£",
    dataBreach: 3920000,
    securityBreach: 0.9,
    hourlyWage: 26,
  },
  {
    type: "eu",
    currencySymbol: "€",
    dataBreach: 3920000,
    securityBreach: 1,
    hourlyWage: 30,
  },
  {
    type: "au",
    currencySymbol: "$",
    dataBreach: 3920000,
    securityBreach: 0.07,
    hourlyWage: 50,
  },
];

let rangeSlider = function () {
  let r = rangeValues;
  //   let activeCurrency = activeCurrency;
  let slider = $(".range-slider"),
    range = $(".range-slider__range"),
    value = $(".range-slider__value");

  slider.each(function () {
    range.on("input", function () {
      let id = utils.parseNumber($(this).attr("id"));
      let updatedValue = Number(this.value);
      let sum = $("#total-annual-value");
      $(this).next(value).html(utils.commaSeparateNumber(this.value));
      rangeValues[id] = updatedValue;

      $("#cat1").html(
        `${currencies[activeCurrency].currencySymbol}` +
          `${utils.commaSeparateNumber(calcProductivity(rangeValues))}`
      );
      $("#cat2").html(
        `${currencies[activeCurrency].currencySymbol}` +
          `${utils.commaSeparateNumber(calcSecurity(rangeValues))}`
      );
      $("#cat3").html(
        `${currencies[activeCurrency].currencySymbol}` +
          `${utils.commaSeparateNumber(calcAgility(rangeValues))}`
      );

      $(".annual-productivity").html(
        `${currencies[activeCurrency].currencySymbol}` +
          `${utils.commaSeparateNumber(calcProductivity(rangeValues))}`
      );
      $(".annual-security").html(
        `${currencies[activeCurrency].currencySymbol}` +
          `${utils.commaSeparateNumber(calcSecurity(rangeValues))}`
      );
      $(".annual-agility").html(
        `${currencies[activeCurrency].currencySymbol}` +
          `${utils.commaSeparateNumber(calcAgility(rangeValues))}`
      );
      // $('#cat2').html('$' + `${calcSecurity(rangeValues)}`);
      // console.log(calcSecurity(rangeValues));
      // console.log('from slider::: Range', calcSecurity(rangeValues));
      $("#total-annual-value").html(
        `${currencies[activeCurrency].currencySymbol}` +
          utils.commaSeparateNumber(calcAll())
      );
      $("#results-total-annual-value").html(
        `${currencies[activeCurrency].currencySymbol}` +
          utils.commaSeparateNumber(calcAll())
      );
    });
    fillBar();
  });

  value.each(function () {
    let value = $(this).prev().attr("value");
    let id = $(this).prev().attr("id");
    let sum = $("#total-annual-value");

    $(this).html(utils.commaSeparateNumber(value));
    rangeValues.push(Number(value));

    $("#cat1").html(
      `${currencies[activeCurrency].currencySymbol}` +
        `${utils.commaSeparateNumber(calcProductivity(rangeValues))}`
    );
    $("#cat2").html(
      `${currencies[activeCurrency].currencySymbol}` +
        `${utils.commaSeparateNumber(calcSecurity(rangeValues))}`
    );
    $("#cat3").html(
      `${currencies[activeCurrency].currencySymbol}` +
        `${utils.commaSeparateNumber(calcAgility(rangeValues))}`
    );

    $(".annual-productivity").html(
      `${currencies[activeCurrency].currencySymbol}` +
        `${utils.commaSeparateNumber(calcProductivity(rangeValues))}`
    );
    $(".annual-security").html(
      `${currencies[activeCurrency].currencySymbol}` +
        `${utils.commaSeparateNumber(calcSecurity(rangeValues))}`
    );
    $(".annual-agility").html(
      `${currencies[activeCurrency].currencySymbol}` +
        `${utils.commaSeparateNumber(calcAgility(rangeValues))}`
    );

    // console.log('from slider::: VAlUE', calcSecurity(rangeValues));
    $("#total-annual-value").html(
      `${currencies[activeCurrency].currencySymbol}` +
        utils.commaSeparateNumber(calcAll())
    );
    $(".results-total-annual-value").html(
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

  $("#r-productivity-0").html(
    `${currencies[activeCurrency].currencySymbol}` +
      `${utils.commaSeparateNumber(p0)}`
  );
  $("#r-productivity-1").html(
    `${currencies[activeCurrency].currencySymbol}` +
      `${utils.commaSeparateNumber(p1)}`
  );
  $("#r-productivity-2").html(
    `${currencies[activeCurrency].currencySymbol}` +
      `${utils.commaSeparateNumber(p2)}`
  );
  $("#r-productivity-3").html(
    `${currencies[activeCurrency].currencySymbol}` +
      `${utils.commaSeparateNumber(p3)}`
  );
  $("#r-productivity-4").html(
    `${currencies[activeCurrency].currencySymbol}` +
      `${utils.commaSeparateNumber(p4)}`
  );
  $("#r-productivity-5").html(
    `${currencies[activeCurrency].currencySymbol}` +
      `${utils.commaSeparateNumber(p5)}`
  );

  console.log("individual results", p0);

  let sumProductivity = Number(p0 + p1 + p2 + p3 + p4 + p5);

  // fillBar();

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

  $("#r-security-0").html(
    `${currencies[activeCurrency].currencySymbol}` +
      `${utils.commaSeparateNumber(s0)}`
  );
  $("#r-security-1").html(
    `${currencies[activeCurrency].currencySymbol}` +
      `${utils.commaSeparateNumber(s1)}`
  );
  $("#r-security-2").html(
    `${currencies[activeCurrency].currencySymbol}` +
      `${utils.commaSeparateNumber(s2)}`
  );

  let sumSecurity = s0 + s1 + s2;

  // let s2 = utils.s2(r[0], r[0], r[0], r[0]);s0
  console.log("individual functions security:::", s0, s1, s2);
  console.log("TOTAL SUM OF SECURITY:::", sumSecurity);

  return Number(Math.round(sumSecurity));
};

let calcAgility = function (rangeValues) {
  let r = rangeValues;
  let a0 = utils.agilityBasic(r[2], r[3]);

  $("#results-agility").html(
    `${currencies[activeCurrency].currencySymbol}` +
      `${utils.commaSeparateNumber(a0)}`
  );
  // $('#r-agility-1').html('$' + `${utils.commaSeparateNumber(s1)}`);

  let sumAgility = a0;

  console.log("A0 here", a0);

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


  // setParams();
  // return (a / calcAll() * 100);
};

let setParams = function () {
  let loc = location.href;
  loc += loc.indexOf("?") === -1 ? "?" : "&";
  location.href = loc + "ts=true";

  return false;
};

// setParams();

$(document).ready(function () {
  rangeSlider();
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });
  $("select").on("change", function () {
    activeCurrency = Number(this.value);
    $(".currency-symbol").html(`${currencies[activeCurrency].currencySymbol}`);
    $("#range-6, #range-7").attr(
      "value",
      currencies[activeCurrency].hourlyWage
    );

    rangeSlider();
    console.log(
      "Active Currency::: ",
      currencies[activeCurrency].currencySymbol,
      activeCurrency
    );
  });
  $("#collapse-all").on("click", function () {
    if ($(this).hasClass("collapse-all")) {
      $(this).removeClass("collapse-all");
      $(".results-tab-content").removeClass("collapse");
      $(".results-tab-content").addClass("show");
      $(this).html("Expand all");
      $(".toggle-advanced").attr("aria-expanded", "true");
    } else {
      // $(this).addClass('collapse-all');
      $(this).addClass("collapse-all");
      $(".results-tab-content").removeClass("show");
      $(".results-tab-content").addClass("collapse");
      $(this).html("Collapse all");
      $(".toggle-advanced").attr("aria-expanded", "false");
    }
  });
});
