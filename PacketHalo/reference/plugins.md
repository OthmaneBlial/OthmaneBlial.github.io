# Plugin system

The provider registry lives in `apps/server/src/providers.ts`. A capture provider declares an ID, human name, privacy description and asynchronous start/stop lifecycle. It emits complete `FlowEvent` values to a caller-supplied function.

Start from [`examples/provider-template`](../examples/provider-template/README.md).

## Provider review checklist

1. Document exactly which operating-system API or local file is read.
2. Prove that payload and application content cannot be emitted.
3. Leave unavailable metadata unknown or zero.
4. Attach confidence to every classification.
5. Stop promptly and release resources.
6. Add fixtures for malformed and adversarial inputs.
7. Run `pnpm verify:privacy` and protocol tests.

The future plugin marketplace is local-only: it will discover packages installed by the user and will never download or execute remote code automatically.
