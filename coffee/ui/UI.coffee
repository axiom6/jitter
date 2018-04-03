
class UI

  UI.hasTocs      = false
  UI.$empty       = $() # Empty jQuery singleton for intialization
  UI.None         = "None"
  UI.ncol         = 36
  UI.nrow         = 36
  UI.margin       =  { width:0.00, height:0.00, west :0.5, north :0, east :0.5, south :0, wStudy:0.5, hStudy:0.5 }

  UI.SelectView  = 'SelectView'
  UI.SelectPane  = 'SelectPane'
  UI.SelectStudy = 'SelectStudy'
  UI.AddChoice   = 'AddChoice'
  UI.DelChoice   = 'DelChoice'

  UI.intents = [UI.SelectPane,UI.SelectView,UI.SelectStudy,UI.AddChoice,UI.DelChoice]

  constructor:( @stream ) ->
    @contents = {}
    callback = (data) =>
      @spec  =  data
      @tocs  = new UI.Tocs( @, @stream, @spec ) if UI.hasTocs
      @view  = new UI.View( @, @stream, @spec )
      @ready( @spec )
    UI.readJSON( "json/toc.json", callback )
    UI.ui = @

  addContent:( name, object ) ->
    @contents[name] = object

  ready:( @spec ) ->
    $('#'+Util.htmlId('App')).html( @html() )
    @tocs.ready()  if UI.hasTocs
    @view.ready()
    @contentReady()
    return

  contentReady:() =>
    for own name, content of @contents
      content.pane  = @view.getPaneOrGroup( name )
      content.spec  = @spec[name]
      content.$pane = content.readyPane()
      content.$view = $() # content.readView() For now view content is not used
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

  html:() ->
    htm = ""
    htm += """<div class="layout-logo     " id="#{@htmlId('Logo')}"></div>""" if UI.hasTocs
    htm += """<div class="layout-corp"      id="#{@htmlId('Corp')}"></div>""" if UI.hasTocs
    htm += """<div class="layout-find"      id="#{@htmlId('Find')}"></div>""" if UI.hasTocs
    htm += """<div class="layout-tocs tocs" id="#{@htmlId('Tocs')}"></div>""" if UI.hasTocs
    htm += """<div class="layout-view"      id="#{@htmlId('View')}"></div>"""
    htm += """<div class="layout-side"      id="#{@htmlId('Side')}"></div>""" if UI.hasTocs
    htm += """<div class="layout-pref     " id="#{@htmlId('Pref')}"></div>""" if UI.hasTocs
    htm += """<div class="layout-foot"      id="#{@htmlId('Foot')}"></div>""" if UI.hasTocs
    htm += """<div class="layout-trak"      id="#{@htmlId('Trak')}"></div>""" if UI.hasTocs
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

  htmlId:( name, type='', ext='' ) ->
    Util.htmlId( name, type, ext )

  getHtmlId:( name, ext='' ) ->
    Util.getHtmlId( name, "", ext )

  @baseUrl:( ) ->
    if window.location.href.includes('localhost')
      "http://localhost:63342/jitter/public/"
    else
      "https://jitter-48413.firebaseapp.com/"

  @readJSON:( url, callback ) ->
    url = UI.baseUrl() + url
    settings  = { url:url, type:'GET', dataType:'json', processData:false, contentType:'application/json', accepts:'application/json' }
    settings.success = ( data,  status, jqXHR ) =>
      Util.noop( status, jqXHR  )
      callback( data )
    settings.error   = ( jqXHR, status, error ) =>
      Util.noop( jqXHR )
      Util.error( "UI.readJSON()", { url:url, status:status, error:error } )
    $.ajax( settings )
    return

  @isChild:( key ) ->
    a = key.charAt(0)
    a is a.toUpperCase() and a isnt '$'

  @select:( name, source, intent, study=null ) ->
    obj = {  name:name, source:source, intent:intent, study:study }
    UI.verifySelect( obj )
    obj

  @verifySelect:( select, source ) ->
    verify = Util.isStr(select.name) and Util.isStr(select.source) and Util.inArray(UI.intents,select.intent)
    Util.trace('UI.verifySelect()', select, source ) if not verify
    verify

  @isEmpty:( $elem ) -> $elem? and $elem.length? and $elem.length is 0

  @isElem:(  $elem ) -> not UI.isEmpty( $elem )

  @jmin:( cells ) ->
    Util.trace('UI.jmin') if not cells?
    [ cells[0]-1,cells[1],cells[2]-1,cells[3] ]

  @toCells:( jmin ) ->
    [ jmin[0]+1,jmin[1],jmin[2]+1,jmin[3] ]

  @unionCells:( cells1, cells2 ) ->
    [j1,m1,i1,n1] = UI.jmin( cells1 )
    [j2,m2,i2,n2] = UI.jmin( cells2 )
    [ Math.min(j1,j2)+1, Math.max(j1+m1,j2+m2)-Math.min(j1,j2), Math.min(i1,i2)+1, Math.max(i1+n1,i2+n2)-Math.min(i1,i2) ]

  @intersectCells:( cells1, cells2 ) ->
    [j1,m1,i1,n1] = UI.jmin( cells1 )
    [j2,m2,i2,n2] = UI.jmin( cells2 )
    [ Math.max(j1,j2)+1, Math.min(j1+m1,j2+m2), Math.max(i1,i2)+1, Math.min(i1+n1,i2+n2) ]
