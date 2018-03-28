
class Jitter

  @choiceColor = "yellow"
  @hoverColor  = "wheat"
  @basisColor  = "white"
  @opacity     = 0.6

  @init = () ->

    Util.ready ->
      subjects = ['Select','Choice']
      Jitter.stream = new Util.Stream( subjects )
      page          = new Jitter.Page( Jitter.stream )
      ui            = new UI(          Jitter.stream, page )
      Util.noop( ui )
      return

    return

  @panel:( x, y, w, h, align="center" ) ->
    """class="panel" style="position:relative; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; text-align:#{align};" """

  @label:( x, y, w, h, klass="label" ) ->
    """class="#{klass}" style="position:absolute; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; text-align:center;" """

  @image:( x, y, w, h, src, mh, label="", radius="6px" ) ->
    klass  = if src? then "image"            else "texts"
    tstyle = if src? then "padding-top:3px;" else ""                # max-width:#{mh*4}vmin;
    htm  = """<div class="#{klass}" style="position:absolute; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; display:table;">"""
    htm += """<div style="display:table-cell; vertical-align:middle;">"""
    htm += """<img style="display:block; margin-left:auto; margin-right:auto; max-height:#{mh}vmin; border-radius:#{radius};" src="#{src}"/>""" if src?
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

  @doClick:( $e, spec, key, study, event  ) ->
    Util.noop( event )
    if study?.chosen
      study.chosen = false
      $e.css( { color:Jitter.basisColor } )
      choice = UI.select( spec.name, 'Jitter', UI.DelChoice, key )
      choice.$click = $e
      Jitter.stream.publish( 'Choice', choice )
    else
      study.chosen = true
      $e.css( { color:Jitter.choiceColor } )
      choice = UI.select( spec.name, 'Jitter', UI.AddChoice, key )
      choice.$click = $e
      Jitter.stream.publish( 'Choice', choice )    
    return

  @doEnter:( $e, study ) -> $e.css( { color:Jitter.hoverColor } ) if not study?.chosen
  @doLeave:( $e, study ) -> $e.css( { color:Jitter.basisColor } ) if not study?.chosen

  @onEvents:( $e, spec, key, study ) ->
    $e.on( 'click',      (event) -> Jitter.doClick( $e, spec, key, study, event ) )
    $e.on( 'mouseenter', (     ) -> Jitter.doEnter( $e, study ) )
    $e.on( 'mouseleave', (     ) -> Jitter.doLeave( $e, study ) )

  @horz:( pane, spec, imgDir, hpc=1.00, x0=0, y0=0 ) ->
    th = if spec.name is 'Roast' then 18 else 13  # A hack
    $p  = $( """<div   #{Jitter.panel(0, 0,100,100)}></div>""" )
    $p.append(  """<h2 #{Jitter.label(0,th, 10, 90)}>#{spec.name}</h2>""" )
    n  =  Util.lenObject( spec, UI.isChild )
    x  =  x0
    y  =  y0
    dx = (100-x0) / n
    for own key, study of spec when UI.isChild(key)
      src = if study.icon? then imgDir + study.icon else null
      $e  = $( """#{Jitter.image(x,y,dx,100*hpc,src,9*hpc,study.name)}"""  )
      Jitter.onEvents( $e, spec, key, study )
      $p.append( $e )
      x   =   x + dx
    pane.$.append( $p )
    return

  @vert:( pane, spec, imgDir, hpc=1.00, x0=0, y0=0, align="center" ) ->
    $p = $( """<div    #{Jitter.panel(0,0,100,100,align)}></div>""" )
    $p.append( """<div #{Jitter.label(0,3,100, 10)}>#{spec.name}</div>""" )
    n  =  Util.lenObject( spec, UI.isChild )
    x  = x0
    y  = y0
    dy = (100-y0-5) / n
    for own key, study of spec when UI.isChild(key)
      src = if study.icon? then imgDir + study.icon else null
      $e = $( """#{Jitter.image(x,y,100,dy*hpc,src,9*hpc,study.name)}"""  )
      Jitter.onEvents( $e, spec, key, study )
      $p.append( $e )
      y =   y + dy
    pane.$.append( $p )
    return

  @tree:( pane, spec, x0=0, y0=0 ) ->
    $p = $( """<div    #{Jitter.panel(0,0,100,100,"left")}></div>""" )
    $p.append( """<div #{Jitter.label(0,3,100, 10)}>#{spec.name}</div>""" )
    n  =  Util.lenObject( spec, UI.isChild )
    x  = x0
    y  = y0
    dy = (100-y0) / n
    for own key, study of spec when UI.isChild(key)
      study.$e  = $( """#{Jitter.branch(x,y,100,dy,study.name)}"""  )
      study.num = 0
      Jitter.onEvents( study.$e, spec, key, study )
      $p.append( study.$e )
      y =   y + dy
    pane.$.append( $p )
    return