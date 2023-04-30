import { g as getDefaultExportFromCjs, r as requireBindings } from './bindings-f360734c.js';
import require$$0 from 'stream';
import require$$2 from 'util';
import require$$1 from 'tty';
import require$$0$1 from 'os';
import require$$1$1 from 'events';
import require$$0$2 from 'fs';
import require$$0$3 from 'child_process';
import 'path';

var lib$a;
var hasRequiredLib$a;

function requireLib$a () {
	if (hasRequiredLib$a) return lib$a;
	hasRequiredLib$a = 1;
	const { Transform } = require$$0;

	/**
	 * A transform stream that emits data each time a byte sequence is received.
	 * @extends Transform
	 * @summary To use the `Delimiter` parser, provide a delimiter as a string, buffer, or array of bytes. Runs in O(n) time.
	 * @example
	const SerialPort = require('serialport')
	const Delimiter = require('@serialport/parser-delimiter')
	const port = new SerialPort('/dev/tty-usbserial1')
	const parser = port.pipe(new Delimiter({ delimiter: '\n' }))
	parser.on('data', console.log)
	 */
	class DelimiterParser extends Transform {
	  constructor(options = {}) {
	    super(options);

	    if (options.delimiter === undefined) {
	      throw new TypeError('"delimiter" is not a bufferable object')
	    }

	    if (options.delimiter.length === 0) {
	      throw new TypeError('"delimiter" has a 0 or undefined length')
	    }

	    this.includeDelimiter = options.includeDelimiter !== undefined ? options.includeDelimiter : false;
	    this.delimiter = Buffer.from(options.delimiter);
	    this.buffer = Buffer.alloc(0);
	  }

	  _transform(chunk, encoding, cb) {
	    let data = Buffer.concat([this.buffer, chunk]);
	    let position;
	    while ((position = data.indexOf(this.delimiter)) !== -1) {
	      this.push(data.slice(0, position + (this.includeDelimiter ? this.delimiter.length : 0)));
	      data = data.slice(position + this.delimiter.length);
	    }
	    this.buffer = data;
	    cb();
	  }

	  _flush(cb) {
	    this.push(this.buffer);
	    this.buffer = Buffer.alloc(0);
	    cb();
	  }
	}

	lib$a = DelimiterParser;
	return lib$a;
}

var lib$9;
var hasRequiredLib$9;

function requireLib$9 () {
	if (hasRequiredLib$9) return lib$9;
	hasRequiredLib$9 = 1;
	const DelimiterParser = requireLib$a();

	/**
	 *  A transform stream that emits data after a newline delimiter is received.
	 * @summary To use the `Readline` parser, provide a delimiter (defaults to `\n`). Data is emitted as string controllable by the `encoding` option (defaults to `utf8`).
	 * @extends DelimiterParser
	 * @example
	const SerialPort = require('serialport')
	const Readline = require('@serialport/parser-readline')
	const port = new SerialPort('/dev/tty-usbserial1')
	const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
	parser.on('data', console.log)
	*/
	class ReadLineParser extends DelimiterParser {
	  constructor(options) {
	    const opts = {
	      delimiter: Buffer.from('\n', 'utf8'),
	      encoding: 'utf8',
	      ...options,
	    };

	    if (typeof opts.delimiter === 'string') {
	      opts.delimiter = Buffer.from(opts.delimiter, opts.encoding);
	    }

	    super(opts);
	  }
	}

	lib$9 = ReadLineParser;
	return lib$9;
}

var libExports$2 = requireLib$9();
var Readline = /*@__PURE__*/getDefaultExportFromCjs(libExports$2);

var srcExports = {};
var src = {
  get exports(){ return srcExports; },
  set exports(v){ srcExports = v; },
};

var browserExports = {};
var browser = {
  get exports(){ return browserExports; },
  set exports(v){ browserExports = v; },
};

/**
 * Helpers.
 */

var ms;
var hasRequiredMs;

function requireMs () {
	if (hasRequiredMs) return ms;
	hasRequiredMs = 1;
	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} [options]
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	ms = function(val, options) {
	  options = options || {};
	  var type = typeof val;
	  if (type === 'string' && val.length > 0) {
	    return parse(val);
	  } else if (type === 'number' && isFinite(val)) {
	    return options.long ? fmtLong(val) : fmtShort(val);
	  }
	  throw new Error(
	    'val is not a non-empty string or a valid number. val=' +
	      JSON.stringify(val)
	  );
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = String(str);
	  if (str.length > 100) {
	    return;
	  }
	  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
	    str
	  );
	  if (!match) {
	    return;
	  }
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'weeks':
	    case 'week':
	    case 'w':
	      return n * w;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	    default:
	      return undefined;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtShort(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (msAbs >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (msAbs >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (msAbs >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtLong(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return plural(ms, msAbs, d, 'day');
	  }
	  if (msAbs >= h) {
	    return plural(ms, msAbs, h, 'hour');
	  }
	  if (msAbs >= m) {
	    return plural(ms, msAbs, m, 'minute');
	  }
	  if (msAbs >= s) {
	    return plural(ms, msAbs, s, 'second');
	  }
	  return ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, msAbs, n, name) {
	  var isPlural = msAbs >= n * 1.5;
	  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
	}
	return ms;
}

var common;
var hasRequiredCommon;

function requireCommon () {
	if (hasRequiredCommon) return common;
	hasRequiredCommon = 1;
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 */

	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = requireMs();
		createDebug.destroy = destroy;

		Object.keys(env).forEach(key => {
			createDebug[key] = env[key];
		});

		/**
		* The currently active debug mode names, and names to skip.
		*/

		createDebug.names = [];
		createDebug.skips = [];

		/**
		* Map of special "%n" handling functions, for the debug "format" argument.
		*
		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		*/
		createDebug.formatters = {};

		/**
		* Selects a color for a debug namespace
		* @param {String} namespace The namespace string for the debug instance to be colored
		* @return {Number|String} An ANSI color code for the given namespace
		* @api private
		*/
		function selectColor(namespace) {
			let hash = 0;

			for (let i = 0; i < namespace.length; i++) {
				hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
				hash |= 0; // Convert to 32bit integer
			}

			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;

		/**
		* Create a debugger with the given `namespace`.
		*
		* @param {String} namespace
		* @return {Function}
		* @api public
		*/
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;
			let namespacesCache;
			let enabledCache;

			function debug(...args) {
				// Disabled?
				if (!debug.enabled) {
					return;
				}

				const self = debug;

				// Set `diff` timestamp
				const curr = Number(new Date());
				const ms = curr - (prevTime || curr);
				self.diff = ms;
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;

				args[0] = createDebug.coerce(args[0]);

				if (typeof args[0] !== 'string') {
					// Anything else let's inspect with %O
					args.unshift('%O');
				}

				// Apply any `formatters` transformations
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					// If we encounter an escaped % then don't increase the array index
					if (match === '%%') {
						return '%';
					}
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === 'function') {
						const val = args[index];
						match = formatter.call(self, val);

						// Now we need to remove `args[index]` since it's inlined in the `format`
						args.splice(index, 1);
						index--;
					}
					return match;
				});

				// Apply env-specific formatting (colors, etc.)
				createDebug.formatArgs.call(self, args);

				const logFn = self.log || createDebug.log;
				logFn.apply(self, args);
			}

			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

			Object.defineProperty(debug, 'enabled', {
				enumerable: true,
				configurable: false,
				get: () => {
					if (enableOverride !== null) {
						return enableOverride;
					}
					if (namespacesCache !== createDebug.namespaces) {
						namespacesCache = createDebug.namespaces;
						enabledCache = createDebug.enabled(namespace);
					}

					return enabledCache;
				},
				set: v => {
					enableOverride = v;
				}
			});

			// Env-specific initialization logic for debug instances
			if (typeof createDebug.init === 'function') {
				createDebug.init(debug);
			}

			return debug;
		}

		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}

		/**
		* Enables a debug mode by namespaces. This can include modes
		* separated by a colon and wildcards.
		*
		* @param {String} namespaces
		* @api public
		*/
		function enable(namespaces) {
			createDebug.save(namespaces);
			createDebug.namespaces = namespaces;

			createDebug.names = [];
			createDebug.skips = [];

			let i;
			const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
			const len = split.length;

			for (i = 0; i < len; i++) {
				if (!split[i]) {
					// ignore empty strings
					continue;
				}

				namespaces = split[i].replace(/\*/g, '.*?');

				if (namespaces[0] === '-') {
					createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
				} else {
					createDebug.names.push(new RegExp('^' + namespaces + '$'));
				}
			}
		}

		/**
		* Disable debug output.
		*
		* @return {String} namespaces
		* @api public
		*/
		function disable() {
			const namespaces = [
				...createDebug.names.map(toNamespace),
				...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
			].join(',');
			createDebug.enable('');
			return namespaces;
		}

		/**
		* Returns true if the given mode name is enabled, false otherwise.
		*
		* @param {String} name
		* @return {Boolean}
		* @api public
		*/
		function enabled(name) {
			if (name[name.length - 1] === '*') {
				return true;
			}

			let i;
			let len;

			for (i = 0, len = createDebug.skips.length; i < len; i++) {
				if (createDebug.skips[i].test(name)) {
					return false;
				}
			}

			for (i = 0, len = createDebug.names.length; i < len; i++) {
				if (createDebug.names[i].test(name)) {
					return true;
				}
			}

			return false;
		}

		/**
		* Convert regexp to namespace
		*
		* @param {RegExp} regxep
		* @return {String} namespace
		* @api private
		*/
		function toNamespace(regexp) {
			return regexp.toString()
				.substring(2, regexp.toString().length - 2)
				.replace(/\.\*\?$/, '*');
		}

		/**
		* Coerce `val`.
		*
		* @param {Mixed} val
		* @return {Mixed}
		* @api private
		*/
		function coerce(val) {
			if (val instanceof Error) {
				return val.stack || val.message;
			}
			return val;
		}

		/**
		* XXX DO NOT USE. This is a temporary stub function.
		* XXX It WILL be removed in the next major release.
		*/
		function destroy() {
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}

		createDebug.enable(createDebug.load());

		return createDebug;
	}

	common = setup;
	return common;
}

/* eslint-env browser */

var hasRequiredBrowser;

function requireBrowser () {
	if (hasRequiredBrowser) return browserExports;
	hasRequiredBrowser = 1;
	(function (module, exports) {
		/**
		 * This is the web browser implementation of `debug()`.
		 */

		exports.formatArgs = formatArgs;
		exports.save = save;
		exports.load = load;
		exports.useColors = useColors;
		exports.storage = localstorage();
		exports.destroy = (() => {
			let warned = false;

			return () => {
				if (!warned) {
					warned = true;
					console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
				}
			};
		})();

		/**
		 * Colors.
		 */

		exports.colors = [
			'#0000CC',
			'#0000FF',
			'#0033CC',
			'#0033FF',
			'#0066CC',
			'#0066FF',
			'#0099CC',
			'#0099FF',
			'#00CC00',
			'#00CC33',
			'#00CC66',
			'#00CC99',
			'#00CCCC',
			'#00CCFF',
			'#3300CC',
			'#3300FF',
			'#3333CC',
			'#3333FF',
			'#3366CC',
			'#3366FF',
			'#3399CC',
			'#3399FF',
			'#33CC00',
			'#33CC33',
			'#33CC66',
			'#33CC99',
			'#33CCCC',
			'#33CCFF',
			'#6600CC',
			'#6600FF',
			'#6633CC',
			'#6633FF',
			'#66CC00',
			'#66CC33',
			'#9900CC',
			'#9900FF',
			'#9933CC',
			'#9933FF',
			'#99CC00',
			'#99CC33',
			'#CC0000',
			'#CC0033',
			'#CC0066',
			'#CC0099',
			'#CC00CC',
			'#CC00FF',
			'#CC3300',
			'#CC3333',
			'#CC3366',
			'#CC3399',
			'#CC33CC',
			'#CC33FF',
			'#CC6600',
			'#CC6633',
			'#CC9900',
			'#CC9933',
			'#CCCC00',
			'#CCCC33',
			'#FF0000',
			'#FF0033',
			'#FF0066',
			'#FF0099',
			'#FF00CC',
			'#FF00FF',
			'#FF3300',
			'#FF3333',
			'#FF3366',
			'#FF3399',
			'#FF33CC',
			'#FF33FF',
			'#FF6600',
			'#FF6633',
			'#FF9900',
			'#FF9933',
			'#FFCC00',
			'#FFCC33'
		];

		/**
		 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
		 * and the Firebug extension (any Firefox version) are known
		 * to support "%c" CSS customizations.
		 *
		 * TODO: add a `localStorage` variable to explicitly enable/disable colors
		 */

		// eslint-disable-next-line complexity
		function useColors() {
			// NB: In an Electron preload script, document will be defined but not fully
			// initialized. Since we know we're in Chrome, we'll just detect this case
			// explicitly
			if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
				return true;
			}

			// Internet Explorer and Edge do not support colors.
			if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
				return false;
			}

			// Is webkit? http://stackoverflow.com/a/16459606/376773
			// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
			return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
				// Is firebug? http://stackoverflow.com/a/398120/376773
				(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
				// Is firefox >= v31?
				// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
				(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
				// Double check webkit in userAgent just in case we are in a worker
				(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
		}

		/**
		 * Colorize log arguments if enabled.
		 *
		 * @api public
		 */

		function formatArgs(args) {
			args[0] = (this.useColors ? '%c' : '') +
				this.namespace +
				(this.useColors ? ' %c' : ' ') +
				args[0] +
				(this.useColors ? '%c ' : ' ') +
				'+' + module.exports.humanize(this.diff);

			if (!this.useColors) {
				return;
			}

			const c = 'color: ' + this.color;
			args.splice(1, 0, c, 'color: inherit');

			// The final "%c" is somewhat tricky, because there could be other
			// arguments passed either before or after the %c, so we need to
			// figure out the correct index to insert the CSS into
			let index = 0;
			let lastC = 0;
			args[0].replace(/%[a-zA-Z%]/g, match => {
				if (match === '%%') {
					return;
				}
				index++;
				if (match === '%c') {
					// We only are interested in the *last* %c
					// (the user may have provided their own)
					lastC = index;
				}
			});

			args.splice(lastC, 0, c);
		}

		/**
		 * Invokes `console.debug()` when available.
		 * No-op when `console.debug` is not a "function".
		 * If `console.debug` is not available, falls back
		 * to `console.log`.
		 *
		 * @api public
		 */
		exports.log = console.debug || console.log || (() => {});

		/**
		 * Save `namespaces`.
		 *
		 * @param {String} namespaces
		 * @api private
		 */
		function save(namespaces) {
			try {
				if (namespaces) {
					exports.storage.setItem('debug', namespaces);
				} else {
					exports.storage.removeItem('debug');
				}
			} catch (error) {
				// Swallow
				// XXX (@Qix-) should we be logging these?
			}
		}

		/**
		 * Load `namespaces`.
		 *
		 * @return {String} returns the previously persisted debug modes
		 * @api private
		 */
		function load() {
			let r;
			try {
				r = exports.storage.getItem('debug');
			} catch (error) {
				// Swallow
				// XXX (@Qix-) should we be logging these?
			}

			// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
			if (!r && typeof process !== 'undefined' && 'env' in process) {
				r = process.env.DEBUG;
			}

			return r;
		}

		/**
		 * Localstorage attempts to return the localstorage.
		 *
		 * This is necessary because safari throws
		 * when a user disables cookies/localstorage
		 * and you attempt to access it.
		 *
		 * @return {LocalStorage}
		 * @api private
		 */

		function localstorage() {
			try {
				// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
				// The Browser also has localStorage in the global context.
				return localStorage;
			} catch (error) {
				// Swallow
				// XXX (@Qix-) should we be logging these?
			}
		}

		module.exports = requireCommon()(exports);

		const {formatters} = module.exports;

		/**
		 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
		 */

		formatters.j = function (v) {
			try {
				return JSON.stringify(v);
			} catch (error) {
				return '[UnexpectedJSONParseError]: ' + error.message;
			}
		};
} (browser, browserExports));
	return browserExports;
}

var nodeExports = {};
var node = {
  get exports(){ return nodeExports; },
  set exports(v){ nodeExports = v; },
};

var hasFlag;
var hasRequiredHasFlag;

function requireHasFlag () {
	if (hasRequiredHasFlag) return hasFlag;
	hasRequiredHasFlag = 1;

	hasFlag = (flag, argv = process.argv) => {
		const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
		const position = argv.indexOf(prefix + flag);
		const terminatorPosition = argv.indexOf('--');
		return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
	};
	return hasFlag;
}

var supportsColor_1;
var hasRequiredSupportsColor;

function requireSupportsColor () {
	if (hasRequiredSupportsColor) return supportsColor_1;
	hasRequiredSupportsColor = 1;
	const os = require$$0$1;
	const tty = require$$1;
	const hasFlag = requireHasFlag();

	const {env} = process;

	let forceColor;
	if (hasFlag('no-color') ||
		hasFlag('no-colors') ||
		hasFlag('color=false') ||
		hasFlag('color=never')) {
		forceColor = 0;
	} else if (hasFlag('color') ||
		hasFlag('colors') ||
		hasFlag('color=true') ||
		hasFlag('color=always')) {
		forceColor = 1;
	}

	if ('FORCE_COLOR' in env) {
		if (env.FORCE_COLOR === 'true') {
			forceColor = 1;
		} else if (env.FORCE_COLOR === 'false') {
			forceColor = 0;
		} else {
			forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
		}
	}

	function translateLevel(level) {
		if (level === 0) {
			return false;
		}

		return {
			level,
			hasBasic: true,
			has256: level >= 2,
			has16m: level >= 3
		};
	}

	function supportsColor(haveStream, streamIsTTY) {
		if (forceColor === 0) {
			return 0;
		}

		if (hasFlag('color=16m') ||
			hasFlag('color=full') ||
			hasFlag('color=truecolor')) {
			return 3;
		}

		if (hasFlag('color=256')) {
			return 2;
		}

		if (haveStream && !streamIsTTY && forceColor === undefined) {
			return 0;
		}

		const min = forceColor || 0;

		if (env.TERM === 'dumb') {
			return min;
		}

		if (process.platform === 'win32') {
			// Windows 10 build 10586 is the first Windows release that supports 256 colors.
			// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
			const osRelease = os.release().split('.');
			if (
				Number(osRelease[0]) >= 10 &&
				Number(osRelease[2]) >= 10586
			) {
				return Number(osRelease[2]) >= 14931 ? 3 : 2;
			}

			return 1;
		}

		if ('CI' in env) {
			if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
				return 1;
			}

			return min;
		}

		if ('TEAMCITY_VERSION' in env) {
			return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
		}

		if (env.COLORTERM === 'truecolor') {
			return 3;
		}

		if ('TERM_PROGRAM' in env) {
			const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

			switch (env.TERM_PROGRAM) {
				case 'iTerm.app':
					return version >= 3 ? 3 : 2;
				case 'Apple_Terminal':
					return 2;
				// No default
			}
		}

		if (/-256(color)?$/i.test(env.TERM)) {
			return 2;
		}

		if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
			return 1;
		}

		if ('COLORTERM' in env) {
			return 1;
		}

		return min;
	}

	function getSupportLevel(stream) {
		const level = supportsColor(stream, stream && stream.isTTY);
		return translateLevel(level);
	}

	supportsColor_1 = {
		supportsColor: getSupportLevel,
		stdout: translateLevel(supportsColor(true, tty.isatty(1))),
		stderr: translateLevel(supportsColor(true, tty.isatty(2)))
	};
	return supportsColor_1;
}

/**
 * Module dependencies.
 */

var hasRequiredNode;

function requireNode () {
	if (hasRequiredNode) return nodeExports;
	hasRequiredNode = 1;
	(function (module, exports) {
		const tty = require$$1;
		const util = require$$2;

		/**
		 * This is the Node.js implementation of `debug()`.
		 */

		exports.init = init;
		exports.log = log;
		exports.formatArgs = formatArgs;
		exports.save = save;
		exports.load = load;
		exports.useColors = useColors;
		exports.destroy = util.deprecate(
			() => {},
			'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
		);

		/**
		 * Colors.
		 */

		exports.colors = [6, 2, 3, 4, 5, 1];

		try {
			// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
			// eslint-disable-next-line import/no-extraneous-dependencies
			const supportsColor = requireSupportsColor();

			if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
				exports.colors = [
					20,
					21,
					26,
					27,
					32,
					33,
					38,
					39,
					40,
					41,
					42,
					43,
					44,
					45,
					56,
					57,
					62,
					63,
					68,
					69,
					74,
					75,
					76,
					77,
					78,
					79,
					80,
					81,
					92,
					93,
					98,
					99,
					112,
					113,
					128,
					129,
					134,
					135,
					148,
					149,
					160,
					161,
					162,
					163,
					164,
					165,
					166,
					167,
					168,
					169,
					170,
					171,
					172,
					173,
					178,
					179,
					184,
					185,
					196,
					197,
					198,
					199,
					200,
					201,
					202,
					203,
					204,
					205,
					206,
					207,
					208,
					209,
					214,
					215,
					220,
					221
				];
			}
		} catch (error) {
			// Swallow - we only care if `supports-color` is available; it doesn't have to be.
		}

		/**
		 * Build up the default `inspectOpts` object from the environment variables.
		 *
		 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
		 */

		exports.inspectOpts = Object.keys(process.env).filter(key => {
			return /^debug_/i.test(key);
		}).reduce((obj, key) => {
			// Camel-case
			const prop = key
				.substring(6)
				.toLowerCase()
				.replace(/_([a-z])/g, (_, k) => {
					return k.toUpperCase();
				});

			// Coerce string value into JS value
			let val = process.env[key];
			if (/^(yes|on|true|enabled)$/i.test(val)) {
				val = true;
			} else if (/^(no|off|false|disabled)$/i.test(val)) {
				val = false;
			} else if (val === 'null') {
				val = null;
			} else {
				val = Number(val);
			}

			obj[prop] = val;
			return obj;
		}, {});

		/**
		 * Is stdout a TTY? Colored output is enabled when `true`.
		 */

		function useColors() {
			return 'colors' in exports.inspectOpts ?
				Boolean(exports.inspectOpts.colors) :
				tty.isatty(process.stderr.fd);
		}

		/**
		 * Adds ANSI color escape codes if enabled.
		 *
		 * @api public
		 */

		function formatArgs(args) {
			const {namespace: name, useColors} = this;

			if (useColors) {
				const c = this.color;
				const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
				const prefix = `  ${colorCode};1m${name} \u001B[0m`;

				args[0] = prefix + args[0].split('\n').join('\n' + prefix);
				args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
			} else {
				args[0] = getDate() + name + ' ' + args[0];
			}
		}

		function getDate() {
			if (exports.inspectOpts.hideDate) {
				return '';
			}
			return new Date().toISOString() + ' ';
		}

		/**
		 * Invokes `util.format()` with the specified arguments and writes to stderr.
		 */

		function log(...args) {
			return process.stderr.write(util.format(...args) + '\n');
		}

		/**
		 * Save `namespaces`.
		 *
		 * @param {String} namespaces
		 * @api private
		 */
		function save(namespaces) {
			if (namespaces) {
				process.env.DEBUG = namespaces;
			} else {
				// If you set a process.env field to null or undefined, it gets cast to the
				// string 'null' or 'undefined'. Just delete instead.
				delete process.env.DEBUG;
			}
		}

		/**
		 * Load `namespaces`.
		 *
		 * @return {String} returns the previously persisted debug modes
		 * @api private
		 */

		function load() {
			return process.env.DEBUG;
		}

		/**
		 * Init logic for `debug` instances.
		 *
		 * Create a new `inspectOpts` object in case `useColors` is set
		 * differently for a particular `debug` instance.
		 */

		function init(debug) {
			debug.inspectOpts = {};

			const keys = Object.keys(exports.inspectOpts);
			for (let i = 0; i < keys.length; i++) {
				debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
			}
		}

		module.exports = requireCommon()(exports);

		const {formatters} = module.exports;

		/**
		 * Map %o to `util.inspect()`, all on a single line.
		 */

		formatters.o = function (v) {
			this.inspectOpts.colors = this.useColors;
			return util.inspect(v, this.inspectOpts)
				.split('\n')
				.map(str => str.trim())
				.join(' ');
		};

		/**
		 * Map %O to `util.inspect()`, allowing multiple lines if needed.
		 */

		formatters.O = function (v) {
			this.inspectOpts.colors = this.useColors;
			return util.inspect(v, this.inspectOpts);
		};
} (node, nodeExports));
	return nodeExports;
}

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

var hasRequiredSrc;

function requireSrc () {
	if (hasRequiredSrc) return srcExports;
	hasRequiredSrc = 1;
	(function (module) {
		if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
			module.exports = requireBrowser();
		} else {
			module.exports = requireNode();
		}
} (src));
	return srcExports;
}

var lib$8;
var hasRequiredLib$8;

function requireLib$8 () {
	if (hasRequiredLib$8) return lib$8;
	hasRequiredLib$8 = 1;
	const stream = require$$0;
	const util = require$$2;
	const debug = requireSrc()('serialport/stream');

	//  VALIDATION
	const DATABITS = Object.freeze([5, 6, 7, 8]);
	const STOPBITS = Object.freeze([1, 1.5, 2]);
	const PARITY = Object.freeze(['none', 'even', 'mark', 'odd', 'space']);
	const FLOWCONTROLS = Object.freeze(['xon', 'xoff', 'xany', 'rtscts']);

	const defaultSettings = Object.freeze({
	  autoOpen: true,
	  endOnClose: false,
	  baudRate: 9600,
	  dataBits: 8,
	  hupcl: true,
	  lock: true,
	  parity: 'none',
	  rtscts: false,
	  stopBits: 1,
	  xany: false,
	  xoff: false,
	  xon: false,
	  highWaterMark: 64 * 1024,
	});

	const defaultSetFlags = Object.freeze({
	  brk: false,
	  cts: false,
	  dtr: true,
	  dts: false,
	  rts: true,
	});

	function allocNewReadPool(poolSize) {
	  const pool = Buffer.allocUnsafe(poolSize);
	  pool.used = 0;
	  return pool
	}

	/**
	 * A callback called with an error or null.
	 * @typedef {function} errorCallback
	 * @param {?error} error
	 */

	/**
	 * A callback called with an error or an object with the modem line values (cts, dsr, dcd).
	 * @typedef {function} modemBitsCallback
	 * @param {?error} error
	 * @param {?object} status
	 * @param {boolean} [status.cts=false]
	 * @param {boolean} [status.dsr=false]
	 * @param {boolean} [status.dcd=false]
	 */

	/**
	 * @typedef {Object} openOptions
	 * @property {boolean} [autoOpen=true] Automatically opens the port on `nextTick`.
	 * @property {number=} [baudRate=9600] The baud rate of the port to be opened. This should match one of the commonly available baud rates, such as 110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, or 115200. Custom rates are supported best effort per platform. The device connected to the serial port is not guaranteed to support the requested baud rate, even if the port itself supports that baud rate.
	 * @property {number} [dataBits=8] Must be one of these: 8, 7, 6, or 5.
	 * @property {number} [highWaterMark=65536] The size of the read and write buffers defaults to 64k.
	 * @property {boolean} [lock=true] Prevent other processes from opening the port. Windows does not currently support `false`.
	 * @property {number} [stopBits=1] Must be one of these: 1 or 2.
	 * @property {string} [parity=none] Must be one of these: 'none', 'even', 'mark', 'odd', 'space'.
	 * @property {boolean} [rtscts=false] flow control setting
	 * @property {boolean} [xon=false] flow control setting
	 * @property {boolean} [xoff=false] flow control setting
	 * @property {boolean} [xany=false] flow control setting
	 * @property {object=} bindingOptions sets binding-specific options
	 * @property {Binding=} binding The hardware access binding. `Bindings` are how Node-Serialport talks to the underlying system. By default we auto detect Windows (`WindowsBinding`), Linux (`LinuxBinding`) and OS X (`DarwinBinding`) and load the appropriate module for your system.
	 * @property {number} [bindingOptions.vmin=1] see [`man termios`](http://linux.die.net/man/3/termios) LinuxBinding and DarwinBinding
	 * @property {number} [bindingOptions.vtime=0] see [`man termios`](http://linux.die.net/man/3/termios) LinuxBinding and DarwinBinding
	 */

	/**
	 * Create a new serial port object for the `path`. In the case of invalid arguments or invalid options, when constructing a new SerialPort it will throw an error. The port will open automatically by default, which is the equivalent of calling `port.open(openCallback)` in the next tick. You can disable this by setting the option `autoOpen` to `false`.
	 * @class SerialPort
	 * @param {string} path - The system path of the serial port you want to open. For example, `/dev/tty.XXX` on Mac/Linux, or `COM1` on Windows.
	 * @param {openOptions=} options - Port configuration options
	 * @param {errorCallback=} openCallback - Called after a connection is opened. If this is not provided and an error occurs, it will be emitted on the port's `error` event. The callback will NOT be called if `autoOpen` is set to `false` in the `openOptions` as the open will not be performed.
	 * @property {number} baudRate The port's baudRate. Use `.update` to change it. Read-only.
	 * @property {object} binding The binding object backing the port. Read-only.
	 * @property {boolean} isOpen `true` if the port is open, `false` otherwise. Read-only. (`since 5.0.0`)
	 * @property {string} path The system path or name of the serial port. Read-only.
	 * @throws {TypeError} When given invalid arguments, a `TypeError` will be thrown.
	 * @emits open
	 * @emits data
	 * @emits close
	 * @emits error
	 * @alias module:serialport
	 */
	function SerialPort(path, options, openCallback) {
	  if (!(this instanceof SerialPort)) {
	    return new SerialPort(path, options, openCallback)
	  }

	  if (options instanceof Function) {
	    openCallback = options;
	    options = {};
	  }

	  const settings = { ...defaultSettings, ...options };

	  stream.Duplex.call(this, {
	    highWaterMark: settings.highWaterMark,
	  });

	  const Binding = settings.binding || SerialPort.Binding;

	  if (!Binding) {
	    throw new TypeError('"Bindings" is invalid pass it as `options.binding` or set it on `SerialPort.Binding`')
	  }

	  if (!path) {
	    throw new TypeError(`"path" is not defined: ${path}`)
	  }

	  if (settings.baudrate) {
	    throw new TypeError(`"baudrate" is an unknown option, did you mean "baudRate"?`)
	  }

	  if (typeof settings.baudRate !== 'number') {
	    throw new TypeError(`"baudRate" must be a number: ${settings.baudRate}`)
	  }

	  if (DATABITS.indexOf(settings.dataBits) === -1) {
	    throw new TypeError(`"databits" is invalid: ${settings.dataBits}`)
	  }

	  if (STOPBITS.indexOf(settings.stopBits) === -1) {
	    throw new TypeError(`"stopbits" is invalid: ${settings.stopbits}`)
	  }

	  if (PARITY.indexOf(settings.parity) === -1) {
	    throw new TypeError(`"parity" is invalid: ${settings.parity}`)
	  }

	  FLOWCONTROLS.forEach(control => {
	    if (typeof settings[control] !== 'boolean') {
	      throw new TypeError(`"${control}" is not boolean: ${settings[control]}`)
	    }
	  });

	  const binding = new Binding({
	    bindingOptions: settings.bindingOptions,
	  });

	  Object.defineProperties(this, {
	    binding: {
	      enumerable: true,
	      value: binding,
	    },
	    path: {
	      enumerable: true,
	      value: path,
	    },
	    settings: {
	      enumerable: true,
	      value: settings,
	    },
	  });

	  this.opening = false;
	  this.closing = false;
	  this._pool = allocNewReadPool(this.settings.highWaterMark);
	  this._kMinPoolSpace = 128;

	  if (this.settings.autoOpen) {
	    this.open(openCallback);
	  }
	}

	util.inherits(SerialPort, stream.Duplex);

	Object.defineProperties(SerialPort.prototype, {
	  isOpen: {
	    enumerable: true,
	    get() {
	      return this.binding.isOpen && !this.closing
	    },
	  },
	  baudRate: {
	    enumerable: true,
	    get() {
	      return this.settings.baudRate
	    },
	  },
	});

	/**
	 * The `error` event's callback is called with an error object whenever there is an error.
	 * @event error
	 */

	SerialPort.prototype._error = function (error, callback) {
	  if (callback) {
	    callback.call(this, error);
	  } else {
	    this.emit('error', error);
	  }
	};

	SerialPort.prototype._asyncError = function (error, callback) {
	  process.nextTick(() => this._error(error, callback));
	};

	/**
	 * The `open` event's callback is called with no arguments when the port is opened and ready for writing. This happens if you have the constructor open immediately (which opens in the next tick) or if you open the port manually with `open()`. See [Useage/Opening a Port](#opening-a-port) for more information.
	 * @event open
	 */

	/**
	 * Opens a connection to the given serial port.
	 * @param {errorCallback=} openCallback - Called after a connection is opened. If this is not provided and an error occurs, it will be emitted on the port's `error` event.
	 * @emits open
	 * @returns {undefined}
	 */
	SerialPort.prototype.open = function (openCallback) {
	  if (this.isOpen) {
	    return this._asyncError(new Error('Port is already open'), openCallback)
	  }

	  if (this.opening) {
	    return this._asyncError(new Error('Port is opening'), openCallback)
	  }

	  this.opening = true;
	  debug('opening', `path: ${this.path}`);
	  this.binding.open(this.path, this.settings).then(
	    () => {
	      debug('opened', `path: ${this.path}`);
	      this.opening = false;
	      this.emit('open');
	      if (openCallback) {
	        openCallback.call(this, null);
	      }
	    },
	    err => {
	      this.opening = false;
	      debug('Binding #open had an error', err);
	      this._error(err, openCallback);
	    }
	  );
	};

	/**
	 * Changes the baud rate for an open port. Throws if you provide a bad argument. Emits an error or calls the callback if the baud rate isn't supported.
	 * @param {object=} options Only supports `baudRate`.
	 * @param {number=} [options.baudRate] The baud rate of the port to be opened. This should match one of the commonly available baud rates, such as 110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, or 115200. Custom rates are supported best effort per platform. The device connected to the serial port is not guaranteed to support the requested baud rate, even if the port itself supports that baud rate.
	 * @param {errorCallback=} [callback] Called once the port's baud rate changes. If `.update` is called without a callback, and there is an error, an error event is emitted.
	 * @returns {undefined}
	 */
	SerialPort.prototype.update = function (options, callback) {
	  if (typeof options !== 'object') {
	    throw TypeError('"options" is not an object')
	  }

	  if (!this.isOpen) {
	    debug('update attempted, but port is not open');
	    return this._asyncError(new Error('Port is not open'), callback)
	  }

	  const settings = { ...defaultSettings, ...options };
	  this.settings.baudRate = settings.baudRate;

	  debug('update', `baudRate: ${settings.baudRate}`);
	  this.binding.update(this.settings).then(
	    () => {
	      debug('binding.update', 'finished');
	      if (callback) {
	        callback.call(this, null);
	      }
	    },
	    err => {
	      debug('binding.update', 'error', err);
	      return this._error(err, callback)
	    }
	  );
	};

	/**
	 * Writes data to the given serial port. Buffers written data if the port is not open.

	The write operation is non-blocking. When it returns, data might still not have been written to the serial port. See `drain()`.

	Some devices, like the Arduino, reset when you open a connection to them. In such cases, immediately writing to the device will cause lost data as they wont be ready to receive the data. This is often worked around by having the Arduino send a "ready" byte that your Node program waits for before writing. You can also often get away with waiting around 400ms.

	If a port is disconnected during a write, the write will error in addition to the `close` event.

	From the [stream docs](https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback) write errors don't always provide the error in the callback, sometimes they use the error event.
	> If an error occurs, the callback may or may not be called with the error as its first argument. To reliably detect write errors, add a listener for the 'error' event.

	In addition to the usual `stream.write` arguments (`String` and `Buffer`), `write()` can accept arrays of bytes (positive numbers under 256) which is passed to `Buffer.from([])` for conversion. This extra functionality is pretty sweet.
	 * @method SerialPort.prototype.write
	 * @param  {(string|array|buffer)} data Accepts a [`Buffer`](http://nodejs.org/api/buffer.html) object, or a type that is accepted by the `Buffer` constructor (e.g. an array of bytes or a string).
	 * @param  {string=} encoding The encoding, if chunk is a string. Defaults to `'utf8'`. Also accepts `'ascii'`, `'base64'`, `'binary'`, and `'hex'` See [Buffers and Character Encodings](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings) for all available options.
	 * @param  {function=} callback Called once the write operation finishes. Data may not yet be flushed to the underlying port. No arguments.
	 * @returns {boolean} `false` if the stream wishes for the calling code to wait for the `'drain'` event to be emitted before continuing to write additional data; otherwise `true`.
	 * @since 5.0.0
	 */
	const superWrite = SerialPort.prototype.write;
	SerialPort.prototype.write = function (data, encoding, callback) {
	  if (Array.isArray(data)) {
	    data = Buffer.from(data);
	  }
	  return superWrite.call(this, data, encoding, callback)
	};

	SerialPort.prototype._write = function (data, encoding, callback) {
	  if (!this.isOpen) {
	    return this.once('open', function afterOpenWrite() {
	      this._write(data, encoding, callback);
	    })
	  }
	  debug('_write', `${data.length} bytes of data`);
	  this.binding.write(data).then(
	    () => {
	      debug('binding.write', 'write finished');
	      callback(null);
	    },
	    err => {
	      debug('binding.write', 'error', err);
	      if (!err.canceled) {
	        this._disconnected(err);
	      }
	      callback(err);
	    }
	  );
	};

	SerialPort.prototype._writev = function (data, callback) {
	  debug('_writev', `${data.length} chunks of data`);
	  const dataV = data.map(write => write.chunk);
	  this._write(Buffer.concat(dataV), null, callback);
	};

	/**
	 * Request a number of bytes from the SerialPort. The `read()` method pulls some data out of the internal buffer and returns it. If no data is available to be read, null is returned. By default, the data is returned as a `Buffer` object unless an encoding has been specified using the `.setEncoding()` method.
	 * @method SerialPort.prototype.read
	 * @param {number=} size Specify how many bytes of data to return, if available
	 * @returns {(string|Buffer|null)} The data from internal buffers
	 * @since 5.0.0
	 */

	/**
	 * Listening for the `data` event puts the port in flowing mode. Data is emitted as soon as it's received. Data is a `Buffer` object with a varying amount of data in it. The `readLine` parser converts the data into string lines. See the [parsers](https://serialport.io/docs/api-parsers-overview) section for more information on parsers, and the [Node.js stream documentation](https://nodejs.org/api/stream.html#stream_event_data) for more information on the data event.
	 * @event data
	 */

	SerialPort.prototype._read = function (bytesToRead) {
	  if (!this.isOpen) {
	    debug('_read', 'queueing _read for after open');
	    this.once('open', () => {
	      this._read(bytesToRead);
	    });
	    return
	  }

	  if (!this._pool || this._pool.length - this._pool.used < this._kMinPoolSpace) {
	    debug('_read', 'discarding the read buffer pool because it is below kMinPoolSpace');
	    this._pool = allocNewReadPool(this.settings.highWaterMark);
	  }

	  // Grab another reference to the pool in the case that while we're
	  // in the thread pool another read() finishes up the pool, and
	  // allocates a new one.
	  const pool = this._pool;
	  // Read the smaller of rest of the pool or however many bytes we want
	  const toRead = Math.min(pool.length - pool.used, bytesToRead);
	  const start = pool.used;

	  // the actual read.
	  debug('_read', `reading`, { start, toRead });
	  this.binding.read(pool, start, toRead).then(
	    ({ bytesRead }) => {
	      debug('binding.read', `finished`, { bytesRead });
	      // zero bytes means read means we've hit EOF? Maybe this should be an error
	      if (bytesRead === 0) {
	        debug('binding.read', 'Zero bytes read closing readable stream');
	        this.push(null);
	        return
	      }
	      pool.used += bytesRead;
	      this.push(pool.slice(start, start + bytesRead));
	    },
	    err => {
	      debug('binding.read', `error`, err);
	      if (!err.canceled) {
	        this._disconnected(err);
	      }
	      this._read(bytesToRead); // prime to read more once we're reconnected
	    }
	  );
	};

	SerialPort.prototype._disconnected = function (err) {
	  if (!this.isOpen) {
	    debug('disconnected aborted because already closed', err);
	    return
	  }
	  debug('disconnected', err);
	  err.disconnected = true;
	  this.close(null, err);
	};

	/**
	 * The `close` event's callback is called with no arguments when the port is closed. In the case of a disconnect it will be called with a Disconnect Error object (`err.disconnected == true`). In the event of a close error (unlikely), an error event is triggered.
	 * @event close
	 */

	/**
	 * Closes an open connection.
	 *
	 * If there are in progress writes when the port is closed the writes will error.
	 * @param {errorCallback} callback Called once a connection is closed.
	 * @param {Error} disconnectError used internally to propagate a disconnect error
	 * @emits close
	 * @returns {undefined}
	 */
	SerialPort.prototype.close = function (callback, disconnectError) {
	  disconnectError = disconnectError || null;

	  if (!this.isOpen) {
	    debug('close attempted, but port is not open');
	    return this._asyncError(new Error('Port is not open'), callback)
	  }

	  this.closing = true;
	  debug('#close');
	  this.binding.close().then(
	    () => {
	      this.closing = false;
	      debug('binding.close', 'finished');
	      this.emit('close', disconnectError);
	      if (this.settings.endOnClose) {
	        this.emit('end');
	      }
	      if (callback) {
	        callback.call(this, disconnectError);
	      }
	    },
	    err => {
	      this.closing = false;
	      debug('binding.close', 'had an error', err);
	      return this._error(err, callback)
	    }
	  );
	};

	/**
	 * Set control flags on an open port. Uses [`SetCommMask`](https://msdn.microsoft.com/en-us/library/windows/desktop/aa363257(v=vs.85).aspx) for Windows and [`ioctl`](http://linux.die.net/man/4/tty_ioctl) for OS X and Linux.
	 * @param {object=} options All options are operating system default when the port is opened. Every flag is set on each call to the provided or default values. If options isn't provided default options is used.
	 * @param {Boolean} [options.brk=false] sets the brk flag
	 * @param {Boolean} [options.cts=false] sets the cts flag
	 * @param {Boolean} [options.dsr=false] sets the dsr flag
	 * @param {Boolean} [options.dtr=true] sets the dtr flag
	 * @param {Boolean} [options.rts=true] sets the rts flag
	 * @param {errorCallback=} callback Called once the port's flags have been set.
	 * @since 5.0.0
	 * @returns {undefined}
	 */
	SerialPort.prototype.set = function (options, callback) {
	  if (typeof options !== 'object') {
	    throw TypeError('"options" is not an object')
	  }

	  if (!this.isOpen) {
	    debug('set attempted, but port is not open');
	    return this._asyncError(new Error('Port is not open'), callback)
	  }

	  const settings = { ...defaultSetFlags, ...options };
	  debug('#set', settings);
	  this.binding.set(settings).then(
	    () => {
	      debug('binding.set', 'finished');
	      if (callback) {
	        callback.call(this, null);
	      }
	    },
	    err => {
	      debug('binding.set', 'had an error', err);
	      return this._error(err, callback)
	    }
	  );
	};

	/**
	 * Returns the control flags (CTS, DSR, DCD) on the open port.
	 * Uses [`GetCommModemStatus`](https://msdn.microsoft.com/en-us/library/windows/desktop/aa363258(v=vs.85).aspx) for Windows and [`ioctl`](http://linux.die.net/man/4/tty_ioctl) for mac and linux.
	 * @param {modemBitsCallback=} callback Called once the modem bits are retrieved.
	 * @returns {undefined}
	 */
	SerialPort.prototype.get = function (callback) {
	  if (!this.isOpen) {
	    debug('get attempted, but port is not open');
	    return this._asyncError(new Error('Port is not open'), callback)
	  }

	  debug('#get');
	  this.binding.get().then(
	    status => {
	      debug('binding.get', 'finished');
	      if (callback) {
	        callback.call(this, null, status);
	      }
	    },
	    err => {
	      debug('binding.get', 'had an error', err);
	      return this._error(err, callback)
	    }
	  );
	};

	/**
	 * Flush discards data received but not read, and written but not transmitted by the operating system. For more technical details, see [`tcflush(fd, TCIOFLUSH)`](http://linux.die.net/man/3/tcflush) for Mac/Linux and [`FlushFileBuffers`](http://msdn.microsoft.com/en-us/library/windows/desktop/aa364439) for Windows.
	 * @param  {errorCallback=} callback Called once the flush operation finishes.
	 * @returns {undefined}
	 */
	SerialPort.prototype.flush = function (callback) {
	  if (!this.isOpen) {
	    debug('flush attempted, but port is not open');
	    return this._asyncError(new Error('Port is not open'), callback)
	  }

	  debug('#flush');
	  this.binding.flush().then(
	    () => {
	      debug('binding.flush', 'finished');
	      if (callback) {
	        callback.call(this, null);
	      }
	    },
	    err => {
	      debug('binding.flush', 'had an error', err);
	      return this._error(err, callback)
	    }
	  );
	};

	/**
	 * Waits until all output data is transmitted to the serial port. After any pending write has completed it calls [`tcdrain()`](http://linux.die.net/man/3/tcdrain) or [FlushFileBuffers()](https://msdn.microsoft.com/en-us/library/windows/desktop/aa364439(v=vs.85).aspx) to ensure it has been written to the device.
	 * @param {errorCallback=} callback Called once the drain operation returns.
	 * @returns {undefined}
	 * @example
	Write the `data` and wait until it has finished transmitting to the target serial port before calling the callback. This will queue until the port is open and writes are finished.

	```js
	function writeAndDrain (data, callback) {
	  port.write(data);
	  port.drain(callback);
	}
	```
	 */
	SerialPort.prototype.drain = function (callback) {
	  debug('drain');
	  if (!this.isOpen) {
	    debug('drain queuing on port open');
	    return this.once('open', () => {
	      this.drain(callback);
	    })
	  }
	  this.binding.drain().then(
	    () => {
	      debug('binding.drain', 'finished');
	      if (callback) {
	        callback.call(this, null);
	      }
	    },
	    err => {
	      debug('binding.drain', 'had an error', err);
	      return this._error(err, callback)
	    }
	  );
	};

	/**
	 * The `pause()` method causes a stream in flowing mode to stop emitting 'data' events, switching out of flowing mode. Any data that becomes available remains in the internal buffer.
	 * @method SerialPort.prototype.pause
	 * @see resume
	 * @since 5.0.0
	 * @returns `this`
	 */

	/**
	 * The `resume()` method causes an explicitly paused, `Readable` stream to resume emitting 'data' events, switching the stream into flowing mode.
	 * @method SerialPort.prototype.resume
	 * @see pause
	 * @since 5.0.0
	 * @returns `this`
	 */

	/**
	 * Retrieves a list of available serial ports with metadata. Only the `path` is guaranteed. If unavailable the other fields will be undefined. The `path` is either the path or an identifier (eg `COM1`) used to open the SerialPort.
	 *
	 * We make an effort to identify the hardware attached and have consistent results between systems. Linux and OS X are mostly consistent. Windows relies on 3rd party device drivers for the information and is unable to guarantee the information. On windows If you have a USB connected device can we provide a serial number otherwise it will be `undefined`. The `pnpId` and `locationId` are not the same or present on all systems. The examples below were run with the same Arduino Uno.
	 * @type {function}
	 * @returns {Promise} Resolves with the list of available serial ports.
	 * @example
	```js
	// OSX example port
	{
	  path: '/dev/tty.usbmodem1421',
	  manufacturer: 'Arduino (www.arduino.cc)',
	  serialNumber: '752303138333518011C1',
	  pnpId: undefined,
	  locationId: '14500000',
	  productId: '0043',
	  vendorId: '2341'
	}

	// Linux example port
	{
	  path: '/dev/ttyACM0',
	  manufacturer: 'Arduino (www.arduino.cc)',
	  serialNumber: '752303138333518011C1',
	  pnpId: 'usb-Arduino__www.arduino.cc__0043_752303138333518011C1-if00',
	  locationId: undefined,
	  productId: '0043',
	  vendorId: '2341'
	}

	// Windows example port
	{
	  path: 'COM3',
	  manufacturer: 'Arduino LLC (www.arduino.cc)',
	  serialNumber: '752303138333518011C1',
	  pnpId: 'USB\\VID_2341&PID_0043\\752303138333518011C1',
	  locationId: 'Port_#0003.Hub_#0001',
	  productId: '0043',
	  vendorId: '2341'
	}
	```

	```js
	var SerialPort = require('serialport');

	// promise approach
	SerialPort.list()
	  .then(ports) {...});
	  .catch(err) {...});
	```
	 */
	SerialPort.list = async function (callback) {
	  debug('.list');
	  if (!SerialPort.Binding) {
	    throw new TypeError('No Binding set on `SerialPort.Binding`')
	  }
	  if (callback) {
	    throw new TypeError('SerialPort.list no longer takes a callback and only returns a promise')
	  }
	  return SerialPort.Binding.list()
	};

	lib$8 = SerialPort;
	return lib$8;
}

var libExports$1 = {};
var lib$7 = {
  get exports(){ return libExports$1; },
  set exports(v){ libExports$1 = v; },
};

var lib$6;
var hasRequiredLib$7;

function requireLib$7 () {
	if (hasRequiredLib$7) return lib$6;
	hasRequiredLib$7 = 1;
	const debug = requireSrc()('serialport/binding-abstract');

	/**
	 * @name Binding
	 * @type {AbstractBinding}
	 * @since 5.0.0
	 * @description The `Binding` is how Node-SerialPort talks to the underlying system. By default, we auto detect Windows, Linux and OS X, and load the appropriate module for your system. You can assign `SerialPort.Binding` to any binding you like. Find more by searching at [npm](https://npmjs.org/).
	  Prevent auto loading the default bindings by requiring SerialPort with:
	  ```js
	  var SerialPort = require('@serialport/stream');
	  SerialPort.Binding = MyBindingClass;
	  ```
	 */

	/**
	 * You never have to use `Binding` objects directly. SerialPort uses them to access the underlying hardware. This documentation is geared towards people who are making bindings for different platforms. This class can be inherited from to get type checking for each method.
	 * @class AbstractBinding
	 * @param {object} options options for the binding
	 * @property {boolean} isOpen Required property. `true` if the port is open, `false` otherwise. Should be read-only.
	 * @throws {TypeError} When given invalid arguments, a `TypeError` is thrown.
	 * @since 5.0.0
	 */
	class AbstractBinding {
	  /**
	   * Retrieves a list of available serial ports with metadata. The `path` must be guaranteed, and all other fields should be undefined if unavailable. The `path` is either the path or an identifier (eg `COM1`) used to open the serialport.
	   * @returns {Promise} resolves to an array of port [info objects](#module_serialport--SerialPort.list).
	   */
	  static async list() {
	    debug('list');
	  }

	  constructor(opt = {}) {
	    if (typeof opt !== 'object') {
	      throw new TypeError('"options" is not an object')
	    }
	  }

	  /**
	   * Opens a connection to the serial port referenced by the path.
	   * @param {string} path the path or com port to open
	   * @param {openOptions} options openOptions for the serialport
	   * @returns {Promise} Resolves after the port is opened and configured.
	   * @rejects {TypeError} When given invalid arguments, a `TypeError` is rejected.
	   */
	  async open(path, options) {
	    if (!path) {
	      throw new TypeError('"path" is not a valid port')
	    }

	    if (typeof options !== 'object') {
	      throw new TypeError('"options" is not an object')
	    }
	    debug('open');

	    if (this.isOpen) {
	      throw new Error('Already open')
	    }
	  }

	  /**
	   * Closes an open connection
	   * @returns {Promise} Resolves once the connection is closed.
	   * @rejects {TypeError} When given invalid arguments, a `TypeError` is rejected.
	   */
	  async close() {
	    debug('close');
	    if (!this.isOpen) {
	      throw new Error('Port is not open')
	    }
	  }

	  /**
	   * Request a number of bytes from the SerialPort. This function is similar to Node's [`fs.read`](http://nodejs.org/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback) except it will always return at least one byte.

	The in progress reads must error when the port is closed with an error object that has the property `canceled` equal to `true`. Any other error will cause a disconnection.

	   * @param {buffer} buffer Accepts a [`Buffer`](http://nodejs.org/api/buffer.html) object.
	   * @param {integer} offset The offset in the buffer to start writing at.
	   * @param {integer} length Specifies the maximum number of bytes to read.
	   * @returns {Promise} Resolves with the number of bytes read after a read operation.
	   * @rejects {TypeError} When given invalid arguments, a `TypeError` is rejected.
	   */
	  async read(buffer, offset, length) {
	    if (!Buffer.isBuffer(buffer)) {
	      throw new TypeError('"buffer" is not a Buffer')
	    }

	    if (typeof offset !== 'number' || isNaN(offset)) {
	      throw new TypeError(`"offset" is not an integer got "${isNaN(offset) ? 'NaN' : typeof offset}"`)
	    }

	    if (typeof length !== 'number' || isNaN(length)) {
	      throw new TypeError(`"length" is not an integer got "${isNaN(length) ? 'NaN' : typeof length}"`)
	    }

	    debug('read');
	    if (buffer.length < offset + length) {
	      throw new Error('buffer is too small')
	    }

	    if (!this.isOpen) {
	      throw new Error('Port is not open')
	    }
	  }

	  /**
	   * Write bytes to the SerialPort. Only called when there is no pending write operation.

	The in progress writes must error when the port is closed with an error object that has the property `canceled` equal to `true`. Any other error will cause a disconnection.

	   * @param {buffer} buffer - Accepts a [`Buffer`](http://nodejs.org/api/buffer.html) object.
	   * @returns {Promise} Resolves after the data is passed to the operating system for writing.
	   * @rejects {TypeError} When given invalid arguments, a `TypeError` is rejected.
	   */
	  async write(buffer) {
	    if (!Buffer.isBuffer(buffer)) {
	      throw new TypeError('"buffer" is not a Buffer')
	    }

	    debug('write', buffer.length, 'bytes');
	    if (!this.isOpen) {
	      debug('write', 'error port is not open');

	      throw new Error('Port is not open')
	    }
	  }

	  /**
	   * Changes connection settings on an open port. Only `baudRate` is supported.
	   * @param {object=} options Only supports `baudRate`.
	   * @param {number=} [options.baudRate] If provided a baud rate that the bindings do not support, it should reject.
	   * @returns {Promise} Resolves once the port's baud rate changes.
	   * @rejects {TypeError} When given invalid arguments, a `TypeError` is rejected.
	   */
	  async update(options) {
	    if (typeof options !== 'object') {
	      throw TypeError('"options" is not an object')
	    }

	    if (typeof options.baudRate !== 'number') {
	      throw new TypeError('"options.baudRate" is not a number')
	    }

	    debug('update');
	    if (!this.isOpen) {
	      throw new Error('Port is not open')
	    }
	  }

	  /**
	   * Set control flags on an open port.
	   * @param {object=} options All options are operating system default when the port is opened. Every flag is set on each call to the provided or default values. All options are always provided.
	   * @param {Boolean} [options.brk=false] flag for brk
	   * @param {Boolean} [options.cts=false] flag for cts
	   * @param {Boolean} [options.dsr=false] flag for dsr
	   * @param {Boolean} [options.dtr=true] flag for dtr
	   * @param {Boolean} [options.rts=true] flag for rts
	   * @param {Boolean} [options.lowLatency=false] flag for lowLatency mode on Linux
	   * @returns {Promise} Resolves once the port's flags are set.
	   * @rejects {TypeError} When given invalid arguments, a `TypeError` is rejected.
	   */
	  async set(options) {
	    if (typeof options !== 'object') {
	      throw new TypeError('"options" is not an object')
	    }
	    debug('set');
	    if (!this.isOpen) {
	      throw new Error('Port is not open')
	    }
	  }

	  /**
	   * Get the control flags (CTS, DSR, DCD) on the open port.
	   * @returns {Promise} Resolves with the retrieved flags.
	   * @rejects {TypeError} When given invalid arguments, a `TypeError` is rejected.
	   */
	  async get() {
	    debug('get');
	    if (!this.isOpen) {
	      throw new Error('Port is not open')
	    }
	  }

	  /**
	   * Get the OS reported baud rate for the open port.
	   * Used mostly for debugging custom baud rates.
	   * @returns {Promise} Resolves with the current baud rate.
	   * @rejects {TypeError} When given invalid arguments, a `TypeError` is rejected.
	   */
	  async getBaudRate() {
	    debug('getbaudRate');
	    if (!this.isOpen) {
	      throw new Error('Port is not open')
	    }
	  }

	  /**
	   * Flush (discard) data received but not read, and written but not transmitted.
	   * @returns {Promise} Resolves once the flush operation finishes.
	   * @rejects {TypeError} When given invalid arguments, a `TypeError` is rejected.
	   */
	  async flush() {
	    debug('flush');
	    if (!this.isOpen) {
	      throw new Error('Port is not open')
	    }
	  }

	  /**
	   * Drain waits until all output data is transmitted to the serial port. An in progress write should be completed before this returns.
	   * @returns {Promise} Resolves once the drain operation finishes.
	   * @rejects {TypeError} When given invalid arguments, a `TypeError` is rejected.
	   */
	  async drain() {
	    debug('drain');
	    if (!this.isOpen) {
	      throw new Error('Port is not open')
	    }
	  }
	}

	lib$6 = AbstractBinding;
	return lib$6;
}

var win32SnParser;
var hasRequiredWin32SnParser;

function requireWin32SnParser () {
	if (hasRequiredWin32SnParser) return win32SnParser;
	hasRequiredWin32SnParser = 1;
	const PARSERS = [/USB\\(?:.+)\\(.+)/, /FTDIBUS\\(?:.+)\+(.+?)A?\\.+/];

	win32SnParser = pnpId => {
	  if (!pnpId) {
	    return null
	  }
	  for (const parser of PARSERS) {
	    const sn = pnpId.match(parser);
	    if (sn) {
	      return sn[1]
	    }
	  }
	  return null
	};
	return win32SnParser;
}

var legacy;
var hasRequiredLegacy;

function requireLegacy () {
	if (hasRequiredLegacy) return legacy;
	hasRequiredLegacy = 1;
	let warningSent = false;

	const wrapWithHiddenComName = async portsPromise => {
	  const ports = await portsPromise;
	  return ports.map(port => {
	    const newPort = { ...port };
	    return Object.defineProperties(newPort, {
	      comName: {
	        get() {
	          if (!warningSent) {
	            warningSent = true;
	            console.warn(
	              `"PortInfo.comName" has been deprecated. You should now use "PortInfo.path". The property will be removed in the next major release.`
	            );
	          }
	          return newPort.path
	        },
	        enumerable: false,
	      },
	    })
	  })
	};

	legacy = {
	  wrapWithHiddenComName,
	};
	return legacy;
}

var win32;
var hasRequiredWin32;

function requireWin32 () {
	if (hasRequiredWin32) return win32;
	hasRequiredWin32 = 1;
	const binding = requireBindings()('bindings.node');
	const AbstractBinding = requireLib$7();
	const { promisify } = require$$2;
	const serialNumParser = requireWin32SnParser();

	const asyncList = promisify(binding.list);
	const asyncOpen = promisify(binding.open);
	const asyncClose = promisify(binding.close);
	const asyncRead = promisify(binding.read);
	const asyncWrite = promisify(binding.write);
	const asyncUpdate = promisify(binding.update);
	const asyncSet = promisify(binding.set);
	const asyncGet = promisify(binding.get);
	const asyncGetBaudRate = promisify(binding.getBaudRate);
	const asyncDrain = promisify(binding.drain);
	const asyncFlush = promisify(binding.flush);
	const { wrapWithHiddenComName } = requireLegacy();

	/**
	 * The Windows binding layer
	 */
	class WindowsBinding extends AbstractBinding {
	  static async list() {
	    const ports = await asyncList();
	    // Grab the serial number from the pnp id
	    return wrapWithHiddenComName(
	      ports.map(port => {
	        if (port.pnpId && !port.serialNumber) {
	          const serialNumber = serialNumParser(port.pnpId);
	          if (serialNumber) {
	            return {
	              ...port,
	              serialNumber,
	            }
	          }
	        }
	        return port
	      })
	    )
	  }

	  constructor(opt = {}) {
	    super(opt);
	    this.bindingOptions = { ...opt.bindingOptions };
	    this.fd = null;
	    this.writeOperation = null;
	  }

	  get isOpen() {
	    return this.fd !== null
	  }

	  async open(path, options) {
	    await super.open(path, options);
	    this.openOptions = { ...this.bindingOptions, ...options };
	    const fd = await asyncOpen(path, this.openOptions);
	    this.fd = fd;
	  }

	  async close() {
	    await super.close();
	    const fd = this.fd;
	    this.fd = null;
	    return asyncClose(fd)
	  }

	  async read(buffer, offset, length) {
	    await super.read(buffer, offset, length);
	    try {
	      const bytesRead = await asyncRead(this.fd, buffer, offset, length);
	      return { bytesRead, buffer }
	    } catch (err) {
	      if (!this.isOpen) {
	        err.canceled = true;
	      }
	      throw err
	    }
	  }

	  async write(buffer) {
	    this.writeOperation = super.write(buffer).then(async () => {
	      if (buffer.length === 0) {
	        return
	      }
	      await asyncWrite(this.fd, buffer);
	      this.writeOperation = null;
	    });
	    return this.writeOperation
	  }

	  async update(options) {
	    await super.update(options);
	    return asyncUpdate(this.fd, options)
	  }

	  async set(options) {
	    await super.set(options);
	    return asyncSet(this.fd, options)
	  }

	  async get() {
	    await super.get();
	    return asyncGet(this.fd)
	  }

	  async getBaudRate() {
	    await super.get();
	    return asyncGetBaudRate(this.fd)
	  }

	  async drain() {
	    await super.drain();
	    await this.writeOperation;
	    return asyncDrain(this.fd)
	  }

	  async flush() {
	    await super.flush();
	    return asyncFlush(this.fd)
	  }
	}

	win32 = WindowsBinding;
	return win32;
}

var poller;
var hasRequiredPoller;

function requirePoller () {
	if (hasRequiredPoller) return poller;
	hasRequiredPoller = 1;
	const debug = requireSrc();
	const logger = debug('serialport/bindings/poller');
	const EventEmitter = require$$1$1;
	const PollerBindings = requireBindings()('bindings.node').Poller;

	const EVENTS = {
	  UV_READABLE: 0b0001,
	  UV_WRITABLE: 0b0010,
	  UV_DISCONNECT: 0b0100,
	};

	function handleEvent(error, eventFlag) {
	  if (error) {
	    logger('error', error);
	    this.emit('readable', error);
	    this.emit('writable', error);
	    this.emit('disconnect', error);
	    return
	  }
	  if (eventFlag & EVENTS.UV_READABLE) {
	    logger('received "readable"');
	    this.emit('readable', null);
	  }
	  if (eventFlag & EVENTS.UV_WRITABLE) {
	    logger('received "writable"');
	    this.emit('writable', null);
	  }
	  if (eventFlag & EVENTS.UV_DISCONNECT) {
	    logger('received "disconnect"');
	    this.emit('disconnect', null);
	  }
	}

	/**
	 * Polls unix systems for readable or writable states of a file or serialport
	 */
	class Poller extends EventEmitter {
	  constructor(fd, FDPoller = PollerBindings) {
	    logger('Creating poller');
	    super();
	    this.poller = new FDPoller(fd, handleEvent.bind(this));
	  }
	  /**
	   * Wait for the next event to occur
	   * @param {string} event ('readable'|'writable'|'disconnect')
	   * @returns {Poller} returns itself
	   */
	  once(event, callback) {
	    switch (event) {
	      case 'readable':
	        this.poll(EVENTS.UV_READABLE);
	        break
	      case 'writable':
	        this.poll(EVENTS.UV_WRITABLE);
	        break
	      case 'disconnect':
	        this.poll(EVENTS.UV_DISCONNECT);
	        break
	    }
	    return super.once(event, callback)
	  }

	  /**
	   * Ask the bindings to listen for an event, it is recommend to use `.once()` for easy use
	   * @param {EVENTS} eventFlag polls for an event or group of events based upon a flag.
	   * @returns {undefined}
	   */
	  poll(eventFlag) {
	    eventFlag = eventFlag || 0;

	    if (eventFlag & EVENTS.UV_READABLE) {
	      logger('Polling for "readable"');
	    }
	    if (eventFlag & EVENTS.UV_WRITABLE) {
	      logger('Polling for "writable"');
	    }
	    if (eventFlag & EVENTS.UV_DISCONNECT) {
	      logger('Polling for "disconnect"');
	    }

	    this.poller.poll(eventFlag);
	  }

	  /**
	   * Stop listening for events and cancel all outstanding listening with an error
	   * @returns {undefined}
	   */
	  stop() {
	    logger('Stopping poller');
	    this.poller.stop();
	    this.emitCanceled();
	  }

	  destroy() {
	    logger('Destroying poller');
	    this.poller.destroy();
	    this.emitCanceled();
	  }

	  emitCanceled() {
	    const err = new Error('Canceled');
	    err.canceled = true;
	    this.emit('readable', err);
	    this.emit('writable', err);
	    this.emit('disconnect', err);
	  }
	}

	Poller.EVENTS = EVENTS;

	poller = Poller;
	return poller;
}

var unixRead_1;
var hasRequiredUnixRead;

function requireUnixRead () {
	if (hasRequiredUnixRead) return unixRead_1;
	hasRequiredUnixRead = 1;
	const fs = require$$0$2;
	const debug = requireSrc();
	const logger = debug('serialport/bindings/unixRead');
	const { promisify } = require$$2;

	const readAsync = promisify(fs.read);

	const readable = binding => {
	  return new Promise((resolve, reject) => {
	    binding.poller.once('readable', err => (err ? reject(err) : resolve()));
	  })
	};

	const unixRead = async ({ binding, buffer, offset, length, fsReadAsync = readAsync }) => {
	  logger('Starting read');
	  if (!binding.isOpen) {
	    const err = new Error('Port is not open');
	    err.canceled = true;
	    throw err
	  }

	  try {
	    const { bytesRead } = await fsReadAsync(binding.fd, buffer, offset, length, null);
	    if (bytesRead === 0) {
	      return unixRead({ binding, buffer, offset, length, fsReadAsync })
	    }
	    logger('Finished read', bytesRead, 'bytes');
	    return { bytesRead, buffer }
	  } catch (err) {
	    logger('read error', err);
	    if (err.code === 'EAGAIN' || err.code === 'EWOULDBLOCK' || err.code === 'EINTR') {
	      if (!binding.isOpen) {
	        const err = new Error('Port is not open');
	        err.canceled = true;
	        throw err
	      }
	      logger('waiting for readable because of code:', err.code);
	      await readable(binding);
	      return unixRead({ binding, buffer, offset, length, fsReadAsync })
	    }

	    const disconnectError =
	      err.code === 'EBADF' || // Bad file number means we got closed
	      err.code === 'ENXIO' || // No such device or address probably usb disconnect
	      err.code === 'UNKNOWN' ||
	      err.errno === -1; // generic error

	    if (disconnectError) {
	      err.disconnect = true;
	      logger('disconnecting', err);
	    }

	    throw err
	  }
	};

	unixRead_1 = unixRead;
	return unixRead_1;
}

var unixWrite_1;
var hasRequiredUnixWrite;

function requireUnixWrite () {
	if (hasRequiredUnixWrite) return unixWrite_1;
	hasRequiredUnixWrite = 1;
	const fs = require$$0$2;
	const debug = requireSrc();
	const logger = debug('serialport/bindings/unixWrite');
	const { promisify } = require$$2;

	const writeAsync = promisify(fs.write);

	const writable = binding => {
	  return new Promise((resolve, reject) => {
	    binding.poller.once('writable', err => (err ? reject(err) : resolve()));
	  })
	};

	const unixWrite = async ({ binding, buffer, offset = 0, fsWriteAsync = writeAsync }) => {
	  const bytesToWrite = buffer.length - offset;
	  logger('Starting write', buffer.length, 'bytes offset', offset, 'bytesToWrite', bytesToWrite);
	  if (!binding.isOpen) {
	    throw new Error('Port is not open')
	  }
	  try {
	    const { bytesWritten } = await fsWriteAsync(binding.fd, buffer, offset, bytesToWrite);
	    logger('write returned: wrote', bytesWritten, 'bytes');
	    if (bytesWritten + offset < buffer.length) {
	      if (!binding.isOpen) {
	        throw new Error('Port is not open')
	      }
	      return unixWrite({ binding, buffer, offset: bytesWritten + offset, fsWriteAsync })
	    }

	    logger('Finished writing', bytesWritten + offset, 'bytes');
	  } catch (err) {
	    logger('write errored', err);
	    if (err.code === 'EAGAIN' || err.code === 'EWOULDBLOCK' || err.code === 'EINTR') {
	      if (!binding.isOpen) {
	        throw new Error('Port is not open')
	      }
	      logger('waiting for writable because of code:', err.code);
	      await writable(binding);
	      return unixWrite({ binding, buffer, offset, fsWriteAsync })
	    }

	    const disconnectError =
	      err.code === 'EBADF' || // Bad file number means we got closed
	      err.code === 'ENXIO' || // No such device or address probably usb disconnect
	      err.code === 'UNKNOWN' ||
	      err.errno === -1; // generic error

	    if (disconnectError) {
	      err.disconnect = true;
	      logger('disconnecting', err);
	    }

	    logger('error', err);
	    throw err
	  }
	};
	unixWrite_1 = unixWrite;
	return unixWrite_1;
}

var darwin;
var hasRequiredDarwin;

function requireDarwin () {
	if (hasRequiredDarwin) return darwin;
	hasRequiredDarwin = 1;
	const { promisify } = require$$2;
	const binding = requireBindings()('bindings.node');
	const AbstractBinding = requireLib$7();
	const Poller = requirePoller();
	const unixRead = requireUnixRead();
	const unixWrite = requireUnixWrite();
	const { wrapWithHiddenComName } = requireLegacy();

	const defaultBindingOptions = Object.freeze({
	  vmin: 1,
	  vtime: 0,
	});

	const asyncList = promisify(binding.list);
	const asyncOpen = promisify(binding.open);
	const asyncClose = promisify(binding.close);
	const asyncUpdate = promisify(binding.update);
	const asyncSet = promisify(binding.set);
	const asyncGet = promisify(binding.get);
	const asyncGetBaudRate = promisify(binding.getBaudRate);
	const asyncDrain = promisify(binding.drain);
	const asyncFlush = promisify(binding.flush);

	/**
	 * The Darwin binding layer for OSX
	 */
	class DarwinBinding extends AbstractBinding {
	  static list() {
	    return wrapWithHiddenComName(asyncList())
	  }

	  constructor(opt = {}) {
	    super(opt);
	    this.bindingOptions = { ...defaultBindingOptions, ...opt.bindingOptions };
	    this.fd = null;
	    this.writeOperation = null;
	  }

	  get isOpen() {
	    return this.fd !== null
	  }

	  async open(path, options) {
	    await super.open(path, options);
	    this.openOptions = { ...this.bindingOptions, ...options };
	    const fd = await asyncOpen(path, this.openOptions);
	    this.fd = fd;
	    this.poller = new Poller(fd);
	  }

	  async close() {
	    await super.close();
	    const fd = this.fd;
	    this.poller.stop();
	    this.poller.destroy();
	    this.poller = null;
	    this.openOptions = null;
	    this.fd = null;
	    return asyncClose(fd)
	  }

	  async read(buffer, offset, length) {
	    await super.read(buffer, offset, length);
	    return unixRead({ binding: this, buffer, offset, length })
	  }

	  async write(buffer) {
	    this.writeOperation = super.write(buffer).then(async () => {
	      if (buffer.length === 0) {
	        return
	      }
	      await unixWrite({ binding: this, buffer });
	      this.writeOperation = null;
	    });
	    return this.writeOperation
	  }

	  async update(options) {
	    await super.update(options);
	    return asyncUpdate(this.fd, options)
	  }

	  async set(options) {
	    await super.set(options);
	    return asyncSet(this.fd, options)
	  }

	  async get() {
	    await super.get();
	    return asyncGet(this.fd)
	  }

	  async getBaudRate() {
	    await super.get();
	    return asyncGetBaudRate(this.fd)
	  }

	  async drain() {
	    await super.drain();
	    await this.writeOperation;
	    return asyncDrain(this.fd)
	  }

	  async flush() {
	    await super.flush();
	    return asyncFlush(this.fd)
	  }
	}

	darwin = DarwinBinding;
	return darwin;
}

var linuxList;
var hasRequiredLinuxList;

function requireLinuxList () {
	if (hasRequiredLinuxList) return linuxList;
	hasRequiredLinuxList = 1;
	const childProcess = require$$0$3;
	const Readline = requireLib$9();

	// get only serial port names
	function checkPathOfDevice(path) {
	  return /(tty(S|WCH|ACM|USB|AMA|MFD|O|XRUSB)|rfcomm)/.test(path) && path
	}

	function propName(name) {
	  return {
	    DEVNAME: 'path',
	    ID_VENDOR_ENC: 'manufacturer',
	    ID_SERIAL_SHORT: 'serialNumber',
	    ID_VENDOR_ID: 'vendorId',
	    ID_MODEL_ID: 'productId',
	    DEVLINKS: 'pnpId',
	  }[name.toUpperCase()]
	}

	function decodeHexEscape(str) {
	  return str.replace(/\\x([a-fA-F0-9]{2})/g, (a, b) => {
	    return String.fromCharCode(parseInt(b, 16))
	  })
	}

	function propVal(name, val) {
	  if (name === 'pnpId') {
	    const match = val.match(/\/by-id\/([^\s]+)/);
	    return (match && match[1]) || undefined
	  }
	  if (name === 'manufacturer') {
	    return decodeHexEscape(val)
	  }
	  if (/^0x/.test(val)) {
	    return val.substr(2)
	  }
	  return val
	}

	function listLinux() {
	  return new Promise((resolve, reject) => {
	    const ports = [];
	    const ude = childProcess.spawn('udevadm', ['info', '-e']);
	    const lines = ude.stdout.pipe(new Readline());
	    ude.on('close', code => code && reject(new Error(`Error listing ports udevadm exited with error code: ${code}`)));
	    ude.on('error', reject);
	    lines.on('error', reject);

	    let port = {};
	    let skipPort = false;
	    lines.on('data', line => {
	      const lineType = line.slice(0, 1);
	      const data = line.slice(3);
	      // new port entry
	      if (lineType === 'P') {
	        port = {
	          manufacturer: undefined,
	          serialNumber: undefined,
	          pnpId: undefined,
	          locationId: undefined,
	          vendorId: undefined,
	          productId: undefined,
	        };
	        skipPort = false;
	        return
	      }

	      if (skipPort) {
	        return
	      }

	      // Check dev name and save port if it matches flag to skip the rest of the data if not
	      if (lineType === 'N') {
	        if (checkPathOfDevice(data)) {
	          ports.push(port);
	        } else {
	          skipPort = true;
	        }
	        return
	      }

	      // parse data about each port
	      if (lineType === 'E') {
	        const keyValue = data.match(/^(.+)=(.*)/);
	        if (!keyValue) {
	          return
	        }
	        const key = propName(keyValue[1]);
	        if (!key) {
	          return
	        }
	        port[key] = propVal(key, keyValue[2]);
	      }
	    });

	    lines.on('finish', () => resolve(ports));
	  })
	}

	linuxList = listLinux;
	return linuxList;
}

var linux;
var hasRequiredLinux;

function requireLinux () {
	if (hasRequiredLinux) return linux;
	hasRequiredLinux = 1;
	const { promisify } = require$$2;
	const binding = requireBindings()('bindings.node');
	const AbstractBinding = requireLib$7();
	const linuxList = requireLinuxList();
	const Poller = requirePoller();
	const unixRead = requireUnixRead();
	const unixWrite = requireUnixWrite();
	const { wrapWithHiddenComName } = requireLegacy();

	const defaultBindingOptions = Object.freeze({
	  vmin: 1,
	  vtime: 0,
	});

	const asyncOpen = promisify(binding.open);
	const asyncClose = promisify(binding.close);
	const asyncUpdate = promisify(binding.update);
	const asyncSet = promisify(binding.set);
	const asyncGet = promisify(binding.get);
	const asyncGetBaudRate = promisify(binding.getBaudRate);
	const asyncDrain = promisify(binding.drain);
	const asyncFlush = promisify(binding.flush);

	/**
	 * The linux binding layer
	 */
	class LinuxBinding extends AbstractBinding {
	  static list() {
	    return wrapWithHiddenComName(linuxList())
	  }

	  constructor(opt = {}) {
	    super(opt);
	    this.bindingOptions = { ...defaultBindingOptions, ...opt.bindingOptions };
	    this.fd = null;
	    this.writeOperation = null;
	  }

	  get isOpen() {
	    return this.fd !== null
	  }

	  async open(path, options) {
	    await super.open(path, options);
	    this.openOptions = { ...this.bindingOptions, ...options };
	    const fd = await asyncOpen(path, this.openOptions);
	    this.fd = fd;
	    this.poller = new Poller(fd);
	  }

	  async close() {
	    await super.close();
	    const fd = this.fd;
	    this.poller.stop();
	    this.poller.destroy();
	    this.poller = null;
	    this.openOptions = null;
	    this.fd = null;
	    return asyncClose(fd)
	  }

	  async read(buffer, offset, length) {
	    await super.read(buffer, offset, length);
	    return unixRead({ binding: this, buffer, offset, length })
	  }

	  async write(buffer) {
	    this.writeOperation = super.write(buffer).then(async () => {
	      if (buffer.length === 0) {
	        return
	      }
	      await unixWrite({ binding: this, buffer });
	      this.writeOperation = null;
	    });
	    return this.writeOperation
	  }

	  async update(options) {
	    await super.update(options);
	    return asyncUpdate(this.fd, options)
	  }

	  async set(options) {
	    await super.set(options);
	    return asyncSet(this.fd, options)
	  }

	  async get() {
	    await super.get();
	    return asyncGet(this.fd)
	  }

	  async getBaudRate() {
	    await super.get();
	    return asyncGetBaudRate(this.fd)
	  }

	  async drain() {
	    await super.drain();
	    await this.writeOperation;
	    return asyncDrain(this.fd)
	  }

	  async flush() {
	    await super.flush();
	    return asyncFlush(this.fd)
	  }
	}

	linux = LinuxBinding;
	return linux;
}

var hasRequiredLib$6;

function requireLib$6 () {
	if (hasRequiredLib$6) return libExports$1;
	hasRequiredLib$6 = 1;
	(function (module) {
		const debug = requireSrc()('serialport/bindings');

		switch (process.platform) {
		  case 'win32':
		    debug('loading WindowsBinding');
		    module.exports = requireWin32();
		    break
		  case 'darwin':
		    debug('loading DarwinBinding');
		    module.exports = requireDarwin();
		    break
		  default:
		    debug('loading LinuxBinding');
		    module.exports = requireLinux();
		}
} (lib$7));
	return libExports$1;
}

var lib$5;
var hasRequiredLib$5;

function requireLib$5 () {
	if (hasRequiredLib$5) return lib$5;
	hasRequiredLib$5 = 1;
	const { Transform } = require$$0;

	/**
	 * Emit data every number of bytes
	 * @extends Transform
	 * @param {Object} options parser options object
	 * @param {Number} options.length the number of bytes on each data event
	 * @summary A transform stream that emits data as a buffer after a specific number of bytes are received. Runs in O(n) time.
	 * @example
	const SerialPort = require('serialport')
	const ByteLength = require('@serialport/parser-byte-length')
	const port = new SerialPort('/dev/tty-usbserial1')
	const parser = port.pipe(new ByteLength({length: 8}))
	parser.on('data', console.log) // will have 8 bytes per data event
	 */
	class ByteLengthParser extends Transform {
	  constructor(options = {}) {
	    super(options);

	    if (typeof options.length !== 'number') {
	      throw new TypeError('"length" is not a number')
	    }

	    if (options.length < 1) {
	      throw new TypeError('"length" is not greater than 0')
	    }

	    this.length = options.length;
	    this.position = 0;
	    this.buffer = Buffer.alloc(this.length);
	  }

	  _transform(chunk, encoding, cb) {
	    let cursor = 0;
	    while (cursor < chunk.length) {
	      this.buffer[this.position] = chunk[cursor];
	      cursor++;
	      this.position++;
	      if (this.position === this.length) {
	        this.push(this.buffer);
	        this.buffer = Buffer.alloc(this.length);
	        this.position = 0;
	      }
	    }
	    cb();
	  }

	  _flush(cb) {
	    this.push(this.buffer.slice(0, this.position));
	    this.buffer = Buffer.alloc(this.length);
	    cb();
	  }
	}

	lib$5 = ByteLengthParser;
	return lib$5;
}

var lib$4;
var hasRequiredLib$4;

function requireLib$4 () {
	if (hasRequiredLib$4) return lib$4;
	hasRequiredLib$4 = 1;
	const { Transform } = require$$0;

	/**
	 * Parse the CCTalk protocol
	 * @extends Transform
	 * @summary A transform stream that emits CCTalk packets as they are received.
	 * @example
	const SerialPort = require('serialport')
	const CCTalk = require('@serialport/parser-cctalk')
	const port = new SerialPort('/dev/ttyUSB0')
	const parser = port.pipe(new CCtalk())
	parser.on('data', console.log)
	 */
	class CCTalkParser extends Transform {
	  constructor(maxDelayBetweenBytesMs = 50) {
	    super();
	    this.array = [];
	    this.cursor = 0;
	    this.lastByteFetchTime = 0;
	    this.maxDelayBetweenBytesMs = maxDelayBetweenBytesMs;
	  }
	  _transform(buffer, _, cb) {
	    if (this.maxDelayBetweenBytesMs > 0) {
	      const now = Date.now();
	      if (now - this.lastByteFetchTime > this.maxDelayBetweenBytesMs) {
	        this.array = [];
	        this.cursor = 0;
	      }
	      this.lastByteFetchTime = now;
	    }

	    this.cursor += buffer.length;
	    // TODO: Better Faster es7 no supported by node 4
	    // ES7 allows directly push [...buffer]
	    // this.array = this.array.concat(Array.from(buffer)) //Slower ?!?
	    Array.from(buffer).map(byte => this.array.push(byte));
	    while (this.cursor > 1 && this.cursor >= this.array[1] + 5) {
	      // full frame accumulated
	      // copy command from the array
	      const FullMsgLength = this.array[1] + 5;

	      const frame = Buffer.from(this.array.slice(0, FullMsgLength));
	      // Preserve Extra Data
	      this.array = this.array.slice(frame.length, this.array.length);
	      this.cursor -= FullMsgLength;
	      this.push(frame);
	    }
	    cb();
	  }
	}

	lib$4 = CCTalkParser;
	return lib$4;
}

var lib$3;
var hasRequiredLib$3;

function requireLib$3 () {
	if (hasRequiredLib$3) return lib$3;
	hasRequiredLib$3 = 1;
	const { Transform } = require$$0;

	/**
	 * Emits data if there is a pause between packets for the specified amount of time.
	 * @extends Transform
	 * @param {Object} options parser options object
	 * @param {Number} options.interval the period of silence in milliseconds after which data is emited
	 * @param {Number} options.maxBufferSize the maximum number of bytes after which data will be emited. Defaults to 65536.
	 * @summary A transform stream that emits data as a buffer after not receiving any bytes for the specified amount of time.
	 * @example
	const SerialPort = require('serialport')
	const InterByteTimeout = require('@serialport/parser-inter-byte-timeout')
	const port = new SerialPort('/dev/tty-usbserial1')
	const parser = port.pipe(new InterByteTimeout({interval: 30}))
	parser.on('data', console.log) // will emit data if there is a pause between packets greater than 30ms
	 */

	class InterByteTimeoutParser extends Transform {
	  constructor(options) {
	    super();
	    options = { maxBufferSize: 65536, ...options };
	    if (!options.interval) {
	      throw new TypeError('"interval" is required')
	    }

	    if (typeof options.interval !== 'number' || Number.isNaN(options.interval)) {
	      throw new TypeError('"interval" is not a number')
	    }

	    if (options.interval < 1) {
	      throw new TypeError('"interval" is not greater than 0')
	    }

	    if (typeof options.maxBufferSize !== 'number' || Number.isNaN(options.maxBufferSize)) {
	      throw new TypeError('"maxBufferSize" is not a number')
	    }

	    if (options.maxBufferSize < 1) {
	      throw new TypeError('"maxBufferSize" is not greater than 0')
	    }

	    this.maxBufferSize = options.maxBufferSize;
	    this.currentPacket = [];
	    this.interval = options.interval;
	    this.intervalID = -1;
	  }
	  _transform(chunk, encoding, cb) {
	    clearTimeout(this.intervalID);
	    for (let offset = 0; offset < chunk.length; offset++) {
	      this.currentPacket.push(chunk[offset]);
	      if (this.currentPacket.length >= this.maxBufferSize) {
	        this.emitPacket();
	      }
	    }
	    this.intervalID = setTimeout(this.emitPacket.bind(this), this.interval);
	    cb();
	  }
	  emitPacket() {
	    clearTimeout(this.intervalID);
	    if (this.currentPacket.length > 0) {
	      this.push(Buffer.from(this.currentPacket));
	    }
	    this.currentPacket = [];
	  }
	  _flush(cb) {
	    this.emitPacket();
	    cb();
	  }
	}

	lib$3 = InterByteTimeoutParser;
	return lib$3;
}

var lib$2;
var hasRequiredLib$2;

function requireLib$2 () {
	if (hasRequiredLib$2) return lib$2;
	hasRequiredLib$2 = 1;
	const { Transform } = require$$0;

	/**
	 * A transform stream that waits for a sequence of "ready" bytes before emitting a ready event and emitting data events
	 * @summary To use the `Ready` parser provide a byte start sequence. After the bytes have been received a ready event is fired and data events are passed through.
	 * @extends Transform
	 * @example
	const SerialPort = require('serialport')
	const Ready = require('@serialport/parser-ready')
	const port = new SerialPort('/dev/tty-usbserial1')
	const parser = port.pipe(new Ready({ delimiter: 'READY' }))
	parser.on('ready', () => console.log('the ready byte sequence has been received'))
	parser.on('data', console.log) // all data after READY is received
	 */
	class ReadyParser extends Transform {
	  /**
	   *
	   * @param {object} options options for the parser
	   * @param {string|Buffer|array} options.delimiter data to look for before emitted "ready"
	   */
	  constructor(options = {}) {
	    if (options.delimiter === undefined) {
	      throw new TypeError('"delimiter" is not a bufferable object')
	    }

	    if (options.delimiter.length === 0) {
	      throw new TypeError('"delimiter" has a 0 or undefined length')
	    }

	    super(options);
	    this.delimiter = Buffer.from(options.delimiter);
	    this.readOffset = 0;
	    this.ready = false;
	  }

	  _transform(chunk, encoding, cb) {
	    if (this.ready) {
	      this.push(chunk);
	      return cb()
	    }
	    const delimiter = this.delimiter;
	    let chunkOffset = 0;
	    while (this.readOffset < delimiter.length && chunkOffset < chunk.length) {
	      if (delimiter[this.readOffset] === chunk[chunkOffset]) {
	        this.readOffset++;
	      } else {
	        this.readOffset = 0;
	      }
	      chunkOffset++;
	    }
	    if (this.readOffset === delimiter.length) {
	      this.ready = true;
	      this.emit('ready');
	      const chunkRest = chunk.slice(chunkOffset);
	      if (chunkRest.length > 0) {
	        this.push(chunkRest);
	      }
	    }
	    cb();
	  }
	}

	lib$2 = ReadyParser;
	return lib$2;
}

var lib$1;
var hasRequiredLib$1;

function requireLib$1 () {
	if (hasRequiredLib$1) return lib$1;
	hasRequiredLib$1 = 1;
	const { Transform } = require$$0;

	/**
	 * A transform stream that uses a regular expression to split the incoming text upon.
	 *
	 * To use the `Regex` parser provide a regular expression to split the incoming text upon. Data is emitted as string controllable by the `encoding` option (defaults to `utf8`).
	 * @extends Transform
	 * @example
	const SerialPort = require('serialport')
	const Regex = require('@serialport/parser-regex')
	const port = new SerialPort('/dev/tty-usbserial1')
	const parser = port.pipe(new Regex({ regex: /[\r\n]+/ }))
	parser.on('data', console.log)
	 */
	class RegexParser extends Transform {
	  constructor(options) {
	    const opts = {
	      encoding: 'utf8',
	      ...options,
	    };

	    if (opts.regex === undefined) {
	      throw new TypeError('"options.regex" must be a regular expression pattern or object')
	    }

	    if (!(opts.regex instanceof RegExp)) {
	      opts.regex = new RegExp(opts.regex);
	    }
	    super(opts);

	    this.regex = opts.regex;
	    this.data = '';
	  }

	  _transform(chunk, encoding, cb) {
	    const data = this.data + chunk;
	    const parts = data.split(this.regex);
	    this.data = parts.pop();

	    parts.forEach(part => {
	      this.push(part);
	    });
	    cb();
	  }

	  _flush(cb) {
	    this.push(this.data);
	    this.data = '';
	    cb();
	  }
	}

	lib$1 = RegexParser;
	return lib$1;
}

var parsers;
var hasRequiredParsers;

function requireParsers () {
	if (hasRequiredParsers) return parsers;
	hasRequiredParsers = 1;
	parsers = {
	  ByteLength: requireLib$5(),
	  CCTalk: requireLib$4(),
	  Delimiter: requireLib$a(),
	  InterByteTimeout: requireLib$3(),
	  Readline: requireLib$9(),
	  Ready: requireLib$2(),
	  Regex: requireLib$1(),
	};
	return parsers;
}

var lib;
var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return lib;
	hasRequiredLib = 1;
	const SerialPort = requireLib$8();
	const Binding = requireLib$6();
	const parsers = requireParsers();

	/**
	 * @type {AbstractBinding}
	 */
	SerialPort.Binding = Binding;

	/**
	 * @type {Parsers}
	 */
	SerialPort.parsers = parsers;

	lib = SerialPort;
	return lib;
}

var libExports = requireLib();
var SerialPort = /*@__PURE__*/getDefaultExportFromCjs(libExports);

class SerialCommander {
  constructor ({
    port = '/dev/modem',
    baudrate = 115200,
    readDelimiter = '\n',
    writeDelimiter = '\r\n',
    disableLog = false,
    defaultDelay = 100,
    log = string => console.log(`[${new Date().toISOString()}] ${string}`)
  }) {
    this.log = log;
    this.isLogEnabled = !disableLog;
    this.defaultDelay = defaultDelay;
    this.fallbackSerialDataHandler = line => log(`{answer given outside command scope} ${line}`);
    this.serialDataHandler = this.fallbackSerialDataHandler;
    this.writeDelimiter = writeDelimiter;

    this.port = new SerialPort(port, { baudRate: baudrate });
    this.parser = new Readline({ readDelimiter });
    this.port.pipe(this.parser);
    this.parser.on('data', line => this.serialDataHandler(line));
  }

  async send (command, {
    expectedResponses = ['OK'],
    timeout = 1000,
    delay = this.defaultDelay
  } = {}) {
    await new Promise(resolve => setTimeout(resolve, delay)); // eslint-disable-line

    const startTime = new Date();
    let response = '';

    return new Promise((resolve, reject) => {
      const errorTimeout = setTimeout(() => {
        this.serialDataHandler = this.fallbackSerialDataHandler;
        reject(new Error('Request timed out before a satisfactory answer was given'));
      }, timeout);

      const escapedCommand = `${command}${this.writeDelimiter}`;
      this.port.write(escapedCommand);
      if (this.isLogEnabled) this.log(`>> ${command}`);

      this.serialDataHandler = line => {
        response += line;

        const isCommandSuccessfullyTerminated = expectedResponses.some(
          expectedResponse => line.includes(expectedResponse)
        );
        if (isCommandSuccessfullyTerminated) {
          if (this.isLogEnabled) this.log(`<< ${line}`);

          this.serialDataHandler = this.fallbackSerialDataHandler;
          clearTimeout(errorTimeout);

          const endTime = new Date();

          resolve({
            command,
            startTime,
            endTime,
            executionTime: endTime - startTime,
            response
          });
        } else {
          if (this.isLogEnabled) this.log(line);
        }
      };
    })
  }

  close () {
    if (this.port.isOpen) this.port.close();
  }
}

export { SerialCommander as default };
//# sourceMappingURL=index-996fb0ae.js.map
