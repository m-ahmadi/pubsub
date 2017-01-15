var newPubSub = (function () {
	function constructor() {
		"use strict";
		if ( this instanceof newPubSub ) { throw new Error('newPubSub() was called with new.'); }
		
		var subscribers = {},
			inst = {};	
		
		function initArr(str) {
				if ( isUndef( subscribers[str] ) ) {
					subscribers[str] = [];
				}
			}
		function add(str, fn, par, once) {
			var obj = {};
			initArr(str);
			obj.fn = fn;
			if (par) {
				obj.par = par;
			}
			if (once) {
				obj.once = true;
			}
			subscribers[str].push(obj);
		}
		function common(evt, fn, par, once) {
			var events;
			if ( evt.indexOf(' ') === -1 ) { // "click", function () {} 
				add(evt, fn, par, once);
			} else { // "click mousemove", function () {} 
				events = evt.trim().split(' ');
				if (events.length) {
					events.forEach(function (itm) {
						add(itm, fn, par, once);
					});
				}
			}
		}
		function oneArg(o) {
			Object.keys(o).forEach(function (i) {
				var prop = o[i];
				initArr(i);
				if ( isFn(prop) ) { // "click": function () {}
					add(i, prop);
				} else if ( isObj(prop) ) { // "click": {fn: function () {}, par: value, once: true}
					if ( isFn(prop.fn) ) {
						add(i, prop.fn, prop.par, prop.once);
					}
				}
			});
		}
		function check(args, action1, action2, opt) {
			var len = args.length,
				arg1, arg2, arg3, arg4;
			
			if (len === 1) {
				arg1 = args[0];
				if ( isObj(arg1) ) {
					action1(arg1);
				}
			} else if (len === 2) {
				arg1 = args[0];
				arg2 = args[1];
				if ( isStr(arg1) && isFn(arg2) ) {
					if (opt) {
						action2(arg1, arg2, undefined, true);
					} else {
						action2(arg1, arg2);
					}
				}
			} else if (len === 3) {
				arg1 = args[0];
				arg2 = args[1];
				arg3 = args[2];
				if ( isStr(arg1) && isFn(arg2) && arg3 ) {
					action2(arg1, arg2, arg3, opt ? opt : undefined);
				}
			} else if (len === 4) {
				arg1 = args[0];
				arg2 = args[1];
				arg3 = args[2];
				arg4 = args[3];
				if ( isStr(arg1) && isFn(arg2) && arg3 && arg4 ) {
					action2(arg1, arg2, arg3, arg4);
				}
			}
		}
		
		inst.getSubscribers = function () {
			return subscribers;
		};
		inst.subscribe = function (evt, fn, par, once) {
			var args = getArgs(arguments);
			check(args, oneArg, common);
		};
		inst.unsubscribe = function (evtName, fn) {
			var arr = subscribers[evtName],
				target;
			if ( isStr(evtName) && isFn(fn) ) {
				arr.forEach(function (itm, idx) {
					if ( itm.fn.toString() === fn.toString() ) {
						target = idx;
					}
				});
				arr.splice(target, 1);
			}
		}
		inst.publish = function (evtName, evtData) {
			var evts = subscribers[evtName],
				toDel;
			if ( !isUndef(evts) ) {
				evts.forEach(function (i, idx) {
					if (i.once) {
						i.fn(evtData, i.par);
						toDel = evtName;
					} else {
						i.fn(evtData, i.par);
					}
				});
				delete subscribers[toDel];
			}
		};
		inst.once = function () {
			var args = getArgs(arguments);
			check(args, oneArg, common, true);
		};
		// aliases
		inst.on = inst.subscribe;
		inst.off = inst.unsubscribe;
		inst.emit = inst.publish; 
		
		return inst;
	};
	
	function isUndef(v) {
		return typeof v === 'undefined';
	}
	function isFn(v) {
		return typeof v === 'function';
	}
	function isStr(v) {
		return typeof v === 'string';
	}
	function isObj(v) {
		return (
			v &&
			typeof v === 'object' &&
			typeof v !== null &&
			Object.prototype.toString.call(v) === '[object Object]'
		) ? true : false;
	}
	function getArgs(a) {
		var args = new Array(a.length),
			i;
		for (i=0; i<args.length; i+=1) {
			args[i] = a[i];
		}
		return args;
	}
	
	return constructor;
}());