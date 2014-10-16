'use strict';


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
          return Math.floor(parseFloat(s) * 255.99).toString(16);
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
        return line;
    })
    .join('\n');
};
