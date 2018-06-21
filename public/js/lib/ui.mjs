var Util,
  hasProp = {}.hasOwnProperty;

Util = (function() {
  class Util {
    // ------ Modules ------
    /*
    Util.module     =  if window['module']? then window['module'] else null
    if Util.module? and typeof Util.module is "object" and typeof Util.module.exports  is "object"
      Util.isCommonJS = true
    else
      Util.isWebPack  = true

    @init:( moduleCommonJS=undefined, moduleWebPack=undefined, root='../../'  ) ->
      Util.root   = root
      Util.rootJS = Util.root + 'js/'
      Util.resetModuleExports()
      Util.fixTestGlobals()
      if     Util.isCommonJS and moduleCommonJS?
        require( moduleCommonJS )
      else if Util.isWebPack and moduleWebPack?
        Util.skipReady = true
        Util.loadScript( moduleWebPack )
      else
        console.error( """Bad arguments for Util.init() isCommonJS=#{Util.isCommonJS},
          root=#{root}, moduleCommonJS=#{moduleCommonJS?}, moduleWebPack=#{moduleWebPack}""" )
      return

    @initJasime:() ->
      Util.resetModuleExports()
      if not Util.isCommonJS
        window.require = Util.loadScript
      else
        Util.fixTestGlobals()
        window.exports        = Util.module.exports
        window.jasmineRequire = window.exports
      return

     * Use to to prevent dynamic resolve in webpack where Util is not included
     * Need require for WebPath. For now can only warn
    @require:( path ) ->
      if Util.isCommonJS
        require( path )
      else
        Util.warn( 'Util.require may not work with WebPack', path )
        require( path )

    @fixTestGlobals:() ->
      window.Util           = Util
      window.xUtil          = Util

    @resetModuleExports:() ->
      if Util.isCommonJS
         Util.module = require('module')
         Util.module.globalPaths.push("/Users/ax/Documents/prj/ui/")
         #window.global = window
         #console.log( "Node Module Paths", Util.module.globalPaths )
      return

     */
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
        console.log('Util.hasMethod()', method, has);
      }
      return has;
    }

    static hasGlobal(global, issue = true) {
      var has;
      has = window[global] != null;
      if (!has && issue) {
        console.error(`Util.hasGlobal() ${global} not present`);
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

    static hasModule(path, issue = true) {
      var has;
      has = Util.modules[path] != null;
      if (!has && issue) {
        console.error(`Util.hasModule() ${path} not present`);
      }
      return has;
    }

    static dependsOn() {
      var arg, has, j, len1, ok;
      ok = true;
      for (j = 0, len1 = arguments.length; j < len1; j++) {
        arg = arguments[j];
        has = Util.hasGlobal(arg, false) || Util.hasModule(arg, false) || Util.hasPlugin(arg, false);
        if (!has) {
          console.error('Missing Dependency', arg);
        }
        if (has === false) {
          ok = has;
        }
      }
      return ok;
    }

    // ---- Instances ----
    static setInstance(instance, path) {
      console.log('Util.setInstance()', path);
      if ((instance == null) && (path != null)) {
        console.error('Util.setInstance() instance not defined for path', path);
      } else if ((instance != null) && (path == null)) {
        console.error('Util.setInstance() path not defined for instance', instance.toString());
      } else {
        Util.instances[path] = instance;
      }
    }

    static getInstance(path, dbg = false) {
      var instance;
      if (dbg) {
        console.log('getInstance', path);
      }
      instance = Util.instances[path];
      if (instance == null) {
        console.error('Util.getInstance() instance not defined for path', path);
      }
      return instance;
    }

    // ---- Logging -------

    // args should be the arguments passed by the original calling function
    // This method should not be called directly
    static toStrArgs(prefix, args) {
      var arg, j, len1, str;
      Util.logStackNum = 0;
      str = Util.isStr(prefix) ? prefix + " " : "";
      for (j = 0, len1 = args.length; j < len1; j++) {
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
      var a, j, key, len1, str, val;
      str = "";
      if (arg == null) {
        str += "null";
      } else if (Util.isArray(arg)) {
        str += "[ ";
        for (j = 0, len1 = arg.length; j < len1; j++) {
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
    static noop(...args) {
    }

    static toError() {
      var str;
      str = Util.toStrArgs('Error:', arguments);
      return new Error(str);
    }

    static alert() {
      var str;
      str = Util.toStrArgs('', arguments);
      console.log(str);
      alert(str);
    }

    static logJSON(json) {
      var obj;
      obj = JSON.parse(json);
      console.log(obj);
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

    static isNaN(v) {
      return Util.isDef(v) && typeof v === "number" && Number.isNaN(v);
    }

    static isSym(v) {
      return typeof v === "symbol";
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

    static atArray(a, e) {
      if (Util.inArray(a, e)) {
        return a.indexOf(e);
      } else {
        return -1;
      }
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
      var arg, j, len1;
      for (j = 0, len1 = arguments.length; j < len1; j++) {
        arg = arguments[j];
        if (arg == null) {
          return false;
        }
      }
      return true;
    }

    static checkTypes(type, args) {
      var arg, key;
      for (key in args) {
        if (!hasProp.call(args, key)) continue;
        arg = args[key];
        //console.log( "Util.checkTypes(type,args) argument #{key} #{type}", arg )
        if (!Util.checkType(type, arg)) {
          console.log(`Util.checkTypes(type,args) argument ${key} is not ${type}`, arg);
          console.trace();
        }
      }
    }

    static checkType(type, arg) {
      switch (type) {
        case "string":
          return Util.isStr(arg);
        case "number":
          return Util.isNum(arg);
        case "object":
          return Util.isObj(arg);
        case "symbol":
          return Util.isSym(arg);
        case "function":
          return Util.isFunc(arg);
        case "array":
          return Util.isArray(arg);
        default:
          return false;
      }
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
        console.error('Util.htmlId() duplicate html id', id);
      }
      Util.htmlIds[id] = id;
      return id;
    }

    static clearHtmlIds() {
      return Util.htmlIds = {};
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
      var s2, s3, s4, s5;
      s2 = s1.replace('_', ' ');
      s3 = s2.replace(/([A-Z][a-z])/g, ' $1');
      s4 = s3.replace(/([A-Z]+)/g, ' $1');
      s5 = s4.replace(/([0-9][A-Z])/g, ' $1');
      return s5;
    }

    static toName1(s1) {
      var s2, s3;
      s2 = s1.replace('_', ' ');
      s3 = s2.replace(/([A-Z][a-z])/g, ' $1');
      return s3.substring(1);
    }

    static indent(n) {
      var i, j, ref, str;
      str = '';
      for (i = j = 0, ref = n; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        str += ' ';
      }
      return str;
    }

    static hashCode(str) {
      var hash, i, j, ref;
      hash = 0;
      for (i = j = 0, ref = str.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
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
        console.error("Util.firstTok() str is not at string", str);
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
      var a, j, len1, name, nameValue, nameValues, parse, value;
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
        for (j = 0, len1 = nameValues.length; j < len1; j++) {
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
        var j, len1, results;
        results = [];
        for (j = 0, len1 = array.length; j < len1; j++) {
          a = array[j];
          if (a <= head) {
            results.push(a);
          }
        }
        return results;
      })();
      large = (function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = array.length; j < len1; j++) {
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
      console.log('Util.isoDatetime()', date);
      console.log('Util.isoDatetime()', date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes, date.getUTCSeconds);
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
      var array, j, key, len1, object, where;
      where = whereIn != null ? whereIn : function() {
        return true;
      };
      array = [];
      if (Util.isArray(objects)) {
        for (j = 0, len1 = array.length; j < len1; j++) {
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
      var j, key, len1, objects, row, where;
      where = whereIn != null ? whereIn : function() {
        return true;
      };
      objects = {};
      if (Util.isArray(rows)) {
        for (j = 0, len1 = rows.length; j < len1; j++) {
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

    static lenObject(object, where = function() {
        return true;
      }) {
      var key, len, obj;
      len = 0;
      for (key in object) {
        if (!hasProp.call(object, key)) continue;
        obj = object[key];
        if (where(key)) {
          len = len + 1;
        }
      }
      return len;
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
      console.log(Util.match_args("ex", "some text"));
      console.log(Util.match_args("s..t", "spit"));
      console.log(Util.match_args("^..t", "buttercup"));
      console.log(Util.match_args("i..$", "cherries"));
      console.log(Util.match_args("o*m", "vrooooommm!"));
      return console.log(Util.match_args("^hel*o$", "hellllllo"));
    }

    static match_args(regexp, text) {
      return console.log(regexp, text, Util.match(regexp, text));
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
      url = window['URL'].createObjectURL(blob);
      downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }

  }
  Util.myVar = 'myVar';

  Util.skipReady = false;

  Util.isCommonJS = false;

  Util.isWebPack = false;

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

}).call(undefined);

var Util$1 = Util;

var Database;

Database = (function() {
  class Database {
    //nodejDataURI = 'file:../../data'
    static dataURI() {
      if (Util$1.isCommonJS) {
        return Database.nodejDataURI;
      } else {
        return Database.localDataURI;
      }
    }

    // ------ Quick JSON access ------
    static read(url, doJson) {
      if (Util$1.isObj(url)) {
        Database.readFile(url, doJson);
      } else if ('file:' === Util$1.parseURI(url).protocol) {
        Database.readRequire(url, doJson);
      } else {
        Database.readAjax(url, doJson);
      }
    }

    static readFile(fileObj, doJson) {
      var fileReader;
      fileReader = new FileReader();
      fileReader.onerror = function(e) {
        return console.error('Store.readFile', fileObj.name, e.target.error);
      };
      fileReader.onload = function(e) {
        return doJson(JSON.parse(e.target.result));
      };
      fileReader.readAsText(fileObj);
    }

    static readRequire(url, doJson) {
      var json, path;
      path = url.substring(5);
      json = Util$1.require(path); // Util.require prevents dynamic resolve in webpack
      if (json != null) {
        doJson(json);
      } else {
        console.error('Store.req require(json)  failed for url', url);
      }
    }

    static readAjax(url, doJson) { //jsonp
      var settings;
      settings = {
        url: url,
        type: 'get',
        dataType: 'json',
        processData: false,
        contentType: 'application/json',
        accepts: 'application/json'
      };
      settings.success = (data, status, jqXHR) => {
        var json;
        Util$1.noop(status, jqXHR);
        json = JSON.parse(data);
        return doJson(json);
      };
      settings.error = (jqXHR, status, error) => {
        return console.error('Store.ajaxGet', {
          url: url,
          status: status,
          error: error
        });
      };
      $.ajax(settings);
    }

  }
  Database.localImageURI = 'http://localhost:63342/ui/img/aaa';

  Database.localDataURI = 'http://localhost:63342/ui/data';

  Database.nodejDataURI = 'file://Users/ax/Documents/prj/ui/data';

  Database.fileURI = '/Users/ax/Documents/prj/ui/data';

  Database.Databases = {
    color: {
      id: "color",
      key: "id",
      uriLoc: Database.localDataURI + '/color',
      uriWeb: 'https://github.com/axiom6/ui/data/color',
      tables: ['master', 'ncs', 'gray']
    },
    exit: {
      id: "exit",
      key: "_id",
      uriLoc: Database.localDataURI + '/exit',
      uriWeb: 'https://github.com/axiom6/ui/data/exit',
      tables: ['ConditionsEast', 'ConditionsWest', 'Deals', 'Forecasts', 'I70Mileposts', 'SegmentsEast', 'SegmentsWest']
    },
    radar: {
      id: "radar",
      key: "name",
      uriLoc: Database.localDataURI + '/radar',
      uriWeb: 'https://github.com/axiom6/ui/data/radar',
      tables: ['axiom-techs', 'axiom-quads', 'axiom-techs-schema', 'axiom-quads-schema', 'polyglot-principles']
    },
    sankey: {
      id: "radar",
      uriLoc: Database.localDataURI + '/sankey',
      uriWeb: 'https://github.com/axiom6/ui/data/sankey',
      tables: ['energy', 'flare', 'noob', 'plot']
    },
    muse: {
      id: "muse",
      uriLoc: Database.localDataURI + '/muse',
      uriWeb: 'https://github.com/axiom6/ui/data/muse',
      tables: ['Columns', 'Rows', 'Practices']
    },
    pivot: {
      id: "pivot",
      uriLoc: Database.localDataURI + '/pivot',
      uriWeb: 'https://github.com/axiom6/ui/data/pivot',
      tables: ['mps']
    },
    geo: {
      id: "geo",
      uriLoc: Database.localDataURI + '/geo',
      uriWeb: 'https://github.com/axiom6/ui/data/geo',
      tables: ['upperLarimerGeo'],
      schemas: ['GeoJSON']
    },
    f6s: {
      id: "f6s",
      uriLoc: Database.localDataURI + '/f6s',
      uriWeb: 'https://github.com/axiom6/ui/data/fs6',
      tables: ['applications', 'followers', 'mentors', 'profile', 'teams']
    }
  };

  return Database;

}).call(undefined);

// A quick in and out method to select JSON data
/*Needs Store
@selectJson:( stream, uri, table, doData ) ->
rest = new Store.Rest( stream, uri )
rest.remember()
rest.select( table )
rest.subscribe( table, 'none', 'select', doData )
*/
var Database$1 = Database;

var Stream,
  hasProp$1 = {}.hasOwnProperty,
  indexOf = [].indexOf;

Stream = class Stream {
  constructor(bundleNames, infoSpec) {
    var i, len, name, ref;
    this.bundleNames = bundleNames;
    this.infoSpec = infoSpec;
    this.bundles = {};
    ref = this.bundleNames;
    for (i = 0, len = ref.length; i < len; i++) {
      name = ref[i];
      this.addBundle(name);
    }
    this.counts = {};
  }

  createBundle() {
    var bundle;
    bundle = {};
    bundle.subject = new Rx.Subject();
    bundle.subscribers = {};
    return bundle;
  }

  addBundle(name, warn = true) {
    if (this.bundles[name] == null) {
      this.bundles[name] = this.createBundle();
    } else {
      if (warn) {
        console.warn('Stream.addBundle() bundle subject already exists', name);
      }
    }
  }

  hasBundle(name) {
    return this.bundles[name] != null;
  }

  // Get a subject by name. Create a new one if need with a warning
  getBundle(name, warn = true) {
    if (this.bundles[name] == null) {
      if (warn) {
        console.warn('Stream.getBundle() unknown name for bundle subject so creating one for', name);
      }
      this.addBundle(name, false);
    }
    return this.bundles[name];
  }

  getSubscriber(name, source, issueError) {
    if (!((this.bundles[name] != null) && (this.bundles[name].subscriber[source] != null))) {
      if (issueError) {
        console.error('Stream.getSubscriber() unknown subscriber', name);
      }
      return null;
    } else {
      return this.bundles[name].subscriber[source];
    }
  }

  subscribe(name, source, next, onError = this.onError, onComplete = this.onComplete) {
    var bundle;
    bundle = this.getBundle(name, false);
    bundle.subscribers[source] = bundle.subject.subscribe(next, onError, onComplete);
    if (this.infoSpec.subscribe && this.isInfo(name)) {
      console.info('Strean.subscribe()', {
        subject: name,
        subscriber: source
      });
    }
  }

  publish(name, topic, jQuerySelector = null, eventType = null, htmlId = "") {
    var subject;
    if ((jQuerySelector != null) && (eventType != null) && (htmlId != null)) {
      this.publishEvent(name, topic, jQuerySelector, eventType, htmlId);
    } else {
      subject = this.getBundle(name).subject;
      subject.next(topic);
    }
    if (this.infoSpec.publish && this.isInfo(name)) {
      console.info('Strean.publish()', {
        subject: name,
        topic: topic
      });
    }
  }

  publishEvent(name, topic, jQuerySelector, eventType, htmlId = "") {
    var element, onEvent, subject;
    subject = this.getBundle(name).subject;
    element = this.domElement(jQuerySelector, htmlId);
    if (this.notElement(element, name)) {
      return;
    }
    onEvent = (event) => {
      this.processEvent(event);
      return subject.next(topic);
    };
    element.addEventListener(eventType, onEvent);
  }

  unsubscribeAll() {
    var bundle, kbun, ksub, ref, ref1, subscriber;
    ref = this.bundles;
    for (kbun in ref) {
      if (!hasProp$1.call(ref, kbun)) continue;
      bundle = ref[kbun];
      ref1 = bundle.subscribers;
      for (ksub in ref1) {
        if (!hasProp$1.call(ref1, ksub)) continue;
        subscriber = ref1[ksub];
        this.unsubscribe(kbun, ksub);
      }
    }
  }

  unsubscribe(name, source) {
    if (this.bundles[name] != null) {
      if (this.bundles[name].subscribers[source] != null) {
        this.bundles[name].subscribers[source].unsubscribe();
      } else {
        console.error('Strean.unsubscribe() unknown subscriber', {
          subject: name,
          subscriber: source
        });
      }
    } else {
      console.error('Strean.unsubscribe() unknown subject', {
        subject: name,
        subscriber: source
      });
    }
    if (this.infoSpec.subscribe && this.isInfo(name)) {
      console.info('Strean.unsubscribe()', {
        subject: name,
        subscriber: source
      });
    }
  }

  isInfo(name) {
    return Util$1.inArray(this.infoSpec.subjects, name);
  }

  notElement(element, name) {
    var status;
    status = (element != null) && (element.id != null) && Util$1.isStr(element.id);
    if (!status) {
      console.log('Stream.notElement()', name);
    }
    return !status;
  }

  processEvent(event) {
    if (event != null) {
      event.stopPropagation(); // Will need to look into preventDefault
    }
    if (event != null) {
      event.preventDefault();
    }
  }

  complete(completeSubject, subjects, onComplete) {
    var i, len, objects, onNext, subject;
    this.counts[completeSubject] = {};
    this.counts[completeSubject].count = 0;
    objects = [];
    onNext = (object) => {
      objects.push(object);
      this.counts[completeSubject].count++;
      if (this.counts[completeSubject].count === subjects.length) {
        this.counts[completeSubject].count = 0;
        if (typeof onComplete === 'function') {
          return onComplete(objects);
        } else {
          return this.publish(completeSubject, objects);
        }
      }
    };
    for (i = 0, len = subjects.length; i < len; i++) {
      subject = subjects[i];
      this.subscribe(subject, onNext);
    }
  }

  concat(name, sources, onComplete) {
    var i, len, onError, onNext, source, sub, subs;
    subs = [];
    for (i = 0, len = sources.length; i < len; i++) {
      source = sources[i];
      sub = this.getSubject(source).take(1);
      subs.push(sub);
    }
    this.bundles[name] = Rx.Observable.concat(subs).take(subs.length);
    //console.log( 'Stream.concat() subs.length', subs.length )
    onNext = function(object) {
      var params;
      params = object.params != null ? object.params : 'none';
      return Util$1.noop(params);
    };
    //console.log( 'Stream.concat() next params', params )
    onError = function(err) {
      return console.error('Stream.concat() error', err);
    };
    this.subscribe(name, onNext, onError, onComplete);
  }

  isJQuery($elem) {
    return (typeof $ !== "undefined" && $ !== null) && ($elem != null) && ($elem instanceof $ || indexOf.call(Object($elem), 'jquery') >= 0);
  }

  isEmpty($elem) {
    return ($elem != null ? $elem.length : void 0) === 0;
  }

  domElement(jQuerySelector, htmlId = "") {
    if (this.isJQuery(jQuerySelector)) {
      if (this.isEmpty(jQuerySelector)) {
        console.warn("Stream.domElement() jQuerySelector empty", {
          htmlId: htmlId
        });
      }
      if (this.isEmpty(jQuerySelector)) {
        console.trace();
      }
      return jQuerySelector.get(0);
    } else if (Util$1.isStr(jQuerySelector)) {
      return $(jQuerySelector).get(0);
    } else {
      console.error('Stream.domElement( jqSel )', typeof jQuerySelector, jQuerySelector, 'jQuerySelector is neither jQuery object nor selector', {
        htmlId: htmlId
      });
      return $().get(0);
    }
  }

  onNext(object) {
    return console.log('Stream.onNext()', object);
  }

  onError(error) {
    return console.error('Stream.onError()', error);
  }

  onComplete() {
    return console.log('Stream.onComplete()', 'Completed');
  }

  infoSubjects() {
    var key, obj, ref, results;
    ref = this.bundles;
    results = [];
    for (key in ref) {
      obj = ref[key];
      results.push(console.info('Stream.logSubjects', key));
    }
    return results;
  }

  drag(jqSel) {
    var dragTarget, mousedown, mousedrag, mousemove, mouseup;
    dragTarget = this.createRxJQuery(jqSel); // Note $jQuery has to be made reative with rxjs-jquery
    
    // Get the three major events
    mouseup = dragTarget.bindAsObservable("mouseup").publish().refCount();
    mousemove = $(document).bindAsObservable("mousemove").publish().refCount();
    mousedown = dragTarget.bindAsObservable("mousedown").publish().refCount().map(function(event) { // calculate offsets when mouse down
      event.preventDefault();
      return {
        left: event['clientX'] - dragTarget.offset().left,
        top: event['clientY'] - dragTarget.offset().top
      };
    });
    // Combine mouse down with mouse move until mouse up
    mousedrag = mousedown.selectMany(function(offset) {
      return mousemove.map(function(pos) { // calculate offsets from mouse down to mouse moves
        return {
          left: pos.clientX - offset.left,
          top: pos.clientY - offset.top
        };
      }).takeUntil(mouseup);
    });
    // Update position subscription =
    return mousedrag.subscribe(function(pos) {
      return dragTarget.css({
        top: pos.top,
        left: pos.left
      });
    });
  }

};

/*
eventTopic:( event ) ->
topic = 'Down'
topic = 'Left'  if event.which is 37
topic = 'Up'    if event.which is 38
topic = 'Right' if event.which is 39
topic = 'Down'  if event.which is 40
topic
*/
var Stream$1 = Stream;

var Base;

Base = class Base {
  constructor(stream, ui, name) {
    this.ready = this.ready.bind(this);
    this.readyView = this.readyView.bind(this);
    this.stream = stream;
    this.ui = ui;
    this.name = name;
    this.ui.addPage(this.name, this);
  }

  ready() {
    return console.error(`Subclass ${this.name} needs to implements ready()`);
  }

  readyView() {
    return $(`<h1 style=" display:grid; justify-self:center; align-self:center; ">${this.name}</h1>`);
  }

};

var Base$1 = Base;

var Navb;

Navb = class Navb {
  constructor(ui, stream, navbSpecs) {
    this.search = this.search.bind(this);
    this.signon = this.signon.bind(this);
    this.searchForm = this.searchForm.bind(this);
    this.signonForm = this.signonForm.bind(this);
    this.ui = ui;
    this.stream = stream;
    this.specs = this.createSpecs(navbSpecs);
    this.htmlId = Util$1.getHtmlId('Corp');
  }

  createSpecs(navbSpecs) {
    var i, len, navbSpec, specs;
    specs = [];
    for (i = 0, len = navbSpecs.length; i < len; i++) {
      navbSpec = navbSpecs[i];
      specs.push(navbSpec);
    }
    return specs;
  }

  ready() {
    this.$navb = $('#' + this.htmlId);
    this.$navb.append(this.html());
    return this.publish();
  }

  id(spec, ext = '') {
    return Util$1.htmlId(spec.name, 'Navb', ext);
  }

  publish() {
    var eventType, i, item, j, len, len1, ref, ref1, spec;
    ref = this.specs;
    for (i = 0, len = ref.length; i < len; i++) {
      spec = ref[i];
      if (spec.htmlId != null) {
        spec.$ = $('#' + spec.htmlId);
        eventType = spec.subject === 'Submit' ? 'keyup' : 'click';
        if (spec.topic != null) {
          this.stream.publish(spec.subject, spec.topic, spec.$, eventType);
        }
      }
      if (spec.items != null) {
        ref1 = spec.items;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          item = ref1[j];
          if (!(item.htmlId != null)) {
            continue;
          }
          item.$ = $('#' + item.htmlId);
          if (item.topic != null) {
            this.stream.publish(item.subject, item.topic, item.$, 'click');
          }
        }
      }
    }
  }

  getSpec(id) { // Not really needed
    var i, len, ref, spec;
    ref = this.specs;
    for (i = 0, len = ref.length; i < len; i++) {
      spec = ref[i];
      if (spec.id === id) {
        return spec;
      }
    }
    console.error('Navb.getSpec(id) spec null for id', id);
    return null;
  }

  html() {
    var htm, i, len, ref, spec;
    htm = "<div class=\"navb\">";
    ref = this.specs;
    for (i = 0, len = ref.length; i < len; i++) {
      spec = ref[i];
      switch (spec.type) {
        case 'Brand':
          htm += `<a  class="navb-brand" href="${spec.href}">${spec.name}</a>`;
          break;
        case 'NavBarLeft':
          htm += "<ul class=\"navb-ul-left\">";
          break;
        case 'NavBarRight':
          htm += "<ul class=\"navb-ul-right\">";
          break;
        case 'NavBarEnd':
          htm += "</ul>";
          break;
        case 'Item':
          htm += this.item(spec);
          break;
        case 'Link':
          htm += this.link(spec);
          break;
        case 'Dropdown':
          htm += this.dropdown(spec);
          break;
        case 'FileInput':
          htm += this.fileInput(spec);
          break;
        case 'Image':
          htm += this.image(spec);
          break;
        case 'Search':
          htm += this.search(spec);
          break;
        case 'Contact':
          htm += this.contact(spec);
          break;
        case 'SignOn':
          htm += this.signon(spec);
          break;
        default:
          console.error('Navb unknown spec type', spec.type);
      }
    }
    htm += "</div>";
    return htm;
  }

  show() {
    this.$navb.show();
  }

  hide() {
    this.$navb.hide();
  }

  item(spec) {
    spec.htmlId = this.id(spec);
    return `<li id="${spec.htmlId}" class="navb-item"><i class="fa ${spec.icon} fa-lg"></i> ${spec.name}</li>`;
  }

  link(spec) {
    spec.htmlId = this.id(spec); //  href="{spec.href}"
    return `<li class="navb-link"><a id="${spec.htmlId}"><i title="${spec.name}" class="fa ${spec.icon} fa-lg"></i> ${spec.name}</a></li>`;
  }

  dropdown(spec) {
    var htm, i, item, len, ref;
    htm = "<li class=\"navb-drop\">";
    htm += `<i class="fa ${spec.icon} fa-lg"/> ${spec.name}  <i class="fa fa-caret-down"/>`;
    htm += "<ul>";
    ref = spec.items;
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      item.htmlId = this.id(item, spec.name);
      htm += `<li id="${item.htmlId}">${item.name
    // <i class="fa #{item.icon}"></i>
}</li>`;
    }
    htm += "</ul></li>";
    return htm;
  }

  image(spec) {
    spec.htmlId = this.id(spec);
    return `<li id="${spec.htmlId}" class="navb-image-li"><i class="fa ${spec.icon}"/>&nbsp;Image</li>`;
  }

  fileInput(spec) {
    spec.htmlId = this.id(spec);
    return `<li class="navb-fileinput-li"><input id="${spec.htmlId}" class="navb-fileinput" placeholder="  &#xF0F6; Input File"  type="file" size="${spec.size}"></li>`;
  }

  search(spec) {
    spec.htmlId = this.id(spec);
    return `<li class="navb-search-li"><input id="${spec.htmlId}" class="navb-search" placeholder="  &#xF002; Search"  type="text" size="${spec.size}"></li>`;
  }

  signon(spec) {
    spec.htmlId = this.id(spec);
    return `<li class="navb-signon-li"><input id="${spec.htmlId}" class="navb-signon" placeholder="  &#xF090; Sign On" type="text" size="${spec.size}"></li>`;
  }

  searchForm(spec) {
    spec.htmlId = this.id(spec);
    return `<li><form id="${spec.htmlId}" name="search" class="navb-search">\n<input name="criteria" placeholder=" &#xF002; ${spec.name}" type="text" size="${spec.size}">\n<label for="SEARCH"></label></form></li>`;
  }

  signonForm(spec) {
    spec.htmlId = this.id(spec);
    return `<li><form id="${spec.htmlId}" name="login" class="navb-signon">\n<input name="user" placeholder="  &#xF090;  Sign On" type="text" size="${spec.size}">\n<label for="SIGNON"></label></form></li>`;
  }

  contact(spec) {
    spec.htmlId = this.id(spec);
    return `<li class="navb-contact"><a id="${spec.htmlId}"><i class="fa ${spec.icon} fa-lg"></i> ${spec.name}</a></li>`;
  }

};

var Navb$1 = Navb;

var Tocs,
  hasProp$2 = {}.hasOwnProperty;

Tocs = (function() {
  class Tocs {
    constructor(ui, stream, practices1) {
      this.onSelect = this.onSelect.bind(this);
      this.ui = ui;
      this.stream = stream;
      this.practices = practices1;
      [this.specs, this.stack] = this.createTocsSpecs(this.practices);
      //@infoSpecs() #
      this.htmlIdApp = this.ui.getHtmlId('Tocs', '');
      this.classPrefix = Util$1.isStr(this.practices.css) ? this.practices.css : 'tocs';
      this.last = this.specs[0];
      this.speed = 400;
    }

    createTocsSpecs(practices) {
      var hasChild, keyPrac, keyStudy, practice, spec0, specN, specs, stack, study;
      spec0 = {
        level: 0,
        name: "Beg",
        hasChild: true
      };
      stack = new Array(Tocs.MaxTocLevel);
      stack[0] = spec0;
      specs = [];
      specs.push(spec0);
      for (keyPrac in practices) {
        if (!hasProp$2.call(practices, keyPrac)) continue;
        practice = practices[keyPrac];
        if (!(UI$1.isChild(keyPrac))) {
          continue;
        }
        hasChild = this.hasChild(practice);
        this.enrichSpec(keyPrac, practice, specs, 1, spec0, hasChild, true);
        for (keyStudy in practice) {
          if (!hasProp$2.call(practice, keyStudy)) continue;
          study = practice[keyStudy];
          if (hasChild && UI$1.isChild(keyStudy)) {
            this.enrichSpec(keyStudy, study, specs, 2, practice, false, false);
          }
        }
      }
      specN = {
        level: 0,
        name: "End",
        hasChild: false
      };
      specs.push(specN);
      return [specs, stack];
    }

    hasChild(spec) {
      var child, key;
      for (key in spec) {
        if (!hasProp$2.call(spec, key)) continue;
        child = spec[key];
        if (UI$1.isChild(key)) {
          return true;
        }
      }
      return false;
    }

    infoSpecs() {
      var j, len, ref, spec;
      ref = this.specs;
      for (j = 0, len = ref.length; j < len; j++) {
        spec = ref[j];
        console.info('UI.Tocs.spec', Util$1.indent(spec.level * 2), spec.name, spec.hasChild);
      }
    }

    enrichSpec(key, spec, specs, level, parent, hasChild, isRow) {
      //console.log( 'Tocs', key, spec )
      spec.level = level;
      spec.parent = parent;
      spec.name = spec.name != null ? spec.name : key; // Need to learn why this is needed
      spec.on = false;
      spec.hasChild = hasChild;
      spec.isRow = isRow;
      specs.push(spec);
    }

    ready() {
      var j, len, ref, select, spec;
      this.$tocs = $(this.html());
      this.$tocp = $('#' + this.htmlIdApp);
      this.$tocp.append(this.$tocs);
      ref = this.specs;
      for (j = 0, len = ref.length; j < len; j++) {
        spec = ref[j];
        if (!(spec.level > 0)) {
          continue;
        }
        spec.$elem = spec.hasChild ? $('#' + spec.ulId) : $('#' + spec.liId);
        spec.$li = $('#' + spec.liId);
        select = this.toSelect(spec);
        this.stream.publish('Select', select, spec.$li, 'click', spec.liId);
      }
      this.subscribe();
    }

    toSelect(spec) {
      var intent;
      if (spec.level === 2) { // Study
        return UI$1.toTopic(spec.parent.name, 'Tocs', UI$1.SelectStudy, spec.parent[spec.name]);
      } else {
        intent = spec.name === 'View' ? UI$1.SelectView : UI$1.SelectPane;
        return UI$1.toTopic(spec.name, 'Tocs', intent);
      }
    }

    subscribe() {
      this.stream.subscribe('Select', 'Tocs', (select) => {
        return this.onSelect(select);
      });
    }

    htmlId(spec, ext = '') {
      var suffix;
      suffix = spec.parent != null ? ext + spec.parent.name : ext;
      return this.ui.htmlId(spec.name, 'Tocs', suffix);
    }

    getSpec(select, issueError = true) {
      var j, len, ref, spec;
      ref = this.specs;
      for (j = 0, len = ref.length; j < len; j++) {
        spec = ref[j];
        if (spec.name === select.name) {
          return spec;
        }
      }
      if (issueError && this.nameNotOk(select.name)) {
        console.error('UI.Tocs.getSpec(id) spec null for select', select);
        this.infoSpecs();
      }
      return null;
    }

    nameNotOk(name) {
      var j, len, okName, okNames;
      okNames = ['None', 'View', 'Embrace', 'Innovate', 'Encourage', 'Learn', 'Do', 'Share'];
      for (j = 0, len = okNames.length; j < len; j++) {
        okName = okNames[j];
        if (name === okName) {
          return false;
        }
      }
      return true;
    }

    html() {
      var htm, i, j, ref;
      this.specs[0].ulId = this.htmlId(this.specs[0], 'UL');
      htm = `<ul class="${this.classPrefix}ul0" id="${this.specs[0].ulId}">`;
      for (i = j = 1, ref = this.specs.length; (1 <= ref ? j < ref : j > ref); i = 1 <= ref ? ++j : --j) {
        htm += this.process(i);
      }
      return htm;
    }

    show() {
      this.$tocs.show();
    }

    hide() {
      this.$tocs.hide();
    }

    process(i) {
      var htm, j, level, prev, ref, ref1, spec;
      htm = "";
      prev = this.specs[i - 1];
      spec = this.specs[i];
      if (spec.level >= prev.level) {
        htm += this.htmlBeg(spec);
        this.stack[spec.level] = spec;
      } else {
        for (level = j = ref = prev.level, ref1 = spec.level; (ref <= ref1 ? j <= ref1 : j >= ref1); level = ref <= ref1 ? ++j : --j) {
          if (this.stack[level] != null) {
            htm += this.htmlEnd(this.stack[level]);
          }
        }
        if (i < this.specs.length - 1) {
          htm += this.htmlBeg(spec);
        }
      }
      return htm;
    }

    htmlBeg(spec) {
      var htm;
      spec.liId = this.htmlId(spec, 'LI');
      spec.ulId = this.htmlId(spec, 'UL');
      //console.log( 'UI.Tocs htmlBeg()', spec.id, spec.liId, spec.ulId )
      htm = `<li class="${this.classPrefix}li${spec.level}" id="${spec.liId}" >`;
      htm += `${this.htmIconName(spec)}`;
      if (spec.hasChild) {
        htm += `<ul class="${this.classPrefix}ul${spec.level}" id="${spec.ulId}">`;
      }
      return htm;
    }

    htmIconName(spec) {
      var htm;
      htm = "<div style=\"display:table;\">";
      if (spec.icon) {
        htm += `<i class="fa ${spec.icon} fa-lg"></i>`;
      }
      htm += `<span style="display:table-cell; vertical-align:middle; padding-left:12px;">${Util$1.toName(spec.name)}</span>`;
      return htm += "</div>";
    }

    htmlEnd(spec) {
      if (spec.level === 0) {
        return "</ul>";
      } else if (spec.hasChild) {
        return "</ul></li>";
      } else {
        return "</li>";
      }
    }

    onSelect(select) {
      var spec;
      UI$1.verifyTopic(select, 'Tocs');
      spec = this.getSpec(select, true); // spec null ok not all Tocs available for views
      if (spec != null) {
        this.update(spec);
      } else if (select.name === 'View' && (this.last != null)) {
        this.reveal(this.last);
        this.last = this.specs[0];
      }
    }

    update(spec) {
      var j, k, l, last, level, ref, ref1, ref2;
      this.stack[spec.level] = spec;
// Build stack to turn on spec levels
      for (level = j = ref = spec.level; j >= 2; level = j += -1) {
        this.stack[level - 1] = this.stack[level].parent;
      }
      last = this.last;
// Turn off items that are different or below level
      for (level = k = ref1 = this.last.level; k >= 1; level = k += -1) {
        if (last.name !== this.stack[level].name || level > spec.level) {
          this.reveal(last);
        }
        last = last.parent;
      }
// Turn  on  items in the spec stack
      for (level = l = 1, ref2 = spec.level; l <= ref2; level = l += 1) {
        if (!this.stack[level].on) {
          this.reveal(this.stack[level]);
        }
      }
      this.last = spec;
    }

    reveal(spec) {
      spec.on = !spec.on;
      if (spec.level === 0) {
        return;
      }
      if (spec.hasChild) {
        spec.$elem.toggle(this.speed);
      } else {
        spec.$elem.css({
          color: spec.on ? '#FFFF00' : '#FFFFFF'
        });
      }
    }

  }
  Tocs.MaxTocLevel = 12;

  return Tocs;

}).call(undefined);

var Tocs$1 = Tocs;

var Pane;

Pane = class Pane {
  constructor(ui, stream, view, spec) {
    var i, j, m, n;
    this.animateCall = this.animateCall.bind(this);
    this.onContent = this.onContent.bind(this);
    this.ui = ui;
    this.stream = stream;
    this.view = view;
    this.spec = spec;
    this.spec.pane = this;
    this.cells = this.spec.cells;
    [j, m, i, n] = this.view.jmin(this.cells);
    [this.left, this.top, this.width, this.height] = this.view.position(j, m, i, n, this.spec);
    this.name = this.spec.name;
    this.classPrefix = Util$1.isStr(this.spec.css) ? this.spec.css : 'ui-pane';
    this.$ = UI$1.$empty;
    this.wscale = this.view.wscale;
    this.hscale = this.view.hscale;
    this.margin = this.view.margin;
    this.speed = this.view.speed;
    this.geo = null; // reset by geom() when onContent() dispatches to page
  }

  ready() {
    this.htmlId = this.ui.htmlId(this.name, 'Pane');
    this.$ = this.createHtml();
    this.view.$view.append(this.$);
    this.hide();
    this.adjacentPanes();
    this.$.css(this.scaleReset());
    this.geo = this.geom();
    this.show();
  }

  geom() {
    var ex, geo, h, hi, hp, hv, i, j, m, n, r, s, sx, sy, w, wi, wp, wv, x0, y0;
    [j, m, i, n] = this.view.jmin(this.spec.cells);
    [wp, hp] = this.view.positionpx(j, m, i, n, this.spec); // Pane size in AllPage usually 3x3 View
    wi = this.$.innerWidth();
    hi = this.$.innerHeight();
    w = Math.max(wi, wp); // wp from positionpx
    h = Math.max(hi, hp); // hp from positionpx
    wv = this.view.wPanes();
    hv = this.view.hPanes();
    r = Math.min(w, h) * 0.2; // Use for hexagons
    x0 = w * 0.5;
    y0 = h * 0.5;
    sx = w / wp;
    sy = h / hp;
    s = Math.min(sx, sy);
    ex = wv * 0.9 < w && w < wv * 1.1;
    geo = {
      w: w,
      h: h,
      wi: wi,
      hi: hi,
      wp: wp,
      hp: hp,
      wv: wv,
      hv: hv,
      r: r,
      x0: x0,
      y0: y0,
      sx: sx,
      sy: sy,
      s: s,
      ex: ex
    };
    //console.log( 'Pane.geom()', @name, geo )
    if (wp === 0 || hp === 0) {
      console.error('Pane.geom()', {
        name: this.name,
        spec: this.spec,
        vw: this.view.widthpx(),
        vh: this.view.heightpx(),
        geo: geo
      });
      console.trace();
    }
    return geo;
  }

  // Converts a pane percent to vmin unit by determining the correct pane scaling factor
  toVmin(pc) {
    var sc;
    sc = this.view.widthpx() > this.view.heightpx() ? this.height : this.width;
    return Util$1.toFixed(sc * pc * 0.01, 2);
  }

  toVw(pc) {
    return Util$1.toFixed(this.width * pc * 0.01, 2);
  }

  toVh(pc) {
    return Util$1.toFixed(this.height * pc * 0.01, 2);
  }

  show() {
    this.$.show();
  }

  hide() {
    this.$.hide();
  }

  pc(v) {
    return this.view.pc(v);
  }

  xs(x) {
    return this.view.xs(x);
  }

  ys(y) {
    return this.view.ys(y);
  }

  xcenter(left, width, w, scale = 1.0, dx = 0) {
    return scale * (left + 0.5 * width - 11 + dx / this.wscale);
  }

  xcente2(left, width, w, scale = 1.0, dx = 0) {
    return scale * (left + 0.5 * width - 0.5 * w / this.wscale + dx / this.wscale);
  }

  ycenter(top, height, h, scale = 1.0, dy = 0) {
    return scale * (top + 0.5 * height - 0.5 * h / this.hscale + dy / this.hscale);
  }

  right(left, width, w, scale = 1.0, dx = 0) {
    return scale * (left + width - 0.5 * w / this.wscale + dx / this.wscale);
  }

  bottom(top, height, h, scale = 1.0, dy = 0) {
    return scale * (top + height - 0.5 * h / this.hscale + dy / this.hscale);
  }

  north(top, height, h, scale = 1.0, dy = 0) {
    return scale * (top - h + dy / this.hscale);
  }

  south(top, height, h, scale = 1.0, dy = 0) {
    return scale * (top + height + dy / this.hscale);
  }

  east(left, width, w, scale = 1.0, dx = 0) {
    return scale * (left + width + dx / this.wscale);
  }

  west(left, width, w, scale = 1.0, dx = 0) {
    return scale * (left - w + dx / this.wscale);
  }

  adjacentPanes() {
    var i, ip, j, jp, k, len, m, mp, n, np, pane, ref;
    [jp, mp, ip, np] = this.view.jmin(this.cells);
    [this.northPane, this.southPane, this.eastPane, this.westPane] = [UI$1.$empty, UI$1.$empty, UI$1.$empty, UI$1.$empty];
    ref = this.view.panes;
    for (k = 0, len = ref.length; k < len; k++) {
      pane = ref[k];
      [j, m, i, n] = this.view.jmin(pane.cells);
      if (j === jp && m === mp && i === ip - n) {
        this.northPane = pane;
      }
      if (j === jp && m === mp && i === ip + np) {
        this.southPane = pane;
      }
      if (i === ip && n === np && j === jp - m) {
        this.westPane = pane;
      }
      if (i === ip && n === np && j === jp + mp) {
        this.eastPane = pane;
      }
    }
  }

  createHtml() {
    var $p;
    $p = $(`<div id="${this.htmlId}" class="${this.classPrefix}"></div>`);
    this.navArrows($p);
    return $p;
  }

  doNav(event) {
    var name, select;
    name = $(event.target).attr('data-name');
    select = UI$1.toTopic(name, 'Pane.doNav()', UI$1.SelectPack);
    this.stream.publish('Select', select);
  }

  navArrows($p) {
    var fontpc, fontvw, leftpc, leftvw;
    fontpc = 50;
    leftpc = (100 - fontpc) * 0.5;
    fontvw = this.toVw(fontpc) + 'vw';
    leftvw = this.toVw(leftpc) + 'vw';
    if (this.spec['bak'] != null) {
      this.navIcon('bak', leftvw, fontvw, this.spec['bak'], $p);
    }
    if (this.spec['fwd'] != null) {
      this.navIcon('fwd', leftvw, fontvw, this.spec['fwd'], $p);
    }
    if (this.spec['top'] != null) {
      this.navIcon('top', leftvw, fontvw, this.spec['top'], $p);
    }
    if (this.spec['bot'] != null) {
      this.navIcon('bot', leftvw, fontvw, this.spec['bot'], $p);
    }
  }

  navIcon(loc, leftvw, fontvw, name, $p) {
    var $a;
    $a = (function() {
      switch (loc) {
        case 'bak':
          return $(`<i style="position:absolute; left:${leftvw}; top: 40%; font-size:${fontvw}; z-index:4;" class="arrow fas fa-arrow-alt-circle-left"  data-name="${name}"></i>`);
        case 'fwd':
          return $(`<i style="position:absolute; left:${leftvw}; top: 40%; font-size:${fontvw}; z-index:4;" class="arrow fas fa-arrow-alt-circle-right" data-name="${name}"></i>`);
        case 'top':
          return $(`<i style="position:absolute; left:${leftvw}; top:   0; font-size:${fontvw}; z-index:4;" class="arrow fas fa-arrow-alt-circle-up"    data-name="${name}"></i>`);
        case 'bot':
          return $(`<i style="position:absolute; left:${leftvw}; bottom:0; font-size:${fontvw}; z-index:4;" class="arrow fas fa-arrow-alt-circle-down"  data-name="${name}"></i>`);
      }
    })();
    $a.on('click', (event) => {
      return this.doNav(event);
    });
    $p.append($a);
  }

  scaleReset() {
    return {
      left: this.xs(this.left),
      top: this.ys(this.top),
      width: this.xs(this.width),
      height: this.ys(this.height)
    };
  }

  scaleParam(left, top, width, height) {
    return {
      left: this.pc(left),
      top: this.pc(top),
      width: this.pc(width),
      height: this.pc(height)
    };
  }

  emptyParam() {
    return {
      left: "",
      top: "",
      width: "",
      height: ""
    };
  }

  reset(select) {
    this.resetStudiesDir(true);
    this.$.css(this.scaleReset());
    this.onContent(select);
  }

  css(left, top, width, height, select) {
    this.$.css(this.scaleParam(left, top, width, height));
    this.onContent(select);
  }

  animate(left, top, width, height, select, aniLinks = false, callback = null) {
    this.$.show().animate(this.scaleParam(left, top, width, height), this.view.speed, () => {
      return this.animateCall(callback, select);
    });
  }

  animateCall(callback, select) {
    this.onContent(select);
    if (callback != null) {
      callback(this);
    }
  }

  resetStudiesDir(show) {
    var dir, k, len, ref;
    ref = ['west', 'north', 'east', 'south', 'prac'];
    for (k = 0, len = ref.length; k < len; k++) {
      dir = ref[k];
      this.resetStudyDir(false, show, dir);
    }
  }

  resetStudyDir(expand, show, dir) {
    var $study;
    $study = this.$.find(this.dirClass(dir));
    if (expand) {
      $study.css(this.scaleParam(this.view.margin.west, this.view.margin.north, 100 * this.view.wview, 100 * this.view.hview));
    } else {
      $study.css(this.emptyParam());
    }
    if (show) {
      $study.show();
    } else {
      $study.hide();
    }
  }

  dirClass(dir) {
    return `.study-${dir}`;
  }

  onContent(select) {
    var content;
    this.geo = this.geom();
    if (this.stream.hasBundle('Content')) {
      content = UI$1.toTopic(select.name, 'Pane', select.intent);
      this.stream.publish('Content', content);
    }
  }

};

var Pane$1 = Pane;

var Pack;

Pack = class Pack extends Pane$1 {
  constructor(ui, stream, view, spec, panes) {
    super(ui, stream, view, spec);
    this.panes = panes;
    this.margin = this.view.margin;
    this.icon = this.spec.icon;
    this.css = Util$1.isStr(this.spec.css) ? this.spec.css : 'ui-pack';
    this.$ = UI$1.$empty;
  }

  id(name, ext) {
    return this.ui.htmlId(name + 'Pack', ext);
  }

  ready() {
    var select;
    this.htmlId = this.id(this.name, 'Pack');
    this.$icon = this.createIcon();
    this.view.$view.append(this.$icon);
    select = UI$1.toTopic(this.name, 'Pack', this.spec.intent);
    return this.stream.publish('Select', select, this.$icon, 'click');
  }

  static show() {
    var i, len, pane, ref, results;
    super.show();
    ref = this.panes;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      pane = ref[i];
      results.push(pane.show());
    }
    return results;
  }

  static hide() {
    var i, len, pane, ref, results;
    super.hide();
    ref = this.panes;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      pane = ref[i];
      results.push(pane.hide());
    }
    return results;
  }

  createIcon() {
    var $icon, height, htm, left, top, width;
    htm = this.htmIconName(this.spec);
    $icon = $(htm);
    [left, top, width, height] = this.positionIcon(this.spec);
    $icon.css({
      left: this.xs(left),
      top: this.ys(top),
      width: this.pc(width),
      height: this.pc(height)
    });
    return $icon;
  }

  htmIconName(spec) {
    var htm;
    htm = `<div  id="${this.id(spec.name, 'Icon')}" class="${this.css}-icon" style="display:table; font-size:1.2em;">`;
    if (spec.icon) {
      htm += `<i class="fa ${spec.icon} fa-lg"></i>`;
    }
    htm += spec.css === 'ikw-col' ? this.htmColName(spec) : this.htmRowName(spec);
    return htm += "</div>";
  }

  htmColName(spec) {
    return `<span style="display:table-cell; vertical-align:middle; padding-left:12px;">${Util$1.toName(spec.name)}</span>`;
  }

  htmRowName(spec) {
    return `<div style="display:table-cell; vertical-align:middle; padding-left:12px;">${Util$1.toName(spec.name)}</div>`;
  }

  positionIcon(spec) {
    var w;
    w = spec.w != null ? spec.w * this.wscale * 0.5 : 100 * this.wscale * 0.5; // Calulation does not make sense but it works
    //Util.log( 'Pack.positionIcon', @left, @width, w, @xcenter( @left, @width, w ) ) if spec.intent is ub.SelectCol
    switch (spec.intent) {
      case UI$1.SelectRow:
        return [-10, this.ycenter(this.top, this.height, this.margin.west), 12, this.margin.west];
      case UI$1.SelectCol:
        return [this.xcenter(this.left, this.width, w), 0, this.margin.north, this.margin.north];
      case UI$1.SelectPack:
        return [this.xcenter(this.left, this.width, w), 0, this.margin.north, this.margin.north];
      default:
        return this.positionPackIcon();
    }
  }

  positionPack() {
    var height, left, top, width;
    [left, top, width, height] = this.view.positionPack(this.cells, this.spec);
    return this.$.css({
      left: this.xs(left),
      top: this.ys(top),
      width: this.xs(width),
      height: this.ys(height) // , 'background-color':fill } )
    });
  }

  positionPackIcon() {
    var height, left, top, width;
    [left, top, width, height] = this.view.positionPack(this.cells, this.spec);
    return [left + 20, top + 20, 20, 20];
  }

  animateIcon($icon) {
    var height, left, top, width;
    [left, top, width, height] = this.positionIcon();
    return $icon.animate({
      left: this.xs(left),
      top: this.ys(top),
      width: this.pc(width),
      height: this.pc(height)
    });
  }

  unionPanes() {
    var gpanes, i, ig, ip, jg, jp, len, mg, mp, ng, np, pane, ref;
    gpanes = [];
    [jg, mg, ig, ng] = UI$1.jmin(this.cells);
    ref = this.view.panes;
    for (i = 0, len = ref.length; i < len; i++) {
      pane = ref[i];
      [jp, mp, ip, np] = UI$1.jmin(pane.cells);
      if (jg <= jp && jp + mp <= jg + mg && ig <= ip && ip + np <= ig + ng) {
        gpanes.push(pane);
      }
    }
    return gpanes;
  }

  // Not used
  fillPanes() {
    var fill, i, len, pane, ref;
    fill = this.spec['hsv'] != null ? Vis.toRgbHsvStr(this.spec['hsv']) : "#888888";
    ref = this.panes;
    for (i = 0, len = ref.length; i < len; i++) {
      pane = ref[i];
      pane.$.css({
        'background-color': fill
      });
    }
  }

  animate(left, top, width, height, parent = null, callback = null) {
    this.$.animate({
      left: this.pc(left),
      top: this.pc(top),
      width: this.pc(width),
      height: this.pc(height)
    }, this.speed, () => {
      if (callback != null) {
        return callback(this);
      }
    });
  }

};

var Pack$1 = Pack;

var View,
  hasProp$3 = {}.hasOwnProperty;

View = class View {
  constructor(ui, stream, specs1) {
    this.resize = this.resize.bind(this);
    this.ui = ui;
    this.stream = stream;
    this.specs = specs1;
    this.speed = 400;
    this.$view = UI$1.$empty;
    this.margin = UI$1.margin;
    this.ncol = UI$1.ncol;
    this.nrow = UI$1.nrow;
    this.classPrefix = Util$1.isStr(this.specs.css) ? this.spec.css : 'ui-view';
    [this.wpane, this.hpane, this.wview, this.hview, this.wscale, this.hscale] = this.percents(this.nrow, this.ncol, this.margin);
    [this.packs, this.panes] = UI$1.hasPack ? this.createPacks(this.specs) : this.createPanes(this.specs);
    this.sizeCallback = null;
    this.paneCallback = null;
    this.lastPaneName = '';
    this.$empty = UI$1.$empty; // Empty jQuery singleton for intialization
    this.allCells = [1, this.ncol, 1, this.nrow];
  }

  ready() {
    var htmlId, k, len, pane, parent, ref;
    parent = $('#' + this.ui.getHtmlId('View')); // parent is outside of planes
    htmlId = this.ui.htmlId('View', 'Plane');
    this.$view = $(`<div id="${htmlId}" class="${this.classPrefix}"></div>`);
    parent.append(this.$view);
    ref = this.panes;
    for (k = 0, len = ref.length; k < len; k++) {
      pane = ref[k];
      pane.ready();
    }
    this.subscribe();
  }

  subscribe() {
    return this.stream.subscribe('Select', 'View', (select) => {
      return this.onSelect(select);
    });
  }

  percents(nrow, ncol, margin) {
    var hpane, hscale, hview, wpane, wscale, wview;
    wpane = 100 / ncol;
    hpane = 100 / nrow;
    wview = 1.0 - (margin.west + margin.east) / 100;
    hview = 1.0 - (margin.north + margin.south) / 100;
    wscale = 1.0 - (margin.west + (ncol - 1) * margin.width + margin.east) / 100; // Scaling factor for panes once all
    hscale = 1.0 - (margin.north + (nrow - 1) * margin.height + margin.south) / 100; // margins gutters are accounted for
    return [wpane, hpane, wview, hview, wscale, hscale];
  }

  pc(v) {
    return v.toString() + (v !== 0 ? '%' : '');
  }

  xs(x) {
    return this.pc(x * this.wscale);
  }

  ys(y) {
    return this.pc(y * this.hscale);
  }

  left(j) {
    return j * this.wpane;
  }

  top(i) {
    return i * this.hpane;
  }

  width(m) {
    return m * this.wpane + (m - 1) * this.margin.width / this.wscale;
  }

  height(n) {
    return n * this.hpane + (n - 1) * this.margin.height / this.hscale;
  }

  widthpx() {
    return this.$view.innerWidth(); // Use @viewp because
  }

  heightpx() {
    return this.$view.innerHeight(); // Use @viewp because @$view
  }

  wPanes() {
    return this.wview * this.widthpx();
  }

  hPanes() {
    return this.hview * this.heightpx();
  }

  north(top, height, h, scale = 1.0, dy = 0) {
    return scale * (top - h + dy / this.hscale);
  }

  south(top, height, h, scale = 1.0, dy = 0) {
    return scale * (top + height + dy / this.hscale);
  }

  east(left, width, w, scale = 1.0, dx = 0) {
    return scale * (left + width + dx / this.wscale);
  }

  west(left, width, w, scale = 1.0, dx = 0) {
    return scale * (left - w + dx / this.wscale);
  }

  isRow(specPanePack) {
    return specPanePack.css === 'ikw-row';
  }

  isCol(specPanePack) {
    return specPanePack.css === 'ikw-col';
  }

  positionUnionPane(unionCells, paneCells, spec, xscale = 1.0, yscale = 1.0) {
    var ip, iu, jp, ju, mp, mu, np, nu;
    [ju, mu, iu, nu] = this.jmin(unionCells);
    [jp, mp, ip, np] = this.jmin(paneCells);
    return this.position((jp - ju) * this.ncol / mu, mp * this.ncol / mu, (ip - iu) * this.nrow / nu, np * this.nrow / nu, spec, xscale, yscale);
  }

  positionPack(packCells, spec, xscale = 1.0, yscale = 1.0) {
    var i, j, m, n;
    [j, m, i, n] = this.jmin(packCells);
    return this.position(j, m, i, n, spec, xscale, yscale);
  }

  positionPane(paneCells, spec, xscale = 1.0, yscale = 1.0) {
    var i, j, m, n;
    [j, m, i, n] = this.jmin(paneCells);
    return this.position(j, m, i, n, spec, xscale, yscale);
  }

  position(j, m, i, n, spec, xscale = 1.0, yscale = 1.0) {
    var hStudy, height, left, top, wStudy, width;
    wStudy = spec.name != null ? this.margin.wStudy : 0;
    hStudy = spec.name != null ? this.margin.hStudy : 0;
    left = xscale * (this.left(j) + (wStudy + this.margin.west + j * this.margin.width) / this.wscale);
    top = yscale * (this.top(i) + (hStudy + this.margin.north + i * this.margin.height) / this.hscale);
    width = xscale * (this.width(m) - wStudy * 2 / this.wscale);
    height = yscale * (this.height(n) - hStudy * 2 / this.hscale);
    return [left, top, width, height];
  }

  positionpx(j, m, i, n, spec) {
    var height, left, top, width;
    [left, top, width, height] = this.position(j, m, i, n, spec, this.wscale, this.hscale);
    return [width * this.widthpx() / 100, height * this.heightpx() / 100];
  }

  reset(select) {
    var k, len, pane, ref;
    ref = this.panes;
    for (k = 0, len = ref.length; k < len; k++) {
      pane = ref[k];
      pane.intent = select.intent;
      pane.reset(select);
    }
  }

  resize() {
    var saveName;
    saveName = this.lastPaneName;
    this.lastPaneName = '';
    this.onSelect(UI$1.toTopic(saveName, 'View', UI$1.SelectPane));
    this.lastPaneName = saveName;
  }

  hide() {
    this.$view.hide();
  }

  show() {
    this.$view.show();
  }

  hideAll(name = 'None') {
    var k, len, pane, ref;
    ref = this.panes;
    for (k = 0, len = ref.length; k < len; k++) {
      pane = ref[k];
      if (pane.name !== name) {
        pane.hide();
      }
    }
    this.$view.hide();
  }

  showAll() {
    var k, len, pane, ref;
    this.$view.hide();
    ref = this.panes;
    for (k = 0, len = ref.length; k < len; k++) {
      pane = ref[k];
      //@reset( @selectView )
      pane.show();
    }
    this.$view.show(this.speed, () => {
      if (this.sizeCallback) {
        return this.sizeCallback(this);
      }
    });
  }

  onSelect(select) {
    var intent, name;
    UI$1.verifyTopic(select, 'View');
    name = select.name;
    intent = select.intent;
    switch (intent) {
      case UI$1.SelectView:
        this.expandAllPanes(select);
        break;
      case UI$1.SelectPack:
        this.expandPack(select, this.getPane(name));
        break;
      case UI$1.SelectPane:
        this.expandPane(select, this.getPane(name));
        break;
      case UI$1.SelectStudy:
        this.expandStudy(select, this.getPane(name));
        break;
      default:
        console.error('UI.View.onSelect() name not processed for intent', name, select);
    }
  }

  expandAllPanes(select) {
    this.hideAll();
    this.reset(select);
    return this.showAll();
  }

  expandPack(select, pack, callback = null) {
    var height, k, left, len, pane, ref, top, width;
    this.hideAll('Interact');
    if (pack.panes != null) {
      ref = pack.panes;
      for (k = 0, len = ref.length; k < len; k++) {
        pane = ref[k];
        pane.show();
        //left,top,width,height] = @positionUnionPane( pack.cells, pane.cells, pane.spec, @wscale, @hscale )
        [left, top, width, height] = this.positionPane(pane.cells, pane.spec, this.wscale, this.hscale);
        pane.intent = select.intent;
        pane.animate(left, top, width, height, select, true, callback);
      }
    } else {
      console.error('View.expandPack pack.panes null');
    }
    this.show();
    this.lastPaneName = 'None';
  }

  expandPane(select, pane, callback = null) {
    var paneCallback;
    paneCallback = callback != null ? callback : this.paneCallback;
    pane = this.getPane(pane, false); // don't issue errors
    if (pane == null) {
      return;
    }
    this.hideAll();
    pane.resetStudiesDir(true);
    pane.show();
    pane.intent = select.intent;
    pane.animate(this.margin.west, this.margin.north, 100 * this.wview, 100 * this.hview, select, true, paneCallback);
    this.show();
    this.lastPaneName = pane.name;
  }

  expandStudy(select, pane, callback = null) {
    this.expandPane(select, pane, callback);
    if (this.stream.isInfo('Select')) {
      console.info('View.expandStudy()', {
        study: select.study
      });
    }
    if (select.study == null) {
      return;
    }
    pane.resetStudiesDir(false); // Hide all studies
    pane.resetStudyDir(true, true, select.study.dir); // Expand selected
  }

  getPane(key, issueError = true) {
    var k, l, len, len1, pack, pane, ref, ref1;
    if (Util$1.isObj(key)) {
      return key;
    }
    ref = this.panes;
    for (k = 0, len = ref.length; k < len; k++) {
      pane = ref[k];
      if (pane.name === key) {
        return pane;
      }
    }
    ref1 = this.packs;
    for (l = 0, len1 = ref1.length; l < len1; l++) {
      pack = ref1[l];
      if (pack.name === key) {
        return pack;
      }
    }
    if (issueError) {
      console.error('UI.View.getPane() null for key ', key);
    }
    return null;
  }

  createPanes(specs) {
    var pane, panes, pkey, pspec;
    panes = [];
    for (pkey in specs) {
      if (!hasProp$3.call(specs, pkey)) continue;
      pspec = specs[pkey];
      if (!(UI$1.isChild(pkey) && !((pspec.show != null) && !pspec.show))) {
        continue;
      }
      pane = new Pane$1(this.ui, this.stream, this, pspec);
      panes.push(pane);
    }
    if (UI$1.hasPack) {
      return panes;
    } else {
      return [[], panes];
    }
  }

  createPacks(specs) {
    var gkey, gpanes, gspec, pack, packs, panes;
    packs = [];
    panes = [];
    for (gkey in specs) {
      if (!hasProp$3.call(specs, gkey)) continue;
      gspec = specs[gkey];
      if (!(UI$1.isChild(gkey))) {
        continue;
      }
      gpanes = this.createPanes(gspec);
      pack = new Pack$1(this.ui, this.stream, this, gspec, gpanes);
      packs.push(pack);
      Array.prototype.push.apply(panes, gpanes);
    }
    return [packs, panes];
  }

  paneInUnion(paneCells, unionCells) {
    var ip, iu, jp, ju, mp, mu, np, nu;
    [jp, mp, ip, np] = this.jmin(paneCells);
    [ju, mu, iu, nu] = this.jmin(unionCells);
    return ju <= jp && jp + mp <= ju + mu && iu <= ip && ip + np <= iu + nu;
  }

  expandCells(unionCells, allCells) { // Not Implemented
    var ia, iu, ja, ju, ma, mu, na, nu;
    [ju, mu, iu, nu] = this.jmin(unionCells);
    [ja, ma, ia, na] = this.jmin(allCells);
    return [(ju - ja) * ma / mu, ma, (iu - ia) * na / nu, na];
  }

  jmin(cells) {
    if (cells == null) {
      Util$1.trace('UI.jmin');
    }
    return [cells[0] - 1, cells[1], cells[2] - 1, cells[3]];
  }

  toCells(jmin) {
    return [jmin[0] + 1, jmin[1], jmin[2] + 1, jmin[3]];
  }

  unionCells(cells1, cells2) {
    var i1, i2, j1, j2, m1, m2, n1, n2;
    [j1, m1, i1, n1] = UI$1.jmin(cells1);
    [j2, m2, i2, n2] = UI$1.jmin(cells2);
    return [Math.min(j1, j2) + 1, Math.max(j1 + m1, j2 + m2) - Math.min(j1, j2), Math.min(i1, i2) + 1, Math.max(i1 + n1, i2 + n2) - Math.min(i1, i2)];
  }

  intersectCells(cells1, cells2) {
    var i1, i2, j1, j2, m1, m2, n1, n2;
    [j1, m1, i1, n1] = UI$1.jmin(cells1);
    [j2, m2, i2, n2] = UI$1.jmin(cells2);
    return [Math.max(j1, j2) + 1, Math.min(j1 + m1, j2 + m2), Math.max(i1, i2) + 1, Math.min(i1 + n1, i2 + n2)];
  }

};

var View$1 = View;

var UI,
  hasProp$4 = {}.hasOwnProperty;

UI = (function() {
  class UI {
    constructor(stream, jsonPath, planeName, navbs = null, prac = null) {
      var callback;
      this.pagesReady = this.pagesReady.bind(this);
      this.resize = this.resize.bind(this);
      this.stream = stream;
      this.jsonPath = jsonPath;
      this.planeName = planeName;
      this.navbs = navbs;
      this.prac = prac;
      this.pages = {};
      callback = (data) => {
        this.specs = this.createSpecs(data);
        if (this.navbs != null) {
          this.navb = new Navb$1(this, this.stream, this.navbs);
        }
        if (UI.hasTocs) {
          this.tocs = new Tocs$1(this, this.stream, this.specs);
        }
        this.view = new View$1(this, this.stream, this.specs);
        return this.ready();
      };
      UI.readJSON(this.jsonPath, callback);
      UI.ui = this;
    }

    addPage(name, page) {
      return this.pages[name] = page;
    }

    ready() {
      $('#' + this.htmlId('App')).html(this.html());
      if (this.navbs != null) {
        this.navb.ready();
      }
      if (UI.hasTocs) {
        this.tocs.ready();
      }
      this.view.ready();
      this.stream.publish("Ready", "Ready"); // Just notification. No topic
    }

    pagesReady() {
      var name, page, ref;
      ref = this.pages;
      for (name in ref) {
        if (!hasProp$4.call(ref, name)) continue;
        page = ref[name];
        page.name = name;
        page.pane = this.view.getPane(name);
        page.spec = page.pane.spec;
        page.$pane = page.ready();
        page.isSvg = this.isElem(page.$pane.find('svg')) && page.pane.name !== 'Flavor';
        if (!page.isSvg) {
          page.pane.$.append(page.$pane);
        }
      }
    }

    createSpecs(data) {
      var specs;
      this.nrowncol(data);
      specs = UI.hasPack ? this.createPacks(data) : this.createPracs(data);
      if (this.stream.infoSpec.subscribe && this.stream.isInfo('Select')) {
        console.info('UI.createSpecs()', {
          pack: UI.hasPack,
          specs
        });
      }
      return specs;
    }

    createPacks(data) {
      var gkey, pack;
      for (gkey in data) {
        pack = data[gkey];
        if (!(UI.isChild(gkey))) {
          continue;
        }
        pack['name'] = gkey;
        data[gkey] = pack;
        pack.practices = {};
        this.createPracs(pack);
      }
      return data;
    }

    createPracs(data) {
      var ikey, item, pkey, practice, skey, study, tkey, topic;
      for (pkey in data) {
        practice = data[pkey];
        if (!(UI.isChild(pkey))) {
          continue;
        }
        if (practice['name'] == null) {
          practice['name'] = pkey;
        }
        practice.studies = {};
        if (data.practices != null) {
          data.practices[pkey] = practice;
        }
        for (skey in practice) {
          study = practice[skey];
          if (!(UI.isChild(skey))) {
            continue;
          }
          if (study['name'] == null) {
            study['name'] = skey;
          }
          study.topics = {};
          practice.studies[skey] = study;
          for (tkey in study) {
            topic = study[tkey];
            if (!(UI.isChild(tkey))) {
              continue;
            }
            if (topic['name'] == null) {
              topic['name'] = tkey;
            }
            topic.items = {};
            study.topics[tkey] = topic;
            for (ikey in topic) {
              item = topic[ikey];
              if (!(UI.isChild(ikey))) {
                continue;
              }
              if (item['name'] == null) {
                item['name'] = ikey;
              }
              topic.items[ikey] = item;
            }
          }
        }
      }
      return data;
    }

    nrowncol(data) {
      UI.nrow = data.nrow != null ? data.nrow : UI.nrow;
      return UI.ncol = data.ncol != null ? data.ncol : UI.ncol;
    }

    html() {
      var htm;
      htm = "";
      if (UI.hasLays) {
        htm += `<div class="layout-logo     " id="${this.htmlId('Logo')}"></div>`;
      }
      if (UI.hasLays || (this.navbs != null)) {
        htm += `<div class="layout-corp"      id="${this.htmlId('Corp')}"></div>`;
      }
      if (UI.hasLays) {
        htm += `<div class="layout-find"      id="${this.htmlId('Find')}"></div>`;
      }
      if (UI.hasTocs) {
        htm += `<div class="layout-tocs tocs" id="${this.htmlId('Tocs')}"></div>`;
      }
      htm += `<div class="layout-view"      id="${this.htmlId('View')}"></div>`;
      if (UI.hasLays) {
        htm += `<div class="layout-side"      id="${this.htmlId('Side')}"></div>`;
      }
      if (UI.hasLays) {
        htm += `<div class="layout-pref     " id="${this.htmlId('Pref')}"></div>`;
      }
      if (UI.hasLays) {
        htm += `<div class="layout-foot"      id="${this.htmlId('Foot')}"></div>`;
      }
      if (UI.hasLays) {
        htm += `<div class="layout-trak"      id="${this.htmlId('Trak')}"></div>`;
      }
      return htm;
    }

    show() {
      if (UI.hasTocs) {
        this.tocs.show();
      }
      this.view.showAll();
    }

    hide() {
      if (UI.hasTocs) {
        this.tocs.hide();
      }
      this.view.hideAll();
    }

    resize() {
      this.view.resize();
    }

    // Html and jQuery Utilities in UI because it is passed around everywhere
    htmlId(name, type = '', ext = '') {
      return Util$1.htmlId(name, type, ext);
    }

    getHtmlId(name, ext = '') {
      return Util$1.getHtmlId(name, "", ext);
    }

    isEmpty($elem) {
      return ($elem != null) && ($elem.length != null) && $elem.length === 0;
    }

    isElem($elem) {
      return ($elem != null) && ($elem.length != null) && $elem.length > 0;
    }

    static jQueryHasNotBeenLoaded() {
      if (typeof jQuery === 'undefined') {
        console.error('UI JQuery has not been loaded');
        return true;
      } else {
        return false;
      }
    }

    static readJSON(url, callback) {
      var settings;
      if (UI.jQueryHasNotBeenLoaded()) {
        return;
      }
      url = UI.baseUrl() + url;
      settings = {
        url: url,
        type: 'GET',
        dataType: 'json',
        processData: false,
        contentType: 'application/json',
        accepts: 'application/json'
      };
      settings.success = (data, status, jqXHR) => {
        Util$1.noop(status, jqXHR);
        return callback(data);
      };
      settings.error = (jqXHR, status, error) => {
        Util$1.noop(jqXHR);
        return console.error("UI.readJSON()", {
          url: url,
          status: status,
          error: error
        });
      };
      $.ajax(settings);
    }

    static isChild(key) {
      var a;
      a = key.charAt(0);
      return a === a.toUpperCase() && a !== '$';
    }

    static toTopic(name, source, intent, study = null) {
      var obj, tname;
      tname = name.replace(' ', '');
      obj = {
        name: tname,
        source: source,
        intent: intent
      };
      if (study != null) {
        obj.study = study;
      }
      UI.verifyTopic(obj, "UI.toTopic()");
      return obj;
    }

    static verifyTopic(topic, source) {
      var verify;
      verify = Util$1.isStr(topic.name) && Util$1.isStr(topic.source);
      if (topic.name === 'Select') {
        verify = verify && Util$1.inArray(UI.intents, topic.intent);
      }
      if (!verify) {
        console.log('UI.verifyTopic()', {
          topic: topic,
          source: source
        });
        console.trace();
      }
      return verify;
    }

    static baseUrl() {
      if (window.location.href.includes('localhost')) {
        return UI.local;
      } else {
        return UI.hosted;
      }
    }

  }
  UI.hasPack = true;

  UI.hasPage = true;

  UI.hasTocs = true;

  UI.hasLays = true;

  UI.local = "http://localhost:63342/ui/public/"; // Every app needs to change this

  UI.hosted = "https://jitter-48413.firebaseapp.com/"; // Every app needs to change this

  UI.$empty = $();

  UI.ncol = 36;

  UI.nrow = 36;

  //I.margin  =  { width:1,    height:1,    west:2,   north :1, east :2,   south 2, wStudy:0.5, hStudy:0.5 }
  UI.margin = {
    width: 0.00,
    height: 0.00,
    west: 0.5,
    north: 0,
    east: 0.5,
    south: 0,
    wStudy: 0.5,
    hStudy: 0.5
  };

  UI.SelectView = 'SelectView';

  UI.SelectPane = 'SelectPane';

  UI.SelectStudy = 'SelectStudy';

  UI.SelectTopic = 'SelectTopic';

  UI.SelectItems = 'SelectItems';

  UI.SelectRow = 'SelectRow';

  UI.SelectCol = 'SelectCol';

  UI.SelectPack = 'SelectPack';

  UI.AddChoice = 'AddChoice';

  UI.DelChoice = 'DelChoice';

  UI.intents = [UI.SelectPane, UI.SelectView, UI.SelectStudy, UI.SelectRow, UI.SelectCol, UI.SelectPack, UI.AddChoice, UI.DelChoice];

  return UI;

}).call(undefined);

var UI$1 = UI;

var Btn,
  hasProp$5 = {}.hasOwnProperty;

Btn = class Btn {
  constructor(ui, stream, pane, spec, contents1) {
    this.ui = ui;
    this.stream = stream;
    this.pane = pane;
    this.spec = spec;
    this.contents = contents1;
    this.css = this.pane.classPrefix;
  }

  ready() {
    if (this.pane.page == null) {
      return;
    }
    this.$ = $(this.html(this.contents));
    this.pane.$.append(this.$);
    this.publish(this.contents);
  }

  layout(geom) {
    if (geom.w < 200) {
      this.$.hide();
    } else {
      this.$.show();
    }
  }

  html(contents) {
    var content, html, htmlId, key, name, x;
    htmlId = this.ui.htmlId(this.pane.name, 'Btn');
    html = `<ul id="${htmlId}" class="${this.css + '-ul-content'}">`;
    x = 0;
    for (key in contents) {
      if (!hasProp$5.call(contents, key)) continue;
      content = contents[key];
      if (!(this.hasButton(content))) {
        continue;
      }
      content.btnId = this.ui.htmlId(this.pane.name, content.name + 'Btn');
      name = content.name.charAt(0);
      html += `<li id="${content.btnId}" class="${this.css + '-li-content-btn'}" style="left:${x}px;"><div>${name}</div></li>`;
      x = x + 24;
    }
    html += "</ul>";
    return html;
  }

  publish(contents) {
    var content, key, msg;
    for (key in contents) {
      if (!hasProp$5.call(contents, key)) continue;
      content = contents[key];
      if (!(this.hasButton(content))) {
        continue;
      }
      content.$btn = $('#' + content.btnId);
      msg = UI$1.content(content.name, 'Btn', UI$1.SelectStudy, this.pane.name);
      this.stream.publish('Content', msg, content.$btn, 'click');
    }
  }

  hasButton(content) {
    return content.has && content.btn && content.name;
  }

};

var Btn$1 = Btn;

var Dom,
  hasProp$6 = {}.hasOwnProperty;

Dom = (function() {
  class Dom {
    constructor() {
      this.dummy = "";
    }

    // ------ Tag Attributes ------
    static klass(name) {
      //console.log( 'Dom.klass()', { name:name } )
      return `class="${name}" `;
    }

    static htmlId(name, type, ext = "") {
      return `id="${Util$1.htmlId(name, type, ext)}" `;
    }

    static style(...props) {
      var css, i, len, prop;
      css = "";
      for (i = 0, len = props.length; i < len; i++) {
        prop = props[i];
        css += prop + ' ';
      }
      return `style="${css}" `;
    }

    // ------ CSS Propterties ------
    static position(x, y, w, h, pos = "absolute", uom = "%") {
      return `position:${pos}; left:${x}${uom}; top:${y}${uom}; width:${w}${uom}; height:${h}${uom}; `;
    }

    static margin(l, t, r, b) {
      return `margin:${t} ${r} ${b} ${l
// Uoms supplies in args
}; `;
    }

    static padding(l, t, r, b) {
      return `padding:${t} ${r} ${b} ${l
// Uoms supplies in args
}; `;
    }

    static border(color, thick) {
      return `border:solid ${color} ${thick} `;
    }

    // ------ Html Constructs ------
    static panel(x, y, w, h, align = "center") {
      return `class="panel" style="position:relative; left:${x}%; top:${y}%; width:${w}%; height:${h}%; text-align:${align};" `;
    }

    static panel1(x, y, w, h, align = "center") {
      return `<div ${Dom.klass("panel")(Dom.style(Dom.position(x, y, w, h, "relative"), `text-align:${align};`))} </div>`;
    }

    static label(x, y, w, h, klass = "label") {
      return `class="${klass}" style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%; text-align:center;" `;
    }

    static image(src, mh, mw, label = "", radius = "6px") {
      var htm, tstyle;
      tstyle = `justify-self:center; align-self:center; font-size:${mh * 0.1}vh; padding-top:3px;`;
      if (src != null) {
        tstyle += "padding-top:3px;";
      }
      htm = "<div class=\"dom-wrapp\" style=\"display:grid; width:100%; height:100%;\">";
      if (src != null) {
        htm += `<img class="dom-image" style="justify-self:center; align-self:center; max-height:${mh}vh; max-width:${mw}vw; border-radius:${radius};" src="${src}"/>`;
      }
      if (Util$1.isStr(label)) {
        htm += `<div class="dom-label" style="${tstyle}">${label}</div>`;
      }
      htm += "</div>";
      return htm;
    }

    static image2(x, y, w, h, src, mh, label = "", radius = "6px", mw = 60) {
      var htm, tstyle;
      tstyle = src != null ? `padding-top:3px; font-size:${mh * 0.3}vh` : `font-size:${mh * 0.3}vh;`;
      htm = "<div style=\"display:grid; witth:100%; height:100%;\">";
      htm += "<div style=\"justify-self:center; align-self:center;\">";
      if (src != null) {
        htm += `<img style="max-height:${mh}vh; max-width:${mw}vw; border-radius:${radius};" src="${src}"/>`;
      }
      if (Util$1.isStr(label)) {
        htm += `<div style="${tstyle}">${label}</div>`;
      }
      htm += "</div></div>";
      return htm;
    }

    static image1(x, y, w, h, src, mh, label = "", radius = "6px", mw = 60) {
      var htm, klass, tstyle;
      klass = src != null ? "image" : "texts";
      tstyle = src != null ? `padding-top:3px; font-size:${mh * 0.3}vh` : `text-align:center; font-size:${mh * 0.3
      // max-width:#{mh*4}vmin;
}vh;`;
      htm = `<div class="${klass}" style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%;">`;
      htm += "<div style=\"display:flex;\">";
      if (src != null) {
        htm += `<img style="justify-self:center; align-self:center; max-height:${mh}vh; max-width:${mw}vw; border-radius:${radius};" src="${src}"/>`;
      }
      if (Util$1.isStr(label)) {
        htm += `<div class="label" style="${tstyle}">${label}</div>`;
      }
      htm += "</div></div>";
      return htm;
    }

    static branch(x, y, w, h, label = "") {
      var htm;
      htm = `<div class="branch" style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%; display:table;">`;
      if (Util$1.isStr(label)) {
        htm += `<div style="">${label}</div>`;
      }
      htm += "</div>";
      return htm;
    }

    static img(src) {
      return `<div class="img" style="display:table-cell; vertical-align:middle;"><img style="display:block; margin-left:auto; margin-right:auto;" src="${src}"/></div>`;
    }

    static txt(str) {
      return `<div class="txt"">${str}</div>`;
    }

    static doClick(stream, widget, spec, key, study, event) {
      var $e, choice;
      Util$1.noop(event);
      $e = widget.btns[key].$e;
      if (study != null ? study.chosen : void 0) {
        study.chosen = false;
        $e.css({
          color: Dom.basisColor
        });
        $e.find("button").removeClass("btn-nice-active");
        choice = UI$1.toTopic(spec.name, spec.name, UI$1.DelChoice, key); // spec.name and source are the same
        stream.publish('Choice', choice);
      } else {
        study.chosen = true;
        $e.css({
          color: Dom.choiceColor
        });
        $e.find("button").addClass("btn-nice-active");
        choice = UI$1.toTopic(spec.name, spec.name, UI$1.AddChoice, key); // spec.name and source are the same
        stream.publish('Choice', choice);
      }
    }

    //console.log( 'Dom.doClick', choice )
    static onChoice(choice, name, widget) {
      var $e;
      if (choice.name !== name || choice.source === name) {
        return;
      }
      // console.log( 'Dom.onChoice()', { name:name, choice:choice, btns:widget.btns, choiceName:choice.name } )
      if (!((widget.btns[choice.study] != null) && (widget.btns[choice.study].$e != null))) {
        console.error('Dom.onChoice()', {
          name: name,
          study: choice.study,
          btns: widget.btns
        });
        return;
      }
      $e = widget.btns[choice.study].$e;
      if ($e != null) {
        if (choice.intent === UI$1.AddChoice) {
          $e.find("button").addClass("btn-nice-active");
        } else {
          $e.find("button").removeClass("btn-nice-active");
        }
      } else {
        console.error("Dom.onChoice() $e missing for", {
          name: name,
          choice: choice
        });
      }
    }

    static doEnter(widget, key, study) {
      if (!(study != null ? study.chosen : void 0)) {
        return widget.btns[key].$e.css({
          color: Dom.hoverColor
        });
      }
    }

    static doLeave(widget, key, study) {
      if (!(study != null ? study.chosen : void 0)) {
        return widget.btns[key].$e.css({
          color: Dom.basisColor
        });
      }
    }

    static onEvents(stream, widget, spec, key, study) {
      var $e;
      $e = widget.btns[key].$e;
      $e.on('click', function(event) {
        return Dom.doClick(stream, widget, spec, key, study, event);
      });
      $e.on('mouseenter', function() {
        return Dom.doEnter(widget, key, study);
      });
      $e.on('mouseleave', function() {
        return Dom.doLeave(widget, key, study);
      });
    }

    static horz(stream, spec, imgDir, hpc = 1.00, x0 = 0, y0 = 0) {
      var $e, $p, dx, key, n, src, study, th, x, y;
      th = spec.name === 'Roast' ? 18 : 13; // A hack
      $p = $(`<div   ${Dom.panel(0, 0, 100, 100)}></div>`);
      $p.append(`<h2 ${Dom.label(0, th, 10, 90)}>${spec.name}</h2>`);
      n = Util$1.lenObject(spec, UI$1.isChild);
      x = x0;
      y = y0;
      dx = (100 - x0) / n;
      for (key in spec) {
        if (!hasProp$6.call(spec, key)) continue;
        study = spec[key];
        if (!(UI$1.isChild(key))) {
          continue;
        }
        src = study.icon != null ? imgDir + study.icon : null;
        $e = $(`${Dom.image(x, y, dx, 100 * hpc, src, 9 * hpc, study.name)}`);
        Dom.addWidgetBtn(widget, key, $e);
        Dom.onEvents(stream, widget, spec, key, study);
        $p.append($e);
        x = x + dx;
      }
      return $p;
    }

    static vert(stream, spec, widget, imgDir, hpc = 1.00, x0 = 0, y0 = 0) {
      var $e, $p, dy, key, mh, n, src, study, x, y;
      $p = $(`<div    ${Dom.panel(0, 0, 100, 100, align)}></div>`);
      $p.append(`<div ${Dom.label(0, 3, 100, 10)}>${spec.name}</div>`);
      n = Util$1.lenObject(spec, UI$1.isChild);
      x = x0;
      y = y0;
      dy = (100 - y0 - 5) / n;
      for (key in spec) {
        if (!hasProp$6.call(spec, key)) continue;
        study = spec[key];
        if (!(UI$1.isChild(key))) {
          continue;
        }
        src = study.icon != null ? imgDir + study.icon : null;
        mh = spec.pane.toVh(dy) * 0.6;
        $e = $(`${Dom.image(x, y, 100, dy * hpc, src, mh, study.name)}`);
        Dom.addWidgetBtn(widget, key, $e);
        Dom.onEvents(stream, widget, spec, key, study);
        $p.append($e);
        y = y + dy;
      }
      return $p;
    }

    static vertBtns(stream, spec, widget, imgDir, w = 50, x0 = 0, y0 = 0) {
      var $e, $p, back, dy, icon, iconc, key, mh, n, src, study, x, y;
      $p = $(`<div    ${Dom.panel(0, 0, 100, 100)}></div>`);
      $p.append(`<div ${Dom.label(0, 3, 100, 10)}>${spec.name}</div>`);
      n = Util$1.lenObject(spec, UI$1.isChild);
      x = x0;
      y = y0;
      dy = (100 - y0 - 5) / n;
      for (key in spec) {
        if (!hasProp$6.call(spec, key)) continue;
        study = spec[key];
        if (!(UI$1.isChild(key))) {
          continue;
        }
        src = study.img != null ? imgDir + study.img : null;
        icon = (src == null) && study.icon ? study.icon : null;
        iconc = (icon != null) && study.iconc ? study.iconc : null; // icon color
        back = study.back != null ? study.back : "#3B5999";
        mh = spec.pane.toVh(dy * 0.5);
        $e = $(Dom.btn(x, y, w, dy, back, study.name, icon, iconc, src, mh));
        Dom.addWidgetBtn(widget, key, $e);
        Dom.onEvents(stream, widget, spec, key, study);
        $p.append($e);
        y = y + dy; // https://is.gd/CEPUez
      }
      // console.log( 'Dom.vertButtons()', { btns:widget.btns } )
      return $p;
    }

    static btn(x, y, w, h, back = "#3B5999", label = null, icon = null, iconc = null, src = null, mh = null) {
      var htm;
      htm = `<div style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%;">`;
      htm += `<button class="btn-nice" style="background-color:${back}">`;
      if ((icon != null) && (iconc != null)) {
        htm += `<i      class="btn-icons ${icon} fa-lg" style="color:${iconc}"></i>`;
      }
      if ((src != null) && (mh != null)) {
        htm += `<img    class="btn-image" style="max-height:${mh}vh;" src="${src}"/>`;
      }
      if (label != null) {
        htm += `<div    class="btn-label">${label}</div>`;
      }
      htm += "</button></div>";
      return htm;
    }

    static tree(stream, spec, name, widget, x0 = 0, y0 = 0) {
      var $e, $p, dy, key, n, study, x, y;
      $p = $(`<div    ${Dom.panel(0, 0, 100, 100, "left")}></div>`);
      $p.append(`<div ${Dom.label(0, 3, 100, 10)}>${name}</div>`);
      n = Util$1.lenObject(spec, UI$1.isChild);
      x = x0;
      y = y0;
      dy = (100 - y0) / n;
      for (key in spec) {
        if (!hasProp$6.call(spec, key)) continue;
        study = spec[key];
        if (!(UI$1.isChild(key))) {
          continue;
        }
        $e = $(`${Dom.branch(x, y, 100, dy, study.name)}`);
        //study.num = 0
        Dom.addWidgetBtn(widget, key, $e);
        Dom.onEvents(stream, widget, spec, key, study);
        $p.append($e);
        y = y + dy;
      }
      return $p;
    }

    static addWidgetBtn(widget, key, $e) {
      widget.btns[key] = {};
      widget.btns[key].$e = $e;
    }

    static hasJQueryPlugin(plugin, issue = true) {
      var glob, has, plug;
      glob = Util$1.firstTok(plugin, '.');
      plug = Util$1.lastTok(plugin, '.');
      has = (window[glob] != null) && (window[glob][plug] != null);
      if (!has && issue) {
        console.error(`Util.hasPlugin()  $${glob + '.' + plug} not present`);
      }
      return has;
    }

    static cssPosition(screen, port, land) {
      var array;
      array = screen.orientation === 'Portrait' ? port : land;
      $.css(Util$1.toPositionPc(array));
    }

  }
  Dom.choiceColor = "yellow";

  Dom.hoverColor = "wheat";

  Dom.basisColor = "black";

  Dom.opacity = 0.6;

  return Dom;

}).call(undefined);

var Dom$1 = Dom;

var Page,
  hasProp$7 = {}.hasOwnProperty;

Page = (function() {
  class Page {
    constructor(stream, ui, name1) {
      this.ready = this.ready.bind(this);
      this.layout = this.layout.bind(this);
      this.onContent = this.onContent.bind(this);
      this.stream = stream;
      this.ui = ui;
      this.name = name1;
      this.ui.addPage(this.name, this);
      this.pane = this.ui.view.getPane(this.name);
      this.spec = this.pane.spec;
      this.icon = this.spec.icon;
      this.contents = Page.contents;
      this.contenta = Page.contenta;
      this.choice = "Study";
      this.subscribe();
    }

    ready(choice = this.choice) {
      var $c;
      this.choice = choice;
      $c = UI$1.$empty;
      if (this.ui.prac != null) {
        this.contents[choice] = this.ui.prac.createContent(choice, this.pane, this);
        $c = this.contents[choice].ready(choice);
        this.contents[choice].layout();
      } else if (choice === 'View') {
        this.contents[choice] = this;
        $c = $(`<h1 style=" display:grid; justify-self:center; align-self:center; ">${this.name}</h1>`);
      } else {
        console.error(`Subclass ${this.name} needs to implement ready()`);
      }
      return $c;
    }

    layout() {
      return Util$1.noop();
    }

    subscribe() {
      this.stream.subscribe('Content', 'Page' + this.name, (content) => {
        return this.onContent(content);
      });
    }

    onContent(content) {
      var app, choice;
      choice = Util$1.inArray(this.contenta, content.intent) ? content.intent : this.choice;
      if (this.stream.isInfo('Content')) {
        console.info('Page.onContent()', {
          name: this.name,
          choice: choice,
          content: content
        });
      }
      if ((this.contents[this.choice].$ != null) && Util$1.isStr(this.choice)) {
        this.contents[this.choice].$.hide();
      }
      if (Util$1.isObjEmpty(this.contents[choice])) {
        this.choice = choice;
        this.pane.$.append(this.ready());
      } else {
        if (choice === 'Study' && this.choice === 'Study') {
          this.contents['Study'].intent(content.intent);
        }
        app = this.contents[choice];
        app.layout();
        if (app.$ != null) {
          app.$.show();
        }
        this.choice = choice;
      }
    }

    getStudy(name) {
      var key, ref, study;
      ref = this.spec.studies;
      for (key in ref) {
        if (!hasProp$7.call(ref, key)) continue;
        study = ref[key];
        if (name !== 'None') {
          if (key === name) {
            return study;
          }
        }
      }
      return 'None';
    }

    publish($on) {
      var select;
      if (this.ui.isElem($on)) {
        select = UI$1.toTopic(this.name, 'Page', UI$1.SelectPane);
        this.stream.publish('Select', select, $on, 'click');
      }
    }

    publishJQueryObjects(objects, intent) {
      var $object, name, select;
      {
        return;
      }
      for (name in objects) {
        $object = objects[name];
        if (!(this.ui.isElem($object))) {
          continue;
        }
        select = UI$1.toTopic(this.name, 'Page', intent);
        if (this.stream.isInfo('Select')) {
          console.info('Page.publishJQueryObjects()');
        }
        this.stream.publish('Select', select, $object, 'click');
      }
    }

  }
  // Ready is the default content that is create by the devived
  Page.contents = {
    View: {},
    Arrow: {},
    Texts: {},
    Graph: {},
    Icons: {},
    Pivot: {},
    Study: {}
  };

  Page.contenta = Object.keys(Page.contents);

  return Page;

}).call(undefined);

var Page$1 = Page;

// Needs choma-js
var Color;

Color = class Color {
  //module.exports = Color
  //Color.Palettes = require( 'js/d3d/Palettes' )
  //Color.chroma   = require( 'chroma-js' )
  static rad(deg) {
    return deg * Math.PI / 180;
  }

  static deg(rad) {
    return rad * 180 / Math.PI;
  }

  static sin(deg) {
    return Math.sin(Color.rad(deg));
  }

  static cos(deg) {
    return Math.cos(Color.rad(deg));
  }

  static rot(deg, ang) {
    var a;
    a = deg + ang;
    if (a < 0) {
      a = a + 360;
    }
    return a;
  }

  static toRadian(h, hueIsRygb = false) {
    var hue, radian;
    hue = hueIsRygb ? Color.toHueRygb(h) : h;
    radian = 2 * Math.PI * (90 - hue) / 360; // Correction for MathBox polar coordinate system
    if (radian < 0) {
      radian = 2 * Math.PI + radian;
    }
    return radian;
  }

  static svgDeg(deg) {
    return 360 - deg;
  }

  static svgRad(rad) {
    return 2 * Math.PI - rad;
  }

  static radSvg(deg) {
    return Color.rad(360 - deg);
  }

  static degSvg(rad) {
    return Color.deg(2 * Math.PI - rad);
  }

  static sinSvg(deg) {
    return Math.sin(Color.radSvg(deg));
  }

  static cosSvg(deg) {
    return Math.cos(Color.radSvg(deg));
  }

  // => specified for methods to be used as callbacks
  static chRgbHsl(h, s, l) {
    return Color.chroma.hsl(h, s, l).rgb();
  }

  static chRgbHsv(h, s, v) {
    return Color.chroma.hsv(h, s, v).rgb();
  }

  static chRgbLab(L, a, b) {
    return Color.chroma.lab(L, a, b).rgb();
  }

  static chRgbLch(L, c, h) {
    return Color.chroma.lch(l, c, h).rgb();
  }

  static chRgbHcl(h, c, l) {
    return Color.chroma.hsl(h, s, l).rgb();
  }

  static chRgbCmyk(c, m, y, k) {
    return Color.chroma.hsl(c, m, y, k).rgb();
  }

  static chRgbGl(R, G, B) {
    return Color.chroma.gl(R, G, B).rgb();
  }

  static toRgbRygb(r, y, g, b) {
    return [Math.max(r, y, 0), Math.max(g, y, 0), Math.max(b, 0)];
  }

  static toRygbRgb(r, g, b) {
    return [
      r,
      Math.max(r,
      g),
      g,
      b // Needs Work
    ];
  }

  static toRgbHsvSigmoidal(H, C, V, toRygb = true) {
    var b, c, d, f, g, h, i, r, v, x, y, z;
    h = toRygb ? Color.toHueRgb(H) : H;
    d = C * 0.01;
    c = Color.sigmoidal(d, 2, 0.25);
    v = V * 0.01;
    i = Math.floor(h / 60);
    f = h / 60 - i;
    x = 1 - c;
    y = 1 - f * c;
    z = 1 - (1 - f) * c;
    [r, g, b] = (function() {
      switch (i % 6) {
        case 0:
          return [1, z, x, 1];
        case 1:
          return [y, 1, x, 1];
        case 2:
          return [x, 1, z, 1];
        case 3:
          return [x, y, 1, 1];
        case 4:
          return [z, x, 1, 1];
        case 5:
          return [1, x, y, 1];
      }
    })();
    return [r * v, g * v, b * v, 1];
  }

  static toRgbHsv(H, C, V, toRygb = true) {
    var b, c, f, g, h, i, r, v, x, y, z;
    h = toRygb ? Color.toHueRgb(H) : H;
    c = C * 0.01;
    v = V * 0.01;
    i = Math.floor(h / 60);
    f = h / 60 - i;
    x = 1 - c;
    y = 1 - f * c;
    z = 1 - (1 - f) * c;
    [r, g, b] = (function() {
      switch (i % 6) {
        case 0:
          return [1, z, x, 1];
        case 1:
          return [y, 1, x, 1];
        case 2:
          return [x, 1, z, 1];
        case 3:
          return [x, y, 1, 1];
        case 4:
          return [z, x, 1, 1];
        case 5:
          return [1, x, y, 1];
      }
    })();
    return [r * v, g * v, b * v, 1];
  }

  // Key algorithm from HCI for converting RGB to HCS  h 360 c 100 s 100
  static toHcsRgb(R, G, B, toRygb = true) {
    var H, a, b, c, g, h, r, s, sum;
    sum = R + G + B;
    r = R / sum;
    g = G / sum;
    b = B / sum;
    s = sum / 3;
    c = R === G && G === B ? 0 : 1 - 3 * Math.min(r, g, b); // Center Grayscale
    a = Color.deg(Math.acos((r - 0.5 * (g + b)) / Math.sqrt((r - g) * (r - g) + (r - b) * (g - b))));
    h = b <= g ? a : 360 - a;
    if (c === 0) {
      h = 0;
    }
    H = toRygb ? Color.toHueRgb(h) : h;
    return [H, c * 100, s / 2.55];
  }

  static toRgbCode(code) {
    var hex, rgb, s, str;
    str = Color.Palettes.hex(code).replace("#", "0x");
    hex = Number.parseInt(str, 16);
    rgb = Color.hexRgb(hex);
    s = 1 / 256;
    return [rgb.r * s, rgb.g * s, rgb.b * s, 1];
  }

  static toRgba(studyPrac) {
    var h, s, v;
    if ((studyPrac.hsv != null) && studyPrac.hsv.length === 3) {
      [h, s, v] = studyPrac.hsv;
      return Color.toRgbHsvSigmoidal(h, s, v);
    } else if (studyPrac.fill.length <= 5) {
      return Color.toRgbCode(studyPrac.fill);
    } else {
      console.error('Color.toRgba() unknown fill code', studyPrac.name, studyPrac.fill);
      return '#888888';
    }
  }

  static toHsvHex(hexStr) {
    var hex, hsv, rgb, str;
    str = hexStr.replace("#", "0x");
    hex = Number.parseInt(str, 16);
    rgb = Color.hexRgb(hex);
    hsv = Color.toHcsRgb(rgb.r, rgb.g, rgb.b);
    return hsv;
  }

  static toHexRgb(rgb) {
    return rgb[0] * 4026 + rgb[1] * 256 + rgb[2];
  }

  static toCssHex(hex) {
    return `#${hex.toString(16) // For orthogonality
}`;
  }

  static toCssHsv1(hsv) {
    var css, hex, rgb;
    rgb = Color.toRgbHsv(hsv[0], hsv[1], hsv[2]);
    hex = Color.toHexRgbSigmoidal(rgb);
    css = `#${hex.toString()}`;
    return css;
  }

  static toCssHsv2(hsv) {
    var css, rgb;
    rgb = Color.toRgbHsvSigmoidal(hsv[0], hsv[1], hsv[2]);
    css = Color.chroma.gl(rgb[0], rgb[1], rgb[2]).hex();
    return css;
  }

  static toHsvCode(code) {
    var hsv, i, j, rgb;
    rgb = Color.toRgbCode(code);
    hsv = Color.toHcsRgb(rgb[0], rgb[1], rgb[2], true);
    for (i = j = 0; j < 3; i = ++j) {
      hsv[i] = Math.round(hsv[i]);
    }
    return hsv;
  }

  static chRgbHsvStr(hsv) {
    var h, i, j, rgb;
    h = Color.toHueRgb(hsv[0]);
    rgb = Color.chRgbHsv(h, hsv[1] * 0.01, hsv[2] * 0.01);
    for (i = j = 0; j < 3; i = ++j) {
      rgb[i] = Math.round(rgb[i]);
    }
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},1)`;
  }

  static toRgbHsvStr(hsv) {
    var a, b, g, i, j, r, rgba, str;
    rgba = Color.toRgbHsvSigmoidal(hsv[0], hsv[1], hsv[2] * 255, true);
    for (i = j = 0; j < 3; i = ++j) {
      rgba[i] = Math.round(rgba[i]);
    }
    [r, g, b, a] = rgba;
    str = `rgba(${r},${g},${b},${a})`;
    //console.log( "Color.toRgbHsvStr()", {h:hsv[0],s:hsv[1],v:hsv[2]}, str )
    return str;
  }

  static sigmoidal(x, k, x0 = 0.5, L = 1) {
    return L / (1 + Math.exp(-k * (x - x0)));
  }

  rgbaStr(rgba) {
    var a, b, g, n, r;
    n = function(f) {
      return Math.round(f);
    };
    [r, g, b, a] = rgba;
    return `rgba(${n(r)},${n(g)},${n(b)},${n(a)})`;
  }

  static toRgbHcs(H, C, S, toRygb = true) {
    var b, c, g, h, max, r, s, v, x, y, z;
    h = toRygb ? Color.toHueRgb(H) : H;
    c = C * 0.01;
    s = S * 0.01;
    x = 1 - c;
    y = (a) => {
      return 1 + c * Color.cos(h - a) / Color.cos(a + 60 - h);
    };
    z = (a) => {
      return 3 - x - y(a);
    };
    [r, g, b] = [0, 0, 0];
    if (0 <= h && h < 120) {
      [r, g, b] = [y(0), z(0), x];
    }
    if (120 <= h && h < 240) {
      [r, g, b] = [x, y(120), z(120)];
    }
    if (240 <= h && h < 360) {
      [r, g, b] = [z(240), x, y(240)];
    }
    max = Math.max(r, g, b) * s;
    v = max > 255 ? s * 255 / max : s;
    return [r * v, g * v, b * v, 1];
  }

  static toRgbSphere(hue, phi, rad) {
    return Color.toRgbHsv(Color.rot(hue, 90), 100 * Color.sin(phi), 100 * rad);
  }

  static toHclRygb(r, y, g, b) {
    var C, H, L;
    L = (r + y + g + b) / 4;
    C = (Math.abs(r - y) + Math.abs(y - g) + Math.abs(g - b) + Math.abs(b - r)) / 4;
    H = Color.angle(r - g, y - b, 0);
    return [H, C, L];
  }

  static sScale(hue, c, s) {
    var ch, m120, m60, s60, ss;
    ss = 1.0;
    m60 = hue % 60;
    m120 = hue % 120;
    s60 = m60 / 60;
    ch = c / 100;
    ss = m120 < 60 ? 3.0 - 1.5 * s60 : 1.5 + 1.5 * s60;
    return s * (1 - ch) + s * ch * ss;
  }

  static sScaleCf(hue, c, s) {
    var cf, cosd, cosu, m120, m60, ss;
    ss = sScale(hue, c, s);
    m60 = hue % 60;
    m120 = hue % 120;
    cosu = (1 - Color.cos(m60)) * 100.00;
    cosd = (1 - Color.cos(60 - m60)) * 100.00;
    cf = m120 < 60 ? cosu : cosd;
    return ss - cf;
  }

  // ransform RGB to RYGB hue
  static toHueRygb(hue) {
    var hRygb;
    hRygb = 0;
    if (0 <= hue && hue < 120) {
      hRygb = hue * 180 / 120;
    } else if (120 <= hue && hue < 240) {
      hRygb = 180 + (hue - 120) * 90 / 120;
    } else if (240 <= hue && hue < 360) {
      hRygb = 270 + (hue - 240) * 90 / 120;
    }
    return hRygb;
  }

  // ransform RyGB to RGB hueT
  static toHueRgb(hue) {
    var hRgb;
    hRgb = 0;
    if (0 <= hue && hue < 90) {
      hRgb = hue * 60 / 90;
    } else if (90 <= hue && hue < 180) {
      hRgb = 60 + (hue - 90) * 60 / 90;
    } else if (180 <= hue && hue < 270) {
      hRgb = 120 + (hue - 180) * 120 / 90;
    } else if (270 <= hue && hue < 360) {
      hRgb = 240 + (hue - 270) * 120 / 90;
    }
    return hRgb;
  }

  static pad2(n) {
    var s;
    s = n.toString();
    if (0 <= n && n <= 9) {
      s = '&nbsp;' + s;
    }
    return s;
  }

  static pad3(n) {
    var s;
    s = n.toString();
    if (0 <= n && n <= 9) {
      s = '&nbsp;&nbsp;' + s;
    }
    if (10 <= n && n <= 99) {
      s = '&nbsp;' + s;
    }
    //Util.dbg( 'pad', { s:'|'+s+'|', n:n,  } )
    return s;
  }

  static dec(f) {
    return Math.round(f * 100) / 100;
  }

  static quotes(str) {
    return '"' + str + '"';
  }

  static within(beg, deg, end) {
    return beg <= deg && deg <= end; // Closed interval with <=
  }

  static isZero(v) {
    return -0.01 < v && v < 0.01;
  }

  static floor(x, dx) {
    var dr;
    dr = Math.round(dx);
    return Math.floor(x / dr) * dr;
  }

  static ceil(x, dx) {
    var dr;
    dr = Math.round(dx);
    return Math.ceil(x / dr) * dr;
  }

  static to(a, a1, a2, b1, b2) {
    return (a - a1) / (a2 - a1) * (b2 - b1) + b1; // Linear transforms that calculates b from a
  }

  
  // Need to fully determine if these isZero checks are really necessary. Also need to account for SVG angles
  static angle(x, y) {
    var ang;
    if (!this.isZero(x) && !this.isZero(y)) {
      ang = Color.deg(Math.atan2(y, x));
    }
    if (this.isZero(x) && this.isZero(y)) {
      ang = 0;
    }
    if (x > 0 && this.isZero(y)) {
      ang = 0;
    }
    if (this.isZero(x) && y > 0) {
      ang = 90;
    }
    if (x < 0 && this.isZero(y)) {
      ang = 180;
    }
    if (this.isZero(x) && y < 0) {
      ang = 270;
    }
    ang = Color.deg(Math.atan2(y, x));
    return ang = ang < 0 ? 360 + ang : ang;
  }

  static angleSvg(x, y) {
    return Color.angle(x, -y);
  }

  static minRgb(rgb) {
    return Math.min(rgb.r, rgb.g, rgb.b);
  }

  static maxRgb(rgb) {
    return Math.max(rgb.r, rgb.g, rgb.b);
  }

  static sumRgb(rgb) {
    return rgb.r + rgb.g + rgb.b;
  }

  static hexCss(hex) {
    return `#${hex.toString(16) // For orthogonality
}`;
  }

  static rgbCss(rgb) {
    return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
  }

  static hslCss(hsl) {
    return `hsl(${hsl.h},${hsl.s * 100}%,${hsl.l * 100}%)`;
  }

  static hsiCss(hsi) {
    return Color.hslCss(Color.rgbToHsl(Color.hsiToRgb(hsi)));
  }

  static hsvCss(hsv) {
    return Color.hslCss(Color.rgbToHsl(Color.hsvToRgb(hsv)));
  }

  static roundRgb(rgb, f = 1.0) {
    return {
      r: Math.round(rgb.r * f),
      g: Math.round(rgb.g * f),
      b: Math.round(rgb.b * f)
    };
  }

  static roundHsl(hsl) {
    return {
      h: Math.round(hsl.h),
      s: Color.dec(hsl.s),
      l: Color.dec(hsl.l)
    };
  }

  static roundHsi(hsi) {
    return {
      h: Math.round(hsi.h),
      s: Color.dec(hsi.s),
      i: Math.round(hsi.i)
    };
  }

  static roundHsv(hsv) {
    return {
      h: Math.round(hsv.h),
      s: Color.dec(hsv.s),
      v: Color.dec(hsv.v)
    };
  }

  static fixedDec(rgb) {
    return {
      r: Color.dec(rgb.r),
      g: Color.dec(rgb.g),
      b: Color.dec(rgb.b)
    };
  }

  static hexRgb(hex) {
    return Color.roundRgb({
      r: (hex & 0xFF0000) >> 16,
      g: (hex & 0x00FF00) >> 8,
      b: hex & 0x0000FF
    });
  }

  static rgbHex(rgb) {
    return rgb.r * 4096 + rgb.g * 256 + rgb.b;
  }

  static cssRgb(str) {
    var hex, hsl, rgb, toks;
    rgb = {
      r: 0,
      g: 0,
      b: 0
    };
    if (str[0] === '#') {
      hex = parseInt(str.substr(1), 16);
      rgb = Color.hexRgb(hex);
    } else if (str.slice(0, 3) === 'rgb') {
      toks = str.split(/[\s,\(\)]+/);
      rgb = Color.roundRgb({
        r: parseInt(toks[1]),
        g: parseInt(toks[2]),
        b: parseInt(toks[3])
      });
    } else if (str.slice(0, 3) === 'hsl') {
      toks = str.split(/[\s,\(\)]+/);
      hsl = {
        h: parseInt(toks[1]),
        s: parseInt(toks[2]),
        l: parseInt(toks[3])
      };
      rgb = Color.hslToRgb(hsl);
    } else {
      console.error('Color.cssRgb() unknown CSS color', str);
    }
    return rgb;
  }

  // Util.dbg( 'Color.cssRgb', toks.length, { r:toks[1], g:toks[2], b:toks[3] } )
  static rgbToHsi(rgb) {
    var a, b, g, h, i, r, s, sum;
    sum = Color.sumRgb(rgb);
    r = rgb.r / sum;
    g = rgb.g / sum;
    b = rgb.b / sum;
    i = sum / 3;
    s = 1 - 3 * Math.min(r, g, b);
    a = Color.deg(Math.acos((r - 0.5 * (g + b)) / Math.sqrt((r - g) * (r - g) + (r - b) * (g - b))));
    h = b <= g ? a : 360 - a;
    return Color.roundHsi({
      h: h,
      s: s,
      i: i
    });
  }

  static hsiToRgb(hsi) {
    var fac, h, i, max, rgb, s, x, y, z;
    h = hsi.h;
    s = hsi.s;
    i = hsi.i;
    x = 1 - s;
    y = function(a) {
      return 1 + s * Color.cos(h - a) / Color.cos(a + 60 - h);
    };
    z = function(a) {
      return 3 - x - y(a);
    };
    rgb = {
      r: 0,
      g: 0,
      b: 0
    };
    if (0 <= h && h < 120) {
      rgb = {
        r: y(0),
        g: z(0),
        b: x
      };
    }
    if (120 <= h && h < 240) {
      rgb = {
        r: x,
        g: y(120),
        b: z(120)
      };
    }
    if (240 <= h && h < 360) {
      rgb = {
        r: z(240),
        g: x,
        b: y(240)
      };
    }
    max = Color.maxRgb(rgb) * i;
    fac = max > 255 ? i * 255 / max : i;
    //Util.dbg('Color.hsiToRgb', hsi, Color.roundRgb(rgb,fac), Color.fixedDec(rgb), Color.dec(max) )
    return Color.roundRgb(rgb, fac);
  }

  static hsvToRgb(hsv) {
    var f, i, p, q, rgb, t, v;
    i = Math.floor(hsv.h / 60);
    f = hsv.h / 60 - i;
    p = hsv.v * (1 - hsv.s);
    q = hsv.v * (1 - f * hsv.s);
    t = hsv.v * (1 - (1 - f) * hsv.s);
    v = hsv.v;
    rgb = (function() {
      switch (i % 6) {
        case 0:
          return {
            r: v,
            g: t,
            b: p
          };
        case 1:
          return {
            r: q,
            g: v,
            b: p
          };
        case 2:
          return {
            r: p,
            g: v,
            b: t
          };
        case 3:
          return {
            r: p,
            g: q,
            b: v
          };
        case 4:
          return {
            r: t,
            g: p,
            b: v
          };
        case 5:
          return {
            r: v,
            g: p,
            b: q
          };
        default:
          console.error('Color.hsvToRgb()');
          return {
            r: v,
            g: t,
            b: p // Should never happend
          };
      }
    })();
    return Color.roundRgb(rgb, 255);
  }

  static rgbToHsv(rgb) {
    var d, h, max, min, s, v;
    rgb = Color.rgbRound(rgb, 1 / 255);
    max = Color.maxRgb(rgb);
    min = Color.maxRgb(rgb);
    v = max;
    d = max - min;
    s = max === 0 ? 0 : d / max;
    h = 0; // achromatic
    if (max !== min) {
      h = (function() {
        switch (max) {
          case r:
            return (rgb.g - rgb.b) / d + (g < b ? 6 : 0);
          case g:
            return (rgb.b - rgb.r) / d + 2;
          case b:
            return (rgb.r - rgb.g) / d + 4;
          default:
            return console.error('Color.rgbToHsv');
        }
      })();
    }
    return {
      h: Math.round(h * 60),
      s: Color.dec(s),
      v: Color.dec(v)
    };
  }

  static hslToRgb(hsl) {
    var b, g, h, l, p, q, r, s;
    h = hsl.h;
    s = hsl.s;
    l = hsl.l;
    r = 1;
    g = 1;
    b = 1;
    if (s !== 0) {
      q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      p = 2 * l - q;
      r = Color.hue2rgb(p, q, h + 1 / 3);
      g = Color.hue2rgb(p, q, h);
      b = Color.hue2rgb(p, q, h - 1 / 3);
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  static hue2rgb(p, q, t) {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
      return q;
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
  }

  static rgbsToHsl(red, green, blue) {
    return this.rgbToHsl({
      r: red,
      g: green,
      b: blue
    });
  }

  static rgbToHsl(rgb) {
    var b, d, g, h, l, max, min, r, s;
    r = rgb.r / 255;
    g = rgb.g / 255;
    b = rgb.b / 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    h = 0; // achromatic
    l = (max + min) / 2;
    s = 0;
    if (max !== min) {
      d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = (function() {
        switch (max) {
          case r:
            return (g - b) / d + (g < b ? 6 : 0);
          case g:
            return (b - r) / d + 2;
          case b:
            return (r - g) / d + 4;
          default:
            console.error('Color.@rgbToHsl()');
            return 0;
        }
      })();
    }
    return {
      h: Math.round(h * 60),
      s: Color.dec(s),
      l: Color.dec(l)
    };
  }

};

/*
var setCursor = function (icon) {
var tempElement = document.createElement("i");
tempElement.className = icon;
document.body.appendChild(tempElement);
var character = window.getComputedStyle(
    document.querySelector('.' + icon), ':before'
).getPropertyValue('content');
tempElement.remove();
*/
var Color$1 = Color;

var FaLookup;

FaLookup = (function() {
  class FaLookup {}
  FaLookup.icons = {
    "fas fa-address-book": "\uf2b9",
    "fas fa-address-card": "\uf2bb",
    "fas fa-adjust": "\uf042",
    "fas fa-align-center": "\uf037",
    "fas fa-align-justify": "\uf039",
    "fas fa-align-left": "\uf036",
    "fas fa-align-right": "\uf038",
    "fas fa-allergies": "\uf461",
    "fas fa-ambulance": "\uf0f9",
    "fas fa-american-sign-language-interpreting": "\uf2a3",
    "fas fa-anchor": "\uf13d",
    "fas fa-angle-double-down": "\uf103",
    "fas fa-angle-double-left": "\uf100",
    "fas fa-angle-double-right": "\uf101",
    "fas fa-angle-double-up": "\uf102",
    "fas fa-angle-down": "\uf107",
    "fas fa-angle-left": "\uf104",
    "fas fa-angle-right": "\uf105",
    "fas fa-angle-up": "\uf106",
    "fas fa-archive": "\uf187",
    "fas fa-arrow-alt-circle-down": "\uf358",
    "fas fa-arrow-alt-circle-left": "\uf359",
    "fas fa-arrow-alt-circle-right": "\uf35a",
    "fas fa-arrow-alt-circle-up": "\uf35b",
    "fas fa-arrow-circle-down": "\uf0ab",
    "fas fa-arrow-circle-left": "\uf0a8",
    "fas fa-arrow-circle-right": "\uf0a9",
    "fas fa-arrow-circle-up": "\uf0aa",
    "fas fa-arrow-down": "\uf063",
    "fas fa-arrow-left": "\uf060",
    "fas fa-arrow-right": "\uf061",
    "fas fa-arrow-up": "\uf062",
    "fas fa-arrows-alt": "\uf0b2",
    "fas fa-arrows-alt-h": "\uf337",
    "fas fa-arrows-alt-v": "\uf338",
    "fas fa-assistive-listening-systems": "\uf2a2",
    "fas fa-asterisk": "\uf069",
    "fas fa-at": "\uf1fa",
    "fas fa-audio-description": "\uf29e",
    "fas fa-backward": "\uf04a",
    "fas fa-balance-scale": "\uf24e",
    "fas fa-ban": "\uf05e",
    "fas fa-band-aid": "\uf462",
    "fas fa-barcode": "\uf02a",
    "fas fa-bars": "\uf0c9",
    "fas fa-baseball-ball": "\uf433",
    "fas fa-basketball-ball": "\uf434",
    "fas fa-bath": "\uf2cd",
    "fas fa-battery-empty": "\uf244",
    "fas fa-battery-full": "\uf240",
    "fas fa-battery-half": "\uf242",
    "fas fa-battery-quarter": "\uf243",
    "fas fa-battery-three-quarters": "\uf241",
    "fas fa-bed": "\uf236",
    "fas fa-beer": "\uf0fc",
    "fas fa-bell": "\uf0f3",
    "fas fa-bell-slash": "\uf1f6",
    "fas fa-bicycle": "\uf206",
    "fas fa-binoculars": "\uf1e5",
    "fas fa-birthday-cake": "\uf1fd",
    "fas fa-blind": "\uf29d",
    "fas fa-bold": "\uf032",
    "fas fa-bolt": "\uf0e7",
    "fas fa-bomb": "\uf1e2",
    "fas fa-book": "\uf02d",
    "fas fa-bookmark": "\uf02e",
    "fas fa-bowling-ball": "\uf436",
    "fas fa-box": "\uf466",
    "fas fa-box-open": "\uf49e",
    "fas fa-boxes": "\uf468",
    "fas fa-braille": "\uf2a1",
    "fas fa-briefcase": "\uf0b1",
    "fas fa-briefcase-medical": "\uf469",
    "fas fa-bug": "\uf188",
    "fas fa-building": "\uf1ad",
    "fas fa-bullhorn": "\uf0a1",
    "fas fa-bullseye": "\uf140",
    "fas fa-burn": "\uf46a",
    "fas fa-bus": "\uf207",
    "fas fa-calculator": "\uf1ec",
    "fas fa-calendar": "\uf133",
    "fas fa-calendar-alt": "\uf073",
    "fas fa-calendar-check": "\uf274",
    "fas fa-calendar-minus": "\uf272",
    "fas fa-calendar-plus": "\uf271",
    "fas fa-calendar-times": "\uf273",
    "fas fa-camera": "\uf030",
    "fas fa-camera-retro": "\uf083",
    "fas fa-capsules": "\uf46b",
    "fas fa-car": "\uf1b9",
    "fas fa-caret-down": "\uf0d7",
    "fas fa-caret-left": "\uf0d9",
    "fas fa-caret-right": "\uf0da",
    "fas fa-caret-square-down": "\uf150",
    "fas fa-caret-square-left": "\uf191",
    "fas fa-caret-square-right": "\uf152",
    "fas fa-caret-square-up": "\uf151",
    "fas fa-caret-up": "\uf0d8",
    "fas fa-cart-arrow-down": "\uf218",
    "fas fa-cart-plus": "\uf217",
    "fas fa-certificate": "\uf0a3",
    "fas fa-chart-area": "\uf1fe",
    "fas fa-chart-bar": "\uf080",
    "fas fa-chart-line": "\uf201",
    "fas fa-chart-pie": "\uf200",
    "fas fa-check": "\uf00c",
    "fas fa-check-circle": "\uf058",
    "fas fa-check-square": "\uf14a",
    "fas fa-chess": "\uf439",
    "fas fa-chess-bishop": "\uf43a",
    "fas fa-chess-board": "\uf43c",
    "fas fa-chess-king": "\uf43f",
    "fas fa-chess-knight": "\uf441",
    "fas fa-chess-pawn": "\uf443",
    "fas fa-chess-queen": "\uf445",
    "fas fa-chess-rook": "\uf447",
    "fas fa-chevron-circle-down": "\uf13a",
    "fas fa-chevron-circle-left": "\uf137",
    "fas fa-chevron-circle-right": "\uf138",
    "fas fa-chevron-circle-up": "\uf139",
    "fas fa-chevron-down": "\uf078",
    "fas fa-chevron-left": "\uf053",
    "fas fa-chevron-right": "\uf054",
    "fas fa-chevron-up": "\uf077",
    "fas fa-child": "\uf1ae",
    "fas fa-circle": "\uf111",
    "fas fa-circle-notch": "\uf1ce",
    "fas fa-clipboard": "\uf328",
    "fas fa-clipboard-check": "\uf46c",
    "fas fa-clipboard-list": "\uf46d",
    "fas fa-clock": "\uf017",
    "fas fa-clone": "\uf24d",
    "fas fa-closed-captioning": "\uf20a",
    "fas fa-cloud": "\uf0c2",
    "fas fa-cloud-download-alt": "\uf381",
    "fas fa-cloud-upload-alt": "\uf382",
    "fas fa-code": "\uf121",
    "fas fa-code-branch": "\uf126",
    "fas fa-coffee": "\uf0f4",
    "fas fa-cog": "\uf013",
    "fas fa-cogs": "\uf085",
    "fas fa-columns": "\uf0db",
    "fas fa-comment": "\uf075",
    "fas fa-comment-alt": "\uf27a",
    "fas fa-comment-dots": "\uf4ad",
    "fas fa-comment-slash": "\uf4b3",
    "fas fa-comments": "\uf086",
    "fas fa-compass": "\uf14e",
    "fas fa-compress": "\uf066",
    "fas fa-copy": "\uf0c5",
    "fas fa-copyright": "\uf1f9",
    "fas fa-couch": "\uf4b8",
    "fas fa-credit-card": "\uf09d",
    "fas fa-crop": "\uf125",
    "fas fa-crosshairs": "\uf05b",
    "fas fa-cube": "\uf1b2",
    "fas fa-cubes": "\uf1b3",
    "fas fa-cut": "\uf0c4",
    "fas fa-database": "\uf1c0",
    "fas fa-deaf": "\uf2a4",
    "fas fa-desktop": "\uf108",
    "fas fa-diagnoses": "\uf470",
    "fas fa-dna": "\uf471",
    "fas fa-dollar-sign": "\uf155",
    "fas fa-dolly": "\uf472",
    "fas fa-dolly-flatbed": "\uf474",
    "fas fa-donate": "\uf4b9",
    "fas fa-dot-circle": "\uf192",
    "fas fa-dove": "\uf4ba",
    "fas fa-download": "\uf019",
    "fas fa-edit": "\uf044",
    "fas fa-eject": "\uf052",
    "fas fa-ellipsis-h": "\uf141",
    "fas fa-ellipsis-v": "\uf142",
    "fas fa-envelope": "\uf0e0",
    "fas fa-envelope-open": "\uf2b6",
    "fas fa-envelope-square": "\uf199",
    "fas fa-eraser": "\uf12d",
    "fas fa-euro-sign": "\uf153",
    "fas fa-exchange-alt": "\uf362",
    "fas fa-exclamation": "\uf12a",
    "fas fa-exclamation-circle": "\uf06a",
    "fas fa-exclamation-triangle": "\uf071",
    "fas fa-expand": "\uf065",
    "fas fa-expand-arrows-alt": "\uf31e",
    "fas fa-external-link-alt": "\uf35d",
    "fas fa-external-link-square-alt": "\uf360",
    "fas fa-eye": "\uf06e",
    "fas fa-eye-dropper": "\uf1fb",
    "fas fa-eye-slash": "\uf070",
    "fas fa-fast-backward": "\uf049",
    "fas fa-fast-forward": "\uf050",
    "fas fa-fax": "\uf1ac",
    "fas fa-female": "\uf182",
    "fas fa-fighter-jet": "\uf0fb",
    "fas fa-file": "\uf15b",
    "fas fa-file-alt": "\uf15c",
    "fas fa-file-archive": "\uf1c6",
    "fas fa-file-audio": "\uf1c7",
    "fas fa-file-code": "\uf1c9",
    "fas fa-file-excel": "\uf1c3",
    "fas fa-file-image": "\uf1c5",
    "fas fa-file-medical": "\uf477",
    "fas fa-file-medical-alt": "\uf478",
    "fas fa-file-pdf": "\uf1c1",
    "fas fa-file-powerpoint": "\uf1c4",
    "fas fa-file-video": "\uf1c8",
    "fas fa-file-word": "\uf1c2",
    "fas fa-film": "\uf008",
    "fas fa-filter": "\uf0b0",
    "fas fa-fire": "\uf06d",
    "fas fa-fire-extinguisher": "\uf134",
    "fas fa-first-aid": "\uf479",
    "fas fa-flag": "\uf024",
    "fas fa-flag-checkered": "\uf11e",
    "fas fa-flask": "\uf0c3",
    "fas fa-folder": "\uf07b",
    "fas fa-folder-open": "\uf07c",
    "fas fa-font": "\uf031",
    "fas fa-football-ball": "\uf44e",
    "fas fa-forward": "\uf04e",
    "fas fa-frown": "\uf119",
    "fas fa-futbol": "\uf1e3",
    "fas fa-gamepad": "\uf11b",
    "fas fa-gavel": "\uf0e3",
    "fas fa-gem": "\uf3a5",
    "fas fa-genderless": "\uf22d",
    "fas fa-gift": "\uf06b",
    "fas fa-glass-martini": "\uf000",
    "fas fa-globe": "\uf0ac",
    "fas fa-golf-ball": "\uf450",
    "fas fa-graduation-cap": "\uf19d",
    "fas fa-h-square": "\uf0fd",
    "fas fa-hand-holding": "\uf4bd",
    "fas fa-hand-holding-heart": "\uf4be",
    "fas fa-hand-holding-usd": "\uf4c0",
    "fas fa-hand-lizard": "\uf258",
    "fas fa-hand-paper": "\uf256",
    "fas fa-hand-peace": "\uf25b",
    "fas fa-hand-point-down": "\uf0a7",
    "fas fa-hand-point-left": "\uf0a5",
    "fas fa-hand-point-right": "\uf0a4",
    "fas fa-hand-point-up": "\uf0a6",
    "fas fa-hand-pointer": "\uf25a",
    "fas fa-hand-rock": "\uf255",
    "fas fa-hand-scissors": "\uf257",
    "fas fa-hand-spock": "\uf259",
    "fas fa-hands": "\uf4c2",
    "fas fa-hands-helping": "\uf4c4",
    "fas fa-handshake": "\uf2b5",
    "fas fa-hashtag": "\uf292",
    "fas fa-hdd": "\uf0a0",
    "fas fa-heading": "\uf1dc",
    "fas fa-headphones": "\uf025",
    "fas fa-heart": "\uf004",
    "fas fa-heartbeat": "\uf21e",
    "fas fa-history": "\uf1da",
    "fas fa-hockey-puck": "\uf453",
    "fas fa-home": "\uf015",
    "fas fa-hospital": "\uf0f8",
    "fas fa-hospital-alt": "\uf47d",
    "fas fa-hospital-symbol": "\uf47e",
    "fas fa-hourglass": "\uf254",
    "fas fa-hourglass-end": "\uf253",
    "fas fa-hourglass-half": "\uf252",
    "fas fa-hourglass-start": "\uf251",
    "fas fa-i-cursor": "\uf246",
    "fas fa-id-badge": "\uf2c1",
    "fas fa-id-card": "\uf2c2",
    "fas fa-id-card-alt": "\uf47f",
    "fas fa-image": "\uf03e",
    "fas fa-images": "\uf302",
    "fas fa-inbox": "\uf01c",
    "fas fa-indent": "\uf03c",
    "fas fa-industry": "\uf275",
    "fas fa-info": "\uf129",
    "fas fa-info-circle": "\uf05a",
    "fas fa-italic": "\uf033",
    "fas fa-key": "\uf084",
    "fas fa-keyboard": "\uf11c",
    "fas fa-language": "\uf1ab",
    "fas fa-laptop": "\uf109",
    "fas fa-leaf": "\uf06c",
    "fas fa-lemon": "\uf094",
    "fas fa-level-down-alt": "\uf3be",
    "fas fa-level-up-alt": "\uf3bf",
    "fas fa-life-ring": "\uf1cd",
    "fas fa-lightbulb": "\uf0eb",
    "fas fa-link": "\uf0c1",
    "fas fa-lira-sign": "\uf195",
    "fas fa-list": "\uf03a",
    "fas fa-list-alt": "\uf022",
    "fas fa-list-ol": "\uf0cb",
    "fas fa-list-ul": "\uf0ca",
    "fas fa-location-arrow": "\uf124",
    "fas fa-lock": "\uf023",
    "fas fa-lock-open": "\uf3c1",
    "fas fa-long-arrow-alt-down": "\uf309",
    "fas fa-long-arrow-alt-left": "\uf30a",
    "fas fa-long-arrow-alt-right": "\uf30b",
    "fas fa-long-arrow-alt-up": "\uf30c",
    "fas fa-low-vision": "\uf2a8",
    "fas fa-magic": "\uf0d0",
    "fas fa-magnet": "\uf076",
    "fas fa-male": "\uf183",
    "fas fa-map": "\uf279",
    "fas fa-map-marker": "\uf041",
    "fas fa-map-marker-alt": "\uf3c5",
    "fas fa-map-pin": "\uf276",
    "fas fa-map-signs": "\uf277",
    "fas fa-mars": "\uf222",
    "fas fa-mars-double": "\uf227",
    "fas fa-mars-stroke": "\uf229",
    "fas fa-mars-stroke-h": "\uf22b",
    "fas fa-mars-stroke-v": "\uf22a",
    "fas fa-medkit": "\uf0fa",
    "fas fa-meh": "\uf11a",
    "fas fa-mercury": "\uf223",
    "fas fa-microchip": "\uf2db",
    "fas fa-microphone": "\uf130",
    "fas fa-microphone-slash": "\uf131",
    "fas fa-minus": "\uf068",
    "fas fa-minus-circle": "\uf056",
    "fas fa-minus-square": "\uf146",
    "fas fa-mobile": "\uf10b",
    "fas fa-mobile-alt": "\uf3cd",
    "fas fa-money-bill-alt": "\uf3d1",
    "fas fa-moon": "\uf186",
    "fas fa-motorcycle": "\uf21c",
    "fas fa-mouse-pointer": "\uf245",
    "fas fa-music": "\uf001",
    "fas fa-neuter": "\uf22c",
    "fas fa-newspaper": "\uf1ea",
    "fas fa-notes-medical": "\uf481",
    "fas fa-object-group": "\uf247",
    "fas fa-object-ungroup": "\uf248",
    "fas fa-outdent": "\uf03b",
    "fas fa-paint-brush": "\uf1fc",
    "fas fa-pallet": "\uf482",
    "fas fa-paper-plane": "\uf1d8",
    "fas fa-paperclip": "\uf0c6",
    "fas fa-parachute-box": "\uf4cd",
    "fas fa-paragraph": "\uf1dd",
    "fas fa-paste": "\uf0ea",
    "fas fa-pause": "\uf04c",
    "fas fa-pause-circle": "\uf28b",
    "fas fa-paw": "\uf1b0",
    "fas fa-pen-square": "\uf14b",
    "fas fa-pencil-alt": "\uf303",
    "fas fa-people-carry": "\uf4ce",
    "fas fa-percent": "\uf295",
    "fas fa-phone": "\uf095",
    "fas fa-phone-slash": "\uf3dd",
    "fas fa-phone-square": "\uf098",
    "fas fa-phone-volume": "\uf2a0",
    "fas fa-piggy-bank": "\uf4d3",
    "fas fa-pills": "\uf484",
    "fas fa-plane": "\uf072",
    "fas fa-play": "\uf04b",
    "fas fa-play-circle": "\uf144",
    "fas fa-plug": "\uf1e6",
    "fas fa-plus": "\uf067",
    "fas fa-plus-circle": "\uf055",
    "fas fa-plus-square": "\uf0fe",
    "fas fa-podcast": "\uf2ce",
    "fas fa-poo": "\uf2fe",
    "fas fa-pound-sign": "\uf154",
    "fas fa-power-off": "\uf011",
    "fas fa-prescription-bottle": "\uf485",
    "fas fa-prescription-bottle-alt": "\uf486",
    "fas fa-print": "\uf02f",
    "fas fa-procedures": "\uf487",
    "fas fa-puzzle-piece": "\uf12e",
    "fas fa-qrcode": "\uf029",
    "fas fa-question": "\uf128",
    "fas fa-question-circle": "\uf059",
    "fas fa-quidditch": "\uf458",
    "fas fa-quote-left": "\uf10d",
    "fas fa-quote-right": "\uf10e",
    "fas fa-random": "\uf074",
    "fas fa-recycle": "\uf1b8",
    "fas fa-redo": "\uf01e",
    "fas fa-redo-alt": "\uf2f9",
    "fas fa-registered": "\uf25d",
    "fas fa-reply": "\uf3e5",
    "fas fa-reply-all": "\uf122",
    "fas fa-retweet": "\uf079",
    "fas fa-ribbon": "\uf4d6",
    "fas fa-road": "\uf018",
    "fas fa-rocket": "\uf135",
    "fas fa-rss": "\uf09e",
    "fas fa-rss-square": "\uf143",
    "fas fa-ruble-sign": "\uf158",
    "fas fa-rupee-sign": "\uf156",
    "fas fa-save": "\uf0c7",
    "fas fa-search": "\uf002",
    "fas fa-search-minus": "\uf010",
    "fas fa-search-plus": "\uf00e",
    "fas fa-seedling": "\uf4d8",
    "fas fa-server": "\uf233",
    "fas fa-share": "\uf064",
    "fas fa-share-alt": "\uf1e0",
    "fas fa-share-alt-square": "\uf1e1",
    "fas fa-share-square": "\uf14d",
    "fas fa-shekel-sign": "\uf20b",
    "fas fa-shield-alt": "\uf3ed",
    "fas fa-ship": "\uf21a",
    "fas fa-shipping-fast": "\uf48b",
    "fas fa-shopping-bag": "\uf290",
    "fas fa-shopping-basket": "\uf291",
    "fas fa-shopping-cart": "\uf07a",
    "fas fa-shower": "\uf2cc",
    "fas fa-sign": "\uf4d9",
    "fas fa-sign-in-alt": "\uf2f6",
    "fas fa-sign-language": "\uf2a7",
    "fas fa-sign-out-alt": "\uf2f5",
    "fas fa-signal": "\uf012",
    "fas fa-sitemap": "\uf0e8",
    "fas fa-sliders-h": "\uf1de",
    "fas fa-smile": "\uf118",
    "fas fa-smoking": "\uf48d",
    "fas fa-snowflake": "\uf2dc",
    "fas fa-sort": "\uf0dc",
    "fas fa-sort-alpha-down": "\uf15d",
    "fas fa-sort-alpha-up": "\uf15e",
    "fas fa-sort-amount-down": "\uf160",
    "fas fa-sort-amount-up": "\uf161",
    "fas fa-sort-down": "\uf0dd",
    "fas fa-sort-numeric-down": "\uf162",
    "fas fa-sort-numeric-up": "\uf163",
    "fas fa-sort-up": "\uf0de",
    "fas fa-space-shuttle": "\uf197",
    "fas fa-spinner": "\uf110",
    "fas fa-square": "\uf0c8",
    "fas fa-square-full": "\uf45c",
    "fas fa-star": "\uf005",
    "fas fa-star-half": "\uf089",
    "fas fa-step-backward": "\uf048",
    "fas fa-step-forward": "\uf051",
    "fas fa-stethoscope": "\uf0f1",
    "fas fa-sticky-note": "\uf249",
    "fas fa-stop": "\uf04d",
    "fas fa-stop-circle": "\uf28d",
    "fas fa-stopwatch": "\uf2f2",
    "fas fa-street-view": "\uf21d",
    "fas fa-strikethrough": "\uf0cc",
    "fas fa-subscript": "\uf12c",
    "fas fa-subway": "\uf239",
    "fas fa-suitcase": "\uf0f2",
    "fas fa-sun": "\uf185",
    "fas fa-superscript": "\uf12b",
    "fas fa-sync": "\uf021",
    "fas fa-sync-alt": "\uf2f1",
    "fas fa-syringe": "\uf48e",
    "fas fa-table": "\uf0ce",
    "fas fa-table-tennis": "\uf45d",
    "fas fa-tablet": "\uf10a",
    "fas fa-tablet-alt": "\uf3fa",
    "fas fa-tablets": "\uf490",
    "fas fa-tachometer-alt": "\uf3fd",
    "fas fa-tag": "\uf02b",
    "fas fa-tags": "\uf02c",
    "fas fa-tape": "\uf4db",
    "fas fa-tasks": "\uf0ae",
    "fas fa-taxi": "\uf1ba",
    "fas fa-terminal": "\uf120",
    "fas fa-text-height": "\uf034",
    "fas fa-text-width": "\uf035",
    "fas fa-th": "\uf00a",
    "fas fa-th-large": "\uf009",
    "fas fa-th-list": "\uf00b",
    "fas fa-thermometer": "\uf491",
    "fas fa-thermometer-empty": "\uf2cb",
    "fas fa-thermometer-full": "\uf2c7",
    "fas fa-thermometer-half": "\uf2c9",
    "fas fa-thermometer-quarter": "\uf2ca",
    "fas fa-thermometer-three-quarters": "\uf2c8",
    "fas fa-thumbs-down": "\uf165",
    "fas fa-thumbs-up": "\uf164",
    "fas fa-thumbtack": "\uf08d",
    "fas fa-ticket-alt": "\uf3ff",
    "fas fa-times": "\uf00d",
    "fas fa-times-circle": "\uf057",
    "fas fa-tint": "\uf043",
    "fas fa-toggle-off": "\uf204",
    "fas fa-toggle-on": "\uf205",
    "fas fa-trademark": "\uf25c",
    "fas fa-train": "\uf238",
    "fas fa-transgender": "\uf224",
    "fas fa-transgender-alt": "\uf225",
    "fas fa-trash": "\uf1f8",
    "fas fa-trash-alt": "\uf2ed",
    "fas fa-tree": "\uf1bb",
    "fas fa-trophy": "\uf091",
    "fas fa-truck": "\uf0d1",
    "fas fa-truck-loading": "\uf4de",
    "fas fa-truck-moving": "\uf4df",
    "fas fa-tty": "\uf1e4",
    "fas fa-tv": "\uf26c",
    "fas fa-umbrella": "\uf0e9",
    "fas fa-underline": "\uf0cd",
    "fas fa-undo": "\uf0e2",
    "fas fa-undo-alt": "\uf2ea",
    "fas fa-universal-access": "\uf29a",
    "fas fa-university": "\uf19c",
    "fas fa-unlink": "\uf127",
    "fas fa-unlock": "\uf09c",
    "fas fa-unlock-alt": "\uf13e",
    "fas fa-upload": "\uf093",
    "fas fa-user": "\uf007",
    "fas fa-user-circle": "\uf2bd",
    "fas fa-user-md": "\uf0f0",
    "fas fa-user-plus": "\uf234",
    "fas fa-user-secret": "\uf21b",
    "fas fa-user-times": "\uf235",
    "fas fa-users": "\uf0c0",
    "fas fa-utensil-spoon": "\uf2e5",
    "fas fa-utensils": "\uf2e7",
    "fas fa-venus": "\uf221",
    "fas fa-venus-double": "\uf226",
    "fas fa-venus-mars": "\uf228",
    "fas fa-vial": "\uf492",
    "fas fa-vials": "\uf493",
    "fas fa-video": "\uf03d",
    "fas fa-video-slash": "\uf4e2",
    "fas fa-volleyball-ball": "\uf45f",
    "fas fa-volume-down": "\uf027",
    "fas fa-volume-off": "\uf026",
    "fas fa-volume-up": "\uf028",
    "fas fa-warehouse": "\uf494",
    "fas fa-weight": "\uf496",
    "fas fa-wheelchair": "\uf193",
    "fas fa-wifi": "\uf1eb",
    "fas fa-window-close": "\uf410",
    "fas fa-window-maximize": "\uf2d0",
    "fas fa-window-minimize": "\uf2d1",
    "fas fa-window-restore": "\uf2d2",
    "fas fa-wine-glass": "\uf4e3",
    "fas fa-won-sign": "\uf159",
    "fas fa-wrench": "\uf0ad",
    "fas fa-x-ray": "\uf497",
    "fas fa-yen-sign": "\uf157",
    "fab fa-500px": "\uf26e",
    "fab fa-accessible-icon": "\uf368",
    "fab fa-accusoft": "\uf369",
    "fab fa-adn": "\uf170",
    "fab fa-adversal": "\uf36a",
    "fab fa-affiliatetheme": "\uf36b",
    "fab fa-algolia": "\uf36c",
    "fab fa-amazon": "\uf270",
    "fab fa-amazon-pay": "\uf42c",
    "fab fa-amilia": "\uf36d",
    "fab fa-android": "\uf17b",
    "fab fa-angellist": "\uf209",
    "fab fa-angrycreative": "\uf36e",
    "fab fa-angular": "\uf420",
    "fab fa-app-store": "\uf36f",
    "fab fa-app-store-ios": "\uf370",
    "fab fa-apper": "\uf371",
    "fab fa-apple": "\uf179",
    "fab fa-apple-pay": "\uf415",
    "fab fa-asymmetrik": "\uf372",
    "fab fa-audible": "\uf373",
    "fab fa-autoprefixer": "\uf41c",
    "fab fa-avianex": "\uf374",
    "fab fa-aviato": "\uf421",
    "fab fa-aws": "\uf375",
    "fab fa-bandcamp": "\uf2d5",
    "fab fa-behance": "\uf1b4",
    "fab fa-behance-square": "\uf1b5",
    "fab fa-bimobject": "\uf378",
    "fab fa-bitbucket": "\uf171",
    "fab fa-bitcoin": "\uf379",
    "fab fa-bity": "\uf37a",
    "fab fa-black-tie": "\uf27e",
    "fab fa-blackberry": "\uf37b",
    "fab fa-blogger": "\uf37c",
    "fab fa-blogger-b": "\uf37d",
    "fab fa-bluetooth": "\uf293",
    "fab fa-bluetooth-b": "\uf294",
    "fab fa-btc": "\uf15a",
    "fab fa-buromobelexperte": "\uf37f",
    "fab fa-buysellads": "\uf20d",
    "fab fa-cc-amazon-pay": "\uf42d",
    "fab fa-cc-amex": "\uf1f3",
    "fab fa-cc-apple-pay": "\uf416",
    "fab fa-cc-diners-club": "\uf24c",
    "fab fa-cc-discover": "\uf1f2",
    "fab fa-cc-jcb": "\uf24b",
    "fab fa-cc-mastercard": "\uf1f1",
    "fab fa-cc-paypal": "\uf1f4",
    "fab fa-cc-stripe": "\uf1f5",
    "fab fa-cc-visa": "\uf1f0",
    "fab fa-centercode": "\uf380",
    "fab fa-chrome": "\uf268",
    "fab fa-cloudscale": "\uf383",
    "fab fa-cloudsmith": "\uf384",
    "fab fa-cloudversify": "\uf385",
    "fab fa-codepen": "\uf1cb",
    "fab fa-codiepie": "\uf284",
    "fab fa-connectdevelop": "\uf20e",
    "fab fa-contao": "\uf26d",
    "fab fa-cpanel": "\uf388",
    "fab fa-creative-commons": "\uf25e",
    "fab fa-css3": "\uf13c",
    "fab fa-css3-alt": "\uf38b",
    "fab fa-cuttlefish": "\uf38c",
    "fab fa-d-and-d": "\uf38d",
    "fab fa-dashcube": "\uf210",
    "fab fa-delicious": "\uf1a5",
    "fab fa-deploydog": "\uf38e",
    "fab fa-deskpro": "\uf38f",
    "fab fa-deviantart": "\uf1bd",
    "fab fa-digg": "\uf1a6",
    "fab fa-digital-ocean": "\uf391",
    "fab fa-discord": "\uf392",
    "fab fa-discourse": "\uf393",
    "fab fa-dochub": "\uf394",
    "fab fa-docker": "\uf395",
    "fab fa-draft2digital": "\uf396",
    "fab fa-dribbble": "\uf17d",
    "fab fa-dribbble-square": "\uf397",
    "fab fa-dropbox": "\uf16b",
    "fab fa-drupal": "\uf1a9",
    "fab fa-dyalog": "\uf399",
    "fab fa-earlybirds": "\uf39a",
    "fab fa-edge": "\uf282",
    "fab fa-elementor": "\uf430",
    "fab fa-ember": "\uf423",
    "fab fa-empire": "\uf1d1",
    "fab fa-envira": "\uf299",
    "fab fa-erlang": "\uf39d",
    "fab fa-ethereum": "\uf42e",
    "fab fa-etsy": "\uf2d7",
    "fab fa-expeditedssl": "\uf23e",
    "fab fa-facebook": "\uf09a",
    "fab fa-facebook-f": "\uf39e",
    "fab fa-facebook-messenger": "\uf39f",
    "fab fa-facebook-square": "\uf082",
    "fab fa-firefox": "\uf269",
    "fab fa-first-order": "\uf2b0",
    "fab fa-firstdraft": "\uf3a1",
    "fab fa-flickr": "\uf16e",
    "fab fa-flipboard": "\uf44d",
    "fab fa-fly": "\uf417",
    "fab fa-font-awesome": "\uf2b4",
    "fab fa-font-awesome-alt": "\uf35c",
    "fab fa-font-awesome-flag": "\uf425",
    "fab fa-fonticons": "\uf280",
    "fab fa-fonticons-fi": "\uf3a2",
    "fab fa-fort-awesome": "\uf286",
    "fab fa-fort-awesome-alt": "\uf3a3",
    "fab fa-forumbee": "\uf211",
    "fab fa-foursquare": "\uf180",
    "fab fa-free-code-camp": "\uf2c5",
    "fab fa-freebsd": "\uf3a4",
    "fab fa-get-pocket": "\uf265",
    "fab fa-gg": "\uf260",
    "fab fa-gg-circle": "\uf261",
    "fab fa-git": "\uf1d3",
    "fab fa-git-square": "\uf1d2",
    "fab fa-github": "\uf09b",
    "fab fa-github-alt": "\uf113",
    "fab fa-github-square": "\uf092",
    "fab fa-gitkraken": "\uf3a6",
    "fab fa-gitlab": "\uf296",
    "fab fa-gitter": "\uf426",
    "fab fa-glide": "\uf2a5",
    "fab fa-glide-g": "\uf2a6",
    "fab fa-gofore": "\uf3a7",
    "fab fa-goodreads": "\uf3a8",
    "fab fa-goodreads-g": "\uf3a9",
    "fab fa-google": "\uf1a0",
    "fab fa-google-drive": "\uf3aa",
    "fab fa-google-play": "\uf3ab",
    "fab fa-google-plus": "\uf2b3",
    "fab fa-google-plus-g": "\uf0d5",
    "fab fa-google-plus-square": "\uf0d4",
    "fab fa-google-wallet": "\uf1ee",
    "fab fa-gratipay": "\uf184",
    "fab fa-grav": "\uf2d6",
    "fab fa-gripfire": "\uf3ac",
    "fab fa-grunt": "\uf3ad",
    "fab fa-gulp": "\uf3ae",
    "fab fa-hacker-news": "\uf1d4",
    "fab fa-hacker-news-square": "\uf3af",
    "fab fa-hips": "\uf452",
    "fab fa-hire-a-helper": "\uf3b0",
    "fab fa-hooli": "\uf427",
    "fab fa-hotjar": "\uf3b1",
    "fab fa-houzz": "\uf27c",
    "fab fa-html5": "\uf13b",
    "fab fa-hubspot": "\uf3b2",
    "fab fa-imdb": "\uf2d8",
    "fab fa-instagram": "\uf16d",
    "fab fa-internet-explorer": "\uf26b",
    "fab fa-ioxhost": "\uf208",
    "fab fa-itunes": "\uf3b4",
    "fab fa-itunes-note": "\uf3b5",
    "fab fa-java": "\uf4e4",
    "fab fa-jenkins": "\uf3b6",
    "fab fa-joget": "\uf3b7",
    "fab fa-joomla": "\uf1aa",
    "fab fa-js": "\uf3b8",
    "fab fa-js-square": "\uf3b9",
    "fab fa-jsfiddle": "\uf1cc",
    "fab fa-keycdn": "\uf3ba",
    "fab fa-kickstarter": "\uf3bb",
    "fab fa-kickstarter-k": "\uf3bc",
    "fab fa-korvue": "\uf42f",
    "fab fa-laravel": "\uf3bd",
    "fab fa-lastfm": "\uf202",
    "fab fa-lastfm-square": "\uf203",
    "fab fa-leanpub": "\uf212",
    "fab fa-less": "\uf41d",
    "fab fa-line": "\uf3c0",
    "fab fa-linkedin": "\uf08c",
    "fab fa-linkedin-in": "\uf0e1",
    "fab fa-linode": "\uf2b8",
    "fab fa-linux": "\uf17c",
    "fab fa-lyft": "\uf3c3",
    "fab fa-magento": "\uf3c4",
    "fab fa-maxcdn": "\uf136",
    "fab fa-medapps": "\uf3c6",
    "fab fa-medium": "\uf23a",
    "fab fa-medium-m": "\uf3c7",
    "fab fa-medrt": "\uf3c8",
    "fab fa-meetup": "\uf2e0",
    "fab fa-microsoft": "\uf3ca",
    "fab fa-mix": "\uf3cb",
    "fab fa-mixcloud": "\uf289",
    "fab fa-mizuni": "\uf3cc",
    "fab fa-modx": "\uf285",
    "fab fa-monero": "\uf3d0",
    "fab fa-napster": "\uf3d2",
    "fab fa-nintendo-switch": "\uf418",
    "fab fa-node": "\uf419",
    "fab fa-node-js": "\uf3d3",
    "fab fa-npm": "\uf3d4",
    "fab fa-ns8": "\uf3d5",
    "fab fa-nutritionix": "\uf3d6",
    "fab fa-odnoklassniki": "\uf263",
    "fab fa-odnoklassniki-square": "\uf264",
    "fab fa-opencart": "\uf23d",
    "fab fa-openid": "\uf19b",
    "fab fa-opera": "\uf26a",
    "fab fa-optin-monster": "\uf23c",
    "fab fa-osi": "\uf41a",
    "fab fa-page4": "\uf3d7",
    "fab fa-pagelines": "\uf18c",
    "fab fa-palfed": "\uf3d8",
    "fab fa-patreon": "\uf3d9",
    "fab fa-paypal": "\uf1ed",
    "fab fa-periscope": "\uf3da",
    "fab fa-phabricator": "\uf3db",
    "fab fa-phoenix-framework": "\uf3dc",
    "fab fa-php": "\uf457",
    "fab fa-pied-piper": "\uf2ae",
    "fab fa-pied-piper-alt": "\uf1a8",
    "fab fa-pied-piper-hat": "\uf4e5",
    "fab fa-pied-piper-pp": "\uf1a7",
    "fab fa-pinterest": "\uf0d2",
    "fab fa-pinterest-p": "\uf231",
    "fab fa-pinterest-square": "\uf0d3",
    "fab fa-playstation": "\uf3df",
    "fab fa-product-hunt": "\uf288",
    "fab fa-pushed": "\uf3e1",
    "fab fa-python": "\uf3e2",
    "fab fa-qq": "\uf1d6",
    "fab fa-quinscape": "\uf459",
    "fab fa-quora": "\uf2c4",
    "fab fa-ravelry": "\uf2d9",
    "fab fa-react": "\uf41b",
    "fab fa-readme": "\uf4d5",
    "fab fa-rebel": "\uf1d0",
    "fab fa-red-river": "\uf3e3",
    "fab fa-reddit": "\uf1a1",
    "fab fa-reddit-alien": "\uf281",
    "fab fa-reddit-square": "\uf1a2",
    "fab fa-rendact": "\uf3e4",
    "fab fa-renren": "\uf18b",
    "fab fa-replyd": "\uf3e6",
    "fab fa-resolving": "\uf3e7",
    "fab fa-rocketchat": "\uf3e8",
    "fab fa-rockrms": "\uf3e9",
    "fab fa-safari": "\uf267",
    "fab fa-sass": "\uf41e",
    "fab fa-schlix": "\uf3ea",
    "fab fa-scribd": "\uf28a",
    "fab fa-searchengin": "\uf3eb",
    "fab fa-sellcast": "\uf2da",
    "fab fa-sellsy": "\uf213",
    "fab fa-servicestack": "\uf3ec",
    "fab fa-shirtsinbulk": "\uf214",
    "fab fa-simplybuilt": "\uf215",
    "fab fa-sistrix": "\uf3ee",
    "fab fa-skyatlas": "\uf216",
    "fab fa-skype": "\uf17e",
    "fab fa-slack": "\uf198",
    "fab fa-slack-hash": "\uf3ef",
    "fab fa-slideshare": "\uf1e7",
    "fab fa-snapchat": "\uf2ab",
    "fab fa-snapchat-ghost": "\uf2ac",
    "fab fa-snapchat-square": "\uf2ad",
    "fab fa-soundcloud": "\uf1be",
    "fab fa-speakap": "\uf3f3",
    "fab fa-spotify": "\uf1bc",
    "fab fa-stack-exchange": "\uf18d",
    "fab fa-stack-overflow": "\uf16c",
    "fab fa-staylinked": "\uf3f5",
    "fab fa-steam": "\uf1b6",
    "fab fa-steam-square": "\uf1b7",
    "fab fa-steam-symbol": "\uf3f6",
    "fab fa-sticker-mule": "\uf3f7",
    "fab fa-strava": "\uf428",
    "fab fa-stripe": "\uf429",
    "fab fa-stripe-s": "\uf42a",
    "fab fa-studiovinari": "\uf3f8",
    "fab fa-stumbleupon": "\uf1a4",
    "fab fa-stumbleupon-circle": "\uf1a3",
    "fab fa-superpowers": "\uf2dd",
    "fab fa-supple": "\uf3f9",
    "fab fa-telegram": "\uf2c6",
    "fab fa-telegram-plane": "\uf3fe",
    "fab fa-tencent-weibo": "\uf1d5",
    "fab fa-themeisle": "\uf2b2",
    "fab fa-trello": "\uf181",
    "fab fa-tripadvisor": "\uf262",
    "fab fa-tumblr": "\uf173",
    "fab fa-tumblr-square": "\uf174",
    "fab fa-twitch": "\uf1e8",
    "fab fa-twitter": "\uf099",
    "fab fa-twitter-square": "\uf081",
    "fab fa-typo3": "\uf42b",
    "fab fa-uber": "\uf402",
    "fab fa-uikit": "\uf403",
    "fab fa-uniregistry": "\uf404",
    "fab fa-untappd": "\uf405",
    "fab fa-usb": "\uf287",
    "fab fa-ussunnah": "\uf407",
    "fab fa-vaadin": "\uf408",
    "fab fa-viacoin": "\uf237",
    "fab fa-viadeo": "\uf2a9",
    "fab fa-viadeo-square": "\uf2aa",
    "fab fa-viber": "\uf409",
    "fab fa-vimeo": "\uf40a",
    "fab fa-vimeo-square": "\uf194",
    "fab fa-vimeo-v": "\uf27d",
    "fab fa-vine": "\uf1ca",
    "fab fa-vk": "\uf189",
    "fab fa-vnv": "\uf40b",
    "fab fa-vuejs": "\uf41f",
    "fab fa-weibo": "\uf18a",
    "fab fa-weixin": "\uf1d7",
    "fab fa-whatsapp": "\uf232",
    "fab fa-whatsapp-square": "\uf40c",
    "fab fa-whmcs": "\uf40d",
    "fab fa-wikipedia-w": "\uf266",
    "fab fa-windows": "\uf17a",
    "fab fa-wordpress": "\uf19a",
    "fab fa-wordpress-simple": "\uf411",
    "fab fa-wpbeginner": "\uf297",
    "fab fa-wpexplorer": "\uf2de",
    "fab fa-wpforms": "\uf298",
    "fab fa-xbox": "\uf412",
    "fab fa-xing": "\uf168",
    "fab fa-xing-square": "\uf169",
    "fab fa-y-combinator": "\uf23b",
    "fab fa-yahoo": "\uf19e",
    "fab fa-yandex": "\uf413",
    "fab fa-yandex-international": "\uf414",
    "fab fa-yelp": "\uf1e9",
    "fab fa-yoast": "\uf2b1",
    "fab fa-youtube": "\uf167",
    "fab fa-youtube-square": "\uf431"
  };

  return FaLookup;

}).call(undefined);

var FaLookup$1 = FaLookup;

var Vis$1;

Vis$1 = class Vis {
  static translate(x0, y0) {
    Util$1.checkTypes('number', {
      x0: x0,
      y0: y0
    });
    return ` translate( ${x0}, ${y0} )`;
  }

  static scale(sx, sy) {
    Util$1.checkTypes('number', {
      sx: sx,
      sy: sy
    });
    return ` scale( ${sx}, ${sx} )`;
  }

  static rotate(a, x, y) {
    Util$1.checkTypes('number', {
      a: a,
      x: x,
      y: y
    });
    return ` rotate(${a} ${x} ${y} )`;
  }

  static rad(deg) {
    return deg * Math.PI / 180;
  }

  static deg(rad) {
    return rad * 180 / Math.PI;
  }

  static sin(deg) {
    return Math.sin(Vis.rad(deg));
  }

  static cos(deg) {
    return Math.cos(Vis.rad(deg));
  }

  static rot(deg, ang) {
    var a;
    a = deg + ang;
    if (a < 0) {
      a = a + 360;
    }
    return a;
  }

  static toRadian(h, hueIsRygb = false) {
    var hue, radian;
    hue = hueIsRygb ? Vis.toHueRygb(h) : h;
    radian = 2 * Math.PI * (90 - hue) / 360; // Correction for MathBox polar coordinate system
    if (radian < 0) {
      radian = 2 * Math.PI + radian;
    }
    return radian;
  }

  static svgDeg(deg) {
    return 360 - deg;
  }

  static svgRad(rad) {
    return 2 * Math.PI - rad;
  }

  static radSvg(deg) {
    return Vis.rad(360 - deg);
  }

  static degSvg(rad) {
    return Vis.deg(2 * Math.PI - rad);
  }

  static sinSvg(deg) {
    return Math.sin(Vis.radSvg(deg));
  }

  static cosSvg(deg) {
    return Math.cos(Vis.radSvg(deg));
  }

  static hexCss(hex) {
    return `#${hex.toString(16) // For orthogonality
}`;
  }

  static rgbCss(rgb) {
    return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
  }

  static hslCss(hsl) {
    return `hsl(${hsl.h},${hsl.s * 100}%,${hsl.l * 100}%)`;
  }

  static cssHex(str) {
    return parseInt(str.substr(1), 16);
  }

  static rndRgb(rgb) {
    return {
      r: Math.round(rgb.r),
      g: Math.round(rgb.g),
      b: Math.round(rgb.b)
    };
  }

  static hexRgb(hex) {
    return Vis.rndRgb({
      r: (hex & 0xFF0000) >> 16,
      g: (hex & 0x00FF00) >> 8,
      b: hex & 0x0000FF
    });
  }

  static rgbHex(rgb) {
    return rgb.r * 4096 + rgb.g * 256 + rgb.b;
  }

  static interpolateHexRgb(hex1, r1, hex2, r2) {
    return Vis.interpolateRgb(Vis.hexRgb(hex1), r1, Vis.hexRgb(hex2), r2);
  }

  static interpolateRgb(rgb1, r1, rgb2, r2) {
    return {
      r: rgb1.r * r1 + rgb2.r * r2,
      g: rgb1.g * r1 + rgb2.g * r2,
      b: rgb1.b * r1 + rgb2.b * r2
    };
  }

  static toRgbHsvStr(hsv) {
    var a, b, g, i, j, r, rgba, str;
    rgba = Vis.toRgbHsvSigmoidal(hsv[0], hsv[1], hsv[2] * 255, true);
    for (i = j = 0; j < 3; i = ++j) {
      rgba[i] = Math.round(rgba[i]);
    }
    [r, g, b, a] = rgba;
    str = `rgba(${r},${g},${b},${a})`;
    //console.log( "Vis.toRgbHsvStr()", {h:hsv[0],s:hsv[1],v:hsv[2]}, str )
    return str;
  }

  static toRgbHsv(H, C, V, toRygb = true) {
    return Vis.toRgbHsvSigmoidal(H, C, V, toRygb);
  }

  static toRgbHsvSigmoidal(H, C, V, toRygb = true) {
    var b, c, d, f, g, h, i, r, v, x, y, z;
    h = toRygb ? Vis.toHueRgb(H) : H;
    d = C * 0.01;
    c = Vis.sigmoidal(d, 2, 0.25);
    v = V * 0.01;
    i = Math.floor(h / 60);
    f = h / 60 - i;
    x = 1 - c;
    y = 1 - f * c;
    z = 1 - (1 - f) * c;
    [r, g, b] = (function() {
      switch (i % 6) {
        case 0:
          return [1, z, x, 1];
        case 1:
          return [y, 1, x, 1];
        case 2:
          return [x, 1, z, 1];
        case 3:
          return [x, y, 1, 1];
        case 4:
          return [z, x, 1, 1];
        case 5:
          return [1, x, y, 1];
      }
    })();
    return [r * v, g * v, b * v, 1];
  }

  static hsvToRgb(hsv) {
    var f, i, p, q, rgb, t, v;
    i = Math.floor(hsv.h / 60);
    f = hsv.h / 60 - i;
    p = hsv.v * (1 - hsv.s);
    q = hsv.v * (1 - f * hsv.s);
    t = hsv.v * (1 - (1 - f) * hsv.s);
    v = hsv.v;
    rgb = (function() {
      switch (i % 6) {
        case 0:
          return {
            r: v,
            g: t,
            b: p
          };
        case 1:
          return {
            r: q,
            g: v,
            b: p
          };
        case 2:
          return {
            r: p,
            g: v,
            b: t
          };
        case 3:
          return {
            r: p,
            g: q,
            b: v
          };
        case 4:
          return {
            r: t,
            g: p,
            b: v
          };
        case 5:
          return {
            r: v,
            g: p,
            b: q
          };
        default:
          console.error('Vis.hsvToRgb()');
          return {
            r: v,
            g: t,
            b: p // Should never happend
          };
      }
    })();
    return Vis.roundRgb(rgb, 255);
  }

  static roundRgb(rgb, f = 1.0) {
    return {
      r: Math.round(rgb.r * f),
      g: Math.round(rgb.g * f),
      b: Math.round(rgb.b * f)
    };
  }

  static sigmoidal(x, k, x0 = 0.5, L = 1) {
    return L / (1 + Math.exp(-k * (x - x0)));
  }

  // ransform RyGB to RGB hueT
  static toHueRgb(hue) {
    var hRgb;
    hRgb = 0;
    if (0 <= hue && hue < 90) {
      hRgb = hue * 60 / 90;
    } else if (90 <= hue && hue < 180) {
      hRgb = 60 + (hue - 90) * 60 / 90;
    } else if (180 <= hue && hue < 270) {
      hRgb = 120 + (hue - 180) * 120 / 90;
    } else if (270 <= hue && hue < 360) {
      hRgb = 240 + (hue - 270) * 120 / 90;
    }
    return hRgb;
  }

  static toRgba(study) {
    var hsv;
    hsv = study.hsv != null ? study.hsv : [90, 90, 90];
    return Vis.toRgbHsv(hsv[0], hsv[1], hsv[2]);
  }

  static toRgbSphere(hue, phi, rad) {
    return Vis.toRgbHsv(Vis.rot(hue, 90), 100 * Vis.sin(phi), 100 * rad);
  }

  // Key algorithm from HCI for converting RGB to HCS  h 360 c 100 s 100
  static toHcsRgb(R, G, B, toRygb = true) {
    var H, a, b, c, g, h, r, s, sum;
    sum = R + G + B;
    r = R / sum;
    g = G / sum;
    b = B / sum;
    s = sum / 3;
    c = R === G && G === B ? 0 : 1 - 3 * Math.min(r, g, b); // Center Grayscale
    a = Vis.deg(Math.acos((r - 0.5 * (g + b)) / Math.sqrt((r - g) * (r - g) + (r - b) * (g - b))));
    h = b <= g ? a : 360 - a;
    if (c === 0) {
      h = 0;
    }
    H = toRygb ? Vis.toHueRgb(h) : h;
    return [H, c * 100, s / 2.55];
  }

  static sScale(hue, c, s) {
    var ch, m120, m60, s60, ss;
    ss = 1.0;
    m60 = hue % 60;
    m120 = hue % 120;
    s60 = m60 / 60;
    ch = c / 100;
    ss = m120 < 60 ? 3.0 - 1.5 * s60 : 1.5 + 1.5 * s60;
    return s * (1 - ch) + s * ch * ss;
  }

  static sScaleCf(hue, c, s) {
    var cf, cosd, cosu, m120, m60, ss;
    ss = sScale(hue, c, s);
    m60 = hue % 60;
    m120 = hue % 120;
    cosu = (1 - Vis.cos(m60)) * 100.00;
    cosd = (1 - Vis.cos(60 - m60)) * 100.00;
    cf = m120 < 60 ? cosu : cosd;
    return ss - cf;
  }

  static floor(x, dx) {
    var dr;
    dr = Math.round(dx);
    return Math.floor(x / dr) * dr;
  }

  static ceil(x, dx) {
    var dr;
    dr = Math.round(dx);
    return Math.ceil(x / dr) * dr;
  }

  static within(beg, deg, end) {
    return beg <= deg && deg <= end; // Closed interval with <=
  }

  static isZero(v) {
    return -0.01 < v && v < 0.01;
  }

  static unicode(icon) {
    var uc;
    uc = FaLookup$1.icons[icon];
    if (uc == null) {
      console.error('Vis.unicode() missing icon in Vis.FontAwesomeUnicodes for', icon);
      uc = "\uf111"; // Circle
    }
    return uc;
  }

  static uniawe(icon) {
    var temp, uni;
    temp = document.createElement("i");
    temp.className = icon;
    document.body.appendChild(temp);
    uni = window.getComputedStyle(document.querySelector('.' + icon), ':before').getPropertyValue('content');
    console.log('uniawe', icon, uni);
    temp.remove();
    return uni;
  }

};

var Vis$2 = Vis$1;

export { Database$1 as Database, Util$1 as Util, Stream$1 as Stream, Base$1 as Base, Btn$1 as Btn, Dom$1 as Dom, Navb$1 as Navb, Page$1 as Page, Tocs$1 as Tocs, UI$1 as UI, View$1 as View, Color$1 as Color, FaLookup$1 as FaLookup, Vis$2 as Vis };
