const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 20);
});


const mobileMenu = document.querySelector(".mobile-menu");
const navLinks = document.querySelector(".nav-links");

mobileMenu?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("mobile-open");

    if (open) {
        navLinks.style.display = "flex";
        navLinks.style.position = "absolute";
        navLinks.style.top = "76px";
        navLinks.style.left = "0";
        navLinks.style.right = "0";
        navLinks.style.padding = "25px";
        navLinks.style.flexDirection = "column";
        navLinks.style.alignItems = "flex-start";
        navLinks.style.background = "#11110f";
        navLinks.style.borderBottom = "1px solid rgba(241,234,219,.1)";
    } else {
        navLinks.removeAttribute("style");
    }
});


const referenceThursday = new Date(2026, 8, 10, 15, 0, 0);

function getNextMeeting() {
    const now = new Date();

    for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() + i);
        date.setHours(15, 0, 0, 0);

        if (date <= now) continue;

        if (date.getDay() === 2) {
            return date;
        }

        if (date.getDay() === 4) {
            const difference = Math.round(
                (date - referenceThursday) / (1000 * 60 * 60 * 24)
            );

            if (difference % 14 === 0) {
                return date;
            }
        }
    }

    return null;
}

function updateMeeting() {
    const meeting = getNextMeeting();
    if (!meeting) return;

    const formatted = meeting.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    });

    const dateElement = document.getElementById("meetingDate");
    const heroElement = document.getElementById("nextMeeting");

    if (dateElement) dateElement.textContent = formatted;
    if (heroElement) heroElement.textContent = formatted;

    const difference = meeting - new Date();

    const days = Math.floor(difference / 86400000);
    const hours = Math.floor((difference / 3600000) % 24);
    const minutes = Math.floor((difference / 60000) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    const values = {
        days,
        hours,
        minutes,
        seconds
    };

    for (const [id, value] of Object.entries(values)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = String(value).padStart(2, "0");
        }
    }
}

if (document.getElementById("meetingDate")) {
    updateMeeting();
    setInterval(updateMeeting, 1000);
}


const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach(element => {
    observer.observe(element);
});


document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks?.classList.remove("mobile-open");

        if (window.innerWidth <= 900) {
            navLinks?.removeAttribute("style");
        }
    });
});
