
class Aroma

  Jitter.Aroma = Aroma

  constructor:( @stream ) ->
    @wheel = new Vis.Wheel()

  overview:( pane, spec ) ->
    src = "img/aroma/AromaReady.png"
    $e = $( """<div #{Jitter.panel(0, 0,100,100)}></div>""" )
    $e.append( "<h1 #{Jitter.label(0, 0,100, 10)}>#{spec.name}</h1>" )
    $e.append( """  #{Jitter.image(0,10,100, 90,src,150)}""" )
    pane.$.append( $e )
    return

  ready:(   pane, spec ) ->
    @pane = pane
    @spec = spec
    pane.$.append( """<div #{Jitter.panel(0, 0,100,100)}></div>""" )
    pane.$.append( """<div #{Jitter.label(0, 2,100, 10)}>#{spec.name}</div>""" )
    $tree =     $( """<div #{Jitter.label(0, 7,100, 87)}></div>""" )
    url   = "json/aroma3.json"
    callback = (data) =>
      @html( $tree, data.children, 16, 1 )
      pane.$.append( $tree )
    UI.readJSON( url, callback )
    return

  html:( $p, children, pad, level ) ->
    for obj in children
      $d  = $("""<div class="branch" style="padding-left:#{pad}px; text-align:left">#{obj.name}</div>""")
      study = { name:obj.name, chosen:false }
      Jitter.onEvents( $d, @spec, obj.name, study ) if level is 2
      $p.append( $d )
      @html( $p, obj.children, pad+12, level+1 ) if obj.children?
    return

  create:( pane, spec ) ->
    divId = Util.htmlId( "Wheel", "Aroma" )
    url   = "json/aroma4.json"
    pane.$.append( """<div #{Jitter.panel( 0,   0,100,100)} id="#{divId}"></div>""" )
    pane.$.append( """<div #{Jitter.label(40.5,49, 20, 10)}>Aroma</div>""")
    @wheel.create( pane, spec, divId, url )
    return
