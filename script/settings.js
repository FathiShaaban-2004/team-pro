



document.addEventListener('DOMContentLoaded', () => {

    const BASE_URL =
        "https://ataa-charity-platform.vercel.app";

    // =========================
    // TOKEN
    // =========================
    const token =
        localStorage.getItem("token");

    // =========================
    // CHECK TOKEN
    // =========================
    if (!token) {

        window.location.href =
            "login-register.html?mode=login";

        return;
    }

    // =========================
    // NAVBAR
    // =========================
    const navbar =
        document.querySelector('.navbar');

    window.addEventListener('scroll', () => {

        navbar?.classList.toggle(
            'scrolled',
            window.scrollY > 10
        );
    });

    // =========================
    // MOBILE MENU
    // =========================
    const ham =
        document.querySelector('.nav-ham');

    const mobileNav =
        document.querySelector('.mobile-nav');

    ham?.addEventListener('click', () => {

        ham.classList.toggle('open');

        mobileNav.classList.toggle('open');
    });

    // =========================
    // SETTINGS TABS
    // =========================
    const tabs =
        document.querySelectorAll('.settings-nav a');

    const sections =
        document.querySelectorAll('.settings-card');

    tabs.forEach(tab => {

        tab.addEventListener('click', (e) => {

            e.preventDefault();

            tabs.forEach(t =>
                t.classList.remove('active')
            );

            sections.forEach(s =>
                s.classList.remove('active')
            );

            tab.classList.add('active');

            const target =
                document.querySelector(
                    tab.getAttribute('href')
                );

            target?.classList.add('active');

            ham?.classList.remove('open');

            mobileNav?.classList.remove('open');
        });
    });

// =========================
// GET PROFILE
// =========================
async function getProfile() {

    try {

        const response =
            await fetch(
                `${BASE_URL}/users/profile`,
                {
                    method: "GET",

                    headers: {
                        authorization:
                            token
                    }
                }
            );

        const data =
            await response.json();

        console.log(
            "PROFILE FULL:",
            data
        );

        // لو التوكن غلط
        if (!response.ok) {

            console.log(
                "Invalid Token"
            );

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "login-register.html?mode=login";

            return;
        }

        // البيانات جاية هنا
        const profile =
            data.finder;

        console.log(
            "PROFILE DATA:",
            profile
        );

        // تعبئة الانبوتات
        document.getElementById(
            "userName"
        ).value =
            profile?.userName || "";

        document.getElementById(
            "phone"
        ).value =
            profile?.phone || "";

        document.getElementById(
            "address"
        ).value =
            profile?.address || "";

    } catch (error) {

        console.log(
            "Get Profile Error:",
            error
        );
    }
}

getProfile();
    // =========================
// UPDATE PROFILE
// =========================
const profileForm =
    document.getElementById(
        "profileForm"
    );

profileForm?.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const btn =
            profileForm.querySelector(
                ".btn-primary"
            );

        const originalText =
            btn.textContent;

        btn.textContent =
            "جاري الحفظ...";

        btn.disabled = true;

        try {

            // القيم
            const userName =
                document.getElementById(
                    "userName"
                ).value.trim();

            const phone =
                document.getElementById(
                    "phone"
                ).value.trim();

            const address =
                document.getElementById(
                    "address"
                ).value.trim();

                // نبعت الحقول اللي فيها قيمة فقط

            const body = {};

            if (userName)
                body.userName =
                    userName;

            if (phone)
                body.phone =
                    phone;

            if (address)
                body.address =
                    address;

            const response =
                await fetch(
                    `${BASE_URL}/users/profile`,
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json",

                            authorization:
                                token
                        },

                        body: JSON.stringify(
                            body
                        )
                    }
                );

            const data =
                await response.json();

            console.log(data);

            if (response.ok) {

                btn.textContent =
                    "تم الحفظ ✓";

            } else {

                btn.textContent =
                    data.message ||
                    "فشل التحديث";

                console.log(
                    data.details
                );
            }

        } catch (error) {

            console.log(error);

            btn.textContent =
                "حدث خطأ";
        }

        setTimeout(() => {

            btn.textContent =
                originalText;

            btn.disabled = false;

        }, 2000);
    }
);
    // =========================
    // CHANGE PASSWORD
    // =========================
    const passwordForm =
        document.getElementById(
            "passwordForm"
        );

    passwordForm?.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const btn =
                passwordForm.querySelector(
                    ".btn-primary"
                );

            const originalText =
                btn.textContent;

            btn.textContent =
                "جاري التحديث...";

            btn.disabled = true;

            try {

                const response =
                    await fetch(
                        `${BASE_URL}/users/changePassword`,
                        {
                            method: "PATCH",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                authorization:
                                    token
                            },

                            body: JSON.stringify({

                                oldPassword:
                                    document.getElementById(
                                        "oldPassword"
                                    ).value,

                                newPassword:
                                    document.getElementById(
                                        "newPassword"
                                    ).value,

                                confirmPassword:
                                    document.getElementById(
                                        "confirmPassword"
                                    ).value
                            })
                        }
                    );

                const data =
                    await response.json();

                console.log(data);

                if (response.ok) {

                    btn.textContent =
                        "تم تغيير كلمة المرور ✓";

                    passwordForm.reset();

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    setTimeout(() => {

                        window.location.href =
                            "login-register.html?mode=login";

                    }, 1000);

                } else {

                    btn.textContent =
                        data.message ||
                        "فشل التحديث";
                }

            } catch (error) {

                console.log(error);

                btn.textContent =
                    "حدث خطأ";
            }

            setTimeout(() => {

                btn.textContent =
                    originalText;

                btn.disabled = false;

            }, 2000);
        }
    );

    // =========================
    // DELETE ACCOUNT
    // =========================
    const deleteBtn =
        document.getElementById(
            "deleteAccountBtn"
        );

    deleteBtn?.addEventListener(
        "click",
        async () => {

            const confirmDelete =
                confirm(
                    "هل أنت متأكد من حذف الحساب؟"
                );

            if (!confirmDelete) return;

            try {

                const response =
                    await fetch(
                        `${BASE_URL}/users/account`,
                        {
                            method: "DELETE",

                            headers: {
                                authorization:
                                    token
                            }
                        }
                    );

                const data =
                    await response.json();

                console.log(data);

                if (response.ok) {

                    alert(
                        "تم حذف الحساب"
                    );

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    window.location.href =
                        "index.html";

                } else {

                    alert(
                        data.message ||
                        "فشل حذف الحساب"
                    );
                }

            } catch (error) {

                console.log(error);

                alert("حدث خطأ");
            }
        }
    );

    // =========================
    // AVATAR
    // =========================
    const avatarInput =
        document.getElementById(
            "avatarInput"
        );

    const changeAvatarBtn =
        document.getElementById(
            "changeAvatarBtn"
        );

    const removeAvatarBtn =
        document.getElementById(
            "removeAvatarBtn"
        );

    const avatarPreview =
        document.getElementById(
            "avatarPreview"
        );

    changeAvatarBtn?.addEventListener(
        "click",
        () => {

            avatarInput?.click();
        }
    );

    avatarInput?.addEventListener(
        "change",
        (e) => {

            const file =
                e.target.files[0];

            if (!file) return;

            const reader =
                new FileReader();

            reader.onload =
                function(event) {

                    avatarPreview.innerHTML = `
                        <img
                            src="${event.target.result}"
                            alt="avatar"
                            style="
                                width:100%;
                                height:100%;
                                object-fit:cover;
                                border-radius:50%;
                            "
                        >
                    `;
                };

            reader.readAsDataURL(file);
        }
    );

    removeAvatarBtn?.addEventListener(
        "click",
        () => {

            avatarPreview.innerHTML =
                "👤";

            avatarInput.value = "";
        }
    );

});