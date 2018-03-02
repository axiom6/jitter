
window.$  = require('jquery' )
window.Rx = require('rx')
RxJQ      = require('lib/custom/rx.jquery' )  # rx.jquery attaches to jQuery so RxJS is not used directly

class Stream

  # console.log( 'Stream', window, Util, Util.log?, Util.myVar )
  module.exports = Stream # Util.Export( Stream, 'util/Stream' )
  Stream.SubjectNames  = ['Select','Content','Connect','Test','Plane','About','Slide',
                          'Cursor','Navigate','Settings','Submit','Toggle','Layout']
  Util.noop( RxJQ )

  constructor:( @subjectNames=Stream.SubjectNames ) ->
    Util.error( 'Stream rxjs-jquery not defined' ) if not $().bindAsObservable? # # Special case
    @subjects = {}
    for name in @subjectNames
      @subjects[name] = new Rx.Subject()
    @counts = {}

  logSubjects:() ->
    for key, obj of @subjects
       Util.log( 'Stream.logSubjects', key )

  # Get a subject by name. Create a new one if need with a warning
  getSubject:( name, warn=false ) ->
    if @subjects[name]?
       @subjects[name]
    else
      Util.warn( 'Stream.getSubject() unknown subject so returning new subject for', name ) if warn
      @subjects[name] = new Rx.Subject()
    @subjects[name]

  resetSubject:( name, subject ) ->
    @subjects[name] = subject

  subscribe:( name, onNext, onError=@onError, onComplete=@onComplete ) ->
    subject = @getSubject( name, false ) # Many subscribers come before publishers
    subject.subscribe( onNext, onError, onComplete )
    return

  publish:( name, topic, jQuerySelector=null, eventType=null ) ->
    if not jQuerySelector? or not eventType?
      subject = @getSubject(  name )
      subject.mapTo( topic )
    else
      @publishEvent( name, topic, jQuerySelector, eventType )
    return

  # Publishes topic on event through rxjs-jquery event for a jQuerySelector dom element
  publishEvent:( name, topic, jQuerySelector, eventType ) ->
    subject = @getSubject(  name )
    onNext  = ( event ) =>
      @processEvent(  event )
      object  = if topic? then topic else event.target.value
      subject.onNext( object )
      # Util.log( 'Stream.event', object )
    @bindEvent( onNext, jQuerySelector, eventType )
    return

  bindEvent:( onNext, jQuerySelector, eventType ) ->
    rxjq = @createRxJQuery( jQuerySelector )
    if $().bindAsObservable?
      observable    = rxjq.bindAsObservable( eventType )
      observable.subscribe( onNext, @onError, @onComplete )
    else
      Util.error( 'Stream rxjs-jquery not defined for bindEvent()' )
    return

  unsubscribe:( name ) ->
    subject = @getSubject(  name )
    subject.unsubscribe()
    return

  complete:(completeSubject, subjects, onComplete ) ->
    @counts[completeSubject] = {}
    @counts[completeSubject].count = 0
    objects = []
    onNext = (object) =>
      objects.push( object )
      @counts[completeSubject].count++
      if @counts[completeSubject].count is subjects.length
         @counts[completeSubject].count = 0
         if typeof onComplete is 'function' then onComplete(objects) else publish( completeSubject, objects )
    for subject in subjects
      @subscribe( subject, onNext )
    return

  concat:( name, sources, onComplete ) ->
    subs = []
    for source in sources
      sub = @getSubject(source).take(1)
      subs.push( sub )
    @subjects[name] = Rx.Observable.concat( subs ).take(subs.length)
    #Util.log( 'Stream.concat() subs.length', subs.length )
    onNext = (object) ->
      params = if object.params? then object.params else 'none'
      Util.noop( params )
      #Util.log( 'Stream.concat() onNext params', params )
    onError = (error) ->
      Util.log( 'Stream.concat() onError', error )
    @subscribe( name, onNext, onError, onComplete )
    return

  onerror:( name, object ) ->
    subject = @getSubject(  name )
    subject.onError( object )
    return

  topicValue:( topic, value ) ->
    object = {}
    object.topic = topic
    object.value = value
    object

  isJQuery:( $elem ) ->
    $ = window.$
    $? and $elem? and ( $elem instanceof $ || 'jquery' in Object($elem) )

  isEmpty:( $elem ) ->
    $elem?.length is 0

  createRxJQuery:( jQuerySelector ) ->
    if @isJQuery(  jQuerySelector )
       Util.warn("Stream.createRxJQuery() selector #{jQuerySelector.selector} empty" ) if @isEmpty(jQuerySelector)
       jQuerySelector
    else if Util.isStr( jQuerySelector )
       $(jQuerySelector)
    else
       Util.error('Stream.createRxJQuery( jqSel )', typeof(jQuerySelector), jQuerySelector, 'jQuerySelector is neither jQuery object nor selector' )
       $()

  onNext:( object ) ->
    Util.noop( object )

  onError:( error ) ->
    Util.error( 'Stream.onError()', error )

  onComplete:() ->
    Util.dbg(   'Stream.onComplete()', 'Completed' )

  processEvent:( event ) ->
    event?.stopPropagation()                   # Will need to look into preventDefault
    event?.preventDefault()
    return

  drag:( jqSel ) ->

    dragTarget = @createRxJQuery( jqSel )  # Note $jQuery has to be made reative with rxjs-jquery

    # Get the three major events
    mouseup   =  dragTarget.bindAsObservable("mouseup"  ).publish().refCount()
    mousemove = $(document).bindAsObservable("mousemove").publish().refCount()
    mousedown =  dragTarget.bindAsObservable("mousedown").publish().refCount().map( (event) -> # calculate offsets when mouse down
      event.preventDefault()
      left: event.clientX - dragTarget.offset().left
      top:  event.clientY - dragTarget.offset().top  )

    # Combine mouse down with mouse move until mouse up
    mousedrag = mousedown.selectMany( (offset) ->
      mousemove.map( (pos) ->  # calculate offsets from mouse down to mouse moves
        left: pos.clientX - offset.left
        top:  pos.clientY - offset.top
      ).takeUntil mouseup )

    # Update position subscription =
    mousedrag.subscribe( (pos) -> dragTarget.css( { top:pos.top, left:pos.left } ) )

  ###
  streamFibonacci:() ->
    source = Rx.Observable.from( @fibonacci() ).take(10)
    source.subscribe( (x) -> Util.dbg( 'Text.Stream.Fibonacci()', x ) )

  # RxJS Experiments
  fibonacci:() ->
    fn1 = 1
    fn2 = 1
    while 1
      current = fn2;
      fn2 = fn1
      fn1 = fn1 + current
      yield current


  eventTopic:( event ) ->
    topic = 'Down'
    topic = 'Left'  if event.which is 37
    topic = 'Up'    if event.which is 38
    topic = 'Right' if event.which is 39
    topic = 'Down'  if event.which is 40
    topic

  # rxjs-jquery patch
  $ = $ || global.$ || window.$;
  var root = global.Rx || window.Rx,
  ###