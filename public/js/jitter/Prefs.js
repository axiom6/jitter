var Prefs,
  hasProp = {}.hasOwnProperty;

import UI from '../ui/UI.js';

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
        beg: 0,
        end: -1,
        max: 3
      },
      Roast: {
        array: [],
        beg: 0,
        end: -1,
        max: 3,
        extras: []
      },
      Brew: {
        array: [],
        beg: 0,
        end: -1,
        max: 3
      },
      Drink: {
        array: [],
        beg: 0,
        end: -1,
        max: 3
      },
      Body: {
        array: [],
        beg: 0,
        end: -1,
        max: 3
      },
      Region: {
        array: [],
        beg: 0,
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
    var extra, name, value;
    if (choice.source === 'Prefs') {
      return;
    }
    //console.info( 'Prefs.onChoice()', choice ) if @stream.isInfo('Choice') let Summary log choices
    name = choice.name;
    value = choice.study;
    if (choice.value) {
      extra = choice.value;
    }
    if (choice.intent === UI.AddChoice) {
      this.addChoice(name, value, extra);
    } else if (choice.intent === UI.DelChoice) {
      this.delChoice(name, value);
    }
  }

  addChoice(name, value, extra = void 0) {
    var choice, extraPub;
    choice = this.choices[name];
    choice.array.push(value);
    if ((choice.extras != null) && (extra != null)) {
      choice.extras.push(extra);
    }
    choice.end++;
    // Delect the beginning choice if over max by publishing del and incrementing the beg index
    if (choice.end - choice.beg >= choice.max) {
      extraPub = choice.extras != null ? choice.extras[choice.beg] : void 0;
      this.pubChoice(name, choice.array[choice.beg], UI.DelChoice, extraPub);
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

  pubChoice(name, value, addDel, extra = void 0) {
    var choice;
    //console.info( 'Prefs.pubChoice()', { name:name, value:value, addDel:addDel, extra:extra } ) if @stream.isInfo('Choice')
    choice = UI.toTopic(name, 'Prefs', addDel, value);
    if (extra) {
      choice.value = extra;
    }
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

};

/*

toMeta:() ->
meta = {} # Need to see if meta object is correct
for own key, choice of @choices
meta[key] = []
for value in choice.array
  meta[key].push( value )
meta

fromMeta:( metas ) ->
choices = {}
for own key, meta of metas
choices[meta.key] = meta.key
choices

toSchema:() ->
schema       = {}
schema.id    = @id
schema.name  = @name
schema.email = @email
schema.meta  = @toMeta()
schema

fromSchema:( schema ) ->
prefs         = {}
prefs.id      = schema.id
prefs.name    = schema.name
prefs.choices = @fromMeta( schema.meta )
prefs.schema  = schema      # For reviewing data
prefs

*/
export default Prefs;
