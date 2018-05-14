import Util from 'js/util/Util.js';
import UI   from 'js/ui/UI.js';
var Spec,
  hasProp = {}.hasOwnProperty;

Spec = class Spec {
  constructor(ui, stream, data) {
    this.ui = ui;
    this.stream = stream;
    this.specs = this.createSpecs(data);
    this.packs = [];
    this.panes = [];
  }

  createSpecs(data) {
    var gkey, group, ikey, item, pkey, practice, skey, specs, study, tkey, topic;
    specs = {};
    for (gkey in data) {
      group = data[gkey];
      if (!(UI.isChild(gkey))) {
        continue;
      }
      group['name'] = gkey;
      specs[gkey] = group;
      group.practices = {};
      for (pkey in group) {
        practice = group[pkey];
        if (!(UI.isChild(pkey))) {
          continue;
        }
        practice['name'] = pkey;
        practice.studies = {};
        group.practices[pkey] = practice;
        delete group[pkey];
        for (skey in practice) {
          study = practice[skey];
          if (!(UI.isChild(skey))) {
            continue;
          }
          study['name'] = skey;
          study.topics = {};
          practice.studies[skey] = study;
          delete practice[skey];
          for (tkey in study) {
            topic = study[tkey];
            if (!(UI.isChild(tkey))) {
              continue;
            }
            topic['name'] = tkey;
            topic.items = {};
            study.topics[tkey] = topic;
            delete study[tkey];
            for (ikey in topic) {
              item = topic[ikey];
              if (!(UI.isChild(ikey))) {
                continue;
              }
              item['name'] = ikey;
              topic.items[ikey] = item;
              delete topic[ikey];
            }
          }
        }
      }
    }
    return specs;
  }

  packPanes(key) {
    var gkey, group, panes, pkey, prac, ref;
    panes = [];
    ref = this.specs;
    for (gkey in ref) {
      if (!hasProp.call(ref, gkey)) continue;
      group = ref[gkey];
      if (this.ui.isChild(gkey)) {
        if (gkey === key) {
          for (pkey in group) {
            if (!hasProp.call(group, pkey)) continue;
            prac = group[pkey];
            if (this.ui.isChild(pkey)) {
              panes.push(prac.pane);
            }
          }
          return panes;
        }
      }
    }
    return panes;
  }

  packs() {
    var gkey, group, panes, ref;
    panes = [];
    ref = this.specs;
    for (gkey in ref) {
      if (!hasProp.call(ref, gkey)) continue;
      group = ref[gkey];
      if (this.ui.isChild(gkey)) {
        panes.push(group.pane);
      }
    }
    return panes;
  }

};

export default Spec;
