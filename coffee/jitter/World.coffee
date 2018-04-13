
`import UI   from '../ui/UI.js'`
`import Dom  from '../ui/Dom.js'`

class World

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
      @subscribe()
      for own name, region of @regions
        region.name   = name
        region.chosen = false
        #console.log( "Region Data", region )
    UI.readJSON( "json/region.json", callback )

  subscribe:() ->
    #@stream.subscribe( 'Choice', (choice) => @onChoice(choice) )
    return

  readyPane:() ->
    src   = "img/region/WorldBelt.png"
    mh    = @pane.toVh(96)
    mw    = @pane.toVw(96)
    $p    = $( """  #{Dom.image(0,0,100,100,src,mh,"","24px",mw)}""" )
    @$img = $p.find('img')
    @$img.click( (event) => @onClick(event) )
    $p

  readyView:() ->
    @readyPane()

  onClick:( event ) =>
    $elem  = $(event.target)
    offset = $elem.offset()
    x = ( event.pageX - offset.left ) * @wImg / $elem.width()
    y = ( event.pageY - offset.top  ) * @hImg / $elem.height()
    region        = @findRegion( x, y )
    region.chosen = not region.chosen
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
    addDel    = if region.chosen then UI.AddChoice else UI.DelChoice
    @spec.num = if region.chosen then @spec.num+1  else @spec.num-1
    #if @spec.num <= @spec.max
    select = UI.select( 'Region', 'World', UI.SelectStudy, region )
    choice = UI.select( 'Region', 'World', addDel,         region.name )
    @stream.publish(    'Region', select )
    @stream.publish(    'Choice', choice ) if @spec.num <= @spec.max
    #else
    #  @spec.num = @spec.num-1
    #  alert( "You can only make #{@spec.max} choices for World" )
    #console.log( 'World.showRegion()', { region:region } )
    return

  onChoice:( choice ) =>
    return if choice.name isnt 'World' or Util.isntStr(choice.study)
    region = @regions(choice.study)
    region.chosen = choice.intent is UI.AddChoice
    @showRegion( region )
    return

`export default World`