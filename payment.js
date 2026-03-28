const paymentPlanConfig = {
    basic: {
        label: 'Basic',
        title: 'Axiomora Basic',
        description: 'Personal growth tracking and calm daily progress tools for individual learners.'
    },
    premium: {
        label: 'Premium',
        title: 'Axiomora Premium',
        description: 'Advanced AI insights, mock tests, and deeper analytics for focused students.'
    },
    pro: {
        label: 'Professional',
        title: 'Axiomora Professional',
        description: 'Administrative tools, group oversight, and performance dashboards for organizers.'
    }
};

const paymentPricingData = {
    inr: {
        monthly: { basic: '₹199', premium: '₹299', pro: '₹1,999' },
        yearly: { basic: '₹1,899', premium: '₹2,999', pro: '₹19,999' }
    },
    usd: {
        monthly: { basic: '$14.99', premium: '$29.99', pro: '$249.99' },
        yearly: { basic: '$149.99', premium: '$299.99', pro: '$2199.99' }
    }
};

function initPaymentSummary() {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get('plan') || 'basic';
    const currency = params.get('currency') || 'inr';
    const period = params.get('period') || 'monthly';

    const selectedPlan = paymentPlanConfig[plan] || paymentPlanConfig.basic;
    const selectedPriceGroup = paymentPricingData[currency] || paymentPricingData.inr;
    const selectedPrice = selectedPriceGroup[period]?.[plan] || paymentPricingData.inr.monthly.basic;
    const selectedPeriod = period === 'yearly' ? '/ year' : '/ month';

    const planName = document.querySelector('#paymentPlanName');
    const planDescription = document.querySelector('#paymentPlanDescription');
    const planPrice = document.querySelector('#paymentPlanPrice');
    const planPeriod = document.querySelector('#paymentPlanPeriod');
    const subscriptionValue = document.querySelector('#paymentSubscriptionValue');
    const selectedTier = document.querySelector('#paymentSelectedTier');

    if (planName) planName.textContent = selectedPlan.title;
    if (planDescription) planDescription.textContent = selectedPlan.description;
    if (planPrice) planPrice.textContent = selectedPrice;
    if (planPeriod) planPeriod.textContent = selectedPeriod;
    if (subscriptionValue) subscriptionValue.textContent = selectedPrice;
    if (selectedTier) selectedTier.textContent = selectedPlan.label;
}

function initCardSelection() {
    const cardOptions = document.querySelectorAll('[data-card-option]');
    const cardPanels = document.querySelectorAll('[data-card-panel]');
    const paymentMethodInputs = document.querySelectorAll('input[name="paymentMethod"]');

    if (cardOptions.length === 0 || cardPanels.length === 0 || paymentMethodInputs.length === 0) {
        return;
    }

    const syncCardSelection = () => {
        cardOptions.forEach((option) => {
            const input = option.querySelector('input[type="radio"]');
            const method = option.dataset.cardOption;
            const panel = document.querySelector(`[data-card-panel="${method}"]`);
            const isSelected = Boolean(input?.checked);

            option.classList.toggle('active', isSelected);

            if (panel) {
                panel.hidden = !isSelected;
            }
        });
    };

    paymentMethodInputs.forEach((input) => {
        input.addEventListener('change', syncCardSelection);
    });

    syncCardSelection();
}

initPaymentSummary();
initCardSelection();
