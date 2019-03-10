var StreamRx;

import Util from '../util/Util.js';

import Stream from '../util/Stream';

StreamRx = class StreamRx extends Stream {
  constructor(subjectNames, info) {
    super(subjectNames, info);
    this.Rx = Util.getGlobal('Rx');
    Util.noop(this.onNext);
  }

  subscribe(subjectName, subscriberName, onCallback) {
    var subject;
    subject = this.getSubject(subjectName, true);
    subject.subscribers[subscriberName] = subject.subjectRx.subscribe(onCallback, this.onError, this.onComplete);
    if (this.isInfo(subjectName, 'subscribe')) {
      console.info('StreanRx.subscribe()', {
        subject: subjectName,
        subscriber: subscriberName
      });
    }
  }

  publish(subjectName, object) {
    var subjectRx;
    subjectRx = this.getSubject(subjectName).subjectRx;
    subjectRx.next(object);
    if (this.isInfo(subjectName, 'publish')) {
      console.info('StreanRx.publish()', {
        subject: subjectName,
        object: object
      });
    }
  }

  addSubject(subjectName, warn = true) {
    var subject;
    if (this.hasSubject(subjectName) == null) {
      subject = {};
      subject.subjectRx = new this.Rx.Subject();
      subject.subscribers = {};
      this.subjects[subjectName] = subject;
    } else if (warn) {
      console.warn('StreamRx.addSubject() subject already exists', subjectName);
    }
  }

  onNext(object) {
    return console.info('Stream.onNext()', object);
  }

  onError(error) {
    return console.error('Stream.onError()', error);
  }

  onComplete() {
    return console.info('Stream.onComplete()', 'Completed');
  }

};

export default StreamRx;
