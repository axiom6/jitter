// Generated by CoffeeScript 1.6.3
(function() {
  var Stream,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Stream = (function() {
    Util.Stream = Stream;

    Stream.SubjectNames = ['Select', 'Content', 'Connect', 'Test', 'Plane', 'About', 'Slide', 'Cursor', 'Navigate', 'Settings', 'Submit', 'Toggle', 'Layout'];

    function Stream(subjectNames) {
      var name, _i, _len, _ref;
      this.subjectNames = subjectNames != null ? subjectNames : Stream.SubjectNames;
      this.subjects = {};
      _ref = this.subjectNames;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        this.subjects[name] = new Rx.Subject();
      }
      this.counts = {};
    }

    Stream.prototype.getSubject = function(name, warn) {
      if (warn == null) {
        warn = false;
      }
      if (this.subjects[name] != null) {
        this.subjects[name];
      } else {
        if (warn) {
          Util.warn('Stream.getSubject() unknown subject so returning new subject for', name);
        }
        this.subjects[name] = new Rx.Subject();
      }
      return this.subjects[name];
    };

    Stream.prototype.subscribe = function(name, next, onError, onComplete) {
      var subject;
      if (onError == null) {
        onError = this.onError;
      }
      if (onComplete == null) {
        onComplete = this.onComplete;
      }
      subject = this.getSubject(name, false);
      subject.subscribe(next, onError, onComplete);
    };

    Stream.prototype.publish = function(name, topic, jQuerySelector, eventType, htmlId) {
      var subject;
      if (jQuerySelector == null) {
        jQuerySelector = null;
      }
      if (eventType == null) {
        eventType = null;
      }
      if (htmlId == null) {
        htmlId = "";
      }
      if ((jQuerySelector == null) || (eventType == null)) {
        subject = this.getSubject(name);
        subject.mapTo(topic);
      } else {
        this.publishEvent(name, topic, jQuerySelector, eventType, htmlId);
      }
    };

    Stream.prototype.publishEvent = function(name, topic, jQuerySelector, eventType, htmlId) {
      var element, onEvent, subject,
        _this = this;
      if (htmlId == null) {
        htmlId = "";
      }
      subject = this.getSubject(name);
      element = this.domElement(jQuerySelector, htmlId);
      if (this.notElement(element, name)) {
        return;
      }
      onEvent = function(event) {
        var object;
        _this.processEvent(event);
        object = topic != null ? topic : event.target.value;
        return subject.next(object);
      };
      element.addEventListener(eventType, onEvent);
    };

    Stream.prototype.notElement = function(element, name) {
      var status;
      status = (element != null) && (element.id != null) && Util.isStr(element.id);
      if (!status) {
        Util.log('Stream.notElement()', name);
      }
      return !status;
    };

    Stream.prototype.unsubscribe = function(name) {
      var subject;
      subject = this.getSubject(name);
      subject.unsubscribe();
    };

    Stream.prototype.processEvent = function(event) {
      if (event != null) {
        event.stopPropagation();
      }
      if (event != null) {
        event.preventDefault();
      }
    };

    Stream.prototype.complete = function(completeSubject, subjects, onComplete) {
      var objects, onNext, subject, _i, _len,
        _this = this;
      this.counts[completeSubject] = {};
      this.counts[completeSubject].count = 0;
      objects = [];
      onNext = function(object) {
        objects.push(object);
        _this.counts[completeSubject].count++;
        if (_this.counts[completeSubject].count === subjects.length) {
          _this.counts[completeSubject].count = 0;
          if (typeof onComplete === 'function') {
            return onComplete(objects);
          } else {
            return _this.publish(completeSubject, objects);
          }
        }
      };
      for (_i = 0, _len = subjects.length; _i < _len; _i++) {
        subject = subjects[_i];
        this.subscribe(subject, onNext);
      }
    };

    Stream.prototype.concat = function(name, sources, onComplete) {
      var onError, onNext, source, sub, subs, _i, _len;
      subs = [];
      for (_i = 0, _len = sources.length; _i < _len; _i++) {
        source = sources[_i];
        sub = this.getSubject(source).take(1);
        subs.push(sub);
      }
      this.subjects[name] = Rx.Observable.concat(subs).take(subs.length);
      onNext = function(object) {
        var params;
        params = object.params != null ? object.params : 'none';
        return Util.noop(params);
      };
      onError = function(err) {
        return Util.log('Stream.concat() error', err);
      };
      this.subscribe(name, onNext, onError, onComplete);
    };

    Stream.prototype.isJQuery = function($elem) {
      return (typeof $ !== "undefined" && $ !== null) && ($elem != null) && ($elem instanceof $ || __indexOf.call(Object($elem), 'jquery') >= 0);
    };

    Stream.prototype.isEmpty = function($elem) {
      return ($elem != null ? $elem.length : void 0) === 0;
    };

    Stream.prototype.domElement = function(jQuerySelector, htmlId) {
      if (htmlId == null) {
        htmlId = "";
      }
      if (this.isJQuery(jQuerySelector)) {
        if (this.isEmpty(jQuerySelector)) {
          Util.warn("Stream.domElement() jQuerySelector empty", {
            htmlId: htmlId
          });
        }
        return jQuerySelector.get(0);
      } else if (Util.isStr(jQuerySelector)) {
        return $(jQuerySelector).get(0);
      } else {
        Util.error('Stream.domElement( jqSel )', typeof jQuerySelector, jQuerySelector, 'jQuerySelector is neither jQuery object nor selector', {
          htmlId: htmlId
        });
        return $().get(0);
      }
    };

    Stream.prototype.onNext = function(object) {
      return Util.log('Stream.onNext()', object);
    };

    Stream.prototype.onError = function(error) {
      return Util.error('Stream.onError()', error);
    };

    Stream.prototype.onComplete = function() {
      return Util.dbg('Stream.onComplete()', 'Completed');
    };

    Stream.prototype.logSubjects = function() {
      var key, obj, _ref, _results;
      _ref = this.subjects;
      _results = [];
      for (key in _ref) {
        obj = _ref[key];
        _results.push(Util.log('Stream.logSubjects', key));
      }
      return _results;
    };

    Stream.prototype.drag = function(jqSel) {
      var dragTarget, mousedown, mousedrag, mousemove, mouseup;
      dragTarget = this.createRxJQuery(jqSel);
      mouseup = dragTarget.bindAsObservable("mouseup").publish().refCount();
      mousemove = $(document).bindAsObservable("mousemove").publish().refCount();
      mousedown = dragTarget.bindAsObservable("mousedown").publish().refCount().map(function(event) {
        event.preventDefault();
        return {
          left: event.clientX - dragTarget.offset().left,
          top: event.clientY - dragTarget.offset().top
        };
      });
      mousedrag = mousedown.selectMany(function(offset) {
        return mousemove.map(function(pos) {
          return {
            left: pos.clientX - offset.left,
            top: pos.clientY - offset.top
          };
        }).takeUntil(mouseup);
      });
      return mousedrag.subscribe(function(pos) {
        return dragTarget.css({
          top: pos.top,
          left: pos.left
        });
      });
    };

    /*
    eventTopic:( event ) ->
      topic = 'Down'
      topic = 'Left'  if event.which is 37
      topic = 'Up'    if event.which is 38
      topic = 'Right' if event.which is 39
      topic = 'Down'  if event.which is 40
      topic
    
    publishEvent1:( name, topic, jQuerySelector, eventType ) ->
      subject      = @getSubject( name )
      element      = @domElement( jQuerySelector )
      return if @notElement( element, name )
      observable   = Rx.Observable.fromEvent( element, eventType ).mapTo( topic )
      mergeSubject = subject.merge( observable )
      mergeSubject.mapTo( topic )
      @resetSubject( name, mergeSubject )
      return
    
    # Publishes topic on dom element event
    publishEvent2:( name, topic, jQuerySelector, eventType ) ->
      subject         = @getSubject( name )
      element         = @domElement( jQuerySelector )
      return if @notElement( element, name )
      observable    = Rx.Observable.fromEvent( element, eventType ).mapTo( topic )
      next  = ( event ) =>
        @processEvent(  event )
        object  = if topic? then topic else event.target.value
        observable.mapTo( object )
      subject = subject.merge( observable )
      subject.subscribe( next, @error, @complete )
      subject.mapTo( topic )
      @resetSubject( name, subject )
      return
    */


    return Stream;

  })();

}).call(this);
