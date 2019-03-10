
import Util  from '../util/Util.js'
import UI    from '../ui/UI.js'
import Base  from '../ui/Base.js'

class Interact extends Base

  constructor:( stream, ui, name, @specs ) ->
    super(      stream, ui, name, 'Interact')
    @lastSelect = ""
    @stream.subscribe( 'Select', 'Interact', (select) => @onSelect(select) )
    console.log( @specs, @lastSelect ) if false

  ready:( cname ) =>
    Util.noop( cname )
    @horz()

  horz:() ->
    $p = $( """<div class="panel" style="position:relative; left:0; top: 0;  width:100%; height:100%; text-align:center;"></div>""" )
    $p.append( """<hr             style="position:absolute; left:0; top:38%; width:100%; height:  1%; z-index:1; color:white; background-color:white;"></hr>"""  )
    n  =  Util.lenObject( @specs, UI.isChild )
    dx = 100 / n
    w  = dx * 0.6
    tp = 4
    hp = 80 - tp * 2
    x  =  w * 2  - dx
    for own key, spec of @specs when UI.isChild(key)
      [y,hc] = if spec.type is 'pack' then [10,hp] else [25,hp*0.66]
      [w,h,t,r,f] = @geom( hc, tp )
      $e = @action( x, y, w, h, r, t, f, key )
      @onEvents( $e, key ) if spec.type is 'pack'
      @onEnters( $e, key ) if spec.type is 'pane'
      $p.append( $e )
      x = x + dx
    $p

  geom:( h, tp ) ->
    w = @pane.toVmin(h*1.6)
    h = @pane.toVmin(h)
    t = @pane.toVmin(tp)
    r = h * 0.50
    f = r * 0.65
    [w,h,t,r,f]

  action:( x, y, w, h, r, t, f, name ) ->
    left   = Util.toFixed( x, 2 )
    htmlId = Util.htmlId( 'Interact', name )
    label  = if Util.inString( name, 'Summary' ) then 'Summary' else name
    style  = "display:table; border:black solid #{t}vmin; border-radius:#{r}vmin; position:absolute; left:#{left}%; top:#{y}%; width:#{w}vmin; height:#{h}vmin; text-align:center; z-index:2;"
    $e     = $("""<div id="#{htmlId}" class="action" style="#{style}"></div>""")
    $e.append( """<div style="display:table-cell; vertical-align:middle; font-size:#{f}vmin;">#{label}</div>""" )
    $e

  onSelect:(  select ) =>
    return if select.name is @lastSelect or select.intent isnt UI.SelectPack
    console.info( 'Interact.onSelect()', select ) if @stream.isInfo('Select')
    $('#Interact'+@lastSelect).removeClass('action-active').addClass('action') if Util.isStr( @lastSelect )
    $('#Interact'+select.name).removeClass('action').addClass('action-active')
    @lastSelect = select.name
    return

  onEvents:( $e, key ) =>
    $e.on( 'click', () => @doClick( $e, key ) )
    return

  doClick:( $e, key ) =>
    select = UI.toTopic( key, 'Interact', UI.SelectPack )
    @stream.publish( 'Select', select )
    return

  onEnters:( $e, key ) =>
    pane = @ui.view.getPane(key)
    pane.$.on( 'mouseenter', () => $e.removeClass('action').addClass('action-inpane') )
    pane.$.on( 'mouseleave', () => $e.removeClass('action-inpane').addClass('action') )
    return

  readyView:() ->
    $("""<h1 style=" display:grid; justify-self:center; align-self:center; ">Interact</h1>""" )

export default Interact
