/*
 * Adapted from the Wizardry License
 *
 * Copyright (c) 2016-2018 DaPorkchop_
 *
 * Permission is hereby granted to any persons and/or organizations using this software to copy, modify, merge, publish, and distribute it.
 * Said persons and/or organizations are not allowed to use the software or any derivatives of the work for commercial use or any other means to generate income, nor are they allowed to claim this software as their own.
 *
 * The persons and/or organizations are also disallowed from sub-licensing and/or trademarking this software without explicit permission from DaPorkchop_. 
 *
 * Any persons and/or organizations using this software must disclose their source code and have it publicly available, include this license, provide sufficient credit to the original authors of the project (IE: DaPorkchop_), as well as provide a link to the original project.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
'use strict';
(function(L) {
    function u(d, b, k) {
        var c = 0,
            a = [],
            l = 0,
            g, m, h, e, n, f, p, v, A = !1,
            q = [],
            u = [],
            w, z = !1,
            x = !1,
            t = -1;
        k = k || {};
        g = k.encoding || "UTF8";
        w = k.numRounds || 1;
        if (w !== parseInt(w, 10) || 1 > w) throw Error("numRounds must a integer >= 1");
        if (0 === d.lastIndexOf("SHA3-", 0) || 0 === d.lastIndexOf("SHAKE", 0)) {
            var C = 6;
            f = B;
            v = function(c) {
                var a = [],
                    e;
                for (e = 0; 5 > e; e += 1) a[e] = c[e].slice();
                return a
            };
            t = 1;
            if ("SHA3-224" === d) n = 1152, e = 224;
            else if ("SHA3-256" === d) n = 1088, e = 256;
            else if ("SHA3-384" === d) n = 832, e = 384;
            else if ("SHA3-512" === d) n =
                576, e = 512;
            else if ("SHAKE128" === d) n = 1344, e = -1, C = 31, x = !0;
            else if ("SHAKE256" === d) n = 1088, e = -1, C = 31, x = !0;
            else throw Error("Chosen SHA variant is not supported");
            p = function(c, a, e, g, d) {
                e = n;
                var b = C,
                    m, l = [],
                    f = e >>> 5,
                    h = 0,
                    k = a >>> 5;
                for (m = 0; m < k && a >= e; m += f) g = B(c.slice(m, m + f), g), a -= e;
                c = c.slice(m);
                for (a %= e; c.length < f;) c.push(0);
                m = a >>> 3;
                c[m >> 2] ^= b << m % 4 * 8;
                c[f - 1] ^= 2147483648;
                for (g = B(c, g); 32 * l.length < d;) {
                    c = g[h % 5][h / 5 | 0];
                    l.push(c.b);
                    if (32 * l.length >= d) break;
                    l.push(c.a);
                    h += 1;
                    0 === 64 * h % e && B(null, g)
                }
                return l
            }
        } else throw Error("Chosen SHA variant is not supported");
        h = D(b, g, t);
        m = y(d);
        this.setHMACKey = function(a, b, l) {
            var h;
            if (!0 === A) throw Error("HMAC key already set");
            if (!0 === z) throw Error("Cannot set HMAC key after calling update");
            if (!0 === x) throw Error("SHAKE is not supported for HMAC");
            g = (l || {}).encoding || "UTF8";
            b = D(b, g, t)(a);
            a = b.binLen;
            b = b.value;
            h = n >>> 3;
            l = h / 4 - 1;
            if (h < a / 8) {
                for (b = p(b, a, 0, y(d), e); b.length <= l;) b.push(0);
                b[l] &= 4294967040
            } else if (h > a / 8) {
                for (; b.length <= l;) b.push(0);
                b[l] &= 4294967040
            }
            for (a = 0; a <= l; a += 1) q[a] = b[a] ^ 909522486, u[a] = b[a] ^ 1549556828;
            m = f(q, m);
            c = n;
            A = !0
        };
        this.update = function(b) {
            var e, g, d, k = 0,
                p = n >>> 5;
            e = h(b, a, l);
            b = e.binLen;
            g = e.value;
            e = b >>> 5;
            for (d = 0; d < e; d += p) k + n <= b && (m = f(g.slice(d, d + p), m), k += n);
            c += k;
            a = g.slice(k >>> 5);
            l = b % n;
            z = !0
        };
        this.getHash = function(b, g) {
            var h, f, k, n;
            if (!0 === A) throw Error("Cannot call getHash after setting HMAC key");
            k = E(g);
            if (!0 === x) {
                if (-1 === k.shakeLen) throw Error("shakeLen must be specified in options");
                e = k.shakeLen
            }
            switch (b) {
                case "HEX":
                    h = function(a) {
                        return F(a, e, t, k)
                    };
                    break;
                case "B64":
                    h = function(a) {
                        return G(a, e, t, k)
                    };
                    break;
                case "BYTES":
                    h = function(a) {
                        return H(a, e, t)
                    };
                    break;
                case "ARRAYBUFFER":
                    try {
                        f = new ArrayBuffer(0)
                    } catch (r) {
                        throw Error("ARRAYBUFFER not supported by this environment");
                    }
                    h = function(a) {
                        return I(a, e, t)
                    };
                    break;
                default:
                    throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER");
            }
            n = p(a.slice(), l, c, v(m), e);
            for (f = 1; f < w; f += 1) !0 === x && 0 !== e % 32 && (n[n.length - 1] &= 16777215 >>> 24 - e % 32), n = p(n, e, 0, y(d), e);
            return h(n)
        };
        this.getHMAC = function(b, g) {
            var h, k, q, w;
            if (!1 === A) throw Error("Cannot call getHMAC without first setting HMAC key");
            q = E(g);
            switch (b) {
                case "HEX":
                    h = function(a) {
                        return F(a, e, t, q)
                    };
                    break;
                case "B64":
                    h = function(a) {
                        return G(a, e, t, q)
                    };
                    break;
                case "BYTES":
                    h = function(a) {
                        return H(a, e, t)
                    };
                    break;
                case "ARRAYBUFFER":
                    try {
                        h = new ArrayBuffer(0)
                    } catch (M) {
                        throw Error("ARRAYBUFFER not supported by this environment");
                    }
                    h = function(a) {
                        return I(a, e, t)
                    };
                    break;
                default:
                    throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");
            }
            k = p(a.slice(), l, c, v(m), e);
            w = f(u, y(d));
            w = p(k, e, n, w, e);
            return h(w)
        }
    }

    function f(d, b) {
        this.a = d;
        this.b = b
    }

    function F(d,
        b, k, c) {
        var a = "";
        b /= 8;
        var l, g, m;
        m = -1 === k ? 3 : 0;
        for (l = 0; l < b; l += 1) g = d[l >>> 2] >>> 8 * (m + l % 4 * k), a += "0123456789abcdef".charAt(g >>> 4 & 15) + "0123456789abcdef".charAt(g & 15);
        return c.outputUpper ? a.toUpperCase() : a
    }

    function G(d, b, k, c) {
        var a = "",
            l = b / 8,
            g, m, h, e;
        e = -1 === k ? 3 : 0;
        for (g = 0; g < l; g += 3)
            for (m = g + 1 < l ? d[g + 1 >>> 2] : 0, h = g + 2 < l ? d[g + 2 >>> 2] : 0, h = (d[g >>> 2] >>> 8 * (e + g % 4 * k) & 255) << 16 | (m >>> 8 * (e + (g + 1) % 4 * k) & 255) << 8 | h >>> 8 * (e + (g + 2) % 4 * k) & 255, m = 0; 4 > m; m += 1) 8 * g + 6 * m <= b ? a += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h >>>
                6 * (3 - m) & 63) : a += c.b64Pad;
        return a
    }

    function H(d, b, k) {
        var c = "";
        b /= 8;
        var a, l, g;
        g = -1 === k ? 3 : 0;
        for (a = 0; a < b; a += 1) l = d[a >>> 2] >>> 8 * (g + a % 4 * k) & 255, c += String.fromCharCode(l);
        return c
    }

    function I(d, b, k) {
        b /= 8;
        var c, a = new ArrayBuffer(b),
            l;
        l = -1 === k ? 3 : 0;
        for (c = 0; c < b; c += 1) a[c] = d[c >>> 2] >>> 8 * (l + c % 4 * k) & 255;
        return a
    }

    function E(d) {
        var b = {
            outputUpper: !1,
            b64Pad: "=",
            shakeLen: -1
        };
        d = d || {};
        b.outputUpper = d.outputUpper || !1;
        !0 === d.hasOwnProperty("b64Pad") && (b.b64Pad = d.b64Pad);
        if (!0 === d.hasOwnProperty("shakeLen")) {
            if (0 !== d.shakeLen %
                8) throw Error("shakeLen must be a multiple of 8");
            b.shakeLen = d.shakeLen
        }
        if ("boolean" !== typeof b.outputUpper) throw Error("Invalid outputUpper formatting option");
        if ("string" !== typeof b.b64Pad) throw Error("Invalid b64Pad formatting option");
        return b
    }

    function D(d, b, k) {
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
                d = function(c, a, b) {
                    var g = c.length,
                        d, h, e, f, r, p;
                    if (0 !== g % 2) throw Error("String of HEX type must be in byte increments");
                    a = a || [0];
                    b = b || 0;
                    r = b >>> 3;
                    p = -1 === k ? 3 : 0;
                    for (d = 0; d < g; d += 2) {
                        h = parseInt(c.substr(d, 2), 16);
                        if (isNaN(h)) throw Error("String of HEX type contains invalid characters");
                        f = (d >>> 1) + r;
                        for (e = f >>> 2; a.length <= e;) a.push(0);
                        a[e] |= h << 8 * (p + f % 4 * k)
                    }
                    return {
                        value: a,
                        binLen: 4 * g + b
                    }
                };
                break;
            case "TEXT":
                d = function(c, a, d) {
                    var g, m, h = 0,
                        e, f, r, p, v, q;
                    a = a || [0];
                    d = d || 0;
                    r = d >>> 3;
                    if ("UTF8" === b)
                        for (q = -1 === k ? 3 : 0, e = 0; e < c.length; e += 1)
                            for (g = c.charCodeAt(e), m = [], 128 > g ? m.push(g) : 2048 > g ? (m.push(192 | g >>> 6), m.push(128 | g & 63)) : 55296 > g || 57344 <= g ? m.push(224 |
                                    g >>> 12, 128 | g >>> 6 & 63, 128 | g & 63) : (e += 1, g = 65536 + ((g & 1023) << 10 | c.charCodeAt(e) & 1023), m.push(240 | g >>> 18, 128 | g >>> 12 & 63, 128 | g >>> 6 & 63, 128 | g & 63)), f = 0; f < m.length; f += 1) {
                                v = h + r;
                                for (p = v >>> 2; a.length <= p;) a.push(0);
                                a[p] |= m[f] << 8 * (q + v % 4 * k);
                                h += 1
                            } else if ("UTF16BE" === b || "UTF16LE" === b)
                                for (q = -1 === k ? 2 : 0, e = 0; e < c.length; e += 1) {
                                    g = c.charCodeAt(e);
                                    "UTF16LE" === b && (f = g & 255, g = f << 8 | g >>> 8);
                                    v = h + r;
                                    for (p = v >>> 2; a.length <= p;) a.push(0);
                                    a[p] |= g << 8 * (q + v % 4 * k);
                                    h += 2
                                }
                    return {
                        value: a,
                        binLen: 8 * h + d
                    }
                };
                break;
            case "B64":
                d = function(c, a, b) {
                    var d = 0,
                        f, h,
                        e, n, r, p, q, u;
                    if (-1 === c.search(/^[a-zA-Z0-9=+\/]+$/)) throw Error("Invalid character in base-64 string");
                    h = c.indexOf("=");
                    c = c.replace(/\=/g, "");
                    if (-1 !== h && h < c.length) throw Error("Invalid '=' found in base-64 string");
                    a = a || [0];
                    b = b || 0;
                    p = b >>> 3;
                    u = -1 === k ? 3 : 0;
                    for (h = 0; h < c.length; h += 4) {
                        r = c.substr(h, 4);
                        for (e = n = 0; e < r.length; e += 1) f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(r[e]), n |= f << 18 - 6 * e;
                        for (e = 0; e < r.length - 1; e += 1) {
                            q = d + p;
                            for (f = q >>> 2; a.length <= f;) a.push(0);
                            a[f] |= (n >>> 16 - 8 * e & 255) <<
                                8 * (u + q % 4 * k);
                            d += 1
                        }
                    }
                    return {
                        value: a,
                        binLen: 8 * d + b
                    }
                };
                break;
            case "BYTES":
                d = function(c, a, b) {
                    var d, f, h, e, n, q;
                    a = a || [0];
                    b = b || 0;
                    h = b >>> 3;
                    q = -1 === k ? 3 : 0;
                    for (f = 0; f < c.length; f += 1) d = c.charCodeAt(f), n = f + h, e = n >>> 2, a.length <= e && a.push(0), a[e] |= d << 8 * (q + n % 4 * k);
                    return {
                        value: a,
                        binLen: 8 * c.length + b
                    }
                };
                break;
            case "ARRAYBUFFER":
                try {
                    d = new ArrayBuffer(0)
                } catch (c) {
                    throw Error("ARRAYBUFFER not supported by this environment");
                }
                d = function(c, a, b) {
                    var d, f, h, e, n;
                    a = a || [0];
                    b = b || 0;
                    f = b >>> 3;
                    n = -1 === k ? 3 : 0;
                    for (d = 0; d < c.byteLength; d += 1) e = d + f, h =
                        e >>> 2, a.length <= h && a.push(0), a[h] |= c[d] << 8 * (n + e % 4 * k);
                    return {
                        value: a,
                        binLen: 8 * c.byteLength + b
                    }
                };
                break;
            default:
                throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");
        }
        return d
    }

    function z(d, b) {
        return 32 < b ? (b -= 32, new f(d.b << b | d.a >>> 32 - b, d.a << b | d.b >>> 32 - b)) : 0 !== b ? new f(d.a << b | d.b >>> 32 - b, d.b << b | d.a >>> 32 - b) : d
    }

    function q(d, b) {
        return new f(d.a ^ b.a, d.b ^ b.b)
    }

    function y(d) {
        var b = [];
        if (0 === d.lastIndexOf("SHA3-", 0) || 0 === d.lastIndexOf("SHAKE", 0))
            for (d = 0; 5 > d; d += 1) b[d] = [new f(0, 0), new f(0, 0), new f(0, 0),
                new f(0, 0), new f(0, 0)
            ];
        else throw Error("No SHA variants supported");
        return b
    }

    function B(d, b) {
        var k, c, a, l, g = [],
            m = [];
        if (null !== d)
            for (c = 0; c < d.length; c += 2) b[(c >>> 1) % 5][(c >>> 1) / 5 | 0] = q(b[(c >>> 1) % 5][(c >>> 1) / 5 | 0], new f(d[c + 1], d[c]));
        for (k = 0; 24 > k; k += 1) {
            l = y("SHA3-");
            for (c = 0; 5 > c; c += 1) {
                a = b[c][0];
                var h = b[c][1],
                    e = b[c][2],
                    n = b[c][3],
                    r = b[c][4];
                g[c] = new f(a.a ^ h.a ^ e.a ^ n.a ^ r.a, a.b ^ h.b ^ e.b ^ n.b ^ r.b)
            }
            for (c = 0; 5 > c; c += 1) m[c] = q(g[(c + 4) % 5], z(g[(c + 1) % 5], 1));
            for (c = 0; 5 > c; c += 1)
                for (a = 0; 5 > a; a += 1) b[c][a] = q(b[c][a], m[c]);
            for (c = 0; 5 >
                c; c += 1)
                for (a = 0; 5 > a; a += 1) l[a][(2 * c + 3 * a) % 5] = z(b[c][a], J[c][a]);
            for (c = 0; 5 > c; c += 1)
                for (a = 0; 5 > a; a += 1) b[c][a] = q(l[c][a], new f(~l[(c + 1) % 5][a].a & l[(c + 2) % 5][a].a, ~l[(c + 1) % 5][a].b & l[(c + 2) % 5][a].b));
            b[0][0] = q(b[0][0], K[k])
        }
        return b
    }
    var J, K;
    K = [new f(0, 1), new f(0, 32898), new f(2147483648, 32906), new f(2147483648, 2147516416), new f(0, 32907), new f(0, 2147483649), new f(2147483648, 2147516545), new f(2147483648, 32777), new f(0, 138), new f(0, 136), new f(0, 2147516425), new f(0, 2147483658), new f(0, 2147516555), new f(2147483648,
        139), new f(2147483648, 32905), new f(2147483648, 32771), new f(2147483648, 32770), new f(2147483648, 128), new f(0, 32778), new f(2147483648, 2147483658), new f(2147483648, 2147516545), new f(2147483648, 32896), new f(0, 2147483649), new f(2147483648, 2147516424)];
    J = [
        [0, 36, 3, 41, 18],
        [1, 44, 10, 45, 2],
        [62, 6, 43, 15, 61],
        [28, 55, 25, 21, 56],
        [27, 20, 39, 8, 14]
    ];
    "function" === typeof define && define.amd ? define(function() {
            return u
        }) : "undefined" !== typeof exports ? ("undefined" !== typeof module && module.exports && (module.exports = u), exports = u) :
        L.jsSHA = u
})(this);