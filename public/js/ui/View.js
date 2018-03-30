(function() {
  var View,
    hasProp = {}.hasOwnProperty;

  View = (function() {
    class View {
      constructor(ui, stream, practices1) {
        this.resize = this.resize.bind(this);
        this.ui = ui;
        this.stream = stream;
        this.practices = practices1;
        this.speed = 400;
        this.$view = UI.$empty;
        this.margin = UI.margin;
        this.ncol = UI.ncol;
        this.nrow = UI.nrow;
        this.classPrefix = Util.isStr(this.practices.css) ? this.spec.css : 'ui-view';
        [this.wpane, this.hpane, this.wview, this.hview, this.wscale, this.hscale] = this.percents(this.nrow, this.ncol, this.margin);
        this.panes = this.createPanes(this.practices);
        this.sizeCallback = null;
        this.paneCallback = null;
        this.lastPaneName = '';
        this.emptyPane = UI.$empty;
        this.allCells = [1, this.ncol, 1, this.nrow];
        this.select = UI.select("Overview", "View", UI.SelectView);
      }

      ready() {
        var html, htmlId, k, len, pane, parent, ref;
        parent = $('#' + this.ui.getHtmlId('View')); // parent is outside of planes
        htmlId = this.ui.htmlId('View', 'Plane');
        html = $(`<div id="${htmlId}" class="${this.classPrefix}"></div>`);
        parent.append(html);
        this.$view = parent.find('#' + htmlId);
        ref = this.panes;
        for (k = 0, len = ref.length; k < len; k++) {
          pane = ref[k];
          pane.ready();
        }
        this.subscribe();
      }

      subscribe() {
        return this.stream.subscribe('Select', (select) => {
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

      isRow(specPaneGroup) {
        return specPaneGroup.css === 'ikw-row';
      }

      isCol(specPaneGroup) {
        return specPaneGroup.css === 'ikw-col';
      }

      jmin(cells) {
        return UI.jmin(cells);
      }

      positionUnionPane(unionCells, paneCells, spec, xscale = 1.0, yscale = 1.0) {
        var ip, iu, jp, ju, mp, mu, np, nu;
        [ju, mu, iu, nu] = UI.jmin(unionCells);
        [jp, mp, ip, np] = UI.jmin(paneCells);
        return this.position((jp - ju) * this.ncol / mu, mp * this.ncol / mu, (ip - iu) * this.nrow / nu, np * this.nrow / nu, spec, xscale, yscale);
      }

      positionGroup(groupCells, spec, xscale = 1.0, yscale = 1.0) {
        var i, j, m, n;
        [j, m, i, n] = UI.jmin(groupCells);
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
        this.select.name = select.name;
        this.select.intent = select.intent;
        ref = this.panes;
        for (k = 0, len = ref.length; k < len; k++) {
          pane = ref[k];
          pane.reset(this.select);
        }
      }

      resize() {
        var saveId;
        saveId = this.lastPaneName;
        this.lastPaneName = '';
        this.onSelect(UI.select(saveId, 'View', UI.SelectPane));
        this.lastPaneName = saveId;
      }

      hide() {
        this.$view.hide();
      }

      show() {
        this.$view.show();
      }

      hideAll() {
        var k, len, pane, ref;
        ref = this.panes;
        for (k = 0, len = ref.length; k < len; k++) {
          pane = ref[k];
          pane.hide();
        }
        this.$view.hide();
      }

      showAll() {
        var k, len, pane, ref;
        this.$view.hide();
        this.reset(this.select);
        ref = this.panes;
        for (k = 0, len = ref.length; k < len; k++) {
          pane = ref[k];
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
        UI.verifySelect(select, 'View');
        name = select.name;
        intent = select.intent;
        this.select = select;
        switch (intent) {
          case UI.SelectView:
            this.expandAllPanes();
            break;
          case UI.SelectPane:
            this.expandPane(this.getPaneOrGroup(name));
            break;
          case UI.SelectStudy:
            this.expandPane(this.getPaneOrGroup(name));
            break;
          default:
            Util.error('UI.View.onSelect() name not processed for intent', name, select);
        }
      }

      expandAllPanes() {
        this.hideAll();
        this.reset(this.select);
        return this.showAll();
      }

      expandPane(pane, callback = null) { // , study=null
        var paneCallback;
        paneCallback = callback != null ? callback : this.paneCallback;
        pane = this.getPaneOrGroup(pane, false); // don't issue errors
        if (pane == null) {
          return;
        }
        this.hideAll();
        pane.show();
        pane.animate(this.margin.west, this.margin.north, 100 * this.wview, 100 * this.hview, this.select, true, paneCallback);
        this.show();
        this.lastPaneName = pane.name;
      }

      getPaneOrGroup(keyOrPane, issueError = true) {
        var group, k, key, l, len, len1, pane, ref, ref1;
        if ((keyOrPane == null) || Util.isObj(keyOrPane)) {
          return keyOrPane;
        }
        key = keyOrPane;
        ref = this.panes;
        for (k = 0, len = ref.length; k < len; k++) {
          pane = ref[k];
          if (pane.name === key) {
            return pane;
          }
        }
        if (this.groups != null) {
          ref1 = this.groups;
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            group = ref1[l];
            if (group.name === key) {
              return group;
            }
          }
        }
        if (issueError) {
          Util.error('UI.View.getPaneOrGroup() null for key ', key);
        }
        return this.emptyPane;
      }

      createPanes(practices) {
        var keyPractice, pane, panes, practice;
        panes = [];
        for (keyPractice in practices) {
          if (!hasProp.call(practices, keyPractice)) continue;
          practice = practices[keyPractice];
          if (!practice.pane) {
            continue;
          }
          pane = new UI.Pane(this.ui, this.stream, this, practice);
          panes.push(pane);
          practice.pane = pane;
        }
        // @createStudyPanes( practice, panes )
        return panes;
      }

      paneInUnion(paneCells, unionCells) {
        var ip, iu, jp, ju, mp, mu, np, nu;
        [jp, mp, ip, np] = UI.jmin(paneCells);
        [ju, mu, iu, nu] = UI.jmin(unionCells);
        return ju <= jp && jp + mp <= ju + mu && iu <= ip && ip + np <= iu + nu;
      }

      expandCells(unionCells, allCells) { // Not Implemented
        var ia, iu, ja, ju, ma, mu, na, nu;
        [ju, mu, iu, nu] = UI.jmin(unionCells);
        [ja, ma, ia, na] = UI.jmin(allCells);
        return [(ju - ja) * ma / mu, ma, (iu - ia) * na / nu, na];
      }

    };

    UI.View = View;

    return View;

  }).call(this);

}).call(this);
