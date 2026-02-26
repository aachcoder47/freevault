const products = [
    {
        id: 1,
        title: "Email Automation n8n Workflow",
        category: "saas",
        desc: "Advanced n8n workflow for automated B2B sales emails, lead tracking and AI personalization.",
        price: "$99",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800",
        badge: "SaaS",
        file: "My workflow (1).json"
    }
];

const productGrid = document.getElementById('product-grid');
const toastContainer = document.getElementById('toast-container');

function renderProducts(filter = 'all') {
    productGrid.innerHTML = '';

    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

    filtered.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img" style="background-image: url('${product.image}')">
                <span class="badge">${product.badge}</span>
            </div>
            <div class="card-content">
                <h3 class="card-title">${product.title}</h3>
                <p class="card-desc">${product.desc}</p>
            </div>
            <div class="card-footer">
                <div class="price"><span>${product.price}</span> FREE</div>
                <button class="btn btn-primary claim-btn" data-id="${product.id}" style="padding: 0.5rem 1rem; font-size: 0.8rem;">Claim Now</button>
            </div>
        `;
        productGrid.appendChild(card);

        // Inject a real Ad unit after the main product
        const adCard = document.createElement('div');
        adCard.className = 'card ad-card';
        adCard.style.padding = '0'; // Remove padding for the iframe
        adCard.innerHTML = `
            <div style="font-size: 0.6rem; color: var(--ad-gold); border: 1px solid var(--ad-gold); padding: 2px 5px; margin: 1rem 0; position: absolute; top: 0; left: 50%; transform: translateX(-50%);">SPONSORED</div>
            <div id="ad-unit-grid" style="width: 300px; height: 250px; margin: 2rem auto 0; display: flex; align-items: center; justify-content: center;">
                <script type="text/javascript">
                    atOptions = {
                        'key' : 'eda0ed4d49f63991751ea5288787a489',
                        'format' : 'iframe',
                        'height' : 250,
                        'width' : 300,
                        'params' : {}
                    };
                </script>
                <script type="text/javascript" src="https://www.highperformanceformat.com/eda0ed4d49f63991751ea5288787a489/invoke.js"></script>
            </div>
        `;
        productGrid.appendChild(adCard);
    });

    // Re-attach event listeners for claim buttons
    document.querySelectorAll('.claim-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.id;
            const product = products.find(p => p.id == productId);
            startRewardedAd(product);
        });
    });
}

// Rewarded Ad Logic
const modal = document.getElementById('ad-modal');
const adTimer = document.getElementById('ad-timer');
const closeAdBtn = document.getElementById('close-ad-btn');
const rewardContainer = document.getElementById('reward-container');
const adPlayer = document.getElementById('ad-player');
const downloadLink = document.getElementById('download-link');

function startRewardedAd(product) {
    modal.classList.add('active');
    rewardContainer.classList.add('hidden');
    closeAdBtn.style.display = 'block';
    closeAdBtn.disabled = true;
    closeAdBtn.style.opacity = '0.5';
    closeAdBtn.style.cursor = 'not-allowed';
    closeAdBtn.innerText = 'Wait to Claim';

    // Random sponsor content
    const sponsors = [
        { name: "NordVPN", color: "#0053ff", text: "Secure your digital life with the world's leading VPN." },
        { name: "Grammarly", color: "#00d182", text: "Better writing, everywhere you work." },
        { name: "Skillshare", color: "#00ff84", text: "Learn anything, anytime, from top industry pros." }
    ];
    const sponsor = sponsors[Math.floor(Math.random() * sponsors.length)];

    adPlayer.innerHTML = `
        <div style="background: ${sponsor.color}; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; color: #fff; text-align: center;">
            <h1 style="font-size: 3rem; margin-bottom: 1rem;">${sponsor.name}</h1>
            <p>${sponsor.text}</p>
            <button class="btn" style="background: #fff; color: #000; margin-top: 2rem;">Visit Website</button>
        </div>
    `;

    let timeLeft = 10;
    adTimer.innerText = `${timeLeft}s`;

    const countdown = setInterval(() => {
        timeLeft--;
        adTimer.innerText = `${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            adTimer.innerText = 'DONE';
            closeAdBtn.innerText = 'Close & Claim';
            closeAdBtn.disabled = true; // Still disabled until they click something or just show reward
            closeAdBtn.style.display = 'none';

            showReward(product);
        }
    }, 1000);
}

function showReward(product) {
    rewardContainer.classList.remove('hidden');
    downloadLink.innerText = `Download ${product.title}`;
    downloadLink.href = product.file;
    downloadLink.setAttribute('download', product.file); // Force browser download

    // Add a real close button to the reward container or modal
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn';
    closeBtn.innerText = 'Dismiss';
    closeBtn.style.marginTop = '1rem';
    closeBtn.style.background = 'rgba(255,255,255,0.1)';
    closeBtn.style.color = '#fff';
    closeBtn.onclick = () => {
        modal.classList.remove('active');
        closeBtn.remove();
    };
    rewardContainer.appendChild(closeBtn);
}

// Filter Logic
document.querySelectorAll('.btn-filter').forEach(btn => {
    btn.addEventListener('click', () => {
        // Reset old active
        const oldActive = document.querySelector('.btn-filter.active');
        if (oldActive) {
            oldActive.style.background = 'var(--card-bg)';
            oldActive.style.color = '#fff';
            oldActive.classList.remove('active');
        }

        // Set new active
        btn.classList.add('active');
        btn.style.background = 'var(--accent-blue)';
        btn.style.color = '#000';

        renderProducts(btn.dataset.filter);
    });
});

// Random Ad Toasts
function showAdToast() {
    const messages = [
        "🔥 1,200 people just claimed 'HR Nexus Pro'!",
        "⚡ Flash Sale: Get 100% OFF on MailPulse Automation!",
        "💰 You have $15 credit waiting in your account!",
        "🚀 50 new 'Cyberpunk Icon Sets' remain!"
    ];

    const toast = document.createElement('div');
    toast.className = 'ad-toast';
    toast.innerHTML = `
        <div style="font-size: 1.5rem;">🎁</div>
        <div>
            <div style="font-weight: 800; font-size: 0.8rem;">FREEVAULT ALERT</div>
            <div style="font-size: 0.75rem;">${messages[Math.floor(Math.random() * messages.length)]}</div>
        </div>
        <div style="margin-left: auto; cursor: pointer;" onclick="this.parentElement.remove()">✕</div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) toast.remove();
    }, 5000);
}

// Initial Render
renderProducts();

// Start Ad Cycle
setInterval(showAdToast, 8000);

// Fake "Top Banner" Update
setInterval(() => {
    const banners = [
        "Real-time Market Tracker [AD]",
        "Best VPN for 2026 - 90% OFF [AD]",
        "Learn Python in 5 Minutes! [AD]",
        "Claim Your Tesla Now! [AD]"
    ];
    const topBanner = document.getElementById('top-banner-ad');
    if (topBanner) {
        topBanner.querySelector('p').innerText = banners[Math.floor(Math.random() * banners.length)];
    }
}, 4000);
