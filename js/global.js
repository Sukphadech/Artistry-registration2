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

var swiper = new Swiper(".mySwiper", {
    loop: true,
    pagination: {
      el: ".swiper-pagination",
    },
  });



const needPayment = document.getElementById('paid_now');
const needPayLater= document.getElementById('paid_later');
const registerForm = document.getElementById('registerForm');
const registerSubmit = document.getElementById('registerSubmit');
const NotRegister = document.getElementById("NotRegister")
const alreadyRegistered = document.getElementById("alreadyRegistered");
const btn_edit = document.getElementById("btn_edit");
const userList = document.getElementById("userList");
const concludeBox = document.getElementById("conclude");
const copyBtn = document.getElementById("copyBtn");
const btn_registerSubmit = document.getElementById("btn_registerSubmit");
const btn_paid = document.getElementById("btn_paid");
const inf_error = document.getElementById("inf_error");
const accountNumber = document.getElementById("accountNumber").textContent;
const fileInput = document.getElementById("paymentSlip");

let data = [];
let selectedUser = null;




window.onload = async function() {
  window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth" 
  });
    const userList = document.getElementById("userList");
    const sheetUrl = "https://corsproxy.io/?" + encodeURIComponent("https://script.google.com/macros/s/AKfycbxsM-H2SgH-QQMPttFoEDr86QaLHWPiQQkgwWJpWzTeSwl7_0Ply3jymyP9G4R79ZO2/exec");
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
    // ➕ เพิ่มตัวเลือกพิเศษ
    const notFoundOption = document.createElement("option");
    notFoundOption.value = "NOT_FOUND";
    notFoundOption.textContent = "❌ ไม่พบรายชื่อของฉัน";
    userList.appendChild(notFoundOption);

    // อัปเดต select2
    $("#userList").trigger("change.select2");

  } catch (error) {
    console.error("❌ โหลดรายชื่อไม่สำเร็จ:", error);
  }
};

//---------------------------
//Function WhenStart Hidden 
//---------------------------
window.addEventListener("DOMContentLoaded", function () {
  const paymentForm = document.getElementById("paymentForm");
  const fullname = document.getElementById('fullname');
  const nickname = document.getElementById('nickname');
  const line = document.getElementById('line');
  
  fullname.readOnly = true;
  fullname.style.opacity = "0.4";
  nickname.readOnly = true;
  nickname.style.opacity = "0.4";
  $("#line").next(".select2-container").css("pointer-events", "none");
  $("#line").next(".select2-container").css("opacity", "0.4");
  
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

  const allPayFields = paymentForm.querySelectorAll("input, select, textarea, button");
  allPayFields.forEach(el => {
      if (el.id !== "copyBtn") {
        el.disabled = true;
      }
    });

//Function WhenStart CheckFullInput
function checkFormComplete() {
    const fullname = document.getElementById('fullname');
    const nickname = document.getElementById('nickname');
    const line = document.getElementById('line');
    const inf_error = document.getElementById('inf_error');

    const isFullname = fullname.value.trim() !== "";
    const isNickname = nickname.value.trim() !== "";
    const isLine = line.value.trim() !== "สายงาน";   
    
    
    if (isFullname && isNickname && isLine ) {
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
      needPayLater.style.opacity = "0.2";}
    }
  $('#line').on('change', checkLineAndTicket);
  document.getElementById("fullname").addEventListener("input", checkFormComplete);
  document.getElementById("nickname").addEventListener("input", checkFormComplete);
  document.getElementById("line").addEventListener("change", () => setTimeout(checkFormComplete, 100));
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
    NotRegister.style.opacity = "1";
    registerForm.scrollIntoView({ behavior: "smooth", block: "start" });


    const paymentForm = document.getElementById("paymentForm");
    paymentForm.style.opacity = "0.6";
    paymentForm.style.pointerEvents = "none";
});



copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(accountNumber)
      .then(() => {
        copyBtn.textContent = "คัดลอกแล้ว";
        copyBtn.style.backgroundColor = "#87196bff";
        setTimeout(() => {
          copyBtn.textContent = "คัดลอก";
          copyBtn.style.backgroundColor = "#8e2487ff";
        }, 2000);
      })
      .catch(err => {
        alert("เกิดข้อผิดพลาดในการคัดลอก: " + err);
      });
  });



NotRegister.addEventListener('change', function () {
  const fullname = document.getElementById('fullname');
  const nickname = document.getElementById('nickname');
  const line = document.getElementById('line');
  

  if (this.checked) {
    checkLineAndTicket();
    $("#line").next(".select2-container").css("pointer-events", "auto");
    $("#line").next(".select2-container").css("opacity", "1");
    $("#userList").next(".select2-container").css("pointer-events", "none");
    $("#userList").next(".select2-container").css("opacity", "0.4");
    
}else{
  fullname.readOnly = true;
  fullname.style.opacity = "0.4"; 
  nickname.readOnly = true;
  nickname.style.opacity = "0.4"; 
  $("#line").next(".select2-container").css("pointer-events", "none");
  $("#line").next(".select2-container").css("opacity", "0.4");
  $("#userList").next(".select2-container").css("pointer-events", "auto");
  $("#userList").next(".select2-container").css("opacity", "1");
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
  
  if (user && user !== "NOT_FOUND") {
    NotRegister.disabled = true;
    NotRegister.style.opacity = "0.4"; 
    const fullname = document.getElementById('fullname');
    const nickname = document.getElementById('nickname');
    const line = document.getElementById('line');
    fullname.value = user.fullname;
    nickname.value = user.nickname;
    $('#line').val(user.line).trigger('change');
    
    fullname.readOnly = true;
    fullname.style.opacity = "0.4"; 
    nickname.readOnly = true;
    nickname.style.opacity = "0.4"; 
    inf_error.textContent = "";
    needPayment.disabled = false;
    needPayment.style.opacity = "1";
    needPayLater.disabled = false;
    needPayLater.style.opacity = "1";
   

    selectedUser = user;
    checkPaidButtonStatus();
    let price = 220;

    setTimeout(() => {
    if (concludeBox) {
      concludeBox.style.display = "block";
      concludeBox.querySelector("p").innerHTML = `
        โปรดโอนจากบัญชีชื่อ: <strong>${user.fullname}</strong><br>
        ยอดชำระ: <strong>${price} บาท</strong>
      `;
    } else {
      console.warn("⚠️ ไม่พบ concludeBox ใน DOM ตอนนี้");
    }
  }, 100);
  } else {
    console.warn("❌ ไม่พบผู้ใช้ใน data:", selectedValue);
    NotRegister.disabled = false;
    NotRegister.style.opacity = "1"; 
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


    selectedUser = {
        fullname: fullname,
        nickname: nickname,
        line: line,
      };

    let price = 220;
  
      concludeBox.style.display = "block";
      concludeBox.querySelector("p").innerHTML = `
        โปรดโอนจากบัญชีชื่อ: <strong>${fullname}</strong><br>
        ยอดชำระ: <strong>${price} บาท</strong>
      `;
    }
    else {
      alreadyRegistered.disabled = false;
      alreadyRegistered.style.opacity = "1";
    }
  });

function checkLineAndTicket() {
  const fullname = document.getElementById("fullname");
  const nickname = document.getElementById("nickname");
  const line = document.getElementById("line");
  const isLineSelected = line.value.trim() !== "" && line.value.trim() !== "สายงาน";

  if (isLineSelected ) {
    // 🔓 เปิดให้กรอกชื่อ
    fullname.readOnly = false;
    fullname.style.opacity = "1";
    fullname.style.pointerEvents = "auto";

    nickname.readOnly = false;
    nickname.style.opacity = "1";
    nickname.style.pointerEvents = "auto";
  } else {
    // 🔒 ปิดไว้ก่อน ผู้ใช้ยังเลือกไม่ครบ
    fullname.readOnly = true;
    fullname.style.opacity = "0.4";
    fullname.style.pointerEvents = "none";

    nickname.readOnly = true;
    nickname.style.opacity = "0.4";
    nickname.style.pointerEvents = "none";
  }
}



// ===========บันทึกข้อมูล===============
btn_registerSubmit.addEventListener("click", async () => {
  const fullname = document.getElementById("fullname").value.trim();
  const nickname = document.getElementById("nickname").value.trim();
  const line = document.getElementById("line").value.trim();
  const status = "ยังไม่จ่าย";
  const slip = "NaN";
  btn_registerSubmit.disabled = true;
  btn_registerSubmit.style.opacity = "0.4";

  if (!fullname || !nickname || !line ) {
    alert("กรุณากรอกข้อมูลให้ครบก่อนลงทะเบียนค่ะ");
    return;
  }

  const payload = { fullname, nickname, line,  status, slip };
  console.log("ส่งข้อมูล:", payload);
  const sheetUrl = "https://corsproxy.io/?" + encodeURIComponent("https://script.google.com/macros/s/AKfycbwgRSlz2rewhVQlHZZhHdm-2Sv_oB55ijoagrHYEEh2exFQ5uppvaptgq1rxF966Ql5/exec");

  try {
  
  const response = await fetch(sheetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  alert("บันทึกข้อมูลสำเร็จค่ะ! กำลังเปิดหน้าตรวจสอบข้อมูล...");

  setTimeout(() => {
    window.location.href = "https://docs.google.com/spreadsheets/d/1IB5fY3aD-WqRpn25AXRo_3yFiNpJKwwIXExTiA4xq7s/edit?usp=sharing";
  }, 10);

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
  btn_paid.disabled = true;
  btn_paid.style.opacity = "0.4";
  const fileInput = document.getElementById("paymentSlip");
  const file = fileInput.files[0];


  const reader = new FileReader();
  reader.onloadend = async function () {
    const img = new Image();
    img.src = reader.result;

    img.onload = async function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const maxW = 800; 
      const scale = maxW / img.width;
      canvas.width = maxW;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 🧩 แปลง canvas -> base64 (JPG)
      const slipBase64 = canvas.toDataURL("image/jpeg", 0.8); // บีบอัด 80%

      // 📦 เตรียมข้อมูลส่ง
      const payload = {
        fullname: selectedUser.fullname,
        nickname: selectedUser.nickname,
        line: selectedUser.line,
        status:"จ่ายแล้ว",
        slip: slipBase64
      };

      // 🌐 URL ของ Google Apps Script
      const scriptUrl = "https://corsproxy.io/?" + encodeURIComponent("https://script.google.com/macros/s/AKfycbwgRSlz2rewhVQlHZZhHdm-2Sv_oB55ijoagrHYEEh2exFQ5uppvaptgq1rxF966Ql5/exec");

      try {
        console.log("📤 กำลังส่งข้อมูล:", payload);
        const response = await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        alert("บันทึกข้อมูลสำเร็จค่ะ! กำลังเปิดหน้าตรวจสอบข้อมูล...");

        setTimeout(() => {
          window.location.href = "https://docs.google.com/spreadsheets/d/1IB5fY3aD-WqRpn25AXRo_3yFiNpJKwwIXExTiA4xq7s/edit?usp=sharing";
        }, 10);



        
      } catch (err) {
        console.error("เกิดข้อผิดพลาด:", err);
        alert("⚠️ เกิดข้อผิดพลาดในการอัปโหลด");
      }
    };
  };

  // 🔹 เริ่มอ่านไฟล์
  reader.readAsDataURL(file);
});
