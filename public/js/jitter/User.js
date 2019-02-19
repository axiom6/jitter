var User;

import Util from '../util/Util.js';

import UI from '../ui/UI.js';

User = class User {
  constructor(stream, jitter) {
    this.onPrefs = this.onPrefs.bind(this);
    this.stream = stream;
    this.jitter = jitter;
    //@testUrl = "http://demo.wp-api.org/wp-json/wp/v2/users"
    this.jittUrl = "https://jitterbox.co/wp-json/wp/v2/users";
    this.baseUrl = this.jittUrl;
    this.root = window.location.origin + '/wp-json/';
    this.subscribe();
    Util.noop(this.getUrl, this.listUsers, this.postPrefs);
  }

  subscribe() {
    return this.stream.subscribe("Prefs", "User", (prefs) => {
      return this.onPrefs(prefs);
    });
  }

  onPrefs(prefs) {
    if (this.stream.isInfo('Prefs')) {
      console.info('User.onPrefs()', prefs);
    }
  }

  getPrefs() {
    var callback, url;
    url = this.baseUrl + '/1';
    callback = (schema) => {
      this.stream.publish("Prefs", this.jitter.schemaToPrefs(schema));
    };
    this.ajax(url, "GET", callback);
  }

  getUrl(email, method) {
    if (method === 'GET') {
      return email + "users";
    } else if (method === 'PUT') {
      return email + "users";
    }
  }

  listUsers() {
    var callback, url;
    url = this.baseUrl;
    callback = (list) => {
      this.console.log("User.listUsers()", list);
    };
    this.ajax(url, "GET", callback);
  }

  postPrefs(prefs) {
    var callback, url;
    url = this.baseUrl + '/1';
    if (this.stream.isInfo('Prefs')) {
      console.info('User.postPrefs() prefs', {
        url: url,
        prefs: prefs
      });
    }
    callback = (schema) => {
      if (this.stream.isInfo('Prefs') && (schema != null)) {
        console.info('User.postPrefs() schema', {
          url: url,
          schema: schema
        });
      }
      this.getPrefs();
    };
    this.ajax(url, "POST", callback, this.jitter.prefsToSchema(prefs));
  }

  ajax(url, method, callback, data = null) {
    var settings;
    if (UI.jQueryHasNotBeenLoaded()) {
      return;
    }
    settings = {
      url: url,
      type: method,
      dataType: 'json',
      processData: false,
      contentType: 'application/json',
      accepts: 'application/json',
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      }
    };
    if (data != null) {
      settings.data = JSON.stringify(data);
    }
    settings.success = (data, status, jqXHR) => {
      Util.noop(status, jqXHR);
      callback(data);
    };
    settings.error = (jqXHR, status, error) => {
      Util.noop(jqXHR);
      console.error("User.ajax()", {
        url: url,
        method: method,
        status: status,
        error: error
      });
    };
    $.ajax(settings);
  }

};

/*

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

*/
export default User;
