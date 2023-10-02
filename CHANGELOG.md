### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

Generated by [`auto-changelog`](https://github.com/CookPete/auto-changelog).

#### [3.0.0](https://github.com/avoidwork/tiny-eventsource/compare/3.0.0...3.0.0)

### [3.0.0](https://github.com/avoidwork/tiny-eventsource/compare/2.0.0...3.0.0)

> 2 October 2023

- Adding constants, updating build files [`d684566`](https://github.com/avoidwork/tiny-eventsource/commit/d684566c335aa8cfffb63a717e726de1e5d9f046)
- Updating tests for 100% coverage, updating README.md, updating ignore files [`b29618b`](https://github.com/avoidwork/tiny-eventsource/commit/b29618be39b85aa5ac56a690184236d23271c03d)
- Updating README.md, LICENSE, & description in package.json [`c5486bf`](https://github.com/avoidwork/tiny-eventsource/commit/c5486bf55e49885444b98f7eadc788883471cb8a)

### [2.0.0](https://github.com/avoidwork/tiny-eventsource/compare/1.2.1...2.0.0)

> 4 October 2022

- ES module syntax [`#6`](https://github.com/avoidwork/tiny-eventsource/pull/6)
- Bump acorn from 7.1.0 to 7.1.1 [`#3`](https://github.com/avoidwork/tiny-eventsource/pull/3)
- Bump mixin-deep from 1.3.1 to 1.3.2 [`#2`](https://github.com/avoidwork/tiny-eventsource/pull/2)
- Bump js-yaml from 3.5.5 to 3.13.1 [`#1`](https://github.com/avoidwork/tiny-eventsource/pull/1)
- Initial commit of refactoring to ES module syntax [`10b72a5`](https://github.com/avoidwork/tiny-eventsource/commit/10b72a59ae8619a66f529ebdd001f0a9046fc880)
- Building `./dist` & `./types` files [`40f5c50`](https://github.com/avoidwork/tiny-eventsource/commit/40f5c50acbb6683965330ae2e8753854e6245a38)
- Updating tests to run in `mocha` with `assert` [`5384331`](https://github.com/avoidwork/tiny-eventsource/commit/5384331c9c356804f8c8bdd1dbdd39e44f6b3f86)

#### [1.2.1](https://github.com/avoidwork/tiny-eventsource/compare/1.2.0...1.2.1)

> 28 November 2019

- Fixing `cache-control` header such that it's not cachable [`c8e04ed`](https://github.com/avoidwork/tiny-eventsource/commit/c8e04ed36239427746ef48fa2b2ae285afd0dcb2)

#### [1.2.0](https://github.com/avoidwork/tiny-eventsource/compare/1.1.0...1.2.0)

> 18 December 2018

- Fixing a customization gap for heart beats [`cc98b32`](https://github.com/avoidwork/tiny-eventsource/commit/cc98b32a423cc44be6e2c95dcef20b1ca23a2c74)

#### [1.1.0](https://github.com/avoidwork/tiny-eventsource/compare/1.0.3...1.1.0)

> 16 December 2018

- Adding test [`6121958`](https://github.com/avoidwork/tiny-eventsource/commit/61219585d146839ad0475263e6b56eb1050ed92f)
- Adding `this.heartbeat: {ms: 0, msg: "ping"}` attribute which is utilized in `init()` to create a heart beat while there's listeners [`184da9f`](https://github.com/avoidwork/tiny-eventsource/commit/184da9f8846be0d90ab9effe0700c10f4fae3a70)
- Adding test for heart beat [`5b61032`](https://github.com/avoidwork/tiny-eventsource/commit/5b61032a1593da0cd54ece798517189e560566eb)

#### [1.0.3](https://github.com/avoidwork/tiny-eventsource/compare/1.0.2...1.0.3)

> 15 December 2018

- Setting `MaxListeners` to 0 (Infinity) [`260a6a2`](https://github.com/avoidwork/tiny-eventsource/commit/260a6a2e8de4db693dceba0898eecdb03a028077)

#### [1.0.2](https://github.com/avoidwork/tiny-eventsource/compare/1.0.1...1.0.2)

> 28 November 2018

- Updating README [`1a82722`](https://github.com/avoidwork/tiny-eventsource/commit/1a82722bba19a2ea99aea336e5ea59fd9791a869)
- Auto serializing `objects` to JSON [`0d5b2c5`](https://github.com/avoidwork/tiny-eventsource/commit/0d5b2c5c45c83b85dc54c1b4519c5897943ee082)

#### [1.0.1](https://github.com/avoidwork/tiny-eventsource/compare/1.0.0...1.0.1)

> 28 November 2018

- Fixing `send()` by removing `JSON.stringify()` of `data` [`c028ba8`](https://github.com/avoidwork/tiny-eventsource/commit/c028ba82e827f906239df8476cb3878118e0b438)

#### 1.0.0

> 19 November 2018

- Initial commit of code [`35661e4`](https://github.com/avoidwork/tiny-eventsource/commit/35661e41d5436b6f227978ae68b644ee17730f96)
- Initial commit [`0437b6f`](https://github.com/avoidwork/tiny-eventsource/commit/0437b6f61ed58182fb864a52ed203e9ff74c43a3)
- Updating README [`2ec16de`](https://github.com/avoidwork/tiny-eventsource/commit/2ec16de78c95549852d821f71fb7e0ae1600da0e)