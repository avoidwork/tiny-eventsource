## 1. Implement heartbeat tracking

- [ ] 1.1 Refactor heartbeat() in src/heartbeat.js to store the setTimeout ID on arg.#heartbeatTimeout
- [ ] 1.2 Verify recursive heartbeat calls update #heartbeatTimeout for the next interval

## 2. Add stop() method to EventSource

- [ ] 2.1 Add stop() method to EventSource class in src/eventsource.js with `#heartbeatTimeout` initialised to `null`
- [ ] 2.2 stop() MUST check `#heartbeatTimeout !== null`, call clearTimeout, then set `#heartbeatTimeout` to `null` and return this

## 3. Add tests

- [ ] 3.1 Add test: stop() cancels active heartbeat — verify no ping is sent after stop()
- [ ] 3.2 Add test: stop() on non-heartbeat instance is a no-op — verify no error
- [ ] 3.3 Add test: stop() returns the EventSource instance — verify method chaining
- [ ] 3.4 Add test: repeated stop() calls are safe — verify no error on multiple calls

## 4. Build and verify

- [ ] 4.1 Run npm run build (lint + rollup)
- [ ] 4.2 Run npm run mocha with full coverage — verify 100%
