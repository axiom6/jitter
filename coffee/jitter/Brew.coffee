
import Util from '../util/Util.js'
import Dom  from '../ui/Dom.js'
import Base from '../ui/Base.js'

class Brew extends Base

  constructor:( stream, ui ) ->
    super(      stream, ui, 'Brew' )
    @stream.subscribe( 'Choice', 'Brew', (choice) => @onChoice(choice) )
    @btns = {}

  ready:( cname ) =>
    Util.noop( cname )
    Dom.vertBtns( @stream, @spec, @, '../img/brew/', 80, 10, 12 )

  onChoice:( choice ) =>
    Dom.onChoice( choice, 'Brew', @ )
    return

export default Brew


