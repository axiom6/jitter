import Util from '../util/Util.js';
import UI   from '../ui/UI.js';
var Prefs,
  hasProp = {}.hasOwnProperty;

Prefs = class Prefs {
  constructor(stream) {
    this.onChoice = this.onChoice.bind(this);
    // Tests can be initiated after all ready() call have completed
    this.onTest = this.onTest.bind(this);
    // Publish all preference choices
    this.onPrefs = this.onPrefs.bind(this);
    this.stream = stream;
    this.subscribe();
    this.choices = this.initChoices();
    this.id = '';
    this.name = '';
    this.email = '';
  }

  initChoices() {
    return {
      Flavor: {
        array: [],
        beg: -1,
        end: -1,
        max: 3
      },
      Roast: {
        array: [],
        beg: -1,
        end: -1,
        max: 3
      },
      Brew: {
        array: [],
        beg: -1,
        end: -1,
        max: 3
      },
      Drink: {
        array: [],
        beg: -1,
        end: -1,
        max: 3
      },
      Body: {
        array: [],
        beg: -1,
        end: -1,
        max: 3
      },
      Region: {
        array: [],
        beg: -1,
        end: -1,
        max: 3
      }
    };
  }

  subscribe() {
    this.stream.subscribe('Choice', 'Prefs', (choice) => {
      return this.onChoice(choice);
    });
    this.stream.subscribe('Prefs', 'Prefs', (prefs) => {
      return this.onPrefs(prefs);
    });
    this.stream.subscribe('Test', 'Prefs', (test) => {
      return this.onTest(test);
    });
  }

  onChoice(choice) {
    var name, value;
    if (choice.source === 'Prefs') {
      return;
    }
    if (this.stream.isInfo('Choice')) {
      console.info('Prefs.onChoice()', choice);
    }
    name = choice.name;
    value = choice.study;
    if (choice.intent === UI.AddChoice) {
      this.addChoice(name, value);
    } else if (choice.intent === UI.DelChoice) {
      this.delChoice(name, value);
    }
  }

  addChoice(name, value) {
    var choice;
    choice = this.choices[name];
    choice.array.push(value);
    choice.end++;
    // Delect the beginning choice if over max by publishing del and incrementing the beg index
    if (choice.end - choice.beg >= choice.max) {
      this.pubChoice(name, choice.array[choice.beg], UI.DelChoice);
      choice.beg++;
    }
  }

  delChoice(name, value) {
    var choice, index;
    choice = this.choices[name];
    index = choice.array.indexOf(value);
    if (choice.beg <= index && index <= choice.end) {
      choice.array.splice(index, 1);
      choice.end--;
    }
  }

  pubChoice(name, value, addDel) {
    var choice;
    if (this.stream.isInfo('Choice')) {
      console.info('Prefs.pubChoice()', {
        name: name,
        value: value,
        addDel: addDel
      });
    }
    choice = UI.toTopic(name, 'Prefs', addDel, value);
    this.stream.publish('Choice', choice);
  }

  onTest(testName) {
    if (testName === 'testPrefArrays') {
      this.onPrefs(this.testPrefArrays());
    }
  }

  onPrefs(prefs) {
    if (this.stream.isInfo('Prefs')) {
      console.info('Prefs.onPrefs()', prefs);
    }
    this.id = prefs.id;
    this.name = prefs.name;
    this.email = prefs.email;
    this.delChoices();
    this.addArrays(prefs.arrays);
  }

  addArrays(arrays) {
    var array, i, len, name, value;
    this.choices = this.initChoices();
    for (name in arrays) {
      if (!hasProp.call(arrays, name)) continue;
      array = arrays[name];
      for (i = 0, len = array.length; i < len; i++) {
        value = array[i];
        this.addChoice(name, value);
        this.pubChoice(name, value, UI.AddChoice);
      }
    }
  }

  delChoices() {
    var choice, i, len, name, ref, ref1, value;
    ref = this.choices;
    for (name in ref) {
      if (!hasProp.call(ref, name)) continue;
      choice = ref[name];
      ref1 = choice.array;
      for (i = 0, len = ref1.length; i < len; i++) {
        value = ref1[i];
        this.delChoice(name, value);
        this.pubChoice(name, value, UI.DelChoice);
      }
    }
    this.choices = {}; // Not really needed
  }

  testPrefArrays() {
    var prefs;
    prefs = {};
    prefs.id = '1';
    prefs.name = 'Human Made';
    prefs.email = 'customer@gmail.com';
    prefs.arrays = {
      Flavor: ['Chocolate', 'Nutty'],
      Roast: ['Medium'],
      Brew: ['AutoDrip'],
      Drink: ['Black'],
      Body: ['Full'],
      Region: ['Brazil']
    };
  }

  toSchema() {
    var schema;
    schema = {};
    schema.id = this.id;
    schema.name = this.name;
    schema.email = this.email;
    schema.meta = this.toMeta();
    return schema;
  }

  toMeta() {
    var choice, i, key, len, meta, ref, ref1, value;
    meta = {}; // Need to see if meta object is correct
    ref = this.choices;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      choice = ref[key];
      meta[key] = [];
      ref1 = choice.array;
      for (i = 0, len = ref1.length; i < len; i++) {
        value = ref1[i];
        meta[key].push(value);
      }
    }
    return meta;
  }

  fromSchema(schema) {
    var prefs;
    prefs = {};
    prefs.id = schema.id;
    prefs.name = schema.name;
    prefs.choices = this.fromMeta(schema.meta);
    prefs.schema = schema; // For reviewing data
    return prefs;
  }

  fromMeta(metas) {
    var choices, key, meta;
    choices = {};
    for (key in metas) {
      if (!hasProp.call(metas, key)) continue;
      meta = metas[key];
      choices[meta.key] = meta.key;
    }
    return choices;
  }

};

export default Prefs;
