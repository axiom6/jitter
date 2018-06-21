import Util     from '../util/Util.js';
import Stream   from '../util/Stream.js';
import UI       from '../ui/UI.js';
import Flavor   from '../jitter/Flavor.js';
import Interact from '../jitter/Interact.js';
import Summary  from '../jitter/Summary.js';
import Roast    from '../jitter/Roast.js';
import Drink    from '../jitter/Drink.js';
import Body     from '../jitter/Body.js';
import Brew     from '../jitter/Brew.js';
import World    from '../jitter/World.js';
import Region   from '../jitter/Region.js';
import User     from '../jitter/User.js';
import Prefs    from '../jitter/Prefs.js';
var Jitter;

Jitter = (function() {
  class Jitter {
    static init() {
      UI.hasPack = true;
      UI.hasTocs = false;
      UI.hasLays = false;
      UI.local = "http://localhost:63342/jitter/public/"; // Every app needs to change this
      UI.hosted = "https://jitter-48413.firebaseapp.com/"; // Every app needs to change this
      Util.ready(function() {
        var infoSpec, subjects;
        subjects = ["Ready", "Select", "Choice", "Roast", "Region", "Prefs", "Test"];
        infoSpec = {
          subscribe: false,
          publish: false,
          subjects: ["Select", "Choice", "Region", "Prefs", "Test"]
        };
        Jitter.stream = new Stream(subjects, infoSpec);
        Jitter.stream.subscribe("Ready", "Jitter", () => {
          return Jitter.onUI();
        });
        Jitter.ui = new UI(Jitter.stream, "json/toc.json", 'Jitter');
      });
    }

    static onUI() {
      var jitter;
      jitter = new Jitter(Jitter.stream, Jitter.ui);
      jitter.onReady();
    }

    constructor(stream, ui) {
      //@stream.subscribe( "Ready", "Jitter", () => @onReady() )
      this.onReady = this.onReady.bind(this);
      this.stream = stream;
      this.ui = ui;
      //interact = new Interact( @stream, @ui, "Interact", Jitter.SpecInteract )
      this.flavor = new Flavor(this.stream, this.ui, "Flavor");
      this.summaryt = new Summary(this.stream, this.ui, "Summaryt");
      this.roast = new Roast(this.stream, this.ui, true);
      this.drink = new Drink(this.stream, this.ui);
      this.body = new Body(this.stream, this.ui);
      this.brew = new Brew(this.stream, this.ui);
      this.summaryp = new Summary(this.stream, this.ui, "Summaryp");
      this.world = new World(this.stream, this.ui);
      this.region = new Region(this.stream, this.ui, this.world);
      this.summarym = new Summary(this.stream, this.ui, "Summarym");
      this.user = new User(this.stream, this);
      this.prefs = new Prefs(this.stream);
    }

    onReady() {
      var select;
      this.ui.pagesReady('None');
      this.ui.view.hideAll('Interact');
      //@stream.logBundles()
      select = UI.toTopic('Taste', 'Jitter', UI.SelectPack);
      return this.stream.publish('Select', select);
    }

    prefsToSchema(prefs) {
      return this.summary.prefsToSchema(prefs);
    }

    schemaToPrefs(schema) {
      return this.summary.schemaToPrefs(schema);
    }

  };

  Jitter.SpecInteract = {
    Taste: {
      type: "pack"
    },
    Flavor: {
      type: "pane"
    },
    Summaryt: {
      type: "pane"
    },
    Prepare: {
      type: "pack"
    },
    Roast: {
      type: "pane"
    },
    Brew: {
      type: "pane"
    },
    Drink: {
      type: "pane"
    },
    Body: {
      type: "pane"
    },
    Summaryp: {
      type: "pane"
    },
    Maps: {
      type: "pack"
    },
    World: {
      type: "pane"
    },
    Region: {
      type: "pane"
    },
    Summarym: {
      type: "pane"
    }
  };

  Jitter.NavbSubjects = ["Search", "Contact", "Settings", "SignOn"];

  Jitter.NavbSpecs = [
    {
      type: "NavBarLeft"
    },
    {
      type: "Item",
      name: "Home",
      icon: "fa-home",
      topic: UI.toTopic("View",
    'Navb',
    UI.SelectView),
      subject: "Select"
    },
    {
      type: "NavBarEnd"
    },
    {
      type: "NavBarRight"
    },
    {
      type: "Search",
      name: "Search",
      icon: "fa-search",
      size: "10",
      topic: 'Search',
      subject: "Search"
    },
    {
      type: "Contact",
      name: "Contact",
      icon: "fa-user",
      topic: "http://twitter.com/TheTomFlaherty",
      subject: "Contact"
    },
    {
      type: "Dropdown",
      name: "Settings",
      icon: "fa-cog",
      items: [
        {
          type: "Item",
          name: "Preferences",
          topic: "Preferences",
          subject: "Settings"
        },
        {
          type: "Item",
          name: "Connection",
          topic: "Connection",
          subject: "Settings"
        },
        {
          type: "Item",
          name: "Privacy",
          topic: "Privacy",
          subject: "Settings"
        }
      ]
    },
    {
      type: "SignOn",
      name: "SignOn",
      icon: "fa-sign-in",
      size: "10",
      topic: 'SignOn',
      subject: "SignOn"
    },
    {
      type: "NavBarEnd"
    }
  ];

  return Jitter;

}).call(this);

Jitter.init();

export default Jitter;
