import utils from './utils.js'

const results = {
    init: function() {
        utils.getUrlVars();
        utils.setParams();
    },
    showFinal: function() {
        console.log('final results revealed');
    }
};

export default results;