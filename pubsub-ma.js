(function (exported) {
  if (typeof define === 'function' && define.amd) {
    define(exported);
  } else if (typeof process !== 'undefined' &&
    typeof process.versions.node !== 'undefined') {
    module.exports = exported;
  } else {
    window.newPubSub = exported;
  }
}((function () {
  function constructor() {
    'use strict';
    if (this instanceof constructor) { throw new Error('constructor() was called with new.'); }

    var subscribers = {},
      inst = {};

    function initArr(str) {
      if (isUndef(subscribers[str])) {
        subscribers[str] = [];
      }
    }
    function add(str, fn, par, once) {
      var obj = {};
      initArr(str);
      obj.fn = fn;
      if (!isUndef(par)) {
        obj.par = par;
      }
      if (once) {
        obj.once = true;
      }
      subscribers[str].push(obj);
    }
    function common(evt, fn, par, once) {
      var events;
      if (evt.indexOf(' ') === -1) { // 'click', function () {}
        add(evt, fn, par, once);
      } else { // 'click mousemove', function () {}
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
        if (isFn(prop)) { // 'click': function () {}
          add(i, prop);
        } else if (isObj(prop)) { // 'click': {fn: function () {}, par: value, once: true}
          if (isFn(prop.fn)) {
            add(i, prop.fn, prop.par, prop.once);
          }
        }
      });
    }

    inst.getSubscribers = function () {
      return subscribers;
    };
    inst.subscribe = function (evt, fn, par, once) {
      var args = getArgs(arguments);
      check(args, oneArg, common);
      return this;
    };
    inst.unsubscribe = function (evtName, fn) {
      var arr = subscribers[evtName],
        target,
        splitted;
      if (isStr(evtName) && isFn(fn)) {
        arr.forEach(function (itm, idx) {
          if (itm.fn.toString() === fn.toString()) {
            target = idx;
          }
        });
        arr.splice(target, 1);
      } else if (isStr(evtName) && isUndef(fn)) {
        splitted = evtName.split(' ');
        if (splitted.length) {
          splitted.forEach(function (i) {
            delete subscribers[i];
          });
        } else {
          delete subscribers[evtName];
        }
      } else if (isArr(evtName) && isUndef(fn)) {
        evtName.forEach(function (i) {
          if (isStr(i)) {
            delete subscribers[i];
          }
        });
      } else if (isUndef(evtName) && isUndef(fn)) {
        Object.keys(subscribers).forEach(function (k) {
          delete subscribers[k];
        });
      }
      return this;
    }
    inst.publish = function (evtName) {
      var evtData = getArgs(arguments).slice(1);
      var evts = subscribers[evtName],
        toDel;
      if (!isUndef(evts)) {
        evts.forEach(function (i, idx) {
          if (i.once) {
            call(i.fn, evtData, i.par);
            toDel = evtName;
          } else {
            call(i.fn, evtData, i.par);
          }
        });
        if (toDel) delete subscribers[toDel];
      }
    };
    inst.once = function () {
      var args = getArgs(arguments);
      check(args, oneArg, common, true);
      return this;
    };
    // aliases
    inst.on = inst.subscribe;
    inst.off = inst.unsubscribe;
    inst.emit = inst.publish;

    return inst;
  };

  function check(args, action1, action2, opt) {
    var len = args.length,
      arg1, arg2, arg3, arg4;

    if (len === 1) {
      arg1 = args[0];
      if (isObj(arg1)) {
        action1(arg1);
      }
    } else if (len === 2) {
      arg1 = args[0];
      arg2 = args[1];
      if (isStr(arg1) && isFn(arg2)) {
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
      if (isStr(arg1) && isFn(arg2) && !isUndef(arg3)) {
        action2(arg1, arg2, arg3, opt ? opt : undefined);
      }
    } else if (len === 4) {
      arg1 = args[0];
      arg2 = args[1];
      arg3 = args[2];
      arg4 = args[3];
      if (isStr(arg1) && isFn(arg2) && !isUndef(arg3) && !isUndef(arg4)) {
        action2(arg1, arg2, arg3, arg4);
      }
    }
  }
  function call(fn, e, par) {
    // if isArr par => e = e.concat(par) else:
    e.push(par);
    fn.apply(undefined, e);
  }

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
  function isArr(v) {
    if (typeof Array.isArray === 'function') {
      return Array.isArray(v);
    } else {
      return (
        v &&
        typeof v === 'object' &&
        typeof v.length === 'number' &&
        typeof v.splice === 'function' &&
        !v.propertyIsEnumerable('length') &&
        Object.prototype.toString.call(v) === '[object Array]'
      ) ? true : false;
    }
  }
  function getArgs(a) {
    var len, args, i;
    if (a) {
      len = a.length;
      args = new Array(len);
      for (i = 0; i < len; i += 1) {
        args[i] = a[i];
      }
      return args;
    }
  }

  return constructor;
}())));