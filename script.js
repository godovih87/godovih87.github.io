// Theme toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// Active nav link
window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Competencies tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`tab-${tabId}`).classList.add('active');
    });
});

// ============ SLIDER FUNCTIONALITY - 1 IMAGE AT A TIME ============
const slider = document.getElementById('docsSlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('sliderDots');

let currentIndex = 0;
let totalItems = 0;
let itemWidth = 0;

function updateSlider() {
    if (!slider) return;
    const scrollPosition = currentIndex * (itemWidth + 20);
    slider.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });
    updateDots();
    updateButtons();
}

function updateDots() {
    if (!dotsContainer) return;
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function updateButtons() {
    if (prevBtn) {
        prevBtn.disabled = currentIndex === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = currentIndex >= totalItems - 1;
    }
}

function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalItems) index = totalItems - 1;
    currentIndex = index;
    updateSlider();
}

// Create dots
function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalItems; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

// Initialize slider
function initSlider() {
    const items = document.querySelectorAll('.slider-item');
    totalItems = items.length;
    
    if (totalItems === 0) return;
    
    const firstItem = items[0];
    itemWidth = firstItem.offsetWidth;
    
    createDots();
    updateButtons();
    
    if (slider) {
        slider.addEventListener('scroll', () => {
            const newIndex = Math.round(slider.scrollLeft / (itemWidth + 20));
            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalItems) {
                currentIndex = newIndex;
                updateDots();
                updateButtons();
            }
        });
    }
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalItems - 1) {
            currentIndex++;
            updateSlider();
        }
    });
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const items = document.querySelectorAll('.slider-item');
        if (items.length > 0) {
            itemWidth = items[0].offsetWidth;
            updateSlider();
        }
    }, 200);
});

document.addEventListener('DOMContentLoaded', initSlider);

// ============ PROJECT MODALS ============
function openProjectModal(projectId) {
    const projects = {
        electronics: {
            title: 'Система регистрации пропусков',
            description: 'Веб-приложение для автоматизации пропускного режима на территории предприятия.',
            technologies: 'C#, ASP.NET, Entity Framework, SQL Server, MVC',
            features: [
                'Создание разового пропуска, ввод данных посетителя и транспортного средства',
                'Выбор павильона и времени въезда и выезда',
                'Автоматическая генерация QR-кода для идентификации пропуска',
                'Регистрация въезда и выезда по QR-коду',
                'Автоматическая фиксация времени'
            ],
            link: 'https://github.com/godovih87/ExhibitionEntrySystem.git'
        },
        assistant: {
            title: 'Голосовой ассистент',
            description: 'Голосовой ассистент с распознаванием и синтезом речи.',
            technologies: 'Python',
            features: [
                'Распознавание голоса в реальном времени',
                'Синтез речи для ответов ассистента',
                'Команда "Подбрось монетку" (орел/решка)',
                'Поиск в Google по голосовой команде',
                'Смена языка интерфейса (RU/EN)'
            ],
            link: 'https://github.com/godovih87/VoiseAssistant.git'
        },
        analysis: {
            title: 'Pavilion planner',
            description: 'Десктопное приложение для автоматизации планирования павильонов.',
            technologies: 'C#, WPF, Entity Framework, SQL Server',
            features: [
                'Создание и редактирование цифрового макета выставочного павильона',
                'Размещение стендов с помощью интерактивного интерфейса',
                'Автоматическая генерация чертежей и схем с размерами',
                'Управление пользователями с разграничением прав доступа'
            ],
            link: '#'
        }
    };
    
    const project = projects[projectId];
    if (!project) return;
    
    const modalHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h2 class="modal-title">${project.title}</h2>
                <div class="modal-tech">${project.technologies}</div>
                <p class="modal-description">${project.description}</p>
                <div class="modal-features">
                    <h4>Основные возможности:</h4>
                    <ul>
                        ${project.features.map(f => `<li>✓ ${f}</li>`).join('')}
                    </ul>
                </div>
                <a href="${project.link}" class="modal-link" target="_blank">Перейти к проекту →</a>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ============ DOCS GALLERY ============
const galleryImages = [
    { src: "sertif.jpg", alt: "Сертификат участника" },
    { src: "sertif2.jpg", alt: "Сертификат участника" },
    { src: "samolet.jpg", alt: "Сертификат участника" },
    { src: "samolet2.jpg", alt: "Сертификат участника" },
];

let currentImageIndex = 0;

function renderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = '';
    
    galleryImages.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-index', index);
        galleryItem.innerHTML = `
            <img src="${image.src}" alt="${image.alt}" loading="lazy">
            <div class="gallery-overlay">
                <p>${image.alt}</p>
            </div>
        `;
        
        galleryItem.addEventListener('click', () => openLightbox(index));
        galleryGrid.appendChild(galleryItem);
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    const image = galleryImages[currentImageIndex];
    
    const lightboxHTML = `
        <div class="lightbox" onclick="closeLightbox(event)">
            <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
            <button class="lightbox-prev" onclick="prevImage(event)">❮</button>
            <img src="${image.src}" alt="${image.alt}">
            <button class="lightbox-next" onclick="nextImage(event)">❯</button>
            <div class="lightbox-counter">${currentImageIndex + 1} / ${galleryImages.length}</div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
    if (event && event.target !== event.currentTarget && !event.target.classList.contains('lightbox-close')) return;
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.remove();
        document.body.style.overflow = '';
    }
}

function prevImage(event) {
    event.stopPropagation();
    currentImageIndex--;
    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    }
    updateLightboxImage();
}

function nextImage(event) {
    event.stopPropagation();
    currentImageIndex++;
    if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }
    updateLightboxImage();
}

function updateLightboxImage() {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;
    
    const image = galleryImages[currentImageIndex];
    const imgElement = lightbox.querySelector('img');
    const counterElement = lightbox.querySelector('.lightbox-counter');
    
    imgElement.src = image.src;
    imgElement.alt = image.alt;
    counterElement.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
}

document.addEventListener('keydown', function(e) {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;
    
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        prevImage(e);
    } else if (e.key === 'ArrowRight') {
        nextImage(e);
    }
});

document.addEventListener('DOMContentLoaded', renderGallery);