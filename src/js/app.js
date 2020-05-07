'use strict';

import $ from 'jquery';
import 'bootstrap';
import utils from './utils.js';
import '../css/style.scss';

let rangeValues = [];
let activeCurrency = 0;
let currencies = [{
    'type': 'us',
    'dataBreach': 8190000,
    'securityBreach': 0.07
},
{
    'type': 'uk',
    'dataBreach': 3920000,
    'securityBreach': 0.07

},
{
    'type': 'au',
    'dataBreach': 3920000,
    'securityBreach': 0.07
},
{
    'type': 'eu',
    'dataBreach': 3920000,
    'securityBreach': 0.07

}];


let rangeSlider = function () {
    let r = rangeValues;
    let slider = $('.range-slider'),
        range = $('.range-slider__range'),
        value = $('.range-slider__value');

    slider.each(function () {
        range.on('input', function () {
            let id = utils.parseNumber($(this).attr('id'));
            let updatedValue = Number(this.value);
            let sum = $('#total-annual-value');
            $(this).next(value).html(utils.commaSeparateNumber(this.value));
            rangeValues[id] = updatedValue;

            $('#cat1').html('$' + `${utils.commaSeparateNumber(calcProductivity(rangeValues))}`);
            $('#cat2').html('$' + `${utils.commaSeparateNumber(calcSecurity(rangeValues))}`);
            $('#cat3').html('$' + `${utils.commaSeparateNumber(calcAgility(rangeValues))}`);

            // $('#cat2').html('$' + `${calcSecurity(rangeValues)}`);
            // console.log(calcSecurity(rangeValues));
            // console.log('from slider::: Range', calcSecurity(rangeValues));
            $('#total-annual-value').html('$' + utils.commaSeparateNumber(calcAll()));
        });

    });

    value.each(function () {
        let value = $(this).prev().attr('value');
        let id = $(this).prev().attr('id');
        let sum = $('#total-annual-value');

        $(this).html(utils.commaSeparateNumber(value));
        rangeValues.push(Number(value));

        $('#cat1').html('$' + `${utils.commaSeparateNumber(calcProductivity(rangeValues))}`);
        $('#cat2').html('$' + `${utils.commaSeparateNumber(calcSecurity(rangeValues))}`);
        $('#cat3').html('$' + `${utils.commaSeparateNumber(calcAgility(rangeValues))}`);

        // console.log('from slider::: VAlUE', calcSecurity(rangeValues));
        $('#total-annual-value').html('$' + utils.commaSeparateNumber(calcAll()));
    });
};

let calcProductivity = function (rangeValues) {
    let r = rangeValues;
    let p0 = utils.productivityBasic(r[0], r[7])
    let p1 = utils.p1(r[0], r[7]);
    let p2 = utils.p2(r[2], r[3], r[6], r[7]);
    let p3 = utils.p3(r[2], r[6]);
    let p4 = utils.p4(r[6], r[5]);
    let p5 = utils.p5(r[0], r[7]);
    // console.log('from calc', r);
    let sumProductivity = Number(p0 + p1 + p2 + p3 + p4 + p5);

    return sumProductivity;
}

let calcSecurity = function (rangeValues) {
    let r = rangeValues;
    let basicRef = currencies[activeCurrency].dataBreach;

    let s0 = Math.round(utils.securityBasic(Number(currencies[activeCurrency].dataBreach)));
    let s1 = Math.round(utils.s1(r[1], Number(currencies[activeCurrency].securityBreach)));
    let s2 = Math.round(utils.s2(r[0], r[3], r[4], r[2], r[5], r[4], Number(basicRef)));

    let sumSecurity = (s0 + s1) + s2;

    // let s2 = utils.s2(r[0], r[0], r[0], r[0]);s0
    console.log("individual functions security:::", s0, s1, s2);
    console.log('TOTAL SUM OF SECURITY:::', sumSecurity);

    return Number(Math.round(sumSecurity));
}

let calcAgility = function (rangeValues) {
    let r = rangeValues;
    let a0 = utils.agilityBasic(r[2], r[3]);
    // console.log('from calc', r);
    let sumAgility = a0;

    return sumAgility;
}


let calcAll = function () {
    return (calcProductivity(rangeValues) + calcSecurity(rangeValues) + calcAgility(rangeValues));
}


$(document).ready(function () {

    rangeSlider();
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
    $('select').on('change', function () {
        activeCurrency = Number(this.value);
        console.log('Active Currency::: ', currencies[activeCurrency].type);
    });

});
