
import Util from '../util/Util.js'
import UI   from '../ui/UI.js'
import Dom  from '../ui/Dom.js'

export default class Interact

  constructor:( @stream, @ui, @name, @specInteract ) ->
    @ui.addContent( @name, @ )

  readyPane:() ->
    @spec = @specInteract # Qverride?
    #console.log( 'Interact.readyPane()', @spec )
    @horz(  )

  horz:() ->
    #console.log( 'Pane', @pane.width, @pane.height )
    $p = $( """<div class="panel" style="position:relative; left:0; top: 0;  width:100%; height:100%; text-align:center;"></div>""" )
    $p.append( """<hr             style="position:absolute; left:0; top:42%; width:100%; height:  2%; z-index:1;"></hr>"""  )
    n  =  Util.lenObject( @spec, UI.isChild )
    dx = 100 / n
    w  =  dx * 0.6
    x  =   w * 2 - dx
    t  =  2
    yg = 10
    yp = 25
    h  = 80 - t * 2
    r  = h * 0.50
    f  = r * 0.50
    wg = @pane.toVmin(h)
    wp = wg * 0.66
    hg = @pane.toVmin(h)
    hp = hg * 0.66
    t  = @pane.toVmin(t)
    rg = @pane.toVmin(r)
    rp = rg * 0.66
    fg = @pane.toVmin(f)
    fp = fg * 0.66
    for own key, study of @spec when UI.isChild(key)
      #console.log( 'Interact.horz()', key )
      [y,w,h,r,f] = if study.type is 'group' then [yg,wg,hg,rg,fg] else [yp,wp,hp,rp,fp]
      $e = @circle( x, y, w, h, r, t, f, key )
      @onEvents( @stream, $e, key, study ) if study.type is 'group'
      $p.append( $e )
      x = x + dx
    $p

  ###
    select = UI.select( 'Maps', 'UI', UI.SelectGroup )
    @stream.publish( 'Select', select )
  ###

  circle:( x, y, w, h, r, t, f, label, klass="circle" ) ->
    style = "display:table; border:black solid #{t}vmin; border-radius:#{r}vmin; position:absolute; left:#{x}%; top:#{y}%; width:#{w}vmin; height:#{h}vmin; text-align:center; z-index:2;"
    #console.log( 'Interact.style', style )
    $c    = $("""<div class="#{klass}" style="#{style}"></div>""")
    $c.append( """<div style="display:table-cell; vertical-align:middle; font-size:#{f}vmin;">#{label}</div>""" )
    $c

  readyView:() ->
    src = "img/body/Body.jpg"
    @$view = $( """<div #{Dom.panel(0, 0,100,100)}></div>"""  )
    @$view.append( "<h1 #{Dom.label(0, 0,100, 10)}>Body</h1>" )
    @$view.append( """  #{Dom.image(0,10,100, 90,src,150)}""" )
    @$view

  doClick:( stream, $e, key, study  ) ->
    study.chosen = false
    $e.css( { color:Dom.basisColor } )
    select = UI.select( key, 'Interact', UI.SelectGroup, study )
    select.$click = $e
    stream.publish( 'Select', select )
    return

  doEnter:( $e, study ) -> $e.css( { color:Dom.hoverColor } ) if not study?.chosen
  doLeave:( $e, study ) -> $e.css( { color:Dom.basisColor } ) if not study?.chosen

  onEvents:( stream, $e, key, study ) =>
    $e.on( 'click',      (event) => @doClick( stream, $e, key, study ) )
    $e.on( 'mouseenter', (     ) => @doEnter( $e, study ) )
    $e.on( 'mouseleave', (     ) => @doLeave( $e, study ) )
