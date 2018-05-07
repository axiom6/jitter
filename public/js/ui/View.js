import Util  from '../util/Util.js';
import UI    from '../ui/UI.js';
import Pane  from '../ui/Pane.js';
import Group from '../ui/Group.js';
var View,
  hasProp = {}.hasOwnProperty;

View = class View {
  constructor(ui, stream, practices1) {
    this.resize = this.resize.bind(this);
    this.ui = ui;
    this.stream = stream;
    this.practices = practices1;
    this.speed = 400;
    this.$view = UI.$empty;
    this.margin = UI.margin;
    this.ncol = this.ui.ncol;
    this.nrow = this.ui.nrow;
    this.classPrefix = Util.isStr(this.practices.css) ? this.spec.css : 'ui-view';
    [this.wpane, this.hpane, this.wview, this.hview, this.wscale, this.hscale] = this.percents(this.nrow, this.ncol, this.margin);
    [this.groups, this.panes] = this.createThePanes();
    this.sizeCallback = null;
    this.paneCallback = null;
    this.lastPaneName = '';
    this.$empty = UI.$empty; // Empty jQuery singleton for intialization
    this.allCells = [1, this.ncol, 1, this.nrow];
  }

  createThePanes() {
    if (this.ui.planeName === 'Jitter') {
      return this.createGroupsPanes(this.practices);
    } else {
      return this.createPanes(this.practices);
    }
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

  isRow(specPaneGroup) {
    return specPaneGroup.css === 'ikw-row';
  }

  isCol(specPaneGroup) {
    return specPaneGroup.css === 'ikw-col';
  }

  positionUnionPane(unionCells, paneCells, spec, xscale = 1.0, yscale = 1.0) {
    var ip, iu, jp, ju, mp, mu, np, nu;
    [ju, mu, iu, nu] = this.jmin(unionCells);
    [jp, mp, ip, np] = this.jmin(paneCells);
    return this.position((jp - ju) * this.ncol / mu, mp * this.ncol / mu, (ip - iu) * this.nrow / nu, np * this.nrow / nu, spec, xscale, yscale);
  }

  positionGroup(groupCells, spec, xscale = 1.0, yscale = 1.0) {
    var i, j, m, n;
    [j, m, i, n] = this.jmin(groupCells);
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
    UI.verifySelect(select, 'View');
    name = select.name;
    intent = select.intent;
    switch (intent) {
      case UI.SelectView:
        this.expandAllPanes(select);
        break;
      case UI.SelectGroup:
        this.expandGroup(select, this.getPaneOrGroup(name));
        break;
      case UI.SelectPane:
        this.expandPane(select, this.getPaneOrGroup(name));
        break;
      case UI.SelectStudy:
        this.expandStudy(select, this.getPaneOrGroup(name));
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

  expandGroup(select, group, callback = null) {
    var height, k, left, len, pane, ref, top, width;
    this.hideAll('Interact');
    if (group.panes != null) {
      ref = group.panes;
      for (k = 0, len = ref.length; k < len; k++) {
        pane = ref[k];
        pane.show();
        //left,top,width,height] = @positionUnionPane( group.cells, pane.cells, pane.spec, @wscale, @hscale )
        [left, top, width, height] = this.positionPane(pane.cells, pane.spec, this.wscale, this.hscale);
        pane.intent = select.intent;
        pane.animate(left, top, width, height, select, true, callback);
      }
    } else {
      console.error('View.expandGroup group.panes null');
    }
    this.show();
    this.lastPaneName = 'None';
  }

  expandPane(select, pane, callback = null) {
    var paneCallback;
    paneCallback = callback != null ? callback : this.paneCallback;
    pane = this.getPaneOrGroup(pane, false); // don't issue errors
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

  getPaneOrGroup(key, issueError = true) {
    var group, k, l, len, len1, pane, ref, ref1;
    if (Util.isObj(key)) {
      return key;
    }
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
      console.error('UI.View.getPaneOrGroup() null for key ', key);
    }
    return null;
  }

  createPanes(practices) {
    var keyPractice, pane, panes, practice;
    panes = [];
// when practice.pane
    for (keyPractice in practices) {
      if (!hasProp.call(practices, keyPractice)) continue;
      practice = practices[keyPractice];
      pane = new Pane(this.ui, this.stream, this, practice);
      panes.push(pane);
      practice.pane = pane;
    }
    // @createStudyPanes( practice, panes )
    return [null, panes];
  }

  createGroupsPanes(specs) {
    var gkey, group, groups, gspec, interact, pane, panes, pkey, pspec;
    groups = [];
    panes = [];
    interact = new Pane(this.ui, this.stream, this, specs['Interact']);
    panes.push(interact);
    specs['Interact'].pane = pane;
    for (gkey in specs) {
      if (!hasProp.call(specs, gkey)) continue;
      gspec = specs[gkey];
      if (!(gspec.type === 'group')) {
        continue;
      }
      group = new Group(this.ui, this.stream, this, gspec);
      groups.push(group);
      gspec.group = group;
      for (pkey in gspec) {
        if (!hasProp.call(gspec, pkey)) continue;
        pspec = gspec[pkey];
        if (!(UI.isChild(pkey) && pspec.type === 'pane')) {
          continue;
        }
        pane = new Pane(this.ui, this.stream, this, pspec);
        panes.push(pane);
        group.panes.push(pane);
        pspec.pane = pane;
      }
    }
    //console.log( "View.createGroupsPanes()", group )
    return [groups, panes];
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
      Util.trace('UI.jmin');
    }
    return [cells[0] - 1, cells[1], cells[2] - 1, cells[3]];
  }

  toCells(jmin) {
    return [jmin[0] + 1, jmin[1], jmin[2] + 1, jmin[3]];
  }

  unionCells(cells1, cells2) {
    var i1, i2, j1, j2, m1, m2, n1, n2;
    [j1, m1, i1, n1] = UI.jmin(cells1);
    [j2, m2, i2, n2] = UI.jmin(cells2);
    return [Math.min(j1, j2) + 1, Math.max(j1 + m1, j2 + m2) - Math.min(j1, j2), Math.min(i1, i2) + 1, Math.max(i1 + n1, i2 + n2) - Math.min(i1, i2)];
  }

  intersectCells(cells1, cells2) {
    var i1, i2, j1, j2, m1, m2, n1, n2;
    [j1, m1, i1, n1] = UI.jmin(cells1);
    [j2, m2, i2, n2] = UI.jmin(cells2);
    return [Math.max(j1, j2) + 1, Math.min(j1 + m1, j2 + m2), Math.max(i1, i2) + 1, Math.min(i1 + n1, i2 + n2)];
  }

};

export default View;
