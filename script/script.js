// الاسئلة الشائعة
let text = document.getElementById("check");
let botton = document.getElementById("btn");

if (text && botton) {

    text.addEventListener('change', function () {

        // لو علمت على الشيك بوكس الزرار يشتغل
        botton.disabled = !text.checked;
    });

    botton.addEventListener('click', function () {

        const message = document.getElementById("successmessage");

        if (message) {

            message.style.display = 'block';
        }
    });
}

/* ================= سياسة الخصوصية ================= */

let question = document.querySelectorAll('.aske');

question.forEach(function (fqe) {

    fqe.addEventListener('click', function () {

        let check = this.classList.contains('active');

        question.forEach(function (test) {

            test.classList.remove('active');
        });

        if (check == false) {

            this.classList.add('active');
        }
    });
});

/* ================= humburger menu ================= */

let menu = document.getElementById("menu");
let nav = document.getElementById("nav");

if (menu && nav) {

    menu.onclick = function () {

        nav.style.display =
            nav.style.display === "block"
                ? "none"
                : "block";
    };
}

/* ================= Login / Register Toggle ================= */
document.addEventListener("DOMContentLoaded", function () {

    const container =
        document.getElementById("container");

    if (!container) return;

    const loginBtn =
        document.getElementById("login-toggle");

    const registerBtn =
        document.getElementById("register-toggle");

    // قراءة mode من الـ URL
    const params =
        new URLSearchParams(window.location.search);

    const mode =
        params.get("mode");

    // الوضع الافتراضي = Register
    container.classList.remove("active");

    // لو mode=login افتح login
    if (mode === "login") {

        container.classList.add("active");
    }

    // لو mode=register افتح register
    if (mode === "register") {

        container.classList.remove("active");
    }

    // زر "إنشاء حساب" → يفتح Login
    if (registerBtn) {

        registerBtn.addEventListener("click", function () {

            container.classList.add("active");

            history.pushState(
                {},
                "",
                "?mode=login"
            );
        });
    }

    // زر "تسجيل الدخول" → يفتح Register
    if (loginBtn) {

        loginBtn.addEventListener("click", function () {

            container.classList.remove("active");

            history.pushState(
                {},
                "",
                "?mode=register"
            );
        });
    }
});