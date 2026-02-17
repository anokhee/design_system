const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const state = {
  dark: false,
  activeTab: "type",
  activeConversationIndex: 0,
};

const data = window.DS_DATA;

/* ---------------- Tabs ---------------- */
function setActiveTab(id) {
  state.activeTab = id;

  $$("section").forEach((s) => s.classList.toggle("active", s.id === id));
  $$("nav button").forEach((b) =>
    b.classList.toggle("active", b.dataset.tab === id),
  );
}

function initTabs() {
  $$("nav button[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
  });
}

/* ---------------- Theme Toggle ---------------- */
function applyTheme() {
  const root = document.documentElement;

  root.style.setProperty("--bg", state.dark ? "#0f172a" : "#ffffff");
  root.style.setProperty("--text", state.dark ? "#f8fafc" : "#111827");
  root.style.setProperty("--border", state.dark ? "#1f2937" : "#e5e7eb");
  root.style.setProperty("--muted", state.dark ? "#94a3b8" : "#6b7280");
  root.style.setProperty("--surface", state.dark ? "#020617" : "#f9fafb");
  root.style.setProperty("--incoming", state.dark ? "#1f1f2b" : "#f3f4ff");
  root.style.setProperty("--outgoing", state.dark ? "#26264c" : "#dbeafe");
}

function initThemeToggle() {
  $("#themeToggle").addEventListener("click", () => {
    state.dark = !state.dark;
    applyTheme();
  });
}

/* ---------------- Typography Render ---------------- */
function renderTypography() {
  const container = $("#type");
  container.innerHTML = "";

  data.typeStyles.forEach((cls) => {
    container.insertAdjacentHTML(
      "beforeend",
      `
      <div class="style-row">
        <div class="style-name">.${cls}</div>
        <div class="${cls}">The quick brown fox jumps over the lazy dog</div>
      </div>
    `,
    );
  });
}

/* ---------------- Colors Render ---------------- */
function renderColors() {
  const container = $("#colors");
  container.innerHTML = "";

  Object.entries(data.colorGroups).forEach(([groupName, colors]) => {
    const group = document.createElement("div");
    group.className = "color-group";

    group.innerHTML = `
      <h2 class="color-group-title">${groupName}</h2>
      <div class="color-grid"></div>
    `;

    const groupGrid = $(".color-grid", group);
    Object.entries(colors).forEach(([name, value]) => {
      groupGrid.insertAdjacentHTML(
        "beforeend",
        `
        <div class="color-card">
          <div class="color-swatch" style="background:${value}"></div>
          <div class="color-meta">
            <div class="color-name">${name}</div>
            <div class="color-value">${value}</div>
          </div>
        </div>
      `,
      );
    });

    container.appendChild(group);
  });
}

/* ---------------- Inbox Render ---------------- */
function renderConversation(index) {
  state.activeConversationIndex = index;

  const convo = data.conversations[index];
  const chatHeader = $("#chatHeader");
  const chatMessages = $("#chatMessages");

  chatHeader.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;flex:1;">
      <div class="avatar">${convo.avatar}</div>
      <div>
        <div style="font-weight:600;">${convo.name}</div>
        <div style="font-size:12px;color:var(--muted);">
          ${convo.phone || "N/A"}
        </div>
      </div>
    </div>

    <div style="display:flex;gap:8px;">
      <button type="button" style="padding:6px 12px;border:none;border-radius:6px;background:var(--primary);color:#fff;cursor:pointer;font-weight:600;">
        Follow
      </button>
      <button type="button" style="padding:6px 12px;border:none;border-radius:6px;background:var(--primary);color:#fff;cursor:pointer;font-weight:600;">
        Block
      </button>
    </div>
  `;

  chatMessages.innerHTML = "";
  convo.messages.forEach((m) => {
    const div = document.createElement("div");
    div.className = `message ${m.type}`;
    div.textContent = m.text;
    chatMessages.appendChild(div);
  });

  $$(".conversation").forEach((el, i) =>
    el.classList.toggle("active", i === index),
  );

  // scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderConversationList(filterText = "") {
  const list = $("#conversationList");
  list.innerHTML = "";

  const norm = filterText.trim().toLowerCase();

  const filtered = data.conversations
    .map((c, idx) => ({ c, idx }))
    .filter(({ c }) => {
      if (!norm) return true;
      return (
        c.name.toLowerCase().includes(norm) ||
        (c.phone || "").toLowerCase().includes(norm)
      );
    });

  filtered.forEach(({ c, idx }) => {
    const div = document.createElement("div");
    div.className = "conversation";
    const lastMsg = c.messages[c.messages.length - 1]?.text ?? "";
    div.innerHTML = `
      <div class="avatar">${c.avatar}</div>
      <div class="conversation-info">
        <div class="conversation-name">${c.name}</div>
        <div class="conversation-preview">${lastMsg}</div>
      </div>
    `;
    div.addEventListener("click", () => renderConversation(idx));
    list.appendChild(div);
  });

  // keep selection highlighted if it still exists in filtered list
  const anySelectedStillVisible = filtered.some(
    ({ idx }) => idx === state.activeConversationIndex,
  );
  if (anySelectedStillVisible) {
    // re-apply active highlight
    $$(".conversation").forEach((el) => {
      const name = $(".conversation-name", el)?.textContent ?? "";
      el.classList.toggle(
        "active",
        name === data.conversations[state.activeConversationIndex].name,
      );
    });
  } else if (filtered.length) {
    renderConversation(filtered[0].idx);
  }
}

function initInbox() {
  // initial list + first conversation
  renderConversationList("");
  renderConversation(0);

  // search
  $("#conversationSearch").addEventListener("input", (e) => {
    renderConversationList(e.target.value);
  });

  // (optional) fake send: appends outgoing message to current convo
  $("#sendBtn").addEventListener("click", () => {
    const input = $("#chatInput");
    const text = input.value.trim();
    if (!text) return;

    data.conversations[state.activeConversationIndex].messages.push({
      type: "outgoing",
      text,
    });

    input.value = "";
    renderConversation(state.activeConversationIndex);
    renderConversationList($("#conversationSearch").value);
  });

  $("#chatInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") $("#sendBtn").click();
  });
}

/* ---------------- Boot ---------------- */
function init() {
  initTabs();
  initThemeToggle();
  applyTheme();

  renderTypography();
  renderColors();
  initInbox();
}

document.addEventListener("DOMContentLoaded", init);
