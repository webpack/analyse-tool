import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils'; 
import test from 'tape';
import Main from './main';

test('Main component', (t) => {
  var root = TestUtils.renderIntoDocument(<Main/>);
  debugger
  t.ok(root, 'Componenet is ok');
  t.end();
});
