
// Navbar scroll
// ===============================
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");

  if (navbar) {
    navbar.classList.toggle(
      "scrolled",
      window.scrollY > 20
    );
  }
});

// ===============================
// DOM Loaded
// ===============================
document.addEventListener(
  "DOMContentLoaded",
  () => {

    // ===============================
    // Hamburger menu
    // ===============================
    const ham =
      document.getElementById(
        "hamBtn"
      );

    const mob =
      document.getElementById(
        "mobileNav"
      );

    if (ham && mob) {
      ham.addEventListener(
        "click",
        () => {
          ham.classList.toggle(
            "open"
          );

          mob.classList.toggle(
            "open"
          );
        }
      );
    }
 
    

    // ===============================
    // Login / Register Mode
    // ===============================
    const container =
      document.getElementById(
        "container"
      );

    if (container) {

      const params =
        new URLSearchParams(
          window.location.search
        );

      const mode =
        params.get("mode");

      const loginBtn =
        document.getElementById(
          "login-toggle"
        );

      const registerBtn =
        document.getElementById(
          "register-toggle"
        );

      // الوضع الافتراضي Login
      container.classList.remove(
        "sign-up-mode"
      );

      // فتح حسب URL
      if (
        mode === "register"
      ) {

        container.classList.add(
          "sign-up-mode"
        );
      }

      if (
        mode === "login"
      ) {

        container.classList.remove(
          "sign-up-mode"
        );
      }

      // زر إنشاء حساب
      registerBtn?.addEventListener(
        "click",
        () => {

          container.classList.add(
            "sign-up-mode"
          );
        }
      );

      // زر تسجيل الدخول
      loginBtn?.addEventListener(
        "click",
        () => {

          container.classList.remove(
            "sign-up-mode"
          );
        }
      );
    }

    // ===============================
    // FAQ checkbox
    // ===============================
    const text =
      document.getElementById(
        "check"
      );

    const button =
      document.getElementById(
        "btn"
      );

    if (text && button) {

      text.addEventListener(
        "change",
        function () {

          button.disabled =
            !text.checked;
        }
      );

      button.addEventListener(
        "click",
        function () {

          const message =
            document.getElementById(
              "successmessage"
            );

          if (message) {
            message.style.display =
              "block";
          }
        }
      );
    }

    // ===============================
    // FAQ Accordion
    // ===============================
    const question =
      document.querySelectorAll(
        ".aske"
      );

    question.forEach(
      function (fqe) {

        fqe.addEventListener(
          "click",
          function () {

            const check =
              this.classList.contains(
                "active"
              );

            question.forEach(
              function (test) {

                test.classList.remove(
                  "active"
                );
              }
            );

            if (!check) {

              this.classList.add(
                "active"
              );
            }
          }
        );
      }
    );

    // ===============================
    // Side Menu
    // ===============================
    const menu =
      document.getElementById(
        "menu"
      );

    const nav =
      document.getElementById(
        "nav"
      );

    if (menu && nav) {

      menu.onclick =
        function () {

          nav.style.display =
            nav.style.display ===
            "block"
              ? "none"
              : "block";
        };
    }

    // ===============================
    // ===============================
// ===============================
// Auth Navbar
// ===============================

function logout() {

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "index.html";
}

const navActions =
  document.getElementById(
    "navActions"
  );

if (navActions) {

  const token =
    localStorage.getItem(
      "token"
    );

  let user = null;

  try {

    user = JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  } catch (error) {

    console.error(
      "Invalid user data",
      error
    );

    localStorage.removeItem(
      "user"
    );
  }

  // ===============================
  // Guest Navbar
  // ===============================
  if (!token || !user) {

    // Desktop
    navActions.innerHTML = `
      <a class="nav-btn-login"
         href="login-register.html?mode=login">
        دخول
      </a>

      <a class="nav-btn-signup"
         href="login-register.html?mode=register">
        حساب جديد
      </a>
    `;

    // Mobile
    const mobileGuestButtons =
      document.getElementById("mobileGuestButtons");

    const mobileUserButtons =
      document.getElementById("mobileUserButtons");

    if (mobileGuestButtons && mobileUserButtons) {

      mobileGuestButtons.style.display = "block";
      mobileUserButtons.style.display = "none";
    }

  } else {

    // Dashboard حسب نوع الحساب
    let dashboardLink = "index.html";

    switch (user.roleType?.toLowerCase()) {

      case "user":
        dashboardLink = "donor-dashboard.html";
        break;

      case "charity":
        dashboardLink = "charity-dashboard.html";
        break;

      case "admin":
        dashboardLink = "admin-dashboard.html";
        break;
    }

    // Desktop Navbar
    navActions.innerHTML = `
      <span class="user-name">
        مرحباً 👋
      </span>

      <a class="nav-btn-settings"
         href="settings.html"
         title="الإعدادات">
         ⚙️
      </a>

      <a class="nav-btn-signup"
         href="${dashboardLink}">
        Dashboard
      </a>

      <button class="nav-btn-login"
              id="logoutBtn">
        تسجيل خروج
      </button>
    `;

    // Mobile Navbar
    const mobileGuestButtons =
      document.getElementById("mobileGuestButtons");

    const mobileUserButtons =
      document.getElementById("mobileUserButtons");

    if (mobileGuestButtons && mobileUserButtons) {

      mobileGuestButtons.style.display = "none";
      mobileUserButtons.style.display = "block";

      mobileUserButtons.innerHTML = `
        <a href="${dashboardLink}"
           class="nav-btn-login">
           Dashboard
        </a>

        <a href="settings.html"
           class="nav-btn-login">
           ⚙️ الإعدادات
        </a>

        <button id="mobileLogoutBtn"
                class="nav-btn-signup"
                style="width:100%;margin-top:10px;">
            تسجيل خروج
        </button>
      `;
    }

    // Logout Desktop
    document
      .getElementById("logoutBtn")
      ?.addEventListener("click", logout);

    // Logout Mobile
    document
      .getElementById("mobileLogoutBtn")
      ?.addEventListener("click", logout);
  }
}
// ===============================
// Reveal on scroll
// ===============================
const revealEls =
  document.querySelectorAll(
    ".reveal"
  );

if (revealEls.length > 0) {

  const io =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "visible"
              );
            }
          }
        );
      },
      {
        threshold: 0.12
      }
    );

  revealEls.forEach(
    (el) =>
      io.observe(el)
  );
}

// ===============================
// Contact form submit
// ===============================
function handleSubmit(e) {

  e.preventDefault();

  const msg =
    document.getElementById(
      "successMsg"
    );

  if (msg) {
    msg.style.display =
      "block";
  }

  e.target.reset();

  setTimeout(() => {

    if (msg) {
      msg.style.display =
        "none";
    }

  }, 5000);
}

// ===============================
// Charity filter buttons
// ===============================
document
  .querySelectorAll(
    ".filter-btn"
  )
  .forEach((btn) => {

    btn.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".filter-btn"
          )
          .forEach((b) => {

            b.classList.remove(
              "active"
            );
          });

        btn.classList.add(
          "active"
        );
      }
    );
  });

// ===============================
// Loader
// ===============================
window.addEventListener(
  "load",
  () => {

    setTimeout(() => {

      const loader =
        document.getElementById(
          "loader"
        );

      const content =
        document.getElementById(
          "content"
        );

      if (loader) {
        loader.style.display =
          "none";
      }

      if (content) {
        content.style.display =
          "block";
      }

    }, 1000);
  }
);
});

