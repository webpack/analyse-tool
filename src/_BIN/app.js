exports.stats      = null;
exports.mapModules = null;
exports.mapChunks  = null;

function load(stats) {
  stats.assets.sort(function (a, b) {
    return b.size - a.size;
  });
  stats.modules.sort(function (a, b) {
    return a.id - b.id;
  });
  const mapModules      = {};
  const mapModulesIdent = {};
  const mapModulesUid   = {};
  stats.modules.forEach(function (module, idx) {
    mapModules[module.id]                    = module;
    mapModulesIdent[`$${ module.identifier }`] = module;
    mapModulesUid[module.uid = idx]          = module;
    module.dependencies = [];
  });
  const mapChunks = {};
  stats.chunks.forEach(function (chunk) {
    mapChunks[chunk.id] = chunk;
    chunk.children      = [];
  });
  stats.modules.forEach(function (module) {
    module.reasons.forEach(function (reason) {
      const m = mapModulesIdent[`$${ reason.moduleIdentifier }`];
      if (!m) { return; }
      reason.moduleUid = m.uid;
      m.dependencies.push({
        type       : reason.type,
        moduleId   : module.id,
        moduleUid  : module.uid,
        module     : module.name,
        userRequest: reason.userRequest,
        loc        : reason.loc,
      });
    });
    module.issuerUid = mapModulesIdent[`$${ module.issuer }`] && mapModulesIdent[`$${ module.issuer }`].uid;
    (function setTimestamp(module) {
      if (typeof module.timestamp === 'number') { return module.timestamp; }
      if (!module.profile) { return; }
      const factory  = module.profile.factory || 0;
      const building = module.profile.building || 0;
      module.time  = factory + building;
      if (!module.issuer) { return module.timestamp = module.time; }
      const issuer = mapModulesIdent[`$${ module.issuer }`];
      if (!issuer) { return module.timestamp = NaN; }
      setTimestamp(issuer);
      module.timestamp = issuer.timestamp + module.time;
    }(module));
  });
  stats.chunks.forEach(function (chunk) {
    chunk.parents.forEach(function (parent) {
      const c = mapChunks[parent];
      c.children.push(chunk.id);
    });
    chunk.origins.forEach(function (origin) {
      const m = mapModulesIdent[`$${ origin.moduleIdentifier }`];
      if (!m) { return; }
      origin.moduleUid = m.uid;
    });
  });
  stats.modules.forEach(function (module) {
    module.dependencies.sort(function (a, b) {
      if (!a.loc && !b.loc) { return 0; }
      if (!a.loc) { return 1; }
      if (!b.loc) { return -1; }
      a = a.loc.split(/[:-]/);
      b = b.loc.split(/[:-]/);
      if (+a[0] < +b[0]) { return -1; }
      if (+a[0] > +b[0]) { return 1; }
      if (+a[1] < +b[1]) { return -1; }
      if (+a[1] > +b[1]) { return 1; }
      return 0;
    });
  });
  let maxLength = 0;
  stats.assets.forEach(function (a) {
    if (a.name.length > maxLength) { maxLength = a.name.length; }
  });
  stats.assets.forEach(function (a) {
    a.normalizedName = a.name;
    while (a.normalizedName.length < maxLength) {
      a.normalizedName = ` ${ a.normalizedName }`;
    }
  });
  stats.assets.sort(function (a, b) {
    a = a.normalizedName;
    b = b.normalizedName;
    return a < b ? -1 : 1;
  });
  exports.stats           = stats;
  exports.mapChunks       = mapChunks;
  exports.mapModules      = mapModules;
  exports.mapModulesUid   = mapModulesUid;
  exports.mapModulesIdent = mapModulesIdent;

  const ga = require('./googleAnalytics');
  ga('set', 'dimension1', `${ categorize(stats.modules.length) }`);
  ga('set', 'dimension2', `${ categorize(stats.chunks.length) }`);
  ga('set', 'dimension3', `${ categorize(stats.assets.length) }`);
  ga('set', 'dimension4', `${ categorize(stats.time) }`);
}

exports.load = function (stats) {
  const isMultiCompile = !stats.assets && !stats.modules && stats.children && stats.children.length > 1;
  if (isMultiCompile) {
    exports.loadPage('select', stats);
  } else {
    load(stats);
  }
};

function categorize(number) {
  if (number <= 0) { return 0; }
  let factor = 1;
  do {
    if (number <= 10) { return number * factor; }
    factor *= 10;
    number = Math.floor(number / 10);
  } while (number > 0);
  return '';
}
