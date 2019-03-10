
import Util   from '../util/Util.js'
import Stream from '../util/Stream'

class StreamXs

  constructor:( subjectNames, info ) ->
    super(      subjectNames, info )
    @xs = Util.getGlobal('xstream')

  subscribe:( subjectName, subscriberName, onCallback ) ->
    subject  = @getSubject( name, false )
    listener = @createListener(onCallback)
    subject.stream.addListener( listener )
    subject.subscribers[subscriberName] = listener
    if @isInfo( subjectName, 'subscribe' )
      console.info( 'StreanXs.subscribe()', { subject:subjectName, subscriber:subscriberName } )
    return

  publish:( subjectName, object ) ->
    subject = @getSubject( subjectName, false )
    subject.stream.shamefullySendNext( object )
    if @isInfo( subjectName, 'publish')
      console.info( 'StreamXs.publish()', { subject:subjectName, object:object } )
    return

  createListener:( onCallback ) ->
    {
      next:  (obj) -> onCallback(obj)
      error: (err) -> console.error('xstream error: ', err )
      complete:()  -> console.error('xstream complete: '   )
    }

  unsubscribe:( subjectName, subscriberName ) ->    # , source=""
    subject = @getSubject( subjectName, false )
    if @hasSubscriber( subjectName, subscriberName )
       subject.stream.removeListener( subject.subscribers[subscriberName] )
       delete @subjects[subjectName].subscribers[subscriberName]
    else
      console.error( 'StreamX.unsubscribe() unknown listener source', { subject:name, source:source } )
    return

  addSubject:( name, warn=true ) ->
    if not @hasSubject(name)
      subject                = {}
      subject['stream']      = @xs.default.create()
      subject['subscribers'] = {}
      @subjects[name]        = subject
    else
      console.warn( 'Stream.addSubject() subject already exists', name ) if warn
    return

`export default StreamXs`