
class Logo

  Jitter.Logo = Logo

  constructor:( @stream ) ->
    @chosen     = false
    @$wheelLogo = null
    @src = "img/logo/JitterBoxLogo.png"

  overview:(   pane, spec ) ->
    Util.noop( pane, spec )
    return

  ready:(      pane, spec ) ->
    Util.noop( spec )
    pane.$.append( """<div #{Jitter.panel(0,0,100,100)}></div>""" )
    $img   =    $( """     #{Jitter.image(0,0,100,100,@src,15,"","24px")}""" )
    $img.on( 'click', (event) => @doClick(event) )
    pane.$.append( $img )
    return

  doClick:( event ) =>
    Util.noop( event )
    wheel = Jitter.page.flavor.wheel
    @chosen = if @chosen then false else true
    if @chosen
      wheel.$div.hide()
      if not @$wheelLogo?
        mh = wheel.pane.geo.h * 0.12
        mw = wheel.pane.geo.w * 0.10
        htm  = """<div style="display:table; width:100%; height:100%;">"""
        htm += """<div style="display:table-cell; vertical-align:middle;">"""
        htm += """<img style="display:block; margin-left:auto; margin-right:auto; max-width:#{mw}vmin; max-height:#{mh}vmin; border-radius:24px;" src="#{@src}"/>"""
        htm += """</div></div>"""
        @$wheelLogo = $( htm )
        wheel.pane.$.append( @$wheelLogo )
      else
        @$wheelLogo.show() if @$wheelLogo?
    else
      @$wheelLogo.hide()   if @$wheelLogo?
      wheel.$div.show()
    return

  create:(     pane, spec ) ->
    Util.noop( pane, spec )
    return