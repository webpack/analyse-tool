const app               = require('../app');
const Sigma             = require('sigma');
const findById          = require('../../utils/findById');
const percentageToColor = require('../../utils/percentageToColor').greenRed;

const element = document.getElementById('sigma-chunks');

const nodes      = [];
const edges      = [];
const chunkCount = app.stats.chunks.length;
let maxSize    = 0;
app.stats.chunks.forEach((chunk, idx) => {
  if (chunk.size > maxSize) { maxSize = chunk.size; }
});
app.stats.chunks.forEach((chunk, idx) => {
  const color = percentageToColor(Math.pow((chunk.size + 1) / (maxSize + 1), 1 / 4));
  nodes.push({
    id        : `chunk${chunk.id}`,
    chunkId   : chunk.id,
    size      : Math.ceil(Math.sqrt(chunk.size + 1)),
    type      : 'webpack',
    shortLabel: `${ chunk.id }`,
    label     : `[${ chunk.id }] ${ chunk.origins.map(o => o.reasons.concat(o.name).concat(o.moduleName).join(' ')).join(', ') }`,
    x         : (Math.cos(idx / chunkCount * Math.PI * 2) * chunkCount),
    y         : (Math.sin(idx / chunkCount * Math.PI * 2) * chunkCount),
    color     : color,
  });
});
app.stats.chunks.forEach(function (chunk) {
  chunk.parents.forEach(function (parent) {
    edges.push({
      id    : `edge${ chunk.id }-${ parent }`,
      source: `chunk${ parent }`,
      target: `chunk${ chunk.id }`,
      arrow : 'target',
      type  : 'arrow',
      size  : chunk.parents.length,
    });
  });
});
const s = new Sigma({
  graph   : {
    nodes: nodes,
    edges: edges,
  },
  renderer: {
    type     : 'canvas',
    container: element,
  },
  settings: {
    edgeColor  : 'target',
    maxNodeSize: 20,
    minNodeSize: 4,
    maxEdgeSize: 3,
    minEdgeSize: 1,
  },
});
s.bind('clickNode', function (e) {
  window.location.hash = `#chunk/${ e.data.node.chunkId }`;
});

s.refresh();

exports.show = function () {
  element.style.display = 'block';
  s.refresh();
  s.startForceAtlas2();
  s.renderers[0].resize();
};

exports.hide = function () {
  element.style.display = 'none';
  s.stopForceAtlas2();
};
