console.log("i'm here!");

((function() {
	var a = this,
		b = a.Backbone,
		c = [],
		d = c.push,
		e = c.slice,
		f = c.splice,
		g;
	typeof exports != "undefined" ? g = exports : g = a.Backbone = {}, g.VERSION = "1.0.0";
	var h = a._;
	!h && typeof require != "undefined" && (h = require("underscore")), g.$ = a.jQuery || a.Zepto || a.ender || a.$, g.noConflict = function() {
		return a.Backbone = b, this
	}, g.emulateHTTP = !1, g.emulateJSON = !1;
	var i = g.Events = {
		on: function(a, b, c) {
			if (!k(this, "on", a, [b, c]) || !b) return this;
			this._events || (this._events = {});
			var d = this._events[a] || (this._events[a] = []);
			return d.push({
				callback: b,
				context: c,
				ctx: c || this
			}), this
		},
		once: function(a, b, c) {
			if (!k(this, "once", a, [b, c]) || !b) return this;
			var d = this,
				e = h.once(function() {
					d.off(a, e), b.apply(this, arguments)
				});
			return e._callback = b, this.on(a, e, c)
		},
		off: function(a, b, c) {
			var d, e, f, g, i, j, l, m;
			if (!this._events || !k(this, "off", a, [b, c])) return this;
			if (!a && !b && !c) return this._events = {}, this;
			g = a ? [a] : h.keys(this._events);
			for (i = 0, j = g.length; i < j; i++) {
				a = g[i];
				if (f = this._events[a]) {
					this._events[a] = d = [];
					if (b || c) for (l = 0, m = f.length; l < m; l++) e = f[l], (b && b !== e.callback && b !== e.callback._callback || c && c !== e.context) && d.push(e);
					d.length || delete this._events[a]
				}
			}
			return this
		},
		trigger: function(a) {
			if (!this._events) return this;
			var b = e.call(arguments, 1);
			if (!k(this, "trigger", a, b)) return this;
			var c = this._events[a],
				d = this._events.all;
			return c && l(c, b), d && l(d, arguments), this
		},
		stopListening: function(a, b, c) {
			var d = this._listeners;
			if (!d) return this;
			var e = !b && !c;
			typeof b == "object" && (c = this), a && ((d = {})[a._listenerId] = a);
			for (var f in d) d[f].off(b, c, this), e && delete this._listeners[f];
			return this
		}
	}, j = /\s+/,
		k = function(a, b, c, d) {
			if (!c) return !0;
			if (typeof c == "object") {
				for (var e in c) a[b].apply(a, [e, c[e]].concat(d));
				return !1
			}
			if (j.test(c)) {
				var f = c.split(j);
				for (var g = 0, h = f.length; g < h; g++) a[b].apply(a, [f[g]].concat(d));
				return !1
			}
			return !0
		}, l = function(a, b) {
			var c, d = -1,
				e = a.length,
				f = b[0],
				g = b[1],
				h = b[2];
			switch (b.length) {
				case 0:
					while (++d < e)(c = a[d]).callback.call(c.ctx);
					return;
				case 1:
					while (++d < e)(c = a[d]).callback.call(c.ctx, f);
					return;
				case 2:
					while (++d < e)(c = a[d]).callback.call(c.ctx, f, g);
					return;
				case 3:
					while (++d < e)(c = a[d]).callback.call(c.ctx, f, g, h);
					return;
				default:
					while (++d < e)(c = a[d]).callback.apply(c.ctx, b)
			}
		}, m = {
			listenTo: "on",
			listenToOnce: "once"
		};
	h.each(m, function(a, b) {
		i[b] = function(b, c, d) {
			var e = this._listeners || (this._listeners = {}),
				f = b._listenerId || (b._listenerId = h.uniqueId("l"));
			return e[f] = b, typeof c == "object" && (d = this), b[a](c, d, this), this
		}
	}), i.bind = i.on, i.unbind = i.off, h.extend(g, i);
	var n = g.Model = function(a, b) {
		var c, d = a || {};
		b || (b = {}), this.cid = h.uniqueId("c"), this.attributes = {}, h.extend(this, h.pick(b, o)), b.parse && (d = this.parse(d, b) || {});
		if (c = h.result(this, "defaults")) d = h.defaults({}, d, c);
		this.set(d, b), this.changed = {}, this.initialize.apply(this, arguments)
	}, o = ["url", "urlRoot", "collection"];
	h.extend(n.prototype, i, {
		changed: null,
		validationError: null,
		idAttribute: "id",
		initialize: function() {},
		toJSON: function(a) {
			return h.clone(this.attributes)
		},
		sync: function() {
			return g.sync.apply(this, arguments)
		},
		get: function(a) {
			return this.attributes[a]
		},
		escape: function(a) {
			return h.escape(this.get(a))
		},
		has: function(a) {
			return this.get(a) != null
		},
		set: function(a, b, c) {
			var d, e, f, g, i, j, k, l;
			if (a == null) return this;
			typeof a == "object" ? (e = a, c = b) : (e = {})[a] = b, c || (c = {});
			if (!this._validate(e, c)) return !1;
			f = c.unset, i = c.silent, g = [], j = this._changing, this._changing = !0, j || (this._previousAttributes = h.clone(this.attributes), this.changed = {}), l = this.attributes, k = this._previousAttributes, this.idAttribute in e && (this.id = e[this.idAttribute]);
			for (d in e) b = e[d], h.isEqual(l[d], b) || g.push(d), h.isEqual(k[d], b) ? delete this.changed[d] : this.changed[d] = b, f ? delete l[d] : l[d] = b;
			if (!i) {
				g.length && (this._pending = !0);
				for (var m = 0, n = g.length; m < n; m++) this.trigger("change:" + g[m], this, l[g[m]], c)
			}
			if (j) return this;
			if (!i) while (this._pending) this._pending = !1, this.trigger("change", this, c);
			return this._pending = !1, this._changing = !1, this
		},
		unset: function(a, b) {
			return this.set(a, void 0, h.extend({}, b, {
				unset: !0
			}))
		},
		clear: function(a) {
			var b = {};
			for (var c in this.attributes) b[c] = void 0;
			return this.set(b, h.extend({}, a, {
				unset: !0
			}))
		},
		hasChanged: function(a) {
			return a == null ? !h.isEmpty(this.changed) : h.has(this.changed, a)
		},
		changedAttributes: function(a) {
			if (!a) return this.hasChanged() ? h.clone(this.changed) : !1;
			var b, c = !1,
				d = this._changing ? this._previousAttributes : this.attributes;
			for (var e in a) {
				if (h.isEqual(d[e], b = a[e])) continue;
				(c || (c = {}))[e] = b
			}
			return c
		},
		previous: function(a) {
			return a == null || !this._previousAttributes ? null : this._previousAttributes[a]
		},
		previousAttributes: function() {
			return h.clone(this._previousAttributes)
		},
		fetch: function(a) {
			a = a ? h.clone(a) : {}, a.parse === void 0 && (a.parse = !0);
			var b = this,
				c = a.success;
			return a.success = function(d) {
				if (!b.set(b.parse(d, a), a)) return !1;
				c && c(b, d, a), b.trigger("sync", b, d, a)
			}, L(this, a), this.sync("read", this, a)
		},
		save: function(a, b, c) {
			var d, e, f, g = this.attributes;
			a == null || typeof a == "object" ? (d = a, c = b) : (d = {})[a] = b;
			if (d && (!c || !c.wait) && !this.set(d, c)) return !1;
			c = h.extend({
				validate: !0
			}, c);
			if (!this._validate(d, c)) return !1;
			d && c.wait && (this.attributes = h.extend({}, g, d)), c.parse === void 0 && (c.parse = !0);
			var i = this,
				j = c.success;
			return c.success = function(a) {
				i.attributes = g;
				var b = i.parse(a, c);
				c.wait && (b = h.extend(d || {}, b));
				if (h.isObject(b) && !i.set(b, c)) return !1;
				j && j(i, a, c), i.trigger("sync", i, a, c)
			}, L(this, c), e = this.isNew() ? "create" : c.patch ? "patch" : "update", e === "patch" && (c.attrs = d), f = this.sync(e, this, c), d && c.wait && (this.attributes = g), f
		},
		destroy: function(a) {
			a = a ? h.clone(a) : {};
			var b = this,
				c = a.success,
				d = function() {
					b.trigger("destroy", b, b.collection, a)
				};
			a.success = function(e) {
				(a.wait || b.isNew()) && d(), c && c(b, e, a), b.isNew() || b.trigger("sync", b, e, a)
			};
			if (this.isNew()) return a.success(), !1;
			L(this, a);
			var e = this.sync("delete", this, a);
			return a.wait || d(), e
		},
		url: function() {
			var a = h.result(this, "urlRoot") || h.result(this.collection, "url") || K();
			return this.isNew() ? a : a + (a.charAt(a.length - 1) === "/" ? "" : "/") + encodeURIComponent(this.id)
		},
		parse: function(a, b) {
			return a
		},
		clone: function() {
			return new this.constructor(this.attributes)
		},
		isNew: function() {
			return this.id == null
		},
		isValid: function(a) {
			return this._validate({}, h.extend(a || {}, {
				validate: !0
			}))
		},
		_validate: function(a, b) {
			if (!b.validate || !this.validate) return !0;
			a = h.extend({}, this.attributes, a);
			var c = this.validationError = this.validate(a, b) || null;
			return c ? (this.trigger("invalid", this, c, h.extend(b || {}, {
				validationError: c
			})), !1) : !0
		}
	});
	var p = ["keys", "values", "pairs", "invert", "pick", "omit"];
	h.each(p, function(a) {
		n.prototype[a] = function() {
			var b = e.call(arguments);
			return b.unshift(this.attributes), h[a].apply(h, b)
		}
	});
	var q = g.Collection = function(a, b) {
		b || (b = {}), b.url && (this.url = b.url), b.model && (this.model = b.model), b.comparator !== void 0 && (this.comparator = b.comparator), this._reset(), this.initialize.apply(this, arguments), a && this.reset(a, h.extend({
			silent: !0
		}, b))
	}, r = {
		add: !0,
		remove: !0,
		merge: !0
	}, s = {
		add: !0,
		merge: !1,
		remove: !1
	};
	h.extend(q.prototype, i, {
		model: n,
		initialize: function() {},
		toJSON: function(a) {
			return this.map(function(b) {
				return b.toJSON(a)
			})
		},
		sync: function() {
			return g.sync.apply(this, arguments)
		},
		add: function(a, b) {
			return this.set(a, h.defaults(b || {}, s))
		},
		remove: function(a, b) {
			a = h.isArray(a) ? a.slice() : [a], b || (b = {});
			var c, d, e, f;
			for (c = 0, d = a.length; c < d; c++) {
				f = this.get(a[c]);
				if (!f) continue;
				delete this._byId[f.id], delete this._byId[f.cid], e = this.indexOf(f), this.models.splice(e, 1), this.length--, b.silent || (b.index = e, f.trigger("remove", f, this, b)), this._removeReference(f)
			}
			return this
		},
		set: function(a, b) {
			b = h.defaults(b || {}, r), b.parse && (a = this.parse(a, b)), h.isArray(a) || (a = a ? [a] : []);
			var c, e, g, i, j, k, l = b.at,
				m = this.comparator && l == null && b.sort !== !1,
				n = h.isString(this.comparator) ? this.comparator : null,
				o = [],
				p = [],
				q = {};
			for (c = 0, e = a.length; c < e; c++) {
				if (!(g = this._prepareModel(a[c], b))) continue;
				(j = this.get(g)) ? (b.remove && (q[j.cid] = !0), b.merge && (j.set(g.attributes, b), m && !k && j.hasChanged(n) && (k = !0))) : b.add && (o.push(g), g.on("all", this._onModelEvent, this), this._byId[g.cid] = g, g.id != null && (this._byId[g.id] = g))
			}
			if (b.remove) {
				for (c = 0, e = this.length; c < e; ++c) q[(g = this.models[c]).cid] || p.push(g);
				p.length && this.remove(p, b)
			}
			o.length && (m && (k = !0), this.length += o.length, l != null ? f.apply(this.models, [l, 0].concat(o)) : d.apply(this.models, o)), k && this.sort({
				silent: !0
			});
			if (b.silent) return this;
			for (c = 0, e = o.length; c < e; c++)(g = o[c]).trigger("add", g, this, b);
			return k && this.trigger("sort", this, b), this
		},
		reset: function(a, b) {
			b || (b = {});
			for (var c = 0, d = this.models.length; c < d; c++) this._removeReference(this.models[c]);
			return b.previousModels = this.models, this._reset(), this.add(a, h.extend({
				silent: !0
			}, b)), b.silent || this.trigger("reset", this, b), this
		},
		push: function(a, b) {
			return a = this._prepareModel(a, b), this.add(a, h.extend({
				at: this.length
			}, b)), a
		},
		pop: function(a) {
			var b = this.at(this.length - 1);
			return this.remove(b, a), b
		},
		unshift: function(a, b) {
			return a = this._prepareModel(a, b), this.add(a, h.extend({
				at: 0
			}, b)), a
		},
		shift: function(a) {
			var b = this.at(0);
			return this.remove(b, a), b
		},
		slice: function(a, b) {
			return this.models.slice(a, b)
		},
		get: function(a) {
			return a == null ? void 0 : this._byId[a.id != null ? a.id : a.cid || a]
		},
		at: function(a) {
			return this.models[a]
		},
		where: function(a, b) {
			return h.isEmpty(a) ? b ? void 0 : [] : this[b ? "find" : "filter"](function(b) {
				for (var c in a) if (a[c] !== b.get(c)) return !1;
				return !0
			})
		},
		findWhere: function(a) {
			return this.where(a, !0)
		},
		sort: function(a) {
			if (!this.comparator) throw new Error("Cannot sort a set without a comparator");
			return a || (a = {}), h.isString(this.comparator) || this.comparator.length === 1 ? this.models = this.sortBy(this.comparator, this) : this.models.sort(h.bind(this.comparator, this)), a.silent || this.trigger("sort", this, a), this
		},
		sortedIndex: function(a, b, c) {
			b || (b = this.comparator);
			var d = h.isFunction(b) ? b : function(a) {
					return a.get(b)
				};
			return h.sortedIndex(this.models, a, d, c)
		},
		pluck: function(a) {
			return h.invoke(this.models, "get", a)
		},
		fetch: function(a) {
			a = a ? h.clone(a) : {}, a.parse === void 0 && (a.parse = !0);
			var b = a.success,
				c = this;
			return a.success = function(d) {
				var e = a.reset ? "reset" : "set";
				c[e](d, a), b && b(c, d, a), c.trigger("sync", c, d, a)
			}, L(this, a), this.sync("read", this, a)
		},
		create: function(a, b) {
			b = b ? h.clone(b) : {};
			if (!(a = this._prepareModel(a, b))) return !1;
			b.wait || this.add(a, b);
			var c = this,
				d = b.success;
			return b.success = function(e) {
				b.wait && c.add(a, b), d && d(a, e, b)
			}, a.save(null, b), a
		},
		parse: function(a, b) {
			return a
		},
		clone: function() {
			return new this.constructor(this.models)
		},
		_reset: function() {
			this.length = 0, this.models = [], this._byId = {}
		},
		_prepareModel: function(a, b) {
			if (a instanceof n) return a.collection || (a.collection = this), a;
			b || (b = {}), b.collection = this;
			var c = new this.model(a, b);
			return c._validate(a, b) ? c : (this.trigger("invalid", this, a, b), !1)
		},
		_removeReference: function(a) {
			this === a.collection && delete a.collection, a.off("all", this._onModelEvent, this)
		},
		_onModelEvent: function(a, b, c, d) {
			if ((a === "add" || a === "remove") && c !== this) return;
			a === "destroy" && this.remove(b, d), b && a === "change:" + b.idAttribute && (delete this._byId[b.previous(b.idAttribute)], b.id != null && (this._byId[b.id] = b)), this.trigger.apply(this, arguments)
		}
	});
	var t = ["forEach", "each", "map", "collect", "reduce", "foldl", "inject", "reduceRight", "foldr", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "toArray", "size", "first", "head", "take", "initial", "rest", "tail", "drop", "last", "without", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "chain"];
	h.each(t, function(a) {
		q.prototype[a] = function() {
			var b = e.call(arguments);
			return b.unshift(this.models), h[a].apply(h, b)
		}
	});
	var u = ["groupBy", "countBy", "sortBy"];
	h.each(u, function(a) {
		q.prototype[a] = function(b, c) {
			var d = h.isFunction(b) ? b : function(a) {
					return a.get(b)
				};
			return h[a](this.models, d, c)
		}
	});
	var v = g.View = function(a) {
		this.cid = h.uniqueId("view"), this._configure(a || {}), this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents()
	}, w = /^(\S+)\s*(.*)$/,
		x = ["model", "collection", "el", "id", "attributes", "className", "tagName", "events"];
	h.extend(v.prototype, i, {
		tagName: "div",
		$: function(a) {
			return this.$el.find(a)
		},
		initialize: function() {},
		render: function() {
			return this
		},
		remove: function() {
			return this.$el.remove(), this.stopListening(), this
		},
		setElement: function(a, b) {
			return this.$el && this.undelegateEvents(), this.$el = a instanceof g.$ ? a : g.$(a), this.el = this.$el[0], b !== !1 && this.delegateEvents(), this
		},
		delegateEvents: function(a) {
			if (!a && !(a = h.result(this, "events"))) return this;
			this.undelegateEvents();
			for (var b in a) {
				var c = a[b];
				h.isFunction(c) || (c = this[a[b]]);
				if (!c) continue;
				var d = b.match(w),
					e = d[1],
					f = d[2];
				c = h.bind(c, this), e += ".delegateEvents" + this.cid, f === "" ? this.$el.on(e, c) : this.$el.on(e, f, c)
			}
			return this
		},
		undelegateEvents: function() {
			return this.$el.off(".delegateEvents" + this.cid), this
		},
		_configure: function(a) {
			this.options && (a = h.extend({}, h.result(this, "options"), a)), h.extend(this, h.pick(a, x)), this.options = a
		},
		_ensureElement: function() {
			if (!this.el) {
				var a = h.extend({}, h.result(this, "attributes"));
				this.id && (a.id = h.result(this, "id")), this.className && (a["class"] = h.result(this, "className"));
				var b = g.$("<" + h.result(this, "tagName") + ">").attr(a);
				this.setElement(b, !1)
			} else this.setElement(h.result(this, "el"), !1)
		}
	}), g.sync = function(a, b, c) {
		var d = y[a];
		h.defaults(c || (c = {}), {
			emulateHTTP: g.emulateHTTP,
			emulateJSON: g.emulateJSON
		});
		var e = {
			type: d,
			dataType: "json"
		};
		c.url || (e.url = h.result(b, "url") || K()), c.data == null && b && (a === "create" || a === "update" || a === "patch") && (e.contentType = "application/json", e.data = JSON.stringify(c.attrs || b.toJSON(c))), c.emulateJSON && (e.contentType = "application/x-www-form-urlencoded", e.data = e.data ? {
			model: e.data
		} : {});
		if (c.emulateHTTP && (d === "PUT" || d === "DELETE" || d === "PATCH")) {
			e.type = "POST", c.emulateJSON && (e.data._method = d);
			var f = c.beforeSend;
			c.beforeSend = function(a) {
				a.setRequestHeader("X-HTTP-Method-Override", d);
				if (f) return f.apply(this, arguments)
			}
		}
		e.type !== "GET" && !c.emulateJSON && (e.processData = !1), e.type === "PATCH" && window.ActiveXObject && (!window.external || !window.external.msActiveXFilteringEnabled) && (e.xhr = function() {
			return new ActiveXObject("Microsoft.XMLHTTP")
		});
		var i = c.xhr = g.ajax(h.extend(e, c));
		return b.trigger("request", b, i, c), i
	};
	var y = {
		create: "POST",
		update: "PUT",
		patch: "PATCH",
		"delete": "DELETE",
		read: "GET"
	};
	g.ajax = function() {
		return g.$.ajax.apply(g.$, arguments)
	};
	var z = g.Router = function(a) {
		a || (a = {}), a.routes && (this.routes = a.routes), this._bindRoutes(), this.initialize.apply(this, arguments)
	}, A = /\((.*?)\)/g,
		B = /(\(\?)?:\w+/g,
		C = /\*\w+/g,
		D = /[\-{}\[\]+?.,\\\^$|#\s]/g;
	h.extend(z.prototype, i, {
		initialize: function() {},
		route: function(a, b, c) {
			h.isRegExp(a) || (a = this._routeToRegExp(a)), h.isFunction(b) && (c = b, b = ""), c || (c = this[b]);
			var d = this;
			return g.history.route(a, function(e) {
				var f = d._extractParameters(a, e);
				c && c.apply(d, f), d.trigger.apply(d, ["route:" + b].concat(f)), d.trigger("route", b, f), g.history.trigger("route", d, b, f)
			}), this
		},
		navigate: function(a, b) {
			return g.history.navigate(a, b), this
		},
		_bindRoutes: function() {
			if (!this.routes) return;
			this.routes = h.result(this, "routes");
			var a, b = h.keys(this.routes);
			while ((a = b.pop()) != null) this.route(a, this.routes[a])
		},
		_routeToRegExp: function(a) {
			return a = a.replace(D, "\\$&").replace(A, "(?:$1)?").replace(B, function(a, b) {
				return b ? a : "([^/]+)"
			}).replace(C, "(.*?)"), new RegExp("^" + a + "$")
		},
		_extractParameters: function(a, b) {
			var c = a.exec(b).slice(1);
			return h.map(c, function(a) {
				return a ? decodeURIComponent(a) : null
			})
		}
	});
	var E = g.History = function() {
		this.handlers = [], h.bindAll(this, "checkUrl"), typeof window != "undefined" && (this.location = window.location, this.history = window.history)
	}, F = /^[#\/]|\s+$/g,
		G = /^\/+|\/+$/g,
		H = /msie [\w.]+/,
		I = /\/$/;
	E.started = !1, h.extend(E.prototype, i, {
		interval: 50,
		getHash: function(a) {
			var b = (a || this).location.href.match(/#(.*)$/);
			return b ? b[1] : ""
		},
		getFragment: function(a, b) {
			if (a == null) if (this._hasPushState || !this._wantsHashChange || b) {
				a = this.location.pathname;
				var c = this.root.replace(I, "");
				a.indexOf(c) || (a = a.substr(c.length))
			} else a = this.getHash();
			return a.replace(F, "")
		},
		start: function(a) {
			if (E.started) throw new Error("Backbone.history has already been started");
			E.started = !0, this.options = h.extend({}, {
				root: "/"
			}, this.options, a), this.root = this.options.root, this._wantsHashChange = this.options.hashChange !== !1, this._wantsPushState = !! this.options.pushState, this._hasPushState = !! (this.options.pushState && this.history && this.history.pushState);
			var b = this.getFragment(),
				c = document.documentMode,
				d = H.exec(navigator.userAgent.toLowerCase()) && (!c || c <= 7);
			this.root = ("/" + this.root + "/").replace(G, "/"), d && this._wantsHashChange && (this.iframe = g.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, this.navigate(b)), this._hasPushState ? g.$(window).on("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !d ? g.$(window).on("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), this.fragment = b;
			var e = this.location,
				f = e.pathname.replace(/[^\/]$/, "$&/") === this.root;
			if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !f) return this.fragment = this.getFragment(null, !0), this.location.replace(this.root + this.location.search + "#" + this.fragment), !0;
			this._wantsPushState && this._hasPushState && f && e.hash && (this.fragment = this.getHash().replace(F, ""), this.history.replaceState({}, document.title, this.root + this.fragment + e.search));
			if (!this.options.silent) return this.loadUrl()
		},
		stop: function() {
			g.$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl), clearInterval(this._checkUrlInterval), E.started = !1
		},
		route: function(a, b) {
			this.handlers.unshift({
				route: a,
				callback: b
			})
		},
		checkUrl: function(a) {
			var b = this.getFragment();
			b === this.fragment && this.iframe && (b = this.getFragment(this.getHash(this.iframe)));
			if (b === this.fragment) return !1;
			this.iframe && this.navigate(b), this.loadUrl() || this.loadUrl(this.getHash())
		},
		loadUrl: function(a) {
			var b = this.fragment = this.getFragment(a),
				c = h.any(this.handlers, function(a) {
					if (a.route.test(b)) return a.callback(b), !0
				});
			return c
		},
		navigate: function(a, b) {
			if (!E.started) return !1;
			if (!b || b === !0) b = {
				trigger: b
			};
			a = this.getFragment(a || "");
			if (this.fragment === a) return;
			this.fragment = a;
			var c = this.root + a;
			if (this._hasPushState) this.history[b.replace ? "replaceState" : "pushState"]({}, document.title, c);
			else {
				if (!this._wantsHashChange) return this.location.assign(c);
				this._updateHash(this.location, a, b.replace), this.iframe && a !== this.getFragment(this.getHash(this.iframe)) && (b.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, a, b.replace))
			}
			b.trigger && this.loadUrl(a)
		},
		_updateHash: function(a, b, c) {
			if (c) {
				var d = a.href.replace(/(javascript:|#).*$/, "");
				a.replace(d + "#" + b)
			} else a.hash = "#" + b
		}
	}), g.history = new E;
	var J = function(a, b) {
		var c = this,
			d;
		a && h.has(a, "constructor") ? d = a.constructor : d = function() {
			return c.apply(this, arguments)
		}, h.extend(d, c, b);
		var e = function() {
			this.constructor = d
		};
		return e.prototype = c.prototype, d.prototype = new e, a && h.extend(d.prototype, a), d.__super__ = c.prototype, d
	};
	n.extend = q.extend = z.extend = v.extend = E.extend = J;
	var K = function() {
		throw new Error('A "url" property or function must be specified')
	}, L = function(a, b) {
		var c = b.error;
		b.error = function(d) {
			c && c(a, d, b), a.trigger("error", a, d, b)
		}
	}
})).call(this), Backbone.ChildViewContainer = function(a, b) {
	var c = function(a) {
		this._views = {}, this._indexByModel = {}, this._indexByCustom = {}, this._updateLength(), b.each(a, this.add, this)
	};
	b.extend(c.prototype, {
		add: function(a, b) {
			var c = a.cid;
			this._views[c] = a, a.model && (this._indexByModel[a.model.cid] = c), b && (this._indexByCustom[b] = c), this._updateLength()
		},
		findByModel: function(a) {
			return this.findByModelCid(a.cid)
		},
		findByModelCid: function(a) {
			var b = this._indexByModel[a];
			return this.findByCid(b)
		},
		findByCustom: function(a) {
			var b = this._indexByCustom[a];
			return this.findByCid(b)
		},
		findByIndex: function(a) {
			return b.values(this._views)[a]
		},
		findByCid: function(a) {
			return this._views[a]
		},
		remove: function(a) {
			var c = a.cid;
			a.model && delete this._indexByModel[a.model.cid], b.any(this._indexByCustom, function(a, b) {
				if (a === c) return delete this._indexByCustom[b], !0
			}, this), delete this._views[c], this._updateLength()
		},
		call: function(a) {
			this.apply(a, b.tail(arguments))
		},
		apply: function(a, c) {
			b.each(this._views, function(d) {
				b.isFunction(d[a]) && d[a].apply(d, c || [])
			})
		},
		_updateLength: function() {
			this.length = b.size(this._views)
		}
	});
	var d = ["forEach", "each", "map", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "toArray", "first", "initial", "rest", "last", "without", "isEmpty", "pluck"];
	return b.each(d, function(a) {
		c.prototype[a] = function() {
			var c = b.values(this._views),
				d = [c].concat(b.toArray(arguments));
			return b[a].apply(b, d)
		}
	}), c
}(Backbone, _), Backbone.Wreqr = function(a, b, c) {
	"use strict";
	var d = {};
	return d.Handlers = function(a, b) {
		"use strict";
		var c = function(a) {
			this.options = a, this._wreqrHandlers = {}, b.isFunction(this.initialize) && this.initialize(a)
		};
		return c.extend = a.Model.extend, b.extend(c.prototype, a.Events, {
			setHandlers: function(a) {
				b.each(a, function(a, c) {
					var d = null;
					b.isObject(a) && !b.isFunction(a) && (d = a.context, a = a.callback), this.setHandler(c, a, d)
				}, this)
			},
			setHandler: function(a, b, c) {
				var d = {
					callback: b,
					context: c
				};
				this._wreqrHandlers[a] = d, this.trigger("handler:add", a, b, c)
			},
			hasHandler: function(a) {
				return !!this._wreqrHandlers[a]
			},
			getHandler: function(a) {
				var b = this._wreqrHandlers[a];
				if (!b) throw new Error("Handler not found for '" + a + "'");
				return function() {
					var a = Array.prototype.slice.apply(arguments);
					return b.callback.apply(b.context, a)
				}
			},
			removeHandler: function(a) {
				delete this._wreqrHandlers[a]
			},
			removeAllHandlers: function() {
				this._wreqrHandlers = {}
			}
		}), c
	}(a, c), d.CommandStorage = function() {
		"use strict";
		var b = function(a) {
			this.options = a, this._commands = {}, c.isFunction(this.initialize) && this.initialize(a)
		};
		return c.extend(b.prototype, a.Events, {
			getCommands: function(a) {
				var b = this._commands[a];
				return b || (b = {
					command: a,
					instances: []
				}, this._commands[a] = b), b
			},
			addCommand: function(a, b) {
				var c = this.getCommands(a);
				c.instances.push(b)
			},
			clearCommands: function(a) {
				var b = this.getCommands(a);
				b.instances = []
			}
		}), b
	}(), d.Commands = function(a) {
		return "use strict", a.Handlers.extend({
			storageType: a.CommandStorage,
			constructor: function(b) {
				this.options = b || {}, this._initializeStorage(this.options), this.on("handler:add", this._executeCommands, this);
				var c = Array.prototype.slice.call(arguments);
				a.Handlers.prototype.constructor.apply(this, c)
			},
			execute: function(a, b) {
				a = arguments[0], b = Array.prototype.slice.call(arguments, 1), this.hasHandler(a) ? this.getHandler(a).apply(this, b) : this.storage.addCommand(a, b)
			},
			_executeCommands: function(a, b, d) {
				var e = this.storage.getCommands(a);
				c.each(e.instances, function(a) {
					b.apply(d, a)
				}), this.storage.clearCommands(a)
			},
			_initializeStorage: function(a) {
				var b, d = a.storageType || this.storageType;
				c.isFunction(d) ? b = new d : b = d, this.storage = b
			}
		})
	}(d), d.RequestResponse = function(a) {
		return "use strict", a.Handlers.extend({
			request: function() {
				var a = arguments[0],
					b = Array.prototype.slice.call(arguments, 1);
				return this.getHandler(a).apply(this, b)
			}
		})
	}(d), d.EventAggregator = function(a, b) {
		"use strict";
		var c = function() {};
		return c.extend = a.Model.extend, b.extend(c.prototype, a.Events), c
	}(a, c), d
}(Backbone, Backbone.Marionette, _);
var Marionette = function(a, b, c) {
	function f(a) {
		return e.call(a)
	}
	function g(a, b) {
		var c = new Error(a);
		throw c.name = b || "Error", c
	}
	"use strict";
	var d = {};
	b.Marionette = d, d.$ = b.$;
	var e = Array.prototype.slice;
	return d.extend = b.Model.extend, d.getOption = function(a, b) {
		if (!a || !b) return;
		var c;
		return a.options && b in a.options && a.options[b] !== undefined ? c = a.options[b] : c = a[b], c
	}, d.triggerMethod = function() {
		function b(a, b, c) {
			return c.toUpperCase()
		}
		var a = /(^|:)(\w)/gi,
			d = function(d) {
				var e = "on" + d.replace(a, b),
					f = this[e];
				c.isFunction(this.trigger) && this.trigger.apply(this, arguments);
				if (c.isFunction(f)) return f.apply(this, c.tail(arguments))
			};
		return d
	}(), d.MonitorDOMRefresh = function() {
		function a(a) {
			a._isShown = !0, d(a)
		}
		function b(a) {
			a._isRendered = !0, d(a)
		}
		function d(a) {
			a._isShown && a._isRendered && c.isFunction(a.triggerMethod) && a.triggerMethod("dom:refresh")
		}
		return function(c) {
			c.listenTo(c, "show", function() {
				a(c)
			}), c.listenTo(c, "render", function() {
				b(c)
			})
		}
	}(),
	function(a) {
		function b(a, b, d, e) {
			var f = e.split(/\s+/);
			c.each(f, function(c) {
				var e = a[c];
				e || g("Method '" + c + "' was configured as an event handler, but does not exist."), a.listenTo(b, d, e, a)
			})
		}
		function d(a, b, c, d) {
			a.listenTo(b, c, d, a)
		}
		function e(a, b, d, e) {
			var f = e.split(/\s+/);
			c.each(f, function(c) {
				var e = a[c];
				a.stopListening(b, d, e, a)
			})
		}
		function f(a, b, c, d) {
			a.stopListening(b, c, d, a)
		}
		function h(a, b, d, e, f) {
			if (!b || !d) return;
			c.isFunction(d) && (d = d.call(a)), c.each(d, function(d, g) {
				c.isFunction(d) ? e(a, b, g, d) : f(a, b, g, d)
			})
		}
		"use strict", a.bindEntityEvents = function(a, c, e) {
			h(a, c, e, d, b)
		}, a.unbindEntityEvents = function(a, b, c) {
			h(a, b, c, f, e)
		}
	}(d), d.Callbacks = function() {
		this._deferred = d.$.Deferred(), this._callbacks = []
	}, c.extend(d.Callbacks.prototype, {
		add: function(a, b) {
			this._callbacks.push({
				cb: a,
				ctx: b
			}), this._deferred.done(function(c, d) {
				b && (c = b), a.call(c, d)
			})
		},
		run: function(a, b) {
			this._deferred.resolve(b, a)
		},
		reset: function() {
			var a = this._callbacks;
			this._deferred = d.$.Deferred(), this._callbacks = [], c.each(a, function(a) {
				this.add(a.cb, a.ctx)
			}, this)
		}
	}), d.Controller = function(a) {
		this.triggerMethod = d.triggerMethod, this.options = a || {}, c.isFunction(this.initialize) && this.initialize(this.options)
	}, d.Controller.extend = d.extend, c.extend(d.Controller.prototype, b.Events, {
		close: function() {
			this.stopListening(), this.triggerMethod("close"), this.unbind()
		}
	}), d.Region = function(a) {
		this.options = a || {}, this.el = d.getOption(this, "el");
		if (!this.el) {
			var b = new Error("An 'el' must be specified for a region.");
			throw b.name = "NoElError", b
		}
		if (this.initialize) {
			var c = Array.prototype.slice.apply(arguments);
			this.initialize.apply(this, c)
		}
	}, c.extend(d.Region, {
		buildRegion: function(a, b) {
			var d = typeof a == "string",
				e = typeof a.selector == "string",
				f = typeof a.regionType == "undefined",
				g = typeof a == "function";
			if (!g && !d && !e) throw new Error("Region must be specified as a Region type, a selector string or an object with selector property");
			var h, i;
			d && (h = a), a.selector && (h = a.selector), g && (i = a), !g && f && (i = b), a.regionType && (i = a.regionType);
			var j = new i({
				el: h
			});
			return a.parentEl && (j.getEl = function(b) {
				var d = a.parentEl;
				return c.isFunction(d) && (d = d()), d.find(b)
			}), j
		}
	}), c.extend(d.Region.prototype, b.Events, {
		show: function(a) {
			this.ensureEl();
			var b = a.isClosed || c.isUndefined(a.$el),
				e = a !== this.currentView;
			e && this.close(), a.render(), (e || b) && this.open(a), this.currentView = a, d.triggerMethod.call(this, "show", a), d.triggerMethod.call(a, "show")
		},
		ensureEl: function() {
			if (!this.$el || this.$el.length === 0) this.$el = this.getEl(this.el)
		},
		getEl: function(a) {
			return d.$(a)
		},
		open: function(a) {
			this.$el.empty().append(a.el)
		},
		close: function() {
			var a = this.currentView;
			if (!a || a.isClosed) return;
			a.close ? a.close() : a.remove && a.remove(), d.triggerMethod.call(this, "close"), delete this.currentView
		},
		attachView: function(a) {
			this.currentView = a
		},
		reset: function() {
			this.close(), delete this.$el
		}
	}), d.Region.extend = d.extend, d.RegionManager = function(a) {
		var b = a.Controller.extend({
			constructor: function(b) {
				this._regions = {}, a.Controller.prototype.constructor.call(this, b)
			},
			addRegions: function(a, b) {
				var d = {};
				return c.each(a, function(a, e) {
					typeof a == "string" && (a = {
						selector: a
					}), a.selector && (a = c.defaults({}, a, b));
					var f = this.addRegion(e, a);
					d[e] = f
				}, this), d
			},
			addRegion: function(b, d) {
				var e, f = c.isObject(d),
					g = c.isString(d),
					h = !! d.selector;
				return g || f && h ? e = a.Region.buildRegion(d, a.Region) : c.isFunction(d) ? e = a.Region.buildRegion(d, a.Region) : e = d, this._store(b, e), this.triggerMethod("region:add", b, e), e
			},
			get: function(a) {
				return this._regions[a]
			},
			removeRegion: function(a) {
				var b = this._regions[a];
				this._remove(a, b)
			},
			removeRegions: function() {
				c.each(this._regions, function(a, b) {
					this._remove(b, a)
				}, this)
			},
			closeRegions: function() {
				c.each(this._regions, function(a, b) {
					a.close()
				}, this)
			},
			close: function() {
				this.removeRegions();
				var b = Array.prototype.slice.call(arguments);
				a.Controller.prototype.close.apply(this, b)
			},
			_store: function(a, b) {
				this._regions[a] = b, this._setLength()
			},
			_remove: function(a, b) {
				b.close(), delete this._regions[a], this._setLength(), this.triggerMethod("region:remove", a, b)
			},
			_setLength: function() {
				this.length = c.size(this._regions)
			}
		}),
			d = ["forEach", "each", "map", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "toArray", "first", "initial", "rest", "last", "without", "isEmpty", "pluck"];
		return c.each(d, function(a) {
			b.prototype[a] = function() {
				var b = c.values(this._regions),
					d = [b].concat(c.toArray(arguments));
				return c[a].apply(c, d)
			}
		}), b
	}(d), d.TemplateCache = function(a) {
		this.templateId = a
	}, c.extend(d.TemplateCache, {
		templateCaches: {},
		get: function(a) {
			var b = this.templateCaches[a];
			return b || (b = new d.TemplateCache(a), this.templateCaches[a] = b), b.load()
		},
		clear: function() {
			var a, b = f(arguments),
				c = b.length;
			if (c > 0) for (a = 0; a < c; a++) delete this.templateCaches[b[a]];
			else this.templateCaches = {}
		}
	}), c.extend(d.TemplateCache.prototype, {
		load: function() {
			if (this.compiledTemplate) return this.compiledTemplate;
			var a = this.loadTemplate(this.templateId);
			return this.compiledTemplate = this.compileTemplate(a), this.compiledTemplate
		},
		loadTemplate: function(a) {
			var b = d.$(a).html();
			return (!b || b.length === 0) && g("Could not find template: '" + a + "'", "NoTemplateError"), b
		},
		compileTemplate: function(a) {
			return c.template(a)
		}
	}), d.Renderer = {
		render: function(a, b) {
			if (!a) {
				var c = new Error("Cannot render the template since it's false, null or undefined.");
				throw c.name = "TemplateNotFoundError", c
			}
			var e;
			return typeof a == "function" ? e = a : e = d.TemplateCache.get(a), e(b)
		}
	}, d.View = b.View.extend({
		constructor: function(a) {
			c.bindAll(this, "render");
			var e = Array.prototype.slice.apply(arguments);
			this.options = a || {}, b.View.prototype.constructor.apply(this, e), d.MonitorDOMRefresh(this), this.listenTo(this, "show", this.onShowCalled, this)
		},
		triggerMethod: d.triggerMethod,
		getTemplate: function() {
			return d.getOption(this, "template")
		},
		mixinTemplateHelpers: function(a) {
			a = a || {};
			var b = d.getOption(this, "templateHelpers");
			return c.isFunction(b) && (b = b.call(this)), c.extend(a, b)
		},
		configureTriggers: function() {
			if (!this.triggers) return;
			var a = {}, b = c.result(this, "triggers");
			return c.each(b, function(b, d) {
				var e = c.isObject(b),
					f = e ? b.event : b;
				a[d] = function(a) {
					if (a) {
						var c = a.preventDefault,
							d = a.stopPropagation,
							g = e ? b.preventDefault : c,
							h = e ? b.stopPropagation : d;
						g && c && c.apply(a), h && d && d.apply(a)
					}
					var i = {
						view: this,
						model: this.model,
						collection: this.collection
					};
					this.triggerMethod(f, i)
				}
			}, this), a
		},
		delegateEvents: function(a) {
			this._delegateDOMEvents(a), d.bindEntityEvents(this, this.model, d.getOption(this, "modelEvents")), d.bindEntityEvents(this, this.collection, d.getOption(this, "collectionEvents"))
		},
		_delegateDOMEvents: function(a) {
			a = a || this.events, c.isFunction(a) && (a = a.call(this));
			var d = {}, e = this.configureTriggers();
			c.extend(d, a, e), b.View.prototype.delegateEvents.call(this, d)
		},
		undelegateEvents: function() {
			var a = Array.prototype.slice.call(arguments);
			b.View.prototype.undelegateEvents.apply(this, a), d.unbindEntityEvents(this, this.model, d.getOption(this, "modelEvents")), d.unbindEntityEvents(this, this.collection, d.getOption(this, "collectionEvents"))
		},
		onShowCalled: function() {},
		close: function() {
			if (this.isClosed) return;
			var a = this.triggerMethod("before:close");
			if (a === !1) return;
			this.isClosed = !0, this.triggerMethod("close"), this.unbindUIElements(), this.remove()
		},
		bindUIElements: function() {
			if (!this.ui) return;
			this._uiBindings || (this._uiBindings = this.ui);
			var a = c.result(this, "_uiBindings");
			this.ui = {}, c.each(c.keys(a), function(b) {
				var c = a[b];
				this.ui[b] = this.$(c)
			}, this)
		},
		unbindUIElements: function() {
			if (!this.ui || !this._uiBindings) return;
			c.each(this.ui, function(a, b) {
				delete this.ui[b]
			}, this), this.ui = this._uiBindings, delete this._uiBindings
		}
	}), d.ItemView = d.View.extend({
		constructor: function() {
			d.View.prototype.constructor.apply(this, f(arguments))
		},
		serializeData: function() {
			var a = {};
			return this.model ? a = this.model.toJSON() : this.collection && (a = {
				items: this.collection.toJSON()
			}), a
		},
		render: function() {
			this.isClosed = !1, this.triggerMethod("before:render", this), this.triggerMethod("item:before:render", this);
			var a = this.serializeData();
			a = this.mixinTemplateHelpers(a);
			var b = this.getTemplate(),
				c = d.Renderer.render(b, a);
			return this.$el.html(c), this.bindUIElements(), this.triggerMethod("render", this), this.triggerMethod("item:rendered", this), this
		},
		close: function() {
			if (this.isClosed) return;
			this.triggerMethod("item:before:close"), d.View.prototype.close.apply(this, f(arguments)), this.triggerMethod("item:closed")
		}
	}), d.CollectionView = d.View.extend({
		itemViewEventPrefix: "itemview",
		constructor: function(a) {
			this._initChildViewStorage(), d.View.prototype.constructor.apply(this, f(arguments)), this._initialEvents(), this.initRenderBuffer()
		},
		initRenderBuffer: function() {
			this.elBuffer = document.createDocumentFragment()
		},
		startBuffering: function() {
			this.initRenderBuffer(), this.isBuffering = !0
		},
		endBuffering: function() {
			this.appendBuffer(this, this.elBuffer), this.initRenderBuffer(), this.isBuffering = !1
		},
		_initialEvents: function() {
			this.collection && (this.listenTo(this.collection, "add", this.addChildView, this), this.listenTo(this.collection, "remove", this.removeItemView, this), this.listenTo(this.collection, "reset", this.render, this))
		},
		addChildView: function(a, b, c) {
			this.closeEmptyView();
			var d = this.getItemView(a),
				e = this.collection.indexOf(a);
			this.addItemView(a, d, e)
		},
		onShowCalled: function() {
			this.children.each(function(a) {
				d.triggerMethod.call(a, "show")
			})
		},
		triggerBeforeRender: function() {
			this.triggerMethod("before:render", this), this.triggerMethod("collection:before:render", this)
		},
		triggerRendered: function() {
			this.triggerMethod("render", this), this.triggerMethod("collection:rendered", this)
		},
		render: function() {
			return this.isClosed = !1, this.triggerBeforeRender(), this._renderChildren(), this.triggerRendered(), this
		},
		_renderChildren: function() {
			this.startBuffering(), this.closeEmptyView(), this.closeChildren(), this.collection && this.collection.length > 0 ? this.showCollection() : this.showEmptyView(), this.endBuffering()
		},
		showCollection: function() {
			var a;
			this.collection.each(function(b, c) {
				a = this.getItemView(b), this.addItemView(b, a, c)
			}, this)
		},
		showEmptyView: function() {
			var a = this.getEmptyView();
			if (a && !this._showingEmptyView) {
				this._showingEmptyView = !0;
				var c = new b.Model;
				this.addItemView(c, a, 0)
			}
		},
		closeEmptyView: function() {
			this._showingEmptyView && (this.closeChildren(), delete this._showingEmptyView)
		},
		getEmptyView: function() {
			return d.getOption(this, "emptyView")
		},
		getItemView: function(a) {
			var b = d.getOption(this, "itemView");
			return b || g("An `itemView` must be specified", "NoItemViewError"), b
		},
		addItemView: function(a, b, e) {
			var f = d.getOption(this, "itemViewOptions");
			c.isFunction(f) && (f = f.call(this, a, e));
			var g = this.buildItemView(a, b, f);
			this.addChildViewEventForwarding(g), this.triggerMethod("before:item:added", g), this.children.add(g), this.renderItemView(g, e), this._isShown && d.triggerMethod.call(g, "show"), this.triggerMethod("after:item:added", g)
		},
		addChildViewEventForwarding: function(a) {
			var b = d.getOption(this, "itemViewEventPrefix");
			this.listenTo(a, "all", function() {
				var c = f(arguments);
				c[0] = b + ":" + c[0], c.splice(1, 0, a), d.triggerMethod.apply(this, c)
			}, this)
		},
		renderItemView: function(a, b) {
			a.render(), this.appendHtml(this, a, b)
		},
		buildItemView: function(a, b, d) {
			var e = c.extend({
				model: a
			}, d);
			return new b(e)
		},
		removeItemView: function(a) {
			var b = this.children.findByModel(a);
			this.removeChildView(b), this.checkEmpty()
		},
		removeChildView: function(a) {
			a && (this.stopListening(a), a.close ? a.close() : a.remove && a.remove(), this.children.remove(a)), this.triggerMethod("item:removed", a)
		},
		checkEmpty: function() {
			(!this.collection || this.collection.length === 0) && this.showEmptyView()
		},
		appendBuffer: function(a, b) {
			a.$el.append(b)
		},
		appendHtml: function(a, b, c) {
			a.isBuffering ? a.elBuffer.appendChild(b.el) : a.$el.append(b.el)
		},
		_initChildViewStorage: function() {
			this.children = new b.ChildViewContainer
		},
		close: function() {
			if (this.isClosed) return;
			this.triggerMethod("collection:before:close"), this.closeChildren(), this.triggerMethod("collection:closed"), d.View.prototype.close.apply(this, f(arguments))
		},
		closeChildren: function() {
			this.children.each(function(a) {
				this.removeChildView(a)
			}, this), this.checkEmpty()
		}
	}), d.CompositeView = d.CollectionView.extend({
		constructor: function() {
			d.CollectionView.prototype.constructor.apply(this, f(arguments))
		},
		_initialEvents: function() {
			this.once("render", function() {
				this.collection && (this.listenTo(this.collection, "add", this.addChildView, this), this.listenTo(this.collection, "remove", this.removeItemView, this), this.listenTo(this.collection, "reset", this._renderChildren, this))
			})
		},
		getItemView: function(a) {
			var b = d.getOption(this, "itemView") || this.constructor;
			return b || g("An `itemView` must be specified", "NoItemViewError"), b
		},
		serializeData: function() {
			var a = {};
			return this.model && (a = this.model.toJSON()), a
		},
		render: function() {
			this.isRendered = !0, this.isClosed = !1, this.resetItemViewContainer(), this.triggerBeforeRender();
			var a = this.renderModel();
			return this.$el.html(a), this.bindUIElements(), this.triggerMethod("composite:model:rendered"), this._renderChildren(), this.triggerMethod("composite:rendered"), this.triggerRendered(), this
		},
		_renderChildren: function() {
			this.isRendered && (d.CollectionView.prototype._renderChildren.call(this), this.triggerMethod("composite:collection:rendered"))
		},
		renderModel: function() {
			var a = {};
			a = this.serializeData(), a = this.mixinTemplateHelpers(a);
			var b = this.getTemplate();
			return d.Renderer.render(b, a)
		},
		appendBuffer: function(a, b) {
			var c = this.getItemViewContainer(a);
			c.append(b)
		},
		appendHtml: function(a, b, c) {
			if (a.isBuffering) a.elBuffer.appendChild(b.el);
			else {
				var d = this.getItemViewContainer(a);
				d.append(b.el)
			}
		},
		getItemViewContainer: function(a) {
			if ("$itemViewContainer" in a) return a.$itemViewContainer;
			var b, e = d.getOption(a, "itemViewContainer");
			if (e) {
				var f = c.isFunction(e) ? e() : e;
				b = a.$(f), b.length <= 0 && g("The specified `itemViewContainer` was not found: " + a.itemViewContainer, "ItemViewContainerMissingError")
			} else b = a.$el;
			return a.$itemViewContainer = b, b
		},
		resetItemViewContainer: function() {
			this.$itemViewContainer && delete this.$itemViewContainer
		}
	}), d.Layout = d.ItemView.extend({
		regionType: d.Region,
		constructor: function(a) {
			a = a || {}, this._firstRender = !0, this._initializeRegions(a), d.ItemView.prototype.constructor.call(this, a)
		},
		render: function() {
			this.isClosed && this._initializeRegions(), this._firstRender ? this._firstRender = !1 : this.isClosed || this._reInitializeRegions();
			var a = Array.prototype.slice.apply(arguments),
				b = d.ItemView.prototype.render.apply(this, a);
			return b
		},
		close: function() {
			if (this.isClosed) return;
			this.regionManager.close();
			var a = Array.prototype.slice.apply(arguments);
			d.ItemView.prototype.close.apply(this, a)
		},
		addRegion: function(a, b) {
			var c = {};
			return c[a] = b, this._buildRegions(c)[a]
		},
		addRegions: function(a) {
			return this.regions = c.extend({}, this.regions, a), this._buildRegions(a)
		},
		removeRegion: function(a) {
			return delete this.regions[a], this.regionManager.removeRegion(a)
		},
		_buildRegions: function(a) {
			var b = this,
				c = {
					regionType: d.getOption(this, "regionType"),
					parentEl: function() {
						return b.$el
					}
				};
			return this.regionManager.addRegions(a, c)
		},
		_initializeRegions: function(a) {
			var b;
			this._initRegionManager(), c.isFunction(this.regions) ? b = this.regions(a) : b = this.regions || {}, this.addRegions(b)
		},
		_reInitializeRegions: function() {
			this.regionManager.closeRegions(), this.regionManager.each(function(a) {
				a.reset()
			})
		},
		_initRegionManager: function() {
			this.regionManager = new d.RegionManager, this.listenTo(this.regionManager, "region:add", function(a, b) {
				this[a] = b, this.trigger("region:add", a, b)
			}), this.listenTo(this.regionManager, "region:remove", function(a, b) {
				delete this[a], this.trigger("region:remove", a, b)
			})
		}
	}), d.AppRouter = b.Router.extend({
		constructor: function(a) {
			b.Router.prototype.constructor.apply(this, f(arguments)), this.options = a || {};
			var c = d.getOption(this, "appRoutes"),
				e = this._getController();
			this.processAppRoutes(e, c)
		},
		appRoute: function(a, b) {
			var c = this._getController();
			this._addAppRoute(c, a, b)
		},
		processAppRoutes: function(a, b) {
			if (!b) return;
			var d = c.keys(b).reverse();
			c.each(d, function(c) {
				this._addAppRoute(a, c, b[c])
			}, this)
		},
		_getController: function() {
			return d.getOption(this, "controller")
		},
		_addAppRoute: function(a, b, d) {
			var e = a[d];
			if (!e) throw new Error("Method '" + d + "' was not found on the controller");
			this.route(b, d, c.bind(e, a))
		}
	}), d.Application = function(a) {
		this._initRegionManager(), this._initCallbacks = new d.Callbacks, this.vent = new b.Wreqr.EventAggregator, this.commands = new b.Wreqr.Commands, this.reqres = new b.Wreqr.RequestResponse, this.submodules = {}, c.extend(this, a), this.triggerMethod = d.triggerMethod
	}, c.extend(d.Application.prototype, b.Events, {
		execute: function() {
			var a = Array.prototype.slice.apply(arguments);
			this.commands.execute.apply(this.commands, a)
		},
		request: function() {
			var a = Array.prototype.slice.apply(arguments);
			return this.reqres.request.apply(this.reqres, a)
		},
		addInitializer: function(a) {
			this._initCallbacks.add(a)
		},
		start: function(a) {
			this.triggerMethod("initialize:before", a), this._initCallbacks.run(a, this), this.triggerMethod("initialize:after", a), this.triggerMethod("start", a)
		},
		addRegions: function(a) {
			return this._regionManager.addRegions(a)
		},
		closeRegions: function() {
			this._regionManager.closeRegions()
		},
		removeRegion: function(a) {
			this._regionManager.removeRegion(a)
		},
		getRegion: function(a) {
			return this._regionManager.get(a)
		},
		module: function(a, b) {
			var c = f(arguments);
			return c.unshift(this), d.Module.create.apply(d.Module, c)
		},
		_initRegionManager: function() {
			this._regionManager = new d.RegionManager, this.listenTo(this._regionManager, "region:add", function(a, b) {
				this[a] = b
			}), this.listenTo(this._regionManager, "region:remove", function(a, b) {
				delete this[a]
			})
		}
	}), d.Application.extend = d.extend, d.Module = function(a, b) {
		this.moduleName = a, this.submodules = {}, this._setupInitializersAndFinalizers(), this.app = b, this.startWithParent = !0, this.triggerMethod = d.triggerMethod
	}, c.extend(d.Module.prototype, b.Events, {
		addInitializer: function(a) {
			this._initializerCallbacks.add(a)
		},
		addFinalizer: function(a) {
			this._finalizerCallbacks.add(a)
		},
		start: function(a) {
			if (this._isInitialized) return;
			c.each(this.submodules, function(b) {
				b.startWithParent && b.start(a)
			}), this.triggerMethod("before:start", a), this._initializerCallbacks.run(a, this), this._isInitialized = !0, this.triggerMethod("start", a)
		},
		stop: function() {
			if (!this._isInitialized) return;
			this._isInitialized = !1, d.triggerMethod.call(this, "before:stop"), c.each(this.submodules, function(a) {
				a.stop()
			}), this._finalizerCallbacks.run(undefined, this), this._initializerCallbacks.reset(), this._finalizerCallbacks.reset(), d.triggerMethod.call(this, "stop")
		},
		addDefinition: function(a, b) {
			this._runModuleDefinition(a, b)
		},
		_runModuleDefinition: function(a, e) {
			if (!a) return;
			var f = c.flatten([this, this.app, b, d, d.$, c, e]);
			a.apply(this, f)
		},
		_setupInitializersAndFinalizers: function() {
			this._initializerCallbacks = new d.Callbacks, this._finalizerCallbacks = new d.Callbacks
		}
	}), c.extend(d.Module, {
		create: function(a, b, d) {
			var e = a,
				g = f(arguments);
			g.splice(0, 3), b = b.split(".");
			var h = b.length,
				i = [];
			return i[h - 1] = d, c.each(b, function(b, c) {
				var d = e;
				e = this._getModule(d, b, a), this._addModuleDefinition(d, e, i[c], g)
			}, this), e
		},
		_getModule: function(a, b, c, e, f) {
			var g = a[b];
			return g || (g = new d.Module(b, c), a[b] = g, a.submodules[b] = g), g
		},
		_addModuleDefinition: function(a, b, d, e) {
			var f, g;
			c.isFunction(d) ? (f = d, g = !0) : c.isObject(d) ? (f = d.define, g = d.startWithParent) : g = !0, f && b.addDefinition(f, e), b.startWithParent = b.startWithParent && g, b.startWithParent && !b.startWithParentIsConfigured && (b.startWithParentIsConfigured = !0, a.addInitializer(function(a) {
				b.startWithParent && b.start(a)
			}))
		}
	}), d
}(this, Backbone, _);
(function(a) {
	function b(a, b) {
		var c = (a & 65535) + (b & 65535),
			d = (a >> 16) + (b >> 16) + (c >> 16);
		return d << 16 | c & 65535
	}
	function c(a, b) {
		return a << b | a >>> 32 - b
	}
	function d(a, d, e, f, g, h) {
		return b(c(b(b(d, a), b(f, h)), g), e)
	}
	function e(a, b, c, e, f, g, h) {
		return d(b & c | ~b & e, a, b, f, g, h)
	}
	function f(a, b, c, e, f, g, h) {
		return d(b & e | c & ~e, a, b, f, g, h)
	}
	function g(a, b, c, e, f, g, h) {
		return d(b ^ c ^ e, a, b, f, g, h)
	}
	function h(a, b, c, e, f, g, h) {
		return d(c ^ (b | ~e), a, b, f, g, h)
	}
	function i(a, c) {
		a[c >> 5] |= 128 << c % 32, a[(c + 64 >>> 9 << 4) + 14] = c;
		var d, i, j, k, l, m = 1732584193,
			n = -271733879,
			o = -1732584194,
			p = 271733878;
		for (d = 0; d < a.length; d += 16) i = m, j = n, k = o, l = p, m = e(m, n, o, p, a[d], 7, -680876936), p = e(p, m, n, o, a[d + 1], 12, -389564586), o = e(o, p, m, n, a[d + 2], 17, 606105819), n = e(n, o, p, m, a[d + 3], 22, -1044525330), m = e(m, n, o, p, a[d + 4], 7, -176418897), p = e(p, m, n, o, a[d + 5], 12, 1200080426), o = e(o, p, m, n, a[d + 6], 17, -1473231341), n = e(n, o, p, m, a[d + 7], 22, -45705983), m = e(m, n, o, p, a[d + 8], 7, 1770035416), p = e(p, m, n, o, a[d + 9], 12, -1958414417), o = e(o, p, m, n, a[d + 10], 17, -42063), n = e(n, o, p, m, a[d + 11], 22, -1990404162), m = e(m, n, o, p, a[d + 12], 7, 1804603682), p = e(p, m, n, o, a[d + 13], 12, -40341101), o = e(o, p, m, n, a[d + 14], 17, -1502002290), n = e(n, o, p, m, a[d + 15], 22, 1236535329), m = f(m, n, o, p, a[d + 1], 5, -165796510), p = f(p, m, n, o, a[d + 6], 9, -1069501632), o = f(o, p, m, n, a[d + 11], 14, 643717713), n = f(n, o, p, m, a[d], 20, -373897302), m = f(m, n, o, p, a[d + 5], 5, -701558691), p = f(p, m, n, o, a[d + 10], 9, 38016083), o = f(o, p, m, n, a[d + 15], 14, -660478335), n = f(n, o, p, m, a[d + 4], 20, -405537848), m = f(m, n, o, p, a[d + 9], 5, 568446438), p = f(p, m, n, o, a[d + 14], 9, -1019803690), o = f(o, p, m, n, a[d + 3], 14, -187363961), n = f(n, o, p, m, a[d + 8], 20, 1163531501), m = f(m, n, o, p, a[d + 13], 5, -1444681467), p = f(p, m, n, o, a[d + 2], 9, -51403784), o = f(o, p, m, n, a[d + 7], 14, 1735328473), n = f(n, o, p, m, a[d + 12], 20, -1926607734), m = g(m, n, o, p, a[d + 5], 4, -378558), p = g(p, m, n, o, a[d + 8], 11, -2022574463), o = g(o, p, m, n, a[d + 11], 16, 1839030562), n = g(n, o, p, m, a[d + 14], 23, -35309556), m = g(m, n, o, p, a[d + 1], 4, -1530992060), p = g(p, m, n, o, a[d + 4], 11, 1272893353), o = g(o, p, m, n, a[d + 7], 16, -155497632), n = g(n, o, p, m, a[d + 10], 23, -1094730640), m = g(m, n, o, p, a[d + 13], 4, 681279174), p = g(p, m, n, o, a[d], 11, -358537222), o = g(o, p, m, n, a[d + 3], 16, -722521979), n = g(n, o, p, m, a[d + 6], 23, 76029189), m = g(m, n, o, p, a[d + 9], 4, -640364487), p = g(p, m, n, o, a[d + 12], 11, -421815835), o = g(o, p, m, n, a[d + 15], 16, 530742520), n = g(n, o, p, m, a[d + 2], 23, -995338651), m = h(m, n, o, p, a[d], 6, -198630844), p = h(p, m, n, o, a[d + 7], 10, 1126891415), o = h(o, p, m, n, a[d + 14], 15, -1416354905), n = h(n, o, p, m, a[d + 5], 21, -57434055), m = h(m, n, o, p, a[d + 12], 6, 1700485571), p = h(p, m, n, o, a[d + 3], 10, -1894986606), o = h(o, p, m, n, a[d + 10], 15, -1051523), n = h(n, o, p, m, a[d + 1], 21, -2054922799), m = h(m, n, o, p, a[d + 8], 6, 1873313359), p = h(p, m, n, o, a[d + 15], 10, -30611744), o = h(o, p, m, n, a[d + 6], 15, -1560198380), n = h(n, o, p, m, a[d + 13], 21, 1309151649), m = h(m, n, o, p, a[d + 4], 6, -145523070), p = h(p, m, n, o, a[d + 11], 10, -1120210379), o = h(o, p, m, n, a[d + 2], 15, 718787259), n = h(n, o, p, m, a[d + 9], 21, -343485551), m = b(m, i), n = b(n, j), o = b(o, k), p = b(p, l);
		return [m, n, o, p]
	}
	function j(a) {
		var b, c = "";
		for (b = 0; b < a.length * 32; b += 8) c += String.fromCharCode(a[b >> 5] >>> b % 32 & 255);
		return c
	}
	function k(a) {
		var b, c = [];
		c[(a.length >> 2) - 1] = undefined;
		for (b = 0; b < c.length; b += 1) c[b] = 0;
		for (b = 0; b < a.length * 8; b += 8) c[b >> 5] |= (a.charCodeAt(b / 8) & 255) << b % 32;
		return c
	}
	function l(a) {
		return j(i(k(a), a.length * 8))
	}
	function m(a, b) {
		var c, d = k(a),
			e = [],
			f = [],
			g;
		e[15] = f[15] = undefined, d.length > 16 && (d = i(d, a.length * 8));
		for (c = 0; c < 16; c += 1) e[c] = d[c] ^ 909522486, f[c] = d[c] ^ 1549556828;
		return g = i(e.concat(k(b)), 512 + b.length * 8), j(i(f.concat(g), 640))
	}
	function n(a) {
		var b = "0123456789abcdef",
			c = "",
			d, e;
		for (e = 0; e < a.length; e += 1) d = a.charCodeAt(e), c += b.charAt(d >>> 4 & 15) + b.charAt(d & 15);
		return c
	}
	function o(a) {
		return unescape(encodeURIComponent(a))
	}
	function p(a) {
		return l(o(a))
	}
	function q(a) {
		return n(p(a))
	}
	function r(a, b) {
		return m(o(a), o(b))
	}
	function s(a, b) {
		return n(r(a, b))
	}
	function t(a, b, c) {
		return b ? c ? r(b, a) : s(b, a) : c ? p(a) : q(a)
	}
	"use strict", typeof define == "function" && define.amd ? define(function() {
		return t
	}) : a.md5 = t
})(this),
function() {
	Backbone.Marionette.TemplateCache.prototype.compileTemplate = function(a) {
		return Handlebars.compile(a)
	}
}.call(this),
function() {
	var a;
	a = Backbone.sync, Backbone.sync = function(b, c, d) {
		var e;
		return $(window).trigger("backbone:startRequest"), e = a.call(Backbone, b, c, d), e.always(function() {
			return $(window).trigger("backbone:completeRequest")
		}), e
	}
}.call(this),
function() {
	var a = function(a, b) {
		return function() {
			return a.apply(b, arguments)
		}
	}, b = function(a, b) {
		function e() {
			this.constructor = a
		}
		for (var d in b) c.call(b, d) && (a[d] = b[d]);
		return e.prototype = b.prototype, a.prototype = new e, a.__super__ = b.prototype, a
	}, c = {}.hasOwnProperty;
	root.Participant = function(c) {
		function d() {
			return this.reactivate = a(this.reactivate, this), this.undoCheckIn = a(this.undoCheckIn, this), this.checkIn = a(this.checkIn, this), d.__super__.constructor.apply(this, arguments)
		}
		return b(d, c), d.prototype.initialize = function(a, b) {
			if (this.get("invite_name_or_email")) return this.set({
				username: a.invite_name_or_email,
				email_hash: md5(a.invite_name_or_email)
			}, {
				silent: !0
			})
		}, d.validate = function(a, b) {
			return (new root.Participant(a, b)).validate()
		}, d.prototype.validate = function(a, b) {
			var c, d, e;
			if (!this.get("name") && !this.get("invite_name_or_email")) return gon.tournament.teams ? "A Display Name or Challonge Team Name is required" : "A name, username, or email is required";
			if (this.collection) {
				if (this.get("name")) {
					d = _.find(this.collection.models, function(a) {
						return function(b) {
							return b.id !== a.id && b.get("name") === a.get("name")
						}
					}(this));
					if (d) return "Name: " + this.get("name") + " has already been taken"
				}
				c = _.find(this.collection.models, function(a) {
					return function(b) {
						if (b.get("email_hash")) return b.id !== a.id && b.get("email_hash") === md5(a.get("invite_name_or_email"))
					}
				}(this));
				if (c) return "Email: " + this.get("invite_name_or_email") + " has already been taken";
				e = _.find(this.collection.models, function(a) {
					return function(b) {
						if (b.get("username")) return b.id !== a.id && b.get("username") === a.get("invite_name_or_email")
					}
				}(this));
				if (e) return "Username: " + this.get("invite_name_or_email") + " has already been taken"
			}
		}, d.prototype.remove = function(a) {
			return $.ajax(_.extend({
				url: this.url().concat("/remove"),
				type: "PUT",
				success: function(a) {
					return function(b) {
						return a.set(b), a.trigger("sync")
					}
				}(this)
			}, a))
		}, d.prototype.updateSeed = function(position) {
			return $.ajax({
				url: this.url().concat("/update_seed"),
				data: {
					position: position
				},
				type: "POST",
				success: function(a) {
					return function(b) {
						return a.collection.reset(b)
					}
				}(this),
				error: function(a) {
					return function() {
						return alert("An error occured while re-seeding participant. Reload the page before continuing.")
					}
				}(this)
			})
		}, d.prototype.checkIn = function() {
			return $(window).trigger("backbone:startRequest"), $.ajax({
				url: this.url().concat("/check_in"),
				type: "PUT",
				dataType: "json",
				success: function(a) {
					return function(b) {
						return a.set(b)
					}
				}(this),
				error: function(a) {
					return function() {
						return alert("An error occured while checking-in participant. Reload the page before continuing.")
					}
				}(this)
			}).always(function(a) {
				return function() {
					return $(window).trigger("backbone:completeRequest")
				}
			}(this))
		}, d.prototype.undoCheckIn = function() {
			return $(window).trigger("backbone:startRequest"), $.ajax({
				url: this.url().concat("/undo_check_in"),
				type: "PUT",
				dataType: "json",
				success: function(a) {
					return function(b) {
						return a.set(b)
					}
				}(this),
				error: function(a) {
					return function() {
						return alert("An error occured while undoing a participant check-in. Reload the page before continuing.")
					}
				}(this)
			}).always(function(a) {
				return function() {
					return $(window).trigger("backbone:completeRequest")
				}
			}(this))
		}, d.prototype.resendInvitation = function() {
			return $(window).trigger("backbone:startRequest"), $.ajax({
				url: "/invitations/" + this.get("invitation_id") + "/resend",
				type: "POST"
			}).always(function(a) {
				return function() {
					return $(window).trigger("backbone:completeRequest")
				}
			}(this))
		}, d.prototype.reactivate = function() {
			return $(window).trigger("backbone:startRequest"), $.ajax({
				url: this.url().concat("/reactivate"),
				type: "PUT",
				dataType: "json",
				success: function(a) {
					return function(b) {
						return a.set(b)
					}
				}(this),
				error: function(a) {
					return function() {
						return alert("An error occured while reactivating participant. Reload the page before continuing.")
					}
				}(this)
			}).always(function(a) {
				return function() {
					return $(window).trigger("backbone:completeRequest")
				}
			}(this))
		}, d
	}(Backbone.Model), root.ParticipantCollection = function(a) {
		function c() {
			return c.__super__.constructor.apply(this, arguments)
		}
		return b(c, a), c.prototype.model = root.Participant, c.prototype.validationError = null, c.prototype.initialize = function(a, b) {
			return b || (b = {}), this.url = b.urlRoot, this.leaveUnsorted = b.leaveUnsorted || !1
		}, c.prototype.comparator = function(a) {
			if (!this.leaveUnsorted) return a.get("seed")
		}, c.prototype.numberOfByesRequired = function() {
			var a, b;
			return a = _.select(this.models, function(a) {
				return !a.get("on_waiting_list")
			}).length, b = Math.ceil(Math.log(a) / Math.LN2), Math.pow(2, b) - a
		}, c.prototype.numberOfByesRequiredSingular = function() {
			return this.numberOfByesRequired() === 1
		}, c.prototype.toJSON = function() {
			return _.extend(c.__super__.toJSON.apply(this, arguments), {
				numberOfByesRequired: this.numberOfByesRequired(),
				numberOfByesRequiredSingular: this.numberOfByesRequiredSingular()
			})
		}, c.prototype.bulkAdd = function(a, b, c) {
			var d;
			c == null && (c = {}), d = this.toJSON();
			if (a.length) {
				$.each(a, function(a) {
					return function(b, c) {
						var e;
						return e = new root.Participant(c, {
							collection: a
						}), a.validationError = e.validate(), a.validationError ? (a.trigger("invalid", a), a.reset(d, {
							silent: !0
						}), !1) : a.add(e, {
							silent: !0
						})
					}
				}(this));
				if (!this.validationError) return $.ajax({
					url: this.url.concat("/bulk_add"),
					type: "POST",
					data: {
						bulk_participants: b
					},
					success: function(a) {
						return function(b) {
							return _.each(b.participants, function(b, c) {
								return b = _.extend(b, {
									_appendHtmlEffect: !0
								}), setTimeout(function() {
									return a.add(new root.Participant(b))
								}, c * 25)
							}), (c.onSuccess || $.noop)()
						}
					}(this),
					error: function(a) {
						return function(b) {
							return a.validationError = $.parseJSON(b.responseText).message, a.reset(d, {
								silent: !0
							}), a.trigger("invalid", a)
						}
					}(this)
				})
			}
		}, c.prototype.canShuffle = function() {
			return this.length > 1
		}, c.prototype.shuffleSeeds = function() {
			return $.ajax({
				url: this.url.concat("/update_seeds"),
				data: {
					ids: _.map(this.models, function(a) {
						return a.id
					})
				},
				type: "POST",
				success: function(a) {
					return function(b) {
						return a.reset(b)
					}
				}(this),
				error: function(a) {
					return function() {
						return alert("An error occured while shuffling seeds. Reload the page before continuing.")
					}
				}(this)
			})
		}, c
	}(Backbone.Collection)
}.call(this),
function() {
	var a = function(a, c) {
		function e() {
			this.constructor = a
		}
		for (var d in c) b.call(c, d) && (a[d] = c[d]);
		return e.prototype = c.prototype, a.prototype = new e, a.__super__ = c.prototype, a
	}, b = {}.hasOwnProperty;
	root.Tournament = function(b) {
		function c() {
			return c.__super__.constructor.apply(this, arguments)
		}
		return a(c, b), c.prototype.urlRoot = "/tournaments/", c.prototype.initialize = function(a) {
			return this.participantCollection = new root.ParticipantCollection(this.get("participants"), {
				urlRoot: this.url() + "/participants",
				leaveUnsorted: this.get("group_stages_were_started")
			})
		}, c.prototype.convertToTeams = function(a, b) {
			return $(window).trigger("backbone:startRequest"), $.ajax(_.extend({
				url: this.url().concat("/convert_to_teams"),
				type: "POST",
				data: {
					size: a
				},
				success: function(a) {
					return function(a) {
						return (b.success || $.noop)(a)
					}
				}(this),
				error: function(a) {
					return function() {
						return alert("An error occured while converting to teams. Reload the page before continuing.")
					}
				}(this)
			}, b)).always(function(a) {
				return function() {
					return $(window).trigger("backbone:completeRequest")
				}
			}(this))
		}, c
	}(Backbone.Model)
}.call(this),
function() {
	var a = function(a, c) {
		function e() {
			this.constructor = a
		}
		for (var d in c) b.call(c, d) && (a[d] = c[d]);
		return e.prototype = c.prototype, a.prototype = new e, a.__super__ = c.prototype, a
	}, b = {}.hasOwnProperty;
	root.SortableCollectionView = function(b) {
		function c() {
			return c.__super__.constructor.apply(this, arguments)
		}
		return a(c, b), c.prototype.onRender = function() {
			return this._initializeSortable()
		}, c.prototype.onAfterItemAdded = function() {
			return this._initializeSortable()
		}, c.prototype.onItemRemoved = function() {
			return this._initializeSortable()
		}, c.prototype._initializeSortable = function() {
			return this._allowSortable() ? this.$el.addClass("sortable").sortable(_.extend({
				axis: "y",
				cursor: "move",
				update: function(a) {
					return function(b, c) {
						return a._onSortableUpdate(b, c)
					}
				}(this)
			}, this._sortableOptions())) : this.$el.removeClass("sortable").sortable().sortable("destroy")
		}, c.prototype._sortableOptions = function() {
			return {}
		}, c.prototype._allowSortable = function() {
			return this._collectionHasMultipleModels()
		}, c.prototype._onSortableUpdate = function(a, b) {
			return true;
		}, c.prototype._collectionHasMultipleModels = function() {
			return this.collection.models.length > 1
		}, c
	}(Marionette.CollectionView)
}.call(this),
function() {
	var a = function(a, b) {
		return function() {
			return a.apply(b, arguments)
		}
	}, b = function(a, b) {
		function e() {
			this.constructor = a
		}
		for (var d in b) c.call(b, d) && (a[d] = b[d]);
		return e.prototype = b.prototype, a.prototype = new e, a.__super__ = b.prototype, a
	}, c = {}.hasOwnProperty;
	root.ParticipantModelView = function(c) {
		function d() {
			return this._hideInlineExceptions = a(this._hideInlineExceptions, this), this._handleInlineException = a(this._handleInlineException, this), this._editParticipant = a(this._editParticipant, this), this._reactivate = a(this._reactivate, this), this._undoCheckIn = a(this._undoCheckIn, this), this._checkIn = a(this._checkIn, this), this._resendInvitation = a(this._resendInvitation, this), d.__super__.constructor.apply(this, arguments)
		}
		return b(d, c), d.prototype.template = "#participant-model-template", d.prototype.tagName = "li", d.prototype.className = "participant-model", d.prototype.events = {
			"click .participant-remove": "_removeParticipant",
			"click .participant-modify": "_toggleInlineForm",
			"click .participant-resend-invite": "_resendInvitation",
			"click .participant-check-in": "_checkIn",
			"click .participant-undo-check-in": "_undoCheckIn",
			"click .participant-reactivate": "_reactivate",
			"submit .inline-edit": "_editParticipant"
		}, d.prototype.initialize = function(a) {
			this.application = a.application;
      this.listenTo(this.model, "invalid", this._handleInlineException);
      this.listenTo(this.model, "sync", this.render);
		}, d.prototype.serializeData = function() {
			return _.extend(this.model.toJSON(), {
				teams: this.application.tournament.get("teams")
			})
		}
    d.prototype.onRender = function() {
			this.model.get("on_waiting_list") && this.$el.addClass("waiting_list");
      this.$el.data("id", this.model.get("id"));
      $(".tip", this.$el).tooltip();
			if (this.application.tournament.get("teams")) {
        return $(".inline-participant_email", this.$el).typeahead({
				  name: "teams",
				  remote: "/teams.json?term=%QUERY",
				  limit: 10
			  });
      }
		}
    d.prototype.onClose = function() {
			return $(".tip", this.$el).tooltip("destroy");
		}
    d.prototype._remove = function() {
			this.model.get("_removeEffect") && this.$el.effect("blind", 100);
      return d.__super__._remove.apply(this, arguments);
		}
    d.prototype._removeParticipant = function() {
			var a, b;
			b = {
				error: function(a) {
					return function() {
						return alert("An error occured while removing this participant. Reload the page before continuing.")
					}
				}(this)
			};
			if (!this.application.tournament.get("participants_locked")) {
        this.model.set({_removeEffect: true}, {silent: true});
        return this.model.destroy(_.extend(b, {
				  success: function(a) {
					  return function(b, c) {
						  return a.collection.reset(c), a.collection.trigger("destroy")
					  }
				  }(this)
			  }));
      }
			confirmMessage = "Are you sure you want to remove this participant? The participant's open matches will be forfeited.";
			if (confirm(confirmMessage)) {
        return this.model.remove(b);
      }
		}
    d.prototype._toggleInlineForm = function(event) {
			var hiddenForm, c;
			event.preventDefault();
      hiddenForm = $(".inline-edit", this.$el);
      fadeClass = hiddenForm.is(":visible") ? "fadeOut" : "fadeIn"
      this._hideInlineExceptions();
      hiddenForm.parents("ol:first").find(".inline-edit").hide();
      hiddenForm[fadeClass]("fast");
      return hiddenForm.find(":input:first").focus();
		},
    d.prototype._resendInvitation = function(a) {
			return a.preventDefault(), confirm("Are you sure you want to resend this invitation?") ? $.when(this.model.resendInvitation()).always(function(a) {
				return function() {
					return $(".participant-resend-invite", a.$el).tooltip("hide").attr("data-original-title", "Invitation resent").tooltip("fixTitle").tooltip("show").addClass("icon-ok not-clickable").removeClass("icon-exclamation-sign participant-resend-invite")
				}
			}(this)) : !1
		}, d.prototype._checkIn = function(a) {
			return a.preventDefault(), $.when(this.model.checkIn()).done(function(a) {
				return function() {
					return $(".participant-check-in", a.$el).tooltip("hide").attr("data-original-title", "Checked in. Click to undo.").tooltip("fixTitle").tooltip("show").addClass("icon-ok participant-undo-check-in").removeClass("icon-time participant-check-in")
				}
			}(this))
		}, d.prototype._undoCheckIn = function(a) {
			return a.preventDefault(), $.when(this.model.undoCheckIn()).done(function(a) {
				return function() {
					return $(".participant-undo-check-in", a.$el).tooltip("hide").attr("data-original-title", "Check in").tooltip("fixTitle").tooltip("show").removeClass("icon-ok participant-undo-check-in").addClass("icon-time participant-check-in")
				}
			}(this))
		}, d.prototype._reactivate = function(a) {
			var b;
			a.preventDefault();
			if (this.application.tournament.get("participants_locked")) {
				b = "Are you sure you want to reactivate this participant? You'll need to manually reopen any matches that were previously forfeited.";
				if (!confirm(b)) return !1
			}
			return $.when(this.model.reactivate()).done(function(a) {
				return function() {
					return a.model.trigger("sync", a.model, a)
				}
			}(this))
		}, d.prototype._editParticipant = function(a) {
			var b, c;
			a.preventDefault();
			if (this.model.get("participatable_or_invitation_attached")) {
				c = "Are you sure you want to sub-in this participant? The removed person will be notified, as well as the sub if an email address or username is provided.";
				if (!confirm(c)) return !1
			}
			return b = {
				name: $(".inline-participant_name", this.$el).val(),
				invite_name_or_email: $(".inline-participant_email", this.$el).val()
			}, this.model.save(b, {
				error: function(a) {
					return function(b, c) {
						return a.model.validationError = $.parseJSON(c.responseText).message, a.model.trigger("invalid", a.model, a)
					}
				}(this)
			})
		}
    d.prototype._handleInlineException = function(a) {
			return a.validationError.length ?
        ($(".error-message", this.$el).text(a.validationError),
         $(".error-description", this.$el).slideDown("fast")) :
        this._hideInlineExceptions()
		}, d.prototype._hideInlineExceptions = function() {
			return $(".error-message", this.$el).text(""), $(".error-description", this.$el).slideUp("fast")
		}, d
	}(Marionette.ItemView)
}.call(this),
function() {
	var a = function(a, c) {
		function e() {
			this.constructor = a
		}
		for (var d in c) b.call(c, d) && (a[d] = c[d]);
		return e.prototype = c.prototype, a.prototype = new e, a.__super__ = c.prototype, a
	}, b = {}.hasOwnProperty;
	root.ParticipantEmptyView = function(b) {
		function c() {
			return c.__super__.constructor.apply(this, arguments)
		}
		return a(c, b), c.prototype.tagName = "li", c.prototype.className = "empty", c.prototype.template = "#participant-empty-template", c.prototype.initialize = function(a) {
			return this.application = a.application
		}, c
	}(Marionette.ItemView)
}.call(this),
function() {
	var a = function(a, c) {
		function e() {
			this.constructor = a
		}
		for (var d in c) b.call(c, d) && (a[d] = c[d]);
		return e.prototype = c.prototype, a.prototype = new e, a.__super__ = c.prototype, a
	}, b = {}.hasOwnProperty;
	root.ParticipantCollectionView = function(b) {
		function c() {
			return c.__super__.constructor.apply(this, arguments)
		}
		a(c, b)
    c.prototype.itemView = root.ParticipantModelView;
    c.prototype.emptyView = root.ParticipantEmptyView
    c.prototype.tagName = "ol"
    c.prototype.className = "participant-list editable"
    c.prototype.id = "participants"

    c.prototype.initialize = function(a) {
			return this.application = a.application;
		}
    c.prototype.itemViewOptions = function(a, b) {
			return {
				application: this.application,
				collection: this.collection
			}
		}
    c.prototype.appendHtml = function(a, b, c) {
			a.$el.append(b.el);
			if (b.model.get("_appendHtmlEffect")) return b.model.unset("_appendHtmlEffect", {
				silent: !0
			}), $(b.el).effect("highlight", {
				color: "#ff8000"
			}, 500)
		}
    c.prototype.canShuffle = function() {
			return this._allowSortable()
		}
    c.prototype.shuffle = function() {
			return this.collection.shuffleSeeds()
		}
    c.prototype._sortableOptions = function() {
			return {
				items: ".participant-model"
			}
		}
    c.prototype._allowSortable = function() {
			return c.__super__._allowSortable.apply(this, arguments) && this.application.tournament.get("participants_swappable") && !this.application.tournament.get("group_stages_were_started")
		}
    c.prototype._onSortableUpdate = function(_, ui) {
			var movingElement, movingId, model, indexInc;
			movingElement = $(_.first(ui.item));
      indexInc = movingElement.index(".participant-model") + 1
      movingId = movingElement.data("id")
      model = _.find(this.collection.models, function(a) {
				return a.get("id") === movingId
			}),
      model.updateSeed(indexInc)
		}, c
	}(root.SortableCollectionView)
}.call(this),
function() {
	var a = function(a, b) {
		return function() {
			return a.apply(b, arguments)
		}
	}, b = function(a, b) {
		function e() {
			this.constructor = a
		}
		for (var d in b) c.call(b, d) && (a[d] = b[d]);
		return e.prototype = b.prototype, a.prototype = new e, a.__super__ = b.prototype, a
	}, c = {}.hasOwnProperty;
	root.ParticipantFormView = function(c) {
		function d() {
			return this._displayValidationError = a(this._displayValidationError, this), this._focusForm = a(this._focusForm, this), d.__super__.constructor.apply(this, arguments)
		}
		return b(d, c), d.prototype.template = "#participant-form-template", d.prototype.initialize = function(a) {
			return this.application = a.application
		}, d.prototype.collectionEvents = {
			destroy: "render"
		}, d.prototype.events = {
			"click #challonge_toggle_bulk_add": "toggleBulkAdd",
			"click #toggle-team-conversion": "toggleTeamConversion",
			"submit .team-conversion-form": "convertToTeams",
			"submit #challonge_bulk_participant_form": "addBulkParticipants",
			"submit #new_participant": "addParticipant"
		}, d.prototype.serializeData = function() {
			return _.extend(this.collection.toJSON(), {
				teams: this.application.tournament.get("teams"),
				team_convertable: this.application.tournament.get("team_convertable")
			})
		}, d.prototype.onShow = function() {
			return this._focusForm()
		}, d.prototype.onRender = function() {
			return $("#email_or_username_field_help", this.$el).popover({
				trigger: "click",
				placement: "top"
			}), $("#bulk_participant_field", this.$el).popover({
				trigger: "focus",
				title: "Add Participants In Bulk",
				content: $("#bulk_participant_field_instructions", this.$el).html(),
				html: !0
			}), this.application.tournament.get("teams") && $("#participant_email", this.$el).typeahead({
				name: "teams",
				remote: "/teams.json?term=%QUERY",
				limit: 10
			}), $(".tip", this.$el).tooltip()
		}, d.prototype.toggleBulkAdd = function(a) {
			var b;
			return b = $("#challonge_bulk_participant_form", this.$el), b.is(":visible") ? (b.hide(), $(a.currentTarget).text("Add in Bulk ►")) : (b.show(), $("textarea", b).focus(), $(a.currentTarget).text("Add in Bulk ▼")), !1
		}, d.prototype.addParticipant = function(a) {
			var b;
			return a.preventDefault(), b = new root.Participant({
				name: $("#participant_name", this.$el).val(),
				invite_name_or_email: $("#participant_email", this.$el).val()
			}, {
				collection: this.collection
			}), this.listenTo(b, "invalid", this._displayValidationError, b, this), $.when(b.save(null, {
				success: function(a) {
					return function(b) {
						return b.set({
							_appendHtmlEffect: !0
						}), a.collection.add(b), a.render(), a._focusForm()
					}
				}(this),
				error: function(a) {
					return function(a, c) {
						return b.validationError = $.parseJSON(c.responseText).message, b.trigger("invalid", b)
					}
				}(this)
			})).then(function(a) {
				return function() {
					return a.stopListening(b)
				}
			}(this))
		}, d.prototype.toggleTeamConversion = function(a) {
			return a.preventDefault(), $("#toggle-team-conversion", this.$el).hide(), $(".team-conversion-form", this.$el).show()
		}, d.prototype.convertToTeams = function(a) {
			var b;
			return a.preventDefault(), b = $(".team-conversion-size", this.$el).val(), this.application.tournament.convertToTeams(b, {
				success: function(a) {
					return function(b) {
						return a.application.tournament.set(b.tournament), a.collection.reset(b.participants), a.render(), a._focusForm()
					}
				}(this)
			})
		}, d.prototype.addBulkParticipants = function(a) {
			var b, c, d;
			return a.preventDefault(), rawParticipants = $("#bulk_participant_field").val(), d = _.compact(rawParticipants.split(/\r?\n/)), c = _.map(d, function(a) {
				return function(a) {
					var b;
					return b = _.map(a.split(","), function(a) {
						return $.trim(a)
					}), {
						name: _.first(b),
						invite_name_or_email: _.last(b)
					}
				}
			}(this)), this.listenTo(this.collection, "invalid", this._displayValidationError, this.collection, this), $.when(this.collection.bulkAdd(c, rawParticipants, {
				onSuccess: function(a) {
					return function() {
						return a.render(), a._focusForm()
					}
				}(this)
			})).then(function(a) {
				return function() {
					return a.stopListening(a.collection)
				}
			}(this))
		}, d.prototype._focusForm = function() {
			return $("#participant_name", this.$el).focus()
		}, d.prototype._displayValidationError = function(a) {
			return a.validationError.length ? ($(".error-message", this.$el).text(a.validationError), $(".error-description", this.$el).slideDown("fast")) : ($(".error-message", this.$el).text(""), $(".error-description", this.$el).slideUp("fast")), setTimeout(function() {
				return $("#bulk_participant_submit").removeAttr("disabled")
			}, 500)
		}, d
	}(Marionette.ItemView)
}.call(this),
function() {
	var a = function(a, c) {
		function e() {
			this.constructor = a
		}
		for (var d in c) b.call(c, d) && (a[d] = c[d]);
		return e.prototype = c.prototype, a.prototype = new e, a.__super__ = c.prototype, a
	}, b = {}.hasOwnProperty;
	root.ParticipantAuxiliaryView = function(b) {
		function c() {
			return c.__super__.constructor.apply(this, arguments)
		}
		return a(c, b), c.prototype.template = "#participant-auxiliary-template", c.prototype.initialize = function(a) {
			return this.application = a.application, this.groupSize = a.groupSize, $(window).bind("backbone:startRequest", _.bind(this.startLoaderGif, this)), $(window).bind("backbone:completeRequest", _.bind(this.stopLoaderGif, this))
		}, c.prototype.events = {
			"click #shuffle_link": "shuffleSeeds"
		}, c.prototype.collectionEvents = {
			add: "render",
			remove: "render",
			reset: "render"
		}, c.prototype.serializeData = function() {
			return {
				participantsLocked: this.application.tournament.get("participants_locked"),
				showShuffle: this.collection.canShuffle(),
				listGroupStyles: this.listGroupStyles()
			}
		}, c.prototype.listGroupStyles = function() {
			var a, b, c, d, e;
			a = this.application.groupSize, b = [];
			if (a === 0) return null;
			for (c = d = 0, e = a; d <= 255; c = d += e) b.push("ol#participants li:nth-child(n+" + (c + 1) + "):nth-child(-n+" + (c + a) + ") { border-right: 3px solid " + this.groupColor(c / a) + "; }");
			return b.join("\n")
		}, c.prototype.groupColor = function(a) {
			var b;
			return b = ["#ff7324", "#249bff", "#eedd34", "#ff24de", "#ff3434", "#999999", "#8554cc", "#926239", "#33aa33"], b[a % b.length]
		}, c.prototype.shuffleSeeds = function(a) {
			a.preventDefault();
			if (this.collection.canShuffle() && confirm("Continue with seed shuffling?")) return this.collection.shuffleSeeds()
		}, c.prototype.startLoaderGif = function(a) {
			return $(".loader-gif", this.$el).show(), $(".saved-state", this.$el).hide()
		}, c.prototype.stopLoaderGif = function(a) {
			return $(".loader-gif", this.$el).hide(), $(".saved-state", this.$el).show()
		}, c
	}(Marionette.ItemView)
}.call(this),
function() {
	var a = function(a, c) {
		function e() {
			this.constructor = a
		}
		for (var d in c) b.call(c, d) && (a[d] = c[d]);
		return e.prototype = c.prototype, a.prototype = new e, a.__super__ = c.prototype, a
	}, b = {}.hasOwnProperty;
	root.ParticipantManagementLayout = function(b) {
		function c() {
			return c.__super__.constructor.apply(this, arguments)
		}
		return a(c, b), c.prototype.template = "#participant-management-template", c.prototype.regions = {
			controlsRegion: ".yield-auxiliary-controls",
			subViewRegion: ".yield-sub-view",
			formRegion: ".yield-participant-form"
		}, c
	}(Marionette.Layout)
}.call(this),
function() {
	var Mixin = function(a, c) {
		function e() {
			this.constructor = a
		}
		for (var d in c) b.call(c, d) && (a[d] = c[d]);
		return e.prototype = c.prototype, a.prototype = new e, a.__super__ = c.prototype, a
	}, b = {}.hasOwnProperty;
	root.ParticipantManagementApplication = function(backboneApplication) {
		function constructor(a) {
			constructor.__super__.constructor.apply(this, arguments), this.participantManagementLayout = new root.ParticipantManagementLayout, this.tournament = a.tournament, this.groupSize = a.groupSize, this.addRegions({
				mainRegion: "#participant-management"
			}), this.addInitializer(function() {
				a = {
					application: this,
					collection: this.tournament.participantCollection
				}, this.subView = new root.ParticipantCollectionView(a), this.formView = new root.ParticipantFormView(a), this.controlsView = new root.ParticipantAuxiliaryView(a), this.mainRegion.show(this.participantManagementLayout), this.participantManagementLayout.controlsRegion.show(this.controlsView), this.participantManagementLayout.subViewRegion.show(this.subView);
				if (!this.tournament.get("participants_locked")) return this.participantManagementLayout.formRegion.show(this.formView)
			})
		}
		return Mixin(constructor, backboneApplication), constructor
	}(Backbone.Marionette.Application)
}.call(this);
