/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-4 and FIPS PUB 202, as well as the corresponding
 HMAC implementation as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2017
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
*/
'use strict';
(function(G) {
    function r(d, b, c) {
        var h = 0,
            a = [],
            g = 0,
            f, m, k, e, l, p, q, t, w = !1,
            n = [],
            u = [],
            v, r = !1;
        c = c || {};
        f = c.encoding || "UTF8";
        v = c.numRounds || 1;
        if (v !== parseInt(v, 10) || 1 > v) throw Error("numRounds must a integer >= 1");
        if ("SHA-1" === d) l = 512, p = z, q = H, e = 160, t = function(a) {
            return a.slice()
        };
        else throw Error("Chosen SHA variant is not supported");
        k = A(b, f);
        m = x(d);
        this.setHMACKey = function(a, b, g) {
            var c;
            if (!0 === w) throw Error("HMAC key already set");
            if (!0 === r) throw Error("Cannot set HMAC key after calling update");
            f = (g || {}).encoding || "UTF8";
            b = A(b, f)(a);
            a = b.binLen;
            b = b.value;
            c = l >>> 3;
            g = c / 4 - 1;
            if (c < a / 8) {
                for (b = q(b, a, 0, x(d), e); b.length <= g;) b.push(0);
                b[g] &= 4294967040
            } else if (c > a / 8) {
                for (; b.length <= g;) b.push(0);
                b[g] &= 4294967040
            }
            for (a = 0; a <= g; a += 1) n[a] = b[a] ^ 909522486, u[a] = b[a] ^ 1549556828;
            m = p(n, m);
            h = l;
            w = !0
        };
        this.update = function(b) {
            var e, f, c, d = 0,
                q = l >>> 5;
            e = k(b, a, g);
            b = e.binLen;
            f = e.value;
            e = b >>> 5;
            for (c = 0; c < e; c += q) d + l <= b && (m = p(f.slice(c, c + q), m), d += l);
            h += d;
            a = f.slice(d >>> 5);
            g = b % l;
            r = !0
        };
        this.getHash = function(b, f) {
            var c, k, l, p;
            if (!0 ===
                w) throw Error("Cannot call getHash after setting HMAC key");
            l = B(f);
            switch (b) {
                case "HEX":
                    c = function(a) {
                        return C(a, e, l)
                    };
                    break;
                case "B64":
                    c = function(a) {
                        return D(a, e, l)
                    };
                    break;
                case "BYTES":
                    c = function(a) {
                        return E(a, e)
                    };
                    break;
                case "ARRAYBUFFER":
                    try {
                        k = new ArrayBuffer(0)
                    } catch (I) {
                        throw Error("ARRAYBUFFER not supported by this environment");
                    }
                    c = function(a) {
                        return F(a, e)
                    };
                    break;
                default:
                    throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER");
            }
            p = q(a.slice(), g, h, t(m), e);
            for (k = 1; k < v; k += 1) p = q(p, e, 0, x(d), e);
            return c(p)
        };
        this.getHMAC = function(b, f) {
            var c, k, n, r;
            if (!1 === w) throw Error("Cannot call getHMAC without first setting HMAC key");
            n = B(f);
            switch (b) {
                case "HEX":
                    c = function(a) {
                        return C(a, e, n)
                    };
                    break;
                case "B64":
                    c = function(a) {
                        return D(a, e, n)
                    };
                    break;
                case "BYTES":
                    c = function(a) {
                        return E(a, e)
                    };
                    break;
                case "ARRAYBUFFER":
                    try {
                        c = new ArrayBuffer(0)
                    } catch (I) {
                        throw Error("ARRAYBUFFER not supported by this environment");
                    }
                    c = function(a) {
                        return F(a, e)
                    };
                    break;
                default:
                    throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");
            }
            k = q(a.slice(), g, h, t(m), e);
            r = p(u, x(d));
            r = q(k, e, l, r, e);
            return c(r)
        }
    }

    function C(d, b, c) {
        var h = "";
        b /= 8;
        var a, g;
        for (a = 0; a < b; a += 1) g = d[a >>> 2] >>> 8 * (3 + a % 4 * -1), h += "0123456789abcdef".charAt(g >>> 4 & 15) + "0123456789abcdef".charAt(g & 15);
        return c.outputUpper ? h.toUpperCase() : h
    }

    function D(d, b, c) {
        var h = "",
            a = b / 8,
            g, f, m;
        for (g = 0; g < a; g += 3)
            for (f = g + 1 < a ? d[g + 1 >>> 2] : 0, m = g + 2 < a ? d[g + 2 >>> 2] : 0, m = (d[g >>> 2] >>> 8 * (3 + g % 4 * -1) & 255) << 16 | (f >>> 8 * (3 + (g + 1) % 4 * -1) & 255) << 8 | m >>> 8 * (3 + (g + 2) % 4 * -1) & 255, f = 0; 4 > f; f += 1) 8 * g + 6 * f <= b ? h += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(m >>>
                6 * (3 - f) & 63) : h += c.b64Pad;
        return h
    }

    function E(d, b) {
        var c = "",
            h = b / 8,
            a, g;
        for (a = 0; a < h; a += 1) g = d[a >>> 2] >>> 8 * (3 + a % 4 * -1) & 255, c += String.fromCharCode(g);
        return c
    }

    function F(d, b) {
        var c = b / 8,
            h, a = new ArrayBuffer(c);
        for (h = 0; h < c; h += 1) a[h] = d[h >>> 2] >>> 8 * (3 + h % 4 * -1) & 255;
        return a
    }

    function B(d) {
        var b = {
            outputUpper: !1,
            b64Pad: "=",
            shakeLen: -1
        };
        d = d || {};
        b.outputUpper = d.outputUpper || !1;
        !0 === d.hasOwnProperty("b64Pad") && (b.b64Pad = d.b64Pad);
        if ("boolean" !== typeof b.outputUpper) throw Error("Invalid outputUpper formatting option");
        if ("string" !==
            typeof b.b64Pad) throw Error("Invalid b64Pad formatting option");
        return b
    }

    function A(d, b) {
        var c;
        switch (b) {
            case "UTF8":
            case "UTF16BE":
            case "UTF16LE":
                break;
            default:
                throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");
        }
        switch (d) {
            case "HEX":
                c = function(b, a, g) {
                    var f = b.length,
                        c, d, e, l, p;
                    if (0 !== f % 2) throw Error("String of HEX type must be in byte increments");
                    a = a || [0];
                    g = g || 0;
                    p = g >>> 3;
                    for (c = 0; c < f; c += 2) {
                        d = parseInt(b.substr(c, 2), 16);
                        if (isNaN(d)) throw Error("String of HEX type contains invalid characters");
                        l = (c >>> 1) + p;
                        for (e = l >>> 2; a.length <= e;) a.push(0);
                        a[e] |= d << 8 * (3 + l % 4 * -1)
                    }
                    return {
                        value: a,
                        binLen: 4 * f + g
                    }
                };
                break;
            case "TEXT":
                c = function(c, a, g) {
                    var f, d, k = 0,
                        e, l, p, q, t, n;
                    a = a || [0];
                    g = g || 0;
                    p = g >>> 3;
                    if ("UTF8" === b)
                        for (n = 3, e = 0; e < c.length; e += 1)
                            for (f = c.charCodeAt(e), d = [], 128 > f ? d.push(f) : 2048 > f ? (d.push(192 | f >>> 6), d.push(128 | f & 63)) : 55296 > f || 57344 <= f ? d.push(224 | f >>> 12, 128 | f >>> 6 & 63, 128 | f & 63) : (e += 1, f = 65536 + ((f & 1023) << 10 | c.charCodeAt(e) & 1023), d.push(240 | f >>> 18, 128 | f >>> 12 & 63, 128 | f >>> 6 & 63, 128 | f & 63)), l = 0; l < d.length; l += 1) {
                                t = k +
                                    p;
                                for (q = t >>> 2; a.length <= q;) a.push(0);
                                a[q] |= d[l] << 8 * (n + t % 4 * -1);
                                k += 1
                            } else if ("UTF16BE" === b || "UTF16LE" === b)
                                for (n = 2, e = 0; e < c.length; e += 1) {
                                    f = c.charCodeAt(e);
                                    "UTF16LE" === b && (l = f & 255, f = l << 8 | f >>> 8);
                                    t = k + p;
                                    for (q = t >>> 2; a.length <= q;) a.push(0);
                                    a[q] |= f << 8 * (n + t % 4 * -1);
                                    k += 2
                                }
                    return {
                        value: a,
                        binLen: 8 * k + g
                    }
                };
                break;
            case "B64":
                c = function(b, a, c) {
                    var f = 0,
                        d, k, e, l, p, q, n;
                    if (-1 === b.search(/^[a-zA-Z0-9=+\/]+$/)) throw Error("Invalid character in base-64 string");
                    k = b.indexOf("=");
                    b = b.replace(/\=/g, "");
                    if (-1 !== k && k < b.length) throw Error("Invalid '=' found in base-64 string");
                    a = a || [0];
                    c = c || 0;
                    q = c >>> 3;
                    for (k = 0; k < b.length; k += 4) {
                        p = b.substr(k, 4);
                        for (e = l = 0; e < p.length; e += 1) d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(p[e]), l |= d << 18 - 6 * e;
                        for (e = 0; e < p.length - 1; e += 1) {
                            n = f + q;
                            for (d = n >>> 2; a.length <= d;) a.push(0);
                            a[d] |= (l >>> 16 - 8 * e & 255) << 8 * (3 + n % 4 * -1);
                            f += 1
                        }
                    }
                    return {
                        value: a,
                        binLen: 8 * f + c
                    }
                };
                break;
            case "BYTES":
                c = function(b, a, c) {
                    var f, d, k, e, l;
                    a = a || [0];
                    c = c || 0;
                    k = c >>> 3;
                    for (d = 0; d < b.length; d += 1) f = b.charCodeAt(d), l = d + k, e = l >>> 2, a.length <= e && a.push(0), a[e] |= f << 8 * (3 + l % 4 * -1);
                    return {
                        value: a,
                        binLen: 8 * b.length + c
                    }
                };
                break;
            case "ARRAYBUFFER":
                try {
                    c = new ArrayBuffer(0)
                } catch (h) {
                    throw Error("ARRAYBUFFER not supported by this environment");
                }
                c = function(b, a, c) {
                    var d, m, k, e;
                    a = a || [0];
                    c = c || 0;
                    m = c >>> 3;
                    for (d = 0; d < b.byteLength; d += 1) e = d + m, k = e >>> 2, a.length <= k && a.push(0), a[k] |= b[d] << 8 * (3 + e % 4 * -1);
                    return {
                        value: a,
                        binLen: 8 * b.byteLength + c
                    }
                };
                break;
            default:
                throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");
        }
        return c
    }

    function n(d, b) {
        return d << b | d >>> 32 - b
    }

    function u(d, b) {
        var c = (d & 65535) +
            (b & 65535);
        return ((d >>> 16) + (b >>> 16) + (c >>> 16) & 65535) << 16 | c & 65535
    }

    function y(d, b, c, h, a) {
        var g = (d & 65535) + (b & 65535) + (c & 65535) + (h & 65535) + (a & 65535);
        return ((d >>> 16) + (b >>> 16) + (c >>> 16) + (h >>> 16) + (a >>> 16) + (g >>> 16) & 65535) << 16 | g & 65535
    }

    function x(d) {
        var b = [];
        if ("SHA-1" === d) b = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
        else throw Error("No SHA variants supported");
        return b
    }

    function z(d, b) {
        var c = [],
            h, a, g, f, m, k, e;
        h = b[0];
        a = b[1];
        g = b[2];
        f = b[3];
        m = b[4];
        for (e = 0; 80 > e; e += 1) c[e] = 16 > e ? d[e] : n(c[e - 3] ^ c[e - 8] ^ c[e - 14] ^
            c[e - 16], 1), k = 20 > e ? y(n(h, 5), a & g ^ ~a & f, m, 1518500249, c[e]) : 40 > e ? y(n(h, 5), a ^ g ^ f, m, 1859775393, c[e]) : 60 > e ? y(n(h, 5), a & g ^ a & f ^ g & f, m, 2400959708, c[e]) : y(n(h, 5), a ^ g ^ f, m, 3395469782, c[e]), m = f, f = g, g = n(a, 30), a = h, h = k;
        b[0] = u(h, b[0]);
        b[1] = u(a, b[1]);
        b[2] = u(g, b[2]);
        b[3] = u(f, b[3]);
        b[4] = u(m, b[4]);
        return b
    }

    function H(d, b, c, h) {
        var a;
        for (a = (b + 65 >>> 9 << 4) + 15; d.length <= a;) d.push(0);
        d[b >>> 5] |= 128 << 24 - b % 32;
        b += c;
        d[a] = b & 4294967295;
        d[a - 1] = b / 4294967296 | 0;
        b = d.length;
        for (a = 0; a < b; a += 16) h = z(d.slice(a, a + 16), h);
        return h
    }
    "function" === typeof define &&
        define.amd ? define(function() {
            return r
        }) : "undefined" !== typeof exports ? ("undefined" !== typeof module && module.exports && (module.exports = r), exports = r) : G.jsSHA = r
})(this);