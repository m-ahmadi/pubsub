
# Publish-Subscribe Pattern
**Aka: Observer or Event Emitter.**

The `newPubSub()` function will create an object that has the capability of registering subscribers and publishing events to them.  
You can then inhert from the object created with `newPubSub()`.

```javascript
var obj = newPubSub(); // browser
// var newPubSub = require("pubsub-ma"); // node

obj.on("init", function (eventData, customData) {

    // eventData:  A value provided by the publisher.  (whoever emitted       this event)
    // customData: A value provided by the subscriber. (whoever subscribed to this event)

} [, customData]);

obj.emit("init", eventData);
```

## Methods:
```javascript
.on(strEventName, fnEventHandler [, anyToPassToEventHandler])   // register an event handler to an event name.
.on({ "eventName": fnEventHandler, ... })                       // alternative signature 1
.on({                                                           // alternative signature 2
    "eventName": {
        fn: eventHandler,
        par: anyToPassToEventHandler,
        once: boolExecuteHandlerOnlyOnce
    },
    ...
})

.emit(strEventName [, anyEventData, anyEventData, ...])         // call all registered event handlers of an event name.

.off(strEventName, fnEventHandler)                              // unregister an event handler from an event name.
.once(strEventName, fnEventHandler [, anyToPassToEventHandler]) // register an event handler to be called only once.

.getSubscribers()                                               // get a list of all subscribers.
```

## Basic usage:
```javascript
var brain = Object.create( newPubSub() );

brain.on("hunger", function (event) {
    if (event.hungerLevel === "super_high") {
        killFriendAndEatHim();
    } else {
        eatSomeCheetos();
    }
});

```

## Another basic usage:
```javascript
var door = newPubSub();

door.on("opened", function (e) {
    if (!e.doorstop) {
        putDoorstop();
    }
});

door.on("closed", function (e, whoWantsToKnow) {
    if (!e.locked) {
        lockTheDoor();
    }
    call( whoWantsToKnow );
}, "mohammad");

door.emit("opened", { doorStop: false });
door.emit("closed", { locked: false });
```

## Different argument signatures of `newPubSub().on()`
```javascript
var t = newPubSub();
var log = console.log;

// basic:
t.on("click", function () { log(1); });

// alternative 1 - one object argument:
// keys of the object are event names.
// values of the object are event handlers.
t.on({
    "a": function () { log("a"); },
    "b": function () { log("b"); }
});

// alternative 2 - one object argument:
// keys of the object are event names.
// values of the object are object themselves with three properties:
//   fn:   a function which is the event handler.
//   par:  a value to pass to the event handler.
//   once: a boolean value indicating whether the event handler should be called only once.
t.on({
    "mohammad": {
        fn: function (e, par) { log("mohammad"+par); },
        par: "choo"
    },
    "meow": {
        fn: function (e, par) { log("meow"+par); },
        par: 2,
        once: true
    }
});

t.once("moo", function () { log("mooo and done"); });

t.emit("click");
t.emit("a");
t.emit("b");
t.emit("mohammad");
t.emit("meow"); // deleted after one publish
t.emit("moo");  // deleted after one publish
```

## Two ways of passing data to event handlers: when calling `.on()` or when calling `.emit()`:
```javascript
var t = newPubSub();
t.on("foo", function (a,b,c,d) { console.log(a,b,c,d) }, "bar");
t.emit("foo");            // "bar" undefined undefined undefined
t.emit("foo", 1, 2, 3);   // 1 2 3 "bar"
t.emit("foo", [1, 2, 3]); // [1, 2, 3] "bar" undefined undefined

var t = newPubSub();
t.on("foo", function (a,b,c,d) { console.log(a,b,c,d) }, [true, false, true]);
t.emit("foo");            // [true, false, true] undefined undefined undefined
t.emit("foo", 1, 2, 3);   // 1 2 3 [true, false, true]
```