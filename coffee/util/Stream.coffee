
`import Util from '../util/Util.js'`

class Stream

  constructor:( @bundleNames, @infoSpec ) ->
    @bundles = {}
    for name in @bundleNames
      @bundles[name] = @createBundle()
    @counts = {}
    
  createBundle:( ) ->
    bundle             = {}
    bundle.subject     = new Rx.Subject()
    bundle.subscribers = {}
    bundle

  # Get a subject by name. Create a new one if need with a warning
  getBundle:( name, warn=true ) ->
    if not @bundles[name]?
      console.warn( 'Stream.getBundle() unknown name for bundle subject so creating one for', name ) if warn
      @bundles[name] = @createBundle()
    @bundles[name]

  getSubscriber:( name, source, issueError ) ->
    if not ( @bundles[name]? and @bundles[name].subscriber[source]? )
      console.error( 'Stream.getSubscriber() unknown subscriber', name ) if issueError
      null
    else
      @bundles[name].subscriber[source]

  subscribe:( name, source, next, onError=@onError, onComplete=@onComplete ) ->
    bundle = @getBundle( name, false )
    bundle.subscribers[source] = bundle.subject.subscribe( next, onError, onComplete )
    if @infoSpec.subscribe and @isInfo(name)
      console.info( 'Strean.subscribe()', { subject:name, subscriber:source } )
    return

  publish:( name, topic, jQuerySelector=null, eventType=null, htmlId="" ) ->
    if jQuerySelector? and eventType? and htmlId?
      @publishEvent( name, topic, jQuerySelector, eventType, htmlId )
    else
      subject = @getBundle(name).subject
      if @infoSpec.publish and @isInfo(name)
        console.info( 'Strean.publish()', { subject:name, topic:topic } )
      subject.next( topic )
    return

  publishEvent:( name, topic, jQuerySelector, eventType, htmlId="" ) ->
    subject  = @getBundle(name).subject
    element  = @domElement( jQuerySelector, htmlId )
    return if @notElement( element, name )
    onEvent  = ( event ) =>
      @processEvent( event )
      subject.next(  topic )
    element.addEventListener( eventType, onEvent )
    return

  unsubscribeAll:() ->
    for   own kbun, bundle     of @bundles
      for own ksub, subscriber of bundle.subscribers
        @unsubscribe( kbun, ksub )
    return

  unsubscribe:( name, source ) ->
    if   @bundles[name]?
      if @bundles[name].subscribers[source]?
         @bundles[name].subscribers[source].unsubscribe()
      else
         console.error( 'Strean.unsubscribe() unknown subscriber', { subject:name, subscriber:source } )
    else
      console.error(    'Strean.unsubscribe() unknown subject',    { subject:name, subscriber:source } )

    if @infoSpec.subscribe and @isInfo(name)
      console.info( 'Strean.unsubscribe()', { subject:name, subscriber:source } )
    return

  isInfo:( name ) ->
    Util.inArray(@infoSpec.subjects,name)

  notElement:( element, name ) ->
    status = element? and element.id? and Util.isStr( element.id )
    console.log( 'Stream.notElement()', name ) if not status
    not status

  processEvent:( event ) ->
    event?.stopPropagation()                   # Will need to look into preventDefault
    event?.preventDefault()
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
         if typeof onComplete is 'function' then onComplete(objects) else @publish( completeSubject, objects )
    for subject in subjects
      @subscribe(  subject, onNext )
    return

  concat:( name, sources, onComplete ) ->
    subs = []
    for source in sources
      sub = @getSubject(source).take(1)
      subs.push( sub )
    @bundles[name] = Rx.Observable.concat( subs ).take(subs.length)
    #console.log( 'Stream.concat() subs.length', subs.length )
    onNext = (object) ->
      params = if object.params? then object.params else 'none'
      Util.noop( params )
      #console.log( 'Stream.concat() next params', params )
    onError = (err) ->
      console.error( 'Stream.concat() error', err)
    @subscribe( name, onNext, onError, onComplete )
    return

  isJQuery:( $elem ) ->
    $? and $elem? and ( $elem instanceof $ || 'jquery' in Object($elem) )

  isEmpty:( $elem ) ->
    $elem?.length is 0

  domElement:( jQuerySelector, htmlId="" ) ->
    if @isJQuery(  jQuerySelector )
       console.warn("Stream.domElement() jQuerySelector empty", { htmlId:htmlId } ) if @isEmpty(jQuerySelector)
       console.trace()                                                              if @isEmpty(jQuerySelector)
       jQuerySelector.get(0)
    else if Util.isStr( jQuerySelector )
       $(jQuerySelector).get(0)
    else
       console.error('Stream.domElement( jqSel )', typeof(jQuerySelector), jQuerySelector, 'jQuerySelector is neither jQuery object nor selector', { htmlId:htmlId } )
       $().get(0)

  onNext:( object ) ->
    console.log(   'Stream.onNext()',     object      )

  onError:( error ) ->
    console.error( 'Stream.onError()',    error       )

  onComplete:()     ->
    console.log(   'Stream.onComplete()', 'Completed' )

  infoSubjects:() ->
    for key, obj of @bundles
      console.info( 'Stream.logSubjects', key )

  drag:( jqSel ) ->

    dragTarget = @createRxJQuery( jqSel )  # Note $jQuery has to be made reative with rxjs-jquery

    # Get the three major events
    mouseup   =  dragTarget.bindAsObservable("mouseup"  ).publish().refCount()
    mousemove = $(document).bindAsObservable("mousemove").publish().refCount()
    mousedown =  dragTarget.bindAsObservable("mousedown").publish().refCount().map( (event) -> # calculate offsets when mouse down
      event.preventDefault()
      left: event['clientX'] - dragTarget.offset().left
      top:  event['clientY'] - dragTarget.offset().top  )

    # Combine mouse down with mouse move until mouse up
    mousedrag = mousedown.selectMany( (offset) ->
      mousemove.map( (pos) ->  # calculate offsets from mouse down to mouse moves
        left: pos.clientX - offset.left
        top:  pos.clientY - offset.top
      ).takeUntil mouseup )

    # Update position subscription =
    mousedrag.subscribe( (pos) -> dragTarget.css( { top:pos.top, left:pos.left } ) )

  ###
  eventTopic:( event ) ->
    topic = 'Down'
    topic = 'Left'  if event.which is 37
    topic = 'Up'    if event.which is 38
    topic = 'Right' if event.which is 39
    topic = 'Down'  if event.which is 40
    topic
  ###

`export default Stream`