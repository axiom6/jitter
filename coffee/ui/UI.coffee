
class UI

  UI.$empty       = $() # Empty jQuery singleton for intialization
  UI.None         = "None"
  UI.ncol         = 36
  UI.nrow         = 24
  UI.margin       =  { width:1, height:1, west :2, north :1, east :2, south :2, wStudy:0.5, hStudy:0.5 }


  UI.SelectReady     = 'SelectReady'
  UI.SelectOverview  = 'SelectOverview'
  UI.SelectPractice  = 'SelectPractice'
  UI.SelectStudy     = 'SelectStudy'

  UI.intents = [UI.SelectReady,UI.SelectOverview,UI.SelectPractice,UI.SelectStudy]

  constructor:( @stream, @page ) ->
    callback = (data) =>
      @spec  =  data
      @tocs  = new UI.Tocs( @, @stream, @spec )
      @view  = new UI.View( @, @stream, @spec )
      @ready( @page, @spec )
    UI.readJSON( "json/toc.json", callback )
    UI.ui = @

  ready:( @page, @spec ) ->
    $('#'+Util.htmlId('App')).html( @html() )
    @tocs.ready()
    @view.ready()
    @page.ready( @view, @spec )
    return

  html:() ->
    """
      <div class="ikw-tocs tocs" id="#{@htmlId('Tocs')}"></div>
      <div class="ikw-view"      id="#{@htmlId('View')}"></div>
    """

  show:() ->
    @tocs.show()
    @view.showAll()
    return

  hide:() ->
    @tocs.hide()
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

  @subscribe:() ->
    #UI.TheStream.subscribe( 'Plane', (name) => UI.onPlane(name) )  # if not UI.Build? # Subscribe only when ui.ready()
    #UI.TheStream.subscribe( 'Image', (name) => UI.onImage(name) )
    return

  @publish:() ->
    #UI.TheStream.publish( 'Content', UI.Build.content( 'Studies', 'createUI', Build.SelectAllPanes ) )
    return

