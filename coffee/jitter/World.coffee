
import Util  from '../util/Util.js'
import Data  from '../util/Data.js'
import UI    from '../ui/UI.js'
import Dom   from '../ui/Dom.js'
import Base  from '../ui/Base.js'

class World extends Base

  constructor:( stream, ui ) ->
    super(      stream, ui, 'World' )
    @$img = $()
    @wImg = 1785
    @hImg =  399
    @dw   =   50
    @dh   =   50
    @regions = {}
    callback =  (data) =>
      @regions = data
      @subscribe()
      for own name, region of @regions
        region.name   = name
        region.chosen = false
        region.source = 'World'
        #console.log( "Region Data", region )
    Data.asyncJSON( "json/jitter/region.json", callback )
    Util.noop( @$img )

  subscribe:() ->
    #@stream.subscribe( 'Choice', (choice) => @onChoice(choice) )
    return

  ready:( cname ) ->
    Util.noop( cname )
    src   = "../img/region/WorldBelt.png"
    $p    = $( """  #{Dom.image(src,90,96,"","24px")}""" )
    @$img = $p.find('img')
    @$img.click( (event) => @onClick(event) )
    $p

  onClick:( event ) =>
    $elem  = $(event.target)
    offset = $elem.offset()
    x = ( event.pageX - offset.left ) * @wImg / $elem.width()
    y = ( event.pageY - offset.top  ) * @hImg / $elem.height()
    region        = @findRegion( x, y )
    region.chosen = not region.chosen
    region.source = 'World'
    #console.log( 'World.onClick()', { x:x, y:y, w:$elem.width(), h:$elem.height(), l:offset.left, t:offset.top, region:region } )
    @showRegion( region )
    return

  findRegion:( x, y ) ->
    abs = Math.abs
    f   = @regions['None']
    for own name, r of @regions
      if r.x-@dw <= x and x <= r.x+@dw and r.y-@dh <= y and y <= r.y+@dh
        dr = abs(r.x-x) + abs(r.y-y)
        df = abs(f.x-x) + abs(f.y-y)
        [f.name,f.x,f.y] = [name,r.x, r.y] if dr < df
    @regions[f.name]

  showRegion:( region ) ->
    return if  region.name is "None"
    @stream.publish( 'Region', region )
    return

  onChoice:( choice ) =>
    return if choice.name isnt 'World' or Util.isntStr(choice.study)
    region = @regions[choice.study]
    region.chosen = choice.intent is UI.AddChoice
    region.source = choice.source
    @showRegion( region )
    return

`export default World`