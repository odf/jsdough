'use strict';


var asHex = function(x) {
  return Math.floor(x * 255.99 + 256).toString(16).slice(1);
};


var extractMaterialDefinitions = function(text) {
  var current = null;
  var definitions = {};

  text.split(/[\n\r]+/).forEach(
    function(line) {
      var fields = line.trim().split(/\s+/);
      if (fields[0] == 'newmtl') {
        current = fields[1];
      } else if (fields[0] == 'Kd') {
        var rgb = fields.slice(1).map(function(s) {
          return asHex(parseFloat(s.replace(/,/, '.')));
        }).join('');

        definitions[current] = 'k'+rgb.toUpperCase();
      }
    }
  );

  return definitions;
};


module.exports = function(mtlFileContents, objFileContents) {
  var materials = extractMaterialDefinitions(mtlFileContents);

  return objFileContents.split(/[\n\r]+/).map(
    function(line) {
      var fields = line.trim().split(/\s+/);

      if (fields[0] == 'g' || fields[0] == 'mtllib') {
        return '';
      } else if (fields[0] == 'usemtl') {
        return 'g '+materials[fields[1]];
      } else
        return line.replace(/,/g, '.');
    })
    .join('\n');
};
