
// register.js — Wizard multi-step registration + API Integration

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('registerForm');
    const roleSelect = document.getElementById('reg-role');
    const charityFields = document.getElementById('charity-fields');
    const adminFields = document.getElementById('admin-fields');

    /* ══════════════════════════════════════════
       Wizard State
    ══════════════════════════════════════════ */

    let currentStep = 1;
    const TOTAL_STEPS = 3;

    const progressFill = document.getElementById('progressFill');

    const updateProgress = (step) => {

        const pct = (step / TOTAL_STEPS) * 100;

        if (progressFill) {
            progressFill.style.width = pct + '%';
        }

        for (let i = 1; i <= TOTAL_STEPS; i++) {

            const dot = document.getElementById(`dot-${i}`);
            const label = document.getElementById(`label-${i}`);

            if (!dot || !label) continue;

            dot.className = 'step-dot';
            label.className = 'step-label';

            if (i < step) {
                dot.classList.add('done');
                label.classList.add('done');
            }

            if (i === step) {
                dot.classList.add('active');
                label.classList.add('active');
            }
        }
    };

    const goToStep = (next) => {

        const current = document.getElementById(`step-${currentStep}`);
        const target = document.getElementById(`step-${next}`);

        if (!current || !target) return;

        current.classList.remove('active');
        target.classList.add('active');

        currentStep = next;

        updateProgress(next);
    };

    /* ══════════════════════════════════════════
       Validation Rules
    ══════════════════════════════════════════ */

    const rules = {

        userName: {
            re: /^[a-zA-Z\u0621-\u064A][^#&<>"~;$^%{}]{2,29}$/,
            msg: 'اسم المستخدم: يبدأ بحرف، 3-30 حرف، بدون رموز خاصة',
            ok: 'اسم المستخدم مقبول ✓'
        },

        email: {
            re: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.(com|net|edu)$/,
            msg: 'صيغة البريد غير صحيحة',
            ok: 'البريد الإلكتروني صالح ✓'
        },

        password: {
            re: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
            msg: 'يجب أن تحتوي على حرف كبير وصغير ورقم و8 أحرف على الأقل',
            ok: 'كلمة المرور قوية ✓'
        },

        phone: {
            re: /^(002|\+2)?01[0125][0-9]{8}$/,
            msg: 'رقم الهاتف غير صالح',
            ok: 'رقم الهاتف صالح ✓'
        },

        address: {
            fn: v => v.length >= 5 && v.length <= 100,
            msg: 'العنوان يجب أن يكون بين 5 و100 حرف',
            ok: 'العنوان صالح ✓'
        },

        charityName: {
            fn: v => v.length >= 3,
            msg: 'اسم الجمعية يجب أن يكون 3 أحرف على الأقل',
            ok: 'اسم الجمعية صالح ✓'
        },

        licenseNumber: {
            re: /^(?=.{6,20}$)[A-Z0-9-]+$/,
            msg: 'رقم الترخيص غير صالح',
            ok: 'رقم الترخيص صالح ✓'
        },

        nationalID: {
            re: /^\d{14}$/,
            msg: 'الرقم القومي يجب أن يكون 14 رقم',
            ok: 'الرقم القومي صالح ✓'
        }
    };

    const isValid = (value, rule) => {
        return rule.fn ? rule.fn(value) : rule.re.test(value);
    };

    /* ══════════════════════════════════════════
       Helpers
    ══════════════════════════════════════════ */

    const toast = (title, icon, text = '') => {

        Swal.fire({
            toast: true,
            position: 'top-end',
            icon,
            title,
            text,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
    };

    const getRuleKey = (id) => {

        const map = {
            'reg-username': 'userName',
            'reg-email': 'email',
            'reg-password': 'password',
            'reg-phone': 'phone',
            'reg-address': 'address',
            'reg-charityName': 'charityName',
            'reg-licenseNumber': 'licenseNumber',
            'reg-nationalID': 'nationalID'
        };

        return map[id];
    };

    const setFieldState = (id, state, customMsg = '') => {

        const input = document.getElementById(id);
        const hint = document.getElementById(`hint-${id}`);

        if (!input) return;

        input.classList.remove('input-valid', 'input-invalid');

        if (state === 'valid') {

            input.classList.add('input-valid');

            if (hint) {

                hint.className = 'field-hint hint-success';

                const key = getRuleKey(id);

                hint.innerHTML = `
                    <i class="fa-solid fa-circle-check"></i>
                    ${customMsg || rules[key]?.ok || ''}
                `;
            }

        } else if (state === 'invalid') {

            input.classList.add('input-invalid');

            if (hint) {

                hint.className = 'field-hint hint-error';

                const key = getRuleKey(id);

                hint.innerHTML = `
                    <i class="fa-solid fa-circle-exclamation"></i>
                    ${customMsg || rules[key]?.msg || ''}
                `;
            }

        } else {

            if (hint) {
                hint.className = 'field-hint';
                hint.innerHTML = '';
            }
        }
    };

    /* ══════════════════════════════════════════
       Password Toggle
    ══════════════════════════════════════════ */

    const togglePassword = (inputId, btn) => {

        const input = document.getElementById(inputId);

        if (!input || !btn) return;

        const isHidden = input.type === 'password';

        input.type = isHidden ? 'text' : 'password';

        const icon = btn.querySelector('i');

        if (icon) {
            icon.className = isHidden
                ? 'fa-solid fa-eye-slash'
                : 'fa-solid fa-eye';
        }
    };

    document.getElementById('toggle-reg-password')
        ?.addEventListener('click', function () {

            togglePassword('reg-password', this);
        });

    document.getElementById('toggle-reg-confirmPassword')
        ?.addEventListener('click', function () {

            togglePassword('reg-confirmPassword', this);
        });

    /* ══════════════════════════════════════════
       Confirm Password
    ══════════════════════════════════════════ */

    document.getElementById('reg-confirmPassword')
        ?.addEventListener('blur', () => {

            const pw =
                document.getElementById('reg-password')?.value || '';

            const cpw =
                document.getElementById('reg-confirmPassword')?.value || '';

            if (!cpw) return;

            if (pw === cpw) {

                setFieldState(
                    'reg-confirmPassword',
                    'valid',
                    'كلمتا المرور متطابقتان ✓'
                );

            } else {

                setFieldState(
                    'reg-confirmPassword',
                    'invalid',
                    'كلمتا المرور غير متطابقتين'
                );
            }
        });

    /* ══════════════════════════════════════════
       Live Validation
    ══════════════════════════════════════════ */

    const blurFields = [
        'reg-username',
        'reg-email',
        'reg-password',
        'reg-phone',
        'reg-address',
        'reg-charityName',
        'reg-licenseNumber',
        'reg-nationalID'
    ];

    blurFields.forEach(id => {

        document.getElementById(id)
            ?.addEventListener('blur', ({ target }) => {

                const key = getRuleKey(id);

                if (!key || !rules[key]) return;

                const val = target.value.trim();

                if (!val) {
                    setFieldState(id, 'reset');
                    return;
                }

                setFieldState(
                    id,
                    isValid(val, rules[key]) ? 'valid' : 'invalid'
                );
            });
    });

    /* ══════════════════════════════════════════
       Role Change
    ══════════════════════════════════════════ */

    roleSelect?.addEventListener('change', ({ target }) => {

        const role = target.value;

        charityFields?.classList.toggle(
            'show',
            role === 'charity'
        );

        adminFields?.classList.toggle(
            'show',
            role === 'admin'
        );
    });

    /* ══════════════════════════════════════════
       Navigation
    ══════════════════════════════════════════ */

    document.getElementById('nextStep1')
        ?.addEventListener('click', () => {

            const fields = [
                { id: 'reg-username', key: 'userName' },
                { id: 'reg-email', key: 'email' },
                { id: 'reg-password', key: 'password' }
            ];

            for (const field of fields) {

                const val =
                    document.getElementById(field.id)
                        ?.value.trim() || '';

                if (!isValid(val, rules[field.key])) {

                    setFieldState(field.id, 'invalid');

                    return toast(
                        rules[field.key].msg,
                        'error'
                    );
                }

                setFieldState(field.id, 'valid');
            }

            const pw =
                document.getElementById('reg-password')?.value || '';

            const cpw =
                document.getElementById('reg-confirmPassword')?.value || '';

            if (pw !== cpw) {

                setFieldState(
                    'reg-confirmPassword',
                    'invalid',
                    'كلمتا المرور غير متطابقتين'
                );

                return toast(
                    'كلمتا المرور غير متطابقتين',
                    'error'
                );
            }

            goToStep(2);
        });

    document.getElementById('prevStep2')
        ?.addEventListener('click', () => goToStep(1));

    document.getElementById('nextStep2')
        ?.addEventListener('click', () => {

            const phone =
                document.getElementById('reg-phone')
                    ?.value.trim() || '';

            const address =
                document.getElementById('reg-address')
                    ?.value.trim() || '';

            if (!isValid(phone, rules.phone)) {

                setFieldState('reg-phone', 'invalid');

                return toast(rules.phone.msg, 'error');
            }

            if (!isValid(address, rules.address)) {

                setFieldState('reg-address', 'invalid');

                return toast(rules.address.msg, 'error');
            }

            setFieldState('reg-phone', 'valid');
            setFieldState('reg-address', 'valid');

            goToStep(3);
        });

    document.getElementById('prevStep3')
        ?.addEventListener('click', () => goToStep(2));

    /* ══════════════════════════════════════════
       Submit Form + Fetch API
    ══════════════════════════════════════════ */

    form?.addEventListener('submit', async (e) => {

        e.preventDefault();

        const role = roleSelect?.value || '';

        if (!role) {
            return toast('اختر نوع الحساب', 'error');
        }

        const payload = {

            email:
                document.getElementById('reg-email')
                    ?.value.trim(),

            password:
                document.getElementById('reg-password')
                    ?.value,

            confirmPassword:
                document.getElementById('reg-confirmPassword')
                    ?.value,

            phone:
                document.getElementById('reg-phone')
                    ?.value.trim(),

            address:
                document.getElementById('reg-address')
                    ?.value.trim(),

            roleType: role
        };

        /* user + admin */

        if (role !== 'charity') {

            payload.userName =
                document.getElementById('reg-username')
                    ?.value.trim();
        }

        /* charity */

        if (role === 'charity') {

            payload.charityName =
                document.getElementById('reg-charityName')
                    ?.value.trim();

            payload.licenseNumber =
                document.getElementById('reg-licenseNumber')
                    ?.value.trim();

            payload.charityDescription =
                document.getElementById('reg-charityDescription')
                    ?.value.trim();

            if (!isValid(payload.charityName, rules.charityName)) {

                setFieldState('reg-charityName', 'invalid');

                return toast(
                    rules.charityName.msg,
                    'error'
                );
            }

            if (!isValid(payload.licenseNumber, rules.licenseNumber)) {

                setFieldState('reg-licenseNumber', 'invalid');

                return toast(
                    rules.licenseNumber.msg,
                    'error'
                );
            }
        }

        /* admin */

        if (role === 'admin') {

            payload.nationalID =
                document.getElementById('reg-nationalID')
                    ?.value.trim();

            if (!payload.nationalID) {

                return toast(
                    'الرقم القومي مطلوب',
                    'error'
                );
            }

            if (!isValid(payload.nationalID, rules.nationalID)) {

                setFieldState('reg-nationalID', 'invalid');

                return toast(
                    rules.nationalID.msg,
                    'error'
                );
            }
        }

        const submitBtn =
            document.getElementById('sign_up');

        submitBtn.disabled = true;

        submitBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            جاري إنشاء الحساب...
        `;

        try {

            const response = await fetch(
                'https://ataa-charity-platform.vercel.app/auth/register',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(payload)
                }
            );

            const data = await response.json();
if (response.ok) {

    Swal.fire({
        icon: 'success',
        title: 'تم إنشاء الحساب بنجاح',
        text: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
        confirmButtonText: 'متابعة'
    }).then(() => {

        /* حفظ الإيميل */

        localStorage.setItem(
            'verifyEmail',
            payload.email
        );

        /* الانتقال لصفحة التحقق */

        window.location.href = 'Email.html';
    });

            } else {

                Swal.fire({
                    icon: 'error',
                    title: 'فشل إنشاء الحساب',
                    text:
                        data.message ||
                        'حدث خطأ أثناء التسجيل'
                });
            }

        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: 'error',
                title: 'خطأ في الاتصال',
                text: 'تعذر الاتصال بالسيرفر'
            });

        } finally {

            submitBtn.disabled = false;

            submitBtn.innerHTML = `
                <i class="fa-solid fa-user-plus"></i>
                سجل الآن
            `;
        }
    });

    /* Init */

    updateProgress(1);
});


