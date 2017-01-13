## Publish-Subscribe Pattern. (Aka: Observer, Custom-Events)

    var obj = instantiatePubsub();
    
    obj.on('init', function (evtData, customData) {
    
    	// evtData: A value provided by the publisher. (whoever emitted this event)
    	// customData: A value provided by the subscriber. (whoever subscribed to this event)
    
    }, [customData]);
    
    obj.emit('init', evtData);

#### The instantiatePubsub() function will create an object that has the capability of registering subscribers, and publishing events to them.

#### If any important object needs this functionality, it can inhert from the object created with instantiatePubsub().

    // an exmaple:
    var door = instantiatePubsub();
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
