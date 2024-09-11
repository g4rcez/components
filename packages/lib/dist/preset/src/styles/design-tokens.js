var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export var parsers = {
    cssVariable: function (_, __, k) { return "var(--".concat(k, ")"); },
    rgba: function (v) { return "rgba(".concat(v, ")"); },
    rgb: function (v) { return "rgb(".concat(v, ")"); },
    hsl: function (v) { return "hsl(".concat(v, ")"); },
    hsla: function (v) { return "hsla(".concat(v, ")"); },
    hex: function (v) { return v; },
    raw: function (v) { return v; },
    formatWithVar: function (format) { return function (_, __, v) { return "".concat(format, "(var(--").concat(v, "), <alpha-value>)"); }; },
};
export var reduceTokens = function (colors, parse, prefix, append) {
    if (prefix === void 0) { prefix = ""; }
    if (append === void 0) { append = ""; }
    return Object.entries(colors).reduce(function (acc, _a) {
        var key = _a[0], value = _a[1];
        var combine = append === "" ? "".concat(prefix).concat(key) : "".concat(append, "-").concat(key);
        if (typeof value === "string") {
            var k = append === "" ? "".concat(prefix).concat(key) : key;
            return acc.concat(parse(value, k, combine));
        }
        return acc.concat(reduceTokens(value, parse, prefix, combine));
    }, []);
};
export var createDesignTokens = function (colors, parse, prefix, append) {
    if (prefix === void 0) { prefix = ""; }
    if (append === void 0) { append = ""; }
    return Object.entries(colors).reduce(function (acc, _a) {
        var _b, _c;
        var key = _a[0], value = _a[1];
        var combine = append === "" ? "".concat(prefix).concat(key) : "".concat(append, "-").concat(key);
        if (typeof value === "string") {
            var k = append === "" ? "".concat(prefix).concat(key) : key;
            return __assign(__assign({}, acc), (_b = {}, _b[k] = parse(value, key, combine), _b));
        }
        return __assign(__assign({}, acc), (_c = {}, _c[key] = createDesignTokens(value, parse, prefix, combine), _c));
    }, {});
};
var modifiers = {
    default: function (variables) { return ":root { ".concat(variables, " }"); },
    dark: function (variables) { return "html.dark {".concat(variables, "}"); },
};
var createStyleContent = function (tokens, modifiers) {
    var v = modifiers.value || (function (_, s) { return s; });
    var content = tokens.map(function (token) { return "".concat(token.key, ": ").concat(v(token.key, token.value)); }).join(";");
    return modifiers.result(content);
};
export var createStyles = {
    default: function (tokens) { return createStyleContent(tokens, { result: modifiers.default }); },
    dark: function (tokens) { return createStyleContent(tokens, { result: modifiers.dark }); },
};
export var createTheme = function (theme, name) {
    var fn = function (value, _, key) { return ({
        key: "--".concat(key),
        value: "".concat(value),
    }); };
    var colors = reduceTokens(theme.colors, fn);
    var spacing = reduceTokens(theme.spacing, fn);
    var rounded = reduceTokens(theme.rounded, fn);
    return createStyleContent(colors.concat(spacing, rounded), {
        result: function (variables) { return "html".concat(name ? ".".concat(name) : "", " {").concat(variables, "}"); },
        value: function (_, v) { return v.replace("hsla(", "").replace(")", ""); },
    });
};
