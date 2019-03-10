
import Util from '../util/Util.js'
import Dom  from '../ui/Dom.js'
import Base from '../ui/Base.js'

class Drink extends Base

  constructor:( stream, ui ) ->
    super(      stream, ui, 'Drink' )
    @stream.subscribe( 'Choice', 'Drink', (choice) => @onChoice(choice) )
    @btns = {}

  ready:( cname ) =>
    Util.noop( cname )
    Dom.vertBtns( @stream, @spec, @, '../img/drink/', 80, 10, 12 )

  onChoice:( choice ) =>
    Dom.onChoice( choice, 'Drink', @ )
    return

export default Drink
