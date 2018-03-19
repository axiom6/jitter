
class Roast

  Jitter.Roast = Roast

  constructor:( @stream ) ->

  overview:( pane, spec ) ->
    src = "img/roast/Coffee-Bean-Roast-Ready.jpg"
    $e = $( """<div #{Jitter.panel(0, 0,100,100)}></div>""" )
    $e.append( "<h1 #{Jitter.label(0, 0,100, 10)}>#{spec.name}</h1>" )
    $e.append( """  #{Jitter.image(0,10,100, 90,src,150)}""" )
    pane.$.append( $e )
    return

  ready:( pane, spec ) ->
    @spec = spec
    src = "img/roast/RoastsBig.png"
    pane.$.append( """<div   #{Jitter.panel( 0, 0,100,100)}></div>""" )
    pane.$.append(  """<div #{Jitter.label( 3,42, 10, 16)}>#{spec.name}</div>""" )
    $i = $("""#{@image(16, 8, 75, 78,src,12,"")}"""  )
    $i.append("""<div #{Jitter.label( 3,82,16, 10,"roast")}>Light</div>""")
    $i.append("""<div #{Jitter.label(24,82,16, 10,"roast")}>Medium Light</div>""")
    $i.append("""<div #{Jitter.label(42,82,16, 10,"roast")}>Medium</div>""")
    $i.append("""<div #{Jitter.label(66,82,16, 10,"roast")}>Medium Dark</div>""")
    $i.append("""<div #{Jitter.label(86,82,16, 10,"roast")}>Dark</div>""")
    pane.$.append( $i  )
    pane.$.append( "</div></div>"  )
    $(".roast").on( 'click', (event) => @doClick(event) )
    return

  doClick:( event ) =>
    $e    = $(event.target)
    name  = $e.text()
    key   = name.replace( " ", "" )
    study = @spec[key]
    study.chosen = if not ( study.chosen? or study.chosen ) then true else false
    addDel       = if study.chosen then UI.AddChoice       else UI.DelChoice
    color        = if study.chosen then Jitter.choiceColor else Jitter.basisColor
    $e.css( { color:color } )
    choice = UI.select( 'Roast', 'Jitter', addDel, name )
    choice.$click = $e
    Jitter.stream.publish( 'Choice', choice )
    return

  image:( x, y, w, h, src, mh ) -> # max-height:#{mh}vmin;
    klass  = if src? then "image"            else "texts"
    htm  = """<div class="#{klass}" style="position:absolute; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; display:table;">"""
    htm += """<div style="display:table-cell; vertical-align:middle;">"""
    htm += """<img style="display:block; margin-left:auto; margin-right:auto;  width:100%; border-radius:24px;" src="#{src}"/>""" if src?
    htm

  create:( pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>" )
    $e = $( """<div #{Jitter.rel(0,0,100,100)}></div>""" )
    src = "img/roast/FiveRoasts.jpeg"
    $e.append( """<img #{Jitter.img(src)}/>""" )
    #$e.append( """<div><span>Light</span><span>Medium Light</span><span>Medium</span><span>Medium Dark</span><span>Dark</span></div>""")
    pane.$.append( $e  )
    return
