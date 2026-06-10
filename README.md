# @shopgate-project/ext-coming-soon

Replaces the **add-to-cart** action with an **"Available on &lt;date&gt;"** bar
for products that are not yet purchasable (their first-availability date lies in
the future), and shows a short availability notice on the favourites list.
Works on **phone and tablet**. Over-the-air deploy, no native change.

> **Type: Custom** — a project/merchant-specific extension (`@shopgate-project/…`
> scope), **not** a core Shopgate feature.

Built for **Shopgate Engage / PWA 7.x** (`theme-ios11`, and `theme-ios11-tablet`
via [`ext-tablet-adjustments`](https://github.com/shopgate-professional-services/ext-tablet-adjustments)).

## Screenshots

| Phone — PDP | Phone — favourites | Tablet — PDP |
|---|---|---|
| ![PDP phone](docs/screenshots/pdp-phone.svg) | ![Favourites](docs/screenshots/favorites-phone.svg) | ![PDP tablet](docs/screenshots/pdp-tablet.svg) |

> The images are illustrations that reflect the live-verified rendering (real
> theme colours + locale text). Replace with real PNG screenshots under
> `docs/screenshots/` when convenient.

## What it does

For a product whose `firstAvailableDate` is in the future ("coming soon"):

- **PDP (phone):** the bottom add-to-cart bar is replaced by a greyed
  "available on &lt;date&gt;" bar.
- **PDP (tablet):** the right-column add-to-cart button is replaced by the same
  greyed bar (tablet places add-to-cart in the right column, not the bottom).
- **PDP inline CTA & favourites add-to-cart:** hidden.
- **Favourites list:** an availability notice is appended after the product name.

For all other products nothing changes — the original add-to-cart renders
untouched.

## How it works

### Frontend (portals)

Each portal component is registered via `components` in
[`extension-config.json`](extension-config.json). An override component
(registered at a portal name) receives the theme's default `children` and
returns them unchanged for non-coming-soon products. The phone bottom bar uses
the additive `.before` slot instead (see Coexistence below).

| Portal | Surface | Coming-soon | Otherwise |
|---|---|---|---|
| `product.ctas.add-to-cart` | PDP inline CTA | hide | children |
| `product.add-to-cart-bar.before` | PDP bottom bar (phone) | availability bar + hide real bar | nothing |
| `product.tablet.right-column.add-to-cart` | PDP right column (tablet) | availability bar | children |
| `favorites.add-to-cart` | favourites list | hide | children |
| `favorites.product-name.after` | favourites list | availability notice | nothing |

The shared connector ([`frontend/connector.js`](frontend/connector.js)) injects
`product` (via `getProduct`, variant-aware) and `isTablet` (via
`getDeviceInformation`).

### Tablet support

On tablet the add-to-cart lives in the product **right column**
(`product.tablet.right-column.add-to-cart`, provided by the tablet layout /
`ext-tablet-adjustments`, which also passes `productId`/`variantId` into the
portal) and the bottom `product.add-to-cart-bar` is nullified. This extension
therefore:

- registers an availability bar at `product.tablet.right-column.add-to-cart`
  ([`ComingSoonBarTablet`](frontend/components/ComingSoonBarTablet/index.jsx),
  styled like the tablet add-to-cart button), and
- renders nothing in the phone bottom-bar slot on tablet, so there is never a
  duplicate or misplaced bar.

### Coexistence with other extensions

`ext-tablet-adjustments` also targets `product.add-to-cart-bar` (to nullify it
on tablet). When two extensions register an **override** at the same portal,
only the last one wins (by registration order, which a single extension can't
control). To stay robust regardless of order, this extension does **not**
override `product.add-to-cart-bar`; instead it renders the phone bar in the
additive `product.add-to-cart-bar.before` slot and hides the real bar
(`.theme__product__add-to-cart-bar`) via a scoped style only while a coming-soon
product is shown. Verified working with `ext-tablet-adjustments` installed.

### Styling

The bars mirror the corresponding theme add-to-cart button 1:1 — colours,
font, radius, padding (and on phone the full bar container, shadow and
safe-area) — all read from `themeConfig`, so they automatically follow the
merchant's theme colours. The only visual difference is a configurable
`opacity` that greys the bar out to read as "not purchasable".

### Data source

The extension reads the product's top-level `firstAvailableDate`, which is
already delivered by the core catalog (`shopgate.catalog.getProduct.v1`). No
backend step is required — this is a frontend-only extension.

### Configuration

| Key | Type | Default | Description |
|---|---|---|---|
| `comingSoonBarOpacity` | admin / number | `0.6` | Greyness of the availability bar (0–1). Set in the Developer Center; delivered to `frontend/config.json`; the component falls back to `0.6` when unset. |

## Structure

```
frontend/
├── connector.js                       # shared connect: product (variant-aware) + isTablet
├── helpers/
│   ├── isComingSoon.js                # isComingSoon() + formatAvailableDate()
│   └── barOpacity.js                  # resolves the configurable opacity
├── components/
│   ├── ComingSoonGuard/               # render coming-soon output vs. original children
│   ├── ComingSoonBar/                 # phone PDP bottom bar (theme add-to-cart bar)
│   ├── ComingSoonBarTablet/           # tablet right-column bar (theme add-to-cart button)
│   └── FavoritesNotice/               # favourites availability notice
├── portals/
│   ├── HideAddToCart/                 # product.ctas.add-to-cart + favorites.add-to-cart
│   ├── AvailabilityBar/               # product.add-to-cart-bar (phone; null on tablet)
│   ├── AvailabilityBarTablet/         # product.tablet.right-column.add-to-cart
│   └── FavoritesNotice/               # favorites.product-name.after
└── locale/{en-US,de-DE}.json          # "Available on {date}" / "Verfügbar ab {date}"
```

## Run / test locally

```bash
sgconnect backend start    # proxies pipelines (catalog data incl. firstAvailableDate)
sgconnect frontend start   # webpack dev server (PWA)
```

Unit specs (`*.spec.js[x]`) follow the standard Shopgate jest/enzyme setup
(`npm test` in `frontend/`).

## Open items before production

1. **Variant-level vs product-level availability** — clarify whether the date
   differs per variant.
2. **Timezone:** the future-check uses device-local time; confirm that matches
   the merchant's intent.
3. **Scope:** PDP + favourites only. PLP add-to-cart, product sliders and cart
   are out of scope — confirm.
