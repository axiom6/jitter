var StreamRx,
  hasProp = {}.hasOwnProperty;

import Util from '../util/Util.js';

StreamRx = class StreamRx {
  constructor(bundleNames, infoSpec) {
    var i, len, name, ref;
    this.bundleNames = bundleNames;
    this.infoSpec = infoSpec;
    this.Rx = Util.getGlobal('Rx');
    this.bundles = {};
    ref = this.bundleNames;
    for (i = 0, len = ref.length; i < len; i++) {
      name = ref[i];
      this.addSubject(name);
    }
    this.counts = {};
    Util.noop(this.logSubjects, this.onNext, this.infoSubjects, this.getSubscriber);
  }

  createSubject() {
    var bundle;
    bundle = {};
    bundle.subject = new this.Rx.Subject();
    bundle.subscribers = {};
    return bundle;
  }

  addSubject(name, warn = true) {
    if (this.bundles[name] == null) {
      this.bundles[name] = this.createSubject();
    } else {
      if (warn) {
        console.warn('Stream.addSubject() bundle subject already exists', name);
      }
    }
  }

  hasSubject(name) {
    return this.bundles[name] != null;
  }

  logSubjects() {
    var bundle, key, ref;
    console.log('Stream.Subjects --- ');
    ref = this.bundles;
    for (key in ref) {
      bundle = ref[key];
      console.log(`  Subject ${key}`);
    }
  }

  // Get a subject by name. Create a new one if need with a warning
  getSubject(name, warn = true) {
    if (this.bundles[name] == null) {
      if (warn) {
        console.warn('Stream.getSubject() unknown name for bundle subject so creating one for', name);
      }
      this.addSubject(name, false);
    }
    return this.bundles[name];
  }

  getSubscriber(name, source, issueError) {
    if (!((this.bundles[name] != null) && (this.bundles[name].subscriber[source] != null))) {
      if (issueError) {
        console.error('Stream.getSubscriber() unknown subscriber', name);
      }
      return null;
    } else {
      return this.bundles[name].subscriber[source];
    }
  }

  subscribe(name, source, next, onError = this.onError, onComplete = this.onComplete) {
    var bundle;
    bundle = this.getSubject(name, false);
    bundle.subscribers[source] = bundle.subject.subscribe(next, onError, onComplete);
    if (this.infoSpec.onInit && this.isInfo(name)) {
      console.info('Strean.subscribe()', {
        subject: name,
        subscriber: source
      });
    }
  }

  publish(name, topic) {
    var subject;
    subject = this.getSubject(name).subject;
    subject.next(topic);
    if (this.infoSpec.onInit && this.isInfo(name)) {
      console.info('Strean.publish()', {
        subject: name,
        topic: topic
      });
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

  unsubscribeAll() {
    var bundle, kbun, ksub, ref, ref1, subscriber;
    ref = this.bundles;
    for (kbun in ref) {
      if (!hasProp.call(ref, kbun)) continue;
      bundle = ref[kbun];
      ref1 = bundle.subscribers;
      for (ksub in ref1) {
        if (!hasProp.call(ref1, ksub)) continue;
        subscriber = ref1[ksub];
        this.unsubscribe(kbun, ksub);
      }
    }
  }

  unsubscribe(name, source) {
    if (this.bundles[name] != null) {
      if (this.bundles[name].subscribers[source] != null) {
        this.bundles[name].subscribers[source].unsubscribe();
      } else {
        console.error('Strean.unsubscribe() unknown subscriber', {
          subject: name,
          subscriber: source
        });
      }
    } else {
      console.error('Strean.unsubscribe() unknown subject', {
        subject: name,
        subscriber: source
      });
    }
    if (this.infoSpec.onInit && this.infoSpec.subscribe && this.inInfo(name)) {
      console.info('Strean.unsubscribe()', {
        subject: name,
        subscriber: source
      });
    }
  }

  inInfo(name) {
    return Util.inArray(this.infoSpec.subjects, name);
  }

  isInfo(name) {
    return this.infoSpec.publish && this.inInfo(name);
  }

  complete(completeSubject, subjects, onComplete) {
    var i, len, objects, onNext, subject;
    this.counts[completeSubject] = {};
    this.counts[completeSubject].count = 0;
    objects = [];
    onNext = (object) => {
      objects.push(object);
      this.counts[completeSubject].count++;
      if (this.counts[completeSubject].count === subjects.length) {
        this.counts[completeSubject].count = 0;
        if (typeof onComplete === 'function') {
          return onComplete(objects);
        } else {
          return this.publish(completeSubject, objects);
        }
      }
    };
    for (i = 0, len = subjects.length; i < len; i++) {
      subject = subjects[i];
      this.subscribe(subject, onNext);
    }
  }

  concat(name, sources, onComplete) {
    var i, len, onError, onNext, source, sub, subs;
    subs = [];
    for (i = 0, len = sources.length; i < len; i++) {
      source = sources[i];
      sub = this.getSubject(source).take(1);
      subs.push(sub);
    }
    this.bundles[name] = this.Rx.Observable.concat(subs).take(subs.length);
    //console.log( 'Stream.concat() subs.length', subs.length )
    onNext = function(object) {
      var params;
      params = object.params != null ? object.params : 'none';
      return Util.noop(params);
    };
    //console.log( 'Stream.concat() next params', params )
    onError = function(err) {
      return console.error('Stream.concat() error', err);
    };
    this.subscribe(name, onNext, onError, onComplete);
  }

  onNext(object) {
    return console.log('Stream.onNext()', object);
  }

  onError(error) {
    return console.error('Stream.onError()', error);
  }

  onComplete() {
    return console.log('Stream.onComplete()', 'Completed');
  }

  infoSubjects() {
    var key, obj, ref, results;
    ref = this.bundles;
    results = [];
    for (key in ref) {
      obj = ref[key];
      results.push(console.info('Stream.logSubjects', key));
    }
    return results;
  }

};

export default StreamRx;
