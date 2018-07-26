
`import Util     from '../util/Util.js'`
`import Stream   from '../util/Stream.js'`
`import UI       from '../ui/UI.js'`
`import Flavor   from '../jitter/Flavor.js'`
`import Interact from '../jitter/Interact.js'`
`import Summary  from '../jitter/Summary.js'`
`import Roast    from '../jitter/Roast.js'`
`import Drink    from '../jitter/Drink.js'`
`import Body     from '../jitter/Body.js'`
`import Brew     from '../jitter/Brew.js'`
`import World    from '../jitter/World.js'`
`import Region   from '../jitter/Region.js'`
`import User     from '../jitter/User.js'`
`import Prefs    from '../jitter/Prefs.js'`

class Jitter

  Jitter.Tocs = UI.packJSON( 'json/toc.json' )

  @init = () ->
    UI.hasPack = true
    UI.hasTocs = false
    UI.hasLays = false
    UI.local   = "http://localhost:63342/jitter/public/" # Every app needs to change this
    UI.hosted  = "https://jitter-48413.firebaseapp.com/" # Every app needs to change this
    Util.ready ->
      subjects      = ["Ready","Select","Choice","Roast","Region","Prefs","Test"]
      infoSpec      = { subscribe:false, publish:false, subjects:["Select","Choice","Region","Prefs","Test"]}
      Jitter.stream = new Stream( subjects, infoSpec )
      Jitter.ui     = new UI( Jitter.stream, Jitter.Tocs )
      jitter        = new Jitter( Jitter.stream, Jitter.ui )
      jitter.onReady()
      return
    return

  @SpecInteract = {
    Taste:  { type:"pack" }, Flavor:{   type:"pane" }, Summaryt:{ type:"pane" },
    Prepare:{ type:"pack" }, Roast:{    type:"pane" }, Brew:{    type:"pane" }, Drink:{   type:"pane" },
    Body:   { type:"pane" }, Summaryp:{ type:"pane" },
    Maps:   { type:"pack" }, World:{    type:"pane" }, Region:{  type:"pane" }, Summarym:{ type:"pane" } }

  constructor:( @stream, @ui ) ->
    #interact = new Interact( @stream, @ui, "Interact", Jitter.SpecInteract )
    @flavor   = new Flavor(   @stream, @ui, "Flavor"     )
    @summaryt = new Summary(  @stream, @ui, "Summaryt"   )
    @roast    = new Roast(    @stream, @ui, true )
    @drink    = new Drink(    @stream, @ui )
    @body     = new Body(     @stream, @ui )
    @brew     = new Brew(     @stream, @ui )
    @summaryp = new Summary(  @stream, @ui, "Summaryp"   )
    @world    = new World(    @stream, @ui )
    @region   = new Region(   @stream, @ui, @world )
    @summarym = new Summary(  @stream, @ui, "Summarym"   )
    @user     = new User(     @stream, @ )
    @prefs    = new Prefs(    @stream )
    #@stream.subscribe( "Ready", "Jitter", () => @onReady() )

  onReady:() =>
    @ui.pagesReady( 'None' )
    @ui.view.hideAll( 'Interact' )
    #@stream.logBundles()
    select = UI.toTopic( 'Taste', 'Jitter', UI.SelectPack )
    @stream.publish( 'Select', select )

  prefsToSchema:( prefs  ) -> @summary.prefsToSchema( prefs  )
  schemaToPrefs:( schema ) -> @summary.schemaToPrefs( schema )

  @NavbSubjects = ["Search","Contact","Settings","SignOn"]
  @NavbSpecs    = [
    { type:"NavBarLeft" }
    { type:"Item",      name:"Home",   icon:"fa-home", topic:UI.toTopic( "View", 'Navb', UI.SelectView ), subject:"Select" }
    { type:"NavBarEnd" }
    { type:"NavBarRight"}
    { type:"Search",    name:"Search",    icon:"fa-search",      size:"10", topic:'Search',    subject:"Search" }
    { type:"Contact",   name:"Contact",   icon:"fa-user", topic:"http://twitter.com/TheTomFlaherty", subject:"Contact" }
    { type:"Dropdown",  name:"Settings",  icon:"fa-cog", items: [
      { type:"Item",    name:"Preferences", topic:"Preferences", subject:"Settings" }
      { type:"Item",    name:"Connection",  topic:"Connection",  subject:"Settings" }
      { type:"Item",    name:"Privacy",     topic:"Privacy",     subject:"Settings" } ] }
    { type:"SignOn",    name:"SignOn", icon:"fa-sign-in", size:"10", topic:'SignOn', subject:"SignOn" }
    { type:"NavBarEnd"  } ]

Jitter.init()

`export default Jitter`

