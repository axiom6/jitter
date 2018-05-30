
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


class Jitter

  @init = () ->
    UI.hasPack = true
    UI.hasPage = false
    UI.hasTocs = false
    UI.hasLays = false
    UI.local   = "http://localhost:63342/jitter/public/" # Every app needs to change this
    UI.hosted  = "https://jitter-48413.firebaseapp.com/" # Every app needs to change this
    Util.ready ->
      subjects = ["Ready","Select","Choice","Roast","Region","Prefs","Test"]
      infoSpec = { subscribe:true, publish:true, subjects:["Select","Choice","Region","Prefs","Test"]}
      stream   = new Stream( subjects, infoSpec )
      ui       = new UI( stream, "json/toc.json", 'Jitter' ) # , Jitter.NavbSpecs
      jitter   = new Jitter( stream, ui )
      Util.noop( jitter )
      return
    return

  @SpecInteract = {
    Taste:  { type:"pack" }, Flavor:{  type:"pane" }, Summary:{ type:"pane" },
    Prepare:{ type:"pack" }, Roast:{   type:"pane" }, Brew:{    type:"pane" }, Drink:{   type:"pane" },
    Body:   { type:"pane" }, Summary:{ type:"pane" },
    Maps:   { type:"pack" }, World:{   type:"pane" }, Region:{  type:"pane" }, Summary:{ type:"pane" } }

  constructor:( @stream, @ui ) ->
    @interact = new Interact( @stream, @ui, "Interact", Jitter.SpecInteract )
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
    @prefs    = @summaryp.initPrefs()
    @stream.subscribe( "Ready", "Jitter", (ready) => @onReady( ready ) )

  onReady:( ready ) =>
    Util.noop( ready )
    @ui.contentReady()
    @ui.view.hideAll( 'Interact' )
    select = UI.toTopic( 'Taste', 'Muse', UI.SelectPack )
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

