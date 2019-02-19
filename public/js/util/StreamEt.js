
class StreamEt {

  // Construct a list of subjects as an object
  constructor( subjectNames ) {
    this.subjects = {};
    for ( let name of subjectNames ) {
      this.addSubject(name);
    }
  }

  // Add a named subsciber callback to a subject
  subscribe( subjectName, subscriberName, onCallback ) {
    let subject = this.getSubject( subjectName, false );
    subject['subscribers'][subscriberName] = onCallback;
  }

  // Publish an object to all subscribers by invoking their callbacks
  publish( subjectName, object ) {
    let subject     = this.getSubject(subjectName, false);
    let onCallbacks = Object.values(subject['subscribers']);
    for( let onCallback of onCallbacks ) {
      onCallback(object);
    }
  }

  // Create an event listener to publishes an object
  event( subjectName, object, element, eventType ) {
    let onEvent = (event) => {
      if( event != null ) { event.stopPropagation(); }
      if( event != null ) { event.preventDefault();  }
      return this.publish( subjectName, object );
    };
    element.addEventListener( eventType, onEvent );
  }

  // Delete a subscriber
  unsubscribe( subjectName, subscriberName ) {
    let subject = this.getSubject( subjectName, false );
    if(      subject.subscribers[subscriberName] != null ) {
      delete subject.subscribers[subscriberName];
    } else {
      console.error('StreamEt.unsubscribe() unknown subscriber name', { subject: name, subscriberName: subscriberName });
    }
  }

  // Delete all subcribers. Call when a new Dom is create for an entire page
  unsubscribeAll() {
    for( let [subjectName,subject] of Object.entries(this.subjects) ) {
      for( subscriberName of Object.keys(subject['subscribers']) ) {
        this.unsubscribe( subjectName, subscriberName );
      }
    }
  }

  addSubject( subjectName, warn = true ) {
    if( !this.hasSubject(subjectName) ) {
      let subject            = {};
      subject['subscribers'] = {};
      this.subjects[subjectName] = subject;
    }
    else if(warn) {
        console.warn('Stream.addSubject() subject already exists', subjectName );
    }
  }

  hasSubject( subjectName ) {
    return this.subjects[subjectName] != null;
  }

  // Get a subject by name. Create a new one if need with a warning
  getSubject( subjectName, warn=true ) {
    if (!this.hasSubject(subjectName)) {
      if (warn) {
        console.warn('Stream.getSubject() unknown name for subject so creating one for', subjectName);
      }
      this.addSubject(subjectName, false);
    }
    return this.subjects[subjectName];
  }

}

export default StreamEt;
