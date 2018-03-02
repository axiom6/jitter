
class Page

  UI.Page = Page

  constructor:( @stream ) ->
    @view = null # Set by ready()

  ready:( view, spec ) ->
    @view = view
    @spec = spec
    for pane in @view.panes
      @createContent( pane, spec[pane.name] )
    return

  createContent:( pane, spec ) ->
    pane.page = @
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
    pane.$.append( "<h1>Flavor</h1>" )
    return

  createRoast:(  pane, spec ) ->
    pane.$.append( "<h1>Roast</h1>" )
    return

  createDrink:(  pane, spec ) ->
    pane.$.append( "<h1>Drink</h1>" )
    return

  createBody:(   pane, spec ) ->
    pane.$.append( "<h1>Body</h1>" )
    return

  createBrew:(   pane, spec ) ->
    pane.$.append( "<h1>Brew</h1>" )
    return

  createAroma:(  pane, spec ) ->
    pane.$.append( "<h1>Aroma</h1>" )
    return

  createChoice:( pane, spec ) ->
    pane.$.append( "<h1>Choice</h1>" )
    return

  createCoffee:( pane, spec ) ->
    pane.$.append( "<h1>Coffee</h1>" )
    return

  createOrder:(  pane, spec ) ->
    pane.$.append( "<h1>Order</h1>" )
    return

  selectContent:( select ) ->
    switch select.intent
      when UI.SelectOverview  then @selectOverview( select )
      when UI.SelectPractice  then @selectPractice( select )
      when UI.SelectStudy     then @selectStudy(    select )
      else Util.error( "Page.selectContent() unknown select", select )
    return

  selectOverview:( select ) ->

  selectPractice:( select ) ->

  selectStudy:(    select ) ->