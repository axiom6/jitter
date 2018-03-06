(function() {
  //$  = require('jquery'  )
  //Rx = require('rxjs/Rx' )
  var Stream,
    indexOf = [].indexOf;

  Stream = (function() {
    class Stream {
      constructor(subjectNames = Stream.SubjectNames) {
        var i, len, name, ref;
        this.subjectNames = subjectNames;
        this.subjects = {};
        ref = this.subjectNames;
        for (i = 0, len = ref.length; i < len; i++) {
          name = ref[i];
          this.subjects[name] = new Rx.Subject();
        }
        this.counts = {};
      }

      // Get a subject by name. Create a new one if need with a warning
      getSubject(name, warn = false) {
        if (this.subjects[name] != null) {
          this.subjects[name];
        } else {
          if (warn) {
            Util.warn('Stream.getSubject() unknown subject so returning new subject for', name);
          }
          this.subjects[name] = new Rx.Subject();
        }
        return this.subjects[name];
      }

      subscribe(name, next, onError = this.onError, onComplete = this.onComplete) {
        var subject;
        subject = this.getSubject(name, false); // Many subscribers come before publishers
        subject.subscribe(next, onError, onComplete);
      }

      publish(name, topic, jQuerySelector = null, eventType = null, htmlId = "") {
        var subject;
        if ((jQuerySelector == null) || (eventType == null)) {
          subject = this.getSubject(name);
          subject.mapTo(topic);
        } else {
          this.publishEvent(name, topic, jQuerySelector, eventType, htmlId);
        }
      }

      publishEvent(name, topic, jQuerySelector, eventType, htmlId = "") {
        var element, onEvent, subject;
        subject = this.getSubject(name);
        element = this.domElement(jQuerySelector, htmlId);
        if (this.notElement(element, name)) {
          return;
        }
        onEvent = (event) => {
          this.processEvent(event);
          return subject.next(topic);
        };
        element.addEventListener(eventType, onEvent);
      }

      notElement(element, name) {
        var status;
        status = (element != null) && (element.id != null) && Util.isStr(element.id);
        if (!status) {
          Util.log('Stream.notElement()', name);
        }
        return !status;
      }

      unsubscribe(name) {
        var subject;
        subject = this.getSubject(name);
        subject.unsubscribe();
      }

      processEvent(event) {
        if (event != null) {
          event.stopPropagation(); // Will need to look into preventDefault
        }
        if (event != null) {
          event.preventDefault();
        }
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
        this.subjects[name] = Rx.Observable.concat(subs).take(subs.length);
        //Util.log( 'Stream.concat() subs.length', subs.length )
        onNext = function(object) {
          var params;
          params = object.params != null ? object.params : 'none';
          return Util.noop(params);
        };
        //Util.log( 'Stream.concat() next params', params )
        onError = function(err) {
          return Util.log('Stream.concat() error', err);
        };
        this.subscribe(name, onNext, onError, onComplete);
      }

      isJQuery($elem) {
        return (typeof $ !== "undefined" && $ !== null) && ($elem != null) && ($elem instanceof $ || indexOf.call(Object($elem), 'jquery') >= 0);
      }

      isEmpty($elem) {
        return ($elem != null ? $elem.length : void 0) === 0;
      }

      domElement(jQuerySelector, htmlId = "") {
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
      }

      onNext(object) {
        return Util.log('Stream.onNext()', object);
      }

      onError(error) {
        return Util.error('Stream.onError()', error);
      }

      onComplete() {
        return Util.dbg('Stream.onComplete()', 'Completed');
      }

      logSubjects() {
        var key, obj, ref, results;
        ref = this.subjects;
        results = [];
        for (key in ref) {
          obj = ref[key];
          results.push(Util.log('Stream.logSubjects', key));
        }
        return results;
      }

      drag(jqSel) {
        var dragTarget, mousedown, mousedrag, mousemove, mouseup;
        dragTarget = this.createRxJQuery(jqSel); // Note $jQuery has to be made reative with rxjs-jquery
        
        // Get the three major events
        mouseup = dragTarget.bindAsObservable("mouseup").publish().refCount();
        mousemove = $(document).bindAsObservable("mousemove").publish().refCount();
        mousedown = dragTarget.bindAsObservable("mousedown").publish().refCount().map(function(event) { // calculate offsets when mouse down
          event.preventDefault();
          return {
            left: event.clientX - dragTarget.offset().left,
            top: event.clientY - dragTarget.offset().top
          };
        });
        // Combine mouse down with mouse move until mouse up
        mousedrag = mousedown.selectMany(function(offset) {
          return mousemove.map(function(pos) { // calculate offsets from mouse down to mouse moves
            return {
              left: pos.clientX - offset.left,
              top: pos.clientY - offset.top
            };
          }).takeUntil(mouseup);
        });
        // Update position subscription =
        return mousedrag.subscribe(function(pos) {
          return dragTarget.css({
            top: pos.top,
            left: pos.left
          });
        });
      }

    };

    //module.exports = Stream # Util.Export( Stream, 'util/Stream' )
    Util.Stream = Stream;

    Stream.SubjectNames = ['Select', 'Content', 'Connect', 'Test', 'Plane', 'About', 'Slide', 'Cursor', 'Navigate', 'Settings', 'Submit', 'Toggle', 'Layout'];

    return Stream;

  }).call(this);

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

 * Publishes topic on dom element event
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

}).call(this);
