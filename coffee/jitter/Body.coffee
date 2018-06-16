
`import Dom  from '../ui/Dom.js'`
`import Base from '../ui/Base.js'`

class Body extends Base

  constructor:( stream, ui ) ->
    super( ui, stream, 'Body' )
    @stream.subscribe( 'Choice', 'Body', (choice) => @onChoice(choice) )
    @btns = {}

  ready:() =>
    Dom.vertBtns( @stream, @spec, @, 'img/body/', 70, 15, 12 )

  onChoice:( choice ) =>
    Dom.onChoice( choice, 'Body', @ )
    return

`export default Body`
