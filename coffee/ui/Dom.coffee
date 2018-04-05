
import Util    from '../util/Util.js'
import UI      from '../ui/UI.js'

export default class Dom

  @choiceColor = "yellow"
  @hoverColor  = "wheat"
  @basisColor  = "white"
  @opacity     = 0.6

  @panel:( x, y, w, h, align="center" ) ->
    """class="panel" style="position:relative; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; text-align:#{align};" """

  @label:( x, y, w, h, klass="label" ) ->
    """class="#{klass}" style="position:absolute; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; text-align:center;" """

  @image:( x, y, w, h, src, mh, label="", radius="6px", mw=60 ) ->
    klass  = if src? then "image"            else "texts"
    tstyle = if src? then "padding-top:3px;" else ""                # max-width:#{mh*4}vmin;
    htm  = """<div class="#{klass}" style="position:absolute; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; display:table;">"""
    htm += """<div style="display:table-cell; vertical-align:middle;">"""
    htm += """<img style="display:block; margin-left:auto; margin-right:auto; max-height:#{mh}vmin; max-width:#{mw}vmin; border-radius:#{radius};" src="#{src}"/>""" if src?
    htm += """<div style="#{tstyle}">#{label}</div>"""  if Util.isStr(label)
    htm += """</div></div>"""
    htm

  @branch:( x, y, w, h, label="" ) ->
    htm  = """<div class="branch" style="position:absolute; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; display:table;">"""
    htm += """<div <div style="">#{label}</div>"""  if Util.isStr(label)
    htm += """</div>"""
    htm

  @img:( src ) ->
    """<div class="img" style="display:table-cell; vertical-align:middle;"><img style="display:block; margin-left:auto; margin-right:auto;" src="#{src}"/></div>"""

  @txt:( str ) ->
    """<div class="txt"">#{str}</div>"""

  @doClick:( stream, $e, spec, key, study, event  ) ->
    Util.noop( event )
    if study?.chosen
      study.chosen = false
      $e.css( { color:Dom.basisColor } )
      choice = UI.select( spec.name, 'Dom', UI.DelChoice, key )
      choice.$click = $e
      stream.publish( 'Choice', choice )
    else
      study.chosen = true
      $e.css( { color:Dom.choiceColor } )
      choice = UI.select( spec.name, 'Dom', UI.AddChoice, key )
      choice.$click = $e
      stream.publish( 'Choice', choice )
    return

  @doEnter:( $e, study ) -> $e.css( { color:Dom.hoverColor } ) if not study?.chosen
  @doLeave:( $e, study ) -> $e.css( { color:Dom.basisColor } ) if not study?.chosen

  @onEvents:( stream, $e, spec, key, study ) ->
    $e.on( 'click',      (event) -> Dom.doClick( stream, $e, spec, key, study, event ) )
    $e.on( 'mouseenter', (     ) -> Dom.doEnter( $e, study ) )
    $e.on( 'mouseleave', (     ) -> Dom.doLeave( $e, study ) )

  @horz:( stream, spec, imgDir, hpc=1.00, x0=0, y0=0 ) ->
    th = if spec.name is 'Roast' then 18 else 13  # A hack
    $p  = $( """<div   #{Dom.panel(0, 0,100,100)}></div>""" )
    $p.append(  """<h2 #{Dom.label(0,th, 10, 90)}>#{spec.name}</h2>""" )
    n  =  Util.lenObject( spec, UI.isChild )
    x  =  x0
    y  =  y0
    dx = (100-x0) / n
    for own key, study of spec when UI.isChild(key)
      src = if study.icon? then imgDir + study.icon else null
      $e  = $( """#{Dom.image(x,y,dx,100*hpc,src,9*hpc,study.name)}"""  )
      Dom.onEvents( stream, $e, spec, key, study )
      $p.append( $e )
      x   =   x + dx
    $p

  @vert:( stream, spec, imgDir, hpc=1.00, x0=0, y0=0, align="center" ) ->
    $p = $( """<div    #{Dom.panel(0,0,100,100,align)}></div>""" )
    $p.append( """<div #{Dom.label(0,3,100, 10)}>#{spec.name}</div>""" )
    n  =  Util.lenObject( spec, UI.isChild )
    x  = x0
    y  = y0
    dy = (100-y0-5) / n
    for own key, study of spec when UI.isChild(key)
      src = if study.icon? then imgDir + study.icon else null
      $e = $( """#{Dom.image(x,y,100,dy*hpc,src,9*hpc,study.name)}"""  )
      Dom.onEvents( stream, $e, spec, key, study )
      $p.append( $e )
      y =   y + dy
    $p


  @tree:( stream, spec, x0=0, y0=0 ) ->
    $p = $( """<div    #{Dom.panel(0,0,100,100,"left")}></div>""" )
    $p.append( """<div #{Dom.label(0,3,100, 10)}>#{spec.name}</div>""" )
    n  =  Util.lenObject( spec, UI.isChild )
    x  = x0
    y  = y0
    dy = (100-y0) / n
    for own key, study of spec when UI.isChild(key)
      study.$e  = $( """#{Dom.branch(x,y,100,dy,study.name)}"""  )
      study.num = 0
      Dom.onEvents( stream, study.$e, spec, key, study )
      $p.append( study.$e )
      y =   y + dy
    $p
