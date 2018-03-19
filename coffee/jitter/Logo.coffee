
class Logo

  Jitter.Logo = Logo

  constructor:( @stream ) ->

  overview:(   pane, spec ) ->
    Util.noop( pane, spec )
    return

  ready:(      pane, spec ) ->
    Util.noop( spec )
    src = "img/logo/JitterBoxLogo.png"
    pane.$.append( """<div #{Jitter.panel(0,0,100,100)}></div>""" )
    $img =      $( """     #{Jitter.image(0,0,100,100,src,15,"","24px")}""" )
    #img.on( 'mouseenter', $img.css( { "max-height":"1000px" } ) )
    #img.on( 'mouseleave', $img.css( { "max-height":"15vmin" } ) )
    pane.$.append( $img )
    return

  create:(     pane, spec ) ->
    Util.noop( pane, spec )
    return