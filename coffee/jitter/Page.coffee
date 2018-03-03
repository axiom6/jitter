
class Page

  UI.Page = Page

  constructor:( @stream ) ->
    @view = null # Set by ready()

  ready:( view, spec ) ->
    @view = view
    @spec = spec
    for pane in @view.panes
      @readyContent( pane, spec[pane.name] )
    return

  readyContent:( pane, spec ) ->
    pane.page = @
    pane.$.empty()
    switch pane.name
      when "Flavor" then @readyFlavor( pane, spec )
      when "Roast"  then @readyRoast(  pane, spec )
      when "Drink"  then @readyDrink(  pane, spec )
      when "Body"   then @readyBody(   pane, spec )
      when "Brew"   then @readyBrew(   pane, spec )
      when "Aroma"  then @readyAroma(  pane, spec )
      when "Choice" then @readyChoice( pane, spec )
      when "Coffee" then @readyCoffee( pane, spec )
      when "Order"  then @readyOrder(  pane, spec )
      else Util.error( "Page.createContent() unknown pane.name", pane.name )
    return

  readyFlavor:( pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>" )
    $e = $( """<div style="position:relative; width:100%; height:100%;"></div>""" )
    src = "img/flavor/FlavorReady.png"
    $e.append( """<img style="display:block; margin-left:auto; margin-right:auto; vertical-align:middle;" src="#{src}"/>""" )
    pane.$.append( $e )
    return

  readyRoast:(  pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>" )
    $e = $( """<div style="position:relative; width:100%; height:100%;"></div>""" )
    src = "img/roast/Coffee-Bean-Roast-Ready.jpg"
    $e.append( """<img style="display:block; margin-left:auto; margin-right:auto; vertical-align:middle;" src="#{src}"/>""" )
    pane.$.append( $e )
    return

  readyDrink:(  pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>" )
    $e = $( """<div style="position:relative; width:100%; height:100%;"></div>""" )
    src = "img/drink/DrinkReady.jpg"
    $e.append( """<img style="display:block; margin-left:auto; margin-right:auto; vertical-align:middle;" src="#{src}"/>""" )
    pane.$.append( $e )
    return

  readyBody:(   pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>" )
    $e = $( """<div style="position:relative; width:100%; height:100%;"></div>""" )
    src = "img/body/BodyReady.jpg"
    $e.append( """<img style="display:block; margin-left:auto; margin-right:auto; vertical-align:middle;" src="#{src}"/>""" )
    pane.$.append( $e )
    return
    return

  readyBrew:(   pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>" )
    $e = $( """<div style="position:relative; width:100%; height:100%;"></div>""" )
    src = "img/brew/"+spec['AutoDrip'].icon
    $e.append( """<img style="display:block; margin-left:auto; margin-right:auto; vertical-align:middle;" src="#{src}"/>""" )
    pane.$.append( $e )
    return

  readyAroma:(  pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>" )
    $e = $( """<div style="position:relative; width:100%; height:100%;"></div>""" )
    src = "img/aroma/AromaReady.png"
    $e.append( """<img style="display:block; margin-left:auto; margin-right:auto; vertical-align:middle;" src="#{src}"/>""" )
    pane.$.append( $e )
    return

  readyChoice:( pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>" )
    return

  readyCoffee:( pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>" )
    return

  readyOrder:(  pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>" )
    return

  onSelect:( pane, select ) ->
    UI.verifySelect( select, 'Page' )
    switch select.intent
      when UI.SelectOverview  then @selectOverview(      )
      when UI.SelectPractice  then @selectPractice( pane )
      when UI.SelectStudy     then @selectStudy(    pane )
      else Util.error( "Page.selectContent() unknown select", select )
    return

  selectOverview:() ->
    for pane in @view.panes
      @readyContent( pane, @spec[pane.name] )

  selectPractice:(  pane  ) ->
    @createContent( pane, @spec[pane.name] )

  selectStudy:( pane ) ->
    Util.noop(  pane )
    return

  createContent:( pane, spec ) ->
    pane.$.empty()
    switch pane.name
      when "Flavor" then @createFlavor( pane, spec )
      when "Roast"  then @createRoast(  pane, spec )
      when "Drink"  then @createDrink(  pane, spec )
      when "Body"   then @createBody(   pane, spec )
      when "Brew"   then @createBrew(   pane, spec )
      when "Aroma"  then @createAroma(  pane, spec )
      when "Choice" then @createChoice( pane, spec )
      when "Coffee" then @createCoffee( pane, spec )
      when "Order"  then @createOrder(  pane, spec )
      else Util.error( "Page.createContent() unknown pane.name", pane.name )
    return

  createFlavor:( pane, spec ) ->
    UI.plotId = "FlavorVisual"
    UI.jsonD3 = "json/flavor.jitter.json"
    pane.$.append( """<h1>#{spec.name}</h1>""" )
    pane.$.append( """<div id="#{UI.plotId}">&nbsp;</div>""" )
    Util.loadScript( "js/wheel/flavor.v3.js" )
    return

  createRoast:(  pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>" )
    $e = $( """<div style="position:relative; width:100%; height:100%;"></div>""" )
    src = "img/roast/FiveRoasts.jpeg"
    $e.append( """<img style="display:block; margin-left:auto; margin-right:auto; vertical-align:middle;" src="#{src}"/>""" )
    #$e.append( """<div><span>Light</span><span>Medium Light</span><span>Medium</span><span>Medium Dark</span><span>Dark</span></div>""")
    pane.$.append( $e )
    return

  pos:( x, y, w, h ) ->
    """position:absolute; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; text-align:center;"""

  createDrink:(  pane, spec ) ->
    $e = $( """<div style="position:relative; width:100%; height:100%;"></div>""" )
    $e.append( """<h1 style="#{@pos(0,0,100,10)}">#{spec.name}</h1>""" )
    for y in [10,55]
      for x in [0,33,66]
        $e.append( """<div style="#{@pos(x,y,33,45)}">#{x}</div>""" )
    pane.$.append( $e )
    return

  createBody:(   pane, spec ) ->
    $e = $( """<div style="position:relative; width:100%; height:100%;"></div>""" )
    $e.append( """<h1 style="#{@pos(0,0,100,10)}">#{spec.name}</h1>""" )
    for y in [10,55]
      for x in [0,33,66]
        $e.append( """<div style="#{@pos(x,y,33,45)}">#{x}</div>""" )
    pane.$.append( $e )
    return
    return

  createBrew:(   pane, spec ) ->
    #console.log( spec )
    pane.$.append( "<h1>Brew</h1>" )
    $e = $( """<div style="position:relative; width:100%; height:100%;"></div>""" )
    i =  1
    x =  0
    w = 25
    h = 25
    for own key, brew of spec when UI.isChild(key)
      src = 'img/brew/'+brew.icon
      x = if i != 4 then x+25 else  0
      y = if i <= 4 then   10 else 50
      x = 12.5 if i is 5
      $e.append( """<div style="position:absolute; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%;">
                      <img style="display:block; margin-left:auto; margin-right:auto;" src="#{src}"/>
                      <div style="color:white; text-align:center;">#{brew.name}</div></div>
                    </div>""" )
      i = i + 1
    pane.$.append( $e )
    return

  createAroma:(  pane, spec ) ->
    UI.plotId = "AromaVisual"
    UI.jsonD3 = "json/aroma.json"
    pane.$.append( """<h1>#{spec.name}</h1>""" )
    pane.$.append( """<div id="#{UI.plotId}">&nbsp;</div>""" )
    Util.loadScript( "js/wheel/flavor.v3.js" )
    return

  createChoice:( pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>" )
    return

  createCoffee:( pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>" )
    return

  createOrder:(  pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>" )
    return

