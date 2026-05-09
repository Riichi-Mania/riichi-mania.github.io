/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Haipai Tile Renderer  v1.2
 *  Scans DOM for [notation] blocks and replaces them with CSS tile elements.
 *
 *  NOTATION FORMAT  (standard Tenhou/Mahjong Soul compact form):
 *    Numbers followed by suit letter, all concatenated.
 *    Suits:  m = manzu (characters)
 *            p = pinzu (circles)
 *            s = souzu (bamboo)
 *            z = jihai (honours: 1=East 2=South 3=West 4=North 5=Haku 6=Hatsu 7=Chun)
 *
 *  SPECIAL CODES:
 *    0m / 0p / 0s  = Red five (dora)
 *    Uppercase letter after number = called tile (Chi/Pon/Kan), rendered sideways
 *
 *  GROUPING:
 *    Space between groups = renders a thin gap (meld separator)
 *    | = explicit separator (e.g. before the pair or winning tile)
 *
 *  EXAMPLES:
 *    [123m 456p 789s 11z 2z]         — a full hand
 *    [1112345678999m 1m]             — chiitoitsu style
 *    [406m]                          — red five manzu sequence
 *    [1z2z3z4z 5z6z7z]              — winds + dragons
 *
 *  USAGE IN MARKDOWN:
 *    Write [123m 456p] anywhere in your post — including inline!
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  "use strict";

  // ── Tile Unicode map ─────────────────────────────────────────────────────────
  // Uses the Mahjong tile Unicode block (U+1F000–U+1F02B)
  const UNICODE = {
    m: { 1:"🀇",2:"🀈",3:"🀉",4:"🀊",5:"🀋",6:"🀌",7:"🀍",8:"🀎",9:"🀏" },
    p: { 1:"🀙",2:"🀚",3:"🀛",4:"🀜",5:"🀝",6:"🀞",7:"🀟",8:"🀠",9:"🀡" },
    s: { 1:"🀐",2:"🀑",3:"🀒",4:"🀓",5:"🀔",6:"🀕",7:"🀖",8:"🀗",9:"🀘" },
    z: { 1:"🀀",2:"🀁",3:"🀂",4:"🀃",5:"🀆",6:"🀅",7:"🀄" }, // E S W N Haku Hatsu Chun
  };

  // Suit-specific accent colours for the tile background stripe
  const SUIT_ACCENT = {
    m: "#e11d48",   // Dora Red  — characters
    p: "#38bdf8",   // Sky Blue  — circles
    s: "#4ade80",   // Bamboo Green — bamboo
    z: "#fbbf24",   // Riichi Yellow — honours
  };

  // Names for aria-labels
  const TILE_NAMES = {
    m: ["","Iichan","Ryanman","Sanman","Yonman","Gouman","Rouman","Chiman","Hachiman","Kyuuman"],
    p: ["","Iipii","Ryanpii","Sanpii","Yonpii","Gopii","Ropii","Chipii","Hachipii","Kyuupii"],
    s: ["","Iisou","Ryansou","Sansou","Yonsou","Gosou","Rosou","Chisou","Hachisou","Kyuusou"],
    z: ["","Ton","Nan","Sha","Pei","Haku","Hatsu","Chun"],
  };

  // ── Parser ────────────────────────────────────────────────────────────────────
  /**
   * Parse a notation string into an array of tile objects.
   * Returns: [{ suit, num, red, sideways, separator }]
   */
  function parseNotation(notation) {
    const tiles = [];
    const raw = notation.trim();
    let i = 0;

    while (i < raw.length) {
      const ch = raw[i];

      // Separator (explicit | or space)
      if (ch === "|") {
        tiles.push({ separator: true });
        i++;
        continue;
      }
      if (ch === " ") {
        tiles.push({ separator: true });
        i++;
        // Skip additional spaces
        while (i < raw.length && raw[i] === " ") i++;
        continue;
      }

      // Number(s) followed by suit letter
      const numStart = i;
      while (i < raw.length && (raw[i] >= "0" && raw[i] <= "9")) i++;
      const numStr = raw.slice(numStart, i);

      if (numStr.length === 0 || i >= raw.length) { i++; continue; }

      const suitChar = raw[i].toLowerCase();
      const sideways  = raw[i] !== raw[i].toLowerCase(); // uppercase = called
      i++;

      if (!UNICODE[suitChar]) continue;

      for (const digit of numStr) {
        const num = parseInt(digit, 10);
        const red = (num === 0); // 0 = red five
        const effectiveNum = red ? 5 : num;
        tiles.push({ suit: suitChar, num: effectiveNum, red, sideways });
      }
    }

    return tiles;
  }

  // ── Renderer ──────────────────────────────────────────────────────────────────
  function buildTileElement(tile) {
    if (tile.separator) {
      const sep = document.createElement("span");
      sep.className = "mj-sep";
      sep.setAttribute("aria-hidden", "true");
      return sep;
    }

    const glyph = UNICODE[tile.suit][tile.num] || "?";
    const accent = SUIT_ACCENT[tile.suit];
    const label = `${TILE_NAMES[tile.suit][tile.num] || tile.num}`;

    const el = document.createElement("span");
    el.className = "mj-tile" +
      (tile.red      ? " mj-tile--red"      : "") +
      (tile.sideways ? " mj-tile--sideways" : "");
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", label);
    el.style.setProperty("--tile-accent", accent);

    // Inner structure: stripe + glyph
    el.innerHTML =
      `<span class="mj-tile__stripe"></span>` +
      `<span class="mj-tile__glyph">${glyph}</span>`;

    return el;
  }

  function renderHand(notation) {
    const wrapper = document.createElement("span");
    wrapper.className = "mj-hand";
    wrapper.setAttribute("aria-label", `Mahjong hand: ${notation}`);

    const tiles = parseNotation(notation);
    for (const tile of tiles) {
      wrapper.appendChild(buildTileElement(tile));
    }
    return wrapper;
  }

  // ── DOM Walker ────────────────────────────────────────────────────────────────
  // Matches [anything] where 'anything' looks like tile notation
  const NOTATION_RE = /\[([0-9mMpPsSzZ| ]+)\]/g;

  function processTextNode(node) {
    const text = node.nodeValue;
    if (!NOTATION_RE.test(text)) return;

    NOTATION_RE.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let lastIndex = 0;
    let match;

    while ((match = NOTATION_RE.exec(text)) !== null) {
      // Text before the match
      if (match.index > lastIndex) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }
      frag.appendChild(renderHand(match[1]));
      lastIndex = match.index + match[0].length;
    }
    // Remaining text
    if (lastIndex < text.length) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    node.parentNode.replaceChild(frag, node);
  }

  function walk(root) {
    // TreeWalker is fast and avoids live NodeList issues
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const tag = node.parentNode?.tagName?.toLowerCase();
          // Skip script/style/pre/code nodes
          if (["script","style","pre","code","textarea"].includes(tag)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (!/\[/.test(node.nodeValue)) return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(processTextNode);
  }

  // ── Styles ────────────────────────────────────────────────────────────────────
  function injectStyles() {
    const css = `
/* ── Mahjong Tile Renderer Styles ───────────────────────────────────────── */
.mj-hand {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  flex-wrap: wrap;
  vertical-align: middle;
  line-height: 1;
  margin: 0 4px;
}

.mj-sep {
  display: inline-block;
  width: 6px;
  flex-shrink: 0;
}

.mj-tile {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.1em;
  height: 2.7em;
  background: #1e1e1e;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 4px;
  box-shadow:
    0 2px 0 0 rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,255,255,0.06);
  font-size: 1.15em;
  cursor: default;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  flex-shrink: 0;
  overflow: hidden;
  --tile-accent: #fbbf24;
}

.mj-tile:hover {
  transform: translateY(-3px);
  box-shadow:
    0 5px 0 0 rgba(0,0,0,0.7),
    inset 0 1px 0 rgba(255,255,255,0.08);
}

/* Suit-colour stripe at bottom of tile */
.mj-tile__stripe {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--tile-accent);
  opacity: 0.9;
}

.mj-tile__glyph {
  position: relative;
  z-index: 1;
  font-size: 1.4em;
  line-height: 1;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
}

/* Red five styling */
.mj-tile--red .mj-tile__glyph {
  filter: drop-shadow(0 0 4px rgba(225,29,72,0.8));
}
.mj-tile--red {
  border-color: rgba(225,29,72,0.4);
}
.mj-tile--red .mj-tile__stripe {
  background: #e11d48;
}

/* Called tile — rotated 90°, shorter width */
.mj-tile--sideways {
  transform: rotate(90deg);
  width: 2.7em;
  height: 2.1em;
  margin: 0 6px;
}
.mj-tile--sideways:hover {
  transform: rotate(90deg) translateY(-3px);
}

/* Inline hand inside post paragraphs needs a bit of vertical breathing room */
p .mj-hand, li .mj-hand {
  margin: 0 2px;
}

/* ── Hand block — use class="hand-block" on a paragraph for a display row ── */
.hand-block .mj-hand {
  font-size: 1.25em;
  margin: 0.75rem 0;
}
`;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ── Init ──────────────────────────────────────────────────────────────────────
  function init() {
    injectStyles();
    // Process the main content area; fall back to body
    const target = document.querySelector(".post-content, .prose, main, article, body");
    walk(target || document.body);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
