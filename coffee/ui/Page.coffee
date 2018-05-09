
`import Util   from '../util/Util.js'`
`import UI     from '../ui/UI.js'`
`import Btn    from '../ui/Btn.js'`

class Page

  constructor: ( @ui, @stream, @view, @pane ) ->
    @spec        = @pane.spec
    @name        = @pane.name
    if @name is 'None'
      console.log( 'new Page() name is None' )
      console.trace()
    @icon        = @spec.icon
    if @ui.prac?
      #@connect    = new Connect( @ui, @stream, @view, @, @spec   )
      @contents    = @ui.prac.initContents()
      @choice      = ""
      @intent      = ""
      @saveHtml    = false
      @saveSvg     = false
      @showBtn     = false
      #@btn         = new Btn( @ui, @stream, @pane, @pane.spec, @viewer.contents ) if @showBtn

  ready:() ->
    #return if @ui.plane.name is 'Hues'
    #@viewer.ready()  if @viewer?
    @subscribe()
    #@connect.ready()
    @btn.ready() if @showBtn
    return

  subscribe:() ->
    @stream.subscribe( 'Content', 'Page'+@name, (content) => @onContent( content ) )
    return

  publish:( $on ) ->
    if @ui.isElem($on)
      select = UI.select( Util.toSelect(@pane.name), 'Page', UI.SelectPane )
      @stream.publish( 'Select', select, $on, 'click' )
    return

  publishJQueryObjects:( objects, intent ) ->
    return if true
    for name, $object of objects when @ui.isElem($object)
      select = UI.select( Util.toSelect(name),  'Page', intent )
      console.info( 'Page.publishJQueryObjects()', )  if @stream.isInfo('Select')
      @stream.publish( 'Select', select, $object, 'click' )
    return

  # Convert select message to content Called by pane.onSelect
  onSelect:( select ) ->
    return if not UI.verifySelect( select, "Page.onSelect()" )
    return if not @ui.inPlane(             "Page.onSelect()" )
    choice = @choiceOnSelect() # select
    console.info('Page.onSelect()', {  name:@name, plane:@ui.planeName, select:select } )  if @stream.isInfo('Select')
    content = UI.content( choice, select.source, select.intent, select.name )
    @onContent( content )
    return

  choiceOnSelect:() ->
    if @pane.lastChoice isnt 'None' then @pane.lastChoice else 'Study'

  # Called by layout and Btn
  onContent:( content ) =>
    content.name = @name
    inPlane = @ui.inPlane( "Page.onContent()" )
    if @stream.isInfo('Content')
      console.info('Page.onContent()', { name:@name, inPlane:inPlane, plane:@ui.planeName, content:content } )
    choice = content.choice
    intent = content.intent
    return if not UI.verifyContent( content, "Page.onContent()" )
    return if not inPlane

    ready  = @choice isnt choice and Util.isObjEmpty( @contents[choice] ) and @ui.prac?

    @contents[@choice].$.hide() if Util.isStr(@choice)

    if ready
      @contents[choice] = @ui.prac.createContent( choice, @pane, @ )
      @contents[choice].ready()
      #console.log( 'onContent()', { choice:choice, empty:Util.isObjEmpty(@contents[choice]), content:@contents[choice] } )

    app = @contents[choice]   # @btn.layout( geom ) if @showBtn
    app.layout()
    app.$.show()

    @choice = choice
    @intent = intent

    if @choice is 'Graph' and @saveSvg
      app.saveSvg()
      @saveSvg = false
    if @choice is 'Study' and @saveHtml
      app.saveHtml()
      @saveHtml = false
    return

  getStudy:( name ) ->
    for own key, study of @spec.studies when name isnt 'None'
      return study if key is name
    'None'

`export default Page`
