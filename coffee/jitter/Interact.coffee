
`import Util from '../util/Util.js'`
`import UI   from '../ui/UI.js'`
`import Dom  from '../ui/Dom.js'`

class Interact

  constructor:( @stream, @ui, @name, @specInteract ) ->
    @ui.addContent( @name, @ )
    @stream.subscribe( 'Select', 'Interact', (select) => @onSelect(select) )
    @last = { name:"" }

  readyPane:() =>
    @spec = @specInteract # Qverride?
    @horz()

  readyView:() =>
    $("""<h1 style=" display:grid; justify-self:center; align-self:center; ">Interact</h1>""" )

  horz:() ->
    $p = $( """<div class="panel" style="position:relative; left:0; top: 0;  width:100%; height:100%; text-align:center;"></div>""" )
    $p.append( """<hr             style="position:absolute; left:0; top:38%; width:100%; height:  1%; z-index:1; color:white; background-color:white;"></hr>"""  )
    n  =  Util.lenObject( @spec, UI.isChild )
    dx = 100 / n
    w  = dx * 0.6
    tp = 4
    hp = 80 - tp * 2
    x  =  w * 2  - dx
    for own key, study of @spec when UI.isChild(key)
      study.name = key
      [y,hc] = if study.type is 'pack' then [10,hp] else [25,hp*0.66]
      [w,h,t,r,f] = @geom( hc, tp )
      $e = @action( x, y, w, h, r, t, f, key )
      @onEvents( @stream, $e, key, study ) if study.type is 'pack'
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

  action:( x, y, w, h, r, t, f, label, klass="action" ) ->
    left  = Util.toFixed( x, 2 )
    style = "display:table; border:black solid #{t}vmin; border-radius:#{r}vmin; position:absolute; left:#{left}%; top:#{y}%; width:#{w}vmin; height:#{h}vmin; text-align:center; z-index:2;"
    #console.log( 'Interact.circle()', { style:style } )
    $c    = $("""<div class="#{klass}" style="#{style}"></div>""")
    $c.append( """<div style="display:table-cell; vertical-align:middle; font-size:#{f}vmin;">#{label}</div>""" )
    $c

  doClick:( stream, $e, key, study  ) ->
    select = UI.toTopic( key, 'Interact', UI.SelectPack, study )
    stream.publish( 'Select', select )
    return

  onSelect:(  select ) =>
    return if select.name is @last.name or select.intent isnt UI.SelectPack or not @spec?
    study = @spec[select.name]
    @last.$e.removeClass( 'action-active' ) if Util.isStr( @last.name )
    study.$e.addClass(    'action-active' )
    @last = study
    return

  onEvents:( stream, $e, key, study ) =>
    study.$e = $e
    $e.on( 'click', () => @doClick( stream, $e, key, study ) ) # (event)

  readyView:() ->
    @readyPane()

`export default Interact`
