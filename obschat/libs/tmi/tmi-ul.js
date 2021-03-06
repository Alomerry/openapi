!
    function s(o, i, r) {
      function a(t, e) {
        if (!i[t]) {
          if (!o[t]) {
            var n = "function" == typeof require && require;
            if (!e && n) return n(t, !0);
            if (c) return c(t, !0);
            throw (n = new Error("Cannot find module '" + t + "'")).code = "MODULE_NOT_FOUND", n
          }
          n = i[t] = {
            exports: {}
          }, o[t][0].call(n.exports, function (e) {
            return a(o[t][1][e] || e)
          }, n, n.exports, s, o, i, r)
        }
        return i[t].exports
      }
      for (var c = "function" == typeof require && require, e = 0; e < r.length; e++) a(r[e]);
      return a
    }({
      1: [function (e, t, n) {
        "use strict";
        e = e("./lib/client");
        t.exports = {
          client: e,
          Client: e
        }
      }, {
        "./lib/client": 3
      }],
      2: [function (e, t, n) {
        "use strict";
        var c = e("node-fetch"),
            u = e("./utils");
        t.exports = function (e, t) {
          var n = void 0 !== e.url ? e.url : e.uri;
          if (u.isURL(n) || (n = "https://api.twitch.tv/kraken".concat("/" === n[0] ? n : "/".concat(n))), u.isNode()) {
            var s, n = (r = u.merge({
              method: "GET",
              json: !0
            }, e, {
              url: n
            })).url;
            r.qs && (s = new URLSearchParams(r.qs), n += "?".concat(s));
            var o = {};
            c(n, {
              method: r.method,
              headers: r.headers,
              body: r.body
            }).then(function (e) {
              return o = {
                statusCode: e.status,
                headers: e.headers
              }, r.json ? e.json() : e.text()
            }).then(function (e) {
              return t(null, o, e)
            }, function (e) {
              return t(e, o, null)
            })
          } else {
            var i, r = u.merge({
                  method: "GET",
                  headers: {}
                }, e, {
                  url: n
                }),
                a = new XMLHttpRequest;
            for (i in a.open(r.method, r.url, !0), r.headers) a.setRequestHeader(i, r.headers[i]);
            a.responseType = "json", a.addEventListener("load", function (e) {
              4 == a.readyState && (200 != a.status ? t(a.status, null, null) : t(null, null, a.response))
            }), a.send()
          }
        }
      }, {
        "./utils": 9,
        "node-fetch": 10
      }],
      3: [function (c, u, e) {
        !
            function (a) {
              !
                  function () {
                    "use strict";

                    function n(e) {
                      if (this instanceof n == !1) return new n(e);
                      this.opts = H.get(e, {}), this.opts.channels = this.opts.channels || [], this.opts.connection = this.opts.connection || {}, this.opts.identity = this.opts.identity || {}, this.opts.options = this.opts.options || {}, this.clientId = H.get(this.opts.options.clientId, null), this._globalDefaultChannel = H.channel(H.get(this.opts.options.globalDefaultChannel, "#tmijs")), this.maxReconnectAttempts = H.get(this.opts.connection.maxReconnectAttempts, 1 / 0), this.maxReconnectInterval = H.get(this.opts.connection.maxReconnectInterval, 3e4), this.reconnect = H.get(this.opts.connection.reconnect, !1), this.reconnectDecay = H.get(this.opts.connection.reconnectDecay, 1.5), this.reconnectInterval = H.get(this.opts.connection.reconnectInterval, 1e3), this.reconnecting = !1, this.reconnections = 0, this.reconnectTimer = this.reconnectInterval, this.secure = H.get(this.opts.connection.secure, !this.opts.connection.server && !this.opts.connection.port), this.emotes = "", this.emotesets = {}, this.channels = [], this.currentLatency = 0, this.globaluserstate = {}, this.lastJoined = "", this.latency = new Date, this.moderators = {}, this.pingLoop = null, this.pingTimeout = null, this.reason = "", this.username = "", this.userstate = {}, this.wasCloseCalled = !1, this.ws = null;
                      var t = "error";
                      this.opts.options.debug && (t = "info"), this.log = this.opts.logger || i;
                      try {
                        i.setLevel(t)
                      } catch (e) { }
                      this.opts.channels.forEach(function (e, t, n) {
                        n[t] = H.channel(e)
                      }), o.call(this), this.setMaxListeners(0)
                    }
                    var e, t = c("./api"),
                        s = c("./commands"),
                        o = c("./events").EventEmitter,
                        i = c("./logger"),
                        q = c("./parser"),
                        G = c("./timer"),
                        r = (void 0 !== a ? a : "undefined" != typeof window ? window : {}).WebSocket || c("ws"),
                        H = c("./utils");
                    for (e in H.inherits(n, o), n.prototype.emits = function (e, t) {
                      for (var n = 0; n < e.length; n++) {
                        var s = n < t.length ? t[n] : t[t.length - 1];
                        this.emit.apply(this, [e[n]].concat(s))
                      }
                    }, n.prototype.off = n.prototype.removeListener, n.prototype.api = t, s) n.prototype[e] = s[e];
                    n.prototype.handleMessage = function (t) {
                      var n = this;
                      if (!H.isNull(t)) {
                        this.listenerCount("raw_message") && this.emit("raw_message", JSON.parse(JSON.stringify(t)), t);
                        var e, s, o, i, r, a, c, u, l = H.channel(H.get(t.params[0], null)),
                            h = H.get(t.params[1], null),
                            m = H.get(t.tags["msg-id"], null),
                            f = t.tags = q.badges(q.badgeInfo(q.emotes(t.tags)));
                        for (e in f) "emote-sets" !== e && "ban-duration" !== e && "bits" !== e && (s = f[e], H.isBoolean(s) ? s = null : "1" === s ? s = !0 : "0" === s ? s = !1 : H.isString(s) && (s = H.unescapeIRC(s)), f[e] = s);
                        if (H.isNull(t.prefix)) switch (t.command) {
                          case "PING":
                            this.emit("ping"), this._isConnected() && this.ws.send("PONG");
                            break;
                          case "PONG":
                            var p = new Date;
                            this.currentLatency = (p.getTime() - this.latency.getTime()) / 1e3, this.emits(["pong", "_promisePing"], [
                              [this.currentLatency]
                            ]), clearTimeout(this.pingTimeout);
                            break;
                          default:
                            this.log.warn("Could not parse message with no prefix:\n".concat(JSON.stringify(t, null, 4)))
                        } else if ("tmi.twitch.tv" === t.prefix) switch (t.command) {
                          case "002":
                          case "003":
                          case "004":
                          case "372":
                          case "375":
                          case "CAP":
                            break;
                          case "001":
                            this.username = t.params[0];
                            break;
                          case "376":
                            this.log.info("Connected to server."), this.userstate[this._globalDefaultChannel] = {}, this.emits(["connected", "_promiseConnect"], [
                              [this.server, this.port],
                              [null]
                            ]), this.reconnections = 0, this.reconnectTimer = this.reconnectInterval, this.pingLoop = setInterval(function () {
                              n._isConnected() && n.ws.send("PING"), n.latency = new Date, n.pingTimeout = setTimeout(function () {
                                H.isNull(n.ws) || (n.wasCloseCalled = !1, n.log.error("Ping timeout."), n.ws.close(), clearInterval(n.pingLoop), clearTimeout(n.pingTimeout))
                              }, H.get(n.opts.connection.timeout, 9999))
                            }, 6e4);
                            var d = H.get(this.opts.options.joinInterval, 2e3);
                            d < 300 && (d = 300);
                            var g = new G.queue(d),
                                _ = H.union(this.opts.channels, this.channels);
                            this.channels = [];
                            for (var b = 0; b < _.length; b++)!
                                function () {
                                  var e = _[b];
                                  g.add(function () {
                                    n._isConnected() && n.join(e).
                                    catch(function (e) {
                                      return n.log.error(e)
                                    })
                                  })
                                }();
                            g.run();
                            break;
                          case "NOTICE":
                            var v = [null],
                                y = [l, m, h],
                                w = [l, !0],
                                C = [l, !1],
                                k = [y, v],
                                T = [y, [m]],
                                x = "[".concat(l, "] ").concat(h);
                            switch (m) {
                              case "subs_on":
                                this.log.info("[".concat(l, "] This room is now in subscribers-only mode.")), this.emits(["subscriber", "subscribers", "_promiseSubscribers"], [w, w, v]);
                                break;
                              case "subs_off":
                                this.log.info("[".concat(l, "] This room is no longer in subscribers-only mode.")), this.emits(["subscriber", "subscribers", "_promiseSubscribersoff"], [C, C, v]);
                                break;
                              case "emote_only_on":
                                this.log.info("[".concat(l, "] This room is now in emote-only mode.")), this.emits(["emoteonly", "_promiseEmoteonly"], [w, v]);
                                break;
                              case "emote_only_off":
                                this.log.info("[".concat(l, "] This room is no longer in emote-only mode.")), this.emits(["emoteonly", "_promiseEmoteonlyoff"], [C, v]);
                                break;
                              case "slow_on":
                              case "slow_off":
                                break;
                              case "followers_on_zero":
                              case "followers_on":
                              case "followers_off":
                                break;
                              case "r9k_on":
                                this.log.info("[".concat(l, "] This room is now in r9k mode.")), this.emits(["r9kmode", "r9kbeta", "_promiseR9kbeta"], [w, w, v]);
                                break;
                              case "r9k_off":
                                this.log.info("[".concat(l, "] This room is no longer in r9k mode.")), this.emits(["r9kmode", "r9kbeta", "_promiseR9kbetaoff"], [C, C, v]);
                                break;
                              case "room_mods":
                                var S = h.split(": ")[1].toLowerCase().split(", ").filter(function (e) {
                                  return e
                                });
                                this.emits(["_promiseMods", "mods"], [
                                  [null, S],
                                  [l, S]
                                ]);
                                break;
                              case "no_mods":
                                this.emits(["_promiseMods", "mods"], [
                                  [null, []],
                                  [l, []]
                                ]);
                                break;
                              case "vips_success":
                                var E = (h = h.endsWith(".") ? h.slice(0, -1) : h).split(": ")[1].toLowerCase().split(", ").filter(function (e) {
                                  return e
                                });
                                this.emits(["_promiseVips", "vips"], [
                                  [null, E],
                                  [l, E]
                                ]);
                                break;
                              case "no_vips":
                                this.emits(["_promiseVips", "vips"], [
                                  [null, []],
                                  [l, []]
                                ]);
                                break;
                              case "already_banned":
                              case "bad_ban_admin":
                              case "bad_ban_broadcaster":
                              case "bad_ban_global_mod":
                              case "bad_ban_self":
                              case "bad_ban_staff":
                              case "usage_ban":
                                this.log.info(x), this.emits(["notice", "_promiseBan"], T);
                                break;
                              case "ban_success":
                                this.log.info(x), this.emits(["notice", "_promiseBan"], k);
                                break;
                              case "usage_clear":
                                this.log.info(x), this.emits(["notice", "_promiseClear"], T);
                                break;
                              case "usage_mods":
                                this.log.info(x), this.emits(["notice", "_promiseMods"], [y, [m, []]]);
                                break;
                              case "mod_success":
                                this.log.info(x), this.emits(["notice", "_promiseMod"], k);
                                break;
                              case "usage_vips":
                                this.log.info(x), this.emits(["notice", "_promiseVips"], [y, [m, []]]);
                                break;
                              case "usage_vip":
                              case "bad_vip_grantee_banned":
                              case "bad_vip_grantee_already_vip":
                              case "bad_vip_max_vips_reached":
                              case "bad_vip_achievement_incomplete":
                                this.log.info(x), this.emits(["notice", "_promiseVip"], [y, [m, []]]);
                                break;
                              case "vip_success":
                                this.log.info(x), this.emits(["notice", "_promiseVip"], k);
                                break;
                              case "usage_mod":
                              case "bad_mod_banned":
                              case "bad_mod_mod":
                                this.log.info(x), this.emits(["notice", "_promiseMod"], T);
                                break;
                              case "unmod_success":
                                this.log.info(x), this.emits(["notice", "_promiseUnmod"], k);
                                break;
                              case "unvip_success":
                                this.log.info(x), this.emits(["notice", "_promiseUnvip"], k);
                                break;
                              case "usage_unmod":
                              case "bad_unmod_mod":
                                this.log.info(x), this.emits(["notice", "_promiseUnmod"], T);
                                break;
                              case "usage_unvip":
                              case "bad_unvip_grantee_not_vip":
                                this.log.info(x), this.emits(["notice", "_promiseUnvip"], T);
                                break;
                              case "color_changed":
                                this.log.info(x), this.emits(["notice", "_promiseColor"], k);
                                break;
                              case "usage_color":
                              case "turbo_only_color":
                                this.log.info(x), this.emits(["notice", "_promiseColor"], T);
                                break;
                              case "commercial_success":
                                this.log.info(x), this.emits(["notice", "_promiseCommercial"], k);
                                break;
                              case "usage_commercial":
                              case "bad_commercial_error":
                                this.log.info(x), this.emits(["notice", "_promiseCommercial"], T);
                                break;
                              case "hosts_remaining":
                                this.log.info(x);
                                E = isNaN(h[0]) ? 0 : parseInt(h[0]);
                                this.emits(["notice", "_promiseHost"], [y, [null, ~~E]]);
                                break;
                              case "bad_host_hosting":
                              case "bad_host_rate_exceeded":
                              case "bad_host_error":
                              case "usage_host":
                                this.log.info(x), this.emits(["notice", "_promiseHost"], [y, [m, null]]);
                                break;
                              case "already_r9k_on":
                              case "usage_r9k_on":
                                this.log.info(x), this.emits(["notice", "_promiseR9kbeta"], T);
                                break;
                              case "already_r9k_off":
                              case "usage_r9k_off":
                                this.log.info(x), this.emits(["notice", "_promiseR9kbetaoff"], T);
                                break;
                              case "timeout_success":
                                this.log.info(x), this.emits(["notice", "_promiseTimeout"], k);
                                break;
                              case "delete_message_success":
                                this.log.info("[".concat(l, " ").concat(h, "]")), this.emits(["notice", "_promiseDeletemessage"], k);
                              case "already_subs_off":
                              case "usage_subs_off":
                                this.log.info(x), this.emits(["notice", "_promiseSubscribersoff"], T);
                                break;
                              case "already_subs_on":
                              case "usage_subs_on":
                                this.log.info(x), this.emits(["notice", "_promiseSubscribers"], T);
                                break;
                              case "already_emote_only_off":
                              case "usage_emote_only_off":
                                this.log.info(x), this.emits(["notice", "_promiseEmoteonlyoff"], T);
                                break;
                              case "already_emote_only_on":
                              case "usage_emote_only_on":
                                this.log.info(x), this.emits(["notice", "_promiseEmoteonly"], T);
                                break;
                              case "usage_slow_on":
                                this.log.info(x), this.emits(["notice", "_promiseSlow"], T);
                                break;
                              case "usage_slow_off":
                                this.log.info(x), this.emits(["notice", "_promiseSlowoff"], T);
                                break;
                              case "usage_timeout":
                              case "bad_timeout_admin":
                              case "bad_timeout_broadcaster":
                              case "bad_timeout_duration":
                              case "bad_timeout_global_mod":
                              case "bad_timeout_self":
                              case "bad_timeout_staff":
                                this.log.info(x), this.emits(["notice", "_promiseTimeout"], T);
                                break;
                              case "untimeout_success":
                              case "unban_success":
                                this.log.info(x), this.emits(["notice", "_promiseUnban"], k);
                                break;
                              case "usage_unban":
                              case "bad_unban_no_ban":
                                this.log.info(x), this.emits(["notice", "_promiseUnban"], T);
                                break;
                              case "usage_delete":
                              case "bad_delete_message_error":
                              case "bad_delete_message_broadcaster":
                              case "bad_delete_message_mod":
                                this.log.info(x), this.emits(["notice", "_promiseDeletemessage"], T);
                                break;
                              case "usage_unhost":
                              case "not_hosting":
                                this.log.info(x), this.emits(["notice", "_promiseUnhost"], T);
                                break;
                              case "whisper_invalid_login":
                              case "whisper_invalid_self":
                              case "whisper_limit_per_min":
                              case "whisper_limit_per_sec":
                              case "whisper_restricted":
                              case "whisper_restricted_recipient":
                                this.log.info(x), this.emits(["notice", "_promiseWhisper"], T);
                                break;
                              case "no_permission":
                              case "msg_banned":
                              case "msg_room_not_found":
                              case "msg_channel_suspended":
                              case "tos_ban":
                              case "invalid_user":
                                this.log.info(x), this.emits(["notice", "_promiseBan", "_promiseClear", "_promiseUnban", "_promiseTimeout", "_promiseDeletemessage", "_promiseMods", "_promiseMod", "_promiseUnmod", "_promiseVips", "_promiseVip", "_promiseUnvip", "_promiseCommercial", "_promiseHost", "_promiseUnhost", "_promiseJoin", "_promisePart", "_promiseR9kbeta", "_promiseR9kbetaoff", "_promiseSlow", "_promiseSlowoff", "_promiseFollowers", "_promiseFollowersoff", "_promiseSubscribers", "_promiseSubscribersoff", "_promiseEmoteonly", "_promiseEmoteonlyoff", "_promiseWhisper"], [y, [m, l]]);
                                break;
                              case "msg_rejected":
                              case "msg_rejected_mandatory":
                                this.log.info(x), this.emit("automod", l, m, h);
                                break;
                              case "unrecognized_cmd":
                                this.log.info(x), this.emit("notice", l, m, h);
                                break;
                              case "cmds_available":
                              case "host_target_went_offline":
                              case "msg_censored_broadcaster":
                              case "msg_duplicate":
                              case "msg_emoteonly":
                              case "msg_verified_email":
                              case "msg_ratelimit":
                              case "msg_subsonly":
                              case "msg_timedout":
                              case "msg_bad_characters":
                              case "msg_channel_blocked":
                              case "msg_facebook":
                              case "msg_followersonly":
                              case "msg_followersonly_followed":
                              case "msg_followersonly_zero":
                              case "msg_slowmode":
                              case "msg_suspended":
                              case "no_help":
                              case "usage_disconnect":
                              case "usage_help":
                              case "usage_me":
                              case "unavailable_command":
                                this.log.info(x), this.emit("notice", l, m, h);
                                break;
                              case "host_on":
                              case "host_off":
                                break;
                              default:
                                h.includes("Login unsuccessful") || h.includes("Login authentication failed") || h.includes("Error logging in") || h.includes("Improperly formatted auth") ? (this.wasCloseCalled = !1, this.reconnect = !1, this.reason = h, this.log.error(this.reason), this.ws.close()) : h.includes("Invalid NICK") ? (this.wasCloseCalled = !1, this.reconnect = !1, this.reason = "Invalid NICK.", this.log.error(this.reason), this.ws.close()) : (this.log.warn("Could not parse NOTICE from tmi.twitch.tv:\n".concat(JSON.stringify(t, null, 4))), this.emit("notice", l, m, h))
                            }
                            break;
                          case "USERNOTICE":
                            var P = f["display-name"] || f.login,
                                d = f["msg-param-sub-plan"] || "",
                                L = H.unescapeIRC(H.get(f["msg-param-sub-plan-name"], "")) || null,
                                N = {
                                  prime: d.includes("Prime"),
                                  plan: d,
                                  planName: L
                                },
                                O = ~~(f["msg-param-streak-months"] || 0),
                                D = f["msg-param-recipient-display-name"] || f["msg-param-recipient-user-name"],
                                I = ~~f["msg-param-mass-gift-count"];
                            switch (f["message-type"] = m) {
                              case "resub":
                                this.emits(["resub", "subanniversary"], [
                                  [l, P, O, h, f, N]
                                ]);
                                break;
                              case "sub":
                                this.emit("subscription", l, P, N, h, f);
                                break;
                              case "subgift":
                                this.emit("subgift", l, P, O, D, N, f);
                                break;
                              case "anonsubgift":
                                this.emit("anonsubgift", l, O, D, N, f);
                                break;
                              case "submysterygift":
                                this.emit("submysterygift", l, P, I, N, f);
                                break;
                              case "anonsubmysterygift":
                                this.emit("anonsubmysterygift", l, I, N, f);
                                break;
                              case "primepaidupgrade":
                                this.emit("primepaidupgrade", l, P, N, f);
                                break;
                              case "giftpaidupgrade":
                                var R = f["msg-param-sender-name"] || f["msg-param-sender-login"];
                                this.emit("giftpaidupgrade", l, P, R, f);
                                break;
                              case "anongiftpaidupgrade":
                                this.emit("anongiftpaidupgrade", l, P, f);
                                break;
                              case "raid":
                                var P = f["msg-param-displayName"] || f["msg-param-login"],
                                    A = +f["msg-param-viewerCount"];
                                this.emit("raided", l, P, A, f);
                                break;
                              case "ritual":
                                R = f["msg-param-ritual-name"];
                                "new_chatter" === R ? this.emit("newchatter", l, P, f, h) : this.emit("ritual", R, l, P, f, h);
                                break;
                              default:
                                this.emit("usernotice", m, l, f, h)
                            }
                            break;
                          case "HOSTTARGET":
                            L = h.split(" "), A = ~~L[1] || 0;
                            "-" === L[0] ? (this.log.info("[".concat(l, "] Exited host mode.")), this.emits(["unhost", "_promiseUnhost"], [
                              [l, A],
                              [null]
                            ])) : (this.log.info("[".concat(l, "] Now hosting ").concat(L[0], " for ").concat(A, " viewer(s).")), this.emit("hosting", l, L[0], A));
                            break;
                          case "CLEARCHAT":
                            1 < t.params.length ? (o = H.get(t.tags["ban-duration"], null), H.isNull(o) ? (this.log.info("[".concat(l, "] ").concat(h, " has been banned.")), this.emit("ban", l, h, null, t.tags)) : (this.log.info("[".concat(l, "] ").concat(h, " has been timed out for ").concat(o, " seconds.")), this.emit("timeout", l, h, null, ~~o, t.tags))) : (this.log.info("[".concat(l, "] Chat was cleared by a moderator.")), this.emits(["clearchat", "_promiseClear"], [
                              [l],
                              [null]
                            ]));
                            break;
                          case "CLEARMSG":
                            1 < t.params.length && (o = h, P = f.login, f["message-type"] = "messagedeleted", this.log.info("[".concat(l, "] ").concat(P, "'s message has been deleted.")), this.emit("messagedeleted", l, P, o, f));
                            break;
                          case "RECONNECT":
                            this.log.info("Received RECONNECT request from Twitch.."), this.log.info("Disconnecting and reconnecting in ".concat(Math.round(this.reconnectTimer / 1e3), " seconds..")), this.disconnect().
                            catch(function (e) {
                              return n.log.error(e)
                            }), setTimeout(function () {
                              return n.connect().
                              catch(function (e) {
                                return n.log.error(e)
                              })
                            }, this.reconnectTimer);
                            break;
                          case "USERSTATE":
                            t.tags.username = this.username, "mod" === t.tags["user-type"] && (this.moderators[l] || (this.moderators[l] = []), this.moderators[l].includes(this.username) || this.moderators[l].push(this.username)), H.isJustinfan(this.getUsername()) || this.userstate[l] || (this.userstate[l] = f, this.lastJoined = l, this.channels.push(l), this.log.info("Joined ".concat(l)), this.emit("join", l, H.username(this.getUsername()), !0)), t.tags["emote-sets"] !== this.emotes && this._updateEmoteset(t.tags["emote-sets"]), this.userstate[l] = f;
                            break;
                          case "GLOBALUSERSTATE":
                            this.globaluserstate = f, void 0 !== t.tags["emote-sets"] && this._updateEmoteset(t.tags["emote-sets"]);
                            break;
                          case "ROOMSTATE":
                            H.channel(this.lastJoined) === l && this.emit("_promiseJoin", null, l), t.tags.channel = l, this.emit("roomstate", l, t.tags), t.tags.hasOwnProperty("subs-only") || (t.tags.hasOwnProperty("slow") && ("boolean" != typeof t.tags.slow || t.tags.slow ? (r = [l, !0, ~~t.tags.slow], this.log.info("[".concat(l, "] This room is now in slow mode.")), this.emits(["slow", "slowmode", "_promiseSlow"], [r, r, [null]])) : (i = [l, !1, 0], this.log.info("[".concat(l, "] This room is no longer in slow mode.")), this.emits(["slow", "slowmode", "_promiseSlowoff"], [i, i, [null]]))), t.tags.hasOwnProperty("followers-only") && ("-1" === t.tags["followers-only"] ? (i = [l, !1, 0], this.log.info("[".concat(l, "] This room is no longer in followers-only mode.")), this.emits(["followersonly", "followersmode", "_promiseFollowersoff"], [i, i, [null]])) : (r = [l, !0, ~~t.tags["followers-only"]], this.log.info("[".concat(l, "] This room is now in follower-only mode.")), this.emits(["followersonly", "followersmode", "_promiseFollowers"], [r, r, [null]]))));
                            break;
                          case "SERVERCHANGE":
                            break;
                          default:
                            this.log.warn("Could not parse message from tmi.twitch.tv:\n".concat(JSON.stringify(t, null, 4)))
                        } else if ("jtv" === t.prefix) "MODE" === t.command ? "+o" === h ? (this.moderators[l] || (this.moderators[l] = []), this.moderators[l].includes(t.params[2]) || this.moderators[l].push(t.params[2]), this.emit("mod", l, t.params[2])) : "-o" === h && (this.moderators[l] || (this.moderators[l] = []), this.moderators[l].filter(function (e) {
                          return e != t.params[2]
                        }), this.emit("unmod", l, t.params[2])) : this.log.warn("Could not parse message from jtv:\n".concat(JSON.stringify(t, null, 4)));
                        else switch (t.command) {
                            case "353":
                              this.emit("names", t.params[2], t.params[3].split(" "));
                              break;
                            case "366":
                              break;
                            case "JOIN":
                              var M = t.prefix.split("!")[0];
                              H.isJustinfan(this.getUsername()) && this.username === M && (this.lastJoined = l, this.channels.push(l), this.log.info("Joined ".concat(l)), this.emit("join", l, M, !0)), this.username !== M && this.emit("join", l, M, !1);
                              break;
                            case "PART":
                              var j, U = !1,
                                  M = t.prefix.split("!")[0];
                              this.username === M && (U = !0, this.userstate[l] && delete this.userstate[l], -1 !== (j = this.channels.indexOf(l)) && this.channels.splice(j, 1), -1 !== (j = this.opts.channels.indexOf(l)) && this.opts.channels.splice(j, 1), this.log.info("Left ".concat(l)), this.emit("_promisePart", null)), this.emit("part", l, M, U);
                              break;
                            case "WHISPER":
                              M = t.prefix.split("!")[0];
                              this.log.info("[WHISPER] <".concat(M, ">: ").concat(h)), t.tags.hasOwnProperty("username") || (t.tags.username = M), t.tags["message-type"] = "whisper";
                              var J = H.channel(t.tags.username);
                              this.emits(["whisper", "message"], [
                                [J, t.tags, h, !1]
                              ]);
                              break;
                            case "PRIVMSG":
                              t.tags.username = t.prefix.split("!")[0], "jtv" === t.tags.username ? (a = H.username(h.split(" ")[0]), c = h.includes("auto"), h.includes("hosting you for") ? (J = H.extractNumber(h), this.emit("hosted", l, a, J, c)) : h.includes("hosting you") && this.emit("hosted", l, a, 0, c)) : (a = H.get(this.opts.options.messagesLogLevel, "info"), c = H.actionMessage(h), t.tags["message-type"] = c ? "action" : "chat", h = c ? c[1] : h, t.tags.hasOwnProperty("bits") ? this.emit("cheer", l, t.tags, h) : (t.tags.hasOwnProperty("msg-id") ? "highlighted-message" !== t.tags["msg-id"] && "skip-subs-mode-message" !== t.tags["msg-id"] || (u = t.tags["msg-id"], this.emit("redeem", l, t.tags.username, u, t.tags, h)) : t.tags.hasOwnProperty("custom-reward-id") && (u = t.tags["custom-reward-id"], this.emit("redeem", l, t.tags.username, u, t.tags, h)), c ? (this.log[a]("[".concat(l, "] *<").concat(t.tags.username, ">: ").concat(h)), this.emits(["action", "message"], [
                                [l, t.tags, h, !1]
                              ])) : (this.log[a]("[".concat(l, "] <").concat(t.tags.username, ">: ").concat(h)), this.emits(["chat", "message"], [
                                [l, t.tags, h, !1]
                              ]))));
                              break;
                            default:
                              this.log.warn("Could not parse message:\n".concat(JSON.stringify(t, null, 4)))
                          }
                      }
                    }, n.prototype.connect = function () {
                      var s = this;
                      return new Promise(function (t, n) {
                        // irc-ws.chat.twitch.tv
                        // irs.chat.alomerry.com
                        s.server = H.get(s.opts.connection.server, "irc-ws.chat.twitch.tv"), s.port = H.get(s.opts.connection.port, 80), s.secure && (s.port = 443), 443 === s.port && (s.secure = !0), s.reconnectTimer = s.reconnectTimer * s.reconnectDecay, s.reconnectTimer >= s.maxReconnectInterval && (s.reconnectTimer = s.maxReconnectInterval), s._openConnection(), s.once("_promiseConnect", function (e) {
                          e ? n(e) : t([s.server, ~~s.port])
                        })
                      })
                    }, n.prototype._openConnection = function () {
                      this.ws = new r("".concat(this.secure ? "wss" : "ws", "://").concat(this.server, ":").concat(this.port, "/"), "irc"), this.ws.onmessage = this._onMessage.bind(this), this.ws.onerror = this._onError.bind(this), this.ws.onclose = this._onClose.bind(this), this.ws.onopen = this._onOpen.bind(this)
                    }, n.prototype._onOpen = function () {
                      var t = this;
                      H.isNull(this.ws) || 1 !== this.ws.readyState || (this.log.info("Connecting to ".concat(this.server, " on port ").concat(this.port, "..")), this.emit("connecting", this.server, ~~this.port), this.username = H.get(this.opts.identity.username, H.justinfan()), this._getToken().then(function (e) {
                        e = H.password(e);
                        t.log.info("Sending authentication to server.."), t.emit("logon"), t.ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership"), e ? t.ws.send("PASS ".concat(e)) : H.isJustinfan(t.username) && t.ws.send("PASS SCHMOOPIIE"), t.ws.send("NICK ".concat(t.username))
                      }).
                      catch(function (e) {
                        t.emits(["_promiseConnect", "disconnected"], [
                          [e],
                          ["Could not get a token."]
                        ])
                      }))
                    }, n.prototype._getToken = function () {
                      var e, t = this.opts.identity.password;
                      return "function" == typeof t ? (e = t()) instanceof Promise ? e : Promise.resolve(e) : Promise.resolve(t)
                    }, n.prototype._onMessage = function (e) {
                      var t = this;
                      e.data.split("\r\n").forEach(function (e) {
                        H.isNull(e) || t.handleMessage(q.msg(e))
                      })
                    }, n.prototype._onError = function () {
                      var t = this;
                      this.moderators = {}, this.userstate = {}, this.globaluserstate = {}, clearInterval(this.pingLoop), clearTimeout(this.pingTimeout), this.reason = H.isNull(this.ws) ? "Connection closed." : "Unable to connect.", this.emits(["_promiseConnect", "disconnected"], [
                        [this.reason]
                      ]), this.reconnect && this.reconnections === this.maxReconnectAttempts && (this.emit("maxreconnect"), this.log.error("Maximum reconnection attempts reached.")), this.reconnect && !this.reconnecting && this.reconnections <= this.maxReconnectAttempts - 1 && (this.reconnecting = !0, this.reconnections = this.reconnections + 1, this.log.error("Reconnecting in ".concat(Math.round(this.reconnectTimer / 1e3), " seconds..")), this.emit("reconnect"), setTimeout(function () {
                        t.reconnecting = !1, t.connect().
                        catch(function (e) {
                          return t.log.error(e)
                        })
                      }, this.reconnectTimer)), this.ws = null
                    }, n.prototype._onClose = function () {
                      var t = this;
                      this.moderators = {}, this.userstate = {}, this.globaluserstate = {}, clearInterval(this.pingLoop), clearTimeout(this.pingTimeout), this.wasCloseCalled ? (this.wasCloseCalled = !1, this.reason = "Connection closed.", this.log.info(this.reason), this.emits(["_promiseConnect", "_promiseDisconnect", "disconnected"], [
                        [this.reason],
                        [null],
                        [this.reason]
                      ])) : (this.emits(["_promiseConnect", "disconnected"], [
                        [this.reason]
                      ]), this.reconnect && this.reconnections === this.maxReconnectAttempts && (this.emit("maxreconnect"), this.log.error("Maximum reconnection attempts reached.")), this.reconnect && !this.reconnecting && this.reconnections <= this.maxReconnectAttempts - 1 && (this.reconnecting = !0, this.reconnections = this.reconnections + 1, this.log.error("Could not connect to server. Reconnecting in ".concat(Math.round(this.reconnectTimer / 1e3), " seconds..")), this.emit("reconnect"), setTimeout(function () {
                        t.reconnecting = !1, t.connect().
                        catch(function (e) {
                          return t.log.error(e)
                        })
                      }, this.reconnectTimer))), this.ws = null
                    }, n.prototype._getPromiseDelay = function () {
                      return this.currentLatency <= 600 ? 600 : this.currentLatency + 100
                    }, n.prototype._sendCommand = function (s, o, i, r) {
                      var a = this;
                      return new Promise(function (e, t) {
                        if (H.isNull(a.ws) || 1 !== a.ws.readyState) return t("Not connected to server.");
                        var n;
                        "number" == typeof s && H.promiseDelay(s).then(function () {
                          return t("No response from Twitch.")
                        }), H.isNull(o) ? (a.log.info("Executing command: ".concat(i)), a.ws.send(i)) : (n = H.channel(o), a.log.info("[".concat(n, "] Executing command: ").concat(i)), a.ws.send("PRIVMSG ".concat(n, " :").concat(i))), "function" == typeof r ? r(e, t) : e()
                      })
                    }, n.prototype._sendMessage = function (c, u, l, h) {
                      var m = this;
                      return new Promise(function (e, t) {
                        if (H.isNull(m.ws) || 1 !== m.ws.readyState) return t("Not connected to server.");
                        if (H.isJustinfan(m.getUsername())) return t("Cannot send anonymous messages.");
                        var n, s = H.channel(u);
                        m.userstate[s] || (m.userstate[s] = {}), 500 <= l.length && (n = H.splitLine(l, 500), l = n[0], setTimeout(function () {
                          m._sendMessage(c, u, n[1], function () { })
                        }, 350)), m.ws.send("PRIVMSG ".concat(s, " :").concat(l));
                        var o = {};
                        Object.keys(m.emotesets).forEach(function (e) {
                          return m.emotesets[e].forEach(function (e) {
                            return (H.isRegex(e.code) ? q.emoteRegex : q.emoteString)(l, e.code, e.id, o)
                          })
                        });
                        var i = H.merge(m.userstate[s], q.emotes({
                              emotes: q.transformEmotes(o) || null
                            })),
                            r = H.get(m.opts.options.messagesLogLevel, "info"),
                            a = H.actionMessage(l);
                        a ? (i["message-type"] = "action", m.log[r]("[".concat(s, "] *<").concat(m.getUsername(), ">: ").concat(a[1])), m.emits(["action", "message"], [
                          [s, i, a[1], !0]
                        ])) : (i["message-type"] = "chat", m.log[r]("[".concat(s, "] <").concat(m.getUsername(), ">: ").concat(l)), m.emits(["chat", "message"], [
                          [s, i, l, !0]
                        ])), "function" == typeof h ? h(e, t) : e()
                      })
                    }, n.prototype._updateEmoteset = function (s) {
                      var o = this;
                      this.emotes = s, this._getToken().then(function (e) {
                        return o.api({
                          url: "/chat/emoticon_images?emotesets=".concat(s),
                          headers: {
                            Accept: "application/vnd.twitchtv.v5+json",
                            Authorization: "OAuth ".concat(H.token(e)),
                            "Client-ID": o.clientId
                          }
                        }, function (e, t, n) {
                          return e ? void setTimeout(function () {
                            return o._updateEmoteset(s)
                          }, 6e4) : (o.emotesets = n.emoticon_sets || {}, o.emit("emotesets", s, o.emotesets))
                        })
                      }).
                      catch(function () {
                        return setTimeout(function () {
                          return o._updateEmoteset(s)
                        }, 6e4)
                      })
                    }, n.prototype.getUsername = function () {
                      return this.username
                    }, n.prototype.getOptions = function () {
                      return this.opts
                    }, n.prototype.getChannels = function () {
                      return this.channels
                    }, n.prototype.isMod = function (e, t) {
                      e = H.channel(e);
                      return this.moderators[e] || (this.moderators[e] = []), this.moderators[e].includes(H.username(t))
                    }, n.prototype.readyState = function () {
                      return H.isNull(this.ws) ? "CLOSED" : ["CONNECTING", "OPEN", "CLOSING", "CLOSED"][this.ws.readyState]
                    }, n.prototype._isConnected = function () {
                      return null !== this.ws && 1 === this.ws.readyState
                    }, n.prototype.disconnect = function () {
                      var n = this;
                      return new Promise(function (e, t) {
                        H.isNull(n.ws) || 3 === n.ws.readyState ? (n.log.error("Cannot disconnect from server. Socket is not opened or connection is already closing."), t("Cannot disconnect from server. Socket is not opened or connection is already closing.")) : (n.wasCloseCalled = !0, n.log.info("Disconnecting from server.."), n.ws.close(), n.once("_promiseDisconnect", function () {
                          return e([n.server, ~~n.port])
                        }))
                      })
                    }, void 0 !== u && u.exports && (u.exports = n), "undefined" != typeof window && (window.tmi = {}, window.tmi.client = n, window.tmi.Client = n)
                  }.call(this)
            }.call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
      }, {
        "./api": 2,
        "./commands": 4,
        "./events": 5,
        "./logger": 6,
        "./parser": 7,
        "./timer": 8,
        "./utils": 9,
        ws: 10
      }],
      4: [function (e, t, n) {
        "use strict";
        var u = e("./utils");

        function s(s, o) {
          var e = this;
          return s = u.channel(s), o = u.get(o, 30), this._sendCommand(this._getPromiseDelay(), s, "/followers ".concat(o), function (t, n) {
            e.once("_promiseFollowers", function (e) {
              e ? n(e) : t([s, ~~o])
            })
          })
        }
        function o(s) {
          var e = this;
          return s = u.channel(s), this._sendCommand(this._getPromiseDelay(), s, "/followersoff", function (t, n) {
            e.once("_promiseFollowersoff", function (e) {
              e ? n(e) : t([s])
            })
          })
        }
        function i(s) {
          var e = this;
          return s = u.channel(s), this._sendCommand(this._getPromiseDelay(), null, "PART ".concat(s), function (t, n) {
            e.once("_promisePart", function (e) {
              e ? n(e) : t([s])
            })
          })
        }
        function r(s) {
          var e = this;
          return s = u.channel(s), this._sendCommand(this._getPromiseDelay(), s, "/r9kbeta", function (t, n) {
            e.once("_promiseR9kbeta", function (e) {
              e ? n(e) : t([s])
            })
          })
        }
        function a(s) {
          var e = this;
          return s = u.channel(s), this._sendCommand(this._getPromiseDelay(), s, "/r9kbetaoff", function (t, n) {
            e.once("_promiseR9kbetaoff", function (e) {
              e ? n(e) : t([s])
            })
          })
        }
        function c(s, o) {
          var e = this;
          return s = u.channel(s), o = u.get(o, 300), this._sendCommand(this._getPromiseDelay(), s, "/slow ".concat(o), function (t, n) {
            e.once("_promiseSlow", function (e) {
              e ? n(e) : t([s, ~~o])
            })
          })
        }
        function l(s) {
          var e = this;
          return s = u.channel(s), this._sendCommand(this._getPromiseDelay(), s, "/slowoff", function (t, n) {
            e.once("_promiseSlowoff", function (e) {
              e ? n(e) : t([s])
            })
          })
        }
        t.exports = {
          action: function (n, s) {
            return n = u.channel(n), s = "ACTION ".concat(s, ""), this._sendMessage(this._getPromiseDelay(), n, s, function (e, t) {
              e([n, s])
            })
          },
          ban: function (s, o, i) {
            var e = this;
            return s = u.channel(s), o = u.username(o), i = u.get(i, ""), this._sendCommand(this._getPromiseDelay(), s, "/ban ".concat(o, " ").concat(i), function (t, n) {
              e.once("_promiseBan", function (e) {
                e ? n(e) : t([s, o, i])
              })
            })
          },
          clear: function (s) {
            var e = this;
            return s = u.channel(s), this._sendCommand(this._getPromiseDelay(), s, "/clear", function (t, n) {
              e.once("_promiseClear", function (e) {
                e ? n(e) : t([s])
              })
            })
          },
          color: function (e, s) {
            var o = this;
            return s = u.get(s, e), this._sendCommand(this._getPromiseDelay(), "#tmijs", "/color ".concat(s), function (t, n) {
              o.once("_promiseColor", function (e) {
                e ? n(e) : t([s])
              })
            })
          },
          commercial: function (s, o) {
            var e = this;
            return s = u.channel(s), o = u.get(o, 30), this._sendCommand(this._getPromiseDelay(), s, "/commercial ".concat(o), function (t, n) {
              e.once("_promiseCommercial", function (e) {
                e ? n(e) : t([s, ~~o])
              })
            })
          },
          deletemessage: function (s, e) {
            var o = this;
            return s = u.channel(s), this._sendCommand(this._getPromiseDelay(), s, "/delete ".concat(e), function (t, n) {
              o.once("_promiseDeletemessage", function (e) {
                e ? n(e) : t([s])
              })
            })
          },
          emoteonly: function (s) {
            var e = this;
            return s = u.channel(s), this._sendCommand(this._getPromiseDelay(), s, "/emoteonly", function (t, n) {
              e.once("_promiseEmoteonly", function (e) {
                e ? n(e) : t([s])
              })
            })
          },
          emoteonlyoff: function (s) {
            var e = this;
            return s = u.channel(s), this._sendCommand(this._getPromiseDelay(), s, "/emoteonlyoff", function (t, n) {
              e.once("_promiseEmoteonlyoff", function (e) {
                e ? n(e) : t([s])
              })
            })
          },
          followersonly: s,
          followersmode: s,
          followersonlyoff: o,
          followersmodeoff: o,
          host: function (o, i) {
            var e = this;
            return o = u.channel(o), i = u.username(i), this._sendCommand(2e3, o, "/host ".concat(i), function (n, s) {
              e.once("_promiseHost", function (e, t) {
                e ? s(e) : n([o, i, ~~t])
              })
            })
          },
          join: function (a) {
            var c = this;
            return a = u.channel(a), this._sendCommand(null, null, "JOIN ".concat(a), function (s, o) {
              var i = "_promiseJoin",
                  r = !1,
                  e = function e(t, n) {
                    a === u.channel(n) && (c.removeListener(i, e), r = !0, t ? o(t) : s([a]))
                  };
              c.on(i, e);
              e = c._getPromiseDelay();
              u.promiseDelay(e).then(function () {
                r || c.emit(i, "No response from Twitch.", a)
              })
            })
          },
          mod: function (s, o) {
            var e = this;
            return s = u.channel(s), o = u.username(o), this._sendCommand(this._getPromiseDelay(), s, "/mod ".concat(o), function (t, n) {
              e.once("_promiseMod", function (e) {
                e ? n(e) : t([s, o])
              })
            })
          },
          mods: function (o) {
            var i = this;
            return o = u.channel(o), this._sendCommand(this._getPromiseDelay(), o, "/mods", function (n, s) {
              i.once("_promiseMods", function (e, t) {
                e ? s(e) : (t.forEach(function (e) {
                  i.moderators[o] || (i.moderators[o] = []), i.moderators[o].includes(e) || i.moderators[o].push(e)
                }), n(t))
              })
            })
          },
          part: i,
          leave: i,
          ping: function () {
            var n = this;
            return this._sendCommand(this._getPromiseDelay(), null, "PING", function (t, e) {
              n.latency = new Date, n.pingTimeout = setTimeout(function () {
                null !== n.ws && (n.wasCloseCalled = !1, n.log.error("Ping timeout."), n.ws.close(), clearInterval(n.pingLoop), clearTimeout(n.pingTimeout))
              }, u.get(n.opts.connection.timeout, 9999)), n.once("_promisePing", function (e) {
                return t([parseFloat(e)])
              })
            })
          },
          r9kbeta: r,
          r9kmode: r,
          r9kbetaoff: a,
          r9kmodeoff: a,
          raw: function (n) {
            return this._sendCommand(this._getPromiseDelay(), null, n, function (e, t) {
              e([n])
            })
          },
          say: function (n, s) {
            return n = u.channel(n), s.startsWith(".") && !s.startsWith("..") || s.startsWith("/") || s.startsWith("\\") ? "me " === s.substr(1, 3) ? this.action(n, s.substr(4)) : this._sendCommand(this._getPromiseDelay(), n, s, function (e, t) {
              e([n, s])
            }) : this._sendMessage(this._getPromiseDelay(), n, s, function (e, t) {
              e([n, s])
            })
          },
          slow: c,
          slowmode: c,
          slowoff: l,
          slowmodeoff: l,
          subscribers: function (s) {
            var e = this;
            return s = u.channel(s), this._sendCommand(this._getPromiseDelay(), s, "/subscribers", function (t, n) {
              e.once("_promiseSubscribers", function (e) {
                e ? n(e) : t([s])
              })
            })
          },
          subscribersoff: function (s) {
            var e = this;
            return s = u.channel(s), this._sendCommand(this._getPromiseDelay(), s, "/subscribersoff", function (t, n) {
              e.once("_promiseSubscribersoff", function (e) {
                e ? n(e) : t([s])
              })
            })
          },
          timeout: function (s, o, i, r) {
            var e = this;
            return s = u.channel(s), o = u.username(o), u.isNull(i) || u.isInteger(i) || (r = i, i = 300), i = u.get(i, 300), r = u.get(r, ""), this._sendCommand(this._getPromiseDelay(), s, "/timeout ".concat(o, " ").concat(i, " ").concat(r), function (t, n) {
              e.once("_promiseTimeout", function (e) {
                e ? n(e) : t([s, o, ~~i, r])
              })
            })
          },
          unban: function (s, o) {
            var e = this;
            return s = u.channel(s), o = u.username(o), this._sendCommand(this._getPromiseDelay(), s, "/unban ".concat(o), function (t, n) {
              e.once("_promiseUnban", function (e) {
                e ? n(e) : t([s, o])
              })
            })
          },
          unhost: function (s) {
            var e = this;
            return s = u.channel(s), this._sendCommand(2e3, s, "/unhost", function (t, n) {
              e.once("_promiseUnhost", function (e) {
                e ? n(e) : t([s])
              })
            })
          },
          unmod: function (s, o) {
            var e = this;
            return s = u.channel(s), o = u.username(o), this._sendCommand(this._getPromiseDelay(), s, "/unmod ".concat(o), function (t, n) {
              e.once("_promiseUnmod", function (e) {
                e ? n(e) : t([s, o])
              })
            })
          },
          unvip: function (s, o) {
            var e = this;
            return s = u.channel(s), o = u.username(o), this._sendCommand(this._getPromiseDelay(), s, "/unvip ".concat(o), function (t, n) {
              e.once("_promiseUnvip", function (e) {
                e ? n(e) : t([s, o])
              })
            })
          },
          vip: function (s, o) {
            var e = this;
            return s = u.channel(s), o = u.username(o), this._sendCommand(this._getPromiseDelay(), s, "/vip ".concat(o), function (t, n) {
              e.once("_promiseVip", function (e) {
                e ? n(e) : t([s, o])
              })
            })
          },
          vips: function (e) {
            var t = this;
            return e = u.channel(e), this._sendCommand(this._getPromiseDelay(), e, "/vips", function (n, s) {
              t.once("_promiseVips", function (e, t) {
                e ? s(e) : n(t)
              })
            })
          },
          whisper: function (n, s) {
            var o = this;
            return (n = u.username(n)) === this.getUsername() ? Promise.reject("Cannot send a whisper to the same account.") : this._sendCommand(this._getPromiseDelay(), "#tmijs", "/w ".concat(n, " ").concat(s), function (e, t) {
              o.once("_promiseWhisper", function (e) {
                e && t(e)
              })
            }).
            catch(function (e) {
              if (e && "string" == typeof e && 0 !== e.indexOf("No response from Twitch.")) throw e;
              var t = u.channel(n),
                  e = u.merge({
                    "message-type": "whisper",
                    "message-id": null,
                    "thread-id": null,
                    username: o.getUsername()
                  }, o.globaluserstate);
              return o.emits(["whisper", "message"], [
                [t, e, s, !0],
                [t, e, s, !0]
              ]), [n, s]
            })
          }
        }
      }, {
        "./utils": 9
      }],
      5: [function (e, t, n) {
        "use strict";

        function s(e) {
          return (s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
              function (e) {
                return typeof e
              } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
              })(e)
        }
        function o() {
          this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0
        }
        function c(e) {
          return "function" == typeof e
        }
        function u(e) {
          return "object" === s(e) && null !== e
        }
        function a(e) {
          return void 0 === e
        } ((t.exports = o).EventEmitter = o).prototype._events = void 0, o.prototype._maxListeners = void 0, o.defaultMaxListeners = 10, o.prototype.setMaxListeners = function (e) {
          if ("number" != typeof e || e < 0 || isNaN(e)) throw TypeError("n must be a positive number");
          return this._maxListeners = e, this
        }, o.prototype.emit = function (e) {
          var t, n, s, o, i, r;
          if (this._events || (this._events = {}), "error" === e && (!this._events.error || u(this._events.error) && !this._events.error.length)) {
            if ((t = arguments[1]) instanceof Error) throw t;
            throw TypeError('Uncaught, unspecified "error" event.')
          }
          if (a(n = this._events[e])) return !1;
          if (c(n)) switch (arguments.length) {
            case 1:
              n.call(this);
              break;
            case 2:
              n.call(this, arguments[1]);
              break;
            case 3:
              n.call(this, arguments[1], arguments[2]);
              break;
            default:
              o = Array.prototype.slice.call(arguments, 1), n.apply(this, o)
          } else if (u(n)) for (o = Array.prototype.slice.call(arguments, 1), s = (r = n.slice()).length, i = 0; i < s; i++) r[i].apply(this, o);
          return !0
        }, o.prototype.on = o.prototype.addListener = function (e, t) {
          var n;
          if (!c(t)) throw TypeError("listener must be a function");
          return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", e, c(t.listener) ? t.listener : t), this._events[e] ? u(this._events[e]) ? this._events[e].push(t) : this._events[e] = [this._events[e], t] : this._events[e] = t, u(this._events[e]) && !this._events[e].warned && (n = a(this._maxListeners) ? o.defaultMaxListeners : this._maxListeners) && 0 < n && this._events[e].length > n && (this._events[e].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length), "function" == typeof console.trace && console.trace()), this
        }, o.prototype.once = function (e, t) {
          if (!c(t)) throw TypeError("listener must be a function");
          var n = !1;
          if (this._events.hasOwnProperty(e) && "_" === e.charAt(0)) {
            var s, o = 1,
                i = e;
            for (s in this._events) this._events.hasOwnProperty(s) && s.startsWith(i) && o++;
            e += o
          }
          function r() {
            "_" !== e.charAt(0) || isNaN(e.substr(e.length - 1)) || (e = e.substring(0, e.length - 1)), this.removeListener(e, r), n || (n = !0, t.apply(this, arguments))
          }
          return r.listener = t, this.on(e, r), this
        }, o.prototype.removeListener = function (e, t) {
          var n, s, o, i;
          if (!c(t)) throw TypeError("listener must be a function");
          if (!this._events || !this._events[e]) return this;
          if (o = (n = this._events[e]).length, s = -1, n === t || c(n.listener) && n.listener === t) {
            if (delete this._events[e], this._events.hasOwnProperty(e + "2") && "_" === e.charAt(0)) {
              var r, a = e;
              for (r in this._events) this._events.hasOwnProperty(r) && r.startsWith(a) && (isNaN(parseInt(r.substr(r.length - 1))) || (this._events[e + parseInt(r.substr(r.length - 1) - 1)] = this._events[r], delete this._events[r]));
              this._events[e] = this._events[e + "1"], delete this._events[e + "1"]
            }
            this._events.removeListener && this.emit("removeListener", e, t)
          } else if (u(n)) {
            for (i = o; 0 < i--;) if (n[i] === t || n[i].listener && n[i].listener === t) {
              s = i;
              break
            }
            if (s < 0) return this;
            1 === n.length ? (n.length = 0, delete this._events[e]) : n.splice(s, 1), this._events.removeListener && this.emit("removeListener", e, t)
          }
          return this
        }, o.prototype.removeAllListeners = function (e) {
          var t, n;
          if (!this._events) return this;
          if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e], this;
          if (0 === arguments.length) {
            for (t in this._events) "removeListener" !== t && this.removeAllListeners(t);
            return this.removeAllListeners("removeListener"), this._events = {}, this
          }
          if (c(n = this._events[e])) this.removeListener(e, n);
          else if (n) for (; n.length;) this.removeListener(e, n[n.length - 1]);
          return delete this._events[e], this
        }, o.prototype.listeners = function (e) {
          e = this._events && this._events[e] ? c(this._events[e]) ? [this._events[e]] : this._events[e].slice() : [];
          return e
        }, o.prototype.listenerCount = function (e) {
          if (this._events) {
            e = this._events[e];
            if (c(e)) return 1;
            if (e) return e.length
          }
          return 0
        }, o.listenerCount = function (e, t) {
          return e.listenerCount(t)
        }
      }, {}],
      6: [function (e, t, n) {
        "use strict";
        var s = e("./utils"),
            o = "info",
            i = {
              trace: 0,
              debug: 1,
              info: 2,
              warn: 3,
              error: 4,
              fatal: 5
            };

        function r(t) {
          return function (e) {
            i[o] <= i[t] && console.log("[".concat(s.formatDate(new Date), "] ").concat(t, ": ").concat(e))
          }
        }
        t.exports = {
          setLevel: function (e) {
            o = e
          },
          trace: r("trace"),
          debug: r("debug"),
          info: r("info"),
          warn: r("warn"),
          error: r("error"),
          fatal: r("fatal")
        }
      }, {
        "./utils": 9
      }],
      7: [function (e, t, n) {
        "use strict";
        var h = e("./utils"),
            r = /\S+/g;

        function s(e, t, n, s, o) {
          var n = 2 < arguments.length && void 0 !== n ? n : ",",
              i = 3 < arguments.length && void 0 !== s ? s : "/",
              r = 4 < arguments.length ? o : void 0,
              s = e[t];
          if (void 0 === s) return e;
          o = h.isString(s);
          if (e[t + "-raw"] = o ? s : null, !0 === s) return e[t] = null, e;
          if (e[t] = {}, o) for (var a = s.split(n), c = 0; c < a.length; c++) {
            var u = a[c].split(i),
                l = u[1];
            void 0 !== r && l && (l = l.split(r)), e[t][u[0]] = l || null
          }
          return e
        }
        t.exports = {
          badges: function (e) {
            return s(e, "badges")
          },
          badgeInfo: function (e) {
            return s(e, "badge-info")
          },
          emotes: function (e) {
            return s(e, "emotes", "/", ":", ",")
          },
          emoteRegex: function (e, t, n, s) {
            r.lastIndex = 0;
            for (var o, i = new RegExp("(\\b|^|s)" + h.unescapeHtml(t) + "(\\b|$|s)"); null !== (o = r.exec(e));) i.test(o[0]) && (s[n] = s[n] || [], s[n].push([o.index, r.lastIndex - 1]))
          },
          emoteString: function (e, t, n, s) {
            var o;
            for (r.lastIndex = 0; null !== (o = r.exec(e));) o[0] === h.unescapeHtml(t) && (s[n] = s[n] || [], s[n].push([o.index, r.lastIndex - 1]))
          },
          transformEmotes: function (t) {
            var n = "";
            return Object.keys(t).forEach(function (e) {
              n = "".concat(n + e, ":"), t[e].forEach(function (e) {
                return n = "".concat(n + e.join("-"), ",")
              }), n = "".concat(n.slice(0, -1), "/")
            }), n.slice(0, -1)
          },
          formTags: function (e) {
            var t, n = [];
            for (t in e) {
              var s = h.escapeIRC(e[t]);
              n.push("".concat(t, "=").concat(s))
            }
            return "@".concat(n.join(";"))
          },
          msg: function (e) {
            var t = {
                  raw: e,
                  tags: {},
                  prefix: null,
                  command: null,
                  params: []
                },
                n = 0,
                s = 0;
            if (64 === e.charCodeAt(0)) {
              if (-1 === (s = e.indexOf(" "))) return null;
              for (var o = e.slice(1, s).split(";"), i = 0; i < o.length; i++) {
                var r = o[i],
                    a = r.split("=");
                t.tags[a[0]] = r.substring(r.indexOf("=") + 1) || !0
              }
              n = s + 1
            }
            for (; 32 === e.charCodeAt(n);) n++;
            if (58 === e.charCodeAt(n)) {
              if (-1 === (s = e.indexOf(" ", n))) return null;
              for (t.prefix = e.slice(n + 1, s), n = s + 1; 32 === e.charCodeAt(n);) n++
            }
            if (-1 === (s = e.indexOf(" ", n))) return e.length > n ? (t.command = e.slice(n), t) : null;
            for (t.command = e.slice(n, s), n = s + 1; 32 === e.charCodeAt(n);) n++;
            for (; n < e.length;) {
              if (s = e.indexOf(" ", n), 58 === e.charCodeAt(n)) {
                t.params.push(e.slice(n + 1));
                break
              }
              if (-1 === s) {
                if (-1 === s) {
                  t.params.push(e.slice(n));
                  break
                }
              } else for (t.params.push(e.slice(n, s)), n = s + 1; 32 === e.charCodeAt(n);) n++
            }
            return t
          }
        }
      }, {
        "./utils": 9
      }],
      8: [function (e, t, n) {
        "use strict";

        function s(e) {
          this.queue = [], this.index = 0, this.defaultDelay = e || 3e3
        }
        s.prototype.add = function (e, t) {
          this.queue.push({
            fn: e,
            delay: t
          })
        }, s.prototype.run = function (e) {
          !e && 0 !== e || (this.index = e), this.next()
        }, s.prototype.next = function () {
          var e = this,
              t = this.index++,
              t = this.queue[t],
              n = this.queue[this.index];
          t && (t.fn(), n && setTimeout(function () {
            e.next()
          }, n.delay || this.defaultDelay))
        }, s.prototype.reset = function () {
          this.index = 0
        }, s.prototype.clear = function () {
          this.index = 0, this.queue = []
        }, n.queue = s
      }, {}],
      9: [function (e, f, t) {
        !
            function (m) {
              !
                  function () {
                    "use strict";

                    function n(e) {
                      return function (e) {
                            if (Array.isArray(e)) return s(e)
                          }(e) ||
                          function (e) {
                            if ("undefined" != typeof Symbol && Symbol.iterator in Object(e)) return Array.from(e)
                          }(e) ||
                          function (e, t) {
                            if (!e) return;
                            if ("string" == typeof e) return s(e, t);
                            var n = Object.prototype.toString.call(e).slice(8, -1);
                            "Object" === n && e.constructor && (n = e.constructor.name);
                            if ("Map" === n || "Set" === n) return Array.from(e);
                            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return s(e, t)
                          }(e) ||
                          function () {
                            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                          }()
                    }
                    function s(e, t) {
                      (null == t || t > e.length) && (t = e.length);
                      for (var n = 0, s = new Array(t); n < t; n++) s[n] = e[n];
                      return s
                    }
                    function t(e) {
                      return (t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
                          function (e) {
                            return typeof e
                          } : function (e) {
                            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                          })(e)
                    }
                    var o, i = /^\u0001ACTION ([^\u0001]+)\u0001$/,
                        r = /^(justinfan)(\d+$)/,
                        a = /\\([sn:r\\])/g,
                        c = /([ \n;\r\\])/g,
                        u = {
                          s: " ",
                          n: "",
                          ":": ";",
                          r: ""
                        },
                        l = {
                          " ": "s",
                          "\n": "n",
                          ";": ":",
                          "\r": "r"
                        },
                        h = f.exports = {
                          get: function (e, t) {
                            return void 0 === e ? t : e
                          },
                          isBoolean: function (e) {
                            return "boolean" == typeof e
                          },
                          isFinite: (o = function (e) {
                            return isFinite(e) && !isNaN(parseFloat(e))
                          }, e.toString = function () {
                            return o.toString()
                          }, e),
                          isInteger: function (e) {
                            return !isNaN(h.toNumber(e, 0))
                          },
                          isJustinfan: function (e) {
                            return r.test(e)
                          },
                          isNull: function (e) {
                            return null === e
                          },
                          isRegex: function (e) {
                            return /[\|\\\^\$\*\+\?\:\#]/.test(e)
                          },
                          isString: function (e) {
                            return "string" == typeof e
                          },
                          isURL: function (e) {
                            return new RegExp("^(?:(?:https?|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?)(?::\\d{2,5})?(?:[/?#]\\S*)?$", "i").test(e)
                          },
                          justinfan: function () {
                            return "justinfan".concat(Math.floor(8e4 * Math.random() + 1e3))
                          },
                          token: function (e) {
                            return e ? e.toLowerCase().replace("oauth:", "") : ""
                          },
                          password: function (e) {
                            e = h.token(e);
                            return e ? "oauth:".concat(e) : ""
                          },
                          promiseDelay: function (t) {
                            return new Promise(function (e) {
                              return setTimeout(e, t)
                            })
                          },
                          replaceAll: function (e, t) {
                            if (null == e) return null;
                            for (var n in t) e = e.replace(new RegExp(n, "g"), t[n]);
                            return e
                          },
                          unescapeHtml: function (e) {
                            return e.replace(/\\&amp\\;/g, "&").replace(/\\&lt\\;/g, "<").replace(/\\&gt\\;/g, ">").replace(/\\&quot\\;/g, '"').replace(/\\&#039\\;/g, "'")
                          },
                          unescapeIRC: function (e) {
                            return e && e.includes("\\") ? e.replace(a, function (e, t) {
                              return t in u ? u[t] : t
                            }) : e
                          },
                          escapeIRC: function (e) {
                            return e && e.replace(c, function (e, t) {
                              return t in l ? "\\".concat(l[t]) : t
                            })
                          },
                          actionMessage: function (e) {
                            return e.match(i)
                          },
                          addWord: function (e, t) {
                            return e.length ? e + " " + t : e + t
                          },
                          channel: function (e) {
                            var t;
                            return "#" === (t = (e || "").toLowerCase())[0] ? t : "#" + t
                          },
                          extractNumber: function (e) {
                            for (var t = e.split(" "), n = 0; n < t.length; n++) if (h.isInteger(t[n])) return ~~t[n];
                            return 0
                          },
                          formatDate: function (e) {
                            var t = e.getHours(),
                                e = ((e = e.getMinutes()) < 10 ? "0" : "") + e;
                            return "".concat(t = (t < 10 ? "0" : "") + t, ":").concat(e)
                          },
                          inherits: function (e, t) {
                            e.super_ = t;

                            function n() { }
                            n.prototype = t.prototype, e.prototype = new n, e.prototype.constructor = e
                          },
                          isNode: function () {
                            try {
                              return "object" === (void 0 === m ? "undefined" : t(m)) && "[object process]" === Object.prototype.toString.call(m)
                            } catch (e) { }
                            return !1
                          },
                          merge: Object.assign,
                          splitLine: function (e, t) {
                            var n = e.substring(0, t).lastIndexOf(" ");
                            return -1 === n && (n = t - 1), [e.substring(0, n), e.substring(n + 1)]
                          },
                          toNumber: function (e, t) {
                            if (null === e) return 0;
                            t = Math.pow(10, h.isFinite(t) ? t : 0);
                            return Math.round(e * t) / t
                          },
                          union: function (e, t) {
                            return n(new Set([].concat(n(e), n(t))))
                          },
                          username: function (e) {
                            var t;
                            return "#" === (t = (e || "").toLowerCase())[0] ? t.slice(1) : t
                          }
                        };

                    function e(e) {
                      return o.apply(this, arguments)
                    }
                  }.call(this)
            }.call(this, e("_process"))
      }, {
        _process: 11
      }],
      10: [function (e, t, n) { }, {}],
      11: [function (e, t, n) {
        var s, o, t = t.exports = {};

        function i() {
          throw new Error("setTimeout has not been defined")
        }
        function r() {
          throw new Error("clearTimeout has not been defined")
        }
        function a(t) {
          if (s === setTimeout) return setTimeout(t, 0);
          if ((s === i || !s) && setTimeout) return s = setTimeout, setTimeout(t, 0);
          try {
            return s(t, 0)
          } catch (e) {
            try {
              return s.call(null, t, 0)
            } catch (e) {
              return s.call(this, t, 0)
            }
          }
        } !
            function () {
              try {
                s = "function" == typeof setTimeout ? setTimeout : i
              } catch (e) {
                s = i
              }
              try {
                o = "function" == typeof clearTimeout ? clearTimeout : r
              } catch (e) {
                o = r
              }
            }();
        var c, u = [],
            l = !1,
            h = -1;

        function m() {
          l && c && (l = !1, c.length ? u = c.concat(u) : h = -1, u.length && f())
        }
        function f() {
          if (!l) {
            var e = a(m);
            l = !0;
            for (var t = u.length; t;) {
              for (c = u, u = []; ++h < t;) c && c[h].run();
              h = -1, t = u.length
            }
            c = null, l = !1, function (t) {
              if (o === clearTimeout) return clearTimeout(t);
              if ((o === r || !o) && clearTimeout) return o = clearTimeout, clearTimeout(t);
              try {
                o(t)
              } catch (e) {
                try {
                  return o.call(null, t)
                } catch (e) {
                  return o.call(this, t)
                }
              }
            }(e)
          }
        }
        function p(e, t) {
          this.fun = e, this.array = t
        }
        function d() { }
        t.nextTick = function (e) {
          var t = new Array(arguments.length - 1);
          if (1 < arguments.length) for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
          u.push(new p(e, t)), 1 !== u.length || l || a(f)
        }, p.prototype.run = function () {
          this.fun.apply(null, this.array)
        }, t.title = "browser", t.browser = !0, t.env = {}, t.argv = [], t.version = "", t.versions = {}, t.on = d, t.addListener = d, t.once = d, t.off = d, t.removeListener = d, t.removeAllListeners = d, t.emit = d, t.prependListener = d, t.prependOnceListener = d, t.listeners = function (e) {
          return []
        }, t.binding = function (e) {
          throw new Error("process.binding is not supported")
        }, t.cwd = function () {
          return "/"
        }, t.chdir = function (e) {
          throw new Error("process.chdir is not supported")
        }, t.umask = function () {
          return 0
        }
      }, {}]
    }, {}, [1]);