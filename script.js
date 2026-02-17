(async function boot() {
  const tokens = await fetch("./tokens.json").then((r) => r.json());

  applyTokens(tokens);

  injectTypographyUtilities();
  injectShadowUtilities();
  injectRadiusUtilities();

  wireTabs();

  fetchLastUpdated();
  renderColorSwatches();
  renderSpacing();
  renderRadius(tokens);
  renderShadows(tokens);
  renderTypography();
})();

function wireTabs() {
  const buttons = document.querySelectorAll("[data-tab]");
  const sections = document.querySelectorAll("section");

  function showTab(id) {
    sections.forEach((s) => s.classList.toggle("active", s.id === id));
    buttons.forEach((b) => b.classList.toggle("active", b.dataset.tab === id));
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });
}

function applyTokens(tokens) {
  const root = document.documentElement;

  const pairs = [];
  (function walk(node) {
    if (!node || typeof node !== "object") return;

    if ("cssVar" in node && "value" in node) {
      const { cssVar, value } = node;
      if (value == null || value === "") return;
      pairs.push([cssVar, String(value)]);
      return;
    }

    for (const k of Object.keys(node)) walk(node[k]);
  })(tokens);

  for (const [cssVar, value] of pairs) {
    root.style.setProperty(cssVar, value);
  }

  // backfills to prevent breakage
  if (!root.style.getPropertyValue("--Line-Height-label-md").trim()) {
    root.style.setProperty("--Line-Height-label-md", "16px");
  }
  if (!root.style.getPropertyValue("--Letter-Spacing-label-md").trim()) {
    root.style.setProperty("--Letter-Spacing-label-md", "0.4px");
  }

  if (root.style.getPropertyValue("--radius-full").trim() === "100%") {
    root.style.setProperty("--radius-full", "9999px");
  }

  const ensure = (name, val) => {
    if (!getComputedStyle(root).getPropertyValue(name).trim()) {
      root.style.setProperty(name, val);
    }
  };

  ensure("--color-bg", "var(--neutral-white, #ffffff)");
  ensure("--color-text", "var(--neutral-black)");
  ensure("--color-border", "var(--neutral-light)");
}

// ---------- Token data (single source of truth) ----------
const SPACING = [
  { key: "0", var: "--space-0", px: "0" },
  { key: "0.5", var: "--space-0_5", px: "2px" },
  { key: "1", var: "--space-1", px: "4px" },
  { key: "1.5", var: "--space-1_5", px: "6px" },
  { key: "2", var: "--space-2", px: "8px" },
  { key: "2.5", var: "--space-2_5", px: "10px" },
  { key: "3", var: "--space-3", px: "12px" },
  { key: "3.5", var: "--space-3_5", px: "14px" },
  { key: "4", var: "--space-4", px: "16px" },
  { key: "5", var: "--space-5", px: "20px" },
  { key: "6", var: "--space-6", px: "24px" },
  { key: "7", var: "--space-7", px: "28px" },
  { key: "8", var: "--space-8", px: "32px" },
  { key: "9", var: "--space-9", px: "36px" },
  { key: "10", var: "--space-10", px: "40px" },
  { key: "11", var: "--space-11", px: "44px" },
  { key: "12", var: "--space-12", px: "48px" },
  { key: "14", var: "--space-14", px: "56px" },
  { key: "16", var: "--space-16", px: "64px" },
  { key: "20", var: "--space-20", px: "80px" },
  { key: "24", var: "--space-24", px: "96px" },
  { key: "28", var: "--space-28", px: "112px" },
  { key: "32", var: "--space-32", px: "128px" },
  { key: "36", var: "--space-36", px: "144px" },
  { key: "40", var: "--space-40", px: "160px" },
  { key: "44", var: "--space-44", px: "176px" },
  { key: "48", var: "--space-48", px: "192px" },
  { key: "52", var: "--space-52", px: "208px" },
  { key: "56", var: "--space-56", px: "224px" },
  { key: "60", var: "--space-60", px: "240px" },
  { key: "64", var: "--space-64", px: "256px" },
  { key: "72", var: "--space-72", px: "288px" },
  { key: "80", var: "--space-80", px: "320px" },
  { key: "96", var: "--space-96", px: "384px" },
];

function buildRadiusFromTokens(tokens) {
  const radius = tokens.radius || {};

  return Object.entries(radius).map(([key, obj]) => {
    const cls = key === "default" ? "rounded" : `rounded-${key}`;

    return {
      cls,
      px: obj.value,
      cssVar: obj.cssVar,
    };
  });
}

const SHADOWS = [
  { cls: "shadow-sm", label: "subtle" },
  { cls: "shadow", label: "default" },
  { cls: "shadow-md", label: "medium" },
  { cls: "shadow-lg", label: "large" },
  { cls: "shadow-xl", label: "xl" },
  { cls: "shadow-2xl", label: "2xl" },
];

// ---------- Render helpers ----------
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "style") node.setAttribute("style", v);
    else node.setAttribute(k, v);
  }
  for (const child of children) {
    if (typeof child === "string")
      node.appendChild(document.createTextNode(child));
    else node.appendChild(child);
  }
  return node;
}

// ---------- Render spacing ----------
function renderSpacing() {
  const host = document.getElementById("spacingList");
  if (!host) return;

  host.innerHTML = "";
  SPACING.forEach((s) => {
    const row = el("div", { class: "space-row" }, [
      el("div", { class: "space-label" }, [
        el("div", { class: "mono space-key" }, [s.key]),
        el("div", { class: "mono space-px" }, [s.px]),
      ]),
      el("div", { class: "space-track" }, [
        el("div", { class: "space-bar", style: `width: var(${s.var});` }),
      ]),
      el("div", { class: "mono space-meta" }),
    ]);

    host.appendChild(row);
  });
}

// ---------- Render radius ----------
// helper: read computed CSS var value
function injectRadiusUtilities() {
  const id = "radius-utilities";
  let styleEl = document.getElementById(id);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = id;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    .rounded-none { border-radius: var(--radius-none, 0px); }
    .rounded-sm   { border-radius: var(--radius-sm, 2px); }
    .rounded      { border-radius: var(--radius, 4px); }
    .rounded-md   { border-radius: var(--radius-md, 6px); }
    .rounded-lg   { border-radius: var(--radius-lg, 8px); }
    .rounded-xl   { border-radius: var(--radius-xl, 12px); }
    .rounded-2xl  { border-radius: var(--radius-2xl, 16px); }
    .rounded-full { border-radius: var(--radius-full, 9999px); }
  `;
}

function cssVarValue(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function normalizeRadiusFull() {
  const root = document.documentElement;
  const v = cssVarValue("--radius-full");
  if (v === "100%") root.style.setProperty("--radius-full", "9999px");
}

function renderRadius(tokens) {
  const host = document.getElementById("radiusGrid");
  if (!host) return;

  host.innerHTML = "";

  const RADIUS = buildRadiusFromTokens(tokens);

  const FUN_COLORS = [
    "--primary-medium",
    "--green-medium",
    "--yellow-medium",
    "--red-medium",
    "--primary-dark",
    "--green-dark",
  ];

  RADIUS.forEach((r, i) => {
    const colorVar = FUN_COLORS[i % FUN_COLORS.length];

    host.appendChild(
      el("div", {}, [
        el("div", {
          class: r.cls,
          style: `
            width: 200px;
            height: 200px;
            background: var(${colorVar});
          `,
        }),
        el("div", { class: "mono", style: "margin-top:10px" }, [`.${r.cls}`]),
        el("div", { class: "label mono" }, [`${r.cssVar} → ${r.px}`]),
      ]),
    );
  });
}

// ---------- Render shadows ----------
function injectShadowUtilities() {
  const id = "shadow-utilities";
  let styleEl = document.getElementById(id);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = id;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    .shadow-sm { box-shadow: var(--shadow-sm); }
    .shadow    { box-shadow: var(--shadow); }
    .shadow-md { box-shadow: var(--shadow-md); }
    .shadow-lg { box-shadow: var(--shadow-lg); }
    .shadow-xl { box-shadow: var(--shadow-xl); }
    .shadow-2xl{ box-shadow: var(--shadow-2xl); }
  `;
}

function renderShadows() {
  const host = document.getElementById("shadowGrid");
  if (!host) return;

  host.innerHTML = "";
  SHADOWS.forEach((s) => {
    host.appendChild(
      el("div", { class: `shadow-swatch ${s.cls}` }, [
        el("div", { class: "mono" }, [s.cls]),
        el("div", { class: "label" }, [s.label]),
      ]),
    );
  });
}

// ----- TYPOGRAPHY DATA -----
const TYPOGRAPHY = [
  { cls: "text-display-lg", label: "Display LG" },
  { cls: "text-display-md", label: "Display MD" },
  { cls: "text-display-sm", label: "Display SM" },

  { cls: "text-headline-lg", label: "Headline LG" },
  { cls: "text-headline-md", label: "Headline MD" },
  { cls: "text-headline-sm", label: "Headline SM" },

  { cls: "text-title-lg", label: "Title LG" },
  { cls: "text-title-md", label: "Title MD" },
  { cls: "text-title-sm", label: "Title SM" },

  { cls: "text-body-lg", label: "Body LG" },
  { cls: "text-body-md", label: "Body MD" },
  { cls: "text-body-sm", label: "Body SM" },

  { cls: "text-label-lg", label: "Label LG" },
  { cls: "text-label-md", label: "Label MD" },
  { cls: "text-label-sm", label: "Label SM" },

  { cls: "text-display-md-accent", label: "Accent Display MD" },
];

const TYPO_SCALE = ["lg", "md", "sm"];

const TYPO_TYPES = {
  display: {
    title: "Display",
    open: true,
    blurb: {
      lg: "Hero headlines, landing page top sections, big moments.",
      md: "Section headers for major pages, feature callouts.",
      sm: "Compact hero headers, cards with strong emphasis.",
    },
  },

  headline: {
    title: "Headline",
    open: false,
    blurb: {
      lg: "Primary page headings and high-level content sections.",
      md: "Secondary headers in pages, panels, and modals.",
      sm: "Card titles, list section headers, dense UIs.",
    },
  },

  title: {
    title: "Title",
    open: false,
    blurb: {
      lg: "Component titles, modal titles, content grouping.",
      md: "Default component title for most surfaces.",
      sm: "Compact titles for tight layouts and small cards.",
    },
  },

  body: {
    title: "Body",
    open: false,
    blurb: {
      lg: "Long-form reading, marketing body copy.",
      md: "Default body text for product UI.",
      sm: "Dense UI, helper text, secondary content.",
    },
  },

  label: {
    title: "Label",
    open: false,
    blurb: {
      lg: "Form labels, table headers, emphasized microcopy.",
      md: "Default label size for controls and metadata.",
      sm: "Tags, badges, captions, tiny metadata.",
    },
  },
};

// ---------- Render typography ----------
function injectTypographyUtilities() {
  const id = "typo-utilities";
  let styleEl = document.getElementById(id);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = id;
    document.head.appendChild(styleEl);
  }

  const types = ["display", "headline", "title", "body", "label"];
  const sizes = ["lg", "md", "sm"];

  const allPrimary = types
    .flatMap((t) => sizes.map((s) => `.text-${t}-${s}`))
    .join(",");

  const lines = [];

  // default family for the main set
  lines.push(`${allPrimary}{font-family:var(--Font-Family-Primary);}`);

  for (const t of types) {
    for (const s of sizes) {
      const key = `${t}-${s}`;
      lines.push(
        `.text-${key}{` +
          `font-size:var(--Font-Size-${key});` +
          `line-height:var(--Line-Height-${key});` +
          `letter-spacing:var(--Letter-Spacing-${key});` +
          `font-weight:var(--Font-Weight-${key}, 400);` +
          `font-style:var(--Font-Style-${key}, normal);` +
          `}`,
      );
    }
  }

  // Accent sample (optional: give it its own weight var too)
  lines.push(
    `.text-display-md-accent{` +
      `font-family:var(--Font-Family-Accent);` +
      `font-size:var(--Font-Size-display-md);` +
      `line-height:var(--Line-Height-display-md);` +
      `letter-spacing:var(--Letter-Spacing-display-md);` +
      `font-weight:var(--Font-Weight-display-md, 400);` +
      `font-style:var(--Font-Style-display-md, normal);` +
      `}`,
  );

  styleEl.textContent = lines.join("\n");
}

injectTypographyUtilities();

function renderTypography() {
  const host = document.getElementById("typographyMount");
  if (!host) return;

  host.innerHTML = "";

  const SAMPLE = "The quick brown fox jumps over the lazy dog — 1234567890";

  const cssVar = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    "(missing)";

  const nice = (v) => (v && v.trim().length ? v.trim() : "(missing)");

  function tokenNamesForClass(cls) {
    const key = cls.replace(/^text-/, "");

    const family =
      cls === "text-display-md-accent" ?
        "--Font-Family-Accent"
      : "--Font-Family-Primary";

    return {
      family,
      size: `--Font-Size-${key}`,
      lineHeight: `--Line-Height-${key}`,
      letterSpacing: `--Letter-Spacing-${key}`,
    };
  }

  function metaRow(k, v) {
    return [
      el("div", { class: "mono typo-k" }, [k]),
      el("div", { class: "mono" }, [v]),
    ];
  }

  const container = el("div", { class: "typo-sections" }, []);
  host.appendChild(container);

  Object.entries(TYPO_TYPES).forEach(([typeKey, typeConfig]) => {
    const details = el(
      "details",
      {
        class: "typo-details",
        ...(typeConfig.open ? { open: "" } : {}),
      },
      [],
    );

    const summary = el("summary", { class: "typo-summary" }, [
      el("div", { class: "typo-summary-left" }, [
        el("div", { class: "typo-title" }, [typeConfig.title]),
        el("div", { class: "label mono typo-count" }, [
          `${TYPO_SCALE.length} styles`,
        ]),
      ]),
      el("div", { class: "label mono", style: "color: var(--color-muted);" }, [
        "Click to expand",
      ]),
    ]);

    const body = el("div", { class: "typo-body" }, []);

    TYPO_SCALE.forEach((size) => {
      const cls = `text-${typeKey}-${size}`;

      const left = el("div", { class: "typo-left" }, [
        el("h4", {}, [size.toUpperCase()]),
        el("div", { class: "typo-blurb" }, [typeConfig.blurb[size] || ""]),
      ]);

      const sample = el("div", { class: `${cls} typo-sample` }, [SAMPLE]);

      const meta = el("div", { class: "typo-meta" }, []);

      const right = el("div", { class: "typo-right" }, [
        el(
          "div",
          {
            class: "mono",
            style: "display:flex; justify-content:space-between; gap:12px;",
          },
          [
            el("div", {}, [`.${cls}`]),
            el("div", { style: "color: var(--color-muted);" }, ["Tokens"]),
          ],
        ),
        sample,
        meta,
      ]);

      const row = el("div", { class: "typo-row" }, [left, right]);
      body.appendChild(row);

      // Compute styles
      const c = getComputedStyle(sample);
      const tnames = tokenNamesForClass(cls);

      const rows = [
        ...metaRow("font-family", nice(c.fontFamily)),
        ...metaRow("font-size", nice(c.fontSize)),
        ...metaRow("line-height", nice(c.lineHeight)),
        ...metaRow("letter-spacing", nice(c.letterSpacing)),
        ...metaRow("font-weight", nice(c.fontWeight)),
        ...metaRow("—", "—"),
        ...metaRow(
          "token family",
          `${tnames.family} → ${cssVar(tnames.family)}`,
        ),
        ...metaRow("token size", `${tnames.size} → ${cssVar(tnames.size)}`),
        ...metaRow(
          "token line-height",
          `${tnames.lineHeight} → ${cssVar(tnames.lineHeight)}`,
        ),
        ...metaRow(
          "token letter-spacing",
          `${tnames.letterSpacing} → ${cssVar(tnames.letterSpacing)}`,
        ),
      ];

      rows.forEach((node) => meta.appendChild(node));
    });

    details.appendChild(summary);
    details.appendChild(body);
    container.appendChild(details);
  });
}

// ---------- Render colors ----------
const RAMP_8 = [
  "lightest",
  "extra-light",
  "very-light",
  "light",
  "medium",
  "dark",
  "very-dark",
  "darkest",
];

const rampVars = (prefix, steps = RAMP_8) =>
  steps.map((s) => `--${prefix}-${s}`);

// Neutrals don't use lightest/darkest naming; they use white/black.
// This returns the “correct ramp order” for display.
const neutralVars = () => [
  "--neutral-white", // display as lightest
  "--neutral-extra-light",
  "--neutral-very-light",
  "--neutral-light",
  "--neutral-medium",
  "--neutral-dark",
  "--neutral-very-dark",
  "--neutral-black", // display as darkest
];

const COLOR_GROUPS = [
  { title: "Neutrals", vars: neutralVars() },
  { title: "Primary", vars: rampVars("primary") },
  { title: "Green", vars: rampVars("green") },
  { title: "Yellow", vars: rampVars("yellow") },
  { title: "Red", vars: rampVars("red") },
  {
    title: "Assorted",
    vars: [
      "--dark-blue",
      "--off-white",
      "--disabled-field",
      "--light-gray",
      "--gray-tag",
    ],
  },
];

// Cache computed style once per render
function getCssVar(style, varName) {
  return style.getPropertyValue(varName).trim();
}

// Optional: catches invalid values like "(missing)" or bad tokens
function isColor(val) {
  const s = new Option().style;
  s.color = val;
  return s.color !== "";
}

function swatchCard(varName, value) {
  const ok = value && isColor(value);
  const shown =
    ok ? value
    : value ? "(invalid)"
    : "(missing)";

  return `
    <div>
      <div style="
        height: 180px;
        border-radius: 10px 10px 0 0;
        background: ${ok ? `var(${varName})` : "transparent"};
        border: 1px solid var(--color-border);
        border-bottom: none;
      "></div>
      <div style="border: 1px solid var(--color-border); padding: 12px 8px; border-radius: 0 0 10px 10px;">
        <div class="mono">${varName}</div>
        <div class="label mono">${shown}</div>
      </div>
    </div>
  `;
}

function renderColorSwatches() {
  const mount = document.getElementById("colorSwatchMount");
  if (!mount) return;

  const style = getComputedStyle(document.documentElement);

  mount.innerHTML = COLOR_GROUPS.map((group) => {
    const cards = group.vars
      .map((v) => swatchCard(v, getCssVar(style, v)))
      .join("");

    return `
      <div class="mono" style="font-weight: 700; margin-top: var(--space-5); margin-bottom: var(--space-5)">
        ${group.title}
      </div>
      <div class="grid-demo">${cards}</div>
    `;
  }).join("");
}

async function fetchLastUpdated() {
  const owner = "anokhee";
  const repo = "design_system";
  const branch = "main";

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`,
    );
    const data = await res.json();

    const commitDate = new Date(data.commit.committer.date);
    const author = data.commit.author.name;
    const commitUrl = data.html_url;

    const rawMessage = data.commit.message.split("\n")[0];

    const truncated =
      rawMessage.length > 80 ? rawMessage.slice(0, 80) + "…" : rawMessage;

    const formattedDate = commitDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const formattedTime = commitDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const el = document.getElementById("lastUpdated");

    el.innerHTML = `
      <div style="font-weight: 600;">
        Last Updated ${formattedDate} at ${formattedTime}
      </div>
      <div style="margin-top:4px;">
        <a href="${commitUrl}" target="_blank" style="text-decoration-color: var(--neutral-medium); text-decoration-style:dotted; color:var(--neutral-dark);">
          ${truncated}
        </a>
      </div>
      <div class="label" style="margin-top:4px;">
        -- ${author}
      </div>
    `;
  } catch (err) {
    document.getElementById("lastUpdated").textContent = "Unavailable";
  }
}
