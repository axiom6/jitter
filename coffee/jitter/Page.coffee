
class Page

  Jitter.Page = Page

  constructor:( @stream ) ->
    Jitter.page = @
    @view    = null # Set by ready()
    @flavor  = new Jitter.Flavor(  @stream )
    @logo    = new Jitter.Logo(    @stream )
    @choices = new Jitter.Choices( @stream )
    @roast   = new Jitter.Roast(   @stream )
    @drink   = new Jitter.Drink(   @stream )
    @body    = new Jitter.Body(    @stream )
    @brew    = new Jitter.Brew(    @stream )
    @aroma   = new Jitter.Aroma(   @stream )
    @coffee  = new Jitter.Coffee(  @stream )
    @order   = new Jitter.Order(   @stream )

  ready:( view, spec ) ->
    @view = view
    @spec = spec
    for pane in @view.panes
      @readyContent( pane, spec[pane.name] )
    return

  overview:( view, spec ) ->
    @view = view
    @spec = spec
    for pane in @view.panes
      @overviewContent( pane, spec[pane.name] )
    return

  onSelect:( pane, select ) ->
    UI.verifySelect( select, 'Page' )
    switch select.intent
      when UI.SelectReady     then @selectReady(         )
      when UI.SelectOverview  then @selectOverview(      )
      when UI.SelectPractice  then @selectPractice( pane )
      when UI.SelectStudy     then @selectStudy(    pane, select.study )
      else Util.error( "Page.selectContent() unknown select", select )
    return

  selectReady:() ->
    for pane in @view.panes
      @readyContent( pane, @spec[pane.name] )

  selectOverview:() ->
    for pane in @view.panes
      @overviewContent( pane, @spec[pane.name] )

  selectPractice:(  pane  ) ->
    @createContent( pane, @spec[pane.name] )

  selectStudy:( pane, study ) ->
    @createContent( pane, @spec[pane.name], study )
    return

  overviewContent:( pane, spec ) ->
    pane.page = @
    pane.$.empty()
    switch pane.name
      when "Logo"    then    @logo.overview( pane, spec )
      when "Flavor"  then  @flavor.overview( pane, spec )
      when "Choices" then @choices.overview( pane, spec )
      when "Roast"   then   @roast.overview( pane, spec )
      when "Drink"   then   @drink.overview( pane, spec )
      when "Body"    then    @body.overview( pane, spec )
      when "Brew"    then    @brew.overview( pane, spec )
      when "Aroma"   then   @aroma.overview( pane, spec )
      when "Coffee"  then  @coffee.overview( pane, spec )
      when "Order"   then   @order.overview( pane, spec )
      else Util.error( "Page.overviewContent() unknown pane.name", pane.name )
    return

  readyContent:( pane, spec ) ->
    pane.page = @
    pane.$.empty()
    switch pane.name
      when "Logo"    then    @logo.ready( pane, spec )
      when "Flavor"  then  @flavor.ready( pane, spec )
      when "Choices" then @choices.ready( pane, spec )
      when "Roast"   then   @roast.ready( pane, spec )
      when "Drink"   then   @drink.ready( pane, spec )
      when "Body"    then    @body.ready( pane, spec )
      when "Brew"    then    @brew.ready( pane, spec )
      when "Aroma"   then   @aroma.ready( pane, spec )
      when "Coffee"  then  @coffee.ready( pane, spec )
      when "Order"   then   @order.ready( pane, spec )
      else Util.error( "Page.readyContent() unknown pane.name", pane.name )
    return

  createContent:( pane, spec, study=null ) ->
    pane.$.empty()
    switch pane.name
      when "Logo"    then    @logo.create( pane, spec )
      when "Flavor"  then  @flavor.create( pane, spec, study )
      when "Choices" then @choices.create( pane, spec )
      when "Roast"   then   @roast.create( pane, spec )
      when "Drink"   then   @drink.create( pane, spec )
      when "Body"    then    @body.create( pane, spec )
      when "Brew"    then    @brew.create( pane, spec )
      when "Aroma"   then   @aroma.create( pane, spec )
      when "Coffee"  then  @coffee.create( pane, spec )
      when "Order"   then   @order.create( pane, spec )
      else Util.error( "Page.createContent() unknown pane.name", pane.name )
    return
