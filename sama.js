// ==================================
// SAMA | MAIN JAVASCRIPT
// ==================================


// 1. رسالة التنبيه

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}


// 2. قائمة التنقل

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});

document.querySelectorAll("#navLinks a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
    });
});


// 3. التجربة الافتراضية للفضاء

const spaceInfo = document.getElementById("spaceInfo");

const spaceData = {
    sun: {
        title: "الشمس ☀",
        description: "الشمس نجم يقع في مركز مجموعتنا الشمسية، وتوفر الضوء والحرارة اللازمين للحياة على الأرض."
    },

    planet: {
        title: "الكواكب 🪐",
        description: "الكواكب أجرام سماوية تدور حول النجوم. ومن أشهر كواكب مجموعتنا الشمسية زحل والمشتري والمريخ."
    },

    star: {
        title: "النجوم ✦",
        description: "النجوم كرات ضخمة من الغاز الساخن تنتج الضوء والطاقة، وتبدو لنا كنقاط مضيئة في السماء."
    },

    moon: {
        title: "القمر ☾",
        description: "القمر هو القمر الطبيعي للأرض، ويعكس ضوء الشمس، وتتغير أطواره خلال الشهر القمري."
    }
};

document.querySelectorAll(".space-object").forEach(object => {

    object.addEventListener("click", () => {

        const selected = spaceData[object.dataset.space];

        spaceInfo.innerHTML = `
            <span>✦ ${selected.title}</span>
            <p>${selected.description}</p>
        `;

    });

});


// 4. رسم النجوم المتحركة

const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

let stars = [];

function createStars() {

    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    stars = [];

    for (let i = 0; i < 100; i++) {

        stars.push({
            x: Math.random() * rect.width,
            y: Math.random() * rect.height,
            size: Math.random() * 1.8 + 0.3,
            alpha: Math.random(),
            speed: Math.random() * 0.015 + 0.003
        });

    }
}

function animateStars() {

    const rect = canvas.getBoundingClientRect();

    ctx.clearRect(0, 0, rect.width, rect.height);

    stars.forEach(star => {

        star.alpha += star.speed;

        if (star.alpha > 1 || star.alpha < 0.2) {
            star.speed *= -1;
        }

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = `rgba(255, 239, 190, ${star.alpha})`;

        ctx.fill();

    });

    requestAnimationFrame(animateStars);
}

createStars();
animateStars();

window.addEventListener("resize", createStars);


// 5. الاختبار الفلكي

const questions = [

    {
        question: "ما هو النجم الذي يقع في مركز مجموعتنا الشمسية؟",
        answers: ["القمر", "الشمس", "المشتري", "زحل"],
        correct: 1
    },

    {
        question: "ما اسم المجرة التي تقع فيها مجموعتنا الشمسية؟",
        answers: ["مجرة المرأة المسلسلة", "مجرة المثلث", "درب التبانة", "مجرة الدوامة"],
        correct: 2
    },

    {
        question: "ما الكوكب المعروف باسم الكوكب الأحمر؟",
        answers: ["المريخ", "الزهرة", "عطارد", "نبتون"],
        correct: 0
    },

    {
        question: "لماذا نرى القمر مضيئًا؟",
        answers: [
            "لأنه ينتج الضوء بنفسه",
            "لأنه يعكس ضوء الشمس",
            "بسبب النجوم القريبة",
            "لأنه يحتوي على نار"
        ],
        correct: 1
    },

    {
        question: "ما الأداة المستخدمة لرؤية الأجرام السماوية البعيدة؟",
        answers: ["البوصلة", "المجهر", "التلسكوب", "الميزان"],
        correct: 2
    }

];

let currentQuestion = 0;
let userScore = 0;
let answered = false;

const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answers");
const questionNumber = document.getElementById("questionNumber");
const scoreElement = document.getElementById("score");
const feedback = document.getElementById("quizFeedback");
const nextButton = document.getElementById("nextQuestion");
const progressBar = document.getElementById("progressBar");

function loadQuestion() {

    answered = false;

    const q = questions[currentQuestion];

    questionNumber.textContent =
        `السؤال ${currentQuestion + 1} من ${questions.length}`;

    scoreElement.textContent = `النتيجة: ${userScore}`;

    questionText.textContent = q.question;

    feedback.textContent = "";

    nextButton.disabled = true;

    nextButton.textContent =
        currentQuestion === questions.length - 1
        ? "عرض النتيجة ✦"
        : "السؤال التالي ←";

    progressBar.style.width =
        `${(currentQuestion / questions.length) * 100}%`;

    answersContainer.innerHTML = "";

    q.answers.forEach((answer, index) => {

        const button = document.createElement("button");

        button.className = "answer-btn";
        button.textContent = answer;

        button.addEventListener("click", () => {
            checkAnswer(index, button);
        });

        answersContainer.appendChild(button);

    });

}

function checkAnswer(selected, button) {

    if (answered) return;

    answered = true;

    const correct = questions[currentQuestion].correct;

    const allButtons =
        document.querySelectorAll(".answer-btn");

    allButtons.forEach((btn, index) => {

        btn.disabled = true;

        if (index === correct) {
            btn.classList.add("correct");
        }

    });

    if (selected === correct) {

        userScore++;

        feedback.textContent = "إجابة صحيحة! أحسنت يا مستكشف السماء ✨";

    } else {

        button.classList.add("wrong");

        feedback.textContent =
            `الإجابة الصحيحة هي: ${questions[currentQuestion].answers[correct]}`;

    }

    scoreElement.textContent = `النتيجة: ${userScore}`;

    nextButton.disabled = false;

}

nextButton.addEventListener("click", () => {

    if (!answered) return;

    currentQuestion++;

    if (currentQuestion < questions.length) {

        loadQuestion();

    } else {

        progressBar.style.width = "100%";

        questionNumber.textContent = "انتهى الاختبار";

        questionText.textContent =
            `حصلت على ${userScore} من ${questions.length} إجابات صحيحة!`;

        answersContainer.innerHTML = "";

        feedback.textContent =
            userScore === 5
            ? "مذهل! أنت مستكشف فلكي محترف ✦"
            : "رحلة جميلة! استمر في اكتشاف أسرار الكون.";

        nextButton.textContent = "إعادة الاختبار";

        nextButton.disabled = false;

        nextButton.onclick = () => {

            currentQuestion = 0;
            userScore = 0;

            nextButton.onclick = null;

            loadQuestion();

        };

    }

});

loadQuestion();


// 6. تكبير صور المعرض

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");

document.querySelectorAll(".gallery-img").forEach(img => {

    img.addEventListener("click", () => {

        lightboxImage.src = img.src;
        lightbox.classList.add("active");

    });

});

closeLightbox.addEventListener("click", () => {

    lightbox.classList.remove("active");

});

lightbox.addEventListener("click", event => {

    if (event.target === lightbox) {
        lightbox.classList.remove("active");
    }

});


// 7. نموذج الحجز التجريبي

const bookingForm = document.getElementById("bookingForm");
const bookingMessage = document.getElementById("bookingMessage");
const bookingDate = document.getElementById("bookingDate");

const today = new Date();

const localDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

bookingDate.min = localDate;

bookingForm.addEventListener("submit", event => {

    event.preventDefault();

    const booking = {

        name: document.getElementById("visitorName").value.trim(),

        email: document.getElementById("visitorEmail").value.trim(),

        place: document.getElementById("bookingPlace").value,

        experience: document.getElementById("experience").value,

        date: bookingDate.value,

        visitors: document.getElementById("visitors").value,

        bookingNumber: "SAMA-" + Date.now()

    };

    if (!booking.name || !booking.email ||
        !booking.place || !booking.experience ||
        !booking.date) {

        showToast("يرجى تعبئة جميع البيانات");

        return;

    }

    if (booking.date < localDate) {

        showToast("اختاري تاريخًا مستقبليًا");

        return;

    }

    try {

        const oldBookings =
            JSON.parse(localStorage.getItem("samaBookings") || "[]");

        oldBookings.push(booking);

        localStorage.setItem(
            "samaBookings",
            JSON.stringify(oldBookings)
        );

        bookingMessage.textContent =
            `تم حفظ طلبك التجريبي بنجاح! رقم الطلب: ${booking.bookingNumber}`;

        showToast("وصل طلبك التجريبي بنجاح ✦");

        bookingForm.reset();

        bookingDate.min = localDate;

    } catch (error) {

        bookingMessage.textContent =
            "تعذر حفظ الطلب على هذا الجهاز. حاولي مرة أخرى.";

    }

});


// 8. تهيئة الموقع

console.log("Welcome to SAMA - Discover the universe ✦");