

console.log("DONOR FILE LOADED");

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const token =
            localStorage.getItem(
                "token"
            );

        // ==========================
        // CHECK LOGIN
        // ==========================
        if (!token) {

            alert(
                "يجب تسجيل الدخول أولاً"
            );

            window.location.href =
                "login-register.html?mode=login";

            return;
        }

        let donations = [];

        try {

            const response =
                await fetch(
                    "https://ataa-charity-platform.vercel.app/donor",
                    {
                        method: "GET",

                        headers: {
                            authorization:
                                token
                        }
                    }
                );

            const result =
                await response.json();

            console.log(
                "FULL DATA:",
                result
            );

            // ==========================
            // HANDLE INVALID TOKEN
            // ==========================
            if (
                response.status === 401
            ) {

                alert(
                    "انتهت صلاحية تسجيل الدخول"
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

            // ==========================
            // GET DONATIONS
            // ==========================
            if (
                result.success
            ) {

                donations =
                    result.Data || [];

            } else {

                donations = [];
            }

        } catch (error) {

            console.error(
                "Fetch Error:",
                error
            );

            donations = [];
        }

        console.log(
            "DONATIONS:",
            donations
        );

        // ==========================
        // RENDER DATA
        // ==========================
        renderTable(
            donations
        );
updateTrustBar();
renderSizes();
renderChart();
});

// ==========================
// TABLE
// ==========================
function renderTable(
    donations
) {

    const tableBody =
        document.getElementById(
            "userdonationsTable"
        );

    if (!tableBody)
        return;

    tableBody.innerHTML =
        "";

    if (
        !donations.length
    ) {

        tableBody.innerHTML =
            `
            <tr>
                <td colspan="5" class="text-center">
                    لا توجد تبرعات حتى الآن
                </td>
            </tr>
        `;

        return;
    }

    donations.forEach(
        item => {

            const row =
                document.createElement(
                    "tr"
                );

            const date =
                item.createdAt
                    ? new Date(
                        item.createdAt
                    ).toLocaleDateString(
                        "ar-EG"
                    )
                    : "-";

            row.innerHTML =
                `
                <td>${date}</td>

                <td>
                    <span class="badge ${getStatusClass(item.status)}">
                        ${translateStatus(item.status)}
                    </span>
                </td>

                <td>
                    ${item.quantity || "-"}
                </td>

                <td>
                    ${item.size || "-"}
                </td>

                <td>
                    ${item.type || "-"}
                </td>
            `;

            tableBody.appendChild(
                row
            );
        }
    );
}


// ==========================
// STATUS TEXT
// ==========================
function translateStatus(
    status
) {

    switch (status) {

        case "pending":
            return "قيد الانتظار";

        case "accepted":
            return "مقبول";

        case "rejected":
            return "مرفوض";

        default:
            return "قيد الانتظار";
    }
}


// ==========================
// STATUS COLOR
// ==========================
function getStatusClass(
    status
) {

    switch (status) {

        case "accepted":
            return "bg-success";

        case "rejected":
            return "bg-danger";

        case "pending":
            return "bg-warning text-dark";

        default:
            return "bg-secondary";
    }
}


// ==========================
// TRUST BAR
// ==========================
function updateTrustBar() {

    const trustBar =
        document.getElementById(
            "trustBar"
        );

    if (!trustBar)
        return;

    trustBar.style.width =
        "82%";

    trustBar.innerText =
        "82%";
}


// ==========================
// SIZES
// ==========================
function renderSizes() {

    const sizesBox =
        document.getElementById(
            "sizesBox"
        );

    if (!sizesBox)
        return;

    sizesBox.innerHTML = `

        <span class="badge bg-light text-dark border p-2 m-1">
            أطفال (10 سنوات) (%60)
        </span>

        <span class="badge bg-light text-dark border p-2 m-1">
            أطفال (5 سنوات) (%55)
        </span>

        <span class="badge bg-light text-dark border p-2 m-1">
            أطفال سنين (%50)
        </span>

        <span class="badge bg-light text-dark border p-2 m-1">
            XXL (%15)
        </span>

        <span class="badge bg-light text-dark border p-2 m-1">
            XL (%20)
        </span>

        <span class="badge bg-light text-dark border p-2 m-1">
            L (%35)
        </span>

        <span class="badge bg-light text-dark border p-2 m-1">
            M (%40)
        </span>

        <span class="badge bg-light text-dark border p-2 m-1">
            S (%55)
        </span>

    `;
}


// ==========================
// CHART
// ==========================
function renderChart() {

    const canvas =
        document.getElementById(
            "donationChart"
        );

    if (!canvas)
        return;

    const ctx =
        canvas.getContext("2d");

    if (window.donationChartInstance) {
        window.donationChartInstance.destroy();
    }

    window.donationChartInstance =
        new Chart(ctx, {

            type: "bar",

            data: {

                labels: [
                    "أطفال",
                    "حريمي",
                    "رجالي"
                ],

                datasets: [
                    {
                        data: [
                            15,
                            45,
                            60
                        ],

                        backgroundColor: [
                            "#dc3545",
                            "#ffc107",
                            "#28a745"
                        ],

                        borderWidth: 0
                    }
                ]
            },

            options: {

                responsive: true,

                animation: false,

                events: [],

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {
                        enabled: false
                    }
                },

                hover: {
                    mode: null
                },

                scales: {

                    y: {
                        beginAtZero: true,
                        max: 60,
                        ticks: {
                            stepSize: 10
                        }
                    }
                }
            }
        });
}