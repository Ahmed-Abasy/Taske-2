const display = document.getElementById("display");
let expr = "";

function update() {
  display.value = expr || "0";
}

function getLastNumberToken() {
  // آخر جزء رقمي قبل عامل (+ - * /) أو بداية السلسلة
  return expr.split(/[^0-9.]/).pop() || "";
}

function inputChar(ch) {
  if (ch === ".") {
    const last = getLastNumberToken();
    if (!last) expr += "0"; // لو بدأت بنقطة نخليها 0.
    if (last.includes(".")) return; // منع تكرار النقطة لنفس الرقم
  }
  expr += ch;
  update();
}

function operate(op) {
  // السماح بالبدء بـ "-" كإشارة سالبة
  if (!expr) {
    if (op === "-") {
      expr = "-";
      update();
    }
    return;
  }
  // منع تكرار العمليات أو النقطة في نهاية السلسلة
  if (/[+\-*/.]$/.test(expr)) expr = expr.slice(0, -1);
  expr += op;
  update();
}

function evaluateExpr() {
  try {
    // تنظيف المدخلات من أي رموز غير مسموح بها
    const sanitized = (expr || "0").replace(/[^0-9.+\-*/()]/g, "");
    // تجنب التقييم لو آخر شيء عامل
    const safe = /[+\-*/.]$/.test(sanitized)
      ? sanitized.slice(0, -1)
      : sanitized;
    // التقييم
    const result = new Function('"use strict"; return (' + safe + ")")();
    // معالجة NaN أو Infinity
    if (!isFinite(result)) throw new Error("Invalid");
    expr = String(result);
    update();
  } catch (e) {
    expr = "";
    display.value = "Error";
  }
}

function back() {
  expr = expr.slice(0, -1);
  update();
}

function clearAll() {
  expr = "";
  update();
}

// أزرار الأرقام
document
  .querySelectorAll("[data-num]")
  .forEach((btn) =>
    btn.addEventListener("click", () => inputChar(btn.dataset.num))
  );

// زر النقطة
const dotBtn = document.querySelector("[data-dot]");
if (dotBtn) dotBtn.addEventListener("click", () => inputChar("."));

// أزرار العمليات
document
  .querySelectorAll("[data-op]")
  .forEach((btn) =>
    btn.addEventListener("click", () => operate(btn.dataset.op))
  );

// يساوي
document.querySelector("[data-eq]").addEventListener("click", evaluateExpr);

// رجوع و مسح
document.querySelector('[data-action="back"]').addEventListener("click", back);
document
  .querySelector('[data-action="clear"]')
  .addEventListener("click", clearAll);

// دعم الكيبورد
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") inputChar(e.key);
  else if (e.key === ".") inputChar(".");
  else if (["+", "-", "*", "/"].includes(e.key)) operate(e.key);
  else if (e.key === "Enter" || e.key === "=") evaluateExpr();
  else if (e.key === "Backspace") back();
  else if (e.key === "Escape") clearAll();
});

update();
