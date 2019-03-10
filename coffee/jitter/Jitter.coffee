
import Util     from '../util/Util.js'
import Data     from '../util/Data.js'
import Build    from '../prac/Build.js'
import Stream   from '../util/Stream.js'
import UI       from '../ui/UI.js'
import Flavor   from '../jitter/Flavor.js'
import Interact from '../jitter/Interact.js'
import Summary  from '../jitter/Summary.js'
import Roast    from '../jitter/Roast.js'
import Drink    from '../jitter/Drink.js'
import Body     from '../jitter/Body.js'
import Brew     from '../jitter/Brew.js'
import World    from '../jitter/World.js'
import Region   from '../jitter/Region.js'
import User     from '../jitter/User.js'
import Prefs    from '../jitter/Prefs.js'

class Jitter

  Data.local  = "http://localhost:63342/muse/public/"
  Data.hosted = "https://ui-48413.firebaseapp.com/"
  Data.asyncJSON( "json/jitter/toc.json", Jitter.init )

  @init = ( data ) ->
    Jitter.Tocs = Build.createPacks( data )
    UI.hasPack  = true
    UI.hasTocs  = false
    UI.hasLays  = false
    Util.ready ->
      subjects      = ["Ready","Select","Choice","Roast","Region","Prefs","Test"]
      infoSpec      = { subscribe:false, publish:false, subjects:subjects }
      Jitter.stream = new Stream( subjects, infoSpec )
      Jitter.ui     = new UI( Jitter.stream, Jitter.Tocs )
      jitter        = new Jitter( Jitter.stream, Jitter.ui )
      jitter.onReady()
      return
    return

  Jitter.SpecInteract = {
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
    Util.noop( @drink, @brew, @summaryt, @summaryp, @summarym, @prefs, Jitter.SpecInteract, Jitter.NavbSubjects, Jitter.NavbSpecs )
    #@stream.subscribe( "Ready", "Jitter", () => @onReady() )

  onReady:() =>
    @ui.pagesReady( 'None' )
    @ui.view.hideAll( 'Interact' )
    #@stream.logBundles()
    select = UI.toTopic( 'Taste', 'Jitter', UI.SelectPack )
    @stream.publish( 'Select', select )

  prefsToSchema:( prefs  ) -> @summary.prefsToSchema( prefs  )
  schemaToPrefs:( schema ) -> @summary.schemaToPrefs( schema )

  Jitter.NavbSubjects = ["Search","Contact","Settings","SignOn"]
  Jitter.NavbSpecs    = [
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

export default Jitter

