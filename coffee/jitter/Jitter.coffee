
class Jitter

  @init = () ->

    Util.ready ->
      subjects = ['Select','Choice']
      Jitter.stream = new Util.Stream( subjects )
      page          = new Jitter.Page( Jitter.stream )
      ui            = new UI(          Jitter.stream, page )
      Util.noop( ui )
      return

    return

  @abs:( x, y, w, h ) ->
    """style="position:absolute; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; text-align:center; font-size:24px; color:white;" """

  @abi:( x, y, w, h, src, mh, label="" ) ->
    htm  = """<div style="position:absolute; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; display:table; color:white;">"""
    htm += """<div style="display:table-cell; vertical-align:middle;">"""
    htm += """<img style="display:block; margin-left:auto; margin-right:auto; max-height:#{mh}px;" src="#{src}"/>""" if src?
    htm += """<div style="font-size:14px; padding-top:6px; line-height:16px">#{label}</div>"""  if Util.isStr(label)
    htm += """</div></div>"""
    htm

  @abt:( x, y, w, h, label="" ) ->
    htm  = """<div style="position:absolute; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; display:table; color:white;">"""
    htm += """<div style="font-size:14px; padding-top:2%; line-height:16px;">#{label}</div>"""  if Util.isStr(label)
    htm += """</div>"""
    htm

  @rel:( x, y, w, h, align="center" ) ->
    """style="position:relative; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; text-align:#{align};" """

  @img:( src ) ->
    """<div style="display:table-cell; vertical-align:middle;"><img style="display:block; margin-left:auto; margin-right:auto;" src="#{src}"/></div>"""

  @txt:( ) ->
    """style="color:white; text-align:center;"  """

  @doClick:( $e, spec, key, study, event  ) ->
    Util.noop( event )
    if study?.chosen
      study.chosen = false
      $e.css( { color:"white" } )
      choice = UI.select( spec.name, 'Jitter', UI.DelChoice, key )
      choice.$click = $e
      Jitter.stream.publish( 'Choice', choice )
    else
      study.chosen = true
      $e.css( { color:"yellow" } )
      choice = UI.select( spec.name, 'Jitter', UI.AddChoice, key )
      choice.$click = $e
      Jitter.stream.publish( 'Choice', choice )    
    return

  @doEnter:( $e, study ) -> $e.css( { color:"wheat" } ) if not study?.chosen
  @doLeave:( $e, study ) -> $e.css( { color:"white" } ) if not study?.chosen

  @onEvents:( $e, spec, key, study ) ->
    $e.on( 'click',      (event) -> Jitter.doClick( $e, spec, key, study, event ) )
    $e.on( 'mouseenter', (     ) -> Jitter.doEnter( $e, study ) )
    $e.on( 'mouseleave', (     ) -> Jitter.doLeave( $e, study ) )

  @horz:( pane, spec, imgDir, hpc=1.00, x0=0, y0=0 ) ->
    th = if spec.name is 'Roast' then 18 else 13  # A hack
    $p  = $( """<div   #{Jitter.rel(0, 0,100,100)}></div>""" )
    $p.append(  """<h2 #{Jitter.abs(0,th, 10, 90)}>#{spec.name}</h2>""" )
    n  =  Util.lenObject( spec, UI.isChild )
    x  =  x0
    y  =  y0
    dx = (100-x0) / n
    for own key, study of spec when UI.isChild(key)
      src = if study.icon? then imgDir + study.icon else null
      $e  = $( """#{Jitter.abi(x,y,dx,100*hpc,src,65*hpc,study.name)}"""  )
      Jitter.onEvents( $e, spec, key, study )
      $p.append( $e )
      x   =   x + dx
    pane.$.append( $p )
    return

  @vert:( pane, spec, imgDir, hpc=1.00, x0=0, y0=0, align="center" ) ->
    $p = $( """<div   #{Jitter.rel(0,0,100,100,align)}></div>""" )
    $p.append( """<h2 #{Jitter.abs(0,0,100, 10)}>#{spec.name}</h2>""" )
    n  =  Util.lenObject( spec, UI.isChild )
    x  = x0
    y  = y0
    dy = (100-y0-5) / n
    for own key, study of spec when UI.isChild(key)
      src = if study.icon? then imgDir + study.icon else null
      $e = $( """#{Jitter.abi(x,y,100,dy*hpc,src,65*hpc,study.name)}"""  )
      Jitter.onEvents( $e, spec, key, study )
      $p.append( $e )
      y =   y + dy
    pane.$.append( $p )
    return

  @tree:( pane, spec, x0=0, y0=0 ) ->
    $p = $( """<div   #{Jitter.rel(0,0,100,100,"left")}></div>""" )
    $p.append( """<h2 #{Jitter.abs(0,0,100, 10)}>#{spec.name}</h2>""" )
    n  =  Util.lenObject( spec, UI.isChild )
    x  = x0
    y  = y0
    dy = (100-y0) / n
    for own key, study of spec when UI.isChild(key)
      study.$e  = $( """#{Jitter.abt(x,y,100,dy,study.name)}"""  )
      study.num = 0
      Jitter.onEvents( study.$e, spec, key, study )
      $p.append( study.$e )
      y =   y + dy
    pane.$.append( $p )
    return