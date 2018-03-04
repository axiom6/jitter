
class Page

  Jitter.Page = Page

  constructor:( @stream ) ->
    @view   = null # Set by ready()
    @flavor = new Jitter.Flavor( @stream )
    @roast  = new Jitter.Roast(  @stream )
    @drink  = new Jitter.Drink(  @stream )
    @body   = new Jitter.Body(   @stream )
    @brew   = new Jitter.Brew(   @stream )
    @aroma  = new Jitter.Aroma(  @stream )
    @choice = new Jitter.Choice( @stream )
    @coffee = new Jitter.Coffee( @stream )
    @order  = new Jitter.Order(  @stream )

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
      when "Flavor" then @flavor.ready( pane, spec )
      when "Roast"  then  @roast.ready( pane, spec )
      when "Drink"  then  @drink.ready( pane, spec )
      when "Body"   then   @body.ready( pane, spec )
      when "Brew"   then   @brew.ready( pane, spec )
      when "Aroma"  then  @aroma.ready( pane, spec )
      when "Choice" then @choice.ready( pane, spec )
      when "Coffee" then @coffee.ready( pane, spec )
      when "Order"  then  @order.ready( pane, spec )
      else Util.error( "Page.readyContent() unknown pane.name", pane.name )
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
      when "Flavor" then @flavor.create( pane, spec )
      when "Roast"  then  @roast.create( pane, spec )
      when "Drink"  then  @drink.create( pane, spec )
      when "Body"   then   @body.create( pane, spec )
      when "Brew"   then   @brew.create( pane, spec )
      when "Aroma"  then  @aroma.create( pane, spec )
      when "Choice" then @choice.create( pane, spec )
      when "Coffee" then @coffee.create( pane, spec )
      when "Order"  then  @order.create( pane, spec )
      else Util.error( "Page.createContent() unknown pane.name", pane.name )
    return
