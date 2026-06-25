


// Navbar Toggle
// ==========================
const navHam =
    document.getElementById(
        'navHam'
    );

const mobileNav =
    document.getElementById(
        'mobileNav'
    );

if (navHam) {

    navHam.addEventListener(
        'click',
        () => {

            navHam.classList.toggle(
                'open'
            );

            mobileNav?.classList.toggle(
                'open'
            );
        }
    );
}

// ==========================
// Quantity Logic
// ==========================
function updateQty(change) {

    const input =
        document.getElementById(
            'quantity'
        );

    let val =
        parseInt(
            input.value
        ) || 1;

    val += change;

    if (val < 1) {
        val = 1;
    }

    input.value = val;
}

// ==========================
// Upload & Preview Images
// ==========================
const dropZone =
    document.getElementById(
        'dropZone'
    );

const fileInput =
    document.getElementById(
        'fileInput'
    );

const previewGallery =
    document.getElementById(
        'previewGallery'
    );

if (dropZone) {

    ['dragenter', 'dragover']
        .forEach(eventName => {

            dropZone.addEventListener(
                eventName,
                (e) => {

                    e.preventDefault();

                    dropZone.classList.add(
                        'dragover'
                    );
                }
            );
        });

    ['dragleave', 'drop']
        .forEach(eventName => {

            dropZone.addEventListener(
                eventName,
                (e) => {

                    e.preventDefault();

                    dropZone.classList.remove(
                        'dragover'
                    );
                }
            );
        });

    dropZone.addEventListener(
        'drop',
        (e) => {

            const files =
                e.dataTransfer.files;

            fileInput.files =
                files;

            handleFiles();
        }
    );
}

if (fileInput) {

    fileInput.addEventListener(
        'change',
        handleFiles
    );
}

function handleFiles() {

    if (!previewGallery)
        return;

    previewGallery.innerHTML =
        '';

    const files =
        fileInput.files;

    Array.from(files)
        .forEach(file => {

            if (
                !file.type.startsWith(
                    'image/'
                )
            ) return;

            const reader =
                new FileReader();

            reader.onload =
                (e) => {

                    const img =
                        document.createElement(
                            'img'
                        );

                    img.src =
                        e.target.result;

                    img.classList.add(
                        'preview-img'
                    );

                    previewGallery.appendChild(
                        img
                    );
                };

            reader.readAsDataURL(
                file
            );
        });
}

// ==========================
// Submit Donation Form
// ==========================
const donationForm =
    document.getElementById(
        'donationForm'
    );

if (donationForm) {

    donationForm.addEventListener(
        'submit',
        async function (e) {

            e.preventDefault();

            const submitBtn =
                document.querySelector(
                    '.btn-submit'
                );

            try {

                submitBtn.disabled =
                    true;

                submitBtn.innerText =
                    'جاري الإرسال...';

                // ==========================
                // Token + User
                // ==========================
                const token =
                    localStorage.getItem(
                        'token'
                    );

                const user =
                    JSON.parse(
                        localStorage.getItem(
                            'user'
                        )
                    );

                console.log(
                    'TOKEN:',
                    token
                );

                console.log(
                    'USER:',
                    user
                );

                if (!token) {

                    alert(
                        'يجب تسجيل الدخول أولاً'
                    );

                    window.location.href =
                        'login-register.html?mode=login';

                    return;
                }

                // ==========================
                // Only donor(user)
                // ==========================
                if (
                    user?.roleType !==
                    'user'
                ) {

                    alert(
                        'فقط المتبرعين يمكنهم إضافة تبرع'
                    );

                    return;
                }

                // ==========================
                // Form Values
                // ==========================
                const category =
                    document.getElementById(
                        'category'
                    ).value;

                const size =
                    document.getElementById(
                        'size'
                    ).value;

                const quantity =
                    document.getElementById(
                        'quantity'
                    ).value;

                const description =
                    document.getElementById(
                        'notes'
                    ).value.trim();

                const condition =
                    document.querySelector(
                        'input[name="condition"]:checked'
                    )?.value;

                // ==========================
                // Type Mapping
                // ==========================
                let donationType =
                    '';

                if (
                    category ===
                    'man'
                ) {

                    donationType =
                        'رجالي';
                }

                if (
                    category ===
                    'woman'
                ) {

                    donationType =
                        'حريمي';
                }

                if (
                    category ===
                    'child'
                ) {

                    donationType =
                        'أطفال';
                }

                // ==========================
                // Validate image
                // ==========================
                const files =
                    fileInput.files;

                if (
                    !files.length
                ) {

                    alert(
                        'يجب رفع صورة واحدة على الأقل'
                    );

                    return;
                }

                // ==========================
                // FormData
                // ==========================
                const formData =
                    new FormData();

                formData.append(
                    'type',
                    donationType
                );

                formData.append(
                    'size',
                    size
                );

                formData.append(
                    'quantity',
                    quantity
                );

                formData.append(
                    'description',
                    description ||
                    'تبرع ملابس'
                );

                formData.append(
                    'condition',
                    condition
                );

                // ==========================
                // Images
                // ==========================
                Array.from(files)
                    .forEach(file => {

                        formData.append(
                            'images',
                            file
                        );
                    });

                console.log(
                    'Donation Data:',
                    {
                        donationType,
                        size,
                        quantity,
                        condition,
                        description
                    }
                );

                // ==========================
                // API Request
                // ==========================
                const response =
                    await fetch(
                        'https://ataa-charity-platform.vercel.app/donor',
                        {
                            method:
                                'POST',

                            headers: {
                                authorization:
                                    token
                            },

                            body:
                                formData
                        }
                    );

                const result =
                    await response.json();

                console.log(
                    'STATUS:',
                    response.status
                );

                console.log(
                    'RESULT:',
                    result
                );

                // ==========================
                // Success
                // ==========================
                if (
                    response.ok
                ) {

                    alert(
                        'تم إرسال التبرع بنجاح 🎉'
                    );

                    window.location.href =
                        'donor-dashboard.html';

                    return;
                }

                // ==========================
                // Error
                // ==========================
                alert(
                    result.message ||
                    result.details?.join(
                        '\n'
                    ) ||
                    'فشل إرسال التبرع'
                );

            } catch (error) {

                console.error(
                    'ERROR:',
                    error
                );

                alert(
                    'حدث خطأ أثناء إرسال التبرع'
                );

            } finally {

                submitBtn.disabled =
                    false;

                submitBtn.innerText =
                    'تقديم التبرع';
            }
        }
    );
}