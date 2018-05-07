
`import Util     from '../util/Util.js'`
`import Stream   from '../util/Stream.js'`
`import UI       from '../ui/UI.js'`
`import Head     from '../jitter/Head.js'`
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
    Util.ready ->
      subjects = ["Select","Choice","Region","Prefs","Test"]
      subjects = subjects.concat(Jitter.NavbSubjects) if Jitter.NavbSpecs?
      infoSpec = { subscribe:false, publish:false, subjects:["Select","Choice","Region","Prefs","Test"]}
      stream   = new Stream( subjects, infoSpec )
      ui       = new UI( stream, "json/toc.json" ) # , Jitter.NavbSpecs
      jitter   = new Jitter( stream, ui )
      Util.noop( jitter )
      return
    return

  testUser:( user ) ->
    #user.listUsers()
    #user.getPrefs()
    #prefs = user.genPrefs()
    #user.postPrefs( prefs )
    Util.noop( user )
    return

  @SpecInteract = {
    Maps:    { type:"group" }, World:{  type:"pane" }, Region:{ type:"pane" }, Flavors:{ type:"pane" },
    Taste:   { type:"group" }, Flavor:{ type:"pane" }, Roast:{  type:"pane" }, Summary:{ type:"pane" },
    Prepare: { type:"group" }, Brew:{   type:"pane" }, Drink:{  type:"pane" }, Body:   { type:"pane" }, Summary:{ type:"pane" } }

  constructor:( @stream, @ui ) ->
    @world    = new World(    @stream, @ui )
    @region   = new Region(   @stream, @ui, @world )
    @interact = new Interact( @stream, @ui, "Interact", Jitter.SpecInteract )
    @flavor   = new Flavor(   @stream, @ui, "Flavor"   )
    @flavors  = new Flavor(   @stream, @ui, "Flavors"  )
    @summary  = new Summary(  @stream, @ui, "Summary", @ )
    @summarys = new Summary(  @stream, @ui, "Summarys"   ) # @jitter only passed to primary Summary
    @roast    = new Roast(    @stream, @ui )
    @drink    = new Drink(    @stream, @ui )
    @body     = new Body(     @stream, @ui )
    @brew     = new Brew(     @stream, @ui )
    @user     = new User(     @stream, @ )
    @prefs    = @summary.initPrefs()

  prefsToSchema:( prefs  ) -> @summary.prefsToSchema( prefs  )
  schemaToPrefs:( schema ) -> @summary.schemaToPrefs( schema )

  @NavbSubjects = ["Search","Contact","Settings","SignOn"]
  @NavbSpecs    = [
    { type:"NavBarLeft" }
    { type:"Item",      name:"Home",   icon:"fa-home", topic:UI.select( "View", 'Navb', UI.SelectView ), subject:"Select" }
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

