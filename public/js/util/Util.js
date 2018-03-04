'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Static method utilities       - Util is a global without a functional wrapper
// coffee -c -bare Util.coffee   - prevents function wrap to put Util in global namespace
// Very important requires that Util.js be loaded first
var Util,
    hasProp = {}.hasOwnProperty;

Util = function () {
  var Util = function () {
    function Util() {
      _classCallCheck(this, Util);
    }

    _createClass(Util, null, [{
      key: 'init',

      // ------ Modules ------
      value: function init() {
        var moduleCommonJS = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : void 0;
        var moduleWebPack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : void 0;
        var root = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '../../';

        Util.root = root;
        Util.rootJS = Util.root + 'js/';
        Util.resetModuleExports();
        Util.fixTestGlobals();
        if (Util.isCommonJS && moduleCommonJS != null) {
          require(moduleCommonJS);
        } else if (Util.isWebPack && moduleWebPack != null) {
          Util.skipReady = true;
          Util.loadScript(moduleWebPack);
        } else {
          Util.error('Bad arguments for Util.init() isCommonJS=' + Util.isCommonJS + ',\nroot=' + root + ', moduleCommonJS=' + (moduleCommonJS != null) + ', moduleWebPack=' + moduleWebPack);
        }
      }
    }, {
      key: 'initJasime',
      value: function initJasime() {
        Util.resetModuleExports();
        if (!Util.isCommonJS) {
          window.require = Util.loadScript;
        } else {
          Util.fixTestGlobals();
          window.exports = module.exports;
          window.jasmineRequire = window.exports;
        }
      }

      // Use to to prevent dynamic resolve in webpack where Util is not included
      // Need require for WebPath. For now can only warn

    }, {
      key: 'require',
      value: function (_require) {
        function require(_x) {
          return _require.apply(this, arguments);
        }

        require.toString = function () {
          return _require.toString();
        };

        return require;
      }(function (path) {
        if (Util.isCommonJS) {
          return require(path);
        } else {
          Util.warn('Util.require may not work with WebPack', path);
          return require(path);
        }
      })
    }, {
      key: 'fixTestGlobals',
      value: function fixTestGlobals() {
        window.Util = Util;
        return window.xUtil = Util;
      }
    }, {
      key: 'loadScript',
      value: function loadScript(path, fn) {
        var head, script;
        head = document.getElementsByTagName('head')[0];
        script = document.createElement('script');
        script.src = path;
        script.async = false;
        if (Util.isFunc(fn)) {
          script.onload = fn;
        }
        head.appendChild(script);
      }
    }, {
      key: 'resetModuleExports',
      value: function resetModuleExports() {
        if (Util.isCommonJS) {
          Util.module = require('module');
          Util.module.globalPaths.push("/Users/ax/Documents/prj/ui/");
        }
      }

      //window.global = window
      //til.log( "Node Module Paths", Util.module.globalPaths )

    }, {
      key: 'ready',
      value: function ready(fn) {
        if (!Util.isFunc(fn)) {
          // Sanity check
          return;
        } else if (Util.skipReady) {
          fn();
        } else if (document.readyState === 'complete') {
          // If document is already loaded, run method
          fn();
        } else {
          document.addEventListener('DOMContentLoaded', fn, false);
        }
      }

      // ---- Inquiry ----

    }, {
      key: 'hasMethod',
      value: function hasMethod(obj, method) {
        var issue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var has;
        has = typeof obj[method] === 'function';
        if (!has && issue) {
          Util.log('Util.hasMethod()', method, has);
        }
        return has;
      }
    }, {
      key: 'hasGlobal',
      value: function hasGlobal(global) {
        var issue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var has;
        has = window[global] != null;
        if (!has && issue) {
          Util.error('Util.hasGlobal() ' + global + ' not present');
        }
        return has;
      }
    }, {
      key: 'getGlobal',
      value: function getGlobal(global) {
        var issue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (Util.hasGlobal(global, issue)) {
          return window[global];
        } else {
          return null;
        }
      }
    }, {
      key: 'hasPlugin',
      value: function hasPlugin(plugin) {
        var issue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var glob, has, plug;
        glob = Util.firstTok(plugin, '.');
        plug = Util.lastTok(plugin, '.');
        has = window[glob] != null && window[glob][plug] != null;
        if (!has && issue) {
          Util.error('Util.hasPlugin()  $' + (glob + '.' + plug) + ' not present');
        }
        return has;
      }
    }, {
      key: 'hasModule',
      value: function hasModule(path) {
        var issue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var has;
        has = Util.modules[path] != null;
        if (!has && issue) {
          Util.error('Util.hasModule() ' + path + ' not present');
        }
        return has;
      }
    }, {
      key: 'dependsOn',
      value: function dependsOn() {
        var arg, has, j, len, ok;
        ok = true;
        for (j = 0, len = arguments.length; j < len; j++) {
          arg = arguments[j];
          has = Util.hasGlobal(arg, false) || Util.hasModule(arg, false) || Util.hasPlugin(arg, false);
          if (!has) {
            Util.error('Missing Dependency', arg);
          }
          if (has === false) {
            ok = has;
          }
        }
        return ok;
      }

      // ---- Instances ----

    }, {
      key: 'setInstance',
      value: function setInstance(instance, path) {
        Util.log('Util.setInstance()', path);
        if (instance == null && path != null) {
          Util.error('Util.setInstance() instance not defined for path', path);
        } else if (instance != null && path == null) {
          Util.error('Util.setInstance() path not defined for instance', instance.toString());
        } else {
          Util.instances[path] = instance;
        }
      }
    }, {
      key: 'getInstance',
      value: function getInstance(path) {
        var dbg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var instance;
        if (dbg) {
          Util.log('getInstance', path);
        }
        instance = Util.instances[path];
        if (instance == null) {
          Util.error('Util.getInstance() instance not defined for path', path);
        }
        return instance;
      }

      // ---- Logging -------

      // args should be the arguments passed by the original calling function
      // This method should not be called directly

    }, {
      key: 'toStrArgs',
      value: function toStrArgs(prefix, args) {
        var arg, j, len, str;
        Util.logStackNum = 0;
        str = Util.isStr(prefix) ? prefix + " " : "";
        for (j = 0, len = args.length; j < len; j++) {
          arg = args[j];
          str += Util.toStr(arg) + " ";
        }
        return str;
      }
    }, {
      key: 'toStr',
      value: function toStr(arg) {
        Util.logStackNum++;
        if (Util.logStackNum > Util.logStackMax) {
          return '';
        }
        switch (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) {
          case 'null':
            return 'null';
          case 'string':
            return Util.toStrStr(arg);
          case 'number':
            return arg.toString();
          case 'object':
            return Util.toStrObj(arg);
          default:
            return arg;
        }
      }

      // Recusively stringify arrays and objects

    }, {
      key: 'toStrObj',
      value: function toStrObj(arg) {
        var a, j, key, len, str, val;
        str = "";
        if (arg == null) {
          str += "null";
        } else if (Util.isArray(arg)) {
          str += "[ ";
          for (j = 0, len = arg.length; j < len; j++) {
            a = arg[j];
            str += Util.toStr(a) + ",";
          }
          str = str.substr(0, str.length - 1) + " ]";
        } else if (Util.isObjEmpty(arg)) {
          str += "{}";
        } else {
          str += "{ ";
          for (key in arg) {
            if (!hasProp.call(arg, key)) continue;
            val = arg[key];
            str += key + ":" + Util.toStr(val) + ", ";
          }
          str = str.substr(0, str.length - 2) + " }"; // Removes last comma
        }
        return str;
      }
    }, {
      key: 'toStrStr',
      value: function toStrStr(arg) {
        if (arg.length > 0) {
          return arg;
        } else {
          return '""';
        }
      }
    }, {
      key: 'toOut',
      value: function toOut(obj) {
        var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var ind, key, out, val;
        ind = Util.indent(level * 2);
        out = "";
        for (key in obj) {
          if (!hasProp.call(obj, key)) continue;
          val = obj[key];
          if (!(key.charAt(0) === key.charAt(0).toUpperCase())) {
            continue;
          }
          out += ind + key + '\n';
          if (Util.isObj(val)) {
            out += Util.toOut(val, level + 1);
          }
        }
        return out;
      }

      // Consume unused but mandated variable to pass code inspections

    }, {
      key: 'noop',
      value: function noop() {
        if (false) {
          Util.log(arguments);
        }
      }

      // Conditional log arguments through console

    }, {
      key: 'dbg',
      value: function dbg() {
        var str;
        if (!Util.debug) {
          return;
        }
        str = Util.toStrArgs('', arguments);
        Util.consoleLog(str);
      }

      //@gritter( { title:'Log', time:2000 }, str )

    }, {
      key: 'msg',
      value: function msg() {
        var str;
        if (!Util.message) {
          return;
        }
        str = Util.toStrArgs('', arguments);
        Util.consoleLog(str);
      }

      // Log Error and arguments through console and Gritter

    }, {
      key: 'error',
      value: function error() {
        var str;
        str = Util.toStrArgs('Error:', arguments);
        Util.consoleLog(str);
      }

      // Log Warning and arguments through console and Gritter
      // Util.trace( 'Trace:' )

    }, {
      key: 'warn',
      value: function warn() {
        var str;
        str = Util.toStrArgs('Warning:', arguments);
        Util.consoleLog(str);
      }
    }, {
      key: 'toError',
      value: function toError() {
        var str;
        str = Util.toStrArgs('Error:', arguments);
        return new Error(str);
      }

      // Log arguments through console if it exists

    }, {
      key: 'log',
      value: function log() {
        var str;
        str = Util.toStrArgs('', arguments);
        Util.consoleLog(str);
      }

      // Log arguments through gritter if it exists

    }, {
      key: 'called',
      value: function called() {
        var str;
        str = Util.toStrArgs('', arguments);
        Util.consoleLog(str);
      }

      //@gritter( { title:'Called', time:2000 }, str )

    }, {
      key: 'gritter',
      value: function gritter(opts) {
        var str;
        if (!(Util.hasGlobal('$', false) && $['gritter'] != null)) {
          return;
        }

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        str = Util.toStrArgs('', args);
        opts.title = opts.title != null ? opts.title : 'Gritter';
        opts.text = str;
      }
    }, {
      key: 'consoleLog',
      value: function consoleLog(str) {
        if (typeof console !== "undefined" && console !== null) {
          console.log(str);
        }
      }
    }, {
      key: 'trace',
      value: function trace() {
        var error, str;
        str = Util.toStrArgs('Trace:', arguments);
        Util.consoleLog(str);
        try {
          throw new Error(str);
        } catch (error1) {
          error = error1;
          Util.log(error.stack);
        }
      }
    }, {
      key: 'alert',
      value: function (_alert) {
        function alert() {
          return _alert.apply(this, arguments);
        }

        alert.toString = function () {
          return _alert.toString();
        };

        return alert;
      }(function () {
        var str;
        str = Util.toStrArgs('', arguments);
        Util.consoleLog(str);
        alert(str);
      })

      // Does not work

    }, {
      key: 'logJSON',
      value: function logJSON(json) {
        return Util.consoleLog(json);
      }

      // ------ Validators ------

    }, {
      key: 'isDef',
      value: function isDef(d) {
        return d != null;
      }
    }, {
      key: 'isNot',
      value: function isNot(d) {
        return !Util.isDef(d);
      }
    }, {
      key: 'isStr',
      value: function isStr(s) {
        return s != null && typeof s === "string" && s.length > 0;
      }
    }, {
      key: 'isntStr',
      value: function isntStr(s) {
        return !Util.isStr(s);
      }
    }, {
      key: 'isNum',
      value: function isNum(n) {
        return n != null && typeof n === "number" && !isNaN(n);
      }
    }, {
      key: 'isObj',
      value: function isObj(o) {
        return o != null && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === "object";
      }
    }, {
      key: 'isVal',
      value: function isVal(v) {
        return typeof v === "number" || typeof v === "string" || typeof v === "boolean";
      }
    }, {
      key: 'isObjEmpty',
      value: function isObjEmpty(o) {
        return Util.isObj(o) && Object.getOwnPropertyNames(o).length === 0;
      }
    }, {
      key: 'isFunc',
      value: function isFunc(f) {
        return f != null && typeof f === "function";
      }
    }, {
      key: 'isArray',
      value: function isArray(a) {
        return a != null && typeof a !== "string" && a.length != null && a.length > 0;
      }
    }, {
      key: 'isEvent',
      value: function isEvent(e) {
        return e != null && e.target != null;
      }
    }, {
      key: 'inIndex',
      value: function inIndex(a, i) {
        return Util.isArray(a) && 0 <= i && i < a.length;
      }
    }, {
      key: 'inArray',
      value: function inArray(a, e) {
        return Util.isArray(a) && a.indexOf(e) > -1;
      }
    }, {
      key: 'inString',
      value: function inString(s, e) {
        return Util.isStr(s) && s.indexOf(e) > -1;
      }
    }, {
      key: 'atLength',
      value: function atLength(a, n) {
        return Util.isArray(a) && a.length === n;
      }
    }, {
      key: 'head',
      value: function head(a) {
        if (Util.isArray(a)) {
          return a[0];
        } else {
          return null;
        }
      }
    }, {
      key: 'tail',
      value: function tail(a) {
        if (Util.isArray(a)) {
          return a[a.length - 1];
        } else {
          return null;
        }
      }
    }, {
      key: 'time',
      value: function time() {
        return new Date().getTime();
      }
    }, {
      key: 'isStrInteger',
      value: function isStrInteger(s) {
        return (/^\s*(\+|-)?\d+\s*$/.test(s)
        );
      }
    }, {
      key: 'isStrFloat',
      value: function isStrFloat(s) {
        return (/^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/.test(s)
        );
      }
    }, {
      key: 'isStrCurrency',
      value: function isStrCurrency(s) {
        return (/^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/.test(s)
        );
      }

      //@isStrEmail:(s)   -> /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test(s)

    }, {
      key: 'isDefs',
      value: function isDefs() {
        var arg, j, len;
        for (j = 0, len = arguments.length; j < len; j++) {
          arg = arguments[j];
          if (arg == null) {
            return false;
          }
        }
        return true;
      }
    }, {
      key: 'copyProperties',
      value: function copyProperties(to, from) {
        var key, val;
        for (key in from) {
          if (!hasProp.call(from, key)) continue;
          val = from[key];
          to[key] = val;
        }
        return to;
      }
    }, {
      key: 'contains',
      value: function contains(array, value) {
        return Util.isArray(array) && array.indexOf(value) !== -1;
      }

      // Screen absolute (left top width height) percent positioning and scaling

      // Percent array to position mapping

    }, {
      key: 'toPosition',
      value: function toPosition(array) {
        return {
          left: array[0],
          top: array[1],
          width: array[2],
          height: array[3]
        };
      }

      // Adds Percent from array for CSS position mapping

    }, {
      key: 'toPositionPc',
      value: function toPositionPc(array) {
        return {
          position: 'absolute',
          left: array[0] + '%',
          top: array[1] + '%',
          width: array[2] + '%',
          height: array[3] + '%'
        };
      }
    }, {
      key: 'cssPosition',
      value: function cssPosition($, screen, port, land) {
        var array;
        array = screen.orientation === 'Portrait' ? port : land;
        $.css(Util.toPositionPc(array));
      }
    }, {
      key: 'xyScale',
      value: function xyScale(prev, next, port, land) {
        var xn, xp, xs, yn, yp, ys;

        var _ref = prev.orientation === 'Portrait' ? [port[2], port[3]] : [land[2], land[3]];

        var _ref2 = _slicedToArray(_ref, 2);

        xp = _ref2[0];
        yp = _ref2[1];

        var _ref3 = next.orientation === 'Portrait' ? [port[2], port[3]] : [land[2], land[3]];

        var _ref4 = _slicedToArray(_ref3, 2);

        xn = _ref4[0];
        yn = _ref4[1];

        xs = next.width * xn / (prev.width * xp);
        ys = next.height * yn / (prev.height * yp);
        return [xs, ys];
      }

      // ----------------- Guarded jQuery dependent calls -----------------

    }, {
      key: 'resize',
      value: function resize(callback) {
        window.onresize = function () {
          return setTimeout(callback, 100);
        };
      }
    }, {
      key: 'resizeTimeout',
      value: function resizeTimeout(callback) {
        var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        window.onresize = function () {
          if (timeout != null) {
            clearTimeout(timeout);
          }
          return timeout = setTimeout(callback, 100);
        };
      }

      // ------ Html ------------

    }, {
      key: 'getHtmlId',
      value: function getHtmlId(name) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var ext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        var id;
        id = name + type + ext;
        return id.replace(/[ \.]/g, "");
      }
    }, {
      key: 'htmlId',
      value: function htmlId(name) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var ext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        var id;
        id = Util.getHtmlId(name, type, ext);
        if (Util.htmlIds[id] != null) {
          Util.error('Util.htmlId() duplicate html id', id);
        }
        Util.htmlIds[id] = id;
        return id;
      }

      // ------ Converters ------

    }, {
      key: 'extend',
      value: function extend(obj, mixin) {
        var method, name;
        for (name in mixin) {
          if (!hasProp.call(mixin, name)) continue;
          method = mixin[name];
          obj[name] = method;
        }
        return obj;
      }
    }, {
      key: 'include',
      value: function include(klass, mixin) {
        return Util.extend(klass.prototype, mixin);
      }
    }, {
      key: 'eventErrorCode',
      value: function eventErrorCode(e) {
        var errorCode;
        errorCode = e.target != null && e.target.errorCode ? e.target.errorCode : 'unknown';
        return {
          errorCode: errorCode
        };
      }
    }, {
      key: 'toName',
      value: function toName(s1) {
        var s2, s3, s4;
        s2 = s1.replace('_', ' ');
        s3 = s2.replace(/([A-Z][a-z])/g, ' $1');
        s4 = s3.replace(/([A-Z]+)/g, ' $1');
        return s4;
      }
    }, {
      key: 'toName1',
      value: function toName1(s1) {
        var s2, s3;
        s2 = s1.replace('_', ' ');
        s3 = s2.replace(/([A-Z][a-z])/g, ' $1');
        return s3.substring(1);
      }
    }, {
      key: 'toSelect',
      value: function toSelect(name) {
        return name.replace(' ', '');
      }
    }, {
      key: 'indent',
      value: function indent(n) {
        var i, j, ref, str;
        str = '';
        for (i = j = 0, ref = n; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          str += ' ';
        }
        return str;
      }
    }, {
      key: 'hashCode',
      value: function hashCode(str) {
        var hash, i, j, ref;
        hash = 0;
        for (i = j = 0, ref = str.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          hash = (hash << 5) - hash + str.charCodeAt(i);
        }
        return hash;
      }
    }, {
      key: 'lastTok',
      value: function lastTok(str, delim) {
        return str.split(delim).pop();
      }
    }, {
      key: 'firstTok',
      value: function firstTok(str, delim) {
        if (Util.isStr(str) && str.split != null) {
          return str.split(delim)[0];
        } else {
          Util.error("Util.firstTok() str is not at string", str);
          return '';
        }
      }

      /*
        parse = document.createElement('a')
        parse.href =  "http://example.com:3000/dir1/dir2/file.ext?search=test#hash"
        parse.protocol  "http:"
        parse.hostname  "example.com"
        parse.port      "3000"
        parse.pathname  "/dir1/dir2/file.ext"
        parse.segments  ['dir1','dir2','file.ext']
        parse.fileExt   ['file','ext']
        parse.file       'file'
        parse.ext        'ext'
        parse.search    "?search=test"
        parse.hash      "#hash"
        parse.host      "example.com:3000"
      */

    }, {
      key: 'pdfCSS',
      value: function pdfCSS(href) {
        var link;
        if (!window.location.search.match(/pdf/gi)) {
          return;
        }
        link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        document.getElementsByTagName('head')[0].appendChild(link);
      }
    }, {
      key: 'parseURI',
      value: function parseURI(uri) {
        var a, j, len, name, nameValue, nameValues, parse, value;
        parse = {};
        parse.params = {};
        a = document.createElement('a');
        a.href = uri;
        parse.href = a.href;
        parse.protocol = a.protocol;
        parse.hostname = a.hostname;
        parse.port = a.port;
        parse.segments = a.pathname.split('/');
        parse.fileExt = parse.segments.pop().split('.');
        parse.file = parse.fileExt[0];
        parse.ext = parse.fileExt.length === 2 ? parse.fileExt[1] : '';
        parse.dbName = parse.file;
        parse.fragment = a.hash;
        parse.query = Util.isStr(a.search) ? a.search.substring(1) : '';
        nameValues = parse.query.split('&');
        if (Util.isArray(nameValues)) {
          for (j = 0, len = nameValues.length; j < len; j++) {
            nameValue = nameValues[j];

            var _nameValue$split = nameValue.split('=');

            var _nameValue$split2 = _slicedToArray(_nameValue$split, 2);

            name = _nameValue$split2[0];
            value = _nameValue$split2[1];

            parse.params[name] = value;
          }
        }
        return parse;
      }
    }, {
      key: 'quicksort',
      value: function quicksort(array) {
        var a, head, large, small;
        if (array.length === 0) {
          return [];
        }
        head = array.pop();
        small = function () {
          var j, len, results;
          results = [];
          for (j = 0, len = array.length; j < len; j++) {
            a = array[j];
            if (a <= head) {
              results.push(a);
            }
          }
          return results;
        }();
        large = function () {
          var j, len, results;
          results = [];
          for (j = 0, len = array.length; j < len; j++) {
            a = array[j];
            if (a > head) {
              results.push(a);
            }
          }
          return results;
        }();
        return Util.quicksort(small).concat([head]).concat(Util.quicksort(large));
      }
    }, {
      key: 'pad',
      value: function pad(n) {
        if (n < 10) {
          return '0' + n;
        } else {
          return n;
        }
      }
    }, {
      key: 'padStr',
      value: function padStr(n) {
        if (n < 10) {
          return '0' + n.toString();
        } else {
          return n.toString();
        }
      }

      // Return and ISO formated data string

    }, {
      key: 'isoDateTime',
      value: function isoDateTime(dateIn) {
        var date, pad;
        date = dateIn != null ? dateIn : new Date();
        Util.log('Util.isoDatetime()', date);
        Util.log('Util.isoDatetime()', date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes, date.getUTCSeconds);
        pad = function pad(n) {
          return Util.pad(n);
        };
        return date.getFullYear()(+'-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate()) + 'T' + pad(date.getUTCHours()) + ':' + pad(date.getUTCMinutes()) + ':' + pad(date.getUTCSeconds()) + 'Z');
      }
    }, {
      key: 'toHMS',
      value: function toHMS(unixTime) {
        var ampm, date, hour, min, sec, time;
        date = Util.isNum(unixTime) ? new Date(unixTime * 1000) : new Date();
        hour = date.getHours();
        ampm = 'AM';
        if (hour > 12) {
          hour = hour - 12;
          ampm = 'PM';
        }
        min = ('0' + date.getMinutes()).slice(-2);
        sec = ('0' + date.getSeconds()).slice(-2);
        time = hour + ':' + min + ':' + sec + ' ' + ampm;
        return time;
      }

      // Generate four random hex digits

    }, {
      key: 'hex4',
      value: function hex4() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
      }

      // Generate a 32 bits hex

    }, {
      key: 'hex32',
      value: function hex32() {
        var hex, i, j;
        hex = this.hex4();
        for (i = j = 1; j <= 4; i = ++j) {
          Util.noop(i);
          hex += this.hex4();
        }
        return hex;
      }

      // Return a number with fixed decimal places

    }, {
      key: 'toFixed',
      value: function toFixed(arg) {
        var dec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

        var num;
        num = function () {
          switch (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) {
            case 'number':
              return arg;
            case 'string':
              return parseFloat(arg);
            default:
              return 0;
          }
        }();
        return num.toFixed(dec);
      }
    }, {
      key: 'toInt',
      value: function toInt(arg) {
        switch (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) {
          case 'number':
            return Math.floor(arg);
          case 'string':
            return parseInt(arg);
          default:
            return 0;
        }
      }
    }, {
      key: 'toFloat',
      value: function toFloat(arg) {
        switch (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) {
          case 'number':
            return arg;
          case 'string':
            return parseFloat(arg);
          default:
            return 0;
        }
      }
    }, {
      key: 'toCap',
      value: function toCap(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
      }
    }, {
      key: 'unCap',
      value: function unCap(str) {
        return str.charAt(0).toLowerCase() + str.substring(1);
      }
    }, {
      key: 'toArray',
      value: function toArray(objects) {
        var whereIn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var keyField = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'id';

        var array, j, key, len, object, where;
        where = whereIn != null ? whereIn : function () {
          return true;
        };
        array = [];
        if (Util.isArray(objects)) {
          for (j = 0, len = array.length; j < len; j++) {
            object = array[j];
            if (!where(object)) {
              continue;
            }
            if (object['id'] != null && keyField !== 'id') {
              object[keyField] = object['id'];
            }
            array.push(object);
          }
        } else {
          for (key in objects) {
            if (!hasProp.call(objects, key)) continue;
            object = objects[key];
            if (!where(object)) {
              continue;
            }
            object[keyField] = key;
            array.push(object);
          }
        }
        return array;
      }
    }, {
      key: 'toObjects',
      value: function toObjects(rows) {
        var whereIn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var keyField = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'id';

        var j, key, len, objects, row, where;
        where = whereIn != null ? whereIn : function () {
          return true;
        };
        objects = {};
        if (Util.isArray(rows)) {
          for (j = 0, len = rows.length; j < len; j++) {
            row = rows[j];
            if (!where(row)) {
              continue;
            }
            if (row['id'] != null && keyField !== 'id') {
              row[keyField] = row['id'];
            }
            objects[row[keyField]] = row;
          }
        } else {
          for (key in rows) {
            row = rows[key];
            if (!where(row)) {
              continue;
            }
            row[keyField] = key;
            objects[key] = row;
          }
        }
        return objects;
      }

      // Beautiful Code, Chapter 1.
      // Implements a regular expression matcher that supports character matches,
      // '.', '^', '$', and '*'.

      // Search for the regexp anywhere in the text.

    }, {
      key: 'match',
      value: function match(regexp, text) {
        if (regexp[0] === '^') {
          return Util.match_here(regexp.slice(1), text);
        }
        while (text) {
          if (Util.match_here(regexp, text)) {
            return true;
          }
          text = text.slice(1);
        }
        return false;
      }

      // Search for the regexp at the beginning of the text.

    }, {
      key: 'match_here',
      value: function match_here(regexp, text) {
        var cur, next;
        var _ref5 = [regexp[0], regexp[1]];
        cur = _ref5[0];
        next = _ref5[1];

        if (regexp.length === 0) {
          return true;
        }
        if (next === '*') {
          return Util.match_star(cur, regexp.slice(2), text);
        }
        if (cur === '$' && !next) {
          return text.length === 0;
        }
        if (text && (cur === '.' || cur === text[0])) {
          return Util.match_here(regexp.slice(1), text.slice(1));
        }
        return false;
      }

      // Search for a kleene star match at the beginning of the text.

    }, {
      key: 'match_star',
      value: function match_star(c, regexp, text) {
        while (true) {
          if (Util.match_here(regexp, text)) {
            return true;
          }
          if (!(text && (text[0] === c || c === '.'))) {
            return false;
          }
          text = text.slice(1);
        }
      }
    }, {
      key: 'match_test',
      value: function match_test() {
        Util.log(Util.match_args("ex", "some text"));
        Util.log(Util.match_args("s..t", "spit"));
        Util.log(Util.match_args("^..t", "buttercup"));
        Util.log(Util.match_args("i..$", "cherries"));
        Util.log(Util.match_args("o*m", "vrooooommm!"));
        return Util.log(Util.match_args("^hel*o$", "hellllllo"));
      }
    }, {
      key: 'match_args',
      value: function match_args(regexp, text) {
        return Util.log(regexp, text, Util.match(regexp, text));
      }
    }, {
      key: 'svgId',
      value: function svgId(name, type, svgType) {
        var check = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        if (check) {
          return this.id(name, type, svgType);
        } else {
          return name + type + svgType;
        }
      }
    }, {
      key: 'css',
      value: function css(name) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        return name + type;
      }
    }, {
      key: 'icon',
      value: function icon(name, type, fa) {
        return name + type + ' fa fa-' + fa;
      }

      // json - "application/json;charset=utf-8"
      // svg

    }, {
      key: 'mineType',
      value: function mineType(fileType) {
        var mine;
        mine = function () {
          switch (fileType) {
            case 'json':
              return "application/json";
            case 'adoc':
              return "text/plain";
            case 'html':
              return "text/html";
            case 'svg':
              return "image/svg+xml";
            default:
              return "text/plain";
          }
        }();
        mine += ";charset=utf-8";
        return mine;
      }
    }, {
      key: 'saveFile',
      value: function saveFile(stuff, fileName, fileType) {
        var blob, downloadLink, url;
        blob = new Blob([stuff], {
          type: this.mineType(fileType)
        });
        url = URL.createObjectURL(blob);
        downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    }]);

    return Util;
  }();

  ;

  Util.myVar = 'myVar';

  Util.skipReady = false;

  Util.isCommonJS = false;

  Util.isWebPack = false;

  if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
    Util.isCommonJS = true;
  } else {
    Util.isWebPack = true;
  }

  Util.Load = null;

  Util.ModuleGlobals = [];

  Util.app = {};

  Util.testTrue = true;

  Util.debug = false;

  Util.message = false;

  Util.count = 0;

  Util.modules = [];

  Util.instances = [];

  Util.globalPaths = [];

  Util.root = '../../'; // Used internally

  Util.rootJS = Util.root + 'js/';

  Util.databases = {};

  Util.htmlIds = {}; // Object of unique Html Ids

  Util.logStackNum = 0;

  Util.logStackMax = 100;

  Util.fills = {};

  return Util;
}.call(undefined);

// Export Util as a convenience, since it is not really needed since Util is a global
// Need to export at the end of the file.
// module.exports = # Util.Export( Util, 'js/util/Util' )
