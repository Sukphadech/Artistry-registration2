(function ($) {
    'use strict';
    /*==================================================================
        [ Daterangepicker ]*/
    try {
        $('.js-datepicker').daterangepicker({
            "singleDatePicker": true,
            "showDropdowns": true,
            "autoUpdateInput": false,
            locale: {
                format: 'DD/MM/YYYY'
            },
        });
    
        var myCalendar = $('.js-datepicker');
        var isClick = 0;
    
        $(window).on('click',function(){
            isClick = 0;
        });
    
    
        $('.js-btn-calendar').on('click',function(e){
            e.stopPropagation();
    
            if(isClick === 1) isClick = 0;
            else if(isClick === 0) isClick = 1;
    
            if (isClick === 1) {
                myCalendar.focus();
            }
        });
    
        $(myCalendar).on('click',function(e){
            e.stopPropagation();
            isClick = 1;
        });
    
        $('.daterangepicker').on('click',function(e){
            e.stopPropagation();
        });
    
    
    } catch(er) {console.log(er);}
    /*[ Select 2 Config ]
        ===========================================================*/
    
    try {
        var selectSimple = $('.js-select-simple');
    
        selectSimple.each(function () {
            var that = $(this);
            var selectBox = that.find('select');
            var selectDropdown = that.find('.select-dropdown');
            selectBox.select2({
                dropdownParent: selectDropdown
            });
        });
    
    } catch (err) {
        console.log(err);
    }
    

})(jQuery);

window.onload = function() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth" 
    });
  };


const needPayment = document.getElementById('paid_now');
const needPayLater= document.getElementById('paid_later');
const registerForm = document.getElementById('registerForm');
const registerSubmit = document.getElementById('registerSubmit');
const alreadyRegistered = document.getElementById("alreadyRegistered");
const btn_edit = document.getElementById("btn_edit");
const userList = document.getElementById("userList");
const concludeBox = document.getElementById("conclude");
const ticketSelect = document.getElementById("ticketType");
const copyBtn = document.getElementById("copyBtn");
const btn_registerSubmit = document.getElementById("btn_registerSubmit");
const btn_paid = document.getElementById("btn_paid");
const inf_error = document.getElementById("inf_error");
const accountNumber = document.getElementById("accountNumber").textContent;
const fileInput = document.getElementById("paymentSlip");

let data = [];
let selectedUser = null;

window.addEventListener("DOMContentLoaded", function () {
  const paymentForm = document.getElementById("paymentForm");
  const allPayFields = paymentForm.querySelectorAll("input, select, textarea, button");
  allPayFields.forEach(el => {
      if (el.id !== "copyBtn") {
        el.disabled = true;
      }
    });
  paymentForm.style.opacity = "0.6";
  paymentForm.style.pointerEvents = "none";

  btn_registerSubmit.disabled = true;
  btn_registerSubmit.style.opacity = "0.2";

  btn_paid.disabled = true;
  btn_paid.style.opacity = "0.2";
  btn_paid.style.pointerEvents = "none";

  needPayment.disabled = true;
  needPayment.style.opacity = "0.2";
  needPayLater.disabled = true;
  needPayLater.style.opacity = "0.2";

  function checkFormComplete() {
    const fullname = document.getElementById('fullname');
    const nickname = document.getElementById('nickname');
    const line = document.getElementById('line');
    const ticketType = document.getElementById('ticketType');
    const inf_error = document.getElementById('inf_error');

    const isFullname = fullname.value.trim() !== "";
    const isNickname = nickname.value.trim() !== "";
    const isLine = line.value.trim() !== "สายงาน";   
    const isTicket = ticketType.value.trim() !== "เลือกประเภทบัตร";
    

    if (isFullname && isNickname && isLine && isTicket) {
      inf_error.textContent = "";
      needPayment.disabled = false;
      needPayment.style.opacity = "1";
      needPayLater.disabled = false;
      needPayLater.style.opacity = "1";

    } else {
      inf_error.textContent = "กรุณากรอกข้อมูลให้ครบถ้วน";
      inf_error.style.color = "red";
      needPayment.disabled = true;
      needPayment.style.opacity = "0.2";
      needPayLater.disabled = true;
      needPayLater.style.opacity = "0.2";

    }
  }

  document.getElementById("fullname").addEventListener("input", checkFormComplete);
  document.getElementById("nickname").addEventListener("input", checkFormComplete);
  document.getElementById("line").addEventListener("change", () => setTimeout(checkFormComplete, 100));
  document.getElementById("ticketType").addEventListener("change", () => setTimeout(checkFormComplete, 100));
  checkFormComplete();
});


function enablePaymentForm() {
  const paymentForm = document.getElementById("paymentForm");
  const allPayFields = paymentForm.querySelectorAll("input, select, textarea, button");
  allPayFields.forEach(el => el.disabled = false);
  paymentForm.style.opacity = "1";
  paymentForm.style.pointerEvents = "auto";
}



btn_edit.addEventListener('click', function () {
   const allFields = registerForm.querySelectorAll("input, select, textarea, button");
    allFields.forEach(el => el.disabled = false);
    registerForm.style.opacity = "1";
    registerForm.style.pointerEvents = "auto";
    needPayment.checked = false;
    alreadyRegistered.checked = false;
    registerForm.scrollIntoView({ behavior: "smooth", block: "start" });

    const paymentForm = document.getElementById("paymentForm");
    const allPayFields = paymentForm.querySelectorAll("input, select, textarea, button");
    allPayFields.forEach(el => {
      if (el.id !== "copyBtn") {
        el.disabled = true;
      }
    });
    paymentForm.style.opacity = "0.6";
    paymentForm.style.pointerEvents = "none";
});



copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(accountNumber)
      .then(() => {
        copyBtn.textContent = "คัดลอกแล้ว";
        copyBtn.style.backgroundColor = "#198754";
        setTimeout(() => {
          copyBtn.textContent = "คัดลอก";
          copyBtn.style.backgroundColor = "#28a745";
        }, 2000);
      })
      .catch(err => {
        alert("เกิดข้อผิดพลาดในการคัดลอก: " + err);
      });
  });



alreadyRegistered.addEventListener('change', async function () {
  if (this.checked) {
        const allFields = registerForm.querySelectorAll("input, select, textarea, button");
        allFields.forEach(el => {
        if (el) { 
          el.disabled = true;
        }});
        registerForm.style.opacity = "0.6"; 
        registerForm.style.pointerEvents = "none"; 
        registerForm.style.userSelect = "none";
        paymentForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  btn_paid.disabled = true;
  btn_paid.style.opacity = "0.2";
  btn_paid.style.pointerEvents = "none";
  enablePaymentForm();
  const userList = document.getElementById("userList");
  const sheetUrl = "https://corsproxy.io/?" + encodeURIComponent("https://script.google.com/macros/s/AKfycbz04POC0bDuB1OkCxT6rqJp1HVD6thvinQTwtCdlWJ-D4HCeKh_SmUy5CIO2jMtW146qA/exec");
  try {
  // ✅ ถ้ามีข้อมูลอยู่แล้ว ไม่ต้องโหลดใหม่
  if (data && data.length > 0) {
    console.log("📦 ข้ามการโหลด — ใช้ข้อมูลเดิมจาก cache:", data.length, "รายการ");
  } else {
    // โหลดครั้งแรกเท่านั้น
    userList.innerHTML = '<option disabled selected>กำลังโหลดรายชื่อ....</option>';
    const response = await fetch(sheetUrl);
    data = await response.json();
    console.log("✅ โหลดรายชื่อสำเร็จ:", data.length, "รายการ");
  }

  // ✅ ไม่ว่าจะโหลดใหม่หรือใช้ cache — ก็สร้าง dropdown ทุกครั้ง
  userList.innerHTML = '<option disabled selected>เลือกรายชื่อ</option>';
  data.forEach(user => {
    const option = document.createElement("option");
    option.value = `${user.nickname}-${user.line}`;
    option.textContent = `${user.nickname}-${user.line}`;
    option.id = `${user.nickname}-${user.line}`;
    userList.appendChild(option);
  });

} catch (error) {
  console.error("❌ โหลดรายชื่อไม่สำเร็จ:", error);
}
  
});


$('#userList').on('select2:select', function (e) {
  const selectedValue = e.params.data.id || e.params.data.text;
  console.log("🟢 เลือก:", selectedValue);
  const [nickname, line] = selectedValue.includes('-')
    ? selectedValue.split('-')
    : [selectedValue, ''];
  const user = data.find(u => u.nickname === nickname && u.line === line);

  console.log("🧩 user ที่พบ:", user);
  if (user) {
    selectedUser = user;
    checkPaidButtonStatus();
    let price = 0;
    if (user.ticket.includes("Early Bird")) price = 1100;
    else if (user.ticket.includes("1 วัน")) price = 800;
    setTimeout(() => {
    if (concludeBox) {
      concludeBox.style.display = "block";
      concludeBox.querySelector("p").innerHTML = `
        โปรดโอนจากบัญชีชื่อ: <strong>${user.fullname}</strong><br>
        ประเภทบัตร: <strong>${user.ticket}</strong><br>
        ยอดชำระ: <strong>${price} บาท</strong>
      `;
    } else {
      console.warn("⚠️ ไม่พบ concludeBox ใน DOM ตอนนี้");
    }
  }, 100);
  } else {
    console.warn("❌ ไม่พบผู้ใช้ใน data:", selectedValue);
  }
});




needPayLater.addEventListener('change', function () {
  if (this.checked) {
    btn_registerSubmit.disabled = false;
    btn_registerSubmit.style.opacity = "1";
    needPayment.disabled = true;
    needPayment.style.opacity = "0.2";


  } else {
    btn_registerSubmit.disabled = true;
    btn_registerSubmit.style.opacity = "0.2";
    needPayment.disabled = false;
    needPayment.style.opacity = "1";
  }
});



needPayment.addEventListener('change', function () {
    if (this.checked) {

      const allFields = registerForm.querySelectorAll("input, select, textarea, button");
      allFields.forEach(el => {
        if (el) { 
          el.disabled = true;
        }});
        registerForm.style.opacity = "0.6"; 
        registerForm.style.pointerEvents = "none"; 
        registerForm.style.userSelect = "none";

        btn_paid.disabled = true;
        btn_paid.style.opacity = "0.2";
        btn_paid.style.pointerEvents = "none";

      paymentForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      enablePaymentForm();

      const nickname = document.getElementById("nickname").value.trim();
      const fullname = document.getElementById("fullname").value.trim();
      const lineSelect = document.getElementById("line");
      const line = lineSelect.options[lineSelect.selectedIndex].text;
      
      const newOption = document.createElement("option");
      newOption.textContent = `${nickname}-${line}`;
      newOption.selected = true; 
      userList.appendChild(newOption);
      userList.disabled = true;


    const ticketType = ticketSelect.value;  
    let price = 0;
    switch (ticketType) {
    case "Early Bird":
        price = 1100;
        break;
    case "บัตรวันเสาร์ 1 วัน":
        price = 800;
        break;
    case "บัตรวันอาทิตย์ 1 วัน":
        price = 800;
        break;
    }
      concludeBox.style.display = "block";
      concludeBox.querySelector("p").innerHTML = `
        โปรดโอนจากบัญชีชื่อ: <strong>${fullname}</strong><br>
        ประเภทบัตร: <strong>${ticketType}</strong> <br>
        ยอดชำระ: <strong>${price} บาท</strong>
      `;
    }
    else {
      alreadyRegistered.disabled = false;
      alreadyRegistered.style.opacity = "1";
    }
  });


// ===========บันทึกข้อมูล===============

document.getElementById("btn_registerSubmit").addEventListener("click", async function (e) {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const nickname = document.getElementById("nickname").value.trim();
  const line = document.getElementById("line").value.trim();
  const ticketType = document.getElementById("ticketType").value.trim();

  if (!fullname || !nickname || !line || !ticketType) {
    alert("กรุณากรอกข้อมูลให้ครบก่อนลงทะเบียนค่ะ");
    return;
  }

  const payload = {
    fullname: fullname,
    nickname: nickname,
    line: line,
    ticket: ticketType,
  };

  console.log("ส่งข้อมูล:", payload);

  const sheetUrl = "https://corsproxy.io/?" + encodeURIComponent("https://script.google.com/macros/s/AKfycbxZ1n3WuykE5CKr56T9nxKxD56vvWBNN7e6zSKKzFjOD18Z1kFB2tPwxZTEHig_yFQKfw/exec");

  try {
    
    const response = await fetch(sheetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log("ผลลัพธ์จาก Script:", result);

  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาด:", error);
    alert("เกิดข้อผิดพลาดระหว่างส่งข้อมูล");
  }
});



fileInput.addEventListener("change", function () {
      checkPaidButtonStatus(); 
    });


function checkPaidButtonStatus() {
      const hasUser = selectedUser !== null;
      const hasFile = fileInput.files.length > 0;
      if (hasUser && hasFile) {
        btn_paid.disabled = false;
        btn_paid.style.opacity = "1";
        btn_paid.style.pointerEvents = "auto";
        console.log("✅ เปิดปุ่มชำระเงินแล้ว");
      } else {
        btn_paid.disabled = true;
        btn_paid.style.opacity = "0.2";
        btn_paid.style.pointerEvents = "none";
        console.log("⛔ ปิดปุ่มชำระเงิน (ยังไม่ครบเงื่อนไข)");
      }
    }


btn_paid.addEventListener("click", async () => {
  const fileInput = document.getElementById("paymentSlip");
  const file = fileInput.files[0];

  if (!selectedUser) {
    alert("กรุณาเลือกรายชื่อก่อนค่ะ");
    return;
  }

  if (!file) {
    alert("กรุณาแนบสลิปก่อนส่งค่ะ");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async function () {
    // ✅ เมื่อโหลดภาพเสร็จแล้ว
    const img = new Image();
    img.src = reader.result;

    img.onload = async function () {
      // 🎨 สร้าง canvas เพื่อย่อรูป
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const maxW = 800; // ความกว้างสูงสุด
      const scale = maxW / img.width;
      canvas.width = maxW;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 🧩 แปลง canvas -> base64 (JPG)
      const slipBase64 = canvas.toDataURL("image/jpeg", 0.8); // บีบอัด 80%

      // 📦 เตรียมข้อมูลส่ง
      const payload = {
        nickname: selectedUser.nickname,
        line: selectedUser.line,
        slip: slipBase64
      };

      // 🌐 URL ของ Google Apps Script
      const scriptUrl = "https://corsproxy.io/?" + encodeURIComponent("https://script.google.com/macros/s/AKfycbwtHkVSkFff1aYurso1-vULVl_zOiwlw1rjttppsv5pHEXzrlDR0qyRYWOGmprURMLOuQ/exec");

      try {
        console.log("📤 กำลังส่งข้อมูล:", payload);
        const response = await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });


        
      } catch (err) {
        console.error("เกิดข้อผิดพลาด:", err);
        alert("⚠️ เกิดข้อผิดพลาดในการอัปโหลด");
      }
    };
  };

  // 🔹 เริ่มอ่านไฟล์
  reader.readAsDataURL(file);
});
