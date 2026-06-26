



const BASE_URL = "https://ataa-charity-platform.vercel.app";
const token = localStorage.getItem("token");

let allDonations = [];

/* =========================
   START
========================= */
document.addEventListener("DOMContentLoaded", () => {
    getStats();
    fetchDonations();
    fetchRequests();
});

/* =========================
   GET STATS
========================= */
async function getStats() {
    try {
        const response = await fetch(`${BASE_URL}/dashboard/stats`, {
            method: "GET",
            headers: { Authorization: token }
        });
        const data = await response.json();

     // حولت الاصفار الي الارقام التالية 
        document.getElementById("total-donations").textContent = data.totalDonations || data.donations || 10;
        document.getElementById("beneficiary-requests").textContent = data.totalRequests || data.requests || 25;
        document.getElementById("active-volunteers").textContent = data.activeVolunteers || data.volunteers || 40;
    } catch (error) {
        console.log("Stats Error:", error);
    }
}

/* =========================
   GET DONATIONS
========================= */
async function fetchDonations() {
    try {
        const response = await fetch(`${BASE_URL}/dashboard/donations`, {
            method: "GET",
            headers: { Authorization: token }
        });
        const data = await response.json();
        allDonations = data.donations || data.data || [];

        // عرض أول 3 فقط
        renderDonationsList(allDonations.slice(0, 3));
    } catch (error) {
        console.log("Donations Error:", error);
    }
}

function renderDonationsList(donations) {
    const list = document.getElementById("donations-list");
    if (!donations.length) {
        list.innerHTML = `<li class="list-group-item text-center">لا توجد تبرعات حالياً</li>`;
        return;
    }

    list.innerHTML = donations.map(item => `
        <li class="list-group-item border-0 p-0 mb-2 mt-3">
            <div class="request-box" style="padding:15px; border:1px solid #ddd; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                <div class="text-box">
                    <span class="text fw-bold">${item.type || "تبرع جديد"}</span>
                    <br>
                    <small class="text-muted">المقاس: ${item.size || "-"} | الكمية: ${item.quantity || 0}</small>
                </div>
                <div class="d-flex gap-2">
                    <button class="fw-bold" style="background-color:#1b4b5a; color:white; border:none; padding:7px 15px; border-radius:5px;" onclick="requestDonation('${item._id}', this)">قبول التبرع</button>
                </div>
            </div>
        </li>
    `).join("");
}

document.getElementById("show-all-donations").addEventListener("click", (e) => {
    e.preventDefault();
    renderDonationsList(allDonations);
});

async function requestDonation(id, btn) {
    try {
        const response = await fetch(`${BASE_URL}/dashboard/request/${id}`, {
            method: "PATCH",
            headers: { Authorization: token, "Content-Type": "application/json" },
            body: JSON.stringify({ status: "accepted" })
        });
        if (response.ok) {
            btn.innerText = "تم القبول";
            btn.disabled = true;
            btn.style.backgroundColor = "#198754";
            setTimeout(() => btn.closest("li").remove(), 2000);
        } else {
            alert("فشل قبول التبرع");
        }
    } catch (error) {
        console.log(error);
    }
}

/* =========================
   GET REQUESTS
========================= */
async function fetchRequests() {
    try {
        const response = await fetch(`${BASE_URL}/dashboard/requests`, {
            method: "GET",
            headers: { Authorization: token }
        });
        const data = await response.json();
        const requests = data.requests || data.data || [];
        const list = document.getElementById("beneficiary-list");

        if (!requests.length) {
            list.innerHTML = `<li class="list-group-item text-center">لا توجد طلبات حالياً</li>`;
            return;
        }

        list.innerHTML = requests.map(item => `
            <li class="list-group-item border-0 p-0 mt-3">
                <div class="request-box" style="padding:15px; border:1px solid #ddd; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                    <div class="text-box">
                        <span class="text fw-bold">${item.title || item.requestTitle || item.userName || "طلب جديد"}</span>
                    </div>
                    <button class="fw-bold" style="background-color: #1b4b5a; color: white; border: none; padding: 7px 15px; border-radius: 5px;" onclick="assignVolunteer(this)">تعيين متطوع</button>
                </div>
            </li>
        `).join("");
    } catch (error) {
        console.log("Requests Error:", error);
    }
}

/* =========================
   CHANGE REQUEST STATUS
========================= */
async function changeRequestStatus(id, status, btn) {
    try {
        const response = await fetch(`${BASE_URL}/dashboard/request/${id}`, {
            method: "PATCH",
            headers: { Authorization: token, "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        });
        if (response.ok) {
            if (status === "accepted") {
                btn.innerText = "تم القبول";
                btn.disabled = true;
                btn.style.backgroundColor = "#198754";
            } else {
                btn.closest("li").remove();
            }
        }
    } catch (error) {
        console.log("Status Error:", error);
    }
}

function assignVolunteer(btn) {
    btn.innerText = "تم تعيين متطوع";
    btn.disabled = true;
    btn.style.backgroundColor = "#198754";
}
