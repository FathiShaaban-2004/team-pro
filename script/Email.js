
//  ════════════════════════════════════════════════
const particlesEl =
    document.getElementById('particles');

 //  ════════════════════════════════════════════════
//    Show User Email
// ════════════════════════════════════════════════ */

const savedEmail =
    localStorage.getItem('verifyEmail');

if (savedEmail) {

    const emailElement =
        document.getElementById('user-email');

    if (emailElement) {

        emailElement.textContent =
            savedEmail;
    }
}

/* ════════════════════════════════════════════════
   Particles
════════════════════════════════════════════════ */

if (particlesEl) {

    const colors = [
        '#3ba8b4',
        '#5ec0cb',
        '#d4af37',
        '#e2c96b',
        '#267880',
        '#2e8e98'
    ];

    for (let i = 0; i < 16; i++) {

        const p =
            document.createElement('div');

        p.className = 'particle';

        p.style.cssText = `
            left:${Math.random() * 100}vw;
            top:${Math.random() * 100}vh;
            background:${colors[Math.floor(Math.random() * colors.length)]};
            animation-delay:${Math.random() * 6}s;
            animation-duration:${4 + Math.random() * 4}s;
        `;

        particlesEl.appendChild(p);
    }
}

/* ════════════════════════════════════════════════
   OTP Inputs
════════════════════════════════════════════════ */

const inputs = Array.from(
    document.querySelectorAll('.otp-input')
);

const progressBar =
    document.getElementById('progress-bar');

inputs.forEach((inp, i) => {

    inp.addEventListener('input', (e) => {

        const val =
            e.target.value.replace(/\D/g, '');

        inp.value = val;

        inp.classList.toggle(
            'filled',
            val !== ''
        );

        document
            .getElementById('error-msg')
            .classList.remove('show');

        inp.classList.remove('error');

        updateProgress();

        if (val && i < 5) {

            inputs[i + 1].focus();
        }
    });

    inp.addEventListener('keydown', (e) => {

        if (
            e.key === 'Backspace' &&
            !inp.value &&
            i > 0
        ) {

            inputs[i - 1].value = '';

            inputs[i - 1]
                .classList.remove('filled');

            inputs[i - 1].focus();

            updateProgress();
        }

        if (e.key === 'ArrowLeft' && i < 5) {

            inputs[i + 1].focus();
        }

        if (e.key === 'ArrowRight' && i > 0) {

            inputs[i - 1].focus();
        }
    });

    inp.addEventListener('paste', (e) => {

        e.preventDefault();

        const data = e.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, 6);

        data.split('').forEach((ch, j) => {

            if (inputs[j]) {

                inputs[j].value = ch;

                inputs[j]
                    .classList.add('filled');
            }
        });

        updateProgress();
    });
});

/* ════════════════════════════════════════════════
   Progress
════════════════════════════════════════════════ */

function updateProgress() {

    const filled =
        inputs.filter(i => i.value).length;

    if (progressBar) {

        progressBar.style.width =
            (filled / 6 * 100) + '%';
    }
}

/* ════════════════════════════════════════════════
   Verify OTP
════════════════════════════════════════════════ */

async function verifyOTP() {

    const code =
        inputs.map(i => i.value).join('');

    if (code.length < 6) {

        inputs.forEach(inp => {

            if (!inp.value) {

                inp.classList.add('error');
            }
        });

        setTimeout(() => {

            inputs.forEach(inp => {

                inp.classList.remove('error');
            });

        }, 500);

        return;
    }

    const email =
        localStorage.getItem('verifyEmail');

    if (!email) {

        return Swal.fire({
            icon: 'error',
            title: 'لم يتم العثور على البريد الإلكتروني'
        });
    }

    const btn =
        document.getElementById('verify-btn');

    btn.classList.add('loading');

    try {

        const response = await fetch(
            'https://ataa-charity-platform.vercel.app/auth/verifyEmail',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    email: email,
                    code: code
                })
            }
        );

        const data =
            await response.json();

        console.log(data);

        btn.classList.remove('loading');

        if (response.ok) {

            showSuccess();

            localStorage.removeItem(
                'verifyEmail'
            );

            setTimeout(() => {

                window.location.href =
                    'login-register.html?mode=login';

            }, 3000);

        } else {

            showError(
                data.message ||
                'رمز التحقق غير صحيح'
            );
        }

    } catch (error) {

        console.error(error);

        btn.classList.remove('loading');

        showError(
            'حدث خطأ أثناء الاتصال بالسيرفر'
        );
    }
}

/* ════════════════════════════════════════════════
   Error UI
════════════════════════════════════════════════ */

function showError(message) {

    const errorEl =
        document.getElementById('error-msg');

    errorEl.textContent =
        '❌ ' + message;

    errorEl.classList.add('show');

    inputs.forEach(inp => {

        inp.classList.add('error');

        inp.classList.remove('filled');
    });

    setTimeout(() => {

        inputs.forEach(inp => {

            inp.classList.remove('error');

            inp.value = '';
        });

        inputs[0].focus();

        updateProgress();

    }, 800);
}

/* ════════════════════════════════════════════════
   Success UI
════════════════════════════════════════════════ */

function showSuccess() {

    document
        .getElementById('view-otp')
        .classList.remove('active');

    document
        .getElementById('view-success')
        .classList.add('active');
}

/* ════════════════════════════════════════════════
   Timer
════════════════════════════════════════════════ */

let seconds = 60;

const timerEl =
    document.getElementById('timer');

const resendBtn =
    document.getElementById('resend-btn');

let timerInterval;

function startTimer(secs) {

    clearInterval(timerInterval);

    seconds = secs;

    timerEl.textContent =
        `(${seconds})`;

    resendBtn.disabled = true;

    timerInterval =
        setInterval(() => {

            seconds--;

            timerEl.textContent =
                seconds > 0
                    ? `(${seconds})`
                    : '';

            if (seconds <= 0) {

                clearInterval(timerInterval);

                resendBtn.disabled = false;
            }

        }, 1000);
}

/* ════════════════════════════════════════════════
   Resend
════════════════════════════════════════════════ */

async function resendCode() {

    Swal.fire({
        icon: 'success',
        title: 'تم إرسال كود جديد',
        text: 'تحقق من بريدك الإلكتروني'
    });

    startTimer(60);
}

/* ════════════════════════════════════════════════
   Boot
════════════════════════════════════════════════ */

startTimer(60);

if (inputs[0]) {

    inputs[0].focus();
}