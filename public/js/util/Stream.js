"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  //$  = require('jquery'  )
  //Rx = require('rxjs/Rx' )
  var Stream,
      indexOf = [].indexOf;

  Stream = function () {
    var Stream = function () {
      function Stream() {
        var subjectNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Stream.SubjectNames;

        _classCallCheck(this, Stream);

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


      _createClass(Stream, [{
        key: "getSubject",
        value: function getSubject(name) {
          var warn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

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
      }, {
        key: "subscribe",
        value: function subscribe(name, next) {
          var onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.onError;
          var onComplete = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.onComplete;

          var subject;
          subject = this.getSubject(name, false); // Many subscribers come before publishers
          subject.subscribe(next, onError, onComplete);
        }
      }, {
        key: "publish",
        value: function publish(name, topic) {
          var jQuerySelector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
          var eventType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
          var htmlId = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";

          var subject;
          if (jQuerySelector == null || eventType == null) {
            subject = this.getSubject(name);
            subject.mapTo(topic);
          } else {
            this.publishEvent(name, topic, jQuerySelector, eventType, htmlId);
          }
        }
      }, {
        key: "publishEvent",
        value: function publishEvent(name, topic, jQuerySelector, eventType) {
          var _this = this;

          var htmlId = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";

          var element, onEvent, subject;
          subject = this.getSubject(name);
          element = this.domElement(jQuerySelector, htmlId);
          if (this.notElement(element, name)) {
            return;
          }
          onEvent = function onEvent(event) {
            _this.processEvent(event);
            return subject.next(topic);
          };
          element.addEventListener(eventType, onEvent);
        }
      }, {
        key: "notElement",
        value: function notElement(element, name) {
          var status;
          status = element != null && element.id != null && Util.isStr(element.id);
          if (!status) {
            Util.log('Stream.notElement()', name);
          }
          return !status;
        }
      }, {
        key: "unsubscribe",
        value: function unsubscribe(name) {
          var subject;
          subject = this.getSubject(name);
          subject.unsubscribe();
        }
      }, {
        key: "processEvent",
        value: function processEvent(event) {
          if (event != null) {
            event.stopPropagation(); // Will need to look into preventDefault
          }
          if (event != null) {
            event.preventDefault();
          }
        }
      }, {
        key: "complete",
        value: function complete(completeSubject, subjects, onComplete) {
          var _this2 = this;

          var i, len, objects, onNext, subject;
          this.counts[completeSubject] = {};
          this.counts[completeSubject].count = 0;
          objects = [];
          onNext = function onNext(object) {
            objects.push(object);
            _this2.counts[completeSubject].count++;
            if (_this2.counts[completeSubject].count === subjects.length) {
              _this2.counts[completeSubject].count = 0;
              if (typeof onComplete === 'function') {
                return onComplete(objects);
              } else {
                return _this2.publish(completeSubject, objects);
              }
            }
          };
          for (i = 0, len = subjects.length; i < len; i++) {
            subject = subjects[i];
            this.subscribe(subject, onNext);
          }
        }
      }, {
        key: "concat",
        value: function concat(name, sources, onComplete) {
          var i, len, onError, onNext, source, sub, subs;
          subs = [];
          for (i = 0, len = sources.length; i < len; i++) {
            source = sources[i];
            sub = this.getSubject(source).take(1);
            subs.push(sub);
          }
          this.subjects[name] = Rx.Observable.concat(subs).take(subs.length);
          //Util.log( 'Stream.concat() subs.length', subs.length )
          onNext = function onNext(object) {
            var params;
            params = object.params != null ? object.params : 'none';
            return Util.noop(params);
          };
          //Util.log( 'Stream.concat() next params', params )
          onError = function onError(err) {
            return Util.log('Stream.concat() error', err);
          };
          this.subscribe(name, onNext, onError, onComplete);
        }
      }, {
        key: "isJQuery",
        value: function isJQuery($elem) {
          return typeof $ !== "undefined" && $ !== null && $elem != null && ($elem instanceof $ || indexOf.call(Object($elem), 'jquery') >= 0);
        }
      }, {
        key: "isEmpty",
        value: function isEmpty($elem) {
          return ($elem != null ? $elem.length : void 0) === 0;
        }
      }, {
        key: "domElement",
        value: function domElement(jQuerySelector) {
          var htmlId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

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
            Util.error('Stream.domElement( jqSel )', typeof jQuerySelector === "undefined" ? "undefined" : _typeof(jQuerySelector), jQuerySelector, 'jQuerySelector is neither jQuery object nor selector', {
              htmlId: htmlId
            });
            return $().get(0);
          }
        }
      }, {
        key: "onNext",
        value: function onNext(object) {
          return Util.log('Stream.onNext()', object);
        }
      }, {
        key: "onError",
        value: function onError(error) {
          return Util.error('Stream.onError()', error);
        }
      }, {
        key: "onComplete",
        value: function onComplete() {
          return Util.dbg('Stream.onComplete()', 'Completed');
        }
      }, {
        key: "logSubjects",
        value: function logSubjects() {
          var key, obj, ref, results;
          ref = this.subjects;
          results = [];
          for (key in ref) {
            obj = ref[key];
            results.push(Util.log('Stream.logSubjects', key));
          }
          return results;
        }
      }, {
        key: "drag",
        value: function drag(jqSel) {
          var dragTarget, mousedown, mousedrag, mousemove, mouseup;
          dragTarget = this.createRxJQuery(jqSel); // Note $jQuery has to be made reative with rxjs-jquery

          // Get the three major events
          mouseup = dragTarget.bindAsObservable("mouseup").publish().refCount();
          mousemove = $(document).bindAsObservable("mousemove").publish().refCount();
          mousedown = dragTarget.bindAsObservable("mousedown").publish().refCount().map(function (event) {
            // calculate offsets when mouse down
            event.preventDefault();
            return {
              left: event.clientX - dragTarget.offset().left,
              top: event.clientY - dragTarget.offset().top
            };
          });
          // Combine mouse down with mouse move until mouse up
          mousedrag = mousedown.selectMany(function (offset) {
            return mousemove.map(function (pos) {
              // calculate offsets from mouse down to mouse moves
              return {
                left: pos.clientX - offset.left,
                top: pos.clientY - offset.top
              };
            }).takeUntil(mouseup);
          });
          // Update position subscription =
          return mousedrag.subscribe(function (pos) {
            return dragTarget.css({
              top: pos.top,
              left: pos.left
            });
          });
        }
      }]);

      return Stream;
    }();

    ;

    //module.exports = Stream # Util.Export( Stream, 'util/Stream' )
    Util.Stream = Stream;

    Stream.SubjectNames = ['Select', 'Content', 'Connect', 'Test', 'Plane', 'About', 'Slide', 'Cursor', 'Navigate', 'Settings', 'Submit', 'Toggle', 'Layout'];

    return Stream;
  }.call(this);

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
}).call(undefined);
