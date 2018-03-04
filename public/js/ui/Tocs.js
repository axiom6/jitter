'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  //$  = require( 'jquery'   )
  //UI = require( 'js/ui/UI' )
  var Tocs,
      hasProp = {}.hasOwnProperty;

  Tocs = function () {
    var Tocs = function () {
      function Tocs(ui, stream, practices1) {
        _classCallCheck(this, Tocs);

        this.ui = ui;
        this.stream = stream;
        this.practices = practices1;

        //@logSpecs()
        var _createTocsSpecs = this.createTocsSpecs(this.practices);

        var _createTocsSpecs2 = _slicedToArray(_createTocsSpecs, 2);

        this.specs = _createTocsSpecs2[0];
        this.stack = _createTocsSpecs2[1];
        this.htmlIdApp = this.ui.getHtmlId('Tocs', '');
        this.last = this.specs[0];
        this.speed = 400;
      }

      _createClass(Tocs, [{
        key: 'createTocsSpecs',
        value: function createTocsSpecs(practices) {
          var hasChild, keyPrac, keyStudy, practice, spec0, specN, specs, stack, study;
          spec0 = {
            level: 0,
            name: "Beg"
          };
          stack = new Array(UI.MaxTocLevel);
          stack[0] = spec0;
          specs = [];
          specs.push(spec0);
          for (keyPrac in practices) {
            if (!hasProp.call(practices, keyPrac)) continue;
            practice = practices[keyPrac];
            hasChild = keyPrac === "Overview" ? false : practice.toc;
            this.enrichSpec(keyPrac, practice, specs, 1, spec0, hasChild, true);
            for (keyStudy in practice) {
              if (!hasProp.call(practice, keyStudy)) continue;
              study = practice[keyStudy];
              if (!(hasChild && UI.isChild(keyStudy))) {
                continue;
              }
              practice.hasChild = true;
              this.enrichSpec(keyStudy, study, specs, 2, practice, false, false);
            }
          }
          specN = {
            level: 0,
            name: "End"
          };
          specs.push(specN);
          return [specs, stack];
        }
      }, {
        key: 'logSpecs',
        value: function logSpecs() {
          var j, len, ref, spec;
          ref = this.specs;
          for (j = 0, len = ref.length; j < len; j++) {
            spec = ref[j];
            Util.log('UI.Tocs.spec', Util.indent(spec.level * 2), spec.name, spec.hasChild);
          }
        }
      }, {
        key: 'enrichSpec',
        value: function enrichSpec(key, spec, specs, level, parent, hasChild, isRow) {
          spec.level = level;
          spec.parent = parent;
          spec.name = spec.name != null ? spec.name : key; // Need to learn why this is needed
          spec.on = false;
          spec.hasChild = hasChild;
          spec.isRow = isRow;
          specs.push(spec);
        }
      }, {
        key: 'ready',
        value: function ready() {
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
            select = UI.select(spec.name, 'Tocs', this.intent(spec));
            this.stream.publish('Select', select, spec.$li, 'click', spec.liId);
          }
          this.subscribe();
        }
      }, {
        key: 'intent',
        value: function intent(spec) {
          switch (spec.level) {
            case 1:
              return this.selectOverviewOrPractice(spec);
            default:
              return UI.SelectStudy;
          }
        }
      }, {
        key: 'selectOverviewOrPractice',
        value: function selectOverviewOrPractice(spec) {
          if (spec.name === 'Overview') {
            return UI.SelectOverview;
          } else {
            return UI.SelectPractice;
          }
        }
      }, {
        key: 'subscribe',
        value: function subscribe() {
          var _this = this;

          this.stream.subscribe('Select', function (select) {
            return _this.onSelect(select);
          });
        }
      }, {
        key: 'htmlId',
        value: function htmlId(spec) {
          var ext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

          var suffix;
          suffix = spec.parent != null ? ext + spec.parent.name : ext;
          return this.ui.htmlId(spec.name, 'Tocs', suffix);
        }
      }, {
        key: 'getSpec',
        value: function getSpec(select) {
          var issueError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

          var j, len, ref, spec;
          ref = this.specs;
          for (j = 0, len = ref.length; j < len; j++) {
            spec = ref[j];
            if (spec.name === select.name) {
              return spec;
            }
          }
          if (issueError && this.nameNotOk(select.name)) {
            Util.error('UI.Tocs.getSpec(id) spec null for select', select);
          }
          return null;
        }
      }, {
        key: 'nameNotOk',
        value: function nameNotOk(name) {
          var j, len, okName, okNames;
          okNames = ['None', 'Embrace', 'Innovate', 'Encourage', 'Overview', 'Technique'];
          for (j = 0, len = okNames.length; j < len; j++) {
            okName = okNames[j];
            if (name === okName) {
              return false;
            }
          }
          return true;
        }
      }, {
        key: 'html',
        value: function html() {
          var htm, i, j, ref;
          this.specs[0].ulId = this.htmlId(this.specs[0], 'UL');
          htm = '<ul class="ul0" id="' + this.specs[0].ulId + '">';
          for (i = j = 1, ref = this.specs.length; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
            htm += this.process(i);
          }
          return htm;
        }
      }, {
        key: 'show',
        value: function show() {
          this.$tocs.show();
        }
      }, {
        key: 'hide',
        value: function hide() {
          this.$tocs.hide();
        }
      }, {
        key: 'process',
        value: function process(i) {
          var htm, j, level, prev, ref, ref1, spec;
          htm = "";
          prev = this.specs[i - 1];
          spec = this.specs[i];
          if (spec.level >= prev.level) {
            htm += this.htmlBeg(spec);
            this.stack[spec.level] = spec;
          } else {
            for (level = j = ref = prev.level, ref1 = spec.level; ref <= ref1 ? j <= ref1 : j >= ref1; level = ref <= ref1 ? ++j : --j) {
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
      }, {
        key: 'htmlBeg',
        value: function htmlBeg(spec) {
          var htm;
          spec.liId = this.htmlId(spec, 'LI');
          spec.ulId = this.htmlId(spec, 'UL');
          //Util.log( 'UI.Tocs htmlBeg()', spec.id, spec.liId, spec.ulId )
          htm = '<li class="li' + spec.level + '" id="' + spec.liId + '" >';
          htm += '' + this.htmIconName(spec);
          if (spec.hasChild) {
            htm += '<ul class="ul' + spec.level + '" id="' + spec.ulId + '">';
          }
          return htm;
        }
      }, {
        key: 'htmIconName',
        value: function htmIconName(spec) {
          var htm;
          htm = "<div style=\"display:table;\">";
          if (spec.icon) {
            htm += '<i class="fa ' + spec.icon + ' fa-lg"></i>';
          }
          htm += '<span style="display:table-cell; vertical-align:middle; padding-left:12px;">' + Util.toName(spec.name) + '</span>';
          return htm += "</div>";
        }
      }, {
        key: 'htmlEnd',
        value: function htmlEnd(spec) {
          if (spec.level === 0) {
            return "</ul>";
          } else if (spec.hasChild) {
            return "</ul></li>";
          } else {
            return "</li>";
          }
        }
      }, {
        key: 'onSelect',
        value: function onSelect(select) {
          var spec;
          UI.verifySelect(select, 'Tocs');
          if (this.ui.notInPlane()) {
            return;
          }
          spec = this.getSpec(select, true); // spec null ok not all Tocs available for views
          if (spec != null) {
            this.update(spec);
          }
        }
      }, {
        key: 'update',
        value: function update(spec) {
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
      }, {
        key: 'reveal',
        value: function reveal(spec) {
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
      }]);

      return Tocs;
    }();

    ;

    //module.exports = Tocs # Util.Export( Tocs, 'ui/Tocs' )
    UI.Tocs = Tocs;

    return Tocs;
  }.call(this);
}).call(undefined);
