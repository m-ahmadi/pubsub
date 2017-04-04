## Publish-Subscribe Pattern. (Aka: Observer, Custom-Events)
```javascript
var obj = newPubSub();

obj.on('init', function (evtData, customData) {

// evtData: A value provided by the publisher. (whoever emitted this event)
// customData: A value provided by the subscriber. (whoever subscribed to this event)

}, [customData]);

obj.emit('init', evtData);
```
#### The newPubSub() function will create an object that has the capability of registering subscribers, and publishing events to them.

#### If any important object needs this functionality, it can inhert from the object created with newPubSub().
```javascript
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// an exmaple:
var door = newPubSub();
door.on('opened', function (e) {
if (!e.doorstop) {
	putDoorstop();
}
});
door.on('closed', function (e, whoWantsToKnow) {
if (!e.locked) {
	lockTheDoor();
}
call( whoWantsToKnow );
}, 'mohammad');


door.emit('opened', {doorStop: false});
door.emit('closed', {locked: false});
```

```javascript
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// another example:
var t = newPubSub();

t.on('click', function () { alert(1); });
t.on({
"a": function () { alert('a'); },
"b": function () { alert('b'); }
});
t.on({
"mohammad": {
	fn: function (e, par) { alert('mohammad'+par); },
	par: 'choo'
},
"meow": {
	fn: function (e, par) { alert('meow'+par); },
	par: 2,
	once: true
}
});
t.once('moo', function () { alert('mooo and done'); });

t.emit('click');
t.emit('a');
t.emit('b');
t.emit('mohammad');
t.emit('meow'); // deleted after one publish
t.emit('moo');  // deleted after one publish
```
