const utils = {
    utilTest: function () {
        console.log('utils ready');
    },
    sortByKey: function (array, key) {
        return Array.sort(function (a, b) {
            let x = a[key];
            let y = b[key];
            return (
                (x < y)
                    ? -1
                    : (
                        (x > y)
                            ? 1
                            : 0
                    )
            )
        });
    }, commaSeparateNumber: function (val) {
        while (/(\d+)(\d{3})/.test(val.toString())) {
            val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
        }
        console.log(val)
        return val;
    }, parseNumber: function (str) {
        return Number(str.split('-')[1]);
    }, productivityBasic: function (a, b) {
        // console.log('from utils', Number(Math.round(a * b * 10.93 * 0.9947643979)));
        return Number(Math.round(((a * b) * 10.93) * 0.9947643979));
    }, p1: function (a, b) {
        return Number(Math.round((a * 7.35) * (b * 0.3333333333333)));
    }, p2: function (a, b, c, d) {
        return Number((a + b) * 1.5) * ((2.5 * c) + (8 * d));
    }, p3: function (a, b) {
        return (Number(a * 8) * b);
    }, p4: function (a, b) {
        return (Number(a * 500) * b);
    }, p5: function (a, b) {
        return (Number((a * 12.5) * 0.95) * b);
    }, securityBasic: function (a) {
        return (((a * 10) * 0.416) * 0.296) * 0.999;
    }, s1: function (a) {
        return (a * 0.04) * 0.9;
    }, s2: function (a, b, c, d, e) {
        let step1 = ((a * 147) / 60);
        let step2 = ((b + c) * 12);
        let step3 = (c * 6);
        let step4 = (d * 500);
        let step5 = (step1 + step2 + step3 + step4);
        let step6 = (step4 / 2000);
        let step7 = Math.min(step5, step6) * 10;
        let step8 = (step7 * 0.1);

        return (step7 * step8);

    }
};

export default utils;