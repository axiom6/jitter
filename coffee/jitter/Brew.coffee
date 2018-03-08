
class Brew

  Jitter.Brew = Brew

  constructor:( @stream ) ->

  overview:( pane, spec ) ->
    src = "img/brew/"+spec['AutoDrip'].icon
    $e = $( """<div #{Jitter.rel(0, 0,100,100)}></div>""" )
    $e.append( "<h1 #{Jitter.abs(0, 0,100, 10)}>#{spec.name}</h1>" )
    $e.append( """  #{Jitter.abi(0,10,100, 90,src,150)}""" )
    pane.$.append( $e )
    return

  ready:(    pane, spec ) ->
    Jitter.ready( pane, spec, 'img/brew/', 0.70 )
    return

  create:( pane, spec ) ->
    pane.$.append( "<h1>Brew</h1>" )
    $e = $( """<div #{Jitter.rel(0,0,100,100)}></div>""" )
    i =  1
    x =  0
    w = 25
    h = 25
    for own key, brew of spec when UI.isChild(key)
      src = 'img/brew/'+brew.icon
      x = if i != 4 then x+25 else  0
      y = if i <= 4 then   10 else 50
      x = 12.5 if i is 5
      $e.append( """#{Jitter.abi(x,y,w,h,src,150,brew.name)}""" )
      ###
      $e.append( """<div     #{Jitter.abs(x,y,w,h)}>
                             #{Jitter.img(src)}
                        <div #{Jitter.txt()}>#{brew.name}</div>
                    </div>""" )
      ###
      i = i + 1
    pane.$.append( $e )
    return
