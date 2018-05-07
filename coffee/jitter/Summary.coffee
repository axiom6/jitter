
`import UI   from '../ui/UI.js'`
`import Dom  from '../ui/Dom.js'`

class Summary

  constructor:( @stream, @ui, @name, @jitter=null ) ->
    @ui.addContent( @name, @ )
    @btns = {}

  readyPane:() =>
    @$pane = Dom.tree( @stream, @spec, @, 6, 13 )
    @subscribe()
    @$pane

  readyView:() =>
    src = "img/summary/Summary.jpg"
    @$view = $( """<div #{Dom.panel(0, 0,100,100)}></div>""" )
    @$view.append( "<h1 #{Dom.label(0, 0,100, 10)}>Summary</h1>" )
    @$view.append( """  #{Dom.image(src,@pane.toVh(80),@pane.toVw(80))}""" )
    @$view

  subscribe:() ->
    @stream.subscribe( 'Prefs',  'Summary',  (prefs)  => @onPrefs( prefs)  ) if @jitter?
    @stream.subscribe( 'Choice', 'Summary',  (choice) => @onChoice(choice) ) if @name is 'Summary'
    @stream.subscribe( 'Choice', 'Summarys', (choice) => @onChoice(choice) ) if @name is 'Summarys'
    @stream.subscribe( 'Test',   'Summary',  (test)   => @onTest(test)     ) if @jitter?
    return

  onChoice:( choice ) =>
    specStudy  = @spec[choice.name]
    return if not specStudy? # or choice.source is 'Summary'
    console.info( 'Summary.onChoice()', choice ) if @jitter? and @stream.isInfo('Choice')
    htmlId = @ui.getHtmlId( choice.name, 'Choice',  choice.study )
    value  = if choice.value? then ":"+choice.value else ""
    $e = @btns[choice.name].$e
    if choice.intent is UI.AddChoice
      $e.append("""<div id="#{htmlId}" style="color:yellow; padding-left:12px; font-size:12px; line-height:14px;">#{choice.study+value}</div>""" )
    else
      $e.find('#'+htmlId).remove()
    return

  # Tests can be initiated after all ready() call have completed
  onTest:( test ) =>
    @onPrefs( @testPrefs() ) if test is 'Prefs'
    return

  # Publish all preference choices
  onPrefs:( prefs ) =>
    return if not @jitter? # Insure that only the primary summary publishes choices
    console.info( 'Summary.onPrefs()', prefs ) if @stream.isInfo('Prefs')
    for own key,   array of prefs.choices
      for   chc in array
        choice = UI.select( key, 'Summary', UI.AddChoice, chc )
        @stream.publish( 'Choice', choice )
    return

  initPrefs:() ->
    prefs         = {}
    prefs.id      = ''
    prefs.name    = ''
    prefs.email   = ''
    prefs.choices = {
      Region:[], Flavor:[], Roast:[],
      Brew:  [], Drink: [], Body: [] }
    prefs

  testPrefs:() ->
    prefs         = {}
    prefs.id      = '1'
    prefs.name    = 'Human Made'
    prefs.email   = 'customer@gmail.com'
    prefs.choices = {
      Region:['Brazil'],   Flavor:['Chocolate','Nutty'], Roast:['Medium'],
      Brew:  ['AutoDrip'], Drink: ['Black'],             Body: ['Full'] }
    prefs

  prefsToSchema:( prefs ) ->
    schema      = {}
    schema.id   = prefs.id
    schema.name = prefs.name
    schema.meta = @choicesToMetas( prefs.choices )
    schema

  schemaToPrefs:( schema ) ->
    prefs = {}
    prefs.id      = schema.id
    prefs.name    = schema.name
    prefs.choices = @metasToChoices( schema.meta )
    prefs.schema  = schema      # For reviewing data
    prefs

  metasToChoices:( metas ) ->
    choices = {}
    for meta in metas
      choices[meta.key] = meta.key
    choices

  choicesToMetas:( choices ) ->
    metas = []
    for own key, choice of choices
      metas.push( { key:choice } )
    metas

`export default Summary`