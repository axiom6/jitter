  // Static method utilities       - Util is a global without a functional wrapper
  // coffee -c -bare Util.coffee   - prevents function wrap to put Util in global namespace
  // Very important requires that Util.js be loaded first
var Util,
  hasProp = {}.hasOwnProperty;

Util = (function() {
  class Util {
    // ------ Modules ------
    static init(moduleCommonJS = void 0, moduleWebPack = void 0, root = '../../') {
      Util.root = root;
      Util.rootJS = Util.root + 'js/';
      Util.resetModuleExports();
      Util.fixTestGlobals();
      if (Util.isCommonJS && (moduleCommonJS != null)) {
        require(moduleCommonJS);
      } else if (Util.isWebPack && (moduleWebPack != null)) {
        Util.skipReady = true;
        Util.loadScript(moduleWebPack);
      } else {
        Util.error(`Bad arguments for Util.init() isCommonJS=${Util.isCommonJS},\nroot=${root}, moduleCommonJS=${(moduleCommonJS != null)}, moduleWebPack=${moduleWebPack}`);
      }
    }

    static initJasime() {
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
    static require(path) {
      if (Util.isCommonJS) {
        return require(path);
      } else {
        Util.warn('Util.require may not work with WebPack', path);
        return require(path);
      }
    }

    static fixTestGlobals() {
      window.Util = Util;
      return window.xUtil = Util;
    }

    static loadScript(path, fn) {
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

    static resetModuleExports() {
      if (Util.isCommonJS) {
        Util.module = require('module');
        Util.module.globalPaths.push("/Users/ax/Documents/prj/ui/");
      }
    }

    //window.global = window
    //til.log( "Node Module Paths", Util.module.globalPaths )
    static ready(fn) {
      if (!Util.isFunc(fn)) { // Sanity check
        return;
      } else if (Util.skipReady) {
        fn();
      } else if (document.readyState === 'complete') { // If document is already loaded, run method
        fn();
      } else {
        document.addEventListener('DOMContentLoaded', fn, false);
      }
    }

    // ---- Inquiry ----
    static hasMethod(obj, method, issue = false) {
      var has;
      has = typeof obj[method] === 'function';
      if (!has && issue) {
        Util.log('Util.hasMethod()', method, has);
      }
      return has;
    }

    static hasGlobal(global, issue = true) {
      var has;
      has = window[global] != null;
      if (!has && issue) {
        Util.error(`Util.hasGlobal() ${global} not present`);
      }
      return has;
    }

    static getGlobal(global, issue = true) {
      if (Util.hasGlobal(global, issue)) {
        return window[global];
      } else {
        return null;
      }
    }

    static hasPlugin(plugin, issue = true) {
      var glob, has, plug;
      glob = Util.firstTok(plugin, '.');
      plug = Util.lastTok(plugin, '.');
      has = (window[glob] != null) && (window[glob][plug] != null);
      if (!has && issue) {
        Util.error(`Util.hasPlugin()  $${glob + '.' + plug} not present`);
      }
      return has;
    }

    static hasModule(path, issue = true) {
      var has;
      has = Util.modules[path] != null;
      if (!has && issue) {
        Util.error(`Util.hasModule() ${path} not present`);
      }
      return has;
    }

    static dependsOn() {
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
    static setInstance(instance, path) {
      Util.log('Util.setInstance()', path);
      if ((instance == null) && (path != null)) {
        Util.error('Util.setInstance() instance not defined for path', path);
      } else if ((instance != null) && (path == null)) {
        Util.error('Util.setInstance() path not defined for instance', instance.toString());
      } else {
        Util.instances[path] = instance;
      }
    }

    static getInstance(path, dbg = false) {
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
    static toStrArgs(prefix, args) {
      var arg, j, len, str;
      Util.logStackNum = 0;
      str = Util.isStr(prefix) ? prefix + " " : "";
      for (j = 0, len = args.length; j < len; j++) {
        arg = args[j];
        str += Util.toStr(arg) + " ";
      }
      return str;
    }

    static toStr(arg) {
      Util.logStackNum++;
      if (Util.logStackNum > Util.logStackMax) {
        return '';
      }
      switch (typeof arg) {
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
    static toStrObj(arg) {
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

    static toStrStr(arg) {
      if (arg.length > 0) {
        return arg;
      } else {
        return '""';
      }
    }

    static toOut(obj, level = 0) {
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
    static noop() {
      if (false) {
        Util.log(arguments);
      }
    }

    // Conditional log arguments through console
    static dbg() {
      var str;
      if (!Util.debug) {
        return;
      }
      str = Util.toStrArgs('', arguments);
      Util.consoleLog(str);
    }

    //@gritter( { title:'Log', time:2000 }, str )
    static msg() {
      var str;
      if (!Util.message) {
        return;
      }
      str = Util.toStrArgs('', arguments);
      Util.consoleLog(str);
    }

    // Log Error and arguments through console and Gritter
    static error() {
      var str;
      str = Util.toStrArgs('Error:', arguments);
      Util.consoleLog(str);
    }

    // Log Warning and arguments through console and Gritter
    // Util.trace( 'Trace:' )
    static warn() {
      var str;
      str = Util.toStrArgs('Warning:', arguments);
      Util.consoleLog(str);
    }

    static toError() {
      var str;
      str = Util.toStrArgs('Error:', arguments);
      return new Error(str);
    }

    // Log arguments through console if it exists
    static log() {
      var str;
      str = Util.toStrArgs('', arguments);
      Util.consoleLog(str);
    }

    // Log arguments through gritter if it exists
    static called() {
      var str;
      str = Util.toStrArgs('', arguments);
      Util.consoleLog(str);
    }

    //@gritter( { title:'Called', time:2000 }, str )
    static gritter(opts, ...args) {
      var str;
      if (!(Util.hasGlobal('$', false) && ($['gritter'] != null))) {
        return;
      }
      str = Util.toStrArgs('', args);
      opts.title = opts.title != null ? opts.title : 'Gritter';
      opts.text = str;
    }

    static consoleLog(str) {
      if (typeof console !== "undefined" && console !== null) {
        console.log(str);
      }
    }

    static trace() {
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

    static alert() {
      var str;
      str = Util.toStrArgs('', arguments);
      Util.consoleLog(str);
      alert(str);
    }

    // Does not work
    static logJSON(json) {
      return Util.consoleLog(json);
    }

    // ------ Validators ------
    static isDef(d) {
      return d != null;
    }

    static isNot(d) {
      return !Util.isDef(d);
    }

    static isStr(s) {
      return (s != null) && typeof s === "string" && s.length > 0;
    }

    static isntStr(s) {
      return !Util.isStr(s);
    }

    static isNum(n) {
      return (n != null) && typeof n === "number" && !isNaN(n);
    }

    static isObj(o) {
      return (o != null) && typeof o === "object";
    }

    static isVal(v) {
      return typeof v === "number" || typeof v === "string" || typeof v === "boolean";
    }

    static isObjEmpty(o) {
      return Util.isObj(o) && Object.getOwnPropertyNames(o).length === 0;
    }

    static isFunc(f) {
      return (f != null) && typeof f === "function";
    }

    static isArray(a) {
      return (a != null) && typeof a !== "string" && (a.length != null) && a.length > 0;
    }

    static isEvent(e) {
      return (e != null) && (e.target != null);
    }

    static inIndex(a, i) {
      return Util.isArray(a) && 0 <= i && i < a.length;
    }

    static inArray(a, e) {
      return Util.isArray(a) && a.indexOf(e) > -1;
    }

    static inString(s, e) {
      return Util.isStr(s) && s.indexOf(e) > -1;
    }

    static atLength(a, n) {
      return Util.isArray(a) && a.length === n;
    }

    static head(a) {
      if (Util.isArray(a)) {
        return a[0];
      } else {
        return null;
      }
    }

    static tail(a) {
      if (Util.isArray(a)) {
        return a[a.length - 1];
      } else {
        return null;
      }
    }

    static time() {
      return new Date().getTime();
    }

    static isStrInteger(s) {
      return /^\s*(\+|-)?\d+\s*$/.test(s);
    }

    static isStrFloat(s) {
      return /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/.test(s);
    }

    static isStrCurrency(s) {
      return /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/.test(s);
    }

    //@isStrEmail:(s)   -> /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test(s)
    static isDefs() {
      var arg, j, len;
      for (j = 0, len = arguments.length; j < len; j++) {
        arg = arguments[j];
        if (arg == null) {
          return false;
        }
      }
      return true;
    }

    static copyProperties(to, from) {
      var key, val;
      for (key in from) {
        if (!hasProp.call(from, key)) continue;
        val = from[key];
        to[key] = val;
      }
      return to;
    }

    static contains(array, value) {
      return Util.isArray(array) && array.indexOf(value) !== -1;
    }

    // Screen absolute (left top width height) percent positioning and scaling

    // Percent array to position mapping
    static toPosition(array) {
      return {
        left: array[0],
        top: array[1],
        width: array[2],
        height: array[3]
      };
    }

    // Adds Percent from array for CSS position mapping
    static toPositionPc(array) {
      return {
        position: 'absolute',
        left: array[0] + '%',
        top: array[1] + '%',
        width: array[2] + '%',
        height: array[3] + '%'
      };
    }

    static cssPosition($, screen, port, land) {
      var array;
      array = screen.orientation === 'Portrait' ? port : land;
      $.css(Util.toPositionPc(array));
    }

    static xyScale(prev, next, port, land) {
      var xn, xp, xs, yn, yp, ys;
      [xp, yp] = prev.orientation === 'Portrait' ? [port[2], port[3]] : [land[2], land[3]];
      [xn, yn] = next.orientation === 'Portrait' ? [port[2], port[3]] : [land[2], land[3]];
      xs = next.width * xn / (prev.width * xp);
      ys = next.height * yn / (prev.height * yp);
      return [xs, ys];
    }

    // ----------------- Guarded jQuery dependent calls -----------------
    static resize(callback) {
      window.onresize = function() {
        return setTimeout(callback, 100);
      };
    }

    static resizeTimeout(callback, timeout = null) {
      window.onresize = function() {
        if (timeout != null) {
          clearTimeout(timeout);
        }
        return timeout = setTimeout(callback, 100);
      };
    }

    // ------ Html ------------
    static getHtmlId(name, type = '', ext = '') {
      var id;
      id = name + type + ext;
      return id.replace(/[ \.]/g, "");
    }

    static htmlId(name, type = '', ext = '') {
      var id;
      id = Util.getHtmlId(name, type, ext);
      if (Util.htmlIds[id] != null) {
        Util.error('Util.htmlId() duplicate html id', id);
      }
      Util.htmlIds[id] = id;
      return id;
    }

    // ------ Converters ------
    static extend(obj, mixin) {
      var method, name;
      for (name in mixin) {
        if (!hasProp.call(mixin, name)) continue;
        method = mixin[name];
        obj[name] = method;
      }
      return obj;
    }

    static include(klass, mixin) {
      return Util.extend(klass.prototype, mixin);
    }

    static eventErrorCode(e) {
      var errorCode;
      errorCode = (e.target != null) && e.target.errorCode ? e.target.errorCode : 'unknown';
      return {
        errorCode: errorCode
      };
    }

    static toName(s1) {
      var s2, s3, s4;
      s2 = s1.replace('_', ' ');
      s3 = s2.replace(/([A-Z][a-z])/g, ' $1');
      s4 = s3.replace(/([A-Z]+)/g, ' $1');
      return s4;
    }

    static toName1(s1) {
      var s2, s3;
      s2 = s1.replace('_', ' ');
      s3 = s2.replace(/([A-Z][a-z])/g, ' $1');
      return s3.substring(1);
    }

    static toSelect(name) {
      return name.replace(' ', '');
    }

    static indent(n) {
      var i, j, ref, str;
      str = '';
      for (i = j = 0, ref = n; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        str += ' ';
      }
      return str;
    }

    static hashCode(str) {
      var hash, i, j, ref;
      hash = 0;
      for (i = j = 0, ref = str.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
      }
      return hash;
    }

    static lastTok(str, delim) {
      return str.split(delim).pop();
    }

    static firstTok(str, delim) {
      if (Util.isStr(str) && (str.split != null)) {
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
    static pdfCSS(href) {
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

    static parseURI(uri) {
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
          [name, value] = nameValue.split('=');
          parse.params[name] = value;
        }
      }
      return parse;
    }

    static quicksort(array) {
      var a, head, large, small;
      if (array.length === 0) {
        return [];
      }
      head = array.pop();
      small = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = array.length; j < len; j++) {
          a = array[j];
          if (a <= head) {
            results.push(a);
          }
        }
        return results;
      })();
      large = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = array.length; j < len; j++) {
          a = array[j];
          if (a > head) {
            results.push(a);
          }
        }
        return results;
      })();
      return (Util.quicksort(small)).concat([head]).concat(Util.quicksort(large));
    }

    static pad(n) {
      if (n < 10) {
        return '0' + n;
      } else {
        return n;
      }
    }

    static padStr(n) {
      if (n < 10) {
        return '0' + n.toString();
      } else {
        return n.toString();
      }
    }

    // Return and ISO formated data string
    static isoDateTime(dateIn) {
      var date, pad;
      date = dateIn != null ? dateIn : new Date();
      Util.log('Util.isoDatetime()', date);
      Util.log('Util.isoDatetime()', date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes, date.getUTCSeconds);
      pad = function(n) {
        return Util.pad(n);
      };
      return date.getFullYear()(+'-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate()) + 'T' + pad(date.getUTCHours()) + ':' + pad(date.getUTCMinutes()) + ':' + pad(date.getUTCSeconds()) + 'Z');
    }

    static toHMS(unixTime) {
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
      time = `${hour}:${min}:${sec} ${ampm}`;
      return time;
    }

    // Generate four random hex digits
    static hex4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    // Generate a 32 bits hex
    static hex32() {
      var hex, i, j;
      hex = this.hex4();
      for (i = j = 1; j <= 4; i = ++j) {
        Util.noop(i);
        hex += this.hex4();
      }
      return hex;
    }

    // Return a number with fixed decimal places
    static toFixed(arg, dec = 2) {
      var num;
      num = (function() {
        switch (typeof arg) {
          case 'number':
            return arg;
          case 'string':
            return parseFloat(arg);
          default:
            return 0;
        }
      })();
      return num.toFixed(dec);
    }

    static toInt(arg) {
      switch (typeof arg) {
        case 'number':
          return Math.floor(arg);
        case 'string':
          return parseInt(arg);
        default:
          return 0;
      }
    }

    static toFloat(arg) {
      switch (typeof arg) {
        case 'number':
          return arg;
        case 'string':
          return parseFloat(arg);
        default:
          return 0;
      }
    }

    static toCap(str) {
      return str.charAt(0).toUpperCase() + str.substring(1);
    }

    static unCap(str) {
      return str.charAt(0).toLowerCase() + str.substring(1);
    }

    static toArray(objects, whereIn = null, keyField = 'id') {
      var array, j, key, len, object, where;
      where = whereIn != null ? whereIn : function() {
        return true;
      };
      array = [];
      if (Util.isArray(objects)) {
        for (j = 0, len = array.length; j < len; j++) {
          object = array[j];
          if (!(where(object))) {
            continue;
          }
          if ((object['id'] != null) && keyField !== 'id') {
            object[keyField] = object['id'];
          }
          array.push(object);
        }
      } else {
        for (key in objects) {
          if (!hasProp.call(objects, key)) continue;
          object = objects[key];
          if (!(where(key, object))) {
            continue;
          }
          object[keyField] = key;
          array.push(object);
        }
      }
      return array;
    }

    static toObjects(rows, whereIn = null, keyField = 'id') {
      var j, key, len, objects, row, where;
      where = whereIn != null ? whereIn : function() {
        return true;
      };
      objects = {};
      if (Util.isArray(rows)) {
        for (j = 0, len = rows.length; j < len; j++) {
          row = rows[j];
          if (!(where(row))) {
            continue;
          }
          if ((row['id'] != null) && keyField !== 'id') {
            row[keyField] = row['id'];
          }
          objects[row[keyField]] = row;
        }
      } else {
        for (key in rows) {
          row = rows[key];
          if (!(where(row))) {
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
    static match(regexp, text) {
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
    static match_here(regexp, text) {
      var cur, next;
      [cur, next] = [regexp[0], regexp[1]];
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
    static match_star(c, regexp, text) {
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

    static match_test() {
      Util.log(Util.match_args("ex", "some text"));
      Util.log(Util.match_args("s..t", "spit"));
      Util.log(Util.match_args("^..t", "buttercup"));
      Util.log(Util.match_args("i..$", "cherries"));
      Util.log(Util.match_args("o*m", "vrooooommm!"));
      return Util.log(Util.match_args("^hel*o$", "hellllllo"));
    }

    static match_args(regexp, text) {
      return Util.log(regexp, text, Util.match(regexp, text));
    }

    static svgId(name, type, svgType, check = false) {
      if (check) {
        return this.id(name, type, svgType);
      } else {
        return name + type + svgType;
      }
    }

    static css(name, type = '') {
      return name + type;
    }

    static icon(name, type, fa) {
      return name + type + ' fa fa-' + fa;
    }

    // json - "application/json;charset=utf-8"
    // svg
    static mineType(fileType) {
      var mine;
      mine = (function() {
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
      })();
      mine += ";charset=utf-8";
      return mine;
    }

    static saveFile(stuff, fileName, fileType) {
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

  };

  Util.myVar = 'myVar';

  Util.skipReady = false;

  Util.isCommonJS = false;

  Util.isWebPack = false;

  if (typeof module === "object" && typeof module.exports === "object") {
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

}).call(this);

// Export Util as a convenience, since it is not really needed since Util is a global
// Need to export at the end of the file.
// module.exports = # Util.Export( Util, 'js/util/Util' )
