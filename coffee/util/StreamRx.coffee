
import Util   from '../util/Util.js'
import Stream from '../util/Stream'

class StreamRx extends Stream

  constructor:( subjectNames, info ) ->
    super(      subjectNames, info )
    @Rx = Util.getGlobal('Rx')
    Util.noop( @onNext )

  subscribe:( subjectName, subscriberName, onCallback ) ->
    subject = @getSubject( subjectName, true )
    subject.subscribers[subscriberName] = subject.subjectRx.subscribe( onCallback, @onError, @onComplete )
    if @isInfo( subjectName, 'subscribe' )
      console.info( 'StreanRx.subscribe()', { subject:subjectName, subscriber:subscriberName } )
    return

  publish:( subjectName, object ) ->
    subjectRx = @getSubject(subjectName).subjectRx
    subjectRx.next( object )
    if @isInfo( subjectName, 'publish' )
      console.info( 'StreanRx.publish()', { subject:subjectName, object:object } )
    return

  addSubject:( subjectName, warn=true ) ->
    if not @hasSubject( subjectName )?
      subject             = {}
      subject.subjectRx   = new @Rx.Subject()
      subject.subscribers = {}
      @subjects[subjectName] = subject
    else if warn
      console.warn( 'StreamRx.addSubject() subject already exists', subjectName )
    return

  onNext:( object ) ->
    console.info(   'Stream.onNext()',     object      )

  onError:( error ) ->
    console.error( 'Stream.onError()',    error       )

  onComplete:()     ->
    console.info(   'Stream.onComplete()', 'Completed' )

`export default StreamRx`
