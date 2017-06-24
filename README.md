## Publish-Subscribe Pattern/API. (Aka: Observer | Custom-Events | EventEmitter)

The newPubSub() function will create an object that has the capability of registering subscribers, and publishing events to them.


If any important object needs this functionality, it can inhert from the object created with newPubSub().

```javascript
// var newPubSub = require("pubsub-ma"); // node
var obj = newPubSub(); // browser

obj.on("init", function (evtData, customData) {

    // evtData: A value provided by the publisher. (whoever emitted this event)
    // customData: A value provided by the subscriber. (whoever subscribed to this event)

} [, customData]);

obj.emit("init", evtData);

// methods
.getSubscribers(                                                   )
.subscribe     ( strEvtName, fnEvtCallback, anyToPassToEvtCallback )
.unsubscribe   ( strEvtName, fnEvtCallback                         )
.publish       ( strEvtName, anyEvtData,    anyEvtData, ...        )
.once          ( strEvtName, fnEvtCallback, anyToPassToEvtCallback )
.on            (                                                   ) // subscribe alias
.off           (                                                   ) // unsubscribe alias
.emit          (                                                   ) // publish alias

```

Usage exmaple:
----------------------
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


door.emit("opened", {doorStop: false});
door.emit("closed", {locked: false});
```

Another example:
----------------------
```javascript
var t = newPubSub();
var log = console.log;

t.on("click", function () { log(1); });
t.on({
    "a": function () { log("a"); },
    "b": function () { log("b"); }
});
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


Another example:
----------------------
```javascript
var t = newPubSub();
var log = console.log;

t.on("foo", function (a,b,c,d,e,f) { log(a,b,c,d,e,f) }, "bar");
t.emit("foo")            // "bar" undefined undefined undefined undefined undefined
t.emit("foo", 1, 2, 3)   // 1 2 3 "bar" undefined undefined
t.emit("foo", [1, 2, 3]) // [1, 2, 3] "bar" undefined undefined undefined undefined

var t = newPubSub();
t.on("foo", function (a,b,c,d,e,f) { log(a,b,c,d,e,f) }, ["fudge", "bar", "pickle"])
t.emit("foo")            // ["fudge", "bar", "pickle"] undefined undefined undefined undefined undefined
t.emit("foo", 1, 2, 3)   // 1 2 3 ["fudge", "bar", "pickle"] undefined undefined
```
