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
        return val;
    }
};

export default utils;