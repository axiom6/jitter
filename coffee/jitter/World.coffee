
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
    name = @findRegion( x, y )
    console.log( 'World.onClick()', { x:x, y:y, name:name } )
    @showRegion( name )
    return

  findRegion:( x, y ) ->
    abs = Math.abs
    f = { name:"None", x:@wImg, y:@hImg }
    for own  name, r of @regions when r.img?
      if r.x-@dw <= x and x <= r.x+@dw and r.y-@dh <= y and y <= r.y+@dh
        if abs(r.x-x) < abs(f.x-x) and abs(r.y-y) < abs(f.y-y)
         [f.name,f.x,f.y] = [name,r.x, r.y]
    f.name

  showRegion:( name ) ->
    return if name is "None"
    show = UI.select( 'Region', 'World', UI.SelectStudy, name )
    @stream.publish(  'Region', show )
    return

