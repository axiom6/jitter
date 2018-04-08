
import UI  from '../ui/UI.js'
import Dom from '../ui/Dom.js'

export default class World

  constructor:( @stream, @ui ) ->
    @ui.addContent( 'World', @ )
    @$img = $()
    @wImg = 1785
    @hImg =  399
    @dw   =   50
    @dh   =   50
    @regions = {}
    callback =  (data) =>
      @regions = data
      for own name, region of @regions
        region.name = name
        #console.log( "Region Data", region )
    UI.readJSON( "json/region.json", callback )

  readyPane:() ->
    src   = "img/region/WorldBelt.png"
    $p    = $( """  #{Dom.image(0,0,100,100,src,30,"","24px",180)}""" )
    @$img = $p.find('img')
    @$img.click( (event) => @onClick(event) )
    $p

  readyView:() ->
    @readyPane()

  onClick:( event ) =>
    $elem  = $(event.target)
    offset = $elem.parent().offset()
    x = ( event.pageX - offset.left ) * @wImg / $elem.width()
    y = ( event.pageY - offset.top  ) * @hImg / $elem.height()
    region = @findRegion( x, y )
    console.log( 'World.onClick()', { x:x, y:y, region:region } )
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
    select = UI.select( 'Region', 'World', UI.SelectStudy, region )
    @stream.publish(    'Region', select )
    return

