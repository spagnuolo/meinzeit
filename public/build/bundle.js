
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.31.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src/Title.svelte generated by Svelte v3.31.0 */

    const file = "src/Title.svelte";

    function create_fragment(ctx) {
    	let h1;
    	let t1;
    	let p;
    	let span0;
    	let t3;
    	let span1;
    	let t5;
    	let hr;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "MMXXX - AA Heute";
    			t1 = space();
    			p = element("p");
    			span0 = element("span");
    			span0.textContent = "Ausgabe 2030/2";
    			t3 = space();
    			span1 = element("span");
    			span1.textContent = "$1,30";
    			t5 = space();
    			hr = element("hr");
    			attr_dev(h1, "class", "svelte-oqoztf");
    			add_location(h1, file, 23, 0, 450);
    			add_location(span0, file, 24, 3, 480);
    			attr_dev(span1, "class", "preis svelte-oqoztf");
    			add_location(span1, file, 24, 31, 508);
    			attr_dev(p, "class", "svelte-oqoztf");
    			add_location(p, file, 24, 0, 477);
    			add_location(hr, file, 25, 0, 546);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, span0);
    			append_dev(p, t3);
    			append_dev(p, span1);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, hr, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Title", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Title> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Title extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/Head.svelte generated by Svelte v3.31.0 */

    const file$1 = "src/Head.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let p0;
    	let span;
    	let t1;
    	let t2;
    	let p1;
    	let t4;
    	let p2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			span = element("span");
    			span.textContent = "MMXXX Subtitle";
    			t1 = text("\r\n        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim\r\n        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\r\n        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate\r\n        velit esse cillum dolore eu fugiat nulla pariatur");
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim\r\n        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\r\n        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate\r\n        velit esse cillum dolore eu fugiat nulla pariatur. Giuliano sint\r\n        occaecat cupidatat non proident, sunt in culpa qui officia deserunt\r\n        mollit anim id.";
    			t4 = space();
    			p2 = element("p");
    			p2.textContent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim\r\n        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\r\n        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate\r\n        velit esse cillum dolore eu fugiat nulla pariatur. Giuliano sint\r\n        occaecat cupidatat non proident, sunt in culpa qui officia deserunt\r\n        mollit anim id.";
    			attr_dev(span, "class", "subtitle svelte-1473bgx");
    			add_location(span, file$1, 14, 8, 208);
    			add_location(p0, file$1, 13, 4, 195);
    			add_location(p1, file$1, 21, 4, 648);
    			add_location(p2, file$1, 30, 4, 1164);
    			attr_dev(div, "class", "svelte-1473bgx");
    			add_location(div, file$1, 12, 0, 184);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(p0, span);
    			append_dev(p0, t1);
    			append_dev(div, t2);
    			append_dev(div, p1);
    			append_dev(div, t4);
    			append_dev(div, p2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Head", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Head> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Head extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Head",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/Gallery.svelte generated by Svelte v3.31.0 */

    const { console: console_1 } = globals;
    const file$2 = "src/Gallery.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i].active;
    	child_ctx[6] = list[i].url;
    	child_ctx[7] = list[i].title;
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (68:4) {#each panels as { active, url, title }
    function create_each_block(ctx) {
    	let div;
    	let h3;
    	let t0_value = /*title*/ ctx[7] + "";
    	let t0;
    	let t1;
    	let div_class_value;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*i*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(h3, "class", "svelte-1rp1jls");
    			add_location(h3, file$2, 72, 12, 1801);
    			attr_dev(div, "class", div_class_value = "panel " + /*active*/ ctx[5] + " svelte-1rp1jls");
    			set_style(div, "background-image", "url(" + /*url*/ ctx[6] + ")");
    			add_location(div, file$2, 68, 8, 1651);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*panels*/ 1 && t0_value !== (t0_value = /*title*/ ctx[7] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*panels*/ 1 && div_class_value !== (div_class_value = "panel " + /*active*/ ctx[5] + " svelte-1rp1jls")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*panels*/ 1) {
    				set_style(div, "background-image", "url(" + /*url*/ ctx[6] + ")");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(68:4) {#each panels as { active, url, title }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let each_value = /*panels*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "gallery svelte-1rp1jls");
    			add_location(div, file$2, 66, 0, 1571);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*panels, handleClick*/ 3) {
    				each_value = /*panels*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Gallery", slots, []);
    	let { focus = null } = $$props;

    	let panels = [
    		{
    			active: false,
    			url: "img/01.jpg",
    			title: "Stadt"
    		},
    		{
    			active: false,
    			url: "img/rollstuhl_treppe.jpg",
    			title: "Chancen"
    		},
    		{
    			active: false,
    			url: "img/03.jpg",
    			title: "Welcome to the Future"
    		},
    		{
    			active: false,
    			url: "img/04.jpg",
    			title: "Risiken"
    		},
    		{
    			active: false,
    			url: "img/05.jpg",
    			title: "Technik"
    		}
    	];

    	function deactivateAll() {
    		panels.forEach(panel => {
    			panel.active = false;
    		});
    	}

    	function handleClick(index) {
    		console.log("click on panel ", index);
    		deactivateAll();
    		$$invalidate(0, panels[index].active = true, panels);
    		$$invalidate(2, focus = index);
    	}

    	const writable_props = ["focus"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Gallery> was created with unknown prop '${key}'`);
    	});

    	const click_handler = i => handleClick(i);

    	$$self.$$set = $$props => {
    		if ("focus" in $$props) $$invalidate(2, focus = $$props.focus);
    	};

    	$$self.$capture_state = () => ({
    		focus,
    		panels,
    		deactivateAll,
    		handleClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("focus" in $$props) $$invalidate(2, focus = $$props.focus);
    		if ("panels" in $$props) $$invalidate(0, panels = $$props.panels);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [panels, handleClick, focus, click_handler];
    }

    class Gallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { focus: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Gallery",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get focus() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focus(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Foot.svelte generated by Svelte v3.31.0 */

    const file$3 = "src/Foot.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let p0;
    	let span0;
    	let t1;
    	let t2;
    	let p1;
    	let span1;
    	let t3;
    	let t4;
    	let p2;
    	let span2;
    	let t6;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			span0 = element("span");
    			span0.textContent = "Lorem ipsum dolor";
    			t1 = text("\r\n        sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt\r\n        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud\r\n        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\r\n        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum\r\n        dolore eu fugiat nulla pariatur. Giuliano sint occaecat cupidatat non\r\n        proident, sunt in culpa qui officia deserunt mollit anim id. Duis aute\r\n        irure dolor in reprehenderit in voluptate velit esse cillum dolore eu\r\n        fugiat nulla pariatur. Giuliano sint occaecat cupidatat non proident,\r\n        sunt in culpa qui officia.");
    			t2 = space();
    			p1 = element("p");
    			span1 = element("span");
    			t3 = text("\r\n        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim\r\n        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\r\n        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate\r\n        velit esse cillum dolore eu fugiat nulla pariatur. Giuliano sint\r\n        occaecat cupidatat non proident, sunt in culpa qui officia deserunt\r\n        mollit anim id. Duis aute irure dolor in reprehenderit in voluptate\r\n        velit esse cillum dolore eu fugiat nulla pariatur. Giuliano sint\r\n        occaecat cupidatat non proident, sunt in culpa qui officia deserunt\r\n        mollit anim.");
    			t4 = space();
    			p2 = element("p");
    			span2 = element("span");
    			span2.textContent = "Kommentar";
    			t6 = text("\r\n        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\r\n        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim\r\n        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\r\n        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate\r\n        velit esse cillum dolore eu fugiat nulla pariatur. Giuliano sint\r\n        occaecat cupidatat non proident, sunt in culpa qui officia deserunt\r\n        mollit anim id. Duis aute irure dolor in reprehenderit in voluptate\r\n        velit esse cillum dolore eu fugiat nulla pariatur. Giuliano sint\r\n        occaecat cupidatat non proident, sunt in culpa qui officia deserunt\r\n        mollit anim.");
    			attr_dev(span0, "class", "subtitle svelte-ajc2g3");
    			add_location(span0, file$3, 14, 8, 208);
    			add_location(p0, file$3, 13, 4, 195);
    			attr_dev(span1, "class", "subtitle svelte-ajc2g3");
    			add_location(span1, file$3, 26, 8, 958);
    			add_location(p1, file$3, 25, 4, 945);
    			attr_dev(span2, "class", "subtitle svelte-ajc2g3");
    			add_location(span2, file$3, 39, 8, 1734);
    			add_location(p2, file$3, 38, 4, 1721);
    			attr_dev(div, "class", "svelte-ajc2g3");
    			add_location(div, file$3, 12, 0, 184);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(p0, span0);
    			append_dev(p0, t1);
    			append_dev(div, t2);
    			append_dev(div, p1);
    			append_dev(p1, span1);
    			append_dev(p1, t3);
    			append_dev(div, t4);
    			append_dev(div, p2);
    			append_dev(p2, span2);
    			append_dev(p2, t6);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Foot", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Foot> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Foot extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Foot",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    // start of file - elizadata.js

    var elizaInitials = [
    	"How do you do.  Please tell me your problem.",
    // additions (not original)
    	"Please tell me what's been bothering you.",
    	"Is something troubling you ?"
    ];

    var elizaFinals = [
    	"Goodbye.  It was nice talking to you.",
    // additions (not original)
    	"Goodbye.  This was really a nice talk.",
    	"Goodbye.  I'm looking forward to our next session.",
    	"This was a good session, wasn't it -- but time is over now.   Goodbye.",
    	"Maybe we could discuss this moreover in our next session ?   Goodbye."
    ];

    var elizaQuits = [
    	"bye",
    	"goodbye",
    	"done",
    	"exit",
    	"quit"
    ];

    var elizaPres = [
    	"dont", "don't",
    	"cant", "can't",
    	"wont", "won't",
    	"recollect", "remember",
    	"recall", "remember",
    	"dreamt", "dreamed",
    	"dreams", "dream",
    	"maybe", "perhaps",
    	"certainly", "yes",
    	"machine", "computer",
    	"machines", "computer",
    	"computers", "computer",
    	"were", "was",
    	"you're", "you are",
    	"i'm", "i am",
    	"same", "alike",
    	"identical", "alike",
    	"equivalent", "alike"
    ];

    var elizaPosts = [
    	"am", "are",
    	"your", "my",
    	"me", "you",
    	"myself", "yourself",
    	"yourself", "myself",
    	"i", "you",
    	"you", "I",
    	"my", "your",
    	"i'm", "you are"
    ];

    var elizaSynons = {
    	"be": ["am", "is", "are", "was"],
    	"belief": ["feel", "think", "believe", "wish"],
    	"cannot": ["can't"],
    	"desire": ["want", "need"],
    	"everyone": ["everybody", "nobody", "noone"],
    	"family": ["mother", "mom", "father", "dad", "sister", "brother", "wife", "children", "child"],
    	"happy": ["elated", "glad", "better"],
    	"sad": ["unhappy", "depressed", "sick"]
    };

    var elizaKeywords = [

    	/*
    	 Array of
    	 ["<key>", <rank>, [
    	 ["<decomp>", [
    	 "<reasmb>",
    	 "<reasmb>",
    	 "<reasmb>"
    	 ]],
    	 ["<decomp>", [
    	 "<reasmb>",
    	 "<reasmb>",
    	 "<reasmb>"
    	 ]]
    	 ]]
    	 */

    	["xnone", 0, [
    		["*", [
    			"I'm not sure I understand you fully.",
    			"Please go on.",
    			"What does that suggest to you ?",
    			"Do you feel strongly about discussing such things ?",
    			"That is interesting.  Please continue.",
    			"Tell me more about that.",
    			"Does talking about this bother you ?"
    		]]
    	]],
    	["sorry", 0, [
    		["*", [
    			"Please don't apologise.",
    			"Apologies are not necessary.",
    			"I've told you that apologies are not required.",
    			"It did not bother me.  Please continue."
    		]]
    	]],
    	["apologise", 0, [
    		["*", [
    			"goto sorry"
    		]]
    	]],
    	["remember", 5, [
    		["* i remember *", [
    			"Do you often think of (2) ?",
    			"Does thinking of (2) bring anything else to mind ?",
    			"What else do you recollect ?",
    			"Why do you remember (2) just now ?",
    			"What in the present situation reminds you of (2) ?",
    			"What is the connection between me and (2) ?",
    			"What else does (2) remind you of ?"
    		]],
    		["* do you remember *", [
    			"Did you think I would forget (2) ?",
    			"Why do you think I should recall (2) now ?",
    			"What about (2) ?",
    			"goto what",
    			"You mentioned (2) ?"
    		]],
    		["* you remember *", [
    			"How could I forget (2) ?",
    			"What about (2) should I remember ?",
    			"goto you"
    		]]
    	]],
    	["forget", 5, [
    		["* i forget *", [
    			"Can you think of why you might forget (2) ?",
    			"Why can't you remember (2) ?",
    			"How often do you think of (2) ?",
    			"Does it bother you to forget that ?",
    			"Could it be a mental block ?",
    			"Are you generally forgetful ?",
    			"Do you think you are suppressing (2) ?"
    		]],
    		["* did you forget *", [
    			"Why do you ask ?",
    			"Are you sure you told me ?",
    			"Would it bother you if I forgot (2) ?",
    			"Why should I recall (2) just now ?",
    			"goto what",
    			"Tell me more about (2)."
    		]]
    	]],
    	["if", 3, [
    		["* if *", [
    			"Do you think it's likely that (2) ?",
    			"Do you wish that (2) ?",
    			"What do you know about (2) ?",
    			"Really, if (2) ?",
    			"What would you do if (2) ?",
    			"But what are the chances that (2) ?",
    			"What does this speculation lead to ?"
    		]]
    	]],
    	["dreamed", 4, [
    		["* i dreamed *", [
    			"Really, (2) ?",
    			"Have you ever fantasized (2) while you were awake ?",
    			"Have you ever dreamed (2) before ?",
    			"goto dream"
    		]]
    	]],
    	["dream", 3, [
    		["*", [
    			"What does that dream suggest to you ?",
    			"Do you dream often ?",
    			"What persons appear in your dreams ?",
    			"Do you believe that dreams have something to do with your problem ?"
    		]]
    	]],
    	["perhaps", 0, [
    		["*", [
    			"You don't seem quite certain.",
    			"Why the uncertain tone ?",
    			"Can't you be more positive ?",
    			"You aren't sure ?",
    			"Don't you know ?",
    			"How likely, would you estimate ?"
    		]]
    	]],
    	["name", 15, [
    		["*", [
    			"I am not interested in names.",
    			"I've told you before, I don't care about names -- please continue."
    		]]
    	]],
    	["deutsch", 0, [
    		["*", [
    			"goto xforeign",
    			"I told you before, I don't understand German."
    		]]
    	]],
    	["francais", 0, [
    		["*", [
    			"goto xforeign",
    			"I told you before, I don't understand French."
    		]]
    	]],
    	["italiano", 0, [
    		["*", [
    			"goto xforeign",
    			"I told you before, I don't understand Italian."
    		]]
    	]],
    	["espanol", 0, [
    		["*", [
    			"goto xforeign",
    			"I told you before, I don't understand Spanish."
    		]]
    	]],
    	["xforeign", 0, [
    		["*", [
    			"I speak only English."
    		]]
    	]],
    	["hello", 0, [
    		["*", [
    			"How do you do.  Please state your problem.",
    			"Hi.  What seems to be your problem ?"
    		]]
    	]],
    	["computer", 50, [
    		["*", [
    			"Do computers worry you ?",
    			"Why do you mention computers ?",
    			"What do you think machines have to do with your problem ?",
    			"Don't you think computers can help people ?",
    			"What about machines worries you ?",
    			"What do you think about machines ?",
    			"You don't think I am a computer program, do you ?"
    		]]
    	]],
    	["am", 0, [
    		["* am i *", [
    			"Do you believe you are (2) ?",
    			"Would you want to be (2) ?",
    			"Do you wish I would tell you you are (2) ?",
    			"What would it mean if you were (2) ?",
    			"goto what"
    		]],
    		["* i am *", [
    			"goto i"
    		]],
    		["*", [
    			"Why do you say 'am' ?",
    			"I don't understand that."
    		]]
    	]],
    	["are", 0, [
    		["* are you *", [
    			"Why are you interested in whether I am (2) or not ?",
    			"Would you prefer if I weren't (2) ?",
    			"Perhaps I am (2) in your fantasies.",
    			"Do you sometimes think I am (2) ?",
    			"goto what",
    			"Would it matter to you ?",
    			"What if I were (2) ?"
    		]],
    		["* you are *", [
    			"goto you"
    		]],
    		["* are *", [
    			"Did you think they might not be (2) ?",
    			"Would you like it if they were not (2) ?",
    			"What if they were not (2) ?",
    			"Are they always (2) ?",
    			"Possibly they are (2).",
    			"Are you positive they are (2) ?"
    		]]
    	]],
    	["your", 0, [
    		["* your *", [
    			"Why are you concerned over my (2) ?",
    			"What about your own (2) ?",
    			"Are you worried about someone else's (2) ?",
    			"Really, my (2) ?",
    			"What makes you think of my (2) ?",
    			"Do you want my (2) ?"
    		]]
    	]],
    	["was", 2, [
    		["* was i *", [
    			"What if you were (2) ?",
    			"Do you think you were (2) ?",
    			"Were you (2) ?",
    			"What would it mean if you were (2) ?",
    			"What does ' (2) ' suggest to you ?",
    			"goto what"
    		]],
    		["* i was *", [
    			"Were you really ?",
    			"Why do you tell me you were (2) now ?",
    			"Perhaps I already know you were (2)."
    		]],
    		["* was you *", [
    			"Would you like to believe I was (2) ?",
    			"What suggests that I was (2) ?",
    			"What do you think ?",
    			"Perhaps I was (2).",
    			"What if I had been (2) ?"
    		]]
    	]],
    	["i", 0, [
    		["* i @desire *", [
    			"What would it mean to you if you got (3) ?",
    			"Why do you want (3) ?",
    			"Suppose you got (3) soon.",
    			"What if you never got (3) ?",
    			"What would getting (3) mean to you ?",
    			"What does wanting (3) have to do with this discussion ?"
    		]],
    		["* i am* @sad *", [
    			"I am sorry to hear that you are (3).",
    			"Do you think coming here will help you not to be (3) ?",
    			"I'm sure it's not pleasant to be (3).",
    			"Can you explain what made you (3) ?"
    		]],
    		["* i am* @happy *", [
    			"How have I helped you to be (3) ?",
    			"Has your treatment made you (3) ?",
    			"What makes you (3) just now ?",
    			"Can you explain why you are suddenly (3) ?"
    		]],
    		["* i was *", [
    			"goto was"
    		]],
    		["* i @belief i *", [
    			"Do you really think so ?",
    			"But you are not sure you (3).",
    			"Do you really doubt you (3) ?"
    		]],
    		["* i* @belief *you *", [
    			"goto you"
    		]],
    		["* i am *", [
    			"Is it because you are (2) that you came to me ?",
    			"How long have you been (2) ?",
    			"Do you believe it is normal to be (2) ?",
    			"Do you enjoy being (2) ?",
    			"Do you know anyone else who is (2) ?"
    		]],
    		["* i @cannot *", [
    			"How do you know that you can't (3) ?",
    			"Have you tried ?",
    			"Perhaps you could (3) now.",
    			"Do you really want to be able to (3) ?",
    			"What if you could (3) ?"
    		]],
    		["* i don't *", [
    			"Don't you really (2) ?",
    			"Why don't you (2) ?",
    			"Do you wish to be able to (2) ?",
    			"Does that trouble you ?"
    		]],
    		["* i feel *", [
    			"Tell me more about such feelings.",
    			"Do you often feel (2) ?",
    			"Do you enjoy feeling (2) ?",
    			"Of what does feeling (2) remind you ?"
    		]],
    		["* i * you *", [
    			"Perhaps in your fantasies we (2) each other.",
    			"Do you wish to (2) me ?",
    			"You seem to need to (2) me.",
    			"Do you (2) anyone else ?"
    		]],
    		["*", [
    			"You say (1) ?",
    			"Can you elaborate on that ?",
    			"Do you say (1) for some special reason ?",
    			"That's quite interesting."
    		]]
    	]],
    	["you", 0, [
    		["* you remind me of *", [
    			"goto alike"
    		]],
    		["* you are *", [
    			"What makes you think I am (2) ?",
    			"Does it please you to believe I am (2) ?",
    			"Do you sometimes wish you were (2) ?",
    			"Perhaps you would like to be (2)."
    		]],
    		["* you* me *", [
    			"Why do you think I (2) you ?",
    			"You like to think I (2) you -- don't you ?",
    			"What makes you think I (2) you ?",
    			"Really, I (2) you ?",
    			"Do you wish to believe I (2) you ?",
    			"Suppose I did (2) you -- what would that mean ?",
    			"Does someone else believe I (2) you ?"
    		]],
    		["* you *", [
    			"We were discussing you -- not me.",
    			"Oh, I (2) ?",
    			"You're not really talking about me -- are you ?",
    			"What are your feelings now ?"
    		]]
    	]],
    	["yes", 0, [
    		["*", [
    			"You seem to be quite positive.",
    			"You are sure.",
    			"I see.",
    			"I understand."
    		]]
    	]],
    	["no", 0, [
    		["* no one *", [
    			"Are you sure, no one (2) ?",
    			"Surely someone (2) .",
    			"Can you think of anyone at all ?",
    			"Are you thinking of a very special person ?",
    			"Who, may I ask ?",
    			"You have a particular person in mind, don't you ?",
    			"Who do you think you are talking about ?"
    		]],
    		["*", [
    			"Are you saying no just to be negative?",
    			"You are being a bit negative.",
    			"Why not ?",
    			"Why 'no' ?"
    		]]
    	]],
    	["my", 2, [
    		["$ * my *", [
    			"Does that have anything to do with the fact that your (2) ?",
    			"Lets discuss further why your (2).",
    			"Earlier you said your (2).",
    			"But your (2)."
    		]],
    		["* my* @family *", [
    			"Tell me more about your family.",
    			"Who else in your family (4) ?",
    			"Your (3) ?",
    			"What else comes to your mind when you think of your (3) ?"
    		]],
    		["* my *", [
    			"Your (2) ?",
    			"Why do you say your (2) ?",
    			"Does that suggest anything else which belongs to you ?",
    			"Is it important to you that your (2) ?"
    		]]
    	]],
    	["can", 0, [
    		["* can you *", [
    			"You believe I can (2) don't you ?",
    			"goto what",
    			"You want me to be able to (2).",
    			"Perhaps you would like to be able to (2) yourself."
    		]],
    		["* can i *", [
    			"Whether or not you can (2) depends on you more than on me.",
    			"Do you want to be able to (2) ?",
    			"Perhaps you don't want to (2).",
    			"goto what"
    		]]
    	]],
    	["what", 0, [
    		["*", [
    			"Why do you ask ?",
    			"Does that question interest you ?",
    			"What is it you really want to know ?",
    			"Are such questions much on your mind ?",
    			"What answer would please you most ?",
    			"What do you think ?",
    			"What comes to mind when you ask that ?",
    			"Have you asked such questions before ?",
    			"Have you asked anyone else ?"
    		]]
    	]],
    	["who", 0, [
    		["who *", [
    			"goto what"
    		]]
    	]],
    	["when", 0, [
    		["when *", [
    			"goto what"
    		]]
    	]],
    	["where", 0, [
    		["where *", [
    			"goto what"
    		]]
    	]],
    	["how", 0, [
    		["how *", [
    			"goto what"
    		]]
    	]],
    	["because", 0, [
    		["*", [
    			"Is that the real reason ?",
    			"Don't any other reasons come to mind ?",
    			"Does that reason seem to explain anything else ?",
    			"What other reasons might there be ?"
    		]]
    	]],
    	["why", 0, [
    		["* why don't you *", [
    			"Do you believe I don't (2) ?",
    			"Perhaps I will (2) in good time.",
    			"Should you (2) yourself ?",
    			"You want me to (2) ?",
    			"goto what"
    		]],
    		["* why can't i *", [
    			"Do you think you should be able to (2) ?",
    			"Do you want to be able to (2) ?",
    			"Do you believe this will help you to (2) ?",
    			"Have you any idea why you can't (2) ?",
    			"goto what"
    		]],
    		["*", [
    			"goto what"
    		]]
    	]],
    	["everyone", 2, [
    		["* @everyone *", [
    			"Really, (2) ?",
    			"Surely not (2).",
    			"Can you think of anyone in particular ?",
    			"Who, for example?",
    			"Are you thinking of a very special person ?",
    			"Who, may I ask ?",
    			"Someone special perhaps ?",
    			"You have a particular person in mind, don't you ?",
    			"Who do you think you're talking about ?"
    		]]
    	]],
    	["everybody", 2, [
    		["*", [
    			"goto everyone"
    		]]
    	]],
    	["nobody", 2, [
    		["*", [
    			"goto everyone"
    		]]
    	]],
    	["noone", 2, [
    		["*", [
    			"goto everyone"
    		]]
    	]],
    	["always", 1, [
    		["*", [
    			"Can you think of a specific example ?",
    			"When ?",
    			"What incident are you thinking of ?",
    			"Really, always ?"
    		]]
    	]],
    	["alike", 10, [
    		["*", [
    			"In what way ?",
    			"What resemblence do you see ?",
    			"What does that similarity suggest to you ?",
    			"What other connections do you see ?",
    			"What do you suppose that resemblence means ?",
    			"What is the connection, do you suppose ?",
    			"Could there really be some connection ?",
    			"How ?"
    		]]
    	]],
    	["like", 10, [
    		["* @be *like *", [
    			"goto alike"
    		]]
    	]],
    	["different", 0, [
    		["*", [
    			"How is it different ?",
    			"What differences do you see ?",
    			"What does that difference suggest to you ?",
    			"What other distinctions do you see ?",
    			"What do you suppose that disparity means ?",
    			"Could there be some connection, do you suppose ?",
    			"How ?"
    		]]
    	]]

    ];

    // regexp/replacement pairs to be performed as final cleanings
    // here: cleanings for multiple bots talking to each other
    var elizaPostTransforms = [
    	/ old old/g, " old",
    	/\bthey were( not)? me\b/g, "it was$1 me",
    	/\bthey are( not)? me\b/g, "it is$1 me",
    	/Are they( always)? me\b/, "it is$1 me",
    	/\bthat your( own)? (\w+)( now)? \?/, "that you have your$1 $2 ?",
    	/\bI to have (\w+)/, "I have $1",
    	/Earlier you said your( own)? (\w+)( now)?\./, "Earlier you talked about your $2."
    ];

    // eof

    var elizadata = {
    	elizaInitials: elizaInitials,
    	elizaFinals: elizaFinals,
    	elizaQuits: elizaQuits,
    	elizaPres: elizaPres,
    	elizaPosts: elizaPosts,
    	elizaSynons: elizaSynons,
    	elizaKeywords: elizaKeywords,
    	elizaPostTransforms: elizaPostTransforms
    };

    function ElizaBot(noRandomFlag) {
    	this.noRandom= (noRandomFlag)? true:false;
    	this.capitalizeFirstLetter=true;
    	this.debug=false;
    	this.memSize=20;
    	this.version="1.1 (original)";
    	if (!this._dataParsed) this._init();
    	this.reset();
    }

    ElizaBot.prototype.reset = function() {
    	this.quit=false;
    	this.mem=[];
    	this.lastchoice=[];
    	for (var k=0; k<elizadata.elizaKeywords.length; k++) {
    		this.lastchoice[k]=[];
    		var rules=elizadata.elizaKeywords[k][2];
    		for (var i=0; i<rules.length; i++) this.lastchoice[k][i]=-1;
    	}
    };

    ElizaBot.prototype._dataParsed = false;

    ElizaBot.prototype._init = function() {
    	// parse data and convert it from canonical form to internal use
    	// produce synonym list
    	var synPatterns={};
    	if ((elizadata.elizaSynons) && (typeof elizadata.elizaSynons == 'object')) {
    		for (var i in elizadata.elizaSynons) synPatterns[i]='('+i+'|'+elizadata.elizaSynons[i].join('|')+')';
    	}
    	// check for keywords or install empty structure to prevent any errors
    	if ((!elizadata.elizaKeywords) || (typeof elizadata.elizaKeywords.length == 'undefined')) {
    		elizadata.elizaKeywords=[['###',0,[['###',[]]]]];
    	}
    	// 1st convert rules to regexps
    	// expand synonyms and insert asterisk expressions for backtracking
    	var sre=/@(\S+)/;
    	var are=/(\S)\s*\*\s*(\S)/;
    	var are1=/^\s*\*\s*(\S)/;
    	var are2=/(\S)\s*\*\s*$/;
    	var are3=/^\s*\*\s*$/;
    	var wsre=/\s+/g;
    	for (var k=0; k<elizadata.elizaKeywords.length; k++) {
    		var rules=elizadata.elizaKeywords[k][2];
    		elizadata.elizaKeywords[k][3]=k; // save original index for sorting
    		for (var i=0; i<rules.length; i++) {
    			var r=rules[i];
    			// check mem flag and store it as decomp's element 2
    			if (r[0].charAt(0)=='$') {
    				var ofs=1;
    				while (r[0].charAt[ofs]==' ') ofs++;
    				r[0]=r[0].substring(ofs);
    				r[2]=true;
    			}
    			else {
    				r[2]=false;
    			}
    			// expand synonyms (v.1.1: work around lambda function)
    			var m=sre.exec(r[0]);
    			while (m) {
    				var sp=(synPatterns[m[1]])? synPatterns[m[1]]:m[1];
    				r[0]=r[0].substring(0,m.index)+sp+r[0].substring(m.index+m[0].length);
    				m=sre.exec(r[0]);
    			}
    			// expand asterisk expressions (v.1.1: work around lambda function)
    			if (are3.test(r[0])) {
    				r[0]='\\s*(.*)\\s*';
    			}
    			else {
    				m=are.exec(r[0]);
    				if (m) {
    					var lp='';
    					var rp=r[0];
    					while (m) {
    						lp+=rp.substring(0,m.index+1);
    						if (m[1]!=')') lp+='\\b';
    						lp+='\\s*(.*)\\s*';
    						if ((m[2]!='(') && (m[2]!='\\')) lp+='\\b';
    						lp+=m[2];
    						rp=rp.substring(m.index+m[0].length);
    						m=are.exec(rp);
    					}
    					r[0]=lp+rp;
    				}
    				m=are1.exec(r[0]);
    				if (m) {
    					var lp='\\s*(.*)\\s*';
    					if ((m[1]!=')') && (m[1]!='\\')) lp+='\\b';
    					r[0]=lp+r[0].substring(m.index-1+m[0].length);
    				}
    				m=are2.exec(r[0]);
    				if (m) {
    					var lp=r[0].substring(0,m.index+1);
    					if (m[1]!='(') lp+='\\b';
    					r[0]=lp+'\\s*(.*)\\s*';
    				}
    			}
    			// expand white space
    			r[0]=r[0].replace(wsre, '\\s+');
    			wsre.lastIndex=0;
    		}
    	}
    	// now sort keywords by rank (highest first)
    	elizadata.elizaKeywords.sort(this._sortKeywords);
    	// and compose regexps and refs for pres and posts
    	ElizaBot.prototype.pres={};
    	ElizaBot.prototype.posts={};
    	if ((elizadata.elizaPres) && (elizadata.elizaPres.length)) {
    		var a=new Array();
    		for (var i=0; i<elizadata.elizaPres.length; i+=2) {
    			a.push(elizadata.elizaPres[i]);
    			ElizaBot.prototype.pres[elizadata.elizaPres[i]]=elizadata.elizaPres[i+1];
    		}
    		ElizaBot.prototype.preExp = new RegExp('\\b('+a.join('|')+')\\b');
    	}
    	else {
    		// default (should not match)
    		ElizaBot.prototype.preExp = /####/;
    		ElizaBot.prototype.pres['####']='####';
    	}
    	if ((elizadata.elizaPosts) && (elizadata.elizaPosts.length)) {
    		var a=new Array();
    		for (var i=0; i<elizadata.elizaPosts.length; i+=2) {
    			a.push(elizadata.elizaPosts[i]);
    			ElizaBot.prototype.posts[elizadata.elizaPosts[i]]=elizadata.elizaPosts[i+1];
    		}
    		ElizaBot.prototype.postExp = new RegExp('\\b('+a.join('|')+')\\b');
    	}
    	else {
    		// default (should not match)
    		ElizaBot.prototype.postExp = /####/;
    		ElizaBot.prototype.posts['####']='####';
    	}
    	// check for elizaQuits and install default if missing
    	if ((!elizadata.elizaQuits) || (typeof elizadata.elizaQuits.length == 'undefined')) {
    		elizadata.elizaQuits=[];
    	}
    	// done
    	ElizaBot.prototype._dataParsed=true;
    };

    ElizaBot.prototype._sortKeywords = function(a,b) {
    	// sort by rank
    	if (a[1]>b[1]) return -1
    	else if (a[1]<b[1]) return 1
    	// or original index
    	else if (a[3]>b[3]) return 1
    	else if (a[3]<b[3]) return -1
    	else return 0;
    };

    ElizaBot.prototype.transform = function(text) {
    	var rpl='';
    	this.quit=false;
    	// unify text string
    	text=text.toLowerCase();
    	text=text.replace(/@#\$%\^&\*\(\)_\+=~`\{\[\}\]\|:;<>\/\\\t/g, ' ');
    	text=text.replace(/\s+-+\s+/g, '.');
    	text=text.replace(/\s*[,\.\?!;]+\s*/g, '.');
    	text=text.replace(/\s*\bbut\b\s*/g, '.');
    	text=text.replace(/\s{2,}/g, ' ');
    	// split text in part sentences and loop through them
    	var parts=text.split('.');
    	for (var i=0; i<parts.length; i++) {
    		var part=parts[i];
    		if (part!='') {
    			// check for quit expression
    			for (var q=0; q<elizadata.elizaQuits.length; q++) {
    				if (elizadata.elizaQuits[q]==part) {
    					this.quit=true;
    					return this.getFinal();
    				}
    			}
    			// preprocess (v.1.1: work around lambda function)
    			var m=this.preExp.exec(part);
    			if (m) {
    				var lp='';
    				var rp=part;
    				while (m) {
    					lp+=rp.substring(0,m.index)+this.pres[m[1]];
    					rp=rp.substring(m.index+m[0].length);
    					m=this.preExp.exec(rp);
    				}
    				part=lp+rp;
    			}
    			this.sentence=part;
    			// loop trough keywords
    			for (var k=0; k<elizadata.elizaKeywords.length; k++) {
    				if (part.search(new RegExp('\\b'+elizadata.elizaKeywords[k][0]+'\\b', 'i'))>=0) {
    					rpl = this._execRule(k);
    				}
    				if (rpl!='') return rpl;
    			}
    		}
    	}
    	// nothing matched try mem
    	rpl=this._memGet();
    	// if nothing in mem, so try xnone
    	if (rpl=='') {
    		this.sentence=' ';
    		var k=this._getRuleIndexByKey('xnone');
    		if (k>=0) rpl=this._execRule(k);
    	}
    	// return reply or default string
    	return (rpl!='')? rpl : 'I am at a loss for words.';
    };

    ElizaBot.prototype._execRule = function(k) {
    	var rule=elizadata.elizaKeywords[k];
    	var decomps=rule[2];
    	var paramre=/\(([0-9]+)\)/;
    	for (var i=0; i<decomps.length; i++) {
    		var m=this.sentence.match(decomps[i][0]);
    		if (m!=null) {
    			var reasmbs=decomps[i][1];
    			var memflag=decomps[i][2];
    			var ri= (this.noRandom)? 0 : Math.floor(Math.random()*reasmbs.length);
    			if (((this.noRandom) && (this.lastchoice[k][i]>ri)) || (this.lastchoice[k][i]==ri)) {
    				ri= ++this.lastchoice[k][i];
    				if (ri>=reasmbs.length) {
    					ri=0;
    					this.lastchoice[k][i]=-1;
    				}
    			}
    			else {
    				this.lastchoice[k][i]=ri;
    			}
    			var rpl=reasmbs[ri];
    			if (this.debug) alert('match:\nkey: '+elizadata.elizaKeywords[k][0]+
    				'\nrank: '+elizadata.elizaKeywords[k][1]+
    				'\ndecomp: '+decomps[i][0]+
    				'\nreasmb: '+rpl+
    				'\nmemflag: '+memflag);
    			if (rpl.search('^goto ', 'i')==0) {
    				var ki=this._getRuleIndexByKey(rpl.substring(5));
    				if (ki>=0) return this._execRule(ki);
    			}
    			// substitute positional params (v.1.1: work around lambda function)
    			var m1=paramre.exec(rpl);
    			if (m1) {
    				var lp='';
    				var rp=rpl;
    				while (m1) {
    					var param = m[parseInt(m1[1])];
    					// postprocess param
    					var m2=this.postExp.exec(param);
    					if (m2) {
    						var lp2='';
    						var rp2=param;
    						while (m2) {
    							lp2+=rp2.substring(0,m2.index)+this.posts[m2[1]];
    							rp2=rp2.substring(m2.index+m2[0].length);
    							m2=this.postExp.exec(rp2);
    						}
    						param=lp2+rp2;
    					}
    					lp+=rp.substring(0,m1.index)+param;
    					rp=rp.substring(m1.index+m1[0].length);
    					m1=paramre.exec(rp);
    				}
    				rpl=lp+rp;
    			}
    			rpl=this._postTransform(rpl);
    			if (memflag) this._memSave(rpl);
    			else return rpl;
    		}
    	}
    	return '';
    };

    ElizaBot.prototype._postTransform = function(s) {
    	// final cleanings
    	s=s.replace(/\s{2,}/g, ' ');
    	s=s.replace(/\s+\./g, '.');
    	if ((elizadata.elizaPostTransforms) && (elizadata.elizaPostTransforms.length)) {
    		for (var i=0; i<elizadata.elizaPostTransforms.length; i+=2) {
    			s=s.replace(elizadata.elizaPostTransforms[i], elizadata.elizaPostTransforms[i+1]);
    			elizadata.elizaPostTransforms[i].lastIndex=0;
    		}
    	}
    	// capitalize first char (v.1.1: work around lambda function)
    	if (this.capitalizeFirstLetter) {
    		var re=/^([a-z])/;
    		var m=re.exec(s);
    		if (m) s=m[0].toUpperCase()+s.substring(1);
    	}
    	return s;
    };

    ElizaBot.prototype._getRuleIndexByKey = function(key) {
    	for (var k=0; k<elizadata.elizaKeywords.length; k++) {
    		if (elizadata.elizaKeywords[k][0]==key) return k;
    	}
    	return -1;
    };

    ElizaBot.prototype._memSave = function(t) {
    	this.mem.push(t);
    	if (this.mem.length>this.memSize) this.mem.shift();
    };

    ElizaBot.prototype._memGet = function() {
    	if (this.mem.length) {
    		if (this.noRandom) return this.mem.shift();
    		else {
    			var n=Math.floor(Math.random()*this.mem.length);
    			var rpl=this.mem[n];
    			for (var i=n+1; i<this.mem.length; i++) this.mem[i-1]=this.mem[i];
    			this.mem.length--;
    			return rpl;
    		}
    	}
    	else return '';
    };

    ElizaBot.prototype.getFinal = function() {
    	if (!elizadata.elizaFinals) return '';
    	return elizadata.elizaFinals[Math.floor(Math.random()*elizadata.elizaFinals.length)];
    };

    ElizaBot.prototype.getInitial = function() {
    	if (!elizadata.elizaInitials) return '';
    	return elizadata.elizaInitials[Math.floor(Math.random()*elizadata.elizaInitials.length)];
    };


    // fix array.prototype methods (push, shift) if not implemented (MSIE fix)
    if (typeof Array.prototype.push == 'undefined') {
    	Array.prototype.push=function(v) { return this[this.length]=v; };
    }
    if (typeof Array.prototype.shift == 'undefined') {
    	Array.prototype.shift=function() {
    		if (this.length==0) return null;
    		var e0=this[0];
    		for (var i=1; i<this.length; i++) this[i-1]=this[i];
    		this.length--;
    		return e0;
    	};
    }

    var elizabot = ElizaBot;

    /* src/Eliza.svelte generated by Svelte v3.31.0 */
    const file$4 = "src/Eliza.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (107:8) {#each comments as comment}
    function create_each_block$1(ctx) {
    	let article;
    	let span;
    	let t0_value = /*comment*/ ctx[6].text + "";
    	let t0;
    	let t1;
    	let article_class_value;

    	const block = {
    		c: function create() {
    			article = element("article");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(span, "class", "svelte-dtvy0u");
    			add_location(span, file$4, 108, 16, 2588);
    			attr_dev(article, "class", article_class_value = "" + (null_to_empty(/*comment*/ ctx[6].author) + " svelte-dtvy0u"));
    			add_location(article, file$4, 107, 12, 2538);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, span);
    			append_dev(span, t0);
    			append_dev(article, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*comments*/ 2 && t0_value !== (t0_value = /*comment*/ ctx[6].text + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*comments*/ 2 && article_class_value !== (article_class_value = "" + (null_to_empty(/*comment*/ ctx[6].author) + " svelte-dtvy0u"))) {
    				attr_dev(article, "class", article_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(107:8) {#each comments as comment}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let div0;
    	let t2;
    	let input;
    	let mounted;
    	let dispose;
    	let each_value = /*comments*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Konversation";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			input = element("input");
    			add_location(h1, file$4, 103, 4, 2418);
    			attr_dev(div0, "class", "scrollable svelte-dtvy0u");
    			add_location(div0, file$4, 105, 4, 2447);
    			add_location(input, file$4, 113, 4, 2676);
    			attr_dev(div1, "class", "chat svelte-dtvy0u");
    			add_location(div1, file$4, 102, 0, 2394);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			/*div0_binding*/ ctx[3](div0);
    			append_dev(div1, t2);
    			append_dev(div1, input);

    			if (!mounted) {
    				dispose = listen_dev(input, "keydown", /*handleKeydown*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*comments*/ 2) {
    				each_value = /*comments*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			/*div0_binding*/ ctx[3](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Eliza", slots, []);
    	let div;
    	let autoscroll;

    	beforeUpdate(() => {
    		autoscroll = div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
    	});

    	afterUpdate(() => {
    		if (autoscroll) div.scrollTo(0, div.scrollHeight);
    	});

    	const eliza = new elizabot();

    	let comments = [
    		{
    			author: "eliza",
    			text: eliza.getInitial()
    		}
    	];

    	function handleKeydown(event) {
    		if (event.key === "Enter") {
    			const text = event.target.value;
    			if (!text) return;
    			$$invalidate(1, comments = comments.concat({ author: "user", text }));
    			event.target.value = "";
    			const reply = eliza.transform(text);

    			setTimeout(
    				() => {
    					$$invalidate(1, comments = comments.concat({
    						author: "eliza",
    						text: "...",
    						placeholder: true
    					}));

    					setTimeout(
    						() => {
    							$$invalidate(1, comments = comments.filter(comment => !comment.placeholder).concat({ author: "eliza", text: reply }));
    						},
    						500 + Math.random() * 500
    					);
    				},
    				200 + Math.random() * 200
    			);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Eliza> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			div = $$value;
    			$$invalidate(0, div);
    		});
    	}

    	$$self.$capture_state = () => ({
    		Eliza: elizabot,
    		beforeUpdate,
    		afterUpdate,
    		div,
    		autoscroll,
    		eliza,
    		comments,
    		handleKeydown
    	});

    	$$self.$inject_state = $$props => {
    		if ("div" in $$props) $$invalidate(0, div = $$props.div);
    		if ("autoscroll" in $$props) autoscroll = $$props.autoscroll;
    		if ("comments" in $$props) $$invalidate(1, comments = $$props.comments);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [div, comments, handleKeydown, div0_binding];
    }

    class Eliza_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Eliza_1",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Side0.svelte generated by Svelte v3.31.0 */

    const file$5 = "src/Side0.svelte";

    function create_fragment$5(ctx) {
    	let h2;
    	let t1;
    	let p0;
    	let t3;
    	let p1;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Dreams";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "One morning, when Gregor Samsa woke from troubled dreams, he found himself\r\n    transformed in his bed into a horrible vermin. He lay on his armour-like\r\n    back, and if he lifted his head a little he could see his brown belly,\r\n    slightly domed and divided by arches into stiff sections. The bedding was\r\n    hardly able to cover it and seemed ready to slide off any moment. His many\r\n    legs, pitifully thin compared with the size of the rest of him, waved about\r\n    helplessly as he looked. \"What's happened to me?\" he thought.";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "It wasn't a dream. His room, a proper human room although a little too\r\n    small, lay peacefully between its four familiar walls. A collection of\r\n    textile samples lay spread out on the table - Samsa was a travelling\r\n    salesman - and above it there hung a picture that he had recently cut out of\r\n    an illustrated magazine and housed in a nice, gilded frame. It showed a lady\r\n    fitted out with a fur hat and fur boa who sat upright, raising a heavy fur\r\n    muff that covered the whole of her lower arm towards the viewer. Gregor then\r\n    turned to look out the window at the dull weather. Drops";
    			add_location(h2, file$5, 6, 0, 67);
    			attr_dev(p0, "class", "svelte-1b219xh");
    			add_location(p0, file$5, 7, 0, 84);
    			attr_dev(p1, "class", "svelte-1b219xh");
    			add_location(p1, file$5, 16, 0, 636);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Side0", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Side0> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Side0 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Side0",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Side2.svelte generated by Svelte v3.31.0 */

    const file$6 = "src/Side2.svelte";

    function create_fragment$6(ctx) {
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let p2;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			p0.textContent = "The European languages are members of the same family. Their separate\r\n    existence is a myth. For science, music, sport, etc, Europe uses the same\r\n    vocabulary. The languages only differ in their grammar, their pronunciation\r\n    and their most common words. Everyone realizes why a new common language\r\n    would be desirable: one could refuse to pay expensive translators. To\r\n    achieve this, it would be necessary to have uniform grammar, pronunciation\r\n    and more common words.";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "If several languages coalesce, the grammar of the resulting language is more\r\n    simple and regular than that of the individual languages. The new common\r\n    language will be more simple and regular than the existing European\r\n    languages. It will be as simple as Occidental; in fact, it will be\r\n    Occidental. To an English person, it will seem like simplified English, as a\r\n    skeptical Cambridge friend of mine told me what Occidental is.The European\r\n    languages are members of the same family.";
    			t3 = space();
    			p2 = element("p");
    			p2.textContent = "Their separate existence is a myth. For science, music, sport, etc, Europe\r\n    uses the same vocabulary. The languages only differ in their grammar, their\r\n    pronunciation and their most common words. Everyone realizes why a new\r\n    common language would be desirable: one could refuse to pay expensive\r\n    translators.";
    			add_location(p0, file$6, 0, 0, 0);
    			add_location(p1, file$6, 10, 0, 509);
    			add_location(p2, file$6, 20, 0, 1036);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p2, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Side2", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Side2> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Side2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Side2",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Side3.svelte generated by Svelte v3.31.0 */

    const file$7 = "src/Side3.svelte";

    function create_fragment$7(ctx) {
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let p2;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			p0.textContent = "A wonderful serenity has taken possession of my entire soul, like these\r\n    sweet mornings of spring which I enjoy with my whole heart. I am alone, and\r\n    feel the charm of existence in this spot, which was created for the bliss of\r\n    souls like mine. I am so happy, my dear friend, so absorbed in the exquisite\r\n    sense of mere tranquil existence, that I neglect my talents.";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "I should be incapable of drawing a single stroke at the present moment; and\r\n    yet I feel that I never was a greater artist than now. When, while the\r\n    lovely valley teems with vapour around me, and the meridian sun strikes the\r\n    upper surface of the impenetrable foliage of my trees, and but a few stray\r\n    gleams steal into the inner sanctuary.";
    			t3 = space();
    			p2 = element("p");
    			p2.textContent = "I throw myself down among the tall grass by the trickling stream; and, as I\r\n    lie close to the earth, a thousand unknown plants are noticed by me: when I\r\n    hear the buzz of the little world among the stalks, and grow familiar with\r\n    the countless indescribable forms of the insects and flies, then I feel the\r\n    presence of the Almighty, who formed us in his own image, and the breath";
    			add_location(p0, file$7, 0, 0, 0);
    			add_location(p1, file$7, 8, 0, 401);
    			add_location(p2, file$7, 16, 0, 776);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p2, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Side3", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Side3> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Side3 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Side3",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/Side4.svelte generated by Svelte v3.31.0 */

    const file$8 = "src/Side4.svelte";

    function create_fragment$8(ctx) {
    	let p0;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let p1;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			p0.textContent = "Far far away, behind the word mountains, far from the countries Vokalia and\r\n    Consonantia, there live the blind texts. Separated they live in\r\n    Bookmarksgrove right at the coast of the Semantics, a large language ocean.\r\n    A small river named Duden flows by their place and supplies it with the\r\n    necessary regelialia. It is a paradisematic country, in which roasted parts\r\n    of sentences fly into your mouth. Even the all-powerful Pointing has no\r\n    control about the blind texts it is an almost unorthographic life One day\r\n    however a small line of blind text by the name of Lorem Ipsum decided to\r\n    leave for the far World of Grammar.";
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "The Big Oxmox advised her not to do so, because there were thousands of bad\r\n    Commas, wild Question Marks and devious Semikoli, but the Little Blind Text\r\n    didn’t listen. She packed her seven versalia, put her initial into the belt\r\n    and made herself on the way. When she reached the first hills of the Italic\r\n    Mountains, she had a last view back on the skyline of her hometown\r\n    Bookmarksgrove, the headline of Alphabet Village and the subline of her own\r\n    road, the Line Lane. Pityful a rethoric question ran over her cheek, then";
    			add_location(p0, file$8, 7, 0, 84);
    			if (img.src !== (img_src_value = "img/u01.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "2021");
    			attr_dev(img, "class", "svelte-kqbwmn");
    			add_location(img, file$8, 19, 0, 761);
    			add_location(p1, file$8, 21, 0, 801);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, img, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Side4", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Side4> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Side4 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Side4",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.31.0 */
    const file$9 = "src/App.svelte";

    // (102:2) {:else}
    function create_else_block(ctx) {
    	let h2;
    	let t;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(/*hmm*/ ctx[1]);
    			add_location(h2, file$9, 102, 3, 3469);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hmm*/ 2) set_data_dev(t, /*hmm*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(102:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (98:27) 
    function create_if_block_4(ctx) {
    	let div;
    	let side4;
    	let div_intro;
    	let current;
    	side4 = new Side4({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(side4.$$.fragment);
    			add_location(div, file$9, 98, 3, 3391);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(side4, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(side4.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: /*fadeInTime*/ ctx[2] });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(side4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(side4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(98:27) ",
    		ctx
    	});

    	return block;
    }

    // (94:27) 
    function create_if_block_3(ctx) {
    	let div;
    	let side3;
    	let div_intro;
    	let current;
    	side3 = new Side3({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(side3.$$.fragment);
    			add_location(div, file$9, 94, 3, 3295);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(side3, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(side3.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: /*fadeInTime*/ ctx[2] });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(side3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(side3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(94:27) ",
    		ctx
    	});

    	return block;
    }

    // (90:27) 
    function create_if_block_2(ctx) {
    	let div;
    	let side2;
    	let div_intro;
    	let current;
    	side2 = new Side2({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(side2.$$.fragment);
    			add_location(div, file$9, 90, 3, 3199);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(side2, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(side2.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: /*fadeInTime*/ ctx[2] });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(side2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(side2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(90:27) ",
    		ctx
    	});

    	return block;
    }

    // (86:27) 
    function create_if_block_1(ctx) {
    	let div;
    	let eliza;
    	let div_intro;
    	let current;
    	eliza = new Eliza_1({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(eliza.$$.fragment);
    			add_location(div, file$9, 86, 3, 3103);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(eliza, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(eliza.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: /*fadeInTime*/ ctx[2] });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(eliza.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(eliza);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(86:27) ",
    		ctx
    	});

    	return block;
    }

    // (82:2) {#if img_focus == 0}
    function create_if_block(ctx) {
    	let div;
    	let side0;
    	let div_intro;
    	let current;
    	side0 = new Side0({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(side0.$$.fragment);
    			add_location(div, file$9, 82, 3, 3007);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(side0, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(side0.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: /*fadeInTime*/ ctx[2] });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(side0.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(side0);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(82:2) {#if img_focus == 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div5;
    	let div0;
    	let title;
    	let t0;
    	let div1;
    	let head;
    	let t1;
    	let div2;
    	let gallery;
    	let updating_focus;
    	let t2;
    	let div3;
    	let foot;
    	let t3;
    	let div4;
    	let current_block_type_index;
    	let if_block;
    	let div4_class_value;
    	let current;
    	title = new Title({ $$inline: true });
    	head = new Head({ $$inline: true });

    	function gallery_focus_binding(value) {
    		/*gallery_focus_binding*/ ctx[3].call(null, value);
    	}

    	let gallery_props = {};

    	if (/*img_focus*/ ctx[0] !== void 0) {
    		gallery_props.focus = /*img_focus*/ ctx[0];
    	}

    	gallery = new Gallery({ props: gallery_props, $$inline: true });
    	binding_callbacks.push(() => bind(gallery, "focus", gallery_focus_binding));
    	foot = new Foot({ $$inline: true });

    	const if_block_creators = [
    		create_if_block,
    		create_if_block_1,
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_4,
    		create_else_block
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*img_focus*/ ctx[0] == 0) return 0;
    		if (/*img_focus*/ ctx[0] == 1) return 1;
    		if (/*img_focus*/ ctx[0] == 2) return 2;
    		if (/*img_focus*/ ctx[0] == 3) return 3;
    		if (/*img_focus*/ ctx[0] == 4) return 4;
    		return 5;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			create_component(title.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(head.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			create_component(gallery.$$.fragment);
    			t2 = space();
    			div3 = element("div");
    			create_component(foot.$$.fragment);
    			t3 = space();
    			div4 = element("div");
    			if_block.c();
    			attr_dev(div0, "class", "title svelte-12yhvzm");
    			add_location(div0, file$9, 64, 1, 2736);
    			attr_dev(div1, "class", "head svelte-12yhvzm");
    			add_location(div1, file$9, 68, 1, 2778);
    			attr_dev(div2, "class", "middle svelte-12yhvzm");
    			add_location(div2, file$9, 72, 1, 2818);
    			attr_dev(div3, "class", "foot svelte-12yhvzm");
    			add_location(div3, file$9, 76, 1, 2886);
    			attr_dev(div4, "class", div4_class_value = "side " + (/*img_focus*/ ctx[0] == null ? "clouds" : "") + " svelte-12yhvzm");
    			add_location(div4, file$9, 80, 1, 2926);
    			attr_dev(div5, "class", "main svelte-12yhvzm");
    			add_location(div5, file$9, 63, 0, 2716);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			mount_component(title, div0, null);
    			append_dev(div5, t0);
    			append_dev(div5, div1);
    			mount_component(head, div1, null);
    			append_dev(div5, t1);
    			append_dev(div5, div2);
    			mount_component(gallery, div2, null);
    			append_dev(div5, t2);
    			append_dev(div5, div3);
    			mount_component(foot, div3, null);
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    			if_blocks[current_block_type_index].m(div4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const gallery_changes = {};

    			if (!updating_focus && dirty & /*img_focus*/ 1) {
    				updating_focus = true;
    				gallery_changes.focus = /*img_focus*/ ctx[0];
    				add_flush_callback(() => updating_focus = false);
    			}

    			gallery.$set(gallery_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div4, null);
    			}

    			if (!current || dirty & /*img_focus*/ 1 && div4_class_value !== (div4_class_value = "side " + (/*img_focus*/ ctx[0] == null ? "clouds" : "") + " svelte-12yhvzm")) {
    				attr_dev(div4, "class", div4_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title.$$.fragment, local);
    			transition_in(head.$$.fragment, local);
    			transition_in(gallery.$$.fragment, local);
    			transition_in(foot.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title.$$.fragment, local);
    			transition_out(head.$$.fragment, local);
    			transition_out(gallery.$$.fragment, local);
    			transition_out(foot.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(title);
    			destroy_component(head);
    			destroy_component(gallery);
    			destroy_component(foot);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let img_focus = null;
    	let fadeInTime = 1300;
    	let hmm = "Hmm";

    	window.setInterval(
    		() => {
    			$$invalidate(1, hmm += "m");
    		},
    		5000
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function gallery_focus_binding(value) {
    		img_focus = value;
    		$$invalidate(0, img_focus);
    	}

    	$$self.$capture_state = () => ({
    		fade,
    		Title,
    		Head,
    		Gallery,
    		Foot,
    		Eliza: Eliza_1,
    		Side0,
    		Side2,
    		Side3,
    		Side4,
    		img_focus,
    		fadeInTime,
    		hmm
    	});

    	$$self.$inject_state = $$props => {
    		if ("img_focus" in $$props) $$invalidate(0, img_focus = $$props.img_focus);
    		if ("fadeInTime" in $$props) $$invalidate(2, fadeInTime = $$props.fadeInTime);
    		if ("hmm" in $$props) $$invalidate(1, hmm = $$props.hmm);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [img_focus, hmm, fadeInTime, gallery_focus_binding];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		// name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
