// Generated by CoffeeScript 1.6.3
(function() {
  var View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty;

  View = (function() {
    UI.View = View;

    function View(ui, stream, practices) {
      var _ref;
      this.ui = ui;
      this.stream = stream;
      this.practices = practices;
      this.resize = __bind(this.resize, this);
      this.speed = 400;
      this.$view = UI.$empty;
      this.margin = UI.margin;
      this.ncol = UI.ncol;
      this.nrow = UI.nrow;
      _ref = this.percents(this.nrow, this.ncol, this.margin), this.wpane = _ref[0], this.hpane = _ref[1], this.wview = _ref[2], this.hview = _ref[3], this.wscale = _ref[4], this.hscale = _ref[5];
      this.panes = this.createPanes(this.practices);
      this.sizeCallback = null;
      this.paneCallback = null;
      this.lastPaneName = '';
      this.emptyPane = UI.$empty;
      this.allCells = [1, this.ncol, 1, this.nrow];
      this.select = UI.select("Overview", "View", UI.SelectOverview);
    }

    View.prototype.ready = function() {
      var html, htmlId, pane, parent, _i, _len, _ref;
      parent = $('#' + this.ui.getHtmlId('View'));
      htmlId = this.ui.htmlId('View', 'Plane');
      html = $("<div id=\"" + htmlId + "\" class=\"ikw-view-plane\"></div>");
      parent.append(html);
      this.$view = parent.find('#' + htmlId);
      _ref = this.panes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pane = _ref[_i];
        pane.ready();
      }
      this.subscribe();
    };

    View.prototype.subscribe = function() {
      var _this = this;
      return this.stream.subscribe('Select', function(select) {
        return _this.onSelect(select);
      });
    };

    View.prototype.percents = function(nrow, ncol, margin) {
      var hpane, hscale, hview, wpane, wscale, wview;
      wpane = 100 / ncol;
      hpane = 100 / nrow;
      wview = 1.0 - (margin.west + margin.east) / 100;
      hview = 1.0 - (margin.north + margin.south) / 100;
      wscale = 1.0 - (margin.west + (ncol - 1) * margin.width + margin.east) / 100;
      hscale = 1.0 - (margin.north + (nrow - 1) * margin.height + margin.south) / 100;
      return [wpane, hpane, wview, hview, wscale, hscale];
    };

    View.prototype.pc = function(v) {
      return v.toString() + (v !== 0 ? '%' : '');
    };

    View.prototype.xs = function(x) {
      return this.pc(x * this.wscale);
    };

    View.prototype.ys = function(y) {
      return this.pc(y * this.hscale);
    };

    View.prototype.left = function(j) {
      return j * this.wpane;
    };

    View.prototype.top = function(i) {
      return i * this.hpane;
    };

    View.prototype.width = function(m) {
      return m * this.wpane + (m - 1) * this.margin.width / this.wscale;
    };

    View.prototype.height = function(n) {
      return n * this.hpane + (n - 1) * this.margin.height / this.hscale;
    };

    View.prototype.widthpx = function() {
      return this.$view.innerWidth();
    };

    View.prototype.heightpx = function() {
      return this.$view.innerHeight();
    };

    View.prototype.wPanes = function() {
      return this.wview * this.widthpx();
    };

    View.prototype.hPanes = function() {
      return this.hview * this.heightpx();
    };

    View.prototype.north = function(top, height, h, scale, dy) {
      if (scale == null) {
        scale = 1.0;
      }
      if (dy == null) {
        dy = 0;
      }
      return scale * (top - h + dy / this.hscale);
    };

    View.prototype.south = function(top, height, h, scale, dy) {
      if (scale == null) {
        scale = 1.0;
      }
      if (dy == null) {
        dy = 0;
      }
      return scale * (top + height + dy / this.hscale);
    };

    View.prototype.east = function(left, width, w, scale, dx) {
      if (scale == null) {
        scale = 1.0;
      }
      if (dx == null) {
        dx = 0;
      }
      return scale * (left + width + dx / this.wscale);
    };

    View.prototype.west = function(left, width, w, scale, dx) {
      if (scale == null) {
        scale = 1.0;
      }
      if (dx == null) {
        dx = 0;
      }
      return scale * (left - w + dx / this.wscale);
    };

    View.prototype.isRow = function(specPaneGroup) {
      return specPaneGroup.css === 'ikw-row';
    };

    View.prototype.isCol = function(specPaneGroup) {
      return specPaneGroup.css === 'ikw-col';
    };

    View.prototype.jmin = function(cells) {
      return UI.jmin(cells);
    };

    View.prototype.positionUnionPane = function(unionCells, paneCells, spec, xscale, yscale) {
      var ip, iu, jp, ju, mp, mu, np, nu, _ref, _ref1;
      if (xscale == null) {
        xscale = 1.0;
      }
      if (yscale == null) {
        yscale = 1.0;
      }
      _ref = UI.jmin(unionCells), ju = _ref[0], mu = _ref[1], iu = _ref[2], nu = _ref[3];
      _ref1 = UI.jmin(paneCells), jp = _ref1[0], mp = _ref1[1], ip = _ref1[2], np = _ref1[3];
      return this.position((jp - ju) * this.ncol / mu, mp * this.ncol / mu, (ip - iu) * this.nrow / nu, np * this.nrow / nu, spec, xscale, yscale);
    };

    View.prototype.positionGroup = function(groupCells, spec, xscale, yscale) {
      var i, j, m, n, _ref;
      if (xscale == null) {
        xscale = 1.0;
      }
      if (yscale == null) {
        yscale = 1.0;
      }
      _ref = UI.jmin(groupCells), j = _ref[0], m = _ref[1], i = _ref[2], n = _ref[3];
      return this.position(j, m, i, n, spec, xscale, yscale);
    };

    View.prototype.position = function(j, m, i, n, spec, xscale, yscale) {
      var hStudy, height, left, top, wStudy, width;
      if (xscale == null) {
        xscale = 1.0;
      }
      if (yscale == null) {
        yscale = 1.0;
      }
      wStudy = spec.name != null ? this.margin.wStudy : 0;
      hStudy = spec.name != null ? this.margin.hStudy : 0;
      left = xscale * (this.left(j) + (wStudy + this.margin.west + j * this.margin.width) / this.wscale);
      top = yscale * (this.top(i) + (hStudy + this.margin.north + i * this.margin.height) / this.hscale);
      width = xscale * (this.width(m) - wStudy * 2 / this.wscale);
      height = yscale * (this.height(n) - hStudy * 2 / this.hscale);
      return [left, top, width, height];
    };

    View.prototype.positionpx = function(j, m, i, n, spec) {
      var height, left, top, width, _ref;
      _ref = this.position(j, m, i, n, spec, this.wscale, this.hscale), left = _ref[0], top = _ref[1], width = _ref[2], height = _ref[3];
      return [width * this.widthpx() / 100, height * this.heightpx() / 100];
    };

    View.prototype.reset = function(select) {
      var pane, _i, _len, _ref;
      this.select.name = select.name;
      this.select.intent = select.intent;
      _ref = this.panes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pane = _ref[_i];
        pane.reset(this.select);
      }
    };

    View.prototype.resize = function() {
      var saveId;
      saveId = this.lastPaneName;
      this.lastPaneName = '';
      this.onSelect(UI.select(saveId, 'View', UI.SelectPractice));
      this.lastPaneName = saveId;
    };

    View.prototype.hide = function() {
      this.$view.hide();
    };

    View.prototype.show = function() {
      if (this.inPlane()) {
        this.$view.show();
      }
    };

    View.prototype.hideAll = function() {
      var pane, _i, _len, _ref;
      _ref = this.panes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pane = _ref[_i];
        pane.hide();
      }
      this.$view.hide();
    };

    View.prototype.showAll = function() {
      var pane, _i, _len, _ref,
        _this = this;
      if (!this.inPlane()) {
        return;
      }
      this.$view.hide();
      this.reset(this.select);
      _ref = this.panes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pane = _ref[_i];
        pane.show();
      }
      this.$view.show(this.speed, function() {
        if (_this.sizeCallback) {
          return _this.sizeCallback(_this);
        }
      });
    };

    View.prototype.onSelect = function(select) {
      var intent, name;
      UI.verifySelect(select, 'View');
      if (this.ui.notInPlane()) {
        return;
      }
      name = select.name;
      intent = select.intent;
      this.select = select;
      switch (intent) {
        case UI.SelectOverview:
          this.expandAllPanes();
          break;
        case UI.SelectPractice:
          this.expandPane(this.getPaneOrGroup(name));
          break;
        case UI.SelectStudy:
          this.expandPane(this.getPaneOrGroup(name));
          break;
        default:
          Util.error('UI.View.onSelect() name not processed for intent', name, select.intent);
      }
    };

    View.prototype.inPlane = function() {
      return true;
    };

    View.prototype.expandAllPanes = function() {
      this.hideAll();
      this.reset(this.select);
      return this.showAll();
    };

    View.prototype.expandPane = function(pane, callback) {
      var paneCallback;
      if (callback == null) {
        callback = null;
      }
      paneCallback = callback != null ? callback : this.paneCallback;
      pane = this.getPaneOrGroup(pane, false);
      if (pane == null) {
        return;
      }
      this.hideAll();
      pane.show();
      pane.animate(this.margin.west, this.margin.north, 100 * this.wview, 100 * this.hview, this.select, true, paneCallback);
      this.show();
      this.lastPaneName = pane.name;
    };

    View.prototype.getPaneOrGroup = function(keyOrPane, issueError) {
      var group, key, pane, _i, _j, _len, _len1, _ref, _ref1;
      if (issueError == null) {
        issueError = true;
      }
      if ((keyOrPane == null) || Util.isObj(keyOrPane)) {
        return keyOrPane;
      }
      key = keyOrPane;
      _ref = this.panes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pane = _ref[_i];
        if (pane.name === key) {
          return pane;
        }
      }
      if (this.groups != null) {
        _ref1 = this.groups;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          group = _ref1[_j];
          if (group.name === key) {
            return group;
          }
        }
      }
      if (issueError) {
        Util.error('UI.View.getPaneOrGroup() null for key ', key);
      }
      return this.emptyPane;
    };

    View.prototype.createPanes = function(practices) {
      var keyPractice, pane, panes, practice;
      panes = [];
      for (keyPractice in practices) {
        if (!__hasProp.call(practices, keyPractice)) continue;
        practice = practices[keyPractice];
        if (!(keyPractice !== 'Overview' && (practice.cells != null))) {
          continue;
        }
        pane = new UI.Pane(this.ui, this.stream, this, practice);
        panes.push(pane);
        practice.pane = pane;
      }
      return panes;
    };

    View.prototype.paneInUnion = function(paneCells, unionCells) {
      var ip, iu, jp, ju, mp, mu, np, nu, _ref, _ref1;
      _ref = UI.jmin(paneCells), jp = _ref[0], mp = _ref[1], ip = _ref[2], np = _ref[3];
      _ref1 = UI.jmin(unionCells), ju = _ref1[0], mu = _ref1[1], iu = _ref1[2], nu = _ref1[3];
      return ju <= jp && jp + mp <= ju + mu && iu <= ip && ip + np <= iu + nu;
    };

    View.prototype.expandCells = function(unionCells, allCells) {
      var ia, iu, ja, ju, ma, mu, na, nu, _ref, _ref1;
      _ref = UI.jmin(unionCells), ju = _ref[0], mu = _ref[1], iu = _ref[2], nu = _ref[3];
      _ref1 = UI.jmin(allCells), ja = _ref1[0], ma = _ref1[1], ia = _ref1[2], na = _ref1[3];
      return [(ju - ja) * ma / mu, ma, (iu - ia) * na / nu, na];
    };

    return View;

  })();

}).call(this);
