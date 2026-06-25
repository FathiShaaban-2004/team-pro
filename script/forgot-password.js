
  /* ════════════════════════════════════════════════
   Particles
════════════════════════════════════════════════ */
const pg = document.getElementById('particles');

if (pg) {

  const colors = [
    '#2e8e98',
    '#d4af37',
    '#5ec0cb'
  ];

  for (let i = 0; i < 30; i++) {

    const p = document.createElement('div');

    p.className = 'particle';

    p.style.cssText = `
      left:${Math.random() * 100}%;
      width:${2 + Math.random() * 3}px;
      height:${2 + Math.random() * 3}px;
      background:${colors[Math.floor(Math.random() * 3)]};
      animation-duration:${5 + Math.random() * 10}s;
      animation-delay:${Math.random() * 8}s;
    `;

    pg.appendChild(p);
  }
}

/* OTP */

const otpInputs = [
  ...document.querySelectorAll('.otp-input')
];

otpInputs.forEach((input, index) => {

  input.addEventListener('input', (e) => {

    let value = e.target.value;

    value = value.replace(/\D/g, '');

    input.value = value;

    input.style.color = '#ffffff';
    input.style.webkitTextFillColor = '#ffffff';

    if (value) {

      input.classList.add('filled');

      if (index < otpInputs.length - 1) {

        otpInputs[index + 1].focus();
      }

    } else {

      input.classList.remove('filled');
    }
  });

  input.addEventListener('keydown', (e) => {

    if (
      e.key === 'Backspace' &&
      !input.value &&
      index > 0
    ) {

      otpInputs[index - 1].focus();
    }
  });
});

/* Timer */

let timer;
let seconds = 120;

function startTimer() {

  clearInterval(timer);

  seconds = 120;

  const el = document.getElementById('countdown');

  const rb = document.getElementById('resendBtn');

  rb.disabled = true;

  timer = setInterval(() => {

    seconds--;

    const m = String(
      Math.floor(seconds / 60)
    ).padStart(2, '0');

    const s = String(
      seconds % 60
    ).padStart(2, '0');

    el.textContent = `${m}:${s}`;

    if (seconds <= 0) {

      clearInterval(timer);

      el.textContent = '00:00';

      rb.disabled = false;
    }

  }, 1000);
}

/* Toast */

function showToast(msg, icon = 'success') {

  Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title: msg,
    showConfirmButton: false,
    timer: 3000
  });
}

/* Panels */

function setActivePanel(id) {

  document
    .querySelectorAll('.panel')
    .forEach(p => p.classList.remove('active'));

  document
    .getElementById(id)
    .classList.add('active');
}

function updateSteps(n) {

  for (let i = 1; i <= 3; i++) {

    const s = document.getElementById('s' + i);

    s.className =
      'step' +
      (
        i === n
          ? ' active'
          : i < n
          ? ' done'
          : ''
      );
  }
}

/* Send Email */

async function goToStep2() {

  const email = document
    .getElementById('emailInput')
    .value
    .trim();

  if (!email) {

    return showToast(
      'أدخل البريد الإلكتروني',
      'error'
    );
  }

  try {

    const response = await fetch(
      'https://ataa-charity-platform.vercel.app/auth/forgetPassword',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({ email })
      }
    );

    const data = await response.json();

    console.log(data);

    if (response.ok) {

      localStorage.setItem(
        'resetEmail',
        email
      );

      setActivePanel('panel2');

      updateSteps(2);

      document.getElementById(
        'mainTitle'
      ).textContent =
        'أدخل كود التحقق';

      document.getElementById(
        'mainSub'
      ).textContent =
        'أرسلنا كود إلى ' + email;

      startTimer();

      showToast('تم إرسال الكود');

      otpInputs[0].focus();

    } else {

      showToast(
        data.message || 'فشل إرسال الكود',
        'error'
      );
    }

  } catch (error) {

    console.log(error);

    showToast(
      'خطأ في الاتصال بالسيرفر',
      'error'
    );
  }
}

/* Verify OTP */

function goToStep3() {

  const code =
    otpInputs.map(o => o.value).join('');

  if (code.length < 6) {

    return showToast(
      'أدخل كود التحقق كاملاً',
      'error'
    );
  }

  localStorage.setItem(
    'resetOTP',
    code
  );

  clearInterval(timer);

  setActivePanel('panel3');

  updateSteps(3);

  document.getElementById(
    'mainTitle'
  ).textContent =
    'كلمة مرور جديدة';

  document.getElementById(
    'mainSub'
  ).textContent =
    'اختر كلمة مرور قوية';
}

/* Password Strength */

function checkStrength(v) {

  const fill =
    document.getElementById('strengthFill');

  const label =
    document.getElementById('strengthLabel');

  let score = 0;

  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;

  const levels = [

    { pct: '0%', text: '' },

    { pct: '25%', text: 'ضعيفة 😟' },

    { pct: '50%', text: 'متوسطة 😐' },

    { pct: '75%', text: 'جيدة 👍' },

    { pct: '100%', text: 'قوية 💪' }
  ];

  const l = levels[score];

  fill.style.width = l.pct;

  label.textContent = l.text;
}

/* Reset Password */

async function finish() {

  const password =
    document.getElementById('pass1').value.trim();

  const confirmPassword =
    document.getElementById('pass2').value.trim();

  if (password.length < 8) {

    return showToast(
      'كلمة المرور لازم تكون 8 أحرف أو أكثر',
      'error'
    );
  }

  if (password !== confirmPassword) {

    return showToast(
      'كلمتا المرور غير متطابقتين',
      'error'
    );
  }

  const email =
    localStorage.getItem('resetEmail');

  const code =
    localStorage.getItem('resetOTP');

  try {

    const response = await fetch(
      'https://ataa-charity-platform.vercel.app/auth/resetPassword',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({

          email,
          code,
          password,
          confirmPassword

        })
      }
    );

    const data = await response.json();

    console.log(data);

    if (response.ok) {

      localStorage.removeItem('resetEmail');

      localStorage.removeItem('resetOTP');

      Swal.fire({
        icon: 'success',
        title: 'تم تغيير كلمة المرور',
        text: 'يمكنك تسجيل الدخول الآن'
      }).then(() => {

        window.location.href =
          'login-register.html?mode=login';
      });

    } else {

      showToast(
        data.message || 'فشل تغيير كلمة المرور',
        'error'
      );
    }

  } catch (error) {

    console.log(error);

    showToast(
      'خطأ في الاتصال بالسيرفر',
      'error'
    );
  }
}

/* Resend */

async function resendCode() {

  const email =
    localStorage.getItem('resetEmail');

  if (!email) return;

  try {

    await fetch(
      'https://ataa-charity-platform.vercel.app/auth/forgetPassword',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({ email })
      }
    );

    startTimer();

    showToast('تم إعادة إرسال الكود');

  } catch (error) {

    showToast(
      'فشل إعادة الإرسال',
      'error'
    );
  }
}