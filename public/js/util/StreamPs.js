var StreamPs,
  hasProp = {}.hasOwnProperty;

StreamPs = class StreamPs {
  constructor(subjectNames, infoSpec = {}) {
    var i, len, name, ref;
    this.subjectNames = subjectNames;
    this.infoSpec = infoSpec;
    this.subjects = {};
    ref = this.subjectNames;
    for (i = 0, len = ref.length; i < len; i++) {
      name = ref[i];
      this.addSubject(name);
    }
  }

  subscribe(subjectName, subscriberName, onCallback) {
    var subject;
    subject = this.getSubject(subjectName, false);
    subject['subscribers'][subscriberName] = onCallback;
  }

  publish(subjectName, object) {
    var onCallback, ref, subject, subscriberName;
    subject = this.getSubject(subjectName, false);
    ref = subject['subscribers'];
    for (subscriberName in ref) {
      onCallback = ref[subscriberName];
      onCallback(object);
    }
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

  // Needs work
  batchComplete(subjectName) {
    var key, obj, ref, subject;
    subject = this.getSubject(subjectName, false);
    ref = subject.batch;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      obj = ref[key];
      if (!obj['success']) {
        return false;
      }
    }
    return true;
  }

  // Needs work
  complete(subjectName, object, batch) {
    if (this.batchComplete(batch)) {
      this.publish(subjectName, object);
    }
  }

  unsubscribe(subjectName, subscriberName) {
    var subject;
    subject = this.getSubject(subjectName, false);
    if (subject.subscribers[subscriberName] != null) {
      delete subject.subscribers[subscriberName];
    } else {
      console.error('StreamPs.unsubscribe() unknown subscriber name', {
        subject: name,
        subscriberName: subscriberName
      });
    }
  }

  unsubscribeAll() {
    var onCallback, ref, ref1, subject, subjectName, subscriberName;
    ref = this.subjects;
    for (subjectName in ref) {
      if (!hasProp.call(ref, subjectName)) continue;
      subject = ref[subjectName];
      ref1 = subject['subscribers'];
      for (subscriberName in ref1) {
        if (!hasProp.call(ref1, subscriberName)) continue;
        onCallback = ref1[subscriberName];
        this.unsubscribe(subjectName, subscriberName);
      }
    }
  }

  addSubject(subjectName, warn = true) {
    var subject;
    if (!this.hasSubject(subjectName)) {
      subject = {};
      subject['subscribers'] = {};
      subject['batch'] = {};
      this.subjects[subjectName] = subject;
    } else {
      if (warn) {
        console.warn('Stream.addSubject() subject already exists', subjectName);
      }
    }
  }

  hasSubject(subjectName) {
    return this.subjects[subjectName] != null;
  }

  // Get a subject by name. Create a new one if need with a warning
  getSubject(subjectName, warn = true) {
    if (!this.hasSubject(subjectName)) {
      if (warn) {
        console.warn('Stream.getSubject() unknown name for subject so creating one for', subjectName);
      }
      this.addSubject(subjectName, false);
    }
    return this.subjects[subjectName];
  }

  isInfo(infoName) {
    if (false) {
      console.log(infoName);
    }
  }

};

export default StreamPs;
