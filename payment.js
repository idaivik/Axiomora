const SUPABASE_URL = 'https://nxtfbyvacunsiytlsfkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54dGZieXZhY3Vuc2l5dGxzZmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODUwNzgsImV4cCI6MjA4OTA2MTA3OH0.DojA5driPSrZYoOsGJTM_hcvL_EX0uxIYxuLiHuhYU8';

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

let paymentContext = {
    plan: 'basic',
    currency: 'inr',
    period: 'monthly',
    amount: 199,
    email: ''
};

function createSupabaseClient() {
    if (!window.supabase?.createClient) {
        setStatusMessage('Supabase SDK is not loaded on this page.');
        return null;
    }

    if (
        !SUPABASE_URL ||
        !SUPABASE_ANON_KEY ||
        SUPABASE_URL.includes('your-project') ||
        SUPABASE_URL.includes('your-supabase-url') ||
        SUPABASE_ANON_KEY.includes('your-anon-key')
    ) {
        setStatusMessage('Add your real Supabase URL and public key before using the simulated checkout.');
        return null;
    }

    return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function getCheckoutParams() {
    const params = new URLSearchParams(window.location.search);

    return {
        plan: params.get('plan') || 'basic',
        currency: (params.get('currency') || 'inr').toLowerCase(),
        period: (params.get('period') || 'monthly').toLowerCase()
    };
}

function getPlanPrice(currency, period, plan) {
    const selectedCurrency = paymentPricingData[currency] || paymentPricingData.inr;
    const selectedPeriod = selectedCurrency[period] || selectedCurrency.monthly;
    return selectedPeriod[plan] || paymentPricingData.inr.monthly.basic;
}

function parseAmount(priceText) {
    return Number(String(priceText).replace(/,/g, '').replace(/[^\d.]/g, '')) || 0;
}

function getSubscriptionEndDate(period) {
    const endDate = new Date();

    if (period === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
        endDate.setMonth(endDate.getMonth() + 1);
    }

    return endDate.toISOString();
}

function setStatusMessage(message) {
    const statusMessage = document.querySelector('#paymentStatusMessage');

    if (!statusMessage) {
        return;
    }

    statusMessage.textContent = message;
    statusMessage.hidden = !message;
}

function setActionButtonsLoading(isLoading) {
    const actionButtons = document.querySelectorAll('[data-simulated-action]');

    actionButtons.forEach((button) => {
        button.disabled = isLoading;
    });
}

function initPaymentSummary() {
    const { plan, currency, period } = getCheckoutParams();
    const selectedPlan = paymentPlanConfig[plan] || paymentPlanConfig.basic;
    const selectedPrice = getPlanPrice(currency, period, plan);
    const selectedPeriod = period === 'yearly' ? '/ year' : '/ month';

    paymentContext = {
        plan,
        currency,
        period,
        amount: parseAmount(selectedPrice),
        email: ''
    };

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

function initSimulationUi() {
    const paymentButton = document.querySelector('.payment-submit');
    const paymentFooterNote = document.querySelector('.payment-footer-note');

    if (!paymentButton || !paymentFooterNote) {
        return;
    }

    const simulationBlock = document.createElement('div');
    simulationBlock.innerHTML = `
        <div class="payment-section" aria-live="polite">
            <div class="payment-section-head">
                <h2>Temporary Payment Simulation</h2>
                <span>Use this until Razorpay is connected</span>
            </div>
            <button type="button" class="btn-primary payment-submit" data-simulated-action="success">Temporary Skip Payment</button>
            <button type="button" class="btn-primary payment-submit" data-simulated-action="failed" style="margin-top: 12px; background: #1D1D1F;">Payment Failed</button>
            <p id="paymentStatusMessage" class="form-error" hidden></p>
        </div>
    `;

    paymentButton.replaceWith(simulationBlock);
}

async function recordSuccessfulPayment() {
    const client = createSupabaseClient();

    if (!client) {
        return;
    }

    setStatusMessage('');
    setActionButtonsLoading(true);

    try {
        const { data: authData, error: authError } = await client.auth.getUser();

        if (authError) {
            throw authError;
        }

        const user = authData?.user;

        if (!user) {
            throw new Error('Supabase is connected, but no logged-in user was found. Sign in with Supabase Auth before activating a plan.');
        }

        paymentContext.email = user.email || '';

        const nowIso = new Date().toISOString();
        const paymentPayload = {
            user_id: user.id,
            status: 'captured',
            amount: paymentContext.amount,
            currency: 'INR',
            plan_id: paymentContext.plan,
            billing_cycle: paymentContext.period,
            paid_at: nowIso
        };

        const { error: paymentError } = await client
            .from('payment_history')
            .insert(paymentPayload);

        if (paymentError) {
            throw paymentError;
        }

        const subscriptionPayload = {
            user_id: user.id,
            plan_id: paymentContext.plan,
            status: 'active',
            billing_cycle: paymentContext.period,
            start_date: nowIso,
            end_date: getSubscriptionEndDate(paymentContext.period),
            updated_at: nowIso
        };

        const { data: existingSubscription, error: subscriptionLookupError } = await client
            .from('subscriptions')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

        if (subscriptionLookupError) {
            throw subscriptionLookupError;
        }

        const subscriptionQuery = client.from('subscriptions');
        const subscriptionResult = existingSubscription?.id
            ? await subscriptionQuery.update(subscriptionPayload).eq('id', existingSubscription.id)
            : await subscriptionQuery.insert(subscriptionPayload);

        if (subscriptionResult.error) {
            throw subscriptionResult.error;
        }

        const redirectParams = new URLSearchParams({
            email: paymentContext.email
        });

        window.location.href = `success.html?${redirectParams.toString()}`;
    } catch (error) {
        setStatusMessage(error.message || 'Unable to complete the simulated payment right now.');
    } finally {
        setActionButtonsLoading(false);
    }
}

async function recordFailedPayment() {
    const client = createSupabaseClient();

    if (!client) {
        return;
    }

    setStatusMessage('');
    setActionButtonsLoading(true);

    try {
        const { data: authData, error: authError } = await client.auth.getUser();

        if (authError) {
            throw authError;
        }

        const user = authData?.user;

        if (!user) {
            throw new Error('Sign in with Supabase Auth before recording a payment result.');
        }

        const { error } = await client
            .from('payment_history')
            .insert({
                user_id: user.id,
                status: 'failed',
                amount: paymentContext.amount,
                currency: 'INR',
                plan_id: paymentContext.plan,
                billing_cycle: paymentContext.period,
                failure_reason: 'User simulated failure',
                paid_at: new Date().toISOString()
            });

        if (error) {
            throw error;
        }

        setStatusMessage('Payment failed: User simulated failure.');
    } catch (error) {
        setStatusMessage(error.message || 'Unable to record the failed payment.');
    } finally {
        setActionButtonsLoading(false);
    }
}

function initSimulationActions() {
    const successButton = document.querySelector('[data-simulated-action="success"]');
    const failedButton = document.querySelector('[data-simulated-action="failed"]');

    if (!successButton || !failedButton) {
        return;
    }

    successButton.addEventListener('click', recordSuccessfulPayment);
    failedButton.addEventListener('click', recordFailedPayment);
}

initPaymentSummary();
initCardSelection();
initSimulationUi();
initSimulationActions();
