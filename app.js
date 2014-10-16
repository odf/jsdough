'use strict';


var React = require('react');
var $ = React.DOM;

var convert = require('./obj4jmol');


var Uploader = React.createClass({
  displayName: 'Uploader',

  componentDidMount: function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = this.props.accept;
    input.multiple = this.props.multiple;
    input.addEventListener('change', this.loadFile);
    this._input = input;
  },

  loadFile: function(event) {
    var files = event.target.files;
    var handleData = this.props.handleData;
    var binary = this.props.binary;

    for (var i = 0; i < files.length; ++i) {
      (function(i) {
        var file = files[i];
        var reader = new FileReader();

        reader.onload = function(event) {
          handleData(event.target.result, file.name);
        };

        if (binary)
          reader.readAsDataURL(file);
        else
          reader.readAsText(file);
      })(i);
    }
  },

  openSelector: function() {
    this._input.click();
  },

  render: function() {
    return $.button({ onClick: this.openSelector }, this.props.prompt || 'Add');
  }
});


var App = React.createClass({
  displayName: 'App',

  getInitialState: function() {
    return {};
  },

  handleMtlData: function(data, filename) {
    this.setState({
      mtlData: data,
      mtlFile: filename
    });
  },

  handleObjData: function(data, filename) {
    this.setState({
      objData: data,
      objFile: filename
    });
  },

  renderResult: function() {
    var mtl = this.state.mtlData;
    var obj = this.state.objData;
    var output, name, blob;

    if (mtl && obj) {
      output = convert(mtl, obj);
      name = this.state.objFile.replace(/\.obj$/, '-jmol\.obj');
      blob = new Blob([output], { type: 'text/plain' });

      return $.a({ download: name,
                   href    : URL.createObjectURL(blob)
                 },
                 'Download result as '+name);
    } else
      return null;
  },

  render: function() {
    return $.div(null,
                 $.h1(null, 'JMOL Color Converter for Wavefront .obj Files'),
                 $.div(null,
                       Uploader({
                         prompt    : 'Load .mtl file',
                         binary    : false,
                         handleData: this.handleMtlData
                       }),
                       this.state.mtlFile),
                 $.div(null,
                       Uploader({
                         prompt    : 'Load .obj file',
                         binary    : false,
                         handleData: this.handleObjData
                       }),
                       this.state.objFile),
                 $.div({ className: 'separate' },
                       this.renderResult())
                );
  }
});


window.React = React; // wakes up the React Developer Tools

React.renderComponent(App(), document.getElementById('react-main'));
