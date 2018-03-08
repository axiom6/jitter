
class Aroma

  Jitter.Aroma = Aroma

  constructor:( @stream ) ->
    @wheel = new Vis.Wheel()

  overview:( pane, spec ) ->
    src = "img/aroma/AromaReady.png"
    $e = $( """<div #{Jitter.rel(0, 0,100,100)}></div>""" )
    $e.append( "<h1 #{Jitter.abs(0, 0,100, 10)}>#{spec.name}</h1>" )
    $e.append( """  #{Jitter.abi(0,10,100, 90,src,150)}""" )
    pane.$.append( $e )
    return

  ready:(    pane, spec ) ->
    $e = $(    """<div #{Jitter.rel(0, 0,100,100)}></div>""" )
    $e.append( """<h2  #{Jitter.abs(0, 0,100, 10)}>#{spec.name}</h2>""" )
    $h =    $( """<div #{Jitter.abs(0,10,100, 90)}></div>""" )
    url   = "json/aroma3.json"
    callback = (data) =>
      htm = @html( data.children, 0 )
      $h.append( htm )
      pane.$.append( $e )
      pane.$.append( $h )
    UI.readJSON( url, callback )
    return

  html:( children, pad ) ->
    htm = ""
    for obj in children
      htm += """<div style="padding-left:#{pad}px; font-size:16px; line-height:20px; color:white; text-align:left">#{obj.name}</div>"""
      htm += @html( obj.children, pad+12 ) if obj.children?
    htm


  create:( pane, spec ) ->
    divId = Util.htmlId( "Wheel", "Aroma" )
    url   = "json/aroma4.json"
    pane.$.append( """<div #{Jitter.rel( 0,   0,100,100)} id="#{divId}"></div>""" )
    pane.$.append( """<div #{Jitter.abs(40.5,49, 20, 10)}>Aroma</div>""" )
    @wheel.create( pane, spec, divId, url )
    return
