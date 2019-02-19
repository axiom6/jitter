var Build,
  hasProp = {}.hasOwnProperty;

import Util from '../util/Util.js';

import Data from '../util/Data.js';

Build = class Build {
  // ---- Class Methods for Practices ----
  static create(data, type) {
    switch (type) {
      case 'Pack':
        return Build.createPacks(data);
      case 'Prac':
        return Build.createPracs(data);
      default:
        return data;
    }
  }

  static createPacks(data) {
    var gkey, group;
    for (gkey in data) {
      group = data[gkey];
      if (!(Util.isChild(gkey))) {
        continue;
      }
      if (group['name'] == null) {
        group['name'] = gkey;
      }
      Build.createPracs(group);
    }
    return data;
  }

  static createPracs(data) {
    var base, bkey, ikey, item, pkey, pract, skey, study, tkey, topic;
    for (pkey in data) {
      pract = data[pkey];
      if (!(Util.isChild(pkey))) {
        continue;
      }
      if (pract['name'] == null) {
        pract['name'] = pkey;
      }
      for (skey in pract) {
        study = pract[skey];
        if (!(Util.isChild(skey))) {
          continue;
        }
        if (study['name'] == null) {
          study['name'] = skey;
        }
        for (tkey in study) {
          topic = study[tkey];
          if (!(Util.isChild(tkey))) {
            continue;
          }
          if (topic['name'] == null) {
            topic['name'] = tkey;
          }
          for (ikey in topic) {
            item = topic[ikey];
            if (!(Util.isChild(ikey))) {
              continue;
            }
            if (item['name'] == null) {
              item['name'] = ikey;
            }
            for (bkey in item) {
              base = item[bkey];
              if (Util.isChild(bkey)) {
                if (base['name'] == null) {
                  base['name'] = bkey;
                }
              }
            }
          }
        }
      }
    }
    return data;
  }

  static colPractices(batch, justCore = false) {
    var col, cols, i, j, key, len, len1, pln, prin, prinPln, ref, ref1, ref2, std;
    prin = batch.Cols.data['Cols'];
    ref = ['Info', 'Know', 'Wise'];
    for (i = 0, len = ref.length; i < len; i++) {
      pln = ref[i];
      cols = batch[pln].data['Cols'] = Build.copyAtt(prin, {});
      prinPln = justCore ? 'Core' : pln;
      ref1 = ['Embrace', 'Innovate', 'Encourage'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        col = ref1[j];
        cols[col] = Build.copyAtt(prin[col], prin[col][prinPln]);
        ref2 = prin[col][prinPln];
        for (key in ref2) {
          std = ref2[key];
          if (Util.isChild(key)) {
            cols[col][key] = Build.copyAtt(prin[col]['dirs'][std.dir], std);
          }
        }
      }
    }
  }

  static rowPractices(batch) {
    var i, len, pln, prin, ref;
    prin = batch.Rows.data['Rows'];
    ref = ['Info', 'Know', 'Wise'];
    for (i = 0, len = ref.length; i < len; i++) {
      pln = ref[i];
      batch[pln].data['Rows'] = prin;
    }
  }

  static copyAtt(src, des) {
    var key, obj;
    for (key in src) {
      obj = src[key];
      if (!Util.isChild(key)) {
        des[key] = obj;
      }
    }
    return des;
  }

  // for dir in [ 'west', 'north', 'east', 'south'   ]
  // Call after all practices and studies have been read in
  // Not used because we store studies with practices in /pract
  static expandStudys(groups, studies) {
    var gkey, group, pkey, pract, skey, study;
    for (gkey in groups) {
      group = groups[gkey];
      if (Util.isChild(gkey)) {
        for (pkey in group) {
          pract = group[pkey];
          if (Util.isChild(pkey)) {
            for (skey in pract) {
              study = pract[skey];
              if (Util.isChild(skey)) {
                if (studies[skey] != null) {
                  pract[skey] = studies[skey];
                }
              }
            }
          }
        }
      }
    }
  }

  // Call after all practices and topics have been read in
  static expandTopics(groups, topics, log = false) {
    var gkey, group, pkey, pract, skey, study, tkey, topic;
    for (gkey in groups) {
      group = groups[gkey];
      if (!(Util.isChild(gkey))) {
        continue;
      }
      if (log) {
        console.log(gkey);
      }
      for (pkey in group) {
        pract = group[pkey];
        if (!(Util.isChild(pkey))) {
          continue;
        }
        if (log) {
          console.log("  ", pkey);
        }
        for (skey in pract) {
          study = pract[skey];
          if (!(Util.isChild(skey))) {
            continue;
          }
          if (log) {
            console.log("    ", skey);
          }
          for (tkey in study) {
            topic = study[tkey];
            if (Util.isChild(tkey)) {
              if (topics[tkey] != null) {
                if (log) {
                  console.log("      ", tkey, "match");
                }
                if (topics[tkey]['name'] == null) {
                  topics[tkey]['name'] = tkey;
                }
                study[tkey] = topics[tkey];
              } else {
                if (log) {
                  console.log("      ", tkey);
                }
              }
            }
          }
        }
      }
    }
  }

  // Build instance
  constructor(batch1, planeName) {
    this.batch = batch1;
    this.planeName = planeName;
    this.Spec = this.batch.Muse.data;
    this.None = {
      name: "None"
    };
    Util.noop(this.toGroups, this.setAdjacents);
  }

  getSpecs(plane) {
    if (this.batch[plane] != null) {
      return this.batch[plane].data;
    } else {
      console.error(`Build.getSpecs() ${plane}.json has not been input`);
      return null;
    }
  }

  toGroups(groups) {
    var group, key;
    for (key in groups) {
      group = groups[key];
      group['key'] = key;
      group['name'] = group.name != null ? group.name : key;
      group['border'] = group['border'] != null ? group['border'] : '0';
    }
    return groups;
  }

  toStudies(prac) {
    var skey, studies, study;
    studies = {};
    for (skey in prac) {
      study = prac[skey];
      if (Util.isChild(skey)) {
        studies[skey] = study;
      }
    }
    return studies;
  }

  combine() {
    var arg, i, key, len, obj, val;
    obj = {};
    for (i = 0, len = arguments.length; i < len; i++) {
      arg = arguments[i];
      for (key in arg) {
        if (!hasProp.call(arg, key)) continue;
        val = arg[key];
        obj[key] = val;
      }
    }
    return obj;
  }

  west(col) {
    switch (col) {
      case 'Embrace':
        return 'None';
      case 'Innovate':
        return 'Embrace';
      case 'Encourage':
        return 'Innovate';
      default:
        return 'None';
    }
  }

  east(col) {
    switch (col) {
      case 'Embrace':
        return 'Innovate';
      case 'Innovate':
        return 'Encourage';
      case 'Encourage':
        return 'None';
      default:
        return 'None';
    }
  }

  north(row) {
    switch (row) {
      case 'Learn':
        return 'None';
      case 'Do':
        return 'Learn';
      case 'Share':
        return 'Do';
      default:
        return 'None';
    }
  }

  south(row) {
    switch (row) {
      case 'Learn':
        return 'Do';
      case 'Do':
        return 'Share';
      case 'Share':
        return 'None';
      default:
        return 'None';
    }
  }

  prev(plane) {
    switch (plane) {
      case 'Info':
        return 'None';
      case 'Know':
        return 'Info';
      case 'Wise':
        return 'Know';
      default:
        return 'None';
    }
  }

  next(plane) {
    switch (plane) {
      case 'Info':
        return 'Know';
      case 'Know':
        return 'Wise';
      case 'Wise':
        return 'None';
      default:
        return 'None';
    }
  }

  adjacentPractice(prac, dir) {
    var adj, col, key, pln, pracs, row;
    if ((prac == null) || (prac.name == null) || prac.name === 'None' || (prac.column == null)) {
      // console.log( 'adjacentPractice', { prac:prac, dir:dir } )
      return this.None;
    }
    col = "";
    row = "";
    pln = "";
    [col, row, pln] = (function() {
      switch (dir) {
        case 'west':
        case 'nw':
        case 'sw':
          return [this.west(prac.column), prac.row, prac.plane];
        case 'east':
        case 'sw':
        case 'se':
          return [this.east(prac.column), prac.row, prac.plane];
        case 'north':
          return [prac.column, this.north(prac.row), prac.plane];
        case 'south':
          return [prac.column, this.south(prac.row), prac.plane];
        case 'prev':
          return [prac.column, prac.row, this.prev(prac.plane)];
        case 'next':
          return [prac.column, prac.row, this.next(prac.plane)];
        default:
          return ["None", "None", "None"];
      }
    }).call(this);
    if ([col, row, pln] === ["None", "None", "None"]) {
      //console.log( 'adjacentPractice[col,row,pln]', [col,row,pln] )
      return this.None;
    }
    pracs = this.getPractices(pln);
    for (key in pracs) {
      if (!hasProp.call(pracs, key)) continue;
      adj = pracs[key];
      if (Util.isChild(key)) {
        if (adj.column === col && adj.row === row && adj.plane === pln) {
          return adj;
        }
      }
    }
    return this.None;
  }

  adjacentStudies(practice, dir) {
    var adjPrac;
    adjPrac = this.adjacentPractice(practice, dir);
    if (adjPrac.name !== 'None') {
      return this.toStudies(adjPrac);
    } else {
      return {};
    }
  }

  connectName(practice, dir) {
    var adjacent;
    adjacent = this.adjacentPractice(practice, dir);
    if (adjacent.name !== 'None') {
      return [practice.name, adjacent.name];
    } else {
      return ['None', 'None'];
    }
  }

  setAdjacents(practice) {
    practice.west = this.adjacentPractice(practice, 'west');
    practice.east = this.adjacentPractice(practice, 'east');
    practice.north = this.adjacentPractice(practice, 'north');
    practice.south = this.adjacentPractice(practice, 'south');
    practice.prev = this.adjacentPractice(practice, 'prev');
    practice.next = this.adjacentPractice(practice, 'next');
  }

  getPractices(plane) {
    if ((this.batch[plane] != null) && (this.batch[plane].data[plane] != null)) {
      return this.batch[plane].data[plane];
    } else {
      console.error('Build.getPractices()', plane);
      return {};
    }
  }

  getPractice(row, column, plane = this.planeName) {
    var pkey, prac, practices;
    practices = this.getPractices(plane);
    for (pkey in practices) {
      if (!hasProp.call(practices, pkey)) continue;
      prac = practices[pkey];
      if (Util.isChild(pkey) && prac.column === column && prac.row === row) {
        return prac;
      }
    }
    console.error('Prac.getPractice() practice not found for', {
      column: column,
      row: row,
      plane: plane
    });
    return null; // Landmine
  }

  getPracticeStudy(row, column, dir, plane = this.planeName) {
    var practice, study;
    practice = this.getPractice(row, column, plane);
    study = this.getDir(practice, dir);
    return study;
  }

  getDir(practice, dir) {
    var skey, study;
    for (skey in practice) {
      if (!hasProp.call(practice, skey)) continue;
      study = practice[skey];
      if (Util.isChild(skey)) {
        if (study.dir === dir) {
          return study;
        }
      }
    }
    return null;
  }

  getPrin(col, pln, dir) {
    var colPln, key;
    colPln = this.batch.Cols.data['Cols'][col][pln];
    for (key in colPln) {
      col = colPln[key];
      if (col.dir === dir) {
        return key;
      }
    }
    return this.None;
  }

  getCol(col) {
    return this.batch.Cols.data['Cols'][col]['Core'];
  }

  logPlanes() {
    var i, keyBase, keyItem, keyPlane, keyPractice, keyStudy, keyTopic, len, objBase, objItem, objPractice, objStudy, objTopic, practices, ref;
    console.log('----- Beg Log Planes  ------');
    ref = ['Info', 'Know', 'Wise'];
    for (i = 0, len = ref.length; i < len; i++) {
      keyPlane = ref[i];
      console.log("Plane: ", keyPlane);
      practices = this.getPractices(keyPlane);
      for (keyPractice in practices) {
        if (!hasProp.call(practices, keyPractice)) continue;
        objPractice = practices[keyPractice];
        if (!(Util.isChild(keyPractice))) {
          continue;
        }
        console.log("  Practice: ", keyPractice);
        for (keyStudy in objPractice) {
          if (!hasProp.call(objPractice, keyStudy)) continue;
          objStudy = objPractice[keyStudy];
          if (!(Util.isChild(keyStudy))) {
            continue;
          }
          console.log("    Study: ", keyStudy);
          for (keyTopic in objStudy) {
            if (!hasProp.call(objStudy, keyTopic)) continue;
            objTopic = objStudy[keyTopic];
            if (!(Util.isChild(keyTopic))) {
              continue;
            }
            console.log("      Topic: ", keyTopic);
            for (keyItem in objTopic) {
              if (!hasProp.call(objTopic, keyItem)) continue;
              objItem = objTopic[keyItem];
              if (!(Util.isChild(keyItem))) {
                continue;
              }
              console.log("        Item: ", keyItem);
              for (keyBase in objItem) {
                if (!hasProp.call(objItem, keyBase)) continue;
                objBase = objItem[keyBase];
                if (Util.isChild(keyBase)) {
                  console.log("          Base: ", keyBase);
                }
              }
            }
          }
        }
      }
    }
    console.log('----- End Log Planes ------');
  }

  logBatch(batch) {
    var batKey, batObj, i, j, keyPractice, keyStudy, len, len1, objPractice, objStudy, packKey, packObj, ref, ref1;
    console.log('----- Beg Log Batch  ------');
    ref = ['Info', 'Know', 'Wise'];
    for (i = 0, len = ref.length; i < len; i++) {
      batKey = ref[i];
      console.log("Batch File: ", batKey);
      batObj = batch[batKey].data;
      ref1 = ['Info', 'Know', 'Wise', 'Cols', 'Rows'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        packKey = ref1[j];
        packObj = batObj[packKey];
        console.log("  Pack: ", packKey, packObj);
        for (keyPractice in packObj) {
          if (!hasProp.call(packObj, keyPractice)) continue;
          objPractice = packObj[keyPractice];
          if (!(Util.isChild(keyPractice))) {
            continue;
          }
          console.log("    Practice: ", keyPractice);
          for (keyStudy in objPractice) {
            if (!hasProp.call(objPractice, keyStudy)) continue;
            objStudy = objPractice[keyStudy];
            if (Util.isChild(keyStudy)) {
              console.log("      Study: ", keyStudy);
            }
          }
        }
      }
    }
    console.log('----- End Log Batch ------');
  }

  logByConduit() {
    var col, dir, i, infod, infop, j, k, knowd, knowp, len, len1, len2, ref, ref1, ref2, row, wised, wisep;
    console.log('----- Beg Log By Conduit  ------');
    ref = ['Learn', 'Do', 'Share'];
    for (i = 0, len = ref.length; i < len; i++) {
      row = ref[i];
      ref1 = ['Embrace', 'Innovate', 'Encourage'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        col = ref1[j];
        infop = this.getPractice(row, col, 'Info');
        knowp = this.getPractice(row, col, 'Know');
        wisep = this.getPractice(row, col, 'Wise');
        console.log(infop.name, knowp.name, wisep.name);
        ref2 = ['west', 'north', 'east', 'south'];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          dir = ref2[k];
          infod = this.getDir(infop, dir);
          knowd = this.getDir(knowp, dir);
          wised = this.getDir(wisep, dir);
          console.log('    ', infod.name, knowd.name, wised.name);
        }
      }
    }
    console.log('----- End Log By Conduit  ------');
  }

  logByColumn() {
    var col, dir, doit, dprac, i, j, k, learn, len, len1, len2, lprac, pln, prin, ref, ref1, ref2, share, sprac;
    console.log('----- Beg Log By Column  ------');
    ref = ['Embrace', 'Innovate', 'Encourage'];
    for (i = 0, len = ref.length; i < len; i++) {
      col = ref[i];
      console.log(col);
      ref1 = ['west', 'north', 'east', 'south'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        dir = ref1[j];
        prin = this.getPrin(col, 'Core', dir);
        console.log('  ', dir, prin, 'Learn', 'Do', 'Share');
        ref2 = ['Info', 'Know', 'Wise'];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          pln = ref2[k];
          prin = this.getPrin(col, pln, dir);
          lprac = this.getPractice('Learn', col, pln);
          dprac = this.getPractice('Do', col, pln);
          sprac = this.getPractice('Share', col, pln);
          learn = this.getDir(lprac, dir);
          doit = this.getDir(dprac, dir);
          share = this.getDir(sprac, dir);
          console.log('    ', pln + ':', prin, learn.name, doit.name, share.name);
        }
      }
    }
    console.log('----- End Log By Column  ------');
  }

  logAsTable() {
    var col, dir, doit, dprac, i, j, k, learn, len, len1, len2, lprac, obj, pln, prin, ref, ref1, ref2, share, sprac;
    console.log('----- Beg Log As Table  ------');
    ref = ['Embrace', 'Innovate', 'Encourage'];
    for (i = 0, len = ref.length; i < len; i++) {
      col = ref[i];
      console.log(col);
      obj = {};
      ref1 = ['west', 'north', 'east', 'south'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        dir = ref1[j];
        prin = this.getPrin(col, 'Core', dir);
        ref2 = ['Info', 'Know', 'Wise'];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          pln = ref2[k];
          prin = this.getPrin(col, pln, dir);
          lprac = this.getPractice('Learn', col, pln);
          dprac = this.getPractice('Do', col, pln);
          sprac = this.getPractice('Share', col, pln);
          learn = this.getDir(lprac, dir);
          doit = this.getDir(dprac, dir);
          share = this.getDir(sprac, dir);
          obj[pln] = {
            Principle: prin,
            Learn: learn.name,
            Do: doit.name,
            Share: share.name
          };
        }
      }
      // data.push( [ pln, prin, learn.name, doit.name, share.name ] )
      // console.table( data, ['Plane','Principle','Learn', 'Do', 'Share'])
      console.table(obj);
    }
    console.log('----- End Log As Table  ------');
  }

  saveAsHtml(name) {
    var col, dir, doit, dprac, htm, i, j, k, learn, len, len1, len2, lprac, pln, prin, ref, ref1, ref2, share, sprac;
    htm = `<!DOCTYPE html>\n<html lang="en">\n  <head><meta charset="utf-8">\n    <title>${name}</title>`;
    htm += `\n    <link href="${name}.css" rel="stylesheet" type="text/css"/>\n  </head>\n  <body>\n`;
    ref = ['Embrace', 'Innovate', 'Encourage'];
    for (i = 0, len = ref.length; i < len; i++) {
      col = ref[i];
      htm += `    <div class="col">${col}</div>\n`;
      ref1 = ['west', 'north', 'east', 'south'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        dir = ref1[j];
        prin = this.getPrin(col, 'Core', dir);
        htm += "    <table>\n      <thead>\n        ";
        htm += `<tr><th>Plane</th><th>${prin}</th><th>Learn</th><th>Do</th><th>Share</th></tr>\n      </thead>\n      <tbody>\n`;
        ref2 = ['Info', 'Know', 'Wise'];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          pln = ref2[k];
          prin = this.getPrin(col, pln, dir);
          lprac = this.getPractice('Learn', col, pln);
          dprac = this.getPractice('Do', col, pln);
          sprac = this.getPractice('Share', col, pln);
          learn = this.getDir(lprac, dir);
          doit = this.getDir(dprac, dir);
          share = this.getDir(sprac, dir);
          htm += `        <tr><td>${pln}:</td><td>${prin}</td><td>${learn.name}</td><td>${doit.name}</td><td>${share.name}</td></tr>\n`;
        }
        htm += "      </tbody>\n    </table>\n";
      }
    }
    htm += "  </body>\n</html>\n";
    Data.saveHtml(name, htm);
  }

};

/*
getPrevNextPlanes:( plane ) ->

isPractice:( key, plane=@planeName ) ->
@getPractices(plane)[key]?

logAdjacentPractices:() ->
@setAdjacents( @None )
for key, plane of @Planes
practices = @getPractices( key )
for own pkey, p of practices  when Util.isChild(pkey)
  @setAdjacents( p )
 * console.log( { p:key, column:p.column, west:p.west.name, east:p.east.name, north:p.north.name, south:p.south.name, prev:p.prev.name, next:p.next.name } )
return

 */
export default Build;
