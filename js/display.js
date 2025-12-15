
const SUPABASE_URL = "https://lrkaigodgewdhncqdzpz.supabase.co";
const SUPABASE_KEY = "sb_publishable_sKcAGI3Y4nuRRoazBdGQcw_lJZILGpg";
let cachedData = [];



async function loadTable() {
    const tableBody = document.querySelector("#regTable tbody");
    tableBody.innerHTML = "<tr><td colspan='5'>กำลังโหลดข้อมูล...</td></tr>";

    let res, data;

    try {
        res = await fetch(
            `${SUPABASE_URL}/rest/v1/artistry_reg?select=*`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        data = await res.json();
    } catch (e) {
        console.error("Fetch/JSON Error:", e);
        tableBody.innerHTML = "<tr><td colspan='5'>เกิดข้อผิดพลาดในการโหลดข้อมูล</td></tr>";
        return;
    }

    if (!Array.isArray(data)) {
        console.error("Supabase Error:", data);
        tableBody.innerHTML = "<tr><td colspan='5'>โหลดข้อมูลไม่สำเร็จ</td></tr>";
        return;
    }

    if (data.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='5'>ยังไม่มีข้อมูลลงทะเบียน</td></tr>";
        return;
    }

    // ---------------------------------------------------------
    // ⭐ CUSTOM SORT ให้อยู่ตามที่ต้องการ
    //    1) line_name ASC
    //    2) "จ่ายแล้ว" อยู่ด้านบน
    // ---------------------------------------------------------

    data.sort((a, b) => {

        // 1) sort ตาม line_name ก่อน
        const lineCompare = a.line_name.localeCompare(b.line_name);
        if (lineCompare !== 0) return lineCompare;

        // 2) sort ตาม status — จ่ายแล้ว อยู่บน
        const orderStatus = (a.status === "จ่ายแล้ว" ? 0 : 1) - (b.status === "จ่ายแล้ว" ? 0 : 1);
        if (orderStatus !== 0) return orderStatus;

        // 3) ไม่ sort fullname — คืนค่า 0
        return 0; 
    });
    cachedData = data;
    tableBody.innerHTML = "";

    data.forEach(row => {
        const statusClass = row.status === "จ่ายแล้ว" ? "status-paid" : "status-unpaid";
        const statusHTML = `<span class="${statusClass}">${row.status}</span>`;
        const slipHTML = renderSlipCell(row.slip);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.fullname}</td>
            <td>${row.nickname}</td>
            <td>${row.line_name}</td>
            <td>${statusHTML}</td>
            <td>${slipHTML}</td>
        `;

        tableBody.appendChild(tr);
    });

}


// ---------------------------------------------------------
// RENDER SLIP ICON
// ---------------------------------------------------------

function renderSlipCell(slipData) {
    if (!slipData || slipData === "null" || slipData === "-") {
        return "-";
    }

    if (slipData.startsWith("http")) {
        return `
            <a href="${slipData}" target="_blank">
                <img class="icon" src="https://cdn-icons-png.flaticon.com/512/1827/1827951.png">
            </a>
        `;
    }

    if (slipData.startsWith("data:image")) {
        const safeBase64 = slipData.replace(/'/g, "\\'");
        return `
            <img class="icon"
                 src="https://cdn-icons-png.flaticon.com/512/1827/1827951.png"
                 onclick="showSlipModal('${safeBase64}')">
        `;
    }

    return "-";
}


// ---------------------------------------------------------
// MODAL
// ---------------------------------------------------------

function showSlipModal(base64) {
    document.getElementById("slipImage").src = base64;
    document.getElementById("slipModal").style.display = "flex";
}

function closeSlipModal() {
    document.getElementById("slipModal").style.display = "none";
}


function showSummary() {

    if (!cachedData || cachedData.length === 0) {
        alert("ยังไม่มีข้อมูล กรุณาโหลดตารางก่อน");
        return;
    }

    const total = cachedData.length;
    const paid = cachedData.filter(d => d.status === "จ่ายแล้ว");

    const groupCount = {};
    paid.forEach(p => {
        const key = p.line_name || "ไม่ระบุ";
        groupCount[key] = (groupCount[key] || 0) + 1;
    });

    let html = `
        <h3>📊 สรุปการลงทะเบียน</h3>
        <p>👥 ผู้ลงทะเบียนทั้งหมด: <b>${total}</b> คน</p>
        <p>💰 ชำระเงินแล้ว: <b>${paid.length}</b> คน</p>
        <hr>
        <b>แยกตามสายงาน (จ่ายแล้ว)</b>
        <ul>
    `;

    for (const g in groupCount) {
        html += `<li>${g} : ${groupCount[g]} คน</li>`;
    }

    html += "</ul>";

    document.getElementById("summaryBox").innerHTML = html;
}



loadTable();


