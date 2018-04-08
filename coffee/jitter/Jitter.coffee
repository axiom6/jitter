
import Util     from '../util/Util.js'
import Stream   from '../util/Stream.js'
import UI       from '../ui/UI.js'
import Head     from '../jitter/Head.js'
import Flavor   from '../jitter/Flavor.js'
import Interact from '../jitter/Interact.js'
import Choices  from '../jitter/Choices.js'
import Roast    from '../jitter/Roast.js'
import Drink    from '../jitter/Drink.js'
import Body     from '../jitter/Body.js'
import Brew     from '../jitter/Brew.js'
import World    from '../jitter/World.js'
import Region   from '../jitter/Region.js'

export default class Jitter

  @init = () ->
    Util.ready ->
      subjects = ['Select','Choice',"Region"]
      stream   = new Stream( subjects )
      ui       = new UI( stream, "json/toc.json" )
      jitter   = new Jitter( stream, ui )
      Util.noop( jitter  )
      return
    return

  @SpecInteract = { Flavor:{}, Roast:{}, Brew:{}, Drink:{}, Body:{} }

  constructor:( @stream, @ui ) ->
    #head1    = new Head(     @stream, @ui, "Head1" )
    #head2    = new Head(     @stream, @ui, "Head2" )
    @world    = new World(    @stream, @ui )
    @region   = new Region(   @stream, @ui )
    @interact = new Interact( @stream, @ui, "Interact", Jitter.SpecInteract )
    @flavor   = new Flavor(   @stream, @ui )
    @choices  = new Choices(  @stream, @ui )
    @roast    = new Roast(    @stream, @ui )
    @drink    = new Drink(    @stream, @ui )
    @body     = new Body(     @stream, @ui )
    @brew     = new Brew(     @stream, @ui )

#console.log( 'window', window )
Jitter.init()

