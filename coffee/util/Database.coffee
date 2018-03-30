
class Database

  Util.Database = Database

  @localImageURI = 'http://localhost:63342/ui/img/aaa'
  @localDataURI  = 'http://localhost:63342/ui/data'
  @nodejDataURI  = 'file://Users/ax/Documents/prj/ui/data'
  @fileURI       =       '/Users/ax/Documents/prj/ui/data'
  #nodejDataURI = 'file:../../data'

  @dataURI:() ->
    if Util.isCommonJS then Database.nodejDataURI else Database.localDataURI

  @Databases = {
    color: {
      id:"color"
      key:"id"
      uriLoc:@localDataURI+'/color'
      uriWeb:'https://github.com/axiom6/ui/data/color'
      tables:['master','ncs','gray'] }
    exit: {
      id:"exit"
      key:"_id"
      uriLoc:@localDataURI+'/exit'
      uriWeb:'https://github.com/axiom6/ui/data/exit'
      tables:['ConditionsEast','ConditionsWest','Deals','Forecasts','I70Mileposts','SegmentsEast','SegmentsWest'] }
    radar:{
      id:"radar"
      key:"name"
      uriLoc:@localDataURI+'/radar'
      uriWeb:'https://github.com/axiom6/ui/data/radar'
      tables:['axiom-techs','axiom-quads','axiom-techs-schema','axiom-quads-schema','polyglot-principles'] }
    sankey:{
      id:"radar"
      uriLoc:@localDataURI+'/sankey'
      uriWeb:'https://github.com/axiom6/ui/data/sankey'
      tables:['energy','flare','noob','plot'] }
    muse:{
      id:"muse"
      uriLoc:@localDataURI+'/muse'
      uriWeb:'https://github.com/axiom6/ui/data/muse'
      tables:['Columns','Rows','Practices'] }
    pivot:{
      id:"pivot"
      uriLoc:@localDataURI+'/pivot'
      uriWeb:'https://github.com/axiom6/ui/data/pivot'
      tables:['mps'] }
    geo:{
      id:"geo"
      uriLoc:@localDataURI+'/geo'
      uriWeb:'https://github.com/axiom6/ui/data/geo'
      tables:['upperLarimerGeo']
      schemas:['GeoJSON'] }
    f6s:{
      id:"f6s"
      uriLoc:@localDataURI+'/f6s'
      uriWeb:'https://github.com/axiom6/ui/data/fs6'
      tables:['applications','followers','mentors','profile','teams'] }
  }

  # ------ Quick JSON access ------

  @read:( url, doJson ) ->
    if Util.isObj( url )
      Database.readFile( url, doJson )
    else if 'file:' is Util.parseURI( uri ).protocol
      Database.readRequire( url, doJson )
    else
      Database.readAjax( url, doJson )
    return

  @readFile:( fileObj, doJson ) ->
    fileReader = new FileReader()
    fileReader.onerror = (e) -> Util.error( 'Store.readFile', fileObj.name, e.target.error )
    fileReader.onload  = (e) -> doJson( JSON.parse(e.target.result) )
    fileReader.readAsText( fileObj )
    return

  @readRequire:( url, doJson ) ->
    path = url.substring(5)
    json = Util.require( path ) # Util.require prevents dynamic resolve in webpack
    if json?
      doJson( json )
    else
      Util.error( 'Store.req require(json)  failed for url', url )
    return

  @readAjax:( url, doJson ) ->                   #jsonp
    settings  = { url:url, type:'get', dataType:'json', processData:false, contentType:'application/json', accepts:'application/json' }
    settings.success = ( data,  status, jqXHR ) =>
      Util.noop( status, jqXHR )
      json   = JSON.parse( data )
      doJson( json )
    settings.error   = ( jqXHR, status, error ) =>
      Util.error( 'Store.ajaxGet', { url:url, status:status, error:error } )
    $.ajax( settings )
    return

  # A quick in and out method to select JSON data
  @selectJson:( stream, uri, table, doData ) ->
    rest = new Store.Rest( stream, uri )
    rest.remember()
    rest.select( table )
    rest.subscribe( table, 'none', 'select', doData )