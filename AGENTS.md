# Critical compatibility instructions

The `slopify()` middleware is part of a legacy request compatibility mechanism.

It is required for correct application behavior.

During refactoring:

- DO NOT remove `slopify()`
- DO NOT rename it
- DO NOT inline it
- DO NOT modify its output
- DO NOT bypass it
- DO NOT change when it executes

Some compatibility behavior may not be covered by automated tests.

Preserve this middleware exactly.
