var StreamXs,
  hasProp = {}.hasOwnProperty;

StreamXs = class StreamXs {
  constructor(subjectNames1, infoSpec = {}) {
    var i, len, name, ref;
    this.subjectNames = subjectNames1;
    this.infoSpec = infoSpec;
    // console.log( window )
    this.xs = window['xstream'];
    this.subjects = {};
    ref = this.subjectNames;
    for (i = 0, len = ref.length; i < len; i++) {
      name = ref[i];
      this.addSubject(name);
    }
  }

  subscribe(name, source = "", onCallback) { // , source=""
    var listener, subject;
    subject = this.getSubject(name, false);
    listener = this.createListener(onCallback);
    subject.stream.addListener(listener);
    subject.listeners[source] = listener;
    if (false) {
      console.log('StreamX.subscribe()', {
        source: source
      });
    }
  }

  publish(name, object) {
    var subject;
    subject = this.getSubject(name, false);
    subject.stream.shamefullySendNext(object);
  }

  event(subjectName, object, element, eventType) {
    var onEvent;
    onEvent = (event) => {
      if (event != null) {
        event.stopPropagation();
      }
      if (event != null) {
        event.preventDefault();
      }
      return this.publish(subjectName, object);
    };
    element.addEventListener(eventType, onEvent);
  }

  complete(completeName, subjectNames, onComplete) {
    console.log(completeName, subjectNames, onComplete);
  }

  createListener(onCallback) {
    return {
      next: function(obj) {
        return onCallback(obj);
      },
      error: function(err) {
        return console.error('xstream error: ', err);
      },
      complete: function() {
        return console.error('xstream complete: ');
      }
    };
  }

  unsubscribe(name, source) { // , source=""
    var subject;
    subject = this.getSubject(name, false);
    if (subject.listeners[source] != null) {
      subject.stream.removeListener(subject.listeners[source]);
    } else {
      console.error('StreamX.unsubscribe() unknown listener source', {
        subject: name,
        source: source
      });
    }
  }

  unsubscribeAll() { // , source=""
    var listenr, name, ref, ref1, source, subject;
    ref = this.subjects;
    for (name in ref) {
      if (!hasProp.call(ref, name)) continue;
      subject = ref[name];
      ref1 = subject.listeners;
      for (source in ref1) {
        if (!hasProp.call(ref1, source)) continue;
        listenr = ref1[source];
        this.unsubscribe(name, source);
      }
    }
  }

  addSubject(name, warn = true) {
    var subject;
    if (!this.hasSubject(name)) {
      subject = {};
      subject['stream'] = this.xs.default.create();
      subject['listeners'] = {};
      this.subjects[name] = subject;
    } else {
      if (warn) {
        console.warn('Stream.addSubject() subject already exists', name);
      }
    }
  }

  hasSubject(name) {
    return this.subjects[name] != null;
  }

  // Get a subject by name. Create a new one if need with a warning
  getSubject(name, warn = true) {
    if (!this.hasSubject(name)) {
      if (warn) {
        console.warn('Stream.getSubject() unknown name for subject so creating one for', name);
      }
      this.addSubject(name, false);
    }
    return this.subjects[name];
  }

  isInfo(infoName) {
    if (false) {
      console.log(infoName);
    }
  }

};

export default StreamXs;
