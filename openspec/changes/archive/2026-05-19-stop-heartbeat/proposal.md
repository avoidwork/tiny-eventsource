## Why

The heartbeat mechanism currently uses recursive `setTimeout` calls with no externally accessible way to cancel it. When a client disconnects or the stream needs to be terminated mid-stream, there is no API to stop the heartbeat — the only workaround is setting `heartbeat.ms` to `0` (which has no effect on an already-pending timeout).

## What Changes

- Add a `stop()` method to the `EventSource` class that cancels any pending heartbeat timeout.
- Track the heartbeat timeout ID on a private field (`this.#heartbeatTimeout`) initialised to `null`, set to `null` after `clearTimeout()` is called.
- Refactor the `heartbeat()` helper to accept and store the timeout ID on the instance, enabling cancellation.

## Capabilities

### New Capabilities
- `stop-heartbeat`: Ability to programmatically cancel the heartbeat interval on an EventSource instance.

### Modified Capabilities
<!-- None — no existing spec-level behavior is changing. -->

## Impact

- **Modified**: `src/eventsource.js` — add `#heartbeatTimeout` field (default `null`) and `stop()` method to EventSource class; `stop()` checks for null before `clearTimeout()` and sets to `null` afterwards.
- **Modified**: `src/heartbeat.js` — refactor to accept the instance, store timeout ID, and support cancellation.
- **Added**: `src/constants.js` — no changes expected.
- **Modified**: `test/eventsource.js` — add tests for `stop()` method and heartbeat cancellation.
