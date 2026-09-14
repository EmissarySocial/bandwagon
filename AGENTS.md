# Bandwagon — Notes for AI Agents

Bandwagon is an Emissary template package for musicians, installed onto a running Emissary server through a Git package adapter rather than compiled or deployed on its own. See [README.md](README.md) for the product description and install steps. Every top-level folder is one template whose folder name must equal the `templateId` inside its `template.hjson`, and the `.html` files beside it are the views its actions render.

This file lives at the repo root and is the only place to add notes. Do not create files inside a template folder.

## A bundle folder holds only source — every file in it is concatenated

`bundles:` in a `template.hjson` or `theme.hjson` declares a folder by name and a content type. Emissary's `populateBundle` then reads **every** file in that folder, skipping only subdirectories — there is no extension filter — concatenates them all, and runs the result through a minifier for that content type. A stray `AGENTS.md`, `README.md`, or editor backup is therefore fed to the CSS or JS minifier as if it were code, corrupting the served bundle. Here that means [bandwagon-search/javascript](bandwagon-search/javascript/) and [bandwagon-search/hyperscript](bandwagon-search/hyperscript/), declared in [bandwagon-search/template.hjson](bandwagon-search/template.hjson).

A theme's `resources/` folder is different — it is served as plain static files, one URL per file, not concatenated. Nothing there corrupts a bundle, but anything you drop in becomes publicly downloadable, so it is still not a place for notes.

## `extends` composes templates, and the base templates live in Emissary

A template inherits actions, states, roles, schema, and datasets from each entry in its `extends` array, and a value defined locally wins over an inherited one. `base-checkout`, `base-intent`, `base-social`, and `user-outbox` are **not in this repo** — they ship inside Emissary's `_embed/templates`, so an unexplained action or role usually comes from there. Within this repo, `bandwagon-search` is the base that `bandwagon-search-albums`, `-events`, `-news`, `-tracks`, and `-users` all extend.

## `bandwagon-common` exists only to carry shared datasets

It is `model: None` with no actions and a single placeholder state; its whole job is to define the `licenses` dataset that album and song templates inherit. Adding shared option lists there is the sanctioned pattern. Note its `templateRole: album` is inert for a `model: None` template — don't imitate it as if it were meaningful.

## Option providers are `{templateId}.{datasetName}` and resolve through inheritance

A form field like `{type:"select", path:"data.license", options:{provider:"bandwagon-album.licenses"}}` is split on the dot: Emissary loads the template named by the first segment and looks up the second in its `Datasets` map. The name must be the template the form belongs to — `bandwagon-album` — even though `licenses` is *defined* in `bandwagon-common`, because datasets are copied down at inheritance time. Providers whose names have no dot (`circles`, `syndication-targets`) are built into the server instead.

**A wrong provider name fails silently in the UI.** The lookup reports the error to the server log and returns an empty group, so the form still renders — as an empty dropdown with no visible complaint. When a select is mysteriously blank, check the provider name before anything else.

## hjson does not reject a malformed key — it silently creates a different one

hjson is deliberately lenient, so a typo in a key name is not a parse error; the field simply arrives under the wrong name and whatever read it gets a zero value. A stray quote such as `{Label":"Light Green", Value:"#aad816"}` parses cleanly into a key literally named `Label"`, leaving that entry with no `Label` at all and a blank row in the picker. Nothing warns you. After editing a `template.hjson`, confirm the change actually took effect in the rendered page rather than trusting that it parsed.

## The server caches template folders — restart before concluding an edit did nothing

Emissary loads Git and filesystem template packages into memory at startup. An edit to a `template.hjson` or an `.html` view will not appear until the server reloads that package, so a change that seems to have no effect is usually a stale copy rather than a broken template.

## Pin the htmx and hyperscript resource paths

References here resolve to `htmx-1.9.12/htmx.min.js` and `hyperscript-0.9.93/_hyperscript.min.js`. Emissary still ships legacy unversioned `htmx/` and `hyperscript/` folders holding much older engines, and pointing at one of those does not 404 — the old parser simply fails on the shared behaviors bundle and every hyperscript behavior on the page stops installing, silently. On any htmx or hyperscript upgrade, sweep this repo too, not just Emissary's `_embed`.

## An unset hyperscript `:variable` is `undefined`, not `nil`

In hyperscript 0.9.93 the `is nil` / `is not nil` operators compare against `null` only, so on a fresh element `:foo is not nil` is TRUE and an init guard written that way exits immediately and never runs. Use `exists` / `does not exist` for presence checks, or the `no` operator, which covers null, undefined, and empty together.

## `hx-swap="none"` is inherited and silently discards descendants' responses

htmx inherits `hx-swap` down the DOM, so putting `hx-swap="none"` on a container poisons every `hx-boost` or `hx-get` inside it: the request fires, the server answers 200, and htmx throws the response away with no console or server error. When a boosted link "does nothing," check its ancestor chain for an inherited `hx-swap="none"` before suspecting JavaScript. `hx-disinherit="hx-swap hx-push-url"` on the container fixes it while leaving the container's own swap behavior intact.

## `class="turboclick"` on a container is intentional

Emissary's turboclick fires its synthetic click on the element actually pressed, not on the nearest `.turboclick` ancestor, so nested links, buttons, `hx-get`s, and hyperscript `on click` handlers all still fire. Container-level turboclick is correct — don't "fix" it by moving the class onto children. If a click inside a turboclick region does nothing, the cause is almost certainly the `hx-swap` trap above.

## `css` and `cssValue` are two different trust levels — pick deliberately

Both cast a string to trusted CSS, but they earn it differently. `css` is a raw, unvalidated cast, kept for exactly one job: emitting the site owner's own hand-written stylesheet in [bandwagon-outbox/stylesheet.html](bandwagon-outbox/stylesheet.html), where the input is the owner's `data.stylesheet` field. `cssValue` validates a single computed property value against a conservative character allowlist and rejects `expression` and `url` spellings, returning empty rather than emitting anything unsafe. Anything your template *builds* — a concatenated gradient, an interpolated color — goes through `cssValue`, as the two tag views do with `background-image: {{$backgroundImage | cssValue }}`.

## A new funcmap helper couples this repo to a minimum Emissary version

Go's `html/template` resolves function names at **parse** time, so calling a helper that the running server's template funcmap does not define does not degrade that one expression — the entire template fails to parse and the page dies. Helpers like `cssValue` arrive in Emissary through its pinned `benpate/rosetta` dependency, so a template edit that adopts a newly added helper cannot deploy until Emissary itself ships a build carrying it. Check that the helper exists in the target server's build before using it in a template here.
