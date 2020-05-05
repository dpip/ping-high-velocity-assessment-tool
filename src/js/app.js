'use strict';

import $ from 'jquery';
import 'bootstrap';
import utils from './utils.js';
import '../css/style.scss';

let rangeValues = [];

let rangeSlider = function () {
    let r = rangeValues;
    let slider = $('.range-slider'),
        range = $('.range-slider__range'),
        value = $('.range-slider__value');

    slider.each(function () {
        range.on('input', function () {
            let id = utils.parseNumber($(this).attr('id'));
            let updatedValue = Number(this.value);
            $(this).next(value).html(utils.commaSeparateNumber(this.value));
            // addAll();
            rangeValues[id] = updatedValue;
            console.log('from slider', updatedValue);
            $('#cat1').html('$' + `${calcProductivity(rangeValues)}`);
            $('#cat2').html('$' + `${calcSecurity(rangeValues)}`);

        });

    });

    value.each(function () {
        let value = $(this).prev().attr('value');
        let id = $(this).prev().attr('id');

        $(this).html(utils.commaSeparateNumber(value));
        // addAll();
        rangeValues.push(Number(value));

        $('#cat1').html('$' + `${calcProductivity(rangeValues)}`);
        $('#cat2').html('$' + `${calcSecurity(rangeValues)}`);
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

    return utils.commaSeparateNumber(sumProductivity);
}

let calcSecurity = function (rangeValues) {
    let r = rangeValues;
    // let s0 = utils.securityBasic(r[0], r[3], r[4], r[2], r[5]);

    // console.log('from calc', r);
    // let sumProductivity = Number(s0 + s1 + s2, s3, s4, s5);

    // return utils.commaSeparateNumber(sumSecurity);
}

// let calcAgility = function (rangeValues) {
//     let r = rangeValues;
//     let p0 = utils.productivityBasic(r[0], r[7])
//     let p1 = utils.p1(r[0], r[7]);
//     let p2 = utils.p2(r[2], r[3], r[6], r[7]);
//     let p3 = utils.p3(r[2], r[6]);
//     let p4 = utils.p4(r[6], r[5]);
//     let p5 = utils.p5(r[0], r[7]);
//     // console.log('from calc', r);
//     let sumProductivity = Number(p0 + p1 + p2 + p3 + p4 + p5);

//     return utils.commaSeparateNumber(sumProductivity);
// }

let addAll = function () {
    let sum = 0
    $('.range-slider__range').each(function () {
        sum += isNaN(this.value) || $.trim(this.value) === '' ? 0 : parseFloat(this.value);
    });
    $('#total-annual-value').html('$' + utils.commaSeparateNumber(sum));

}

$(document).ready(function () {

    rangeSlider();
    addAll();
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
});
