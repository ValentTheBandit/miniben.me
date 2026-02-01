// --- HOME: gallery + order form (mailto MVP) ---
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.getAttribute("data-page");
  if (page === "home") initHome();
});

function initHome() {
  // 1) Gallery (ide majd a valódi 3D figurák képei jönnek)
  const galleryItems = [
    { title: "Kész figura #1", src: "fig1.png" },
    { title: "Kész figura #2", src: "fig2.png" },
    { title: "Kész figura #3", src: "fig3.png" }
];

  const grid = document.getElementById("galleryGrid");
  if (grid) {
    grid.innerHTML = galleryItems.map((it, i) => `
      <article class="product">
        <button class="thumb" style="border:0; cursor:pointer;" data-open="${i}">Kép</button>
        <div class="row">
          <div>
            <div style="font-weight:800">${escapeHtml(it.title)}</div>
            <div class="small">Kattints a nagyításhoz</div>
          </div>
          <div class="price">3D</div>
        </div>
        <div class="row">
          <a class="btn primary" href="#order">Ilyet szeretnék</a>
        </div>
      </article>
    `).join("");

    grid.querySelectorAll("[data-open]").forEach(btn => {
      btn.addEventListener("click", () => openImageModal(galleryItems[Number(btn.getAttribute("data-open"))]));
    });
  }

  // 2) Image modal
  const modal = document.getElementById("modal");
  const closeModalBtn = document.getElementById("closeModal");
  if (modal && closeModalBtn) {
    closeModalBtn.addEventListener("click", () => setModal(modal, false));
    modal.addEventListener("click", (e) => { if (e.target === modal) setModal(modal, false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setModal(modal, false); });
  }

  // 3) Privacy modal
  const privacy = document.getElementById("privacy");
  const openPrivacy = document.getElementById("openPrivacy");
  const closePrivacy = document.getElementById("closePrivacy");
  if (privacy && openPrivacy && closePrivacy) {
    openPrivacy.addEventListener("click", (e) => { e.preventDefault(); setModal(privacy, true); });
    closePrivacy.addEventListener("click", () => setModal(privacy, false));
    privacy.addEventListener("click", (e) => { if (e.target === privacy) setModal(privacy, false); });
  }

  // 4) Upload preview
  const photo = document.getElementById("photo");
  const previewWrap = document.getElementById("previewWrap");
  const preview = document.getElementById("preview");
  if (photo && previewWrap && preview) {
    photo.addEventListener("change", () => {
      const f = photo.files && photo.files[0];
      if (!f) { previewWrap.style.display = "none"; return; }
      if (!f.type.startsWith("image/")) {
        alert("Kérlek képfájlt válassz (JPG/PNG).");
        photo.value = "";
        previewWrap.style.display = "none";
        return;
      }
      preview.src = URL.createObjectURL(f);
      previewWrap.style.display = "grid";
    });
  }

  // 5) Order form -> mailto (MVP)
  const form = document.getElementById("orderForm");
  const msg = document.getElementById("formMsg");
  const downloadBtn = document.getElementById("downloadOrder");

  const TO_EMAIL = "rendeles@miniben.me"; // <-- ide írd a saját címed!

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const type = document.getElementById("type").value;
      const deadline = document.getElementById("deadline").value.trim();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const notes = document.getElementById("notes").value.trim();
      const consent = document.getElementById("consent").checked;
      const file = document.getElementById("photo").files?.[0];

      if (!consent) return showMsg(msg, "Kérlek fogadd el az adatkezelési nyilatkozatot.");
      if (!file) return showMsg(msg, "Kérlek tölts fel legalább 1 képet.");

      const subject = `[Rendelés] ${type} – ${name}`;
      const bodyLines = [
        "Szia!",
        "",
        "Szeretnék 3D minifigura rendelést leadni az alábbiak alapján:",
        "",
        `Típus: ${type}`,
        deadline ? `Határidő: ${deadline}` : "Határidő: (nem megadott)",
        `Név: ${name}`,
        `Kapcsolati email: ${email}`,
        "",
        "Leírás / megjegyzés:",
        notes ? notes : "(nincs megjegyzés)",
        "",
        "KÉP(ek):",
        "A böngésző nem tud automatikusan csatolmányt küldeni, ezért kérlek csatolom a kiválasztott képet ehhez a levélhez.",
        "",
        "Adatkezelés:",
        "Elfogadom az adatkezelési nyilatkozatot a rendelés feldolgozásához.",
        "",
        "Köszönöm!"
      ];

      const mailto = makeMailto(TO_EMAIL, subject, bodyLines.join("\n"));
      // megnyitja a levelezőt:
      window.location.href = mailto;

      showMsg(msg, "Megnyílt az email. Kérlek csatold a kiválasztott képet, majd küldd el!");
    });

    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        const payload = collectOrderDraft();
        downloadJson(payload, "miniben-rendeles.json");
        showMsg(msg, "Letöltöttem a rendelési adatokat JSON fájlba.");
      });
    }
  }

  function collectOrderDraft() {
    const type = document.getElementById("type").value;
    const deadline = document.getElementById("deadline").value.trim();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const notes = document.getElementById("notes").value.trim();
    const consent = document.getElementById("consent").checked;
    const file = document.getElementById("photo").files?.[0];

    return {
      type, deadline, name, email, notes,
      consent,
      selected_file_name: file ? file.name : null,
      created_at: new Date().toISOString()
    };
  }
}

function openImageModal(item) {
  const modal = document.getElementById("modal");
  const img = document.getElementById("modalImg");
  const cap = document.getElementById("modalCaption");
  if (!modal || !img || !cap) return;

  img.src = item.src;
  cap.textContent = item.title;
  setModal(modal, true);
}

function setModal(modalEl, open) {
  modalEl.setAttribute("aria-hidden", open ? "false" : "true");
}

function showMsg(el, text) {
  if (!el) return;
  el.textContent = text;
}

function makeMailto(to, subject, body) {
  // mailto max hossz kliensfüggő, ezért legyen tömör
  const s = encodeURIComponent(subject);
  const b = encodeURIComponent(body);
  return `mailto:${encodeURIComponent(to)}?subject=${s}&body=${b}`;
}

function downloadJson(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

setupFileName("png1", "png1Name");
// ha van:
// setupFileName("png2", "png2Name");
// setupFileName("png3", "png3Name");

function setupFileName(inputId, labelId) {
  const input = document.getElementById(inputId);
  const label = document.getElementById(labelId);
  if (!input || !label) return;

  input.addEventListener("change", () => {
    label.textContent = input.files?.[0]
      ? input.files[0].name
      : "Nincs fájl kiválasztva";
  });
}
