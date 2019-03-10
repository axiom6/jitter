
import Util from '../util/Util.js'
import Dom  from '../ui/Dom.js'
import Base from '../ui/Base.js'

class Body extends Base

  constructor:( stream, ui ) ->
    super(      stream, ui, 'Body' )
    @stream.subscribe( 'Choice', 'Body', (choice) => @onChoice(choice) )
    @btns = {}

  ready:( cname ) =>
    Util.noop( cname )
    Dom.vertBtns( @stream, @spec, @, '../img/body/', 70, 15, 12 )

  onChoice:( choice ) =>
    Dom.onChoice( choice, 'Body', @ )
    return

export default Body
