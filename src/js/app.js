'use strict';

import $ from 'jquery';
import 'bootstrap';
import utils from './utils.js';
import '../css/style.scss';

let rangeValues = [];

let rangeSlider = function () {
    let slider = $('.range-slider'),
        range = $('.range-slider__range'),
        value = $('.range-slider__value');

    slider.each(function () {
        range.on('input', function () {
            $(this).next(value).html(utils.commaSeparateNumber(this.value));
            addAll();
        });
    });

    value.each(function () {
        let value = $(this).prev().attr('value');
        let id = $(this).prev().attr('id');

        $(this).html(utils.commaSeparateNumber(value));
        // addAll();
        console.log('id:', id, 'value:', value)
        rangeValues.push(id, value);
        console.log('range values', rangeValues)
    });
};

let addAll = function () {
    let sum = 0
    $('.range-slider__range').each(function () {
        sum += isNaN(this.value) || $.trim(this.value) === '' ? 0 : parseFloat(this.value);
    });
    $('#total-annual-value').html('$' + utils.commaSeparateNumber(sum));

}

// $('#assessment-cta').on('click', function () {
//     $('#assessment-wrap').hide();
//     $('.main-banner').addClass('results');
//     $('#results-wrap').show();
//     $('html, body').animate({ scrollTop: '0px' }, 500);
// })

$(document).ready(function () {

    rangeSlider();
    addAll();

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

});
