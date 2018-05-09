
`import Util from '../util/Util.js'`
`import Navb from '../ui/Navb.js'`
`import Tocs from '../ui/Tocs.js'`
`import View from '../ui/View.js'`

class UI

  UI.hasPage      = true
  UI.hasTocs      = true
  UI.hasPictFrame = true
  UI.$empty       = $()
  UI.ncol         = 36
  UI.nrow         = 36
  #I.margin =  { width:1,    height:1,    west:2,   north :1, east :2,   south 2, wStudy:0.5, hStudy:0.5 }
  UI.margin =  { width:0.00, height:0.00, west:0.5, north :0, east :0.5, south:0, wStudy:0.5, hStudy:0.5 }

  UI.SelectView  = 'SelectView'
  UI.SelectPane  = 'SelectPane'
  UI.SelectStudy = 'SelectStudy'
  UI.SelectTopic = 'SelectTopic'
  UI.SelectItems = 'SelectItems'
  UI.SelectRow   = 'SelectRow'
  UI.SelectCol   = 'SelectCol'
  UI.SelectGroup = 'SelectGroup'
  UI.AddChoice   = 'AddChoice'
  UI.DelChoice   = 'DelChoice'

  UI.intents = [UI.SelectPane,UI.SelectView,UI.SelectStudy,UI.SelectRow,UI.SelectCol,UI.SelectGroup,UI.AddChoice,UI.DelChoice]

  constructor:( @stream, @jsonPath, @navbSpecs=null, @prac=null ) ->
    @contents  = {}
    @planeName = @setupPlane()
    callback = (data) =>
      @specs = if @prac? then @processPractices(data) else data
      @navb  = new Navb( @, @stream, @navbSpecs ) if @navbSpecs?
      @tocs  = new Tocs( @, @stream, @specs     ) if UI.hasTocs
      @view  = new View( @, @stream, @specs     )
      @ready()
    UI.readJSON( @jsonPath, callback )
    UI.ui = @

  setupPlane:() ->
    if @prac?
       @prac.planeName
    else if @jsonPath is "json/toc.json" # For View.createGroupsPanes( specs )
      'Jitter'
    else
      'None'

  processPractices:( data ) ->
    @nrowncol( data )
    @prac.createFilteredPractices( data )

  nrowncol:( data ) ->
    UI.nrow = if data.nrow? then data.nrow else UI.nrow
    UI.ncol = if data.ncol? then data.ncol else UI.ncol

  # This method detects if  ui instances have not unsubscribed for planes other than the current build plane
  # are still receiving messages that can generate exceptions
  inPlane:( source ) ->
    if @prac? and @prac.planeName isnt @planeName
      console.log( "UI.inPlane() not in", { currentPlane:@prac.planeName, uiPlane:@planeName, source:source } )
      console.trace() if @stream
      false
    else
      true

  html:() ->
    htm = ""
    htm += """<div class="layout-logo     " id="#{@htmlId('Logo')}"></div>""" if UI.hasPictFrame
    htm += """<div class="layout-corp"      id="#{@htmlId('Corp')}"></div>""" if @navbSpecs?
    htm += """<div class="layout-find"      id="#{@htmlId('Find')}"></div>""" if UI.hasPictFrame
    htm += """<div class="layout-tocs tocs" id="#{@htmlId('Tocs')}"></div>""" if UI.hasPictFrame
    htm += """<div class="layout-view"      id="#{@htmlId('View')}"></div>"""
    htm += """<div class="layout-side"      id="#{@htmlId('Side')}"></div>""" if UI.hasPictFrame
    htm += """<div class="layout-pref     " id="#{@htmlId('Pref')}"></div>""" if UI.hasPictFrame
    htm += """<div class="layout-foot"      id="#{@htmlId('Foot')}"></div>""" if UI.hasPictFrame
    htm += """<div class="layout-trak"      id="#{@htmlId('Trak')}"></div>""" if UI.hasPictFrame
    htm

  show:() ->
    @tocs.show() if UI.hasTocs
    @view.showAll()
    return

  hide:() ->
    @tocs.hide()   if UI.hasTocs
    @view.hideAll()
    return

  resize:() =>
    @view.resize()
    return

  addContent:( name,  object ) ->
    @contents[name] = object

  ready:() ->
    $('#'+@htmlId('App')).html( @html() )
    @navb.ready()  if @navbSpecs?
    @tocs.ready()  if UI.hasTocs
    @view.ready()
    if not @prac?
      #contentReady() called by Ready subscribers
      ready = UI.select( "Ready", "UI", UI.SelectView ) # UI.SelectView is a placeholder since Ready does not have intents
      @stream.publish( "Ready", ready )
    else
      #contentReady()
      content = UI.content( 'Study', 'UI' )
      @stream.publish( 'Content', content )
    return

  contentReady:() =>
    for own name, content of @contents
      content.pane  = @view.getPaneOrGroup( name )
      content.spec  = content.pane.spec # specs[name]
      content.$pane = content.readyPane()
      content.$view = $() # content.readView() For now view content is not used
      content.pane.$.append( content.$pane )
      #console.log( 'UI.contentReady()', { name:name, spec:content.pane.spec } )
    return

  onSelect:( pane, select ) ->
    UI.verifySelect( select, 'Jitter' )
    switch select.intent
      when UI.SelectView  then @selectView(  pane )
      when UI.SelectGroup then @selectGroup( pane )
      when UI.SelectPane  then @selectPane(  pane )
      when UI.SelectStudy then @selectStudy( pane, select.study )
      else console.error( "Jitter.onSelect() unknown select", select )
    return

  selectView:( pane ) ->
    content = @content[pane.name]
    if @isEmpty( content.$view )
      content.$view = content.readyView()
      content.pane.$.append( content.$view  )
    content.$pane.hide()
    content.$view.show()
    console.info( 'Jitter.selectView()', pane.name ) if @stream.isInfo('Select')
    return

  selectGroup:( pane ) ->
    content = @content[pane.name]
    if @isEmpty( content.$pane )
      content.$pane = content.readyPane()
      content.pane.$.append( $pane ) if @isEmpty( content.$pane )
    content.$view.hide()
    content.$pane.show()
    console.info( 'Jitter.selectGroup()', pane.name )  if @stream.isInfo('Select')
    return

  selectPane:( pane ) ->
    content = @content[pane.name]
    if @isEmpty( content.$pane )
      content.$pane = content.readyPane()
      content.pane.$.append( $pane ) if @isEmpty( content.$pane )
    content.$view.hide()
    content.$pane.show()
    console.info( 'Jitter.selectPane()', pane.name ) if @stream.isInfo('Select')
    return

  # Study scenarios have not yet been implemented
  selectStudy:( pane, study ) ->
    content = @content[pane.name]
    content.$view.hide()
    content.$pane.show()
    console.info( 'Jitter.selectStudy()', pane.name, study.name ) if @stream.isInfo('Select')

  # Html and jQuery Utilities in UI because it is passed around everywhere

  htmlId:( name, type='', ext='' ) ->
    Util.htmlId( name, type, ext )

  getHtmlId:( name, ext='' ) ->
    Util.getHtmlId( name, "", ext )

  isEmpty:( $elem ) ->
    $elem? and $elem.length? and $elem.length is 0

  isElem:(  $elem ) ->
    $elem? and $elem.length? and $elem.length > 0

  @jQueryHasNotBeenLoaded:() ->
    if typeof jQuery == 'undefined'
      console.error( 'UI JQuery has not been loaded' )
      true
    else
      false

  @readJSON:( url, callback ) ->
    return if UI.jQueryHasNotBeenLoaded()
    url = UI.baseUrl() + url
    settings  = { url:url, type:'GET', dataType:'json', processData:false, contentType:'application/json', accepts:'application/json' }
    settings.success = ( data,  status, jqXHR ) =>
      Util.noop( status, jqXHR  )
      callback( data )
    settings.error   = ( jqXHR, status, error ) =>
      Util.noop( jqXHR )
      console.error( "UI.readJSON()", { url:url, status:status, error:error } )
    $.ajax( settings )
    return

  @isChild:( key ) ->
    a = key.charAt(0)
    a is a.toUpperCase() and a isnt '$'

  @select:( name, source, intent, study=null ) ->
    obj = {  name:name, source:source, intent:intent, study:study }
    UI.verifySelect( obj, "UI.select()" )
    obj

  @content:( choice, source, name='None' ) ->
    # console.log( 'UI.content()', { content:choice, source:source, name:name } )
    content = { name:name, source:source, choice:choice }
    UI.verifyContent( content, "UI.content()" )
    content

  @verifySelect:( select, source ) ->
    verify  =  Util.isStr(select.name) and Util.isStr(select.source) and Util.inArray(UI.intents,select.intent)
    if not verify
      console.log('UI.verifySelect()', { select:select, source:source } )
      console.trace()
    verify

  @verifyContent:( content, source ) ->
    verify  =  Util.isStr(content.name) and Util.isStr(content.choice) and Util.isStr(content.source)
    if not verify
      console.log('UI.verifyContent()', { content:content, source:source } )
      console.trace()
    verify

  @baseUrl:( ) ->
    if window.location.href.includes('localhost')
      "http://localhost:63342/jitter/public/"
    else
      "https://jitter-48413.firebaseapp.com/"

`export default UI`