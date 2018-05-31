

`import Util from '../util/Util.js'`
`import UI   from '../ui/UI.js'`

class Prefs
  
  constructor:( @stream ) ->
    @subscribe()
    @choices = @initChoices()
    @id    = ''
    @name  = ''
    @email = ''

  initChoices:() ->
    {
      Flavor: { array:[], beg:-1, end:-1, max:3 },
      Roast:  { array:[], beg:-1, end:-1, max:3 },
      Brew:   { array:[], beg:-1, end:-1, max:3 },
      Drink:  { array:[], beg:-1, end:-1, max:3 },
      Body:   { array:[], beg:-1, end:-1, max:3 },
      Region: { array:[], beg:-1, end:-1, max:3 } }

  subscribe:() ->
    @stream.subscribe( 'Choice', 'Prefs', (choice) => @onChoice(choice) )
    @stream.subscribe( 'Prefs',  'Prefs', (prefs)  => @onPrefs( prefs)  )
    @stream.subscribe( 'Test',   'Prefs', (test)   => @onTest(test)     )   
    return

  onChoice:( choice ) =>
    console.info( 'Summary.onChoice()', choice ) if @stream.isInfo('Choice')
    name  = choice.name
    value = choice.study
    if choice.intent is UI.AddChoice
      @addChoice( name, value )
    else if choice.intent is UI.DelChoice
      @delChoice( name, value )
    return

  addChoice:( name, value ) ->
    choice = @choices[name]
    choice.array.push( value )
    choice.beg++  if choice.end - choice.beg >= choice.max
    choice.end++
    return

  delChoice:( name, value ) ->
    choice = @choices[name]
    index  = choice.array.indexOf(value)
    if choice.beg <= index and index <= choice.end
      choice.array.splice( index, 1 )
      choice.end--
    return

  pubChoice:( name, value, addDel ) ->
    choice = UI.toTopic( name, 'Prefs', UI.addDel, value )
    @stream.publish( 'Choice', choice )
    return

  # Tests can be initiated after all ready() call have completed
  onTest:( testName ) =>
    @onPrefs( @testPrefArrays() ) if testName is 'testPrefArrays'
    return

  # Publish all preference choices
  onPrefs:( prefs ) =>
    console.info( 'Prefs.onPrefs()', prefs ) if @stream.isInfo('Prefs')
    @id      = prefs.id
    @name    = prefs.name
    @email   = prefs.email
    @delChoices()
    @addArrays( prefs.arrays )
    return

  addArrays:( arrays ) ->
    @choices = @initChoices()
    for own name,  array of arrays
      for value in array
        @addChoice( name, value )
        @pubChoice( name, value, UI.AddChoice )
    return

  delChoices:() ->
    for own name,  choice of @choices
      for value in choice.array
        @delChoice( name, value )
        @pubChoice( name, value, UI.DelChoice )
    @choices = {} # Not really needed
    return

  testPrefArrays:() ->
    prefs        = {}
    prefs.id     = '1'
    prefs.name   = 'Human Made'
    prefs.email  = 'customer@gmail.com'
    prefs.arrays = { Flavor:['Chocolate','Nutty'], Roast:['Medium'], Brew:['AutoDrip'], Drink: ['Black'], Body:['Full'], Region:['Brazil'] }
    return

  toSchema:() ->
    schema       = {}
    schema.id    = @id
    schema.name  = @name
    schema.email = @email
    schema.meta  = @toMeta()
    schema

  toMeta:() ->
    meta = {} # Need to see if meta object is correct
    for own key, choice of @choices
      meta[key] = []
      for value in choice.array
        meta[key].push( value )
    meta

  fromSchema:( schema ) ->
    prefs         = {}
    prefs.id      = schema.id
    prefs.name    = schema.name
    prefs.choices = @fromMeta( schema.meta )
    prefs.schema  = schema      # For reviewing data
    prefs

  fromMeta:( metas ) ->
    choices = {}
    for own key, meta of @choices
      choices[meta.key] = meta.key
    choices


  
`export default Prefs`