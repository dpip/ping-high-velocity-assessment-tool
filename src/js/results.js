import utils from './utils.js'

const results = {
    init: function() {
        utils.getUrlVars();
        
    },
    showFinal: function() {
        console.log('final results revealed', utils.productivityBasic);
    }
};

export default results;