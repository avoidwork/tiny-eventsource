## Context

The `heartbeat()` function in `src/heartbeat.js` uses recursive `setTimeout` to send periodic pings. The timeout ID is local to the function and cannot be externally cancelled. The current architecture couples the heartbeat scheduling directly inside `init()` with no reference to the timeout on the EventSource instance.

The EventSource class (`src/eventsource.js`) has `heartbeat` as a config object but no private field tracking the active timeout. When a client disconnects or the consumer wants to stop the stream mid-way, there is no API to halt the heartbeat.

## Goals / Non-Goals

**Goals:**
- Add a `stop()` method to EventSource that cancels any pending heartbeat timeout.
- Track the timeout ID on a private field (`this.#heartbeatTimeout`) initialised to `null`, with a null check before `clearTimeout()`.
- Refactor `heartbeat()` to report the timeout ID back to the instance.

**Non-Goals:**
- Changing the heartbeat interval mechanism (will keep recursive `setTimeout`, not switch to `setInterval`).
- Adding a `start()` method — heartbeat starts automatically in `init()` when `ms > 0`.
- Lifecycle management beyond cancellation (no restart/replace support).

## Decisions

1. **Store timeout ID on `this.#heartbeatTimeout` rather than a separate variable.**
   - Rationale: Keeps the timeout reference co-located with the EventSource instance. No closure needed for `stop()`. Uses ES private field syntax (`#`) for true encapsulation.
   - Alternative: Return the timeout ID from `heartbeat()`. Rejected — would require changing the `init()` call site to capture and store it, but the recursive call inside `heartbeat()` would still need to pass it back. Storing on the instance is simpler.

2. **Refactor `heartbeat()` to accept the instance and store timeout ID.**
   - Currently `heartbeat()` receives `arg` which is the EventSource instance (via `heartbeat(this)` in `init()`). Store `id = setTimeout(...)` then set `arg.#heartbeatTimeout = id`.
   - On recursive call, clear previous timeout if present, then store new one.
   - Rationale: The instance is already passed as `arg`. Adding `#heartbeatTimeout` assignment is minimal overhead and requires no signature change.

3. **`stop()` checks `#heartbeatTimeout` for `null`, clears the timeout, then sets field to `null`.**
   - Initialize `#heartbeatTimeout = null` in the constructor.
   - `stop()` checks `if (this.#heartbeatTimeout !== null)`, calls `clearTimeout(this.#heartbeatTimeout)`, then sets `this.#heartbeatTimeout = null`.
   - Rationale: Explicit null check avoids relying on `clearTimeout(undefined)` behaviour; resetting to `null` ensures repeated `stop()` calls are safe.

## Risks / Trade-offs

- **Risk**: Changing `heartbeat()` storage pattern could affect tests that mock the function. → **Mitigation**: The function is internal; tests interact via `eventsource()` factory and method calls, not by calling `heartbeat()` directly.
- **Trade-off**: Null check in `stop()` adds one extra branch. → Negligible cost; improves clarity and correctness guarantees.
