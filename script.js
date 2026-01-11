// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// CINEMATIC SCROLL SCRIPT
// Handles the 7-section narrative flow: Text Zoom -> Content Reveal

const cinematicSections = document.querySelectorAll('.cinematic-section');

cinematicSections.forEach((section, index) => {
    const wrapper = section.querySelector('.cinematic-wrapper');
    const text = section.querySelector('.cinematic-text');
    const content = section.querySelector('.section-content');
    const bgColor = section.dataset.bg || '#FFFFFF';

    // Set initial states
    gsap.set(wrapper, { backgroundColor: bgColor }); // Ensure wrapper covers content
    gsap.set(text, { opacity: 0, fontSize: "4rem" }); // Start small
    gsap.set(content, { opacity: 0, y: 50 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=150%", // Pin duration
            pin: true,
            scrub: 1, // Smooth scrubbing
            anticipatePin: 1
        }
    });

    // Sequence:
    // 1. Text appears
    tl.to(text, { opacity: 1, fontSize: "5rem", duration: 1, ease: "power2.out" })
      // 2. Text zooms in massively (increases font-size to fill screen)
      .to(text, { fontSize: "250rem", duration: 3, ease: "power1.in" }, "+=0.2")
      // 3. Text fades out ONLY at the very end of the zoom (when it's huge)
      .to(text, { opacity: 0, duration: 0.5, ease: "power1.out" }, "-=0.5")
      // 3. Wrapper fades out to reveal content underneath
      .to(wrapper, { opacity: 0, duration: 1, ease: "power2.inOut" }, "-=1")
      // 3. Content reveals (fades in and moves up)
      .to(content, { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }, "-=1");
      
    // Special handling for Hero (Auto-play if at top)
    if (index === 0) {
        // Optional: If you want the hero to animate immediately without scroll, 
        // you'd need a separate logic. But scroll-driven is consistent.
        // The user will see the question immediately upon load because 'start: top top' matches.
    }
});

// WIDGET ANIMATIONS

// 1. Progress Over Time (Line Draw + Gradient Fade)
const progressLine = document.querySelector('.progress-line');
const progressFill = document.querySelector('.progress-fill');

if (progressLine && progressFill) {
    const length = progressLine.getTotalLength();
    gsap.set(progressLine, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(progressFill, { opacity: 0 });

    gsap.to(progressLine, {
        scrollTrigger: { trigger: ".widget-progress-container", start: "top 75%" },
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.out"
    });

    gsap.to(progressFill, {
        scrollTrigger: { trigger: ".widget-progress-container", start: "top 75%" },
        opacity: 1,
        duration: 1.5,
        delay: 0.5,
        ease: "power2.out"
    });
}

// 2. Insight Widget (Split Column Sequence)
const insightTimeline = gsap.timeline({
    scrollTrigger: { trigger: ".widget-insight-split", start: "top 80%" }
});

// Left Column (Bars)
insightTimeline.from(".insight-col.left .insight-bar .bar-fill", {
    width: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power2.out"
})
.from(".insight-col.left .insight-status", { opacity: 0, y: 10, duration: 0.5 }, "-=0.5");

// Pause
insightTimeline.to({}, { duration: 0.3 });

// Right Column (Curve)
insightTimeline.to(".insight-curve-path", {
    strokeDashoffset: 0,
    duration: 1.2,
    ease: "power2.out"
}, "+=0.1")
.from(".insight-col.right .insight-status", { opacity: 0, y: 10, duration: 0.5 }, "-=0.8");

// 3. Growth Timeline (Line Draw)
const timelineLine = document.querySelector('.timeline-line');
if (timelineLine) {
    const len = timelineLine.getTotalLength();
    gsap.set(timelineLine, { strokeDasharray: len, strokeDashoffset: len });
    
    gsap.to(timelineLine, {
        scrollTrigger: { trigger: ".widget-timeline-container", start: "top 80%" },
        strokeDashoffset: 0,
        duration: 2.5,
        ease: "power2.out"
    });
    
    gsap.from(".timeline-dot", {
        scrollTrigger: { trigger: ".widget-timeline-container", start: "top 80%" },
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.5,
        delay: 0.5,
        ease: "back.out(1.7)"
    });
    
    gsap.from(".timeline-labels span", {
        scrollTrigger: { trigger: ".widget-timeline-container", start: "top 80%" },
        opacity: 0,
        y: 10,
        duration: 0.8,
        stagger: 0.5,
        delay: 0.8
    });
}

// 2. Task Completion Rate
gsap.to(".task-progress-arc", {
    scrollTrigger: { trigger: ".clarity-card.medium.delay-1", start: "top 85%" },
    strokeDashoffset: 53, // 83% of 314 is approx 261, offset = 314 - 261 = 53
    duration: 1.2,
    delay: 0.2,
    ease: "power2.out"
});

// 3. Time vs Improvement
gsap.from(".scatter-dot", {
    scrollTrigger: { trigger: ".widget-scatter", start: "top 85%" },
    opacity: 0,
    duration: 0.8,
    stagger: { amount: 1, from: "random" },
    ease: "power1.out"
});
gsap.to(".scatter-trend", {
    scrollTrigger: { trigger: ".widget-scatter", start: "top 85%" },
    strokeDashoffset: 0,
    duration: 1.5,
    delay: 1,
    ease: "power2.out"
});

// 4. Weekly Review
gsap.to(".check-item", {
    scrollTrigger: { trigger: ".widget-review", start: "top 85%" },
    opacity: 1,
    x: 0,
    duration: 0.5,
    stagger: 0.3,
    ease: "power2.out"
});

// 5. Weekly Hours
gsap.to(".hour-bar", {
    scrollTrigger: { trigger: ".widget-weekly-hours", start: "top 85%" },
    scaleY: 1,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out"
});
gsap.to(".goal-line", {
    scrollTrigger: { trigger: ".widget-weekly-hours", start: "top 85%" },
    opacity: 1,
    duration: 1,
    delay: 0.8
});

// 6. Morning Focus
gsap.to(".focus-pill", {
    scrollTrigger: { trigger: ".widget-focus-check", start: "top 85%" },
    opacity: 1,
    duration: 0.5,
    stagger: 0.2
});
gsap.to(".focus-slider-thumb", {
    scrollTrigger: { trigger: ".widget-focus-check", start: "top 85%" },
    left: "60%",
    duration: 1,
    delay: 0.5,
    ease: "power2.out"
});

// 7. Completion Rate
gsap.to(".comp-bar-fill", {
    scrollTrigger: { trigger: ".widget-completion", start: "top 85%" },
    width: (i, el) => el.style.width, // Animate to inline style width
    from: { width: 0 },
    duration: 1,
    stagger: 0.2,
    ease: "power2.out"
});
gsap.to(".comp-circle-fill", {
    scrollTrigger: { trigger: ".widget-completion", start: "top 85%" },
    strokeDashoffset: 40, // Approximate for 83%
    duration: 1.2,
    delay: 0.8,
    ease: "power2.out"
});

// 8. Growth Summary
gsap.to(".sum-seg", {
    scrollTrigger: { trigger: ".widget-summary", start: "top 85%" },
    opacity: 1,
    duration: 0.5,
    stagger: 0.2,
    ease: "power2.out"
});

// Growth Over Weeks Widget
const growthLine = document.querySelector('.growth-line-path');
if (growthLine) {
    const len = growthLine.getTotalLength();
    gsap.set(growthLine, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(growthLine, {
        scrollTrigger: { trigger: ".widget-growth-weeks", start: "top 80%" },
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.out"
    });
    gsap.from(".growth-point", {
        scrollTrigger: { trigger: ".widget-growth-weeks", start: "top 80%" },
        scale: 0,
        duration: 0.5,
        stagger: 0.5,
        delay: 1
    });
}

// FAQ Accordion Logic
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all others
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-answer').style.maxHeight = null;
        });

        // Toggle current
        if (!isActive) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});

// Pricing Toggle Logic
const pricingData = {
    inr: {
        monthly: { basic: "₹199", premium: "₹299", pro: "₹1,999" },
        yearly: { basic: "₹1,899", premium: "₹2,999", pro: "₹19,999" }
    },
    usd: {
        monthly: { basic: "$14.99", premium: "$29.99", pro: "$249.99" },
        yearly: { basic: "$149.99", premium: "$299.99", pro: "$2199.99" }
    }
};

let currentCurrency = 'inr';
let currentPeriod = 'monthly';

const updatePrices = () => {
    const prices = pricingData[currentCurrency][currentPeriod];
    const periodText = currentPeriod === 'monthly' ? '/ month' : '/ year';
    const parsePrice = (str) => parseFloat(str.replace(/[^0-9.]/g, ''));
    
    const locale = currentCurrency === 'inr' ? 'en-IN' : 'en-US';
    const currencyCode = currentCurrency.toUpperCase();
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
    
    ['basic', 'premium', 'pro'].forEach(plan => {
        // Update Price
        const priceEl = document.querySelector(`[data-plan="${plan}"]`);
        if (priceEl) priceEl.textContent = prices[plan];

        // Calculate Savings & Original Price
        const monthly = parsePrice(pricingData[currentCurrency].monthly[plan]);
        const yearly = parsePrice(pricingData[currentCurrency].yearly[plan]);
        const annualized = monthly * 12;
        const savings = Math.round(((annualized - yearly) / annualized) * 100);

        // Update Original Price (Crossed out)
        const originalPriceEl = document.querySelector(`[data-plan-original="${plan}"]`);
        if (originalPriceEl) {
            if (currentPeriod === 'yearly') {
                originalPriceEl.textContent = formatter.format(annualized);
                originalPriceEl.classList.add('visible');
            } else {
                originalPriceEl.classList.remove('visible');
            }
        }

        // Update Savings Text
        const savingsEl = document.querySelector(`[data-plan-savings="${plan}"]`);
        if (savingsEl) {
            if (currentPeriod === 'monthly') {
                savingsEl.textContent = `Save ${savings}% with yearly`;
                savingsEl.style.color = 'var(--accent-red)';
                savingsEl.style.opacity = '1';
            } else {
                savingsEl.textContent = `Saving ${savings}%`;
                savingsEl.style.color = 'var(--accent-dark-green)';
                savingsEl.style.opacity = '1';
            }
        }
    });
    
    document.querySelectorAll('.plan-period').forEach(el => {
        el.textContent = periodText;
    });
};

const toggleBtns = document.querySelectorAll('.toggle-btn');

if (toggleBtns.length > 0) {
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Handle active state visual
            const group = btn.parentElement;
            group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update state
            if (btn.dataset.period) {
                currentPeriod = btn.dataset.period;
            }
            if (btn.dataset.currency) {
                currentCurrency = btn.dataset.currency;
            }

            // Update UI
            updatePrices();
        });
    });
    
    // Initialize prices and savings on load
    updatePrices();
}

// Sticky Pricing Toggles Shadow Logic
const pricingToggles = document.querySelector('.pricing-toggles');
if (pricingToggles) {
    window.addEventListener('scroll', () => {
        const rect = pricingToggles.getBoundingClientRect();
        // Check if element is at the sticky position (top: 52px)
        // We use a small buffer (53) to ensure it triggers when pinned
        const isSticky = rect.top <= 53;
        
        pricingToggles.classList.toggle('sticky-active', isSticky);
    });
}