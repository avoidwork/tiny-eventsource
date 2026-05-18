## 1. Implement heartbeat tracking

- [x] 1.1 Refactor heartbeat() in src/heartbeat.js to store the setTimeout ID on arg.#heartbeatTimeout
- [x] 1.2 Verify recursive heartbeat calls update #heartbeatTimeout for the next interval

## 2. Add stop() method to EventSource

- [x] 2.1 Add stop() method to EventSource class in src/eventsource.js with `#heartbeatTimeout` initialised to `null`
- [x] 2.2 stop() MUST check `#heartbeatTimeout !== null`, call clearTimeout, then set `#heartbeatTimeout` to `null` and return this

## 3. Add tests

- [x] 3.1 Add test: stop() cancels active heartbeat — verify no ping is sent after stop()
- [x] 3.2 Add test: stop() on non-heartbeat instance is a no-op — verify no error
- [x] 3.3 Add test: stop() returns the EventSource instance — verify method chaining
- [x] 3.4 Add test: repeated stop() calls are safe — verify no error on multiple calls

## 4. Build and verify

- [x] 4.1 Run npm run build (lint + rollup)
- [x] 4.2 Run npm run test with full coverage — verify 100%
