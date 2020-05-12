const utils = {
  utilTest: function () {
    console.log("utils ready");
  },
  sortByKey: function (array, key) {
    return Array.sort(function (a, b) {
      let x = a[key];
      let y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  },
  commaSeparateNumber: function (val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
      val = val.toString().replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
    }
    console.log(val);
    return val;
  },
  parseNumber: function (str) {
    return Number(str.split("-")[1]);
  },
  productivityBasic: function (a, b) {
    return Number(Math.round(a * b * 10.93 * 0.9947643979));
  },
  p1: function (a, b) {
    return Number(Math.round(a * 7.35 * (b * 0.3333333333333)));
  },
  p2: function (a, b, c, d) {
    return Number((a + b) * 1.5) * (2.5 * c + 8 * d);
  },
  p3: function (a, b) {
    return Number(a * 8) * b;
  },
  p4: function (a, b) {
    return Number(a * 500) * b;
  },
  p5: function (a, b) {
    return Number(a * 12.5 * 0.95) * b;
  },
  securityBasic: function (a) {
    return a * 10 * 0.416 * 0.296 * 0.999;
  },
  s1: function (a, b) {
    return a * 0.04 * 0.057868 * b;
  },
  s2: function (a, b, c, d, e, f, g) {
    let step1 = Number((a * 147) / 60);
    let step2 = Number((b + c) * 12);
    let step3 = Number(d * 6);
    let step4 = Number(e * 500);
    let step5 = Number(step1 + step2 + step3 + step4);
    let step6 = Number(step5 / 2000);
    let step7 = Math.min(step6, f);
    let step8 = Number(g * 0.1);
    let step9 = Number(step7 * step8);
    console.log("STEP 7", step7);
    return Number(step9);
  },
  agilityBasic: function (a, b) {
    return (a + b) * 1.2 * 3800;
  },
};

export default utils;
