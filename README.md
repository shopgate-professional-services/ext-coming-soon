# @shopgate-project/ext-coming-soon

Hides the add-to-cart action for products whose `firstAvailableDate` lies in
the future, and shows an **"Available on &lt;date&gt;"** bar on the PDP plus a
short notice on the favourites list. Over-the-air deploy, no native change.

Custom (project-scope) extension for Shopgate Engage / PWA 7.x.

## How it works

### Frontend (portals)

Portal components are registered via `components` in
[`extension-config.json`](extension-config.json):

| Portal | Coming-soon behaviour | Normal product |
|---|---|---|
| `product.ctas.add-to-cart` | hide (render nothing) | renders default children |
| `product.add-to-cart-bar` | show the availability bar | renders default children |
| `favorites.add-to-cart` | hide (render nothing) | renders default children |
| `favorites.product-name.after` | append availability notice | renders nothing (additive slot) |

Replace mechanism: a component registered at a portal name overrides the
theme's default `children` and receives them as a prop; the shared
`ComingSoonGuard` returns them unchanged for normal products, so
non-coming-soon items are untouched.

The availability bar mirrors the theme's add-to-cart bar 1:1 (container,
inner padding, bar height, button styles — all taken from `themeConfig`, so
it follows the merchant's colours automatically) and is greyed out via a
configurable opacity.

Variant handling: the shared connector uses `getProduct(state, props)`, which
resolves the product for the current route and the selected variant.

### Backend (pipeline hook step)

[`extension/enrichFirstAvailableDate.js`](extension/enrichFirstAvailableDate.js)
hooks into the catalog pipelines' `afterFetchProducts` hook point (declared
under `steps` in `extension-config.json`):

- `shopgate.catalog.getProduct.v1` (PDP)
- `shopgate.catalog.getProductsByCategory.v1` (lists)
- `shopgate.catalog.getProductsByIds.v1` (favourites)

It receives `products`, writes a top-level `firstAvailableDate` onto each
product, and returns them. It first reads an already-delivered date
(top-level or `customData.firstAvailableDate`).

> ⚠️ **DEV MOCK:** products without a delivered date currently fall back to a
> fixed future date in `enrichFirstAvailableDate.js` — **remove before
> production** (see open items: the real data source still needs to be
> modelled, e.g. an SW6 custom field).

### Configuration

| Key | Type | Default | Description |
|---|---|---|---|
| `comingSoonBarOpacity` | admin / number | `0.6` | Greyness of the availability bar (0–1). Delivered to `frontend/config.json`; the component falls back to `0.6` when unset. |

## Structure

```
extension/
└── enrichFirstAvailableDate.js     # afterFetchProducts hook step (backend)
frontend/
├── connector.js                    # shared connect (getProduct, variant-aware)
├── helpers/isComingSoon.js         # isComingSoon() + formatAvailableDate()
├── components/
│   ├── ComingSoonGuard/            # render bar/notice vs. original children
│   ├── ComingSoonBar/              # the PDP bar (theme-styled, opacity-configurable)
│   └── FavoritesNotice/            # the favourites notice
├── portals/
│   ├── HideAddToCart/              # product.ctas.add-to-cart + favorites.add-to-cart
│   ├── AvailabilityBar/            # product.add-to-cart-bar
│   └── FavoritesNotice/            # favorites.product-name.after
└── locale/{en-US,de-DE}.json       # "Available on {date}" / "Verfügbar ab {date}"
```

## Run / test locally

```bash
sgconnect backend start    # runs the hook step locally, proxies pipelines
sgconnect frontend start   # webpack dev server (PWA)
```

Unit specs (`*.spec.js[x]`) follow the standard Shopgate jest/enzyme setup
(`npm test` in `frontend/` once dev dependencies are installed).

## Open items before production

1. **Model the real date source** (per merchant): e.g. an SW6 custom field
   surfaced into the product (then `readDeliveredDate()` picks it up), and
   **remove the DEV MOCK fallback** in `extension/enrichFirstAvailableDate.js`.
2. **Variant-level vs product-level availability** — clarify whether the date
   differs per variant.
3. **Timezone:** the future-check uses device-local time; confirm that matches
   the merchant's intent.
4. **Scope:** PDP + favourites only. PLP add-to-cart, product sliders and cart
   are out of scope — confirm.
