
import Util from '../util/Util.js'
import UI   from '../ui/UI.js'

class User

  constructor:( @stream, @jitter ) ->
    #@testUrl = "http://demo.wp-api.org/wp-json/wp/v2/users"
    @jittUrl  =   "https://jitterbox.co/wp-json/wp/v2/users"
    @baseUrl  = @jittUrl
    @root     = window.location.origin + '/wp-json/'
    @subscribe()
    Util.noop( @getUrl, @listUsers, @postPrefs )

  subscribe:() ->
    @stream.subscribe( "Prefs", "User", (prefs) => @onPrefs(prefs) )

  onPrefs:( prefs ) =>
    console.info( 'User.onPrefs()', prefs ) if @stream.isInfo('Prefs')
    return

  getPrefs:() ->
    url = @baseUrl+'/1'
    callback = (schema) =>
      @stream.publish( "Prefs", @jitter.schemaToPrefs(schema) )
      return
    @ajax( url, "GET", callback )
    return

  getUrl:( email, method ) ->
    if      method is 'GET' then email + "users"
    else if method is 'PUT' then email + "users"

  listUsers:() ->
    url = @baseUrl
    callback = (list) =>
      @console.log( "User.listUsers()", list )
      return
    @ajax( url, "GET", callback )
    return

  postPrefs:( prefs ) ->
    url = @baseUrl+'/1'
    console.info(   'User.postPrefs() prefs',  { url:url, prefs:prefs   } ) if @stream.isInfo('Prefs')
    callback = (schema) =>
      console.info( 'User.postPrefs() schema', { url:url, schema:schema } ) if @stream.isInfo('Prefs') and schema?
      @getPrefs()
      return
    @ajax( url, "POST", callback, @jitter.prefsToSchema(prefs) )
    return

  ajax:( url, method, callback, data=null ) ->
    return if UI.jQueryHasNotBeenLoaded()
    settings  = {
      url:url, type:method, dataType:'json',  processData:false,
      contentType:'application/json', accepts:'application/json',
      crossDomain:true, xhrFields:{ withCredentials:true } }
    settings.data = JSON.stringify(data) if data?
    settings.success = ( data,  status, jqXHR ) =>
      Util.noop( status, jqXHR )
      callback( data )
      return
    settings.error   = ( jqXHR, status, error ) =>
      Util.noop( jqXHR )
      console.error( "User.ajax()", { url:url, method:method, status:status, error:error } )
      return
    $.ajax( settings )
    return

  ###

  nonceData:( email ) ->
    'action=get_posts_commented&amp;email='+email+'&amp;security='+@nonce()


  nonce:() ->
    'XxYxZz' # 'wp_rest'

  if method is 'POST'
    settings.headers = { 'X-WP-Nonce':@nonce() }
  settings.beforeSend = ( xhr ) =>
    xhr.setRequestHeader( {'Accept':'*'} ) # 'Access-Control-Allow-Origin:', '*' X-WP-Nonce', @nonce() )
  settings.xhrFields = { withCredentials: false }

  @settings = {
    root:          "esc_url_raw( get_rest_url() )"
    nonce:         "wp_create_nonce( 'wp_rest' )"
    versionString: "wp/v2/"
    schema:        "$schema"
    cacheSchema:   true }

  ###

`export default User`