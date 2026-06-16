# ext-coming-soon — agent notes

Code-level rules and quirks for working on this extension. The *conceptual*
overview (what it does, where it fits, the portal-coexistence pattern) lives
in the cross-repo knowledge base (`domains/engage-reference-extensions.md`);
this file holds the things that change with the code.

**What it is:** frontend-only Engage / PWA 7.x extension. For a product whose
top-level `firstAvailableDate` (delivered by the core catalog `getProduct` —
no backend step) is in the future, it hides add-to-cart and shows a greyed
"available on &lt;date&gt;" bar (phone bottom bar + tablet right-column
button) and an availability notice on the favourites list.

## Local dev

- CLI: `@shopgate/platform-sdk` (`sgconnect`). The **frontend build needs
  node 20 + `NODE_OPTIONS=--openssl-legacy-provider`**.
  `sgconnect frontend start --theme theme-ios11 --host 127.0.0.1 --port 8080`
  (webpack-dev-server on :8080); `sgconnect backend start` (pipeline proxy
  on :8090).
- **Stop the dev servers with SIGINT (Ctrl+C), never a hard kill / SIGKILL.**
  On SIGINT the SDK runs a shutdown routine — detach extensions, reset hooks,
  deactivate the local pipelines on the remote shop, close the tunnel. A hard
  kill aborts that and can leave hooks/pipelines still active on the remote.

## ESLint — use the current org toolchain

Lint with **`eslint@^8.57` + `@shopgate/eslint-config@^7.29`** (matches the
theme and newer extensions like `ext-tracking-matomo`). The old
`@shopgate/eslint-config@^6` (peer `eslint ~5.12`) applies *different* rules
and will pass locally while reviewers on the modern stack see errors.

Run: `npx eslint frontend --ext .js,.jsx` (the `frontend/.eslintrc.js`
extends `@shopgate/eslint-config`).

Rules that differ under config 7 (so they bit us):

- **No named imports from JSON** — import the generated config as a
  **default import + property access**: `import config from '../../config.json';`
  then `config.<key>` (named imports are flagged `no-restricted-syntax`).
- **Keep the `.json` extension** on that import (config 7 requires it; config
  6 forbade it — exact opposite).
- Prefer `<>` over `<Fragment>` (`react/jsx-fragments`).
- Add `propTypes` for every destructured prop (`react/prop-types`).

## `extension-config.json`

- **Reading own admin config in the frontend:** values declared under
  `configuration` with `destination: frontend` are written by the SDK into the
  generated `frontend/config.json`. Import that file and fall back in code —
  an `admin` value only lands there once set in the Developer Center
  (the declared `default` is just the admin-UI default).
- **`configuration.<key>.params.default` must be a STRING**, even for
  `type: number`. A number is rejected by the SDK schema:
  `Could not generate Extension-Config: Field …params.default: Expected type
  string but found type number`. (The top-level `default` may be a number.)

## Repo hygiene

- **Never commit the SDK-generated `config.json`** (`frontend/config.json`) —
  it's generated per environment from the Developer Center. Gitignore
  `**/config.json` (+ `**/package-lock.json`). The committed manifest is
  `extension-config.json` — a different file, keep it.

## Publishing to the Developer Center

- The extension must be **created in the Developer Center first**; the very
  first `sgconnect extension upload` only pushes a version of an already
  registered extension.
- Flow: upload a pre-release (`1.0.0-alpha.N`), install on a real shop to
  verify against real catalog data, iterate, then upload the immutable
  `1.0.0`.
- **`extension upload` ends with `ERROR: Unexpected status: RELEASED` even on
  success** — the DC auto-releases and the CLI (SDK 2.0.0) doesn't recognise
  that terminal status. The version *does* land; confirm in the DC admin. Use
  `--preprocess-timeout 1200000` for the longer waits.

## Portal coexistence (don't regress)

`ext-tablet-adjustments` also targets `product.add-to-cart-bar`; two
extensions *replacing* the same portal means only the last-registered wins.
This extension therefore renders in the additive
`product.add-to-cart-bar.before` slot and hides the real bar with a
conditionally-mounted scoped `<style>`. **Do not switch to a direct override
of `product.add-to-cart-bar`** — it would reintroduce the install-order
conflict.
