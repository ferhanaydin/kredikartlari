// Mock Data for Campaigns
const campaigns = [
    {
        id: 1,
        title: "Market Alışverişlerinize 500 TL'ye Varan Bonus!",
        desc: "Garanti BBVA kredi kartınızla anlaşmalı marketlerden yapacağınız her 1000 TL ve üzeri alışverişe 50 TL, toplamda 500 TL Bonus.",
        category: "market",
        categoryName: "🛒 Market",
        bank: "garanti",
        bankLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Garanti_BBVA_logo.svg/512px-Garanti_BBVA_logo.svg.png",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
        endDate: "30 Mayıs 2026",
    },
    {
        id: 2,
        title: "Akaryakıtta %5 MaxiPuan Fırsatı",
        desc: "İş Bankası Maximum Kart ile anlaşmalı istasyonlardan yapacağınız akaryakıt alımlarında anında %5 MaxiPuan kazanın.",
        category: "akaryakit",
        categoryName: "⛽ Akaryakıt",
        bank: "isbankasi",
        bankLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Isbank_logo.svg/512px-Isbank_logo.svg.png",
        image: "https://images.unsplash.com/photo-1541884053360-e41c45df16a7?auto=format&fit=crop&q=80&w=600",
        endDate: "15 Haziran 2026",
    },
    {
        id: 3,
        title: "Giyim Harcamalarınıza Ekstra +3 Taksit",
        desc: "Worldcard ile yapacağınız tüm giyim ve aksesuar harcamalarında peşin fiyatına +3 taksit fırsatını kaçırmayın.",
        category: "giyim",
        categoryName: "👗 Giyim",
        bank: "ykb",
        bankLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Yap%C4%B1_Kredi_logo.svg/512px-Yap%C4%B1_Kredi_logo.svg.png",
        image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=600",
        endDate: "10 Mayıs 2026",
    },
    {
        id: 4,
        title: "Miles&Smiles ile Uçak Biletlerinde Çift Mil",
        desc: "THY ve Star Alliance uçuşlarında kullanacağınız Miles&Smiles kredi kartınızla bilet alımlarınızda çift mil kazanın.",
        category: "seyahat",
        categoryName: "✈️ Seyahat",
        bank: "garanti",
        bankLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Garanti_BBVA_logo.svg/512px-Garanti_BBVA_logo.svg.png",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=600",
        endDate: "31 Aralık 2026",
    },
    {
        id: 5,
        title: "Elektronik Alışverişinize 1000 TL Chip-Para",
        desc: "Akbank Axess kartınızla teknoloji marketlerinden yapacağınız 15.000 TL üzeri ilk alışverişe anında 1000 TL chip-para.",
        category: "elektronik",
        categoryName: "💻 Elektronik",
        bank: "akbank",
        bankLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Akbank_logo.svg/512px-Akbank_logo.svg.png",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=600",
        endDate: "20 Haziran 2026",
    },
    {
        id: 6,
        title: "CardFinans ile Tatil Harcamalarına Yüzde 10 İndirim",
        desc: "Seçili turizm acentelerinde QNB Finansbank CardFinans kredi kartı ile yapacağınız rezervasyonlara anında %10 indirim.",
        category: "seyahat",
        categoryName: "✈️ Seyahat",
        bank: "qnb",
        bankLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/QNB_Finansbank_logo.svg/512px-QNB_Finansbank_logo.svg.png",
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600",
        endDate: "31 Ağustos 2026",
    }
];

// DOM Elements
const campaignsGrid = document.getElementById('campaignsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const bankSelect = document.getElementById('bankSelect');
const searchInput = document.getElementById('searchInput');

// Render Campaigns
function renderCampaigns(data) {
    campaignsGrid.innerHTML = '';
    
    if(data.length === 0) {
        campaignsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">
                Aradığınız kriterlere uygun kampanya bulunamadı.
            </div>
        `;
        return;
    }

    data.forEach((campaign, index) => {
        // Staggered animation effect
        const animationDelay = index * 0.1;
        
        const cardHtml = `
            <article class="card" style="animation: fadeInUp 0.5s ease forwards ${animationDelay}s; opacity: 0; transform: translateY(20px);">
                <div class="card-img-wrapper">
                    <img src="${campaign.image}" alt="${campaign.title}" class="card-img">
                    <span class="card-badge">${campaign.categoryName}</span>
                    <img src="${campaign.bankLogo}" alt="Banka" class="card-bank-logo" onerror="this.src='https://via.placeholder.com/48?text=Banka'">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${campaign.title}</h3>
                    <p class="card-desc">${campaign.desc}</p>
                    <div class="card-footer">
                        <div class="card-date">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            Son: ${campaign.endDate}
                        </div>
                        <a href="#" class="card-link">
                            Detay 
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </a>
                    </div>
                </div>
            </article>
        `;
        campaignsGrid.insertAdjacentHTML('beforeend', cardHtml);
    });
}

// Global CSS animation for staggered cards
document.head.insertAdjacentHTML('beforeend', `
    <style>
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
`);

// Filtering Logic
function filterData() {
    const activeCategoryBtn = document.querySelector('.filter-btn.active');
    const categoryFilter = activeCategoryBtn ? activeCategoryBtn.dataset.filter : 'all';
    const bankFilter = bankSelect.value;
    const searchTerm = searchInput.value.toLowerCase();
    
    const filtered = campaigns.filter(item => {
        const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
        const matchBank = bankFilter === 'all' || item.bank === bankFilter;
        const matchSearch = item.title.toLowerCase().includes(searchTerm) || 
                            item.desc.toLowerCase().includes(searchTerm) ||
                            item.bank.toLowerCase().includes(searchTerm);
                            
        return matchCategory && matchBank && matchSearch;
    });
    
    renderCampaigns(filtered);
}

// Event Listeners
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterData();
    });
});

bankSelect.addEventListener('change', filterData);
searchInput.addEventListener('input', filterData);

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    renderCampaigns(campaigns);
});
