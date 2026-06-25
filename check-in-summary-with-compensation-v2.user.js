// ==UserScript==
// @name         Check-in summary with compensation V2
// @namespace    https://hubble.mallow-tech.com
// @version      2026.06.25.1
// @author       Neon Raven
// @description  Work log summary with month filter, tooltips, and mini-modals
// @downloadURL  https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.js
// @updateURL    https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.js
// @match        https://hubble.mallow-tech.com/attendance/my-check-in-data*
// @tag          timesheet
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
  var _anchor, _hydrate_open, _props, _children, _effect, _main_effect, _pending_effect, _failed_effect, _offscreen_fragment, _local_pending_count, _pending_count, _pending_count_update_queued, _dirty_effects, _maybe_dirty_effects, _effect_pending, _effect_pending_subscriber, _Boundary_instances, render_fn, resolve_fn, run_fn, update_pending_count_fn, handle_error_fn, _started, _prev, _next, _commit_callbacks, _discard_callbacks, _pending, _blocking_pending, _deferred, _roots, _new_effects, _dirty_effects2, _maybe_dirty_effects2, _skipped_branches, _unskipped_branches, _decrement_queued, _Batch_instances, is_deferred_fn, process_fn, traverse_fn, find_earlier_batch_fn, merge_fn, defer_effects_fn, unlink_fn, _a, _batches, _onscreen, _offscreen, _outroing, _transition, _commit, _discard, _b;
  const DEV = false;
  var is_array = Array.isArray;
  var index_of = Array.prototype.indexOf;
  var includes = Array.prototype.includes;
  var array_from = Array.from;
  var define_property = Object.defineProperty;
  var get_descriptor = Object.getOwnPropertyDescriptor;
  var get_descriptors = Object.getOwnPropertyDescriptors;
  var object_prototype = Object.prototype;
  var array_prototype = Array.prototype;
  var get_prototype_of = Object.getPrototypeOf;
  var is_extensible = Object.isExtensible;
  const noop = () => {
  };
  function run_all(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i]();
    }
  }
  function deferred() {
    var resolve;
    var reject;
    var promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }
  const DERIVED = 1 << 1;
  const EFFECT = 1 << 2;
  const RENDER_EFFECT = 1 << 3;
  const MANAGED_EFFECT = 1 << 24;
  const BLOCK_EFFECT = 1 << 4;
  const BRANCH_EFFECT = 1 << 5;
  const ROOT_EFFECT = 1 << 6;
  const BOUNDARY_EFFECT = 1 << 7;
  const CONNECTED = 1 << 9;
  const CLEAN = 1 << 10;
  const DIRTY = 1 << 11;
  const MAYBE_DIRTY = 1 << 12;
  const INERT = 1 << 13;
  const DESTROYED = 1 << 14;
  const REACTION_RAN = 1 << 15;
  const DESTROYING = 1 << 25;
  const EFFECT_TRANSPARENT = 1 << 16;
  const EAGER_EFFECT = 1 << 17;
  const HEAD_EFFECT = 1 << 18;
  const EFFECT_PRESERVED = 1 << 19;
  const USER_EFFECT = 1 << 20;
  const EFFECT_OFFSCREEN = 1 << 25;
  const WAS_MARKED = 1 << 16;
  const REACTION_IS_UPDATING = 1 << 21;
  const ASYNC = 1 << 22;
  const ERROR_VALUE = 1 << 23;
  const STATE_SYMBOL = Symbol("$state");
  const LOADING_ATTR_SYMBOL = Symbol("");
  const ATTRIBUTES_CACHE = Symbol("attributes");
  const CLASS_CACHE = Symbol("class");
  const STYLE_CACHE = Symbol("style");
  const TEXT_CACHE = Symbol("text");
  const STALE_REACTION = new class StaleReactionError extends Error {
    constructor() {
      super(...arguments);
      __publicField(this, "name", "StaleReactionError");
      __publicField(this, "message", "The reaction that called `getAbortSignal()` was re-run or destroyed");
    }
  }();
  function lifecycle_outside_component(name) {
    {
      throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
    }
  }
  function async_derived_orphan() {
    {
      throw new Error(`https://svelte.dev/e/async_derived_orphan`);
    }
  }
  function each_key_duplicate(a, b, value) {
    {
      throw new Error(`https://svelte.dev/e/each_key_duplicate`);
    }
  }
  function effect_in_teardown(rune) {
    {
      throw new Error(`https://svelte.dev/e/effect_in_teardown`);
    }
  }
  function effect_in_unowned_derived() {
    {
      throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
    }
  }
  function effect_orphan(rune) {
    {
      throw new Error(`https://svelte.dev/e/effect_orphan`);
    }
  }
  function effect_update_depth_exceeded() {
    {
      throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
    }
  }
  function state_descriptors_fixed() {
    {
      throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
    }
  }
  function state_prototype_fixed() {
    {
      throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
    }
  }
  function state_unsafe_mutation() {
    {
      throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
    }
  }
  function svelte_boundary_reset_onerror() {
    {
      throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
    }
  }
  const EACH_ITEM_REACTIVE = 1;
  const EACH_INDEX_REACTIVE = 1 << 1;
  const EACH_ITEM_IMMUTABLE = 1 << 4;
  const UNINITIALIZED = Symbol("uninitialized");
  const NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
  const NAMESPACE_SVG = "http://www.w3.org/2000/svg";
  const NAMESPACE_MATHML = "http://www.w3.org/1998/Math/MathML";
  function derived_inert() {
    {
      console.warn(`https://svelte.dev/e/derived_inert`);
    }
  }
  function svelte_boundary_reset_noop() {
    {
      console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
    }
  }
  function equals(value) {
    return value === this.v;
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
  }
  function safe_equals(value) {
    return !safe_not_equal(value, this.v);
  }
  let tracing_mode_flag = false;
  let component_context = null;
  function set_component_context(context) {
    component_context = context;
  }
  function push(props, runes = false, fn) {
    component_context = {
      p: component_context,
      i: false,
      c: null,
      e: null,
      s: props,
      x: null,
      r: (
        /** @type {Effect} */
        active_effect
      ),
      l: null
    };
  }
  function pop(component) {
    var context = (
      /** @type {ComponentContext} */
      component_context
    );
    var effects = context.e;
    if (effects !== null) {
      context.e = null;
      for (var fn of effects) {
        create_user_effect(fn);
      }
    }
    context.i = true;
    component_context = context.p;
    return (
      /** @type {T} */
      {}
    );
  }
  function is_runes() {
    return true;
  }
  let micro_tasks = [];
  function run_micro_tasks() {
    var tasks = micro_tasks;
    micro_tasks = [];
    run_all(tasks);
  }
  function queue_micro_task(fn) {
    if (micro_tasks.length === 0 && !is_flushing_sync) {
      var tasks = micro_tasks;
      queueMicrotask(() => {
        if (tasks === micro_tasks) run_micro_tasks();
      });
    }
    micro_tasks.push(fn);
  }
  function flush_tasks() {
    while (micro_tasks.length > 0) {
      run_micro_tasks();
    }
  }
  function handle_error(error) {
    var effect2 = active_effect;
    if (effect2 === null) {
      active_reaction.f |= ERROR_VALUE;
      return error;
    }
    if ((effect2.f & REACTION_RAN) === 0 && (effect2.f & EFFECT) === 0) {
      throw error;
    }
    invoke_error_boundary(error, effect2);
  }
  function invoke_error_boundary(error, effect2) {
    if (effect2 !== null && (effect2.f & DESTROYED) !== 0) {
      return;
    }
    while (effect2 !== null) {
      if ((effect2.f & BOUNDARY_EFFECT) !== 0) {
        if ((effect2.f & REACTION_RAN) === 0) {
          throw error;
        }
        try {
          effect2.b.error(error);
          return;
        } catch (e) {
          error = e;
        }
      }
      effect2 = effect2.parent;
    }
    throw error;
  }
  const STATUS_MASK = -7169;
  function set_signal_status(signal, status) {
    signal.f = signal.f & STATUS_MASK | status;
  }
  function update_derived_status(derived2) {
    if ((derived2.f & CONNECTED) !== 0 || derived2.deps === null) {
      set_signal_status(derived2, CLEAN);
    } else {
      set_signal_status(derived2, MAYBE_DIRTY);
    }
  }
  function clear_marked(deps) {
    if (deps === null) return;
    for (const dep of deps) {
      if ((dep.f & DERIVED) === 0 || (dep.f & WAS_MARKED) === 0) {
        continue;
      }
      dep.f ^= WAS_MARKED;
      clear_marked(
        /** @type {Derived} */
        dep.deps
      );
    }
  }
  function defer_effect(effect2, dirty_effects, maybe_dirty_effects) {
    if ((effect2.f & DIRTY) !== 0) {
      dirty_effects.add(effect2);
    } else if ((effect2.f & MAYBE_DIRTY) !== 0) {
      maybe_dirty_effects.add(effect2);
    }
    clear_marked(effect2.deps);
    set_signal_status(effect2, CLEAN);
  }
  function createSubscriber(start) {
    let subscribers = 0;
    let version = source(0);
    let stop;
    return () => {
      if (effect_tracking()) {
        get(version);
        render_effect(() => {
          if (subscribers === 0) {
            stop = untrack(() => start(() => increment(version)));
          }
          subscribers += 1;
          return () => {
            queue_micro_task(() => {
              subscribers -= 1;
              if (subscribers === 0) {
                stop == null ? void 0 : stop();
                stop = void 0;
                increment(version);
              }
            });
          };
        });
      }
    };
  }
  var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED;
  function boundary(node, props, children, transform_error) {
    new Boundary(node, props, children, transform_error);
  }
  class Boundary {
    /**
     * @param {TemplateNode} node
     * @param {BoundaryProps} props
     * @param {((anchor: Node) => void)} children
     * @param {((error: unknown) => unknown) | undefined} [transform_error]
     */
    constructor(node, props, children, transform_error) {
      __privateAdd(this, _Boundary_instances);
      /** @type {Boundary | null} */
      __publicField(this, "parent");
      __publicField(this, "is_pending", false);
      /**
       * API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
       * Inherited from parent boundary, or defaults to identity.
       * @type {(error: unknown) => unknown}
       */
      __publicField(this, "transform_error");
      /** @type {TemplateNode} */
      __privateAdd(this, _anchor);
      /** @type {TemplateNode | null} */
      __privateAdd(this, _hydrate_open, null);
      /** @type {BoundaryProps} */
      __privateAdd(this, _props);
      /** @type {((anchor: Node) => void)} */
      __privateAdd(this, _children);
      /** @type {Effect} */
      __privateAdd(this, _effect);
      /** @type {Effect | null} */
      __privateAdd(this, _main_effect, null);
      /** @type {Effect | null} */
      __privateAdd(this, _pending_effect, null);
      /** @type {Effect | null} */
      __privateAdd(this, _failed_effect, null);
      /** @type {DocumentFragment | null} */
      __privateAdd(this, _offscreen_fragment, null);
      __privateAdd(this, _local_pending_count, 0);
      __privateAdd(this, _pending_count, 0);
      __privateAdd(this, _pending_count_update_queued, false);
      /** @type {Set<Effect>} */
      __privateAdd(this, _dirty_effects, /* @__PURE__ */ new Set());
      /** @type {Set<Effect>} */
      __privateAdd(this, _maybe_dirty_effects, /* @__PURE__ */ new Set());
      /**
       * A source containing the number of pending async deriveds/expressions.
       * Only created if `$effect.pending()` is used inside the boundary,
       * otherwise updating the source results in needless `Batch.ensure()`
       * calls followed by no-op flushes
       * @type {Source<number> | null}
       */
      __privateAdd(this, _effect_pending, null);
      __privateAdd(this, _effect_pending_subscriber, createSubscriber(() => {
        __privateSet(this, _effect_pending, source(__privateGet(this, _local_pending_count)));
        return () => {
          __privateSet(this, _effect_pending, null);
        };
      }));
      var _a2;
      __privateSet(this, _anchor, node);
      __privateSet(this, _props, props);
      __privateSet(this, _children, (anchor) => {
        var effect2 = (
          /** @type {Effect} */
          active_effect
        );
        effect2.b = this;
        effect2.f |= BOUNDARY_EFFECT;
        children(anchor);
      });
      this.parent = /** @type {Effect} */
      active_effect.b;
      this.transform_error = transform_error ?? ((_a2 = this.parent) == null ? void 0 : _a2.transform_error) ?? ((e) => e);
      __privateSet(this, _effect, block(() => {
        {
          __privateMethod(this, _Boundary_instances, render_fn).call(this);
        }
      }, flags));
    }
    /**
     * Defer an effect inside a pending boundary until the boundary resolves
     * @param {Effect} effect
     */
    defer_effect(effect2) {
      defer_effect(effect2, __privateGet(this, _dirty_effects), __privateGet(this, _maybe_dirty_effects));
    }
    /**
     * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
     * @returns {boolean}
     */
    is_rendered() {
      return !this.is_pending && (!this.parent || this.parent.is_rendered());
    }
    has_pending_snippet() {
      return !!__privateGet(this, _props).pending;
    }
    /**
     * Update the source that powers `$effect.pending()` inside this boundary,
     * and controls when the current `pending` snippet (if any) is removed.
     * Do not call from inside the class
     * @param {1 | -1} d
     * @param {Batch} batch
     */
    update_pending_count(d, batch) {
      __privateMethod(this, _Boundary_instances, update_pending_count_fn).call(this, d, batch);
      __privateSet(this, _local_pending_count, __privateGet(this, _local_pending_count) + d);
      if (!__privateGet(this, _effect_pending) || __privateGet(this, _pending_count_update_queued)) return;
      __privateSet(this, _pending_count_update_queued, true);
      queue_micro_task(() => {
        __privateSet(this, _pending_count_update_queued, false);
        if (__privateGet(this, _effect_pending)) {
          internal_set(__privateGet(this, _effect_pending), __privateGet(this, _local_pending_count));
        }
      });
    }
    get_effect_pending() {
      __privateGet(this, _effect_pending_subscriber).call(this);
      return get(
        /** @type {Source<number>} */
        __privateGet(this, _effect_pending)
      );
    }
    /** @param {unknown} error */
    error(error) {
      if (!__privateGet(this, _props).onerror && !__privateGet(this, _props).failed) {
        throw error;
      }
      if (current_batch == null ? void 0 : current_batch.is_fork) {
        if (__privateGet(this, _main_effect)) current_batch.skip_effect(__privateGet(this, _main_effect));
        if (__privateGet(this, _pending_effect)) current_batch.skip_effect(__privateGet(this, _pending_effect));
        if (__privateGet(this, _failed_effect)) current_batch.skip_effect(__privateGet(this, _failed_effect));
        current_batch.oncommit(() => {
          __privateMethod(this, _Boundary_instances, handle_error_fn).call(this, error);
        });
      } else {
        __privateMethod(this, _Boundary_instances, handle_error_fn).call(this, error);
      }
    }
  }
  _anchor = new WeakMap();
  _hydrate_open = new WeakMap();
  _props = new WeakMap();
  _children = new WeakMap();
  _effect = new WeakMap();
  _main_effect = new WeakMap();
  _pending_effect = new WeakMap();
  _failed_effect = new WeakMap();
  _offscreen_fragment = new WeakMap();
  _local_pending_count = new WeakMap();
  _pending_count = new WeakMap();
  _pending_count_update_queued = new WeakMap();
  _dirty_effects = new WeakMap();
  _maybe_dirty_effects = new WeakMap();
  _effect_pending = new WeakMap();
  _effect_pending_subscriber = new WeakMap();
  _Boundary_instances = new WeakSet();
  render_fn = function() {
    try {
      this.is_pending = this.has_pending_snippet();
      __privateSet(this, _pending_count, 0);
      __privateSet(this, _local_pending_count, 0);
      __privateSet(this, _main_effect, branch(() => {
        __privateGet(this, _children).call(this, __privateGet(this, _anchor));
      }));
      if (__privateGet(this, _pending_count) > 0) {
        var fragment = __privateSet(this, _offscreen_fragment, document.createDocumentFragment());
        move_effect(__privateGet(this, _main_effect), fragment);
        const pending = (
          /** @type {(anchor: Node) => void} */
          __privateGet(this, _props).pending
        );
        __privateSet(this, _pending_effect, branch(() => pending(__privateGet(this, _anchor))));
      } else {
        __privateMethod(this, _Boundary_instances, resolve_fn).call(
          this,
          /** @type {Batch} */
          current_batch
        );
      }
    } catch (error) {
      this.error(error);
    }
  };
  /**
   * @param {Batch} batch
   */
  resolve_fn = function(batch) {
    this.is_pending = false;
    batch.transfer_effects(__privateGet(this, _dirty_effects), __privateGet(this, _maybe_dirty_effects));
  };
  /**
   * @template T
   * @param {() => T} fn
   */
  run_fn = function(fn) {
    var previous_effect = active_effect;
    var previous_reaction = active_reaction;
    var previous_ctx = component_context;
    set_active_effect(__privateGet(this, _effect));
    set_active_reaction(__privateGet(this, _effect));
    set_component_context(__privateGet(this, _effect).ctx);
    try {
      Batch.ensure();
      return fn();
    } catch (e) {
      handle_error(e);
      return null;
    } finally {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_ctx);
    }
  };
  /**
   * Updates the pending count associated with the currently visible pending snippet,
   * if any, such that we can replace the snippet with content once work is done
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  update_pending_count_fn = function(d, batch) {
    var _a2;
    if (!this.has_pending_snippet()) {
      if (this.parent) {
        __privateMethod(_a2 = this.parent, _Boundary_instances, update_pending_count_fn).call(_a2, d, batch);
      }
      return;
    }
    __privateSet(this, _pending_count, __privateGet(this, _pending_count) + d);
    if (__privateGet(this, _pending_count) === 0) {
      __privateMethod(this, _Boundary_instances, resolve_fn).call(this, batch);
      if (__privateGet(this, _pending_effect)) {
        pause_effect(__privateGet(this, _pending_effect), () => {
          __privateSet(this, _pending_effect, null);
        });
      }
      if (__privateGet(this, _offscreen_fragment)) {
        __privateGet(this, _anchor).before(__privateGet(this, _offscreen_fragment));
        __privateSet(this, _offscreen_fragment, null);
      }
    }
  };
  /**
   * @param {unknown} error
   */
  handle_error_fn = function(error) {
    if (__privateGet(this, _main_effect)) {
      destroy_effect(__privateGet(this, _main_effect));
      __privateSet(this, _main_effect, null);
    }
    if (__privateGet(this, _pending_effect)) {
      destroy_effect(__privateGet(this, _pending_effect));
      __privateSet(this, _pending_effect, null);
    }
    if (__privateGet(this, _failed_effect)) {
      destroy_effect(__privateGet(this, _failed_effect));
      __privateSet(this, _failed_effect, null);
    }
    var onerror = __privateGet(this, _props).onerror;
    let failed = __privateGet(this, _props).failed;
    var did_reset = false;
    var calling_on_error = false;
    const reset = () => {
      if (did_reset) {
        svelte_boundary_reset_noop();
        return;
      }
      did_reset = true;
      if (calling_on_error) {
        svelte_boundary_reset_onerror();
      }
      if (__privateGet(this, _failed_effect) !== null) {
        pause_effect(__privateGet(this, _failed_effect), () => {
          __privateSet(this, _failed_effect, null);
        });
      }
      __privateMethod(this, _Boundary_instances, run_fn).call(this, () => {
        __privateMethod(this, _Boundary_instances, render_fn).call(this);
      });
    };
    const handle_error_result = (transformed_error) => {
      try {
        calling_on_error = true;
        onerror == null ? void 0 : onerror(transformed_error, reset);
        calling_on_error = false;
      } catch (error2) {
        invoke_error_boundary(error2, __privateGet(this, _effect) && __privateGet(this, _effect).parent);
      }
      if (failed) {
        __privateSet(this, _failed_effect, __privateMethod(this, _Boundary_instances, run_fn).call(this, () => {
          try {
            return branch(() => {
              var effect2 = (
                /** @type {Effect} */
                active_effect
              );
              effect2.b = this;
              effect2.f |= BOUNDARY_EFFECT;
              failed(
                __privateGet(this, _anchor),
                () => transformed_error,
                () => reset
              );
            });
          } catch (error2) {
            invoke_error_boundary(
              error2,
              /** @type {Effect} */
              __privateGet(this, _effect).parent
            );
            return null;
          }
        }));
      }
    };
    queue_micro_task(() => {
      var result;
      try {
        result = this.transform_error(error);
      } catch (e) {
        invoke_error_boundary(e, __privateGet(this, _effect) && __privateGet(this, _effect).parent);
        return;
      }
      if (result !== null && typeof result === "object" && typeof /** @type {any} */
      result.then === "function") {
        result.then(
          handle_error_result,
          /** @param {unknown} e */
          (e) => invoke_error_boundary(e, __privateGet(this, _effect) && __privateGet(this, _effect).parent)
        );
      } else {
        handle_error_result(result);
      }
    });
  };
  function flatten(blockers, sync, async, fn) {
    const d = derived;
    var pending = blockers.filter((b) => !b.settled);
    var deriveds = sync.map(d);
    if (async.length === 0 && pending.length === 0) {
      fn(deriveds);
      return;
    }
    var parent = (
      /** @type {Effect} */
      active_effect
    );
    var restore = capture();
    var blocker_promise = pending.length === 1 ? pending[0].promise : pending.length > 1 ? Promise.all(pending.map((b) => b.promise)) : null;
    function finish(async2) {
      if ((parent.f & DESTROYED) !== 0) {
        return;
      }
      restore();
      try {
        fn([...deriveds, ...async2]);
      } catch (error) {
        invoke_error_boundary(error, parent);
      }
      unset_context();
    }
    var decrement_pending = increment_pending();
    if (async.length === 0) {
      blocker_promise.then(() => finish([])).finally(decrement_pending);
      return;
    }
    function run() {
      Promise.all(async.map((expression) => /* @__PURE__ */ async_derived(expression))).then(finish).catch((error) => invoke_error_boundary(error, parent)).finally(decrement_pending);
    }
    if (blocker_promise) {
      blocker_promise.then(() => {
        restore();
        run();
        unset_context();
      });
    } else {
      run();
    }
  }
  function capture() {
    var previous_effect = (
      /** @type {Effect} */
      active_effect
    );
    var previous_reaction = active_reaction;
    var previous_component_context = component_context;
    var previous_batch2 = (
      /** @type {Batch} */
      current_batch
    );
    return function restore(activate_batch = true) {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_component_context);
      if (activate_batch && (previous_effect.f & DESTROYED) === 0) {
        previous_batch2 == null ? void 0 : previous_batch2.activate();
        previous_batch2 == null ? void 0 : previous_batch2.apply();
      }
    };
  }
  function unset_context(deactivate_batch = true) {
    set_active_effect(null);
    set_active_reaction(null);
    set_component_context(null);
    if (deactivate_batch) current_batch == null ? void 0 : current_batch.deactivate();
  }
  function increment_pending() {
    var effect2 = (
      /** @type {Effect} */
      active_effect
    );
    var boundary2 = effect2.b;
    var batch = (
      /** @type {Batch} */
      current_batch
    );
    var blocking = !!(boundary2 == null ? void 0 : boundary2.is_rendered());
    boundary2 == null ? void 0 : boundary2.update_pending_count(1, batch);
    batch.increment(blocking, effect2);
    return () => {
      boundary2 == null ? void 0 : boundary2.update_pending_count(-1, batch);
      batch.decrement(blocking, effect2);
    };
  }
  // @__NO_SIDE_EFFECTS__
  function derived(fn) {
    var flags2 = DERIVED | DIRTY;
    if (active_effect !== null) {
      active_effect.f |= EFFECT_PRESERVED;
    }
    const signal = {
      ctx: component_context,
      deps: null,
      effects: null,
      equals,
      f: flags2,
      fn,
      reactions: null,
      rv: 0,
      v: (
        /** @type {V} */
        UNINITIALIZED
      ),
      wv: 0,
      parent: active_effect,
      ac: null
    };
    return signal;
  }
  const OBSOLETE = Symbol("obsolete");
  // @__NO_SIDE_EFFECTS__
  function async_derived(fn, label, location) {
    let parent = (
      /** @type {Effect | null} */
      active_effect
    );
    if (parent === null) {
      async_derived_orphan();
    }
    var promise = (
      /** @type {Promise<V>} */
      /** @type {unknown} */
      void 0
    );
    var signal = source(
      /** @type {V} */
      UNINITIALIZED
    );
    var should_suspend = !active_reaction;
    var deferreds = /* @__PURE__ */ new Set();
    async_effect(() => {
      var _a2, _b2;
      var effect2 = (
        /** @type {Effect} */
        active_effect
      );
      var d = deferred();
      promise = d.promise;
      try {
        Promise.resolve(fn()).then(d.resolve, (e) => {
          if (e !== STALE_REACTION) d.reject(e);
        }).finally(unset_context);
      } catch (error) {
        d.reject(error);
        unset_context();
      }
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      if (should_suspend) {
        if ((effect2.f & REACTION_RAN) !== 0) {
          var decrement_pending = increment_pending();
        }
        if (
          // boundary can be null if the async derived is inside an $effect.root not connected to the component render tree
          (_a2 = parent.b) == null ? void 0 : _a2.is_rendered()
        ) {
          (_b2 = batch.async_deriveds.get(effect2)) == null ? void 0 : _b2.reject(OBSOLETE);
        } else {
          for (const d2 of deferreds.values()) {
            d2.reject(OBSOLETE);
          }
        }
        deferreds.add(d);
        batch.async_deriveds.set(effect2, d);
      }
      const handler = (value, error = void 0) => {
        decrement_pending == null ? void 0 : decrement_pending();
        deferreds.delete(d);
        if (error === OBSOLETE) return;
        batch.activate();
        if (error) {
          signal.f |= ERROR_VALUE;
          internal_set(signal, error);
        } else {
          if ((signal.f & ERROR_VALUE) !== 0) {
            signal.f ^= ERROR_VALUE;
          }
          internal_set(signal, value);
        }
        batch.deactivate();
      };
      d.promise.then(handler, (e) => handler(null, e || "unknown"));
    });
    teardown(() => {
      for (const d of deferreds) {
        d.reject(OBSOLETE);
      }
    });
    return new Promise((fulfil) => {
      function next(p) {
        function go() {
          if (p === promise) {
            fulfil(signal);
          } else {
            next(promise);
          }
        }
        p.then(go, go);
      }
      next(promise);
    });
  }
  // @__NO_SIDE_EFFECTS__
  function user_derived(fn) {
    const d = /* @__PURE__ */ derived(fn);
    push_reaction_value(d);
    return d;
  }
  // @__NO_SIDE_EFFECTS__
  function derived_safe_equal(fn) {
    const signal = /* @__PURE__ */ derived(fn);
    signal.equals = safe_equals;
    return signal;
  }
  function destroy_derived_effects(derived2) {
    var effects = derived2.effects;
    if (effects !== null) {
      derived2.effects = null;
      for (var i = 0; i < effects.length; i += 1) {
        destroy_effect(
          /** @type {Effect} */
          effects[i]
        );
      }
    }
  }
  function execute_derived(derived2) {
    var value;
    var prev_active_effect = active_effect;
    var parent = derived2.parent;
    if (!is_destroying_effect && parent !== null && derived2.v !== UNINITIALIZED && // if it was never evaluated before, it's guaranteed to fail downstream, so we try to execute instead
    (parent.f & (DESTROYED | INERT)) !== 0) {
      derived_inert();
      return derived2.v;
    }
    set_active_effect(parent);
    {
      try {
        derived2.f &= ~WAS_MARKED;
        destroy_derived_effects(derived2);
        value = update_reaction(derived2);
      } finally {
        set_active_effect(prev_active_effect);
      }
    }
    return value;
  }
  function update_derived(derived2) {
    var value = execute_derived(derived2);
    if (!derived2.equals(value)) {
      derived2.wv = increment_write_version();
      if (!(current_batch == null ? void 0 : current_batch.is_fork) || derived2.deps === null) {
        if (current_batch !== null) {
          current_batch.capture(derived2, value, true);
          previous_batch == null ? void 0 : previous_batch.capture(derived2, value, true);
        } else {
          derived2.v = value;
        }
        if (derived2.deps === null) {
          set_signal_status(derived2, CLEAN);
          return;
        }
      }
    }
    if (is_destroying_effect) {
      return;
    }
    if (batch_values !== null) {
      if (effect_tracking() || (current_batch == null ? void 0 : current_batch.is_fork)) {
        batch_values.set(derived2, value);
      }
    } else {
      update_derived_status(derived2);
    }
  }
  function freeze_derived_effects(derived2) {
    var _a2, _b2;
    if (derived2.effects === null) return;
    for (const e of derived2.effects) {
      if (e.teardown || e.ac) {
        (_a2 = e.teardown) == null ? void 0 : _a2.call(e);
        (_b2 = e.ac) == null ? void 0 : _b2.abort(STALE_REACTION);
        if (e.fn !== null) e.teardown = noop;
        e.ac = null;
        remove_reactions(e, 0);
        destroy_effect_children(e);
      }
    }
  }
  function unfreeze_derived_effects(derived2) {
    if (derived2.effects === null) return;
    for (const e of derived2.effects) {
      if (e.teardown && e.fn !== null) {
        update_effect(e);
      }
    }
  }
  let last_batch = null;
  let current_batch = null;
  let previous_batch = null;
  let batch_values = null;
  let last_scheduled_effect = null;
  let is_flushing_sync = false;
  let is_processing = false;
  let collected_effects = null;
  let legacy_updates = null;
  var flush_count = 0;
  let uid = 1;
  const _Batch = class _Batch {
    constructor() {
      __privateAdd(this, _Batch_instances);
      __publicField(this, "id", uid++);
      /** True as soon as `#process` was called */
      __privateAdd(this, _started, false);
      __publicField(this, "linked", true);
      /** @type {Batch | null} */
      __privateAdd(this, _prev, null);
      /** @type {Batch | null} */
      __privateAdd(this, _next, null);
      /** @type {Map<Effect, ReturnType<typeof deferred<any>>>} */
      __publicField(this, "async_deriveds", /* @__PURE__ */ new Map());
      /**
       * The current values of any signals that are updated in this batch.
       * Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
       * They keys of this map are identical to `this.#previous`
       * @type {Map<Value, [any, boolean]>}
       */
      __publicField(this, "current", /* @__PURE__ */ new Map());
      /**
       * The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
       * They keys of this map are identical to `this.#current`
       * @type {Map<Value, any>}
       */
      __publicField(this, "previous", /* @__PURE__ */ new Map());
      /**
       * When the batch is committed (and the DOM is updated), we need to remove old branches
       * and append new ones by calling the functions added inside (if/each/key/etc) blocks
       * @type {Set<(batch: Batch) => void>}
       */
      __privateAdd(this, _commit_callbacks, /* @__PURE__ */ new Set());
      /**
       * If a fork is discarded, we need to destroy any effects that are no longer needed
       * @type {Set<(batch: Batch) => void>}
       */
      __privateAdd(this, _discard_callbacks, /* @__PURE__ */ new Set());
      /**
       * The number of async effects that are currently in flight
       */
      __privateAdd(this, _pending, 0);
      /**
       * Async effects that are currently in flight, _not_ inside a pending boundary
       * @type {Map<Effect, number>}
       */
      __privateAdd(this, _blocking_pending, /* @__PURE__ */ new Map());
      /**
       * A deferred that resolves when the batch is committed, used with `settled()`
       * TODO replace with Promise.withResolvers once supported widely enough
       * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
       */
      __privateAdd(this, _deferred, null);
      /**
       * The root effects that need to be flushed
       * @type {Effect[]}
       */
      __privateAdd(this, _roots, []);
      /**
       * Effects created while this batch was active.
       * @type {Effect[]}
       */
      __privateAdd(this, _new_effects, []);
      /**
       * Deferred effects (which run after async work has completed) that are DIRTY
       * @type {Set<Effect>}
       */
      __privateAdd(this, _dirty_effects2, /* @__PURE__ */ new Set());
      /**
       * Deferred effects that are MAYBE_DIRTY
       * @type {Set<Effect>}
       */
      __privateAdd(this, _maybe_dirty_effects2, /* @__PURE__ */ new Set());
      /**
       * A map of branches that still exist, but will be destroyed when this batch
       * is committed — we skip over these during `process`.
       * The value contains child effects that were dirty/maybe_dirty before being reset,
       * so they can be rescheduled if the branch survives.
       * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
       */
      __privateAdd(this, _skipped_branches, /* @__PURE__ */ new Map());
      /**
       * Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
       * @type {Set<Effect>}
       */
      __privateAdd(this, _unskipped_branches, /* @__PURE__ */ new Set());
      __publicField(this, "is_fork", false);
      __privateAdd(this, _decrement_queued, false);
      if (last_batch === null) {
        last_batch = this;
      } else {
        __privateSet(last_batch, _next, this);
        __privateSet(this, _prev, last_batch);
      }
      last_batch = this;
    }
    /**
     * Add an effect to the #skipped_branches map and reset its children
     * @param {Effect} effect
     */
    skip_effect(effect2) {
      if (!__privateGet(this, _skipped_branches).has(effect2)) {
        __privateGet(this, _skipped_branches).set(effect2, { d: [], m: [] });
      }
      __privateGet(this, _unskipped_branches).delete(effect2);
    }
    /**
     * Remove an effect from the #skipped_branches map and reschedule
     * any tracked dirty/maybe_dirty child effects
     * @param {Effect} effect
     * @param {(e: Effect) => void} callback
     */
    unskip_effect(effect2, callback = (e) => this.schedule(e)) {
      var tracked = __privateGet(this, _skipped_branches).get(effect2);
      if (tracked) {
        __privateGet(this, _skipped_branches).delete(effect2);
        for (var e of tracked.d) {
          set_signal_status(e, DIRTY);
          callback(e);
        }
        for (e of tracked.m) {
          set_signal_status(e, MAYBE_DIRTY);
          callback(e);
        }
      }
      __privateGet(this, _unskipped_branches).add(effect2);
    }
    /**
     * Associate a change to a given source with the current
     * batch, noting its previous and current values
     * @param {Value} source
     * @param {any} value
     * @param {boolean} [is_derived]
     */
    capture(source2, value, is_derived = false) {
      if (source2.v !== UNINITIALIZED && !this.previous.has(source2)) {
        this.previous.set(source2, source2.v);
      }
      if ((source2.f & ERROR_VALUE) === 0) {
        this.current.set(source2, [value, is_derived]);
        batch_values == null ? void 0 : batch_values.set(source2, value);
      }
      if (!this.is_fork) {
        source2.v = value;
      }
    }
    activate() {
      current_batch = this;
    }
    deactivate() {
      current_batch = null;
      batch_values = null;
    }
    flush() {
      try {
        if (DEV) ;
        is_processing = true;
        current_batch = this;
        __privateMethod(this, _Batch_instances, process_fn).call(this);
      } finally {
        flush_count = 0;
        last_scheduled_effect = null;
        collected_effects = null;
        legacy_updates = null;
        is_processing = false;
        current_batch = null;
        batch_values = null;
        old_values.clear();
      }
    }
    discard() {
      var _a2;
      for (const fn of __privateGet(this, _discard_callbacks)) fn(this);
      __privateGet(this, _discard_callbacks).clear();
      for (const deferred2 of this.async_deriveds.values()) {
        deferred2.reject(OBSOLETE);
      }
      __privateMethod(this, _Batch_instances, unlink_fn).call(this);
      (_a2 = __privateGet(this, _deferred)) == null ? void 0 : _a2.resolve();
    }
    /**
     * @param {Effect} effect
     */
    register_created_effect(effect2) {
      __privateGet(this, _new_effects).push(effect2);
    }
    /**
     * @param {boolean} blocking
     * @param {Effect} effect
     */
    increment(blocking, effect2) {
      __privateSet(this, _pending, __privateGet(this, _pending) + 1);
      if (blocking) {
        let blocking_pending_count = __privateGet(this, _blocking_pending).get(effect2) ?? 0;
        __privateGet(this, _blocking_pending).set(effect2, blocking_pending_count + 1);
      }
    }
    /**
     * @param {boolean} blocking
     * @param {Effect} effect
     */
    decrement(blocking, effect2) {
      __privateSet(this, _pending, __privateGet(this, _pending) - 1);
      if (blocking) {
        let blocking_pending_count = __privateGet(this, _blocking_pending).get(effect2) ?? 0;
        if (blocking_pending_count === 1) {
          __privateGet(this, _blocking_pending).delete(effect2);
        } else {
          __privateGet(this, _blocking_pending).set(effect2, blocking_pending_count - 1);
        }
      }
      if (__privateGet(this, _decrement_queued)) return;
      __privateSet(this, _decrement_queued, true);
      queue_micro_task(() => {
        __privateSet(this, _decrement_queued, false);
        if (this.linked) {
          this.flush();
        }
      });
    }
    /**
     * @param {Set<Effect>} dirty_effects
     * @param {Set<Effect>} maybe_dirty_effects
     */
    transfer_effects(dirty_effects, maybe_dirty_effects) {
      for (const e of dirty_effects) {
        __privateGet(this, _dirty_effects2).add(e);
      }
      for (const e of maybe_dirty_effects) {
        __privateGet(this, _maybe_dirty_effects2).add(e);
      }
      dirty_effects.clear();
      maybe_dirty_effects.clear();
    }
    /** @param {(batch: Batch) => void} fn */
    oncommit(fn) {
      __privateGet(this, _commit_callbacks).add(fn);
    }
    /** @param {(batch: Batch) => void} fn */
    ondiscard(fn) {
      __privateGet(this, _discard_callbacks).add(fn);
    }
    settled() {
      return (__privateGet(this, _deferred) ?? __privateSet(this, _deferred, deferred())).promise;
    }
    static ensure() {
      if (current_batch === null) {
        const batch = current_batch = new _Batch();
        if (!is_processing && !is_flushing_sync) {
          queue_micro_task(() => {
            if (!__privateGet(batch, _started)) {
              batch.flush();
            }
          });
        }
      }
      return current_batch;
    }
    apply() {
      {
        batch_values = null;
        return;
      }
    }
    /**
     *
     * @param {Effect} effect
     */
    schedule(effect2) {
      var _a2;
      last_scheduled_effect = effect2;
      if (((_a2 = effect2.b) == null ? void 0 : _a2.is_pending) && (effect2.f & (EFFECT | RENDER_EFFECT | MANAGED_EFFECT)) !== 0 && (effect2.f & REACTION_RAN) === 0) {
        effect2.b.defer_effect(effect2);
        return;
      }
      var e = effect2;
      while (e.parent !== null) {
        e = e.parent;
        var flags2 = e.f;
        if (collected_effects !== null && e === active_effect) {
          if ((active_reaction === null || (active_reaction.f & DERIVED) === 0) && true) {
            return;
          }
        }
        if ((flags2 & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
          if ((flags2 & CLEAN) === 0) {
            return;
          }
          e.f ^= CLEAN;
        }
      }
      __privateGet(this, _roots).push(e);
    }
  };
  _started = new WeakMap();
  _prev = new WeakMap();
  _next = new WeakMap();
  _commit_callbacks = new WeakMap();
  _discard_callbacks = new WeakMap();
  _pending = new WeakMap();
  _blocking_pending = new WeakMap();
  _deferred = new WeakMap();
  _roots = new WeakMap();
  _new_effects = new WeakMap();
  _dirty_effects2 = new WeakMap();
  _maybe_dirty_effects2 = new WeakMap();
  _skipped_branches = new WeakMap();
  _unskipped_branches = new WeakMap();
  _decrement_queued = new WeakMap();
  _Batch_instances = new WeakSet();
  is_deferred_fn = function() {
    if (this.is_fork) return true;
    for (const effect2 of __privateGet(this, _blocking_pending).keys()) {
      var e = effect2;
      var skipped = false;
      while (e.parent !== null) {
        if (__privateGet(this, _skipped_branches).has(e)) {
          skipped = true;
          break;
        }
        e = e.parent;
      }
      if (!skipped) {
        return true;
      }
    }
    return false;
  };
  process_fn = function() {
    var _a2, _b2, _c, _d;
    __privateSet(this, _started, true);
    if (flush_count++ > 1e3) {
      __privateMethod(this, _Batch_instances, unlink_fn).call(this);
      infinite_loop_guard();
    }
    for (const e of __privateGet(this, _dirty_effects2)) {
      __privateGet(this, _maybe_dirty_effects2).delete(e);
      set_signal_status(e, DIRTY);
      this.schedule(e);
    }
    for (const e of __privateGet(this, _maybe_dirty_effects2)) {
      set_signal_status(e, MAYBE_DIRTY);
      this.schedule(e);
    }
    const roots = __privateGet(this, _roots);
    __privateSet(this, _roots, []);
    this.apply();
    var effects = collected_effects = [];
    var render_effects = [];
    var updates = legacy_updates = [];
    for (const root2 of roots) {
      try {
        __privateMethod(this, _Batch_instances, traverse_fn).call(this, root2, effects, render_effects);
      } catch (e) {
        reset_all(root2);
        if (!__privateMethod(this, _Batch_instances, is_deferred_fn).call(this)) this.discard();
        throw e;
      }
    }
    current_batch = null;
    if (updates.length > 0) {
      var batch = _Batch.ensure();
      for (const e of updates) {
        batch.schedule(e);
      }
    }
    collected_effects = null;
    legacy_updates = null;
    if (__privateMethod(this, _Batch_instances, is_deferred_fn).call(this)) {
      __privateMethod(this, _Batch_instances, defer_effects_fn).call(this, render_effects);
      __privateMethod(this, _Batch_instances, defer_effects_fn).call(this, effects);
      for (const [e, t] of __privateGet(this, _skipped_branches)) {
        reset_branch(e, t);
      }
      if (updates.length > 0) {
        /** @type {unknown} */
        __privateMethod(_a2 = current_batch, _Batch_instances, process_fn).call(_a2);
      }
      return;
    }
    const earlier_batch = __privateMethod(this, _Batch_instances, find_earlier_batch_fn).call(this);
    if (earlier_batch) {
      __privateMethod(this, _Batch_instances, defer_effects_fn).call(this, render_effects);
      __privateMethod(this, _Batch_instances, defer_effects_fn).call(this, effects);
      __privateMethod(_b2 = earlier_batch, _Batch_instances, merge_fn).call(_b2, this);
      return;
    }
    __privateGet(this, _dirty_effects2).clear();
    __privateGet(this, _maybe_dirty_effects2).clear();
    for (const fn of __privateGet(this, _commit_callbacks)) fn(this);
    __privateGet(this, _commit_callbacks).clear();
    previous_batch = this;
    flush_queued_effects(render_effects);
    flush_queued_effects(effects);
    previous_batch = null;
    (_c = __privateGet(this, _deferred)) == null ? void 0 : _c.resolve();
    var next_batch = (
      /** @type {Batch | null} */
      /** @type {unknown} */
      current_batch
    );
    if (__privateGet(this, _pending) === 0 && (__privateGet(this, _roots).length === 0 || next_batch !== null)) {
      __privateMethod(this, _Batch_instances, unlink_fn).call(this);
    }
    if (__privateGet(this, _roots).length > 0) {
      if (next_batch !== null) {
        const batch2 = next_batch;
        __privateGet(batch2, _roots).push(...__privateGet(this, _roots).filter((r) => !__privateGet(batch2, _roots).includes(r)));
      } else {
        next_batch = this;
      }
    }
    if (next_batch !== null) {
      __privateMethod(_d = next_batch, _Batch_instances, process_fn).call(_d);
    }
  };
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {Effect[]} effects
   * @param {Effect[]} render_effects
   */
  traverse_fn = function(root2, effects, render_effects) {
    root2.f ^= CLEAN;
    var effect2 = root2.first;
    while (effect2 !== null) {
      var flags2 = effect2.f;
      var is_branch = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
      var is_skippable_branch = is_branch && (flags2 & CLEAN) !== 0;
      var skip = is_skippable_branch || (flags2 & INERT) !== 0 || __privateGet(this, _skipped_branches).has(effect2);
      if (!skip && effect2.fn !== null) {
        if (is_branch) {
          effect2.f ^= CLEAN;
        } else if ((flags2 & EFFECT) !== 0) {
          effects.push(effect2);
        } else if (is_dirty(effect2)) {
          if ((flags2 & BLOCK_EFFECT) !== 0) __privateGet(this, _maybe_dirty_effects2).add(effect2);
          update_effect(effect2);
        }
        var child2 = effect2.first;
        if (child2 !== null) {
          effect2 = child2;
          continue;
        }
      }
      while (effect2 !== null) {
        var next = effect2.next;
        if (next !== null) {
          effect2 = next;
          break;
        }
        effect2 = effect2.parent;
      }
    }
  };
  find_earlier_batch_fn = function() {
    var batch = __privateGet(this, _prev);
    while (batch !== null) {
      if (!batch.is_fork) {
        for (const [value, [, is_derived]] of this.current) {
          if (batch.current.has(value) && !is_derived) {
            return batch;
          }
        }
      }
      batch = __privateGet(batch, _prev);
    }
    return null;
  };
  /**
   * @param {Batch} batch
   */
  merge_fn = function(batch) {
    var _a2;
    for (const [source2, value] of batch.current) {
      if (!this.previous.has(source2) && batch.previous.has(source2)) {
        this.previous.set(source2, batch.previous.get(source2));
      }
      this.current.set(source2, value);
    }
    for (const [effect2, deferred2] of batch.async_deriveds) {
      const d = this.async_deriveds.get(effect2);
      if (d) deferred2.promise.then(d.resolve).catch(d.reject);
    }
    batch.async_deriveds.clear();
    this.transfer_effects(__privateGet(batch, _dirty_effects2), __privateGet(batch, _maybe_dirty_effects2));
    const mark = (value) => {
      var reactions = value.reactions;
      if (reactions === null) return;
      for (const reaction of reactions) {
        var flags2 = reaction.f;
        if ((flags2 & DERIVED) !== 0) {
          mark(
            /** @type {Derived} */
            reaction
          );
        } else {
          var effect2 = (
            /** @type {Effect} */
            reaction
          );
          if (flags2 & (ASYNC | BLOCK_EFFECT) && !this.async_deriveds.has(effect2)) {
            __privateGet(this, _maybe_dirty_effects2).delete(effect2);
            set_signal_status(effect2, DIRTY);
            this.schedule(effect2);
          }
        }
      }
    };
    for (const source2 of this.current.keys()) {
      mark(source2);
    }
    this.oncommit(() => batch.discard());
    __privateMethod(_a2 = batch, _Batch_instances, unlink_fn).call(_a2);
    current_batch = this;
    __privateMethod(this, _Batch_instances, process_fn).call(this);
  };
  /**
   * @param {Effect[]} effects
   */
  defer_effects_fn = function(effects) {
    for (var i = 0; i < effects.length; i += 1) {
      defer_effect(effects[i], __privateGet(this, _dirty_effects2), __privateGet(this, _maybe_dirty_effects2));
    }
  };
  unlink_fn = function() {
    if (!this.linked) return;
    var prev = __privateGet(this, _prev);
    var next = __privateGet(this, _next);
    if (prev === null) ; else {
      __privateSet(prev, _next, next);
    }
    if (next === null) {
      last_batch = prev;
    } else {
      __privateSet(next, _prev, prev);
    }
    this.linked = false;
  };
  let Batch = _Batch;
  function flushSync(fn) {
    var was_flushing_sync = is_flushing_sync;
    is_flushing_sync = true;
    try {
      var result;
      if (fn) ;
      while (true) {
        flush_tasks();
        if (current_batch === null) {
          return (
            /** @type {T} */
            result
          );
        }
        current_batch.flush();
      }
    } finally {
      is_flushing_sync = was_flushing_sync;
    }
  }
  function infinite_loop_guard() {
    try {
      effect_update_depth_exceeded();
    } catch (error) {
      invoke_error_boundary(error, last_scheduled_effect);
    }
  }
  let eager_block_effects = null;
  function flush_queued_effects(effects) {
    var length = effects.length;
    if (length === 0) return;
    var i = 0;
    while (i < length) {
      var effect2 = effects[i++];
      if ((effect2.f & (DESTROYED | INERT)) === 0 && is_dirty(effect2)) {
        eager_block_effects = /* @__PURE__ */ new Set();
        update_effect(effect2);
        if (effect2.deps === null && effect2.first === null && effect2.nodes === null && effect2.teardown === null && effect2.ac === null) {
          unlink_effect(effect2);
        }
        if ((eager_block_effects == null ? void 0 : eager_block_effects.size) > 0) {
          old_values.clear();
          for (const e of eager_block_effects) {
            if ((e.f & (DESTROYED | INERT)) !== 0) continue;
            const ordered_effects = [e];
            let ancestor = e.parent;
            while (ancestor !== null) {
              if (eager_block_effects.has(ancestor)) {
                eager_block_effects.delete(ancestor);
                ordered_effects.push(ancestor);
              }
              ancestor = ancestor.parent;
            }
            for (let j = ordered_effects.length - 1; j >= 0; j--) {
              const e2 = ordered_effects[j];
              if ((e2.f & (DESTROYED | INERT)) !== 0) continue;
              update_effect(e2);
            }
          }
          eager_block_effects.clear();
        }
      }
    }
    eager_block_effects = null;
  }
  function schedule_effect(effect2) {
    current_batch.schedule(effect2);
  }
  function reset_branch(effect2, tracked) {
    if ((effect2.f & BRANCH_EFFECT) !== 0 && (effect2.f & CLEAN) !== 0) {
      return;
    }
    if ((effect2.f & DIRTY) !== 0) {
      tracked.d.push(effect2);
    } else if ((effect2.f & MAYBE_DIRTY) !== 0) {
      tracked.m.push(effect2);
    }
    set_signal_status(effect2, CLEAN);
    var e = effect2.first;
    while (e !== null) {
      reset_branch(e, tracked);
      e = e.next;
    }
  }
  function reset_all(effect2) {
    set_signal_status(effect2, CLEAN);
    var e = effect2.first;
    while (e !== null) {
      reset_all(e);
      e = e.next;
    }
  }
  let eager_effects = /* @__PURE__ */ new Set();
  const old_values = /* @__PURE__ */ new Map();
  let eager_effects_deferred = false;
  function source(v, stack) {
    var signal = {
      f: 0,
      // TODO ideally we could skip this altogether, but it causes type errors
      v,
      reactions: null,
      equals,
      rv: 0,
      wv: 0
    };
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function state(v, stack) {
    const s = source(v);
    push_reaction_value(s);
    return s;
  }
  // @__NO_SIDE_EFFECTS__
  function mutable_source(initial_value, immutable = false, trackable = true) {
    const s = source(initial_value);
    if (!immutable) {
      s.equals = safe_equals;
    }
    return s;
  }
  function set(source2, value, should_proxy = false) {
    if (active_reaction !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
    // to ensure we error if state is set inside an inspect effect
    (!untracking || (active_reaction.f & EAGER_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | EAGER_EFFECT)) !== 0 && (current_sources === null || !current_sources.has(source2))) {
      state_unsafe_mutation();
    }
    let new_value = should_proxy ? proxy(value) : value;
    return internal_set(source2, new_value, legacy_updates);
  }
  function internal_set(source2, value, updated_during_traversal = null) {
    if (!source2.equals(value)) {
      old_values.set(source2, is_destroying_effect ? value : source2.v);
      var batch = Batch.ensure();
      batch.capture(source2, value);
      if ((source2.f & DERIVED) !== 0) {
        const derived2 = (
          /** @type {Derived} */
          source2
        );
        if ((source2.f & DIRTY) !== 0) {
          execute_derived(derived2);
        }
        if (batch_values === null) {
          update_derived_status(derived2);
        }
      }
      source2.wv = increment_write_version();
      mark_reactions(source2, DIRTY, updated_during_traversal);
      if (active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
        if (untracked_writes === null) {
          set_untracked_writes([source2]);
        } else {
          untracked_writes.push(source2);
        }
      }
      if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) {
        flush_eager_effects();
      }
    }
    return value;
  }
  function flush_eager_effects() {
    eager_effects_deferred = false;
    for (const effect2 of eager_effects) {
      if ((effect2.f & CLEAN) !== 0) {
        set_signal_status(effect2, MAYBE_DIRTY);
      }
      let dirty;
      try {
        dirty = is_dirty(effect2);
      } catch {
        dirty = true;
      }
      if (dirty) {
        update_effect(effect2);
      }
    }
    eager_effects.clear();
  }
  function increment(source2) {
    set(source2, source2.v + 1);
  }
  function mark_reactions(signal, status, updated_during_traversal) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    var length = reactions.length;
    for (var i = 0; i < length; i++) {
      var reaction = reactions[i];
      var flags2 = reaction.f;
      var not_dirty = (flags2 & DIRTY) === 0;
      if (not_dirty) {
        set_signal_status(reaction, status);
      }
      if ((flags2 & EAGER_EFFECT) !== 0) {
        eager_effects.add(
          /** @type {Effect} */
          reaction
        );
      } else if ((flags2 & DERIVED) !== 0) {
        var derived2 = (
          /** @type {Derived} */
          reaction
        );
        batch_values == null ? void 0 : batch_values.delete(derived2);
        if ((flags2 & WAS_MARKED) === 0) {
          if (flags2 & CONNECTED && (active_effect === null || (active_effect.f & REACTION_IS_UPDATING) === 0)) {
            reaction.f |= WAS_MARKED;
          }
          mark_reactions(derived2, MAYBE_DIRTY, updated_during_traversal);
        }
      } else if (not_dirty) {
        var effect2 = (
          /** @type {Effect} */
          reaction
        );
        if ((flags2 & BLOCK_EFFECT) !== 0 && eager_block_effects !== null) {
          eager_block_effects.add(effect2);
        }
        if (updated_during_traversal !== null) {
          updated_during_traversal.push(effect2);
        } else {
          schedule_effect(effect2);
        }
      }
    }
  }
  function proxy(value) {
    if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
      return value;
    }
    const prototype = get_prototype_of(value);
    if (prototype !== object_prototype && prototype !== array_prototype) {
      return value;
    }
    var sources = /* @__PURE__ */ new Map();
    var is_proxied_array = is_array(value);
    var version = /* @__PURE__ */ state(0);
    var parent_version = update_version;
    var with_parent = (fn) => {
      if (update_version === parent_version) {
        return fn();
      }
      var reaction = active_reaction;
      var version2 = update_version;
      set_active_reaction(null);
      set_update_version(parent_version);
      var result = fn();
      set_active_reaction(reaction);
      set_update_version(version2);
      return result;
    };
    if (is_proxied_array) {
      sources.set("length", /* @__PURE__ */ state(
        /** @type {any[]} */
        value.length
      ));
    }
    return new Proxy(
      /** @type {any} */
      value,
      {
        defineProperty(_, prop2, descriptor) {
          if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
            state_descriptors_fixed();
          }
          var s = sources.get(prop2);
          if (s === void 0) {
            with_parent(() => {
              var s2 = /* @__PURE__ */ state(descriptor.value);
              sources.set(prop2, s2);
              return s2;
            });
          } else {
            set(s, descriptor.value, true);
          }
          return true;
        },
        deleteProperty(target, prop2) {
          var s = sources.get(prop2);
          if (s === void 0) {
            if (prop2 in target) {
              const s2 = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
              sources.set(prop2, s2);
              increment(version);
            }
          } else {
            set(s, UNINITIALIZED);
            increment(version);
          }
          return true;
        },
        get(target, prop2, receiver) {
          var _a2;
          if (prop2 === STATE_SYMBOL) {
            return value;
          }
          var s = sources.get(prop2);
          var exists = prop2 in target;
          if (s === void 0 && (!exists || ((_a2 = get_descriptor(target, prop2)) == null ? void 0 : _a2.writable))) {
            s = with_parent(() => {
              var p = proxy(exists ? target[prop2] : UNINITIALIZED);
              var s2 = /* @__PURE__ */ state(p);
              return s2;
            });
            sources.set(prop2, s);
          }
          if (s !== void 0) {
            var v = get(s);
            return v === UNINITIALIZED ? void 0 : v;
          }
          return Reflect.get(target, prop2, receiver);
        },
        getOwnPropertyDescriptor(target, prop2) {
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
          if (descriptor && "value" in descriptor) {
            var s = sources.get(prop2);
            if (s) descriptor.value = get(s);
          } else if (descriptor === void 0) {
            var source2 = sources.get(prop2);
            var value2 = source2 == null ? void 0 : source2.v;
            if (source2 !== void 0 && value2 !== UNINITIALIZED) {
              return {
                enumerable: true,
                configurable: true,
                value: value2,
                writable: true
              };
            }
          }
          return descriptor;
        },
        has(target, prop2) {
          var _a2;
          if (prop2 === STATE_SYMBOL) {
            return true;
          }
          var s = sources.get(prop2);
          var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target, prop2);
          if (s !== void 0 || active_effect !== null && (!has || ((_a2 = get_descriptor(target, prop2)) == null ? void 0 : _a2.writable))) {
            if (s === void 0) {
              s = with_parent(() => {
                var p = has ? proxy(target[prop2]) : UNINITIALIZED;
                var s2 = /* @__PURE__ */ state(p);
                return s2;
              });
              sources.set(prop2, s);
            }
            var value2 = get(s);
            if (value2 === UNINITIALIZED) {
              return false;
            }
          }
          return has;
        },
        set(target, prop2, value2, receiver) {
          var _a2;
          var s = sources.get(prop2);
          var has = prop2 in target;
          if (is_proxied_array && prop2 === "length") {
            for (var i = value2; i < /** @type {Source<number>} */
            s.v; i += 1) {
              var other_s = sources.get(i + "");
              if (other_s !== void 0) {
                set(other_s, UNINITIALIZED);
              } else if (i in target) {
                other_s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
                sources.set(i + "", other_s);
              }
            }
          }
          if (s === void 0) {
            if (!has || ((_a2 = get_descriptor(target, prop2)) == null ? void 0 : _a2.writable)) {
              s = with_parent(() => /* @__PURE__ */ state(void 0));
              set(s, proxy(value2));
              sources.set(prop2, s);
            }
          } else {
            has = s.v !== UNINITIALIZED;
            var p = with_parent(() => proxy(value2));
            set(s, p);
          }
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
          if (descriptor == null ? void 0 : descriptor.set) {
            descriptor.set.call(receiver, value2);
          }
          if (!has) {
            if (is_proxied_array && typeof prop2 === "string") {
              var ls = (
                /** @type {Source<number>} */
                sources.get("length")
              );
              var n = Number(prop2);
              if (Number.isInteger(n) && n >= ls.v) {
                set(ls, n + 1);
              }
            }
            increment(version);
          }
          return true;
        },
        ownKeys(target) {
          get(version);
          var own_keys = Reflect.ownKeys(target).filter((key2) => {
            var source3 = sources.get(key2);
            return source3 === void 0 || source3.v !== UNINITIALIZED;
          });
          for (var [key, source2] of sources) {
            if (source2.v !== UNINITIALIZED && !(key in target)) {
              own_keys.push(key);
            }
          }
          return own_keys;
        },
        setPrototypeOf() {
          state_prototype_fixed();
        }
      }
    );
  }
  var $window;
  var is_firefox;
  var first_child_getter;
  var next_sibling_getter;
  function init_operations() {
    if ($window !== void 0) {
      return;
    }
    $window = window;
    is_firefox = /Firefox/.test(navigator.userAgent);
    var element_prototype = Element.prototype;
    var node_prototype = Node.prototype;
    var text_prototype = Text.prototype;
    first_child_getter = get_descriptor(node_prototype, "firstChild").get;
    next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
    if (is_extensible(element_prototype)) {
      element_prototype[CLASS_CACHE] = void 0;
      element_prototype[ATTRIBUTES_CACHE] = null;
      element_prototype[STYLE_CACHE] = void 0;
      element_prototype.__e = void 0;
    }
    if (is_extensible(text_prototype)) {
      text_prototype[TEXT_CACHE] = void 0;
    }
  }
  function create_text(value = "") {
    return document.createTextNode(value);
  }
  // @__NO_SIDE_EFFECTS__
  function get_first_child(node) {
    return (
      /** @type {TemplateNode | null} */
      first_child_getter.call(node)
    );
  }
  // @__NO_SIDE_EFFECTS__
  function get_next_sibling(node) {
    return (
      /** @type {TemplateNode | null} */
      next_sibling_getter.call(node)
    );
  }
  function child(node, is_text) {
    {
      return /* @__PURE__ */ get_first_child(node);
    }
  }
  function sibling(node, count = 1, is_text = false) {
    let next_sibling = node;
    while (count--) {
      next_sibling = /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(next_sibling);
    }
    {
      return next_sibling;
    }
  }
  function clear_text_content(node) {
    node.textContent = "";
  }
  function create_element(tag, namespace, is) {
    if (namespace == null || namespace === NAMESPACE_HTML) {
      return (
        /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
        is ? document.createElement(tag, { is }) : document.createElement(tag)
      );
    }
    return (
      /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
      is ? document.createElementNS(namespace, tag, { is }) : document.createElementNS(namespace, tag)
    );
  }
  function without_reactive_context(fn) {
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      return fn();
    } finally {
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  function validate_effect(rune) {
    if (active_effect === null) {
      if (active_reaction === null) {
        effect_orphan();
      }
      effect_in_unowned_derived();
    }
    if (is_destroying_effect) {
      effect_in_teardown();
    }
  }
  function push_effect(effect2, parent_effect) {
    var parent_last = parent_effect.last;
    if (parent_last === null) {
      parent_effect.last = parent_effect.first = effect2;
    } else {
      parent_last.next = effect2;
      effect2.prev = parent_last;
      parent_effect.last = effect2;
    }
  }
  function create_effect(type, fn) {
    var parent = active_effect;
    if (parent !== null && (parent.f & INERT) !== 0) {
      type |= INERT;
    }
    var effect2 = {
      ctx: component_context,
      deps: null,
      nodes: null,
      f: type | DIRTY | CONNECTED,
      first: null,
      fn,
      last: null,
      next: null,
      parent,
      b: parent && parent.b,
      prev: null,
      teardown: null,
      wv: 0,
      ac: null
    };
    current_batch == null ? void 0 : current_batch.register_created_effect(effect2);
    var e = effect2;
    if ((type & EFFECT) !== 0) {
      if (collected_effects !== null) {
        collected_effects.push(effect2);
      } else {
        Batch.ensure().schedule(effect2);
      }
    } else if (fn !== null) {
      try {
        update_effect(effect2);
      } catch (e2) {
        destroy_effect(effect2);
        throw e2;
      }
      if (e.deps === null && e.teardown === null && e.nodes === null && e.first === e.last && // either `null`, or a singular child
      (e.f & EFFECT_PRESERVED) === 0) {
        e = e.first;
        if ((type & BLOCK_EFFECT) !== 0 && (type & EFFECT_TRANSPARENT) !== 0 && e !== null) {
          e.f |= EFFECT_TRANSPARENT;
        }
      }
    }
    if (e !== null) {
      e.parent = parent;
      if (parent !== null) {
        push_effect(e, parent);
      }
      if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
        var derived2 = (
          /** @type {Derived} */
          active_reaction
        );
        (derived2.effects ?? (derived2.effects = [])).push(e);
      }
    }
    return effect2;
  }
  function effect_tracking() {
    return active_reaction !== null && !untracking;
  }
  function teardown(fn) {
    const effect2 = create_effect(RENDER_EFFECT, null);
    set_signal_status(effect2, CLEAN);
    effect2.teardown = fn;
    return effect2;
  }
  function user_effect(fn) {
    validate_effect();
    var flags2 = (
      /** @type {Effect} */
      active_effect.f
    );
    var defer = !active_reaction && (flags2 & BRANCH_EFFECT) !== 0 && component_context !== null && !component_context.i;
    if (defer) {
      var context = (
        /** @type {ComponentContext} */
        component_context
      );
      (context.e ?? (context.e = [])).push(fn);
    } else {
      return create_user_effect(fn);
    }
  }
  function create_user_effect(fn) {
    return create_effect(EFFECT | USER_EFFECT, fn);
  }
  function component_root(fn) {
    Batch.ensure();
    const effect2 = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn);
    return (options = {}) => {
      return new Promise((fulfil) => {
        if (options.outro) {
          pause_effect(effect2, () => {
            destroy_effect(effect2);
            fulfil(void 0);
          });
        } else {
          destroy_effect(effect2);
          fulfil(void 0);
        }
      });
    };
  }
  function effect(fn) {
    return create_effect(EFFECT, fn);
  }
  function async_effect(fn) {
    return create_effect(ASYNC | EFFECT_PRESERVED, fn);
  }
  function render_effect(fn, flags2 = 0) {
    return create_effect(RENDER_EFFECT | flags2, fn);
  }
  function template_effect(fn, sync = [], async = [], blockers = []) {
    flatten(blockers, sync, async, (values) => {
      create_effect(RENDER_EFFECT, () => {
        fn(...values.map(get));
      });
    });
  }
  function block(fn, flags2 = 0) {
    var effect2 = create_effect(BLOCK_EFFECT | flags2, fn);
    return effect2;
  }
  function branch(fn) {
    return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn);
  }
  function execute_effect_teardown(effect2) {
    var teardown2 = effect2.teardown;
    if (teardown2 !== null) {
      const previously_destroying_effect = is_destroying_effect;
      const previous_reaction = active_reaction;
      set_is_destroying_effect(true);
      set_active_reaction(null);
      try {
        teardown2.call(null);
      } finally {
        set_is_destroying_effect(previously_destroying_effect);
        set_active_reaction(previous_reaction);
      }
    }
  }
  function destroy_effect_children(signal, remove_dom = false) {
    var effect2 = signal.first;
    signal.first = signal.last = null;
    while (effect2 !== null) {
      const controller = effect2.ac;
      if (controller !== null) {
        without_reactive_context(() => {
          controller.abort(STALE_REACTION);
        });
      }
      var next = effect2.next;
      if ((effect2.f & ROOT_EFFECT) !== 0) {
        effect2.parent = null;
      } else {
        destroy_effect(effect2, remove_dom);
      }
      effect2 = next;
    }
  }
  function destroy_block_effect_children(signal) {
    var effect2 = signal.first;
    while (effect2 !== null) {
      var next = effect2.next;
      if ((effect2.f & BRANCH_EFFECT) === 0) {
        destroy_effect(effect2);
      }
      effect2 = next;
    }
  }
  function destroy_effect(effect2, remove_dom = true) {
    var removed = false;
    if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes !== null && effect2.nodes.end !== null) {
      remove_effect_dom(
        effect2.nodes.start,
        /** @type {TemplateNode} */
        effect2.nodes.end
      );
      removed = true;
    }
    effect2.f |= DESTROYING;
    destroy_effect_children(effect2, remove_dom && !removed);
    remove_reactions(effect2, 0);
    var transitions = effect2.nodes && effect2.nodes.t;
    if (transitions !== null) {
      for (const transition of transitions) {
        transition.stop();
      }
    }
    execute_effect_teardown(effect2);
    effect2.f ^= DESTROYING;
    effect2.f |= DESTROYED;
    var parent = effect2.parent;
    if (parent !== null && parent.first !== null) {
      unlink_effect(effect2);
    }
    effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes = effect2.ac = effect2.b = null;
  }
  function remove_effect_dom(node, end) {
    while (node !== null) {
      var next = node === end ? null : /* @__PURE__ */ get_next_sibling(node);
      node.remove();
      node = next;
    }
  }
  function unlink_effect(effect2) {
    var parent = effect2.parent;
    var prev = effect2.prev;
    var next = effect2.next;
    if (prev !== null) prev.next = next;
    if (next !== null) next.prev = prev;
    if (parent !== null) {
      if (parent.first === effect2) parent.first = next;
      if (parent.last === effect2) parent.last = prev;
    }
  }
  function pause_effect(effect2, callback, destroy = true) {
    var transitions = [];
    pause_children(effect2, transitions, true);
    var fn = () => {
      if (destroy) destroy_effect(effect2);
      if (callback) callback();
    };
    var remaining = transitions.length;
    if (remaining > 0) {
      var check = () => --remaining || fn();
      for (var transition of transitions) {
        transition.out(check);
      }
    } else {
      fn();
    }
  }
  function pause_children(effect2, transitions, local) {
    if ((effect2.f & INERT) !== 0) return;
    effect2.f ^= INERT;
    var t = effect2.nodes && effect2.nodes.t;
    if (t !== null) {
      for (const transition of t) {
        if (transition.is_global || local) {
          transitions.push(transition);
        }
      }
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      if ((child2.f & ROOT_EFFECT) === 0) {
        var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (child2.f & BRANCH_EFFECT) !== 0 && (effect2.f & BLOCK_EFFECT) !== 0;
        pause_children(child2, transitions, transparent ? local : false);
      }
      child2 = sibling2;
    }
  }
  function resume_effect(effect2) {
    resume_children(effect2, true);
  }
  function resume_children(effect2, local) {
    if ((effect2.f & INERT) === 0) return;
    effect2.f ^= INERT;
    if ((effect2.f & CLEAN) === 0) {
      set_signal_status(effect2, DIRTY);
      Batch.ensure().schedule(effect2);
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      resume_children(child2, transparent ? local : false);
      child2 = sibling2;
    }
    var t = effect2.nodes && effect2.nodes.t;
    if (t !== null) {
      for (const transition of t) {
        if (transition.is_global || local) {
          transition.in();
        }
      }
    }
  }
  function move_effect(effect2, fragment) {
    if (!effect2.nodes) return;
    var node = effect2.nodes.start;
    var end = effect2.nodes.end;
    while (node !== null) {
      var next = node === end ? null : /* @__PURE__ */ get_next_sibling(node);
      fragment.append(node);
      node = next;
    }
  }
  let is_updating_effect = false;
  let is_destroying_effect = false;
  function set_is_destroying_effect(value) {
    is_destroying_effect = value;
  }
  let active_reaction = null;
  let untracking = false;
  function set_active_reaction(reaction) {
    active_reaction = reaction;
  }
  let active_effect = null;
  function set_active_effect(effect2) {
    active_effect = effect2;
  }
  let current_sources = null;
  function push_reaction_value(value) {
    if (active_reaction !== null && true) {
      (current_sources ?? (current_sources = /* @__PURE__ */ new Set())).add(value);
    }
  }
  let new_deps = null;
  let skipped_deps = 0;
  let untracked_writes = null;
  function set_untracked_writes(value) {
    untracked_writes = value;
  }
  let write_version = 1;
  let read_version = 0;
  let update_version = read_version;
  function set_update_version(value) {
    update_version = value;
  }
  function increment_write_version() {
    return ++write_version;
  }
  function is_dirty(reaction) {
    var flags2 = reaction.f;
    if ((flags2 & DIRTY) !== 0) {
      return true;
    }
    if (flags2 & DERIVED) {
      reaction.f &= ~WAS_MARKED;
    }
    if ((flags2 & MAYBE_DIRTY) !== 0) {
      var dependencies = (
        /** @type {Value[]} */
        reaction.deps
      );
      var length = dependencies.length;
      for (var i = 0; i < length; i++) {
        var dependency = dependencies[i];
        if (is_dirty(
          /** @type {Derived} */
          dependency
        )) {
          update_derived(
            /** @type {Derived} */
            dependency
          );
        }
        if (dependency.wv > reaction.wv) {
          return true;
        }
      }
      if ((flags2 & CONNECTED) !== 0 && // During time traveling we don't want to reset the status so that
      // traversal of the graph in the other batches still happens
      batch_values === null) {
        set_signal_status(reaction, CLEAN);
      }
    }
    return false;
  }
  function schedule_possible_effect_self_invalidation(signal, effect2, root2 = true) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    if (current_sources !== null && current_sources.has(signal)) {
      return;
    }
    for (var i = 0; i < reactions.length; i++) {
      var reaction = reactions[i];
      if ((reaction.f & DERIVED) !== 0) {
        schedule_possible_effect_self_invalidation(
          /** @type {Derived} */
          reaction,
          effect2,
          false
        );
      } else if (effect2 === reaction) {
        if (root2) {
          set_signal_status(reaction, DIRTY);
        } else if ((reaction.f & CLEAN) !== 0) {
          set_signal_status(reaction, MAYBE_DIRTY);
        }
        schedule_effect(
          /** @type {Effect} */
          reaction
        );
      }
    }
  }
  function update_reaction(reaction) {
    var _a2;
    var previous_deps = new_deps;
    var previous_skipped_deps = skipped_deps;
    var previous_untracked_writes = untracked_writes;
    var previous_reaction = active_reaction;
    var previous_sources = current_sources;
    var previous_component_context = component_context;
    var previous_untracking = untracking;
    var previous_update_version = update_version;
    var flags2 = reaction.f;
    new_deps = /** @type {null | Value[]} */
    null;
    skipped_deps = 0;
    untracked_writes = null;
    active_reaction = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
    current_sources = null;
    set_component_context(reaction.ctx);
    untracking = false;
    update_version = ++read_version;
    if (reaction.ac !== null) {
      without_reactive_context(() => {
        reaction.ac.abort(STALE_REACTION);
      });
      reaction.ac = null;
    }
    try {
      reaction.f |= REACTION_IS_UPDATING;
      var fn = (
        /** @type {Function} */
        reaction.fn
      );
      var result = fn();
      reaction.f |= REACTION_RAN;
      var deps = reaction.deps;
      var is_fork = current_batch == null ? void 0 : current_batch.is_fork;
      if (new_deps !== null) {
        var i;
        if (!is_fork) {
          remove_reactions(reaction, skipped_deps);
        }
        if (deps !== null && skipped_deps > 0) {
          deps.length = skipped_deps + new_deps.length;
          for (i = 0; i < new_deps.length; i++) {
            deps[skipped_deps + i] = new_deps[i];
          }
        } else {
          reaction.deps = deps = new_deps;
        }
        if (effect_tracking() && (reaction.f & CONNECTED) !== 0) {
          for (i = skipped_deps; i < deps.length; i++) {
            ((_a2 = deps[i]).reactions ?? (_a2.reactions = [])).push(reaction);
          }
        }
      } else if (!is_fork && deps !== null && skipped_deps < deps.length) {
        remove_reactions(reaction, skipped_deps);
        deps.length = skipped_deps;
      }
      if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
        for (i = 0; i < /** @type {Source[]} */
        untracked_writes.length; i++) {
          schedule_possible_effect_self_invalidation(
            untracked_writes[i],
            /** @type {Effect} */
            reaction
          );
        }
      }
      if (previous_reaction !== null && previous_reaction !== reaction) {
        read_version++;
        if (previous_reaction.deps !== null) {
          for (let i2 = 0; i2 < previous_skipped_deps; i2 += 1) {
            previous_reaction.deps[i2].rv = read_version;
          }
        }
        if (previous_deps !== null) {
          for (const dep of previous_deps) {
            dep.rv = read_version;
          }
        }
        if (untracked_writes !== null) {
          if (previous_untracked_writes === null) {
            previous_untracked_writes = untracked_writes;
          } else {
            previous_untracked_writes.push(.../** @type {Source[]} */
            untracked_writes);
          }
        }
      }
      if ((reaction.f & ERROR_VALUE) !== 0) {
        reaction.f ^= ERROR_VALUE;
      }
      return result;
    } catch (error) {
      return handle_error(error);
    } finally {
      reaction.f ^= REACTION_IS_UPDATING;
      new_deps = previous_deps;
      skipped_deps = previous_skipped_deps;
      untracked_writes = previous_untracked_writes;
      active_reaction = previous_reaction;
      current_sources = previous_sources;
      set_component_context(previous_component_context);
      untracking = previous_untracking;
      update_version = previous_update_version;
    }
  }
  function remove_reaction(signal, dependency) {
    let reactions = dependency.reactions;
    if (reactions !== null) {
      var index = index_of.call(reactions, signal);
      if (index !== -1) {
        var new_length = reactions.length - 1;
        if (new_length === 0) {
          reactions = dependency.reactions = null;
        } else {
          reactions[index] = reactions[new_length];
          reactions.pop();
        }
      }
    }
    if (reactions === null && (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
    // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
    // allows us to skip the expensive work of disconnecting and immediately reconnecting it
    (new_deps === null || !includes.call(new_deps, dependency))) {
      var derived2 = (
        /** @type {Derived} */
        dependency
      );
      if ((derived2.f & CONNECTED) !== 0) {
        derived2.f ^= CONNECTED;
        derived2.f &= ~WAS_MARKED;
      }
      if (derived2.v !== UNINITIALIZED) {
        update_derived_status(derived2);
      }
      freeze_derived_effects(derived2);
      remove_reactions(derived2, 0);
    }
  }
  function remove_reactions(signal, start_index) {
    var dependencies = signal.deps;
    if (dependencies === null) return;
    for (var i = start_index; i < dependencies.length; i++) {
      remove_reaction(signal, dependencies[i]);
    }
  }
  function update_effect(effect2) {
    var flags2 = effect2.f;
    if ((flags2 & DESTROYED) !== 0) {
      return;
    }
    set_signal_status(effect2, CLEAN);
    var previous_effect = active_effect;
    var was_updating_effect = is_updating_effect;
    active_effect = effect2;
    is_updating_effect = true;
    try {
      if ((flags2 & (BLOCK_EFFECT | MANAGED_EFFECT)) !== 0) {
        destroy_block_effect_children(effect2);
      } else {
        destroy_effect_children(effect2);
      }
      execute_effect_teardown(effect2);
      var teardown2 = update_reaction(effect2);
      effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
      effect2.wv = write_version;
      var dep;
      if (DEV && tracing_mode_flag && (effect2.f & DIRTY) !== 0 && effect2.deps !== null) ;
    } finally {
      is_updating_effect = was_updating_effect;
      active_effect = previous_effect;
    }
  }
  async function tick() {
    await Promise.resolve();
    flushSync();
  }
  function get(signal) {
    var flags2 = signal.f;
    var is_derived = (flags2 & DERIVED) !== 0;
    if (active_reaction !== null && !untracking) {
      var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;
      if (!destroyed && (current_sources === null || !current_sources.has(signal))) {
        var deps = active_reaction.deps;
        if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
          if (signal.rv < read_version) {
            signal.rv = read_version;
            if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
              skipped_deps++;
            } else if (new_deps === null) {
              new_deps = [signal];
            } else {
              new_deps.push(signal);
            }
          }
        } else {
          active_reaction.deps ?? (active_reaction.deps = []);
          if (!includes.call(active_reaction.deps, signal)) {
            active_reaction.deps.push(signal);
          }
          var reactions = signal.reactions;
          if (reactions === null) {
            signal.reactions = [active_reaction];
          } else if (!includes.call(reactions, active_reaction)) {
            reactions.push(active_reaction);
          }
        }
      }
    }
    if (is_destroying_effect && old_values.has(signal)) {
      return old_values.get(signal);
    }
    if (is_derived) {
      var derived2 = (
        /** @type {Derived} */
        signal
      );
      if (is_destroying_effect) {
        var value = derived2.v;
        if ((derived2.f & CLEAN) === 0 && derived2.reactions !== null || depends_on_old_values(derived2)) {
          value = execute_derived(derived2);
        }
        old_values.set(derived2, value);
        return value;
      }
      var should_connect = (derived2.f & CONNECTED) === 0 && !untracking && active_reaction !== null && (is_updating_effect || (active_reaction.f & CONNECTED) !== 0);
      var is_new = (derived2.f & REACTION_RAN) === 0;
      if (is_dirty(derived2)) {
        if (should_connect) {
          derived2.f |= CONNECTED;
        }
        update_derived(derived2);
      }
      if (should_connect && !is_new) {
        unfreeze_derived_effects(derived2);
        reconnect(derived2);
      }
    }
    if (batch_values == null ? void 0 : batch_values.has(signal)) {
      return batch_values.get(signal);
    }
    if ((signal.f & ERROR_VALUE) !== 0) {
      throw signal.v;
    }
    return signal.v;
  }
  function reconnect(derived2) {
    derived2.f |= CONNECTED;
    if (derived2.deps === null) return;
    for (const dep of derived2.deps) {
      (dep.reactions ?? (dep.reactions = [])).push(derived2);
      if ((dep.f & DERIVED) !== 0 && (dep.f & CONNECTED) === 0) {
        unfreeze_derived_effects(
          /** @type {Derived} */
          dep
        );
        reconnect(
          /** @type {Derived} */
          dep
        );
      }
    }
  }
  function depends_on_old_values(derived2) {
    if (derived2.v === UNINITIALIZED) return true;
    if (derived2.deps === null) return false;
    for (const dep of derived2.deps) {
      if (old_values.has(dep)) {
        return true;
      }
      if ((dep.f & DERIVED) !== 0 && depends_on_old_values(
        /** @type {Derived} */
        dep
      )) {
        return true;
      }
    }
    return false;
  }
  function untrack(fn) {
    var previous_untracking = untracking;
    try {
      untracking = true;
      return fn();
    } finally {
      untracking = previous_untracking;
    }
  }
  const PASSIVE_EVENTS = ["touchstart", "touchmove"];
  function is_passive_event(name) {
    return PASSIVE_EVENTS.includes(name);
  }
  const event_symbol = Symbol("events");
  const all_registered_events = /* @__PURE__ */ new Set();
  const root_event_handles = /* @__PURE__ */ new Set();
  function delegated(event_name, element, handler) {
    (element[event_symbol] ?? (element[event_symbol] = {}))[event_name] = handler;
  }
  function delegate(events) {
    for (var i = 0; i < events.length; i++) {
      all_registered_events.add(events[i]);
    }
    for (var fn of root_event_handles) {
      fn(events);
    }
  }
  let last_propagated_event = null;
  function handle_event_propagation(event) {
    var _a2, _b2;
    var handler_element = this;
    var owner_document = (
      /** @type {Node} */
      handler_element.ownerDocument
    );
    var event_name = event.type;
    var path = ((_a2 = event.composedPath) == null ? void 0 : _a2.call(event)) || [];
    var current_target = (
      /** @type {null | Element} */
      path[0] || event.target
    );
    last_propagated_event = event;
    var path_idx = 0;
    var handled_at = last_propagated_event === event && event[event_symbol];
    if (handled_at) {
      var at_idx = path.indexOf(handled_at);
      if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
      window)) {
        event[event_symbol] = handler_element;
        return;
      }
      var handler_idx = path.indexOf(handler_element);
      if (handler_idx === -1) {
        return;
      }
      if (at_idx <= handler_idx) {
        path_idx = at_idx;
      }
    }
    current_target = /** @type {Element} */
    path[path_idx] || event.target;
    if (current_target === handler_element) return;
    define_property(event, "currentTarget", {
      configurable: true,
      get() {
        return current_target || owner_document;
      }
    });
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      var throw_error;
      var other_errors = [];
      while (current_target !== null) {
        if (current_target === handler_element) break;
        try {
          var delegated2 = (_b2 = current_target[event_symbol]) == null ? void 0 : _b2[event_name];
          if (delegated2 != null && (!/** @type {any} */
          current_target.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          event.target === current_target)) {
            delegated2.call(current_target, event);
          }
        } catch (error) {
          if (throw_error) {
            other_errors.push(error);
          } else {
            throw_error = error;
          }
        }
        if (event.cancelBubble) break;
        path_idx++;
        current_target = path_idx < path.length ? (
          /** @type {Element} */
          path[path_idx]
        ) : null;
      }
      if (throw_error) {
        for (let error of other_errors) {
          queueMicrotask(() => {
            throw error;
          });
        }
        throw throw_error;
      }
    } finally {
      event[event_symbol] = handler_element;
      delete event.currentTarget;
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  const policy = (
    // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
    ((_a = globalThis == null ? void 0 : globalThis.window) == null ? void 0 : _a.trustedTypes) && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
      /** @param {string} html */
      createHTML: (html2) => {
        return html2;
      }
    })
  );
  function create_trusted_html(html2) {
    return (
      /** @type {string} */
      (policy == null ? void 0 : policy.createHTML(html2)) ?? html2
    );
  }
  function create_fragment_from_html(html2) {
    var elem = create_element("template");
    elem.innerHTML = create_trusted_html(html2.replaceAll("<!>", "<!---->"));
    return elem.content;
  }
  function assign_nodes(start, end) {
    var effect2 = (
      /** @type {Effect} */
      active_effect
    );
    if (effect2.nodes === null) {
      effect2.nodes = { start, end, a: null, t: null };
    }
  }
  // @__NO_SIDE_EFFECTS__
  function from_html(content, flags2) {
    var node;
    var has_start = !content.startsWith("<!>");
    return () => {
      if (node === void 0) {
        node = create_fragment_from_html(has_start ? content : "<!>" + content);
        node = /** @type {TemplateNode} */
        /* @__PURE__ */ get_first_child(node);
      }
      var clone = (
        /** @type {TemplateNode} */
        is_firefox ? document.importNode(node, true) : node.cloneNode(true)
      );
      {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  function append(anchor, dom) {
    if (anchor === null) {
      return;
    }
    anchor.before(
      /** @type {Node} */
      dom
    );
  }
  function set_text(text, value) {
    var str = value == null ? "" : typeof value === "object" ? `${value}` : value;
    if (str !== /** @type {any} */
    (text[TEXT_CACHE] ?? (text[TEXT_CACHE] = text.nodeValue))) {
      text[TEXT_CACHE] = str;
      text.nodeValue = `${str}`;
    }
  }
  function mount(component, options) {
    return _mount(component, options);
  }
  const listeners = /* @__PURE__ */ new Map();
  function _mount(Component, { target, anchor, props = {}, events, context, intro = true, transformError }) {
    init_operations();
    var component = void 0;
    var unmount = component_root(() => {
      var anchor_node = anchor ?? target.appendChild(create_text());
      boundary(
        /** @type {TemplateNode} */
        anchor_node,
        {
          pending: () => {
          }
        },
        (anchor_node2) => {
          push({});
          var ctx = (
            /** @type {ComponentContext} */
            component_context
          );
          if (context) ctx.c = context;
          if (events) {
            props.$$events = events;
          }
          component = Component(anchor_node2, props) || {};
          pop();
        },
        transformError
      );
      var registered_events = /* @__PURE__ */ new Set();
      var event_handle = (events2) => {
        for (var i = 0; i < events2.length; i++) {
          var event_name = events2[i];
          if (registered_events.has(event_name)) continue;
          registered_events.add(event_name);
          var passive = is_passive_event(event_name);
          for (const node of [target, document]) {
            var counts = listeners.get(node);
            if (counts === void 0) {
              counts = /* @__PURE__ */ new Map();
              listeners.set(node, counts);
            }
            var count = counts.get(event_name);
            if (count === void 0) {
              node.addEventListener(event_name, handle_event_propagation, { passive });
              counts.set(event_name, 1);
            } else {
              counts.set(event_name, count + 1);
            }
          }
        }
      };
      event_handle(array_from(all_registered_events));
      root_event_handles.add(event_handle);
      return () => {
        var _a2;
        for (var event_name of registered_events) {
          for (const node of [target, document]) {
            var counts = (
              /** @type {Map<string, number>} */
              listeners.get(node)
            );
            var count = (
              /** @type {number} */
              counts.get(event_name)
            );
            if (--count == 0) {
              node.removeEventListener(event_name, handle_event_propagation);
              counts.delete(event_name);
              if (counts.size === 0) {
                listeners.delete(node);
              }
            } else {
              counts.set(event_name, count);
            }
          }
        }
        root_event_handles.delete(event_handle);
        if (anchor_node !== anchor) {
          (_a2 = anchor_node.parentNode) == null ? void 0 : _a2.removeChild(anchor_node);
        }
      };
    });
    mounted_components.set(component, unmount);
    return component;
  }
  let mounted_components = /* @__PURE__ */ new WeakMap();
  class BranchManager {
    /**
     * @param {TemplateNode} anchor
     * @param {boolean} transition
     */
    constructor(anchor, transition = true) {
      /** @type {TemplateNode} */
      __publicField(this, "anchor");
      /** @type {Map<Batch, Key>} */
      __privateAdd(this, _batches, /* @__PURE__ */ new Map());
      /**
       * Map of keys to effects that are currently rendered in the DOM.
       * These effects are visible and actively part of the document tree.
       * Example:
       * ```
       * {#if condition}
       * 	foo
       * {:else}
       * 	bar
       * {/if}
       * ```
       * Can result in the entries `true->Effect` and `false->Effect`
       * @type {Map<Key, Effect>}
       */
      __privateAdd(this, _onscreen, /* @__PURE__ */ new Map());
      /**
       * Similar to #onscreen with respect to the keys, but contains branches that are not yet
       * in the DOM, because their insertion is deferred.
       * @type {Map<Key, Branch>}
       */
      __privateAdd(this, _offscreen, /* @__PURE__ */ new Map());
      /**
       * Keys of effects that are currently outroing
       * @type {Set<Key>}
       */
      __privateAdd(this, _outroing, /* @__PURE__ */ new Set());
      /**
       * Whether to pause (i.e. outro) on change, or destroy immediately.
       * This is necessary for `<svelte:element>`
       */
      __privateAdd(this, _transition, true);
      /**
       * @param {Batch} batch
       */
      __privateAdd(this, _commit, (batch) => {
        if (!__privateGet(this, _batches).has(batch)) return;
        var key = (
          /** @type {Key} */
          __privateGet(this, _batches).get(batch)
        );
        var onscreen = __privateGet(this, _onscreen).get(key);
        if (onscreen) {
          resume_effect(onscreen);
          __privateGet(this, _outroing).delete(key);
        } else {
          var offscreen = __privateGet(this, _offscreen).get(key);
          if (offscreen) {
            resume_effect(offscreen.effect);
            __privateGet(this, _onscreen).set(key, offscreen.effect);
            __privateGet(this, _offscreen).delete(key);
            offscreen.fragment.lastChild.remove();
            this.anchor.before(offscreen.fragment);
            onscreen = offscreen.effect;
          }
        }
        for (const [b, k] of __privateGet(this, _batches)) {
          __privateGet(this, _batches).delete(b);
          if (b === batch) {
            break;
          }
          const offscreen2 = __privateGet(this, _offscreen).get(k);
          if (offscreen2) {
            destroy_effect(offscreen2.effect);
            __privateGet(this, _offscreen).delete(k);
          }
        }
        for (const [k, effect2] of __privateGet(this, _onscreen)) {
          if (k === key || __privateGet(this, _outroing).has(k)) continue;
          const on_destroy = () => {
            const keys = Array.from(__privateGet(this, _batches).values());
            if (keys.includes(k)) {
              var fragment = document.createDocumentFragment();
              move_effect(effect2, fragment);
              fragment.append(create_text());
              __privateGet(this, _offscreen).set(k, { effect: effect2, fragment });
            } else {
              destroy_effect(effect2);
            }
            __privateGet(this, _outroing).delete(k);
            __privateGet(this, _onscreen).delete(k);
          };
          if (__privateGet(this, _transition) || !onscreen) {
            __privateGet(this, _outroing).add(k);
            pause_effect(effect2, on_destroy, false);
          } else {
            on_destroy();
          }
        }
      });
      /**
       * @param {Batch} batch
       */
      __privateAdd(this, _discard, (batch) => {
        __privateGet(this, _batches).delete(batch);
        const keys = Array.from(__privateGet(this, _batches).values());
        for (const [k, branch2] of __privateGet(this, _offscreen)) {
          if (!keys.includes(k)) {
            destroy_effect(branch2.effect);
            __privateGet(this, _offscreen).delete(k);
          }
        }
      });
      this.anchor = anchor;
      __privateSet(this, _transition, transition);
    }
    /**
     *
     * @param {any} key
     * @param {null | ((target: TemplateNode) => void)} fn
     */
    ensure(key, fn) {
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      if (fn && !__privateGet(this, _onscreen).has(key) && !__privateGet(this, _offscreen).has(key)) {
        {
          __privateGet(this, _onscreen).set(
            key,
            branch(() => fn(this.anchor))
          );
        }
      }
      __privateGet(this, _batches).set(batch, key);
      {
        __privateGet(this, _commit).call(this, batch);
      }
    }
  }
  _batches = new WeakMap();
  _onscreen = new WeakMap();
  _offscreen = new WeakMap();
  _outroing = new WeakMap();
  _transition = new WeakMap();
  _commit = new WeakMap();
  _discard = new WeakMap();
  function if_block(node, fn, elseif = false) {
    var branches = new BranchManager(node);
    var flags2 = elseif ? EFFECT_TRANSPARENT : 0;
    function update_branch(key, fn2) {
      branches.ensure(key, fn2);
    }
    block(() => {
      var has_branch = false;
      fn((fn2, key = 0) => {
        has_branch = true;
        update_branch(key, fn2);
      });
      if (!has_branch) {
        update_branch(-1, null);
      }
    }, flags2);
  }
  function pause_effects(state2, to_destroy, controlled_anchor) {
    var transitions = [];
    var length = to_destroy.length;
    var group;
    var remaining = to_destroy.length;
    for (var i = 0; i < length; i++) {
      let effect2 = to_destroy[i];
      pause_effect(
        effect2,
        () => {
          if (group) {
            group.pending.delete(effect2);
            group.done.add(effect2);
            if (group.pending.size === 0) {
              var groups = (
                /** @type {Set<EachOutroGroup>} */
                state2.outrogroups
              );
              destroy_effects(state2, array_from(group.done));
              groups.delete(group);
              if (groups.size === 0) {
                state2.outrogroups = null;
              }
            }
          } else {
            remaining -= 1;
          }
        },
        false
      );
    }
    if (remaining === 0) {
      var fast_path = transitions.length === 0 && controlled_anchor !== null;
      if (fast_path) {
        var anchor = (
          /** @type {Element} */
          controlled_anchor
        );
        var parent_node = (
          /** @type {Element} */
          anchor.parentNode
        );
        clear_text_content(parent_node);
        parent_node.append(anchor);
        state2.items.clear();
      }
      destroy_effects(state2, to_destroy, !fast_path);
    } else {
      group = {
        pending: new Set(to_destroy),
        done: /* @__PURE__ */ new Set()
      };
      (state2.outrogroups ?? (state2.outrogroups = /* @__PURE__ */ new Set())).add(group);
    }
  }
  function destroy_effects(state2, to_destroy, remove_dom = true) {
    var preserved_effects;
    if (state2.pending.size > 0) {
      preserved_effects = /* @__PURE__ */ new Set();
      for (const keys of state2.pending.values()) {
        for (const key of keys) {
          preserved_effects.add(
            /** @type {EachItem} */
            state2.items.get(key).e
          );
        }
      }
    }
    for (var i = 0; i < to_destroy.length; i++) {
      var e = to_destroy[i];
      if (preserved_effects == null ? void 0 : preserved_effects.has(e)) {
        e.f |= EFFECT_OFFSCREEN;
        const fragment = document.createDocumentFragment();
        move_effect(e, fragment);
      } else {
        destroy_effect(to_destroy[i], remove_dom);
      }
    }
  }
  var offscreen_anchor;
  function each(node, flags2, get_collection, get_key, render_fn2, fallback_fn = null) {
    var anchor = node;
    var items = /* @__PURE__ */ new Map();
    {
      var parent_node = (
        /** @type {Element} */
        node
      );
      anchor = parent_node.appendChild(create_text());
    }
    var fallback = null;
    var each_array = /* @__PURE__ */ derived_safe_equal(() => {
      var collection = get_collection();
      return (
        /** @type {V[]} */
        is_array(collection) ? collection : collection == null ? [] : array_from(collection)
      );
    });
    var array;
    var pending = /* @__PURE__ */ new Map();
    var first_run = true;
    function commit(batch) {
      if ((state2.effect.f & DESTROYED) !== 0) {
        return;
      }
      state2.pending.delete(batch);
      state2.fallback = fallback;
      reconcile(state2, array, anchor, flags2, get_key);
      if (fallback !== null) {
        if (array.length === 0) {
          if ((fallback.f & EFFECT_OFFSCREEN) === 0) {
            resume_effect(fallback);
          } else {
            fallback.f ^= EFFECT_OFFSCREEN;
            move(fallback, null, anchor);
          }
        } else {
          pause_effect(fallback, () => {
            fallback = null;
          });
        }
      }
    }
    var effect2 = block(() => {
      array = /** @type {V[]} */
      get(each_array);
      var length = array.length;
      var keys = /* @__PURE__ */ new Set();
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      for (var index = 0; index < length; index += 1) {
        var value = array[index];
        var key = get_key(value, index);
        var item = first_run ? null : items.get(key);
        if (item) {
          if (item.v) internal_set(item.v, value);
          if (item.i) internal_set(item.i, index);
        } else {
          item = create_item(
            items,
            first_run ? anchor : offscreen_anchor ?? (offscreen_anchor = create_text()),
            value,
            key,
            index,
            render_fn2,
            flags2,
            get_collection
          );
          if (!first_run) {
            item.e.f |= EFFECT_OFFSCREEN;
          }
          items.set(key, item);
        }
        keys.add(key);
      }
      if (length === 0 && fallback_fn && !fallback) {
        if (first_run) {
          fallback = branch(() => fallback_fn(anchor));
        } else {
          fallback = branch(() => fallback_fn(offscreen_anchor ?? (offscreen_anchor = create_text())));
          fallback.f |= EFFECT_OFFSCREEN;
        }
      }
      if (length > keys.size) {
        {
          each_key_duplicate();
        }
      }
      if (!first_run) {
        pending.set(batch, keys);
        {
          commit(batch);
        }
      }
      get(each_array);
    });
    var state2 = { effect: effect2, items, pending, outrogroups: null, fallback };
    first_run = false;
  }
  function skip_to_branch(effect2) {
    while (effect2 !== null && (effect2.f & BRANCH_EFFECT) === 0) {
      effect2 = effect2.next;
    }
    return effect2;
  }
  function reconcile(state2, array, anchor, flags2, get_key) {
    var _a2;
    var length = array.length;
    var items = state2.items;
    var current = skip_to_branch(state2.effect.first);
    var seen;
    var prev = null;
    var matched = [];
    var stashed = [];
    var value;
    var key;
    var effect2;
    var i;
    for (i = 0; i < length; i += 1) {
      value = array[i];
      key = get_key(value, i);
      effect2 = /** @type {EachItem} */
      items.get(key).e;
      if (state2.outrogroups !== null) {
        for (const group of state2.outrogroups) {
          group.pending.delete(effect2);
          group.done.delete(effect2);
        }
      }
      if ((effect2.f & INERT) !== 0) {
        resume_effect(effect2);
      }
      if ((effect2.f & EFFECT_OFFSCREEN) !== 0) {
        effect2.f ^= EFFECT_OFFSCREEN;
        if (effect2 === current) {
          move(effect2, null, anchor);
        } else {
          var next = prev ? prev.next : current;
          if (effect2 === state2.effect.last) {
            state2.effect.last = effect2.prev;
          }
          if (effect2.prev) effect2.prev.next = effect2.next;
          if (effect2.next) effect2.next.prev = effect2.prev;
          link(state2, prev, effect2);
          link(state2, effect2, next);
          move(effect2, next, anchor);
          prev = effect2;
          matched = [];
          stashed = [];
          current = skip_to_branch(prev.next);
          continue;
        }
      }
      if (effect2 !== current) {
        if (seen !== void 0 && seen.has(effect2)) {
          if (matched.length < stashed.length) {
            var start = stashed[0];
            var j;
            prev = start.prev;
            var a = matched[0];
            var b = matched[matched.length - 1];
            for (j = 0; j < matched.length; j += 1) {
              move(matched[j], start, anchor);
            }
            for (j = 0; j < stashed.length; j += 1) {
              seen.delete(stashed[j]);
            }
            link(state2, a.prev, b.next);
            link(state2, prev, a);
            link(state2, b, start);
            current = start;
            prev = b;
            i -= 1;
            matched = [];
            stashed = [];
          } else {
            seen.delete(effect2);
            move(effect2, current, anchor);
            link(state2, effect2.prev, effect2.next);
            link(state2, effect2, prev === null ? state2.effect.first : prev.next);
            link(state2, prev, effect2);
            prev = effect2;
          }
          continue;
        }
        matched = [];
        stashed = [];
        while (current !== null && current !== effect2) {
          (seen ?? (seen = /* @__PURE__ */ new Set())).add(current);
          stashed.push(current);
          current = skip_to_branch(current.next);
        }
        if (current === null) {
          continue;
        }
      }
      if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
        matched.push(effect2);
      }
      prev = effect2;
      current = skip_to_branch(effect2.next);
    }
    if (state2.outrogroups !== null) {
      for (const group of state2.outrogroups) {
        if (group.pending.size === 0) {
          destroy_effects(state2, array_from(group.done));
          (_a2 = state2.outrogroups) == null ? void 0 : _a2.delete(group);
        }
      }
      if (state2.outrogroups.size === 0) {
        state2.outrogroups = null;
      }
    }
    if (current !== null || seen !== void 0) {
      var to_destroy = [];
      if (seen !== void 0) {
        for (effect2 of seen) {
          if ((effect2.f & INERT) === 0) {
            to_destroy.push(effect2);
          }
        }
      }
      while (current !== null) {
        if ((current.f & INERT) === 0 && current !== state2.fallback) {
          to_destroy.push(current);
        }
        current = skip_to_branch(current.next);
      }
      var destroy_length = to_destroy.length;
      if (destroy_length > 0) {
        var controlled_anchor = length === 0 ? anchor : null;
        pause_effects(state2, to_destroy, controlled_anchor);
      }
    }
  }
  function create_item(items, anchor, value, key, index, render_fn2, flags2, get_collection) {
    var v = (flags2 & EACH_ITEM_REACTIVE) !== 0 ? (flags2 & EACH_ITEM_IMMUTABLE) === 0 ? /* @__PURE__ */ mutable_source(value, false, false) : source(value) : null;
    var i = (flags2 & EACH_INDEX_REACTIVE) !== 0 ? source(index) : null;
    return {
      v,
      i,
      e: branch(() => {
        render_fn2(anchor, v ?? value, i ?? index, get_collection);
        return () => {
          items.delete(key);
        };
      })
    };
  }
  function move(effect2, next, anchor) {
    if (!effect2.nodes) return;
    var node = effect2.nodes.start;
    var end = effect2.nodes.end;
    var dest = next && (next.f & EFFECT_OFFSCREEN) === 0 ? (
      /** @type {EffectNodes} */
      next.nodes.start
    ) : anchor;
    while (node !== null) {
      var next_node = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(node)
      );
      dest.before(node);
      if (node === end) {
        return;
      }
      node = next_node;
    }
  }
  function link(state2, prev, next) {
    if (prev === null) {
      state2.effect.first = next;
    } else {
      prev.next = next;
    }
    if (next === null) {
      state2.effect.last = prev;
    } else {
      next.prev = prev;
    }
  }
  function html(node, get_value, is_controlled = false, svg = false, mathml = false, skip_warning = false) {
    var anchor = node;
    var value = "";
    if (is_controlled) {
      var parent_node = (
        /** @type {Element} */
        node
      );
    }
    template_effect(() => {
      var effect2 = (
        /** @type {Effect} */
        active_effect
      );
      if (value === (value = get_value() ?? "")) {
        return;
      }
      if (is_controlled && true) {
        effect2.nodes = null;
        parent_node.innerHTML = /** @type {string} */
        value;
        if (value !== "") {
          assign_nodes(
            /** @type {TemplateNode} */
            /* @__PURE__ */ get_first_child(parent_node),
            /** @type {TemplateNode} */
            parent_node.lastChild
          );
        }
        return;
      }
      if (effect2.nodes !== null) {
        remove_effect_dom(
          effect2.nodes.start,
          /** @type {TemplateNode} */
          effect2.nodes.end
        );
        effect2.nodes = null;
      }
      if (value === "") return;
      var ns = svg ? NAMESPACE_SVG : mathml ? NAMESPACE_MATHML : void 0;
      var wrapper = (
        /** @type {HTMLTemplateElement | SVGElement | MathMLElement} */
        create_element(svg ? "svg" : mathml ? "math" : "template", ns)
      );
      wrapper.innerHTML = /** @type {any} */
      value;
      var node2 = svg || mathml ? wrapper : (
        /** @type {HTMLTemplateElement} */
        wrapper.content
      );
      assign_nodes(
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_first_child(node2),
        /** @type {TemplateNode} */
        node2.lastChild
      );
      if (svg || mathml) {
        while (/* @__PURE__ */ get_first_child(node2)) {
          anchor.before(
            /** @type {TemplateNode} */
            /* @__PURE__ */ get_first_child(node2)
          );
        }
      } else {
        anchor.before(node2);
      }
    });
  }
  const whitespace = [..." 	\n\r\f \v\uFEFF"];
  function to_class(value, hash, directives) {
    var classname = value == null ? "" : "" + value;
    if (hash) {
      classname = classname ? classname + " " + hash : hash;
    }
    if (directives) {
      for (var key of Object.keys(directives)) {
        if (directives[key]) {
          classname = classname ? classname + " " + key : key;
        } else if (classname.length) {
          var len = key.length;
          var a = 0;
          while ((a = classname.indexOf(key, a)) >= 0) {
            var b = a + len;
            if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
              classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
            } else {
              a = b;
            }
          }
        }
      }
    }
    return classname === "" ? null : classname;
  }
  function to_style(value, styles) {
    return value == null ? null : String(value);
  }
  function set_class(dom, is_html, value, hash, prev_classes, next_classes) {
    var prev = (
      /** @type {any} */
      dom[CLASS_CACHE]
    );
    if (prev !== value || prev === void 0) {
      var next_class_name = to_class(value, hash, next_classes);
      {
        if (next_class_name == null) {
          dom.removeAttribute("class");
        } else {
          dom.className = next_class_name;
        }
      }
      dom[CLASS_CACHE] = value;
    } else if (next_classes && prev_classes !== next_classes) {
      for (var key in next_classes) {
        var is_present = !!next_classes[key];
        if (prev_classes == null || is_present !== !!prev_classes[key]) {
          dom.classList.toggle(key, is_present);
        }
      }
    }
    return next_classes;
  }
  function set_style(dom, value, prev_styles, next_styles) {
    var prev = (
      /** @type {any} */
      dom[STYLE_CACHE]
    );
    if (prev !== value) {
      var next_style_attr = to_style(value);
      {
        if (next_style_attr == null) {
          dom.removeAttribute("style");
        } else {
          dom.style.cssText = next_style_attr;
        }
      }
      dom[STYLE_CACHE] = value;
    }
    return next_styles;
  }
  const IS_CUSTOM_ELEMENT = Symbol("is custom element");
  const IS_HTML = Symbol("is html");
  function set_attribute(element, attribute, value, skip_warning) {
    var attributes = get_attributes(element);
    if (attributes[attribute] === (attributes[attribute] = value)) return;
    if (attribute === "loading") {
      element[LOADING_ATTR_SYMBOL] = value;
    }
    if (value == null) {
      element.removeAttribute(attribute);
    } else if (typeof value !== "string" && get_setters(element).includes(attribute)) {
      element[attribute] = value;
    } else {
      element.setAttribute(attribute, value);
    }
  }
  function get_attributes(element) {
    return (
      /** @type {Record<string | symbol, unknown>} **/
      /** @type {any} */
      element[ATTRIBUTES_CACHE] ?? (element[ATTRIBUTES_CACHE] = {
        [IS_CUSTOM_ELEMENT]: element.nodeName.includes("-"),
        [IS_HTML]: element.namespaceURI === NAMESPACE_HTML
      })
    );
  }
  var setters_cache = /* @__PURE__ */ new Map();
  function get_setters(element) {
    var cache_key = element.getAttribute("is") || element.nodeName;
    var setters = setters_cache.get(cache_key);
    if (setters) return setters;
    setters_cache.set(cache_key, setters = []);
    var descriptors;
    var proto = element;
    var element_proto = Element.prototype;
    while (element_proto !== proto) {
      descriptors = get_descriptors(proto);
      for (var key in descriptors) {
        if (descriptors[key].set && // better safe than sorry, we don't want spread attributes to mess with HTML content
        key !== "innerHTML" && key !== "textContent" && key !== "innerText") {
          setters.push(key);
        }
      }
      proto = get_prototype_of(proto);
    }
    return setters;
  }
  function is_bound_this(bound_value, element_or_component) {
    return bound_value === element_or_component || (bound_value == null ? void 0 : bound_value[STATE_SYMBOL]) === element_or_component;
  }
  function bind_this(element_or_component = {}, update, get_value, get_parts) {
    var component_effect = (
      /** @type {ComponentContext} */
      component_context.r
    );
    var parent = (
      /** @type {Effect} */
      active_effect
    );
    effect(() => {
      var old_parts;
      var parts;
      render_effect(() => {
        old_parts = parts;
        parts = [];
        untrack(() => {
          if (!is_bound_this(get_value(...parts), element_or_component)) {
            update(element_or_component, ...parts);
            if (old_parts && is_bound_this(get_value(...old_parts), element_or_component)) {
              update(null, ...old_parts);
            }
          }
        });
      });
      return () => {
        let p = parent;
        while (p !== component_effect && p.parent !== null && p.parent.f & DESTROYING) {
          p = p.parent;
        }
        const teardown2 = () => {
          if (parts && is_bound_this(get_value(...parts), element_or_component)) {
            update(null, ...parts);
          }
        };
        const original_teardown = p.teardown;
        p.teardown = () => {
          teardown2();
          original_teardown == null ? void 0 : original_teardown();
        };
      };
    });
    return element_or_component;
  }
  function prop(props, key, flags2, fallback) {
    var fallback_value = (
      /** @type {V} */
      fallback
    );
    var fallback_dirty = true;
    var get_fallback = () => {
      if (fallback_dirty) {
        fallback_dirty = false;
        fallback_value = /** @type {V} */
        fallback;
      }
      return fallback_value;
    };
    var initial_value;
    {
      initial_value = /** @type {V} */
      props[key];
    }
    if (initial_value === void 0 && fallback !== void 0) {
      initial_value = get_fallback();
    }
    var getter;
    {
      getter = () => {
        var value = (
          /** @type {V} */
          props[key]
        );
        if (value === void 0) return get_fallback();
        fallback_dirty = true;
        return value;
      };
    }
    {
      return getter;
    }
  }
  function onMount(fn) {
    if (component_context === null) {
      lifecycle_outside_component();
    }
    {
      user_effect(() => {
        const cleanup = untrack(fn);
        if (typeof cleanup === "function") return (
          /** @type {() => void} */
          cleanup
        );
      });
    }
  }
  const PUBLIC_VERSION = "5";
  if (typeof window !== "undefined") {
    ((_b = window.__svelte ?? (window.__svelte = {})).v ?? (_b.v = /* @__PURE__ */ new Set())).add(PUBLIC_VERSION);
  }
  var root$2 = /* @__PURE__ */ from_html(`<span class="wls-icon"></span>`);
  function Icon($$anchor, $$props) {
    let size = prop($$props, "size", 3, 14);
    const icons = {
      check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="2.5,8 6,11.5 13.5,4.5"/></svg>',
      warn: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2L14.5 13H1.5L8 2z"/><line x1="8" y1="7" x2="8" y2="10"/><circle cx="8" cy="12" r="0.5" fill="currentColor"/></svg>',
      error: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="8.5"/><circle cx="8" cy="11" r="0.5" fill="currentColor"/></svg>',
      muted: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="9"/><circle cx="8" cy="11.5" r="0.5" fill="currentColor"/></svg>',
      refresh: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 2.5A7 7 0 1 0 14 9"/><polyline points="14,2.5 13.5,6 10,5.5"/></svg>',
      list: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="12" y2="4"/><line x1="4" y1="8" x2="12" y2="8"/><line x1="4" y1="12" x2="8" y2="12"/></svg>',
      close: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>',
      clock: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><polyline points="8,5 8,8 10.5,10"/></svg>',
      report: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="2" width="10" height="12" rx="1.5"/><line x1="6" y1="6" x2="10" y2="6"/><line x1="6" y1="9" x2="10" y2="9"/><line x1="6" y1="12" x2="8" y2="12"/></svg>',
      table: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="12" height="12" rx="1.5"/><line x1="2" y1="6" x2="14" y2="6"/><line x1="2" y1="10" x2="14" y2="10"/><line x1="7" y1="6" x2="7" y2="14"/></svg>',
      plus: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>',
      cal: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="12" height="11" rx="1.5"/><line x1="2" y1="7" x2="14" y2="7"/><line x1="5" y1="2" x2="5" y2="4"/><line x1="11" y1="2" x2="11" y2="4"/></svg>',
      entries: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 2H4a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V7L9 2z"/><polyline points="9,2 9,7 13.5,7"/></svg>',
      chevron: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,6 8,10 12,6"/></svg>'
    };
    var span = root$2();
    html(span, () => icons[$$props.name] || "", true);
    template_effect(() => set_style(span, `display:inline-flex;width:${size() ?? ""}px;height:${size() ?? ""}px;flex-shrink:0;align-items:center;justify-content:center`));
    append($$anchor, span);
  }
  const CONFIG = {
    checkInApiUrl: "https://hubble.mallow-tech.com/attendance/get-my-check-in-data",
    timesheetApiUrl: "https://hubble.mallow-tech.com/v2/timesheet-entries",
    cardId: "custom-work-log-summary-card",
    oldIds: ["custom-timeoff-compensation-card", "custom-work-log-summary-card"],
    workDayMinutes: 8 * 60,
    weekendDays: [0, 6],
    maxTimesheetPages: 50,
    timeOffTypes: /* @__PURE__ */ new Set([
      "Time Off",
      "Day Start Time Off",
      "Attendance Time Off",
      "attendance-time-off",
      "day-start-time-off"
    ]),
    workTypes: /* @__PURE__ */ new Set(["login", "Check In", "Check In Office", "Check In Home"]),
    dayOffLabels: /* @__PURE__ */ new Set(["Day Off", "Comp Off", "On Duty"])
  };
  const pad = (v) => String(v).padStart(2, "0");
  const escapeHtml = (v) => String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const stripHtml = (v) => {
    const d = document.createElement("div");
    d.innerHTML = String(v ?? "");
    return d.textContent || d.innerText || "";
  };
  const toYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const getMonthRange = (offset = 0) => {
    const now = /* @__PURE__ */ new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + offset;
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0);
    return { startDate: toYMD(start), endDate: toYMD(end) };
  };
  const buildMonthOptions = (count = 6) => {
    const now = /* @__PURE__ */ new Date();
    const months = [];
    for (let i = 0; i >= -(count - 1); i--) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push({
        offset: i,
        label: i === 0 ? "This month" : i === -1 ? "Last month" : d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
        shortLabel: d.toLocaleDateString("en-IN", { month: "short" }),
        year: d.getFullYear(),
        month: d.getMonth(),
        fullLabel: d.toLocaleDateString("en-IN", { month: "long", year: "numeric" })
      });
    }
    return months;
  };
  const parseDate = (value) => {
    if (!value) return null;
    const text = stripHtml(value).trim().replace(",", "");
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return /* @__PURE__ */ new Date(`${text}T00:00:00`);
    if (window.moment) {
      const p = window.moment(
        text,
        [
          "YYYY-MM-DD",
          "DD MMM YYYY",
          "DD MMMM YYYY",
          "MM/DD/YYYY",
          "DD-MM-YYYY",
          "DD/MM/YYYY",
          "DD/MMM/YYYY",
          "MMM DD YYYY",
          "MMMM DD YYYY"
        ],
        true
      );
      if (p.isValid()) return p.toDate();
    }
    const n = new Date(text);
    return isNaN(n.getTime()) ? null : n;
  };
  const formatDisplayDate = (v) => {
    const d = parseDate(v);
    if (!d) return String(v || "-");
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };
  const parseTimeToMinutes = (time) => {
    var _a2;
    if (!time) return null;
    const v = stripHtml(time).trim();
    const m = v.match(/^(\d{1,2}):(\d{2})(?::\d{2})?(?:\s?(AM|PM))?$/i);
    if (!m) return null;
    let h = Number(m[1]);
    const min = Number(m[2]);
    const mer = (_a2 = m[3]) == null ? void 0 : _a2.toUpperCase();
    if (mer === "PM" && h !== 12) h += 12;
    if (mer === "AM" && h === 12) h = 0;
    return h * 60 + min;
  };
  const parseTimesheetDurationToMinutes = (value) => {
    if (value === null || typeof value === "undefined") return 0;
    if (typeof value === "number") return isFinite(value) ? Math.round(value * 60) : 0;
    const text = stripHtml(value).trim().toLowerCase();
    if (!text || text === "-" || text === "null") return 0;
    const n = Number(text);
    if (isFinite(n)) return Math.round(n * 60);
    let total = 0;
    let matched = false;
    const hm = text.match(/(\d+(?:\.\d+)?)\s*(h|hr|hrs|hour|hours)\b/i);
    if (hm) {
      total += Math.round(Number(hm[1]) * 60);
      matched = true;
    }
    const mm = text.match(/(\d+)\s*(m|min|mins|minute|minutes)\b/i);
    if (mm) {
      total += Number(mm[1]);
      matched = true;
    }
    if (matched) return total;
    const hhmm = text.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (hhmm) return Number(hhmm[1]) * 60 + Number(hhmm[2]);
    return 0;
  };
  const formatMinutes = (total) => {
    const s = Math.max(0, Math.round(total || 0));
    const h = Math.floor(s / 60);
    const m = s % 60;
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    return `${m}m`;
  };
  const formatSignedMinutes = (min) => {
    const v = Math.round(min || 0);
    if (v === 0) return "0m";
    return `${v > 0 ? "+" : "−"}${formatMinutes(Math.abs(v))}`;
  };
  const roundedHour = (min) => Math.round((min || 0) / 60);
  const isToday = (d) => d && toYMD(d) === toYMD(/* @__PURE__ */ new Date());
  const getCurrentMinutes = () => {
    const now = /* @__PURE__ */ new Date();
    return now.getHours() * 60 + now.getMinutes();
  };
  const getDurationMinutes = (start, end, date, allowRunning = false) => {
    const s = parseTimeToMinutes(start);
    let e = parseTimeToMinutes(end);
    if (e === null && allowRunning && isToday(date)) e = getCurrentMinutes();
    if (s === null || e === null || e <= s) return 0;
    return e - s;
  };
  const getTypeLabel = (row) => {
    const t = String(row.type || "");
    if ([
      "Day Start Time Off",
      "Attendance Time Off",
      "attendance-time-off",
      "day-start-time-off"
    ].includes(t))
      return "Time Off";
    if (t === "Day Off" && row.leave_category === "comp_off") return "Comp Off";
    if (t === "Day Off" && row.leave_category === "on_duty") return "On Duty";
    return t || "-";
  };
  const flattenAttendanceData = (data) => Object.entries(data || {}).flatMap(
    ([key, rows]) => (rows || []).map((r) => ({
      ...r,
      date: r.my_check_in_date || key
    }))
  );
  const getCsrfToken = () => {
    var _a2;
    return ((_a2 = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a2.getAttribute("content")) || "";
  };
  const getLoggedInUserId = () => {
    var _a2, _b2;
    const href = (_a2 = document.querySelector('a[href*="/users/"][href*="/profile"]')) == null ? void 0 : _a2.getAttribute("href");
    return ((_b2 = href == null ? void 0 : href.match(/\/users\/(\d+)\/profile/)) == null ? void 0 : _b2[1]) || "";
  };
  const getTimesheetRecordTitle = (row) => [row.project_name, row.module_name, row.task_name].filter(Boolean).join(" / ") || "-";
  const removePreviousArtifacts = () => {
    CONFIG.oldIds.forEach((id) => {
      var _a2;
      return (_a2 = document.getElementById(id)) == null ? void 0 : _a2.remove();
    });
  };
  var root$1 = /* @__PURE__ */ from_html(`<button type="button"> </button>`);
  var root_1$1 = /* @__PURE__ */ from_html(`<div class="wls-month-picker"></div>`);
  function MonthPicker($$anchor, $$props) {
    push($$props, true);
    const months = buildMonthOptions(6);
    var div = root_1$1();
    each(div, 21, () => months, (m) => m.offset, ($$anchor2, m) => {
      var button = root$1();
      let classes;
      var text = child(button);
      template_effect(() => {
        classes = set_class(button, 1, "wls-month-btn", null, classes, {
          active: get(m).offset === $$props.currentOffset,
          past: get(m).offset < 0 && get(m).offset !== $$props.currentOffset
        });
        set_attribute(button, "title", get(m).fullLabel);
        set_text(text, get(m).label);
      });
      delegated("click", button, (e) => {
        e.stopPropagation();
        $$props.onSelect(get(m).offset);
      });
      append($$anchor2, button);
    });
    append($$anchor, div);
    pop();
  }
  delegate(["click"]);
  const fetchCheckInData = async (offset = 0) => {
    const { startDate, endDate } = getMonthRange(offset);
    const url = new URL(CONFIG.checkInApiUrl);
    url.searchParams.set("start_date", startDate);
    url.searchParams.set("end_date", endDate);
    const res = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" }
    });
    if (!res.ok) throw new Error(`Check-in API failed: ${res.status}`);
    const result = await res.json();
    return { startDate, endDate, rows: flattenAttendanceData(result.data || {}) };
  };
  const buildTimesheetBody = ({
    startDate,
    endDate,
    userId,
    userParamMode
  }) => {
    const body = new URLSearchParams();
    body.append("group_by", "date");
    body.append("start_date", startDate);
    body.append("end_date", endDate);
    body.append("un_approved_entries", "false");
    if (userId)
      body.append(userParamMode === "array" ? "filter_user_id[]" : "filter_user_id", userId);
    return body;
  };
  const requestTimesheetPage = async ({
    url,
    startDate,
    endDate,
    userId,
    userParamMode
  }) => {
    const csrf = getCsrfToken();
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest"
    };
    if (csrf) headers["X-CSRF-TOKEN"] = csrf;
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers,
      body: buildTimesheetBody({ startDate, endDate, userId, userParamMode })
    });
    if (!res.ok) throw new Error(`Timesheet API failed: ${res.status}`);
    return res.json();
  };
  const fetchTimesheetAllPagesWithMode = async ({
    startDate,
    endDate,
    userId,
    userParamMode
  }) => {
    let nextUrl = CONFIG.timesheetApiUrl;
    let page = 0;
    const allRows = [];
    while (nextUrl && page < CONFIG.maxTimesheetPages) {
      page++;
      const res = await requestTimesheetPage({
        url: nextUrl,
        startDate,
        endDate,
        userId,
        userParamMode
      });
      const p = res.pages || {};
      allRows.push(...Array.isArray(p.data) ? p.data : []);
      nextUrl = p.next_page_url ? new URL(p.next_page_url, window.location.origin).toString() : "";
    }
    return { rows: allRows, pagesFetched: page };
  };
  const fetchTimesheetAllPages = async ({
    startDate,
    endDate
  }) => {
    const userId = getLoggedInUserId();
    try {
      return await fetchTimesheetAllPagesWithMode({
        startDate,
        endDate,
        userId,
        userParamMode: "array"
      });
    } catch {
      return fetchTimesheetAllPagesWithMode({ startDate, endDate, userId, userParamMode: "scalar" });
    }
  };
  const groupCheckIn = (rows) => {
    const dayMap = /* @__PURE__ */ new Map();
    const timeOffRows = [];
    const dayOffRows = [];
    const ensureDay = (dateKey, dateObj) => {
      if (!dayMap.has(dateKey)) {
        dayMap.set(dateKey, {
          dateKey,
          dateObj,
          workMinutes: 0,
          timeOffMinutes: 0,
          workRecords: [],
          timeOffRecords: []
        });
      }
      return dayMap.get(dateKey);
    };
    rows.forEach((row) => {
      const dateObj = parseDate(row.date);
      if (!dateObj) return;
      const dateKey = toYMD(dateObj);
      const typeLabel = getTypeLabel(row);
      const rawType = String(row.type || "");
      const day = ensureDay(dateKey, dateObj);
      const isTimeOff = CONFIG.timeOffTypes.has(rawType) || CONFIG.timeOffTypes.has(typeLabel);
      const isWork = CONFIG.workTypes.has(rawType) || CONFIG.workTypes.has(typeLabel);
      const isDayOff = rawType === "Day Off" || CONFIG.dayOffLabels.has(typeLabel);
      if (isWork) {
        const minutes = getDurationMinutes(row.start_time, row.end_time, dateObj, true);
        if (minutes > 0) {
          const rec = {
            date: dateKey,
            type: typeLabel,
            start: String(row.start_time || ""),
            end: String(row.end_time || (isToday(dateObj) ? "Now" : "-")),
            minutes
          };
          day.workMinutes += minutes;
          day.workRecords.push(rec);
        }
      }
      if (isTimeOff) {
        const minutes = getDurationMinutes(row.start_time, row.end_time, dateObj, false);
        if (minutes > 0) {
          const rec = {
            date: dateKey,
            type: typeLabel,
            start: String(row.start_time || ""),
            end: String(row.end_time || ""),
            minutes
          };
          day.timeOffMinutes += minutes;
          day.timeOffRecords.push(rec);
          timeOffRows.push(rec);
        }
      }
      if (isDayOff && !dayOffRows.some((x) => x.date === dateKey && x.type === typeLabel)) {
        dayOffRows.push({ date: dateKey, type: typeLabel });
      }
    });
    const dayRows = Array.from(dayMap.values()).sort((a, b) => a.dateKey.localeCompare(b.dateKey));
    const extraRows = dayRows.map((day) => {
      const isWeekend = CONFIG.weekendDays.includes(day.dateObj.getDay());
      const expectedMinutes = isWeekend ? 0 : Math.max(0, CONFIG.workDayMinutes - day.timeOffMinutes);
      let extraMinutes = 0;
      let reason = "";
      if (isWeekend && day.workMinutes > 0) {
        extraMinutes = day.workMinutes;
        reason = "Weekend work";
      } else if (!isWeekend && day.workMinutes > expectedMinutes) {
        extraMinutes = day.workMinutes - expectedMinutes;
        reason = day.timeOffMinutes > 0 ? "Worked above adjusted target" : "Worked more than 8h";
      }
      return {
        date: day.dateKey,
        workedMinutes: day.workMinutes,
        timeOffMinutes: day.timeOffMinutes,
        expectedMinutes,
        extraMinutes,
        reason,
        workRecords: day.workRecords
      };
    }).filter((r) => r.extraMinutes > 0);
    const totalTimeOffMinutes = timeOffRows.reduce((s, r) => s + r.minutes, 0);
    const totalExtraWorkedMinutes = extraRows.reduce((s, r) => s + r.extraMinutes, 0);
    const totalCheckInWorkMinutes = dayRows.reduce((s, r) => s + r.workMinutes, 0);
    return {
      dayMap,
      dayRows,
      timeOffRows: timeOffRows.sort(
        (a, b) => a.date.localeCompare(b.date) || String(a.start).localeCompare(String(b.start))
      ),
      extraRows,
      dayOffRows: dayOffRows.sort((a, b) => a.date.localeCompare(b.date)),
      totalTimeOffMinutes,
      totalExtraWorkedMinutes,
      totalCheckInWorkMinutes,
      pendingMinutes: Math.max(0, totalTimeOffMinutes - totalExtraWorkedMinutes),
      surplusMinutes: Math.max(0, totalExtraWorkedMinutes - totalTimeOffMinutes),
      dayOffCount: new Set(dayOffRows.map((r) => r.date)).size
    };
  };
  const groupTimesheet = ({
    rows,
    startDate,
    endDate
  }) => {
    const userId = getLoggedInUserId();
    const dayMap = /* @__PURE__ */ new Map();
    const records = [];
    rows.forEach((raw) => {
      const row = raw;
      if (userId && row.user_id && String(row.user_id) !== String(userId)) return;
      const dateObj = parseDate(row.entry_date || row.date);
      if (!dateObj) return;
      const dateKey = toYMD(dateObj);
      if (dateKey < startDate || dateKey > endDate) return;
      const minutes = parseTimesheetDurationToMinutes(row.working_hours);
      if (!dayMap.has(dateKey)) {
        dayMap.set(dateKey, { date: dateKey, minutes: 0, recordsCount: 0, records: [] });
      }
      const rec = {
        id: row.id,
        date: dateKey,
        title: getTimesheetRecordTitle(row),
        project: String(row.project_name || "-"),
        module: String(row.module_name || "-"),
        task: String(row.task_name || "-"),
        description: String(row.description || "-"),
        minutes,
        rawWorkingHours: row.working_hours
      };
      const day = dayMap.get(dateKey);
      day.minutes += minutes;
      day.recordsCount += 1;
      day.records.push(rec);
      records.push(rec);
    });
    const dayRows = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    return {
      dayMap,
      dayRows,
      records: records.sort(
        (a, b) => a.date.localeCompare(b.date) || String(a.id || "").localeCompare(String(b.id || ""))
      ),
      totalMinutes: dayRows.reduce((s, r) => s + r.minutes, 0)
    };
  };
  const buildComparison = ({
    checkInSummary,
    timesheetSummary
  }) => {
    const dates = /* @__PURE__ */ new Set();
    checkInSummary.dayRows.forEach((r) => {
      if (r.workMinutes > 0 || r.timeOffMinutes > 0) dates.add(r.dateKey);
    });
    timesheetSummary.dayRows.forEach((r) => {
      if (r.minutes > 0) dates.add(r.date);
    });
    const rows = Array.from(dates).sort().map((date) => {
      const ci = checkInSummary.dayMap.get(date);
      const ts = timesheetSummary.dayMap.get(date);
      const isTodayRow = isToday(parseDate(date));
      const ciMin = (ci == null ? void 0 : ci.workMinutes) || 0;
      const toMin = (ci == null ? void 0 : ci.timeOffMinutes) || 0;
      const tsMin = (ts == null ? void 0 : ts.minutes) || 0;
      let status = "OK";
      let statusClass = "t-ok";
      if (isTodayRow) {
        status = "Skipped today";
        statusClass = "t-skip";
      } else {
        const match = roundedHour(ciMin) === roundedHour(tsMin);
        status = match ? "OK" : "Mismatch";
        statusClass = match ? "t-ok" : "t-bad";
      }
      return {
        date,
        checkInMinutes: ciMin,
        timeOffMinutes: toMin,
        timesheetMinutes: tsMin,
        diffMinutes: tsMin - ciMin,
        roundedCheckInHours: roundedHour(ciMin),
        roundedTimesheetHours: roundedHour(tsMin),
        isTodayRow: !!isTodayRow,
        isMatch: statusClass === "t-ok",
        status,
        statusClass,
        timesheetRecords: (ts == null ? void 0 : ts.records) || []
      };
    });
    const mismatchRows = rows.filter(
      (r) => !r.isTodayRow && !r.isMatch
    );
    return { rows, mismatchRows, mismatchCount: mismatchRows.length };
  };
  const loadViewState = async (monthOffset) => {
    try {
      const checkInResult = await fetchCheckInData(monthOffset);
      const checkInSummary = groupCheckIn(checkInResult.rows);
      let timesheetSummary = {
        dayMap: /* @__PURE__ */ new Map(),
        dayRows: [],
        records: [],
        totalMinutes: 0
      };
      let comparison = { rows: [], mismatchRows: [], mismatchCount: 0 };
      let timesheetError = "";
      try {
        const tsResult = await fetchTimesheetAllPages({
          startDate: checkInResult.startDate,
          endDate: checkInResult.endDate
        });
        timesheetSummary = groupTimesheet({
          rows: tsResult.rows,
          startDate: checkInResult.startDate,
          endDate: checkInResult.endDate
        });
        comparison = buildComparison({ checkInSummary, timesheetSummary });
      } catch (err) {
        timesheetError = err instanceof Error ? err.message : "Unable to fetch timesheet data.";
      }
      return {
        kind: "success",
        monthOffset,
        startDate: checkInResult.startDate,
        endDate: checkInResult.endDate,
        checkInSummary,
        timesheetSummary,
        comparison,
        timesheetError
      };
    } catch (err) {
      return {
        kind: "error",
        monthOffset,
        message: err instanceof Error ? err.message : "Unable to calculate work log summary."
      };
    }
  };
  const ICONS = {
    check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="2.5,8 6,11.5 13.5,4.5"/></svg>',
    warn: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2L14.5 13H1.5L8 2z"/><line x1="8" y1="7" x2="8" y2="10"/><circle cx="8" cy="12" r="0.5" fill="currentColor"/></svg>',
    error: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="8.5"/><circle cx="8" cy="11" r="0.5" fill="currentColor"/></svg>',
    muted: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="9"/><circle cx="8" cy="11.5" r="0.5" fill="currentColor"/></svg>',
    refresh: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 2.5A7 7 0 1 0 14 9"/><polyline points="14,2.5 13.5,6 10,5.5"/></svg>',
    list: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="12" y2="4"/><line x1="4" y1="8" x2="12" y2="8"/><line x1="4" y1="12" x2="8" y2="12"/></svg>',
    close: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>',
    clock: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><polyline points="8,5 8,8 10.5,10"/></svg>',
    report: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="2" width="10" height="12" rx="1.5"/><line x1="6" y1="6" x2="10" y2="6"/><line x1="6" y1="9" x2="10" y2="9"/><line x1="6" y1="12" x2="8" y2="12"/></svg>',
    table: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="12" height="12" rx="1.5"/><line x1="2" y1="6" x2="14" y2="6"/><line x1="2" y1="10" x2="14" y2="10"/><line x1="7" y1="6" x2="7" y2="14"/></svg>',
    plus: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>',
    cal: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="12" height="11" rx="1.5"/><line x1="2" y1="7" x2="14" y2="7"/><line x1="5" y1="2" x2="5" y2="4"/><line x1="11" y1="2" x2="11" y2="4"/></svg>',
    entries: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 2H4a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V7L9 2z"/><polyline points="9,2 9,7 13.5,7"/></svg>',
    chevron: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,6 8,10 12,6"/></svg>'
  };
  const icon = (name, size = 14) => {
    const s = size;
    return `<span style="display:inline-flex;width:${s}px;height:${s}px;flex-shrink:0;align-items:center;justify-content:center">${ICONS[name] || ""}</span>`;
  };
  const renderTable = ({
    columns,
    rows,
    emptyText
  }) => {
    if (!rows.length) return `<div class="wls-empty">${escapeHtml(emptyText || "No records.")}</div>`;
    return `<div class="wls-table-wrap"><table><thead><tr>${columns.map((c) => `<th>${escapeHtml(c.label)}</th>`).join("")}</tr></thead><tbody>${rows.map(
    (r) => `<tr>${columns.map((c) => `<td>${c.html ? c.render(r) : escapeHtml(c.render(r))}</td>`).join("")}</tr>`
  ).join("")}</tbody></table></div>`;
  };
  const kpiColors = [
    "kpi-purple",
    "kpi-blue",
    "kpi-green",
    "kpi-amber",
    "kpi-slate",
    "kpi-purple",
    "kpi-blue",
    "kpi-amber"
  ];
  const renderKpis = (items) => `<div class="wls-kpi-row">${items.map(
  (x, i) => `<div class="wls-kpi ${kpiColors[i % kpiColors.length]}"><div class="wls-kpi-label">${escapeHtml(x.label)}</div><div class="wls-kpi-value">${escapeHtml(x.value)}</div></div>`
).join("")}</div>`;
  const sectionLabel = (ico, text) => `<div class="wls-section-label">${icon(ico, 13)} ${escapeHtml(text)}</div>`;
  const buildDetailsHtml = ({
    checkInSummary,
    timesheetSummary,
    comparison,
    timesheetError,
    status
  }) => {
    const yetToLog = Math.max(
      0,
      checkInSummary.totalCheckInWorkMinutes - timesheetSummary.totalMinutes
    );
    return `
    ${renderKpis([
    { label: "Status", value: status.label.replace(/\s[\S]*$/, "").trim() },
    { label: "Time-off taken", value: formatMinutes(checkInSummary.totalTimeOffMinutes) },
    { label: "Compensated", value: formatMinutes(checkInSummary.totalExtraWorkedMinutes) },
    { label: "Pending comp.", value: formatMinutes(checkInSummary.pendingMinutes) },
    { label: "Worked (check-in)", value: formatMinutes(checkInSummary.totalCheckInWorkMinutes) },
    {
      label: "Logged (timesheet)",
      value: timesheetError ? "API error" : formatMinutes(timesheetSummary.totalMinutes)
    },
    { label: "Yet to log", value: timesheetError ? "–" : formatMinutes(yetToLog) },
    { label: "Day-offs", value: String(checkInSummary.dayOffCount) }
  ])}
    <div class="wls-insight-row">
      <div class="wls-insight"><b>Overall:</b> ${status.message}</div>
      <div class="wls-insight"><b>Compensation:</b> Took ${escapeHtml(formatMinutes(checkInSummary.totalTimeOffMinutes))} time-off, compensated ${escapeHtml(formatMinutes(checkInSummary.totalExtraWorkedMinutes))}. ${checkInSummary.pendingMinutes > 0 ? `<b>${escapeHtml(formatMinutes(checkInSummary.pendingMinutes))}</b> pending.` : "Fully balanced ✓"}</div>
      <div class="wls-insight"><b>Timesheet:</b> Worked ${escapeHtml(formatMinutes(checkInSummary.totalCheckInWorkMinutes))}, logged ${escapeHtml(timesheetError ? "API error" : formatMinutes(timesheetSummary.totalMinutes))}. ${timesheetError ? "" : yetToLog > 0 ? `<b>${escapeHtml(formatMinutes(yetToLog))}</b> yet to log.` : "Fully logged ✓"}</div>
    </div>
    <div class="wls-modal-divider"></div>
    ${timesheetError ? `${sectionLabel("report", "Timesheet API error")}<div class="wls-error-box">${escapeHtml(timesheetError)}</div>` : `
          <div>${sectionLabel("table", "Worked vs logged")}${renderTable({
    emptyText: "No data.",
    columns: [
      { label: "Date", render: (r) => formatDisplayDate(r.date) },
      {
        label: "Worked",
        render: (r) => `${formatMinutes(r.checkInMinutes)} (${r.roundedCheckInHours}h)`
      },
      {
        label: "Logged",
        render: (r) => `${formatMinutes(r.timesheetMinutes)} (${r.roundedTimesheetHours}h)`
      },
      { label: "Gap", render: (r) => formatSignedMinutes(r.diffMinutes) },
      {
        label: "Status",
        html: true,
        render: (r) => `<span class="${r.statusClass}">${escapeHtml(r.status)}</span>`
      }
    ],
    rows: comparison.rows
  })}</div>
          <div>${sectionLabel("warn", "Mismatches — needs attention")}${renderTable({
    emptyText: "No mismatches! 🎉",
    columns: [
      { label: "Date", render: (r) => formatDisplayDate(r.date) },
      {
        label: "Worked",
        render: (r) => `${formatMinutes(r.checkInMinutes)} (${r.roundedCheckInHours}h)`
      },
      {
        label: "Logged",
        render: (r) => `${formatMinutes(r.timesheetMinutes)} (${r.roundedTimesheetHours}h)`
      },
      { label: "Gap", render: (r) => formatSignedMinutes(r.diffMinutes) }
    ],
    rows: comparison.mismatchRows
  })}</div>`}
    <div>${sectionLabel("clock", "Time-off taken")}${renderTable({
    emptyText: "No time-off records.",
    columns: [
      { label: "Date", render: (r) => formatDisplayDate(r.date) },
      { label: "Start", render: (r) => r.start || "–" },
      { label: "End", render: (r) => r.end || "–" },
      { label: "Duration", render: (r) => formatMinutes(r.minutes) }
    ],
    rows: checkInSummary.timeOffRows
  })}</div>
    <div>${sectionLabel("plus", "Compensated / extra worked")}${renderTable({
    emptyText: "No extra work.",
    columns: [
      { label: "Date", render: (r) => formatDisplayDate(r.date) },
      { label: "Worked", render: (r) => formatMinutes(r.workedMinutes) },
      { label: "Time-off", render: (r) => formatMinutes(r.timeOffMinutes) },
      { label: "Expected", render: (r) => formatMinutes(r.expectedMinutes) },
      { label: "Compensated", render: (r) => formatMinutes(r.extraMinutes) },
      { label: "Reason", render: (r) => r.reason }
    ],
    rows: checkInSummary.extraRows
  })}</div>
    <div>${sectionLabel("cal", "Day-offs")}${renderTable({
    emptyText: "No day-offs.",
    columns: [
      { label: "Date", render: (r) => formatDisplayDate(r.date) },
      { label: "Type", render: (r) => r.type }
    ],
    rows: checkInSummary.dayOffRows
  })}</div>
    ${timesheetError ? "" : ` <div>${sectionLabel("entries", "Timesheet entries")}${renderTable({
    emptyText: "No entries.",
    columns: [
      { label: "Date", render: (r) => formatDisplayDate(r.date) },
      { label: "Project / Module / Task", render: (r) => r.title },
      { label: "Logged", render: (r) => formatMinutes(r.minutes) },
      { label: "Description", render: (r) => stripHtml(r.description).slice(0, 160) }
    ],
    rows: timesheetSummary.records
  })}</div>`}`;
  };
  const setupPopover = () => {
    const existing = document.getElementById("wls-popover-el");
    if (existing) return existing;
    const el = document.createElement("div");
    el.id = "wls-popover-el";
    el.hidden = true;
    el.innerHTML = `<div class="pop-title"></div><div class="pop-rows"></div><div class="pop-note"></div><div class="pop-hint">Click to see full breakdown →</div>`;
    document.body.appendChild(el);
    return el;
  };
  const showPopover = (anchorEl, data, hasModalKey = false) => {
    const el = setupPopover();
    const titleEl = el.querySelector(".pop-title");
    const rowsEl = el.querySelector(".pop-rows");
    const noteEl = el.querySelector(".pop-note");
    const hintEl = el.querySelector(".pop-hint");
    if (titleEl) titleEl.textContent = data.title || "";
    if (rowsEl) {
      rowsEl.innerHTML = (data.rows || []).map(
        (r) => `<div class="pop-row"><span class="pop-lbl">${escapeHtml(r.label)}</span><span class="pop-val">${escapeHtml(r.value)}</span></div>`
      ).join("");
    }
    if (noteEl) {
      if (data.note) {
        noteEl.textContent = data.note;
        noteEl.style.display = "";
      } else noteEl.style.display = "none";
    }
    if (hintEl) hintEl.style.display = hasModalKey ? "" : "none";
    el.hidden = false;
    const rect = anchorEl.getBoundingClientRect();
    const ew = el.offsetWidth || 220;
    const eh = el.offsetHeight || 90;
    let left = rect.left + rect.width / 2 - ew / 2;
    const top = rect.top + window.scrollY - eh - 10;
    left = Math.max(8, Math.min(left, window.innerWidth - ew - 8));
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  };
  const hidePopover = () => {
    const el = document.getElementById("wls-popover-el");
    if (el) el.hidden = true;
  };
  const attachPopovers = (container) => {
    container.querySelectorAll("[data-pop]").forEach((el) => {
      let t;
      el.addEventListener("mouseenter", () => {
        clearTimeout(t);
        try {
          t = setTimeout(() => {
            showPopover(
              el,
              JSON.parse(el.getAttribute("data-pop") || "{}"),
              !!el.dataset.modalKey
            );
          }, 130);
        } catch {
        }
      });
      el.addEventListener("mouseleave", () => {
        clearTimeout(t);
        hidePopover();
      });
    });
  };
  const serializePop = (data) => JSON.stringify(data);
  let appState = null;
  const setMiniModalState = (state2) => {
    appState = state2;
  };
  const setupMiniModal = () => {
    var _a2, _b2;
    const existing = document.getElementById("wls-mini-modal-el");
    if (existing) return existing;
    const el = document.createElement("div");
    el.id = "wls-mini-modal-el";
    el.innerHTML = `<div class="wmm-backdrop"><div class="wmm-box"><div class="wmm-head"><div><div class="wmm-title"></div><div class="wmm-sub"></div></div><button class="wmm-close" type="button">${icon("close", 13)} Close</button></div><div class="wmm-body"></div></div></div>`;
    document.body.appendChild(el);
    (_a2 = el.querySelector(".wmm-backdrop")) == null ? void 0 : _a2.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) hideMiniModal();
    });
    (_b2 = el.querySelector(".wmm-close")) == null ? void 0 : _b2.addEventListener("click", hideMiniModal);
    return el;
  };
  const hideMiniModal = () => {
    var _a2;
    (_a2 = document.getElementById("wls-mini-modal-el")) == null ? void 0 : _a2.classList.remove("wls-mm-open");
  };
  const mmKpis = (items) => {
    const colors = ["kpi-purple", "kpi-blue", "kpi-green", "kpi-amber", "kpi-slate", "kpi-red"];
    return `<div class="wls-kpi-row">${items.map(
    (x, i) => `<div class="wls-kpi ${colors[i % colors.length]}"><div class="wls-kpi-label">${escapeHtml(x.label)}</div><div class="wls-kpi-value">${escapeHtml(x.value)}</div></div>`
  ).join("")}</div>`;
  };
  const buildMiniModalContent = (key) => {
    if (!appState) return null;
    const { checkInSummary, timesheetSummary, comparison, timesheetError } = appState;
    switch (key) {
      case "pending":
        return {
          title: "Compensation balance",
          sub: "Time-off taken vs extra hours worked",
          body: `
          ${mmKpis([
          { label: "Time-off taken", value: formatMinutes(checkInSummary.totalTimeOffMinutes) },
          { label: "Compensated", value: formatMinutes(checkInSummary.totalExtraWorkedMinutes) },
          { label: "Still pending", value: formatMinutes(checkInSummary.pendingMinutes) }
        ])}
          <div>${sectionLabel("clock", "Time-off records")}${renderTable({
          emptyText: "No time-off records.",
          columns: [
            { label: "Date", render: (r) => formatDisplayDate(r.date) },
            { label: "Start", render: (r) => r.start || "–" },
            { label: "End", render: (r) => r.end || "–" },
            { label: "Duration", render: (r) => formatMinutes(r.minutes) }
          ],
          rows: checkInSummary.timeOffRows
        })}</div>
          <div>${sectionLabel("plus", "Extra work / compensated sessions")}${renderTable({
          emptyText: "No extra work records.",
          columns: [
            { label: "Date", render: (r) => formatDisplayDate(r.date) },
            { label: "Worked", render: (r) => formatMinutes(r.workedMinutes) },
            { label: "Expected", render: (r) => formatMinutes(r.expectedMinutes) },
            { label: "Extra", render: (r) => formatMinutes(r.extraMinutes) },
            { label: "Reason", render: (r) => r.reason }
          ],
          rows: checkInSummary.extraRows
        })}</div>`
        };
      case "timeoff":
        return {
          title: "Time-off taken",
          sub: `${checkInSummary.timeOffRows.length} record(s) · Total ${formatMinutes(checkInSummary.totalTimeOffMinutes)}`,
          body: renderTable({
            emptyText: "No time-off records.",
            columns: [
              { label: "Date", render: (r) => formatDisplayDate(r.date) },
              { label: "Type", render: (r) => r.type },
              { label: "Start", render: (r) => r.start || "–" },
              { label: "End", render: (r) => r.end || "–" },
              { label: "Duration", render: (r) => formatMinutes(r.minutes) }
            ],
            rows: checkInSummary.timeOffRows
          })
        };
      case "compensated":
        return {
          title: "Extra work & compensation earned",
          sub: `${checkInSummary.extraRows.length} session(s) · Total ${formatMinutes(checkInSummary.totalExtraWorkedMinutes)}`,
          body: renderTable({
            emptyText: "No extra work recorded.",
            columns: [
              { label: "Date", render: (r) => formatDisplayDate(r.date) },
              { label: "Worked", render: (r) => formatMinutes(r.workedMinutes) },
              { label: "Time-off adj.", render: (r) => formatMinutes(r.timeOffMinutes) },
              { label: "Expected", render: (r) => formatMinutes(r.expectedMinutes) },
              { label: "Compensated", render: (r) => formatMinutes(r.extraMinutes) },
              { label: "Reason", render: (r) => r.reason }
            ],
            rows: checkInSummary.extraRows
          })
        };
      case "worked":
        return {
          title: "Hours worked — check-in breakdown",
          sub: `Total ${formatMinutes(checkInSummary.totalCheckInWorkMinutes)} across ${checkInSummary.dayRows.filter((d) => d.workMinutes > 0).length} days`,
          body: renderTable({
            emptyText: "No work records.",
            columns: [
              { label: "Date", render: (r) => formatDisplayDate(r.dateKey) },
              { label: "Worked", render: (r) => formatMinutes(r.workMinutes) },
              { label: "Time-off that day", render: (r) => formatMinutes(r.timeOffMinutes) },
              { label: "Sessions", render: (r) => String(r.workRecords.length) }
            ],
            rows: checkInSummary.dayRows.filter((d) => d.workMinutes > 0)
          })
        };
      case "logged":
        return {
          title: "Worked vs logged — day by day",
          sub: timesheetError ? "Timesheet unavailable" : `${comparison.rows.length} days compared · ${formatMinutes(timesheetSummary.totalMinutes)} total logged`,
          body: timesheetError ? `<div class="wls-error-box">${escapeHtml(timesheetError)}</div>` : renderTable({
            emptyText: "No data.",
            columns: [
              { label: "Date", render: (r) => formatDisplayDate(r.date) },
              {
                label: "Worked",
                render: (r) => `${formatMinutes(r.checkInMinutes)} (${r.roundedCheckInHours}h)`
              },
              {
                label: "Logged",
                render: (r) => `${formatMinutes(r.timesheetMinutes)} (${r.roundedTimesheetHours}h)`
              },
              { label: "Gap", render: (r) => formatSignedMinutes(r.diffMinutes) },
              {
                label: "Status",
                html: true,
                render: (r) => `<span class="${r.statusClass}">${escapeHtml(r.status)}</span>`
              }
            ],
            rows: comparison.rows
          })
        };
      case "mismatches":
        return {
          title: "Days with mismatch",
          sub: `${comparison.mismatchCount} day(s) where logged ≠ worked (rounded hour)`,
          body: renderTable({
            emptyText: "No mismatches — everything lines up! 🎉",
            columns: [
              { label: "Date", render: (r) => formatDisplayDate(r.date) },
              {
                label: "Worked",
                render: (r) => `${formatMinutes(r.checkInMinutes)} (${r.roundedCheckInHours}h)`
              },
              {
                label: "Logged",
                render: (r) => `${formatMinutes(r.timesheetMinutes)} (${r.roundedTimesheetHours}h)`
              },
              { label: "Gap", render: (r) => formatSignedMinutes(r.diffMinutes) }
            ],
            rows: comparison.mismatchRows
          })
        };
      case "dayoffs":
        return {
          title: "Day-offs this month",
          sub: `${checkInSummary.dayOffCount} day(s) off recorded`,
          body: renderTable({
            emptyText: "No day-offs recorded.",
            columns: [
              { label: "Date", render: (r) => formatDisplayDate(r.date) },
              { label: "Type", render: (r) => r.type }
            ],
            rows: checkInSummary.dayOffRows
          })
        };
      default:
        return null;
    }
  };
  const showMiniModal = (key) => {
    const content = buildMiniModalContent(key);
    if (!content) return;
    const el = setupMiniModal();
    const titleEl = el.querySelector(".wmm-title");
    const subEl = el.querySelector(".wmm-sub");
    const bodyEl = el.querySelector(".wmm-body");
    if (titleEl) titleEl.textContent = content.title;
    if (subEl) subEl.textContent = content.sub || "";
    if (bodyEl) bodyEl.innerHTML = content.body;
    el.classList.add("wls-mm-open");
  };
  const attachModalClicks = (container) => {
    container.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      const trigger = e.target.closest("[data-modal-key]");
      if (!trigger) return;
      hidePopover();
      showMiniModal(trigger.dataset.modalKey || "");
    });
  };
  const getOverallStatus = ({
    checkInSummary,
    timesheetSummary,
    comparison,
    timesheetError
  }) => {
    if (timesheetError) {
      return {
        label: "Flying blind",
        accentClass: "accent-muted",
        badgeClass: "badge-muted",
        summaryClass: "summary-muted",
        slabelClass: "slabel-muted",
        icon: "muted",
        message: `Timesheet API went quiet, so the logged-vs-worked picture is fuzzy right now. Your <strong>compensation math still works</strong> — it's running entirely on check-in data. Grab a coffee and hit Refresh in a bit.`
      };
    }
    const yetToLog = Math.max(
      0,
      checkInSummary.totalCheckInWorkMinutes - timesheetSummary.totalMinutes
    );
    const overLogged = Math.max(
      0,
      timesheetSummary.totalMinutes - checkInSummary.totalCheckInWorkMinutes
    );
    const gap = Math.max(yetToLog, overLogged);
    const pending = checkInSummary.pendingMinutes;
    const mismatches = comparison.mismatchCount;
    if (mismatches === 0 && pending === 0) {
      return {
        label: "Squeaky clean ✨",
        accentClass: "accent-good",
        badgeClass: "badge-good",
        summaryClass: "summary-good",
        slabelClass: "slabel-good",
        icon: "check",
        message: `Everything lines up — check-ins, timesheet, and compensation are all singing the same tune. <strong>Nothing left to fix.</strong> Go touch some grass.`
      };
    }
    if (gap <= 60 && pending <= 60) {
      const bits = [];
      if (gap > 0) bits.push(`<em>${formatMinutes(gap)}</em> to sort in your timesheet`);
      if (pending > 0) bits.push(`<em>${formatMinutes(pending)}</em> of uncompensated time-off`);
      return {
        label: "So close 👀",
        accentClass: "accent-warn",
        badgeClass: "badge-warn",
        summaryClass: "summary-warn",
        slabelClass: "slabel-warn",
        icon: "warn",
        message: `You're <strong>embarrassingly close to perfect</strong> — just ${bits.join(" and ")} standing in the way of a clean slate. One quick pass and you're golden.`
      };
    }
    if (gap <= 4 * 60 || mismatches <= 4) {
      const bits = [];
      if (mismatches > 0)
        bits.push(
          `<strong>${mismatches} day${mismatches > 1 ? "s" : ""}</strong> where logged hours don't match what you worked`
        );
      if (pending > 0)
        bits.push(`<em>${formatMinutes(pending)}</em> of time-off still waiting to be compensated`);
      return {
        label: "Needs some love 🛠",
        accentClass: "accent-mismatch",
        badgeClass: "badge-mismatch",
        summaryClass: "summary-mismatch",
        slabelClass: "slabel-mismatch",
        icon: "warn",
        message: `Getting there, but not quite. You've got ${bits.join(", plus ")}. A focused <strong>10-minute cleanup</strong> in the timesheet should sort this right out.`
      };
    }
    const logNote = yetToLog > overLogged ? `<em>${formatMinutes(yetToLog)}</em> of worked time hasn't made it into the timesheet yet` : `<em>${formatMinutes(overLogged)}</em> is logged in excess of what check-in recorded`;
    return {
      label: "Gone rogue 🚨",
      accentClass: "accent-bad",
      badgeClass: "badge-bad",
      summaryClass: "summary-bad",
      slabelClass: "slabel-bad",
      icon: "error",
      message: `Your timesheet and check-ins are living completely separate lives. ${logNote}, and there are <strong>${mismatches} mismatched day${mismatches !== 1 ? "s" : ""}</strong> on record. This one needs a proper sit-down to untangle.`
    };
  };
  var root = /* @__PURE__ */ from_html(`<div class="wls-card"><div class="wls-accent accent-muted"></div> <div class="wls-top-row" style="cursor:default"><div class="wls-title">Work log summary</div> <!> <div class="wls-top-right"><span class="wls-range"> </span></div></div> <div class="wls-loading"><div class="wls-spinner"></div> </div></div>`);
  var root_1 = /* @__PURE__ */ from_html(`<div class="wls-card"><div class="wls-accent accent-bad"></div> <div class="wls-top-row" style="cursor:default"><div class="wls-title">Work log summary</div> <!> <div class="wls-top-right"><span class="wls-range"> </span> <button class="wls-btn wls-btn-primary" type="button"><!> Refresh</button></div></div> <div class="wls-error-box"> </div></div>`);
  var root_2 = /* @__PURE__ */ from_html(`<span style="font-size:14px;color:#94a3b8">Unavailable</span>`);
  var root_3 = /* @__PURE__ */ from_html(`<span class="wls-dur" data-modal-key="logged"> </span>`);
  var root_4 = /* @__PURE__ */ from_html(`<div class="wls-prog-wrap"><div class="wls-prog-track"><div style="width:0%"></div></div> <div class="wls-prog-labels"><span> </span> <span> </span></div></div>`);
  var root_5 = /* @__PURE__ */ from_html(`<span class="wls-chip chip-slate">Timesheet unavailable</span>`);
  var root_6 = /* @__PURE__ */ from_html(`<span class="wls-chip chip-amber wls-dur" data-modal-key="logged"><!> </span>`);
  var root_7 = /* @__PURE__ */ from_html(`<span data-modal-key="logged"><!> </span>`);
  var root_8 = /* @__PURE__ */ from_html(`<div class="wls-modal-backdrop" role="presentation"><div class="wls-modal" role="dialog" aria-modal="true"><div class="wls-modal-head"><div><div class="wls-modal-title">Full work log breakdown</div> <div class="wls-modal-subtitle"> </div></div> <button class="wls-close-btn" type="button"><!> Close</button></div> <div class="wls-modal-body"></div></div></div>`);
  var root_9 = /* @__PURE__ */ from_html(`<div class="wls-card"><div></div> <div class="wls-top-row" role="button" tabindex="0"><span class="wls-chevron"><!></span> <span class="wls-title">Work log summary</span> <span><!> </span> <div class="wls-inline-stats"><span class="wls-stat-sep">·</span> <span class="wls-stat wls-stat-purple wls-dur" data-modal-key="timeoff">Time-off <strong> </strong></span> <span class="wls-stat-sep">·</span> <span class="wls-stat wls-stat-purple wls-dur" data-modal-key="compensated">Comp'd <strong> </strong></span> <span class="wls-stat-sep">·</span> <span data-modal-key="pending">Pending <strong> </strong></span> <span class="wls-stat-sep">·</span> <span class="wls-stat wls-dur" data-modal-key="logged">Logged <strong> </strong></span> <span class="wls-stat-sep">·</span> <span data-modal-key="mismatches"><strong> </strong> </span> <span class="wls-stat-sep">·</span> <span class="wls-stat wls-dur" data-modal-key="dayoffs">Day-offs <strong> </strong></span></div> <div class="wls-top-right"><!> <span class="wls-range"> </span> <button class="wls-btn wls-btn-primary" type="button"><!> Refresh</button></div></div> <div class="wls-expandable"><div class="wls-body-divider"></div> <div class="wls-expandable-inner"><div class="wls-main"><div class="wls-block wls-block-comp"><div class="wls-block-hd"><div class="wls-block-icon icon-comp"><!></div> <span class="wls-block-label">Compensation balance</span></div> <div class="wls-big wls-big-c"><span class="wls-dur" data-modal-key="pending"> </span> <span class="wls-big-sub">pending</span></div> <div class="wls-chips"><span class="wls-chip chip-purple wls-dur" data-modal-key="timeoff"><!> Time-off &nbsp;<strong> </strong></span> <span class="wls-chip chip-pink wls-dur" data-modal-key="compensated"><!> Compensated &nbsp;<strong> </strong></span> <span class="wls-chip chip-amber wls-dur" data-modal-key="dayoffs"><!> Day-offs &nbsp;<strong> </strong></span></div></div> <div class="wls-block wls-block-ts"><div class="wls-block-hd"><div class="wls-block-icon icon-ts"><!></div> <span class="wls-block-label">Worked vs logged</span></div> <div class="wls-big wls-big-t"><!> <span class="wls-big-sub">logged</span></div> <div class="wls-block-sub">of <span class="wls-dur" data-modal-key="worked"> </span> worked</div> <!> <div class="wls-chips"><!> <span data-modal-key="mismatches"><!> </span></div></div></div> <div><div><!> </div> <!></div> <div class="wls-exp-actions"><button class="wls-btn" type="button"><!> View full details</button></div></div></div> <!></div>`);
  var root_10 = /* @__PURE__ */ from_html(`<div><!></div>`);
  function App($$anchor, $$props) {
    push($$props, true);
    let monthOffset = /* @__PURE__ */ state(0);
    let isExpanded = /* @__PURE__ */ state(false);
    let view = /* @__PURE__ */ state(proxy({ kind: "loading", monthOffset: 0 }));
    let detailsOpen = /* @__PURE__ */ state(false);
    let cardEl = /* @__PURE__ */ state(void 0);
    const refresh = async () => {
      set(view, { kind: "loading", monthOffset: get(monthOffset) }, true);
      const result = await loadViewState(get(monthOffset));
      set(view, result, true);
      if (result.kind === "success") {
        setMiniModalState({
          checkInSummary: result.checkInSummary,
          timesheetSummary: result.timesheetSummary,
          comparison: result.comparison,
          timesheetError: result.timesheetError
        });
        await tick();
        if (get(cardEl)) {
          attachPopovers(get(cardEl));
          attachModalClicks(get(cardEl));
          const fill = get(cardEl).querySelector(".wls-prog-fill");
          if (fill) fill.style.width = `${Math.min(100, Number(fill.dataset.pct))}%`;
        }
      }
    };
    const selectMonth = (offset) => {
      if (offset !== get(monthOffset)) {
        set(monthOffset, offset, true);
        refresh();
      }
    };
    onMount(() => {
      refresh();
      const onKey = (e) => {
        if (e.key !== "Escape") return;
        set(detailsOpen, false);
        hideMiniModal();
        hidePopover();
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    });
    user_effect(() => {
      var _a2;
      (_a2 = document.getElementById(CONFIG.cardId)) == null ? void 0 : _a2.classList.toggle("wls-expanded", get(isExpanded));
    });
    const pop$1 = serializePop;
    var div = root_10();
    var node = child(div);
    {
      var consequent = ($$anchor2) => {
        const range = /* @__PURE__ */ user_derived(() => getMonthRange(get(view).monthOffset));
        var div_1 = root();
        var div_2 = sibling(child(div_1), 2);
        var node_1 = sibling(child(div_2), 2);
        MonthPicker(node_1, {
          get currentOffset() {
            return get(monthOffset);
          },
          onSelect: selectMonth
        });
        var div_3 = sibling(node_1, 2);
        var span = child(div_3);
        var text = child(span);
        var div_4 = sibling(div_2, 2);
        var text_1 = sibling(child(div_4));
        template_effect(
          ($0, $1, $2) => {
            set_text(text, `${$0 ?? ""} – ${$1 ?? ""}`);
            set_text(text_1, ` Crunching data for ${$2 ?? ""}…`);
          },
          [
            () => formatDisplayDate(get(range).startDate),
            () => formatDisplayDate(get(range).endDate),
            () => getMonthRange(get(view).monthOffset).startDate.slice(0, 7)
          ]
        );
        append($$anchor2, div_1);
      };
      var consequent_1 = ($$anchor2) => {
        const range = /* @__PURE__ */ user_derived(() => getMonthRange(get(view).monthOffset));
        var div_5 = root_1();
        var div_6 = sibling(child(div_5), 2);
        var node_2 = sibling(child(div_6), 2);
        MonthPicker(node_2, {
          get currentOffset() {
            return get(monthOffset);
          },
          onSelect: selectMonth
        });
        var div_7 = sibling(node_2, 2);
        var span_1 = child(div_7);
        var text_2 = child(span_1);
        var button = sibling(span_1, 2);
        var node_3 = child(button);
        Icon(node_3, { name: "refresh" });
        var div_8 = sibling(div_6, 2);
        var text_3 = child(div_8);
        template_effect(
          ($0, $1) => {
            set_text(text_2, `${$0 ?? ""} – ${$1 ?? ""}`);
            set_text(text_3, get(view).message);
          },
          [
            () => formatDisplayDate(get(range).startDate),
            () => formatDisplayDate(get(range).endDate)
          ]
        );
        delegated("click", button, refresh);
        append($$anchor2, div_5);
      };
      var alternate_2 = ($$anchor2) => {
        const computed_const = /* @__PURE__ */ user_derived(() => {
          const {
            checkInSummary,
            timesheetSummary,
            comparison,
            timesheetError,
            startDate,
            endDate
          } = get(view);
          return {
            checkInSummary,
            timesheetSummary,
            comparison,
            timesheetError,
            startDate,
            endDate
          };
        });
        const status = /* @__PURE__ */ user_derived(() => getOverallStatus({
          checkInSummary: get(computed_const).checkInSummary,
          timesheetSummary: get(computed_const).timesheetSummary,
          comparison: get(computed_const).comparison,
          timesheetError: get(computed_const).timesheetError
        }));
        const worked = /* @__PURE__ */ user_derived(() => get(computed_const).checkInSummary.totalCheckInWorkMinutes);
        const logged = /* @__PURE__ */ user_derived(() => get(computed_const).timesheetSummary.totalMinutes);
        const yetToLog = /* @__PURE__ */ user_derived(() => get(computed_const).timesheetError ? 0 : Math.max(0, get(worked) - get(logged)));
        const overLogged = /* @__PURE__ */ user_derived(() => get(computed_const).timesheetError ? 0 : Math.max(0, get(logged) - get(worked)));
        const progPct = /* @__PURE__ */ user_derived(() => get(worked) > 0 ? Math.min(100, Math.round(get(logged) / get(worked) * 100)) : 0);
        const progClass = /* @__PURE__ */ user_derived(() => get(logged) > get(worked) ? "prog-over" : get(progPct) >= 95 ? "prog-ok" : "prog-low");
        const popPending = /* @__PURE__ */ user_derived(() => pop$1({
          title: "Compensation balance",
          rows: [
            {
              label: "Time-off taken",
              value: formatMinutes(get(computed_const).checkInSummary.totalTimeOffMinutes)
            },
            {
              label: "Compensated",
              value: formatMinutes(get(computed_const).checkInSummary.totalExtraWorkedMinutes)
            },
            {
              label: "Still pending",
              value: formatMinutes(get(computed_const).checkInSummary.pendingMinutes)
            }
          ],
          note: get(computed_const).checkInSummary.pendingMinutes === 0 ? "All balanced! 🎉" : "Work extra hours to clear this."
        }));
        const popTimeoff = /* @__PURE__ */ user_derived(() => pop$1({
          title: "Time-off taken",
          rows: [
            {
              label: "Total",
              value: formatMinutes(get(computed_const).checkInSummary.totalTimeOffMinutes)
            },
            {
              label: "Records",
              value: String(get(computed_const).checkInSummary.timeOffRows.length)
            }
          ],
          note: "Individual slots listed inside."
        }));
        const popComp = /* @__PURE__ */ user_derived(() => pop$1({
          title: "Compensated hours",
          rows: [
            {
              label: "Extra worked",
              value: formatMinutes(get(computed_const).checkInSummary.totalExtraWorkedMinutes)
            },
            {
              label: "Sessions",
              value: String(get(computed_const).checkInSummary.extraRows.length)
            }
          ],
          note: "Includes weekend work and above-target days."
        }));
        const popLogged = /* @__PURE__ */ user_derived(() => pop$1({
          title: "Timesheet vs check-in",
          rows: [
            { label: "Worked", value: formatMinutes(get(worked)) },
            {
              label: "Logged",
              value: get(computed_const).timesheetError ? "API error" : formatMinutes(get(logged))
            },
            {
              label: "Gap",
              value: get(computed_const).timesheetError ? "–" : `${get(logged) - get(worked) >= 0 ? "+" : "−"}${formatMinutes(Math.abs(get(logged) - get(worked)))}`
            },
            {
              label: "Match rate",
              value: get(computed_const).timesheetError ? "–" : `${get(progPct)}%`
            }
          ],
          note: get(computed_const).timesheetError ? "Timesheet unavailable." : get(overLogged) > 0 ? "Over-logged — double-check entries." : get(yetToLog) > 0 ? `${formatMinutes(get(yetToLog))} still unlogged.` : "Fully matched! ✓"
        }));
        const popWorked = /* @__PURE__ */ user_derived(() => pop$1({
          title: "Hours worked (check-in)",
          rows: [
            { label: "Total worked", value: formatMinutes(get(worked)) },
            {
              label: "Days with check-in",
              value: String(get(computed_const).checkInSummary.dayRows.filter((d) => d.workMinutes > 0).length)
            },
            {
              label: "Day-offs",
              value: String(get(computed_const).checkInSummary.dayOffCount)
            }
          ],
          note: "Derived from check-in & check-out times."
        }));
        const popMismatch = /* @__PURE__ */ user_derived(() => pop$1({
          title: "Day mismatches",
          rows: [
            {
              label: "Days compared",
              value: String(get(computed_const).comparison.rows.length)
            },
            {
              label: "Mismatches",
              value: String(get(computed_const).comparison.mismatchCount)
            },
            { label: "Method", value: "Rounded hour" }
          ],
          note: get(computed_const).comparison.mismatchCount === 0 ? "All days match! 🎉" : `Fix these ${get(computed_const).comparison.mismatchCount} days in the timesheet.`
        }));
        const popDayoff = /* @__PURE__ */ user_derived(() => pop$1({
          title: "Day-offs this month",
          rows: [
            {
              label: "Total day-offs",
              value: String(get(computed_const).checkInSummary.dayOffCount)
            },
            {
              label: "Types",
              value: [
                ...new Set(get(computed_const).checkInSummary.dayOffRows.map((r) => r.type))
              ].join(", ") || "–"
            }
          ],
          note: "Includes Day Off, Comp Off, and On Duty."
        }));
        const mismatchColor = /* @__PURE__ */ user_derived(() => get(computed_const).comparison.mismatchCount === 0 ? "wls-stat-good" : "wls-stat-bad");
        const pendingColor = /* @__PURE__ */ user_derived(() => get(computed_const).checkInSummary.pendingMinutes === 0 ? "wls-stat-good" : "wls-stat-warn");
        var div_9 = root_9();
        var div_10 = child(div_9);
        var div_11 = sibling(div_10, 2);
        var span_2 = child(div_11);
        var node_4 = child(span_2);
        Icon(node_4, { name: "chevron", size: 16 });
        var span_3 = sibling(span_2, 4);
        var node_5 = child(span_3);
        Icon(node_5, {
          get name() {
            return get(status).icon;
          },
          size: 11
        });
        var text_4 = sibling(node_5);
        var div_12 = sibling(span_3, 2);
        var span_4 = sibling(child(div_12), 2);
        var strong = sibling(child(span_4));
        var text_5 = child(strong);
        var span_5 = sibling(span_4, 4);
        var strong_1 = sibling(child(span_5));
        var text_6 = child(strong_1);
        var span_6 = sibling(span_5, 4);
        var strong_2 = sibling(child(span_6));
        var text_7 = child(strong_2);
        var span_7 = sibling(span_6, 4);
        var strong_3 = sibling(child(span_7));
        var text_8 = child(strong_3);
        var span_8 = sibling(span_7, 4);
        var strong_4 = child(span_8);
        var text_9 = child(strong_4);
        var text_10 = sibling(strong_4);
        var span_9 = sibling(span_8, 4);
        var strong_5 = sibling(child(span_9));
        var text_11 = child(strong_5);
        var div_13 = sibling(div_12, 2);
        var node_6 = child(div_13);
        MonthPicker(node_6, {
          get currentOffset() {
            return get(monthOffset);
          },
          onSelect: selectMonth
        });
        var span_10 = sibling(node_6, 2);
        var text_12 = child(span_10);
        var button_1 = sibling(span_10, 2);
        var node_7 = child(button_1);
        Icon(node_7, { name: "refresh" });
        var div_14 = sibling(div_11, 2);
        var div_15 = sibling(child(div_14), 2);
        var div_16 = child(div_15);
        var div_17 = child(div_16);
        var div_18 = child(div_17);
        var div_19 = child(div_18);
        var node_8 = child(div_19);
        Icon(node_8, { name: "clock", size: 14 });
        var div_20 = sibling(div_18, 2);
        var span_11 = child(div_20);
        var text_13 = child(span_11);
        var div_21 = sibling(div_20, 2);
        var span_12 = child(div_21);
        var node_9 = child(span_12);
        Icon(node_9, { name: "clock", size: 11 });
        var strong_6 = sibling(node_9, 2);
        var text_14 = child(strong_6);
        var span_13 = sibling(span_12, 2);
        var node_10 = child(span_13);
        Icon(node_10, { name: "check", size: 11 });
        var strong_7 = sibling(node_10, 2);
        var text_15 = child(strong_7);
        var span_14 = sibling(span_13, 2);
        var node_11 = child(span_14);
        Icon(node_11, { name: "cal", size: 11 });
        var strong_8 = sibling(node_11, 2);
        var text_16 = child(strong_8);
        var div_22 = sibling(div_17, 2);
        var div_23 = child(div_22);
        var div_24 = child(div_23);
        var node_12 = child(div_24);
        Icon(node_12, { name: "report", size: 14 });
        var div_25 = sibling(div_23, 2);
        var node_13 = child(div_25);
        {
          var consequent_2 = ($$anchor3) => {
            var span_15 = root_2();
            append($$anchor3, span_15);
          };
          var alternate = ($$anchor3) => {
            var span_16 = root_3();
            var text_17 = child(span_16);
            template_effect(
              ($0) => {
                set_attribute(span_16, "data-pop", get(popLogged));
                set_text(text_17, $0);
              },
              [() => formatMinutes(get(logged))]
            );
            append($$anchor3, span_16);
          };
          if_block(node_13, ($$render) => {
            if (get(computed_const).timesheetError) $$render(consequent_2);
            else $$render(alternate, -1);
          });
        }
        var div_26 = sibling(div_25, 2);
        var span_17 = sibling(child(div_26));
        var text_18 = child(span_17);
        var node_14 = sibling(div_26, 2);
        {
          var consequent_3 = ($$anchor3) => {
            var div_27 = root_4();
            var div_28 = child(div_27);
            var div_29 = child(div_28);
            var div_30 = sibling(div_28, 2);
            var span_18 = child(div_30);
            var text_19 = child(span_18);
            var span_19 = sibling(span_18, 2);
            var text_20 = child(span_19);
            template_effect(
              ($0) => {
                set_class(div_29, 1, `wls-prog-fill ${get(progClass) ?? ""}`);
                set_attribute(div_29, "data-pct", get(progPct));
                set_text(text_19, `${get(progPct) ?? ""}% logged`);
                set_text(text_20, $0);
              },
              [
                () => get(logged) > get(worked) ? "over-logged ⚠" : get(yetToLog) > 0 ? `${formatMinutes(get(yetToLog))} to go` : "complete ✓"
              ]
            );
            append($$anchor3, div_27);
          };
          if_block(node_14, ($$render) => {
            if (!get(computed_const).timesheetError) $$render(consequent_3);
          });
        }
        var div_31 = sibling(node_14, 2);
        var node_15 = child(div_31);
        {
          var consequent_4 = ($$anchor3) => {
            var span_20 = root_5();
            append($$anchor3, span_20);
          };
          var consequent_5 = ($$anchor3) => {
            var span_21 = root_6();
            var node_16 = child(span_21);
            Icon(node_16, { name: "warn", size: 11 });
            var text_21 = sibling(node_16);
            template_effect(
              ($0) => {
                set_attribute(span_21, "data-pop", get(popLogged));
                set_text(text_21, ` ${$0 ?? ""} over-logged`);
              },
              [() => formatMinutes(get(overLogged))]
            );
            append($$anchor3, span_21);
          };
          var alternate_1 = ($$anchor3) => {
            var span_22 = root_7();
            var node_17 = child(span_22);
            {
              let $0 = /* @__PURE__ */ user_derived(() => get(yetToLog) === 0 ? "check" : "clock");
              Icon(node_17, {
                get name() {
                  return get($0);
                },
                size: 11
              });
            }
            var text_22 = sibling(node_17);
            template_effect(
              ($0) => {
                set_class(span_22, 1, `wls-chip ${get(yetToLog) === 0 ? "chip-green" : "chip-blue"} wls-dur`);
                set_attribute(span_22, "data-pop", get(popLogged));
                set_text(text_22, ` ${$0 ?? ""}`);
              },
              [
                () => get(yetToLog) === 0 ? "All logged" : `${formatMinutes(get(yetToLog))} left`
              ]
            );
            append($$anchor3, span_22);
          };
          if_block(node_15, ($$render) => {
            if (get(computed_const).timesheetError) $$render(consequent_4);
            else if (get(overLogged) > 0) $$render(consequent_5, 1);
            else $$render(alternate_1, -1);
          });
        }
        var span_23 = sibling(node_15, 2);
        var node_18 = child(span_23);
        {
          let $0 = /* @__PURE__ */ user_derived(() => get(computed_const).comparison.mismatchCount === 0 ? "check" : "warn");
          Icon(node_18, {
            get name() {
              return get($0);
            },
            size: 11
          });
        }
        var text_23 = sibling(node_18);
        var div_32 = sibling(div_16, 2);
        var div_33 = child(div_32);
        var node_19 = child(div_33);
        Icon(node_19, {
          get name() {
            return get(status).icon;
          },
          size: 11
        });
        var text_24 = sibling(node_19);
        var node_20 = sibling(div_33, 2);
        html(node_20, () => get(status).message);
        var div_34 = sibling(div_32, 2);
        var button_2 = child(div_34);
        var node_21 = child(button_2);
        Icon(node_21, { name: "list" });
        var node_22 = sibling(div_14, 2);
        {
          var consequent_6 = ($$anchor3) => {
            var div_35 = root_8();
            var div_36 = child(div_35);
            var div_37 = child(div_36);
            var div_38 = child(div_37);
            var div_39 = sibling(child(div_38), 2);
            var text_25 = child(div_39);
            var button_3 = sibling(div_38, 2);
            var node_23 = child(button_3);
            Icon(node_23, { name: "close" });
            var div_40 = sibling(div_37, 2);
            html(
              div_40,
              () => buildDetailsHtml({
                checkInSummary: get(computed_const).checkInSummary,
                timesheetSummary: get(computed_const).timesheetSummary,
                comparison: get(computed_const).comparison,
                timesheetError: get(computed_const).timesheetError,
                status: get(status)
              }),
              true
            );
            template_effect(($0, $1) => set_text(text_25, `${$0 ?? ""} – ${$1 ?? ""}`), [
              () => formatDisplayDate(get(computed_const).startDate),
              () => formatDisplayDate(get(computed_const).endDate)
            ]);
            delegated("click", div_35, (e) => {
              if (e.target === e.currentTarget) set(detailsOpen, false);
            });
            delegated("click", button_3, () => set(detailsOpen, false));
            append($$anchor3, div_35);
          };
          if_block(node_22, ($$render) => {
            if (get(detailsOpen)) $$render(consequent_6);
          });
        }
        template_effect(
          ($0, $1, $2, $3, $4, $5, $6, $7, $8) => {
            set_class(div_10, 1, `wls-accent ${get(status).accentClass ?? ""}`);
            set_class(span_3, 1, `wls-badge ${get(status).badgeClass ?? ""}`);
            set_text(text_4, ` ${get(status).label ?? ""}`);
            set_attribute(span_4, "data-pop", get(popTimeoff));
            set_text(text_5, $0);
            set_attribute(span_5, "data-pop", get(popComp));
            set_text(text_6, $1);
            set_class(span_6, 1, `wls-stat ${get(pendingColor) ?? ""} wls-dur`);
            set_attribute(span_6, "data-pop", get(popPending));
            set_text(text_7, $2);
            set_attribute(span_7, "data-pop", get(popLogged));
            set_text(text_8, get(computed_const).timesheetError ? "?" : `${get(progPct)}%`);
            set_class(span_8, 1, `wls-stat ${get(mismatchColor) ?? ""} wls-dur`);
            set_attribute(span_8, "data-pop", get(popMismatch));
            set_text(text_9, get(computed_const).timesheetError ? "–" : get(computed_const).comparison.mismatchCount);
            set_text(text_10, ` mismatch${get(computed_const).comparison.mismatchCount !== 1 ? "es" : ""}`);
            set_attribute(span_9, "data-pop", get(popDayoff));
            set_text(text_11, get(computed_const).checkInSummary.dayOffCount);
            set_text(text_12, `${$3 ?? ""} – ${$4 ?? ""}`);
            set_attribute(span_11, "data-pop", get(popPending));
            set_text(text_13, $5);
            set_attribute(span_12, "data-pop", get(popTimeoff));
            set_text(text_14, $6);
            set_attribute(span_13, "data-pop", get(popComp));
            set_text(text_15, $7);
            set_attribute(span_14, "data-pop", get(popDayoff));
            set_text(text_16, get(computed_const).checkInSummary.dayOffCount);
            set_attribute(span_17, "data-pop", get(popWorked));
            set_text(text_18, $8);
            set_class(span_23, 1, `wls-chip ${get(computed_const).comparison.mismatchCount === 0 ? "chip-green" : "chip-red"} wls-dur`);
            set_attribute(span_23, "data-pop", get(popMismatch));
            set_text(text_23, ` ${(get(computed_const).timesheetError ? "–" : get(computed_const).comparison.mismatchCount) ?? ""} mismatch${get(computed_const).comparison.mismatchCount !== 1 ? "es" : ""}`);
            set_class(div_32, 1, `wls-summary ${get(status).summaryClass ?? ""}`);
            set_class(div_33, 1, `wls-summary-label ${get(status).slabelClass ?? ""}`);
            set_text(text_24, ` ${get(status).label ?? ""}`);
          },
          [
            () => formatMinutes(get(computed_const).checkInSummary.totalTimeOffMinutes),
            () => formatMinutes(get(computed_const).checkInSummary.totalExtraWorkedMinutes),
            () => formatMinutes(get(computed_const).checkInSummary.pendingMinutes),
            () => formatDisplayDate(get(computed_const).startDate),
            () => formatDisplayDate(get(computed_const).endDate),
            () => formatMinutes(get(computed_const).checkInSummary.pendingMinutes),
            () => formatMinutes(get(computed_const).checkInSummary.totalTimeOffMinutes),
            () => formatMinutes(get(computed_const).checkInSummary.totalExtraWorkedMinutes),
            () => formatMinutes(get(worked))
          ]
        );
        delegated("click", div_11, (e) => {
          if (e.target.closest("button,[data-modal-key],.wls-month-picker")) return;
          set(isExpanded, !get(isExpanded));
        });
        delegated("keydown", div_11, (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            set(isExpanded, !get(isExpanded));
          }
        });
        delegated("click", button_1, (e) => {
          e.stopPropagation();
          refresh();
        });
        delegated("click", button_2, (e) => {
          e.stopPropagation();
          set(detailsOpen, true);
        });
        append($$anchor2, div_9);
      };
      if_block(node, ($$render) => {
        if (get(view).kind === "loading") $$render(consequent);
        else if (get(view).kind === "error") $$render(consequent_1, 1);
        else $$render(alternate_2, -1);
      });
    }
    bind_this(div, ($$value) => set(cardEl, $$value), () => get(cardEl));
    append($$anchor, div);
    pop();
  }
  delegate(["click", "keydown"]);
  const getOrCreateCard = () => {
    let card2 = document.getElementById(CONFIG.cardId);
    if (card2) return card2;
    card2 = document.createElement("div");
    card2.id = CONFIG.cardId;
    const notifyEl = document.getElementById("notify_my_check_in_data");
    const checkinDetail = document.getElementById("my-checkin-detail");
    if (notifyEl == null ? void 0 : notifyEl.parentElement) notifyEl.parentElement.insertBefore(card2, notifyEl);
    else if (checkinDetail == null ? void 0 : checkinDetail.parentElement)
      checkinDetail.parentElement.insertBefore(card2, checkinDetail);
    else document.body.prepend(card2);
    return card2;
  };
  const initDom = () => {
    removePreviousArtifacts();
    getOrCreateCard();
  };
  const STORAGE_KEY = "hubble-theme";
  const MODES = ["system", "dark", "light"];
  const SWITCHER_ID = "hubble-theme-switcher";
  function getStoredMode() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return MODES.includes(stored) ? stored : "system";
  }
  function applyTheme(mode) {
    document.documentElement.dataset.hubbleTheme = mode;
    const root2 = document.getElementById(SWITCHER_ID);
    if (root2) {
      root2.querySelectorAll("[data-mode]").forEach((btn) => {
        btn.classList.toggle("hts-active", btn.dataset.mode === mode);
      });
    }
  }
  function setMode(mode) {
    if (!MODES.includes(mode)) return;
    localStorage.setItem(STORAGE_KEY, mode);
    applyTheme(mode);
  }
  function ensureSwitcher() {
    if (document.getElementById(SWITCHER_ID)) return;
    const root2 = document.createElement("div");
    root2.id = SWITCHER_ID;
    root2.innerHTML = `
    <button type="button" data-mode="system" title="System theme">Auto</button>
    <button type="button" data-mode="dark" title="Dark Dracula">Dark</button>
    <button type="button" data-mode="light" title="Light Dracula">Light</button>
  `;
    root2.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-mode]");
      if (btn) setMode(btn.dataset.mode);
    });
    document.body.appendChild(root2);
    applyTheme(getStoredMode());
  }
  function initThemeSwitcher() {
    if (window.__hubbleThemeSwitcherInit) return;
    window.__hubbleThemeSwitcherInit = true;
    const boot = () => {
      ensureSwitcher();
      applyTheme(getStoredMode());
    };
    if (document.body) boot();
    else document.addEventListener("DOMContentLoaded", boot);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (getStoredMode() === "system") applyTheme("system");
    });
  }
  initThemeSwitcher();
  initDom();
  const card = document.getElementById("custom-work-log-summary-card");
  if (card) {
    mount(App, { target: card });
  }

})();