var strategies = {
  strategyA: function () {
    return "Result of strategy A";
  },
  strategyB: function () {
    return "Result of strategy B";
  },
  strategyC: function () {
    return "Result of strategy C";
  },
};

var searchContext = {
  strategy: null,
  search: function () {
    return this.strategy();
  },
};

var UPS = function () {
  this.calculate = function (package) {
    // calculations...
    return "$45.95";
  };
};

var USPS = function () {
  this.calculate = function (package) {
    // calculations...
    return "$39.40";
  };
};

var Fedex = function () {
  this.calculate = function (package) {
    // calculations...
    return "$43.20";
  };
};

function run() {
  var package = { from: "76712", to: "10012", weigth: "lkg" };

  // the 3 strategies

  var ups = new UPS();
  var usps = new USPS();
  var fedex = new Fedex();

  var shipping = new Shipping();

  shipping.setStrategy(ups);
  console.log("UPS Strategy: " + shipping.calculate(package));
  shipping.setStrategy(usps);
  console.log("USPS Strategy: " + shipping.calculate(package));
  shipping.setStrategy(fedex);
  console.log("Fedex Strategy: " + shipping.calculate(package));
}
