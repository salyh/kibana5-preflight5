/*import expect from 'expect.js';
import masterNodes from '../masterNodes';


let testData = function (numberOfDataNodes) {
  return {
    'cluster': {
      'health': {
        'number_of_data_nodes': numberOfDataNodes
      }
    }
  };
};

describe('Odd Number of Data Nodes Rule', function () {
  it('even number of data nodes leads to failure', function () {
    expect (masterNodes.oddNumberOfDataNodes(testData(2)).status).to.be('red');
  });
  it('odd number of data nodes leads to success', function () {
    expect (masterNodes.oddNumberOfDataNodes(testData(3)).status).to.be('green');
  });
});*/
