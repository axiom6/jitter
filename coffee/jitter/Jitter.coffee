
class Jitter

  @init = () ->
    Util.ready ->
      subjects = ['Select','Choice']
      stream   = new Util.Stream( subjects )
      jitter   = new Jitter( stream )
      ui       = new UI( stream, jitter.onReady )
      Util.noop( ui )
      return
    return

  constructor:( @stream ) ->
    @content = {}
    @view    = null # Set by onReady()
    @spec    = null # Set by onReady()
    @flavor  = new Jitter.Flavor(  @stream, @ )
    @choices = new Jitter.Choices( @stream, @ )
    @roast   = new Jitter.Roast(   @stream, @ )
    @drink   = new Jitter.Drink(   @stream, @ )
    @body    = new Jitter.Body(    @stream, @ )
    @brew    = new Jitter.Brew(    @stream, @ )

  addContent:( name, object ) ->
    @content[name] = object

  onReady:( view, spec ) =>
    @view = view
    @spec = spec
    for pane in @view.panes
      content = @content[pane.name]
      content.pane  = pane
      content.spec  = spec[pane.name]
      content.$pane = content.readyPane()
      content.$view = $() # For now view content is not used
      content.pane.$.append( content.$pane )
    return

  onSelect:( pane, select ) ->
    UI.verifySelect( select, 'Jitter' )
    switch select.intent
      when UI.SelectView  then @selectView(  pane )
      when UI.SelectPane  then @selectPane(  pane )
      when UI.SelectStudy then @selectStudy( pane, select.study )
      else Util.error( "Jitter.onSelect() unknown select", select )
    return

  selectView:( pane ) ->
    content = @content[pane.name]
    if UI.isEmpty( content.$view )
      content.$view = content.readyView()
      content.pane.$.append( content.$view  )
    content.$pane.hide()
    content.$view.show()
    console.log( 'Jitter.selectView()', pane.name )
    return

  selectPane:( pane ) ->
    content = @content[pane.name]
    if UI.isEmpty( content.$pane )
      content.$pane = content.readyPane()
      content.pane.$.append( $pane ) if UI.isEmpty( content.$pane )
    content.$view.hide()
    content.$pane.show()
    console.log( 'Jitter.selectPane()', pane.name )
    return

  # Study scenarios have not yet been implemented
  selectStudy:( pane, study ) ->
    content = @content[pane.name]
    content.$view.hide()
    content.$pane.show()
    console.log( 'Jitter.selectStudy()', pane.name, study.name )


