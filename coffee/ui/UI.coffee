
# $ = require('jquery')

class UI

  #Util.UI        = UI
  #module.exports = UI
  #UI.Tocs        = require( 'js/ui/Tocs'    )
  #UI.View        = require( 'js/ui/View'    )
  #UI.Pane        = require( 'js/ui/Pane'    )
  UI.$empty       = $() # Empty jQuery singleton for intialization
  UI.None         = "None"
  UI.ncol         = 36
  UI.nrow         = 36
  UI.margin       =  { width:1, height:1, west :5, north :5, east :2, south :2, wStudy:0.5, hStudy:0.5 }
  UI.MaxTocLevel  = 12

  UI.SelectOverview  = 'SelectOverview'
  UI.SelectPractice  = 'SelectPractice'
  UI.SelectStudy     = 'SelectStudy'

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
      <div   class="ikw-logo" id="#{@htmlId('Logo')}"></div>
      <div   class="ikw-corp" id="#{@htmlId('Corp')}">
        <div id="#{@htmlId('Navb')}"></div>
      </div>
      <div   class="ikw-find" id="#{@htmlId('Find')}"></div>
      <div   class="ikw-tocs tocs" id="#{@htmlId('Tocs')}"></div>
      <div   class="ikw-view" id="#{@htmlId('View')}">
        <i id="#{@htmlId('Togg')}" class="fa fa-compress ikw-togg"></i>
      </div>
      <div class="ikw-side" id="#{@htmlId('Side')}"></div>
      <div class="ikw-pref" id="#{@htmlId('Pref')}"><a id="#{@htmlId('ImageLink')}"></a></div>
      <div class="ikw-foot" id="#{@htmlId('Foot')}"></div>
      <div class="ikw-trak" id="#{@htmlId('Trak')}"></div>
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

  notInPlane:() ->
    false

  getHtmlId:( name, ext='' ) ->
    Util.getHtmlId( name, "", ext )

  @readJSON:( url, callback ) ->
    urlLocal  = "http://localhost:63342/jitter/" + url
    settings  = { url:urlLocal, type:'GET', dataType:'json', processData:false, contentType:'application/json', accepts:'application/json' }
    settings.success = ( data,  status, jqXHR ) =>
      Util.noop( status, jqXHR  )
      callback( data )
    settings.error   = ( jqXHR, status, error ) =>
      Util.noop( jqXHR )
      Util.error( "UI.readJSON()", { url:urlLocal, status:status, error:error } )
    $.ajax( settings )
    return

  @isChild:( key ) ->
    a = key.charAt(0)
    a is a.toUpperCase()

  @select:( name, source,        intent="SelectAll" ) ->
    {  name:name, source:source, intent:intent              }

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

