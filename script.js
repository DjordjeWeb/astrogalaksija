// 1. Podaci za Astro Indikatore
const dailyUpdate = {
    date: "13. Januar 2026.",
    love: 35,
    career: 45,
    intuition: 95,
    messages: {
        love: "Visoka harmonija",
        career: "Potreban oprez",
        intuition: "Snažan unutrašnji glas"
    }
};

// 2. Glavna funkcija koja čeka da se HTML učita
document.addEventListener('DOMContentLoaded', () => {
    
    // Funkcija koja generiše pseudo-nasumičan broj
    function getDailyPercent(seed, offset) {
        const today = new Date();
        const dateNum = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        const val = (Math.sin(dateNum + offset) * 10000);
        return Math.floor(40 + (Math.abs(val) % 56)); 
    } // <--- OVA ZAGRADA MORA DA BUDE TU DA ZATVORI FUNKCIJU IZNAD

    const filterLinks = document.querySelectorAll('.filter-link');
    const currentPath = window.location.pathname.split('/').pop() || 'blog.html';

    filterLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (currentPath === linkPath) {
            link.classList.add('active');
            
            // Koristimo setTimeout od 100ms da bismo bili sigurni da je stranica učitana
            // pre nego što izračunamo poziciju za skrol
            setTimeout(() => {
                const parent = link.closest('.filter-list'); // Pronalazimo <ul> listu
                if (parent) {
                    // Računamo koliko treba da skrolujemo traku da link bude u sredini
                    const linkOffset = link.offsetLeft;
                    const linkWidth = link.offsetWidth;
                    const parentWidth = parent.offsetWidth;
                    
                    const scrollPos = linkOffset - (parentWidth / 2) + (linkWidth / 2);
                    
                    parent.scrollTo({
                        left: scrollPos,
                        behavior: 'smooth'
                    });
                }
            }, 100); 
            
        } else {
            link.classList.remove('active');
        }
    });

// --- ASTRO INDIKATORI ---
const dateEl = document.getElementById('current-date');
if (dateEl) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    dateEl.innerText = new Date().toLocaleDateString('sr-Latn-RS', options);
    
    // Generisanje procenata (svaki ima različit offset da ne bi bili isti brojevi)
    const dailyData = {
        love: getDailyPercent(0, 100),
        career: getDailyPercent(0, 200),
        intuition: getDailyPercent(0, 300)
    };

    // Primena procenata na krugove
    document.getElementById('circle-ljubav')?.style.setProperty('--percent', dailyData.love);
    document.getElementById('circle-posao')?.style.setProperty('--percent', dailyData.career);
    document.getElementById('circle-intuicija')?.style.setProperty('--percent', dailyData.intuition);

    // Dinamičke poruke na osnovu procenta
    const getMsg = (val, type) => {
        if (val > 80) return `Izuzetan dan za ${type}! Zvezde su vam potpuno naklonjene.`;
        if (val > 60) return `Dobar balans u polju ${type}. Iskoristite prilike.`;
        return `Polje ${type} zahteva oprez danas. Budite strpljivi.`;
    };

    if(document.getElementById('desc-ljubav')) document.getElementById('desc-ljubav').innerText = getMsg(dailyData.love, "ljubavi");
    if(document.getElementById('desc-posao')) document.getElementById('desc-posao').innerText = getMsg(dailyData.career, "posla");
    if(document.getElementById('desc-intuicija')) document.getElementById('desc-intuicija').innerText = getMsg(dailyData.intuition, "intuicije");
}

    // --- NAVIGACIJA (HAMBURGER) ---
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.site-header');
    const backToTopBtn = document.getElementById('backToTop');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeMenu();
            }
        });
    }

    function closeMenu() {
        if(navToggle) navToggle.classList.remove('active');
        if(navMenu) navMenu.classList.remove('active');
    }

    // --- SCROLL EFEKTI ---
    window.addEventListener('scroll', () => {
        if (navMenu && navMenu.classList.contains('active')) {
            closeMenu();
        }

        if (header) {
            header.style.boxShadow = window.scrollY > 20 ? "0 5px 20px rgba(0,0,0,0.5)" : "none";
        }

        if (backToTopBtn) {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    }, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- KRISTALNA KUGLA ---
    const orb = document.getElementById('crystal-orb');
    const orbText = document.getElementById('orb-text');
    const resetBtn = document.getElementById('reset-orb');

    const poruke = [
        "Jasno vidim uspeh u vašim planovima.",
        "Energija današnjeg dana traži mir.",
        "Očekujte vest koja menja sve.",
        "Vaša intuicija vas ne vara, verujte joj.",
        "Zvezde kažu: Trenutak je za akciju!"
    ];

    if (orb && orbText && resetBtn) {
        orb.addEventListener('click', function() {
            if (!orb.classList.contains('active')) {
                orb.classList.add('active');
                
                setTimeout(() => {
                    const randomMsg = poruke[Math.floor(Math.random() * poruke.length)];
                    orbText.innerText = randomMsg;
                    orbText.classList.add('show');
                    resetBtn.classList.add('show');
                }, 1500);
            }
        });

        resetBtn.addEventListener('click', function() {
            orb.classList.remove('active');
            orbText.classList.remove('show');
            resetBtn.classList.remove('show');
            orbText.innerText = ""; 
        });
    }

    // --- NEWSLETTER FORME ---
    const handleForm = (formId, statusId, btnId) => {
        const form = document.getElementById(formId);
        const status = document.getElementById(statusId);
        const btn = document.getElementById(btnId);

        if (form) {
            form.addEventListener("submit", function(event) {
                event.preventDefault();
                const data = new FormData(event.target);
                if (btn) { btn.innerText = "SLANJE..."; btn.disabled = true; }

                fetch(event.target.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                }).then(response => {
                    if (response.ok) {
                        form.style.display = "none";
                        if (status) status.innerHTML = "<h3>Uspešno ste se prijavili. Proverite vaš email.</h3>";
                    } else {
                        throw new Error();
                    }
                }).catch(() => {
                    if (status) status.innerHTML = "Greška. Pokušajte ponovo.";
                    if (btn) { btn.disabled = false; btn.innerText = "POKUŠAJ OPET"; }
                });
            });
        }
    };

    handleForm("newsletter-form", "form-status", "submit-btn");
    handleForm("footer-newsletter-form", "footer-form-status", "footer-submit-btn");

    // --- ANIMACIJA ZNAKOVA ---
    const zodiacItems = document.querySelectorAll('.zodiac-item, .zodiac-link-item');
    zodiacItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.05}s`;
    });

    // --- AUTOMATSKO AŽURIRANJE LINKOVA ZA DELJENJE (SHARE) ---
    const currentUrl = window.location.href;
    const shareBtns = document.querySelectorAll('.share-btn');
    
    if (shareBtns.length > 0) {
        shareBtns.forEach(btn => {
            let href = btn.getAttribute('href');
            if (href) {
                // Menja placeholder URL sa trenutnim URL-om stranice
                // encodeURIComponent osigurava da razmaci i kosa crte budu validni
                btn.setAttribute('href', href.replace('https://astrogalksija.rs/blog-post.html', encodeURIComponent(currentUrl)));
            }
        });
    }

    // --- KINESKI HOROSKOP LOGIKA ---
    // Funkciju stavljamo na window objekat da bi je HTML dugme (onclick) videlo
    window.izracunajKineskiZnak = function() {
        const godinaInput = document.getElementById('birthYear');
        const rezultatDiv = document.getElementById('zodiacResult');

        if (!godinaInput) return; // Sigurnosna provera

        const godina = godinaInput.value;

        if (!godina || godina < 1900 || godina > 2099) {
            alert("Molimo unesite validnu godinu (1900-2099)");
            return;
        }

        const znakovi = [
            { ime: "Majmun", opis: "Majmun je simbol inteligencije, snalažljivosti i mentalne brzine. Osobe rođene u ovom znaku poseduju izraženu radoznalost i sposobnost da se prilagode gotovo svakoj situaciji. Njihov um stalno traži stimulaciju, zbog čega često deluju nemirno ili nepredvidivo. Iza njihove razigranosti krije se duboka potreba za priznanjem i dokazivanjem sopstvene vrednosti. Majmun može biti izuzetno šarmantan i duhovit, ali i sklon manipulaciji ako oseća da gubi kontrolu ili interesovanje." },
            { ime: "Petao", opis: "Petao predstavlja disciplinu, preciznost i snažan osećaj ličnog ponosa. Ljudi ovog znaka imaju potrebu da budu primećeni i poštovani, naročito zbog svog rada i truda. Njihov perfekcionizam može biti izvor velikih uspeha, ali i unutrašnje napetosti. Petao ne podnosi haos i nejasnoću, te često preuzima ulogu organizatora ili kritičara. Iako mogu delovati strogo, u svojoj suštini su odani i spremni da se bore za ono u šta veruju." },
            { ime: "Pas", opis: "Pas je znak lojalnosti, pravde i moralnih principa. Osobe rođene u ovom znaku imaju snažno razvijen osećaj za ispravno i pogrešno i često osećaju odgovornost prema drugima. Njihova empatija i zaštitnička priroda čine ih pouzdanim prijateljima i partnerima. Ipak, Pas može biti sklon sumnji, brizi i pesimizmu, naročito kada izgubi poverenje. Njegov najveći izazov je da nauči da ne nosi teret sveta na sopstvenim plećima." },
            { ime: "Svinja", opis: "Svinja simbolizuje iskrenost, velikodušnost i uživanje u životu. Ljudi ovog znaka imaju toplu prirodu i duboku potrebu za mirom, stabilnošću i zadovoljstvom. Njihova dobrota često ih čini ranjivima, jer veruju u dobre namere drugih. Svinja voli komfor, ali to ne znači da je lenja; kada ima jasan cilj, pokazuje izuzetnu istrajnost. Njena životna lekcija leži u postavljanju granica i očuvanju lične energije." },
            { ime: "Pacov", opis: "Pacov je simbol inteligencije, strategije i preživljavanja. Osobe ovog znaka imaju izražen instinkt i sposobnost da prepoznaju prilike tamo gde ih drugi ne vide. Njihova ambicija i snalažljivost često ih vode ka materijalnoj sigurnosti. Pacov može delovati rezervisano ili proračunato, ali iza toga se krije strah od gubitka kontrole. Njegova snaga je u prilagodljivosti, a izazov u poverenju i emotivnom otvaranju." },
            { ime: "Bivo", opis: "Bivo predstavlja stabilnost, strpljenje i unutrašnju snagu. Ljudi rođeni u ovom znaku su uporni, pouzdani i spremni na dugotrajan rad bez potrebe za spoljnim priznanjem. Njihova energija je tiha, ali moćna. Bivo ne voli promene i može biti tvrdoglav kada se oseća ugroženo. Ipak, njegova odanost i doslednost čine ga temeljem svake zajednice. Njegov put vodi ka učenju fleksibilnosti i emocionalne otvorenosti." },
            { ime: "Tigar", opis: "Tigar je simbol hrabrosti, strasti i snažne individualnosti. Osobe ovog znaka imaju izraženu potrebu za slobodom i često deluju buntovno ili impulsivno. Njihova energija je magnetna i inspirativna, ali može biti i destruktivna ako nije usmerena. Tigar ne podnosi ograničenja i autoritete koji nemaju unutrašnji integritet. Njegova najveća snaga je hrabrost da živi autentično, a izazov je kontrola emocija i strpljenje." },
            { ime: "Zec", opis: "Zec simbolizuje nežnost, diplomatiju i unutrašnji mir. Ljudi ovog znaka teže harmoniji i izbegavaju konflikte kad god je to moguće. Njihova intuicija je suptilna, ali snažna, a sposobnost da osete atmosferu oko sebe čini ih odličnim posrednicima. Iza mirne spoljašnjosti često se krije osetljiva priroda koja lako biva povređena. Zec mora naučiti da se zauzme za sebe bez osećaja krivice." },
            { ime: "Zmaj", opis: "Zmaj je najmoćniji znak kineskog horoskopa i simbol vitalnosti, vizije i autoriteta. Osobe rođene u ovom znaku poseduju snažnu energiju koja prirodno privlači pažnju drugih. Zmaj ima velike ambicije i često oseća da je rođen za nešto više. Njegova slabost može biti ego i nestrpljenje. Kada nauči da balansira snagu sa mudrošću, Zmaj postaje izvor inspiracije i pokretačka sila promena." },
            { ime: "Zmija", opis: "Zmija predstavlja intuiciju, mudrost i duboku introspektivnost. Ljudi ovog znaka su analitični, tihi posmatrači koji retko otkrivaju svoje misli. Njihova snaga leži u sposobnosti da razumeju skrivene motive i suptilne tokove energije. Zmija može delovati misteriozno ili distancirano, ali iza toga se krije snažna emocionalna dubina. Njena lekcija je u poverenju i deljenju unutrašnjeg sveta sa drugima." },
            { ime: "Konj", opis: "Konj simbolizuje slobodu, kretanje i životnu energiju. Osobe ovog znaka su aktivne, optimistične i vole nezavisnost. Njihov entuzijazam je zarazan, ali mogu biti nestrpljive i sklone brzom sagorevanju. Konj ne voli rutinu i oseća se ugušeno u ograničavajućim okolnostima. Njegov izazov je pronalaženje balansa između slobode i odgovornosti." },
            { ime: "Koza", opis: "Koza predstavlja kreativnost, senzibilnost i duboku emotivnost. Ljudi ovog znaka imaju izražen umetnički duh i potrebu za lepim i smislenim okruženjem. Njihova empatija je snažna, ali ih može dovesti do emocionalne iscrpljenosti. Koza često traži podršku i razumevanje, ali poseduje unutrašnju snagu koja se aktivira u pravim trenucima. Njena životna lekcija je samopouzdanje i vera u sopstvenu vrednost." }
        ];

        // Izračunavanje (Ostatak pri deljenju sa 12 određuje znak)
        const index = godina % 12;
        const mojZnak = znakovi[index];

        // Prikaz rezultata
        rezultatDiv.innerHTML = `
            <div class="result-animal-name">${mojZnak.ime}</div>
            <p>${mojZnak.opis}</p>
        `;
        
        rezultatDiv.classList.add('active');
        
        // Automatski scroll do rezultata na mobilnom
        rezultatDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
});