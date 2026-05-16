// ============ ТЕМА (САМОЕ ВАЖНОЕ В НАЧАЛЕ) ============
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Меняем иконку
    const themeBtn = document.querySelector('.theme-btn');
    if (themeBtn) {
        themeBtn.textContent = isDark ? '☀️' : '🌙';
    }
}

// Загружаем сохраненную тему при загрузке страницы
(function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        const themeBtn = document.querySelector('.theme-btn');
        if (themeBtn) themeBtn.textContent = '☀️';
    } else {
        const themeBtn = document.querySelector('.theme-btn');
        if (themeBtn) themeBtn.textContent = '🌙';
    }
})();

// ============ АКТИВНАЯ ССЫЛКА ПРИ СКРОЛЛЕ ============
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    const navLinks = document.querySelectorAll('nav a, .desktop-nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============ ПЛАВНЫЙ СКРОЛЛ ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            // Закрываем мобильное меню если открыто
            const mobileNav = document.querySelector('.desktop-nav');
            if (mobileNav) mobileNav.classList.remove('show');
        }
    });
});

// ============ КОМПЕТЕНЦИИ (ТАБЫ) ============
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        tabContents.forEach(content => content.classList.remove('active'));
        const activeTab = document.getElementById(`tab-${tabId}`);
        if (activeTab) activeTab.classList.add('active');
    });
});

// ============ СЛАЙДЕР (1 ИЗОБРАЖЕНИЕ ЗА РАЗ) ============
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

function initSlider() {
    const items = document.querySelectorAll('.slider-item');
    totalItems = items.length;
    
    if (totalItems === 0) return;
    
    const firstItem = items[0];
    if (firstItem) {
        itemWidth = firstItem.offsetWidth;
    }
    
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

// ============ ПРОЕКТЫ (МОДАЛЬНЫЕ ОКНА) ============
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

// ============ ГАЛЕРЕЯ ДОКУМЕНТОВ ============
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
            <img src="${image.src}" alt="${image.alt}" loading="lazy" onerror="this.style.display='none'">
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
    
    if (imgElement) {
        imgElement.src = image.src;
        imgElement.alt = image.alt;
    }
    if (counterElement) {
        counterElement.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    }
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

// ============ МОБИЛЬНОЕ МЕНЮ (ЕСЛИ ИСПОЛЬЗУЕТСЯ) ============
function toggleMobileMenu() {
    const nav = document.querySelector('.desktop-nav');
    if (nav) {
        nav.classList.toggle('show');
    }
}

// Переключатель темы для мобильной кнопки (дубль на всякий случай)
document.addEventListener('DOMContentLoaded', function() {
    // Находим все кнопки темы и вешаем обработчик
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        // Удаляем старые обработчики, чтобы не было дублей
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', toggleTheme);
    });
});
