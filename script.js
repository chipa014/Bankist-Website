'use strict';

//Modal window
const modalWindow = function () {
  //Elements
  const modal = document.querySelector('.modal');
  const overlay = document.querySelector('.overlay');
  const btnCloseModal = document.querySelector('.btn--close-modal');
  const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

  //Functions
  const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  //Initialisation
  btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
};

//  Navigation
const navigation = function () {
  //Elements
  const navPanel = document.querySelector('.nav');
  //Functions
  //  Hoverover fadeout animation
  const hoveroverFadeout = function () {
    const handleHover = function (e) {
      if (!e.target.classList.contains('nav__link')) return;
      const targetLink = e.target;
      const linkSiblings = targetLink
        .closest('.nav')
        .querySelectorAll('.nav__link');
      const logo = targetLink.closest('.nav').querySelector('.nav__logo');
      linkSiblings.forEach(link => {
        if (link !== targetLink) link.style.opacity = this;
      });
      logo.style.opacity = this;
    };

    navPanel.addEventListener('mouseover', handleHover.bind(0.5));
    navPanel.addEventListener('mouseout', handleHover.bind(1));
  };

  //  Navigation scrolldown
  const navScrolldown = function () {
    //Elements
    const navLinks = document.querySelector('.nav__links');
    const btnScrollTo = document.querySelector('.btn--scroll-to');
    const section1 = document.querySelector('#section--1');
    //Functions
    navLinks.addEventListener('click', function (e) {
      e.preventDefault();
      if (
        e.target.classList.contains('nav__link') &&
        !e.target.classList.contains('nav__link--btn')
      ) {
        document
          .querySelector(e.target.getAttribute('href'))
          .scrollIntoView({ behavior: 'smooth' });
      }
    });

    //Initialisation
    btnScrollTo.addEventListener('click', function (e) {
      section1.scrollIntoView({ behavior: 'smooth' });
    });
  };

  //  Sticky navigation bar
  const stickyNav = function () {
    //Elements
    const header = document.querySelector('.header');

    //Constants
    const navPanelHeight = navPanel.getBoundingClientRect().height;

    //Functions
    const obsStickyNav = function (entries) {
      const [entry] = entries;
      if (entry.isIntersecting) navPanel.classList.remove('sticky');
      else navPanel.classList.add('sticky');
    };

    //Initialisation
    const headerObserver = new IntersectionObserver(obsStickyNav, {
      root: null,
      threshold: 0,
      rootMargin: `${-navPanelHeight}px`,
    });
    headerObserver.observe(header);
  };

  const navInit = function () {
    hoveroverFadeout();
    navScrolldown();
    stickyNav();
  };

  navInit();
};

//  Smooth section reveal
const smoothSectionReveal = function () {
  //Elements
  const sections = document.querySelectorAll('.section');

  //Functions
  const smoothSection = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  };

  const sectionObserver = new IntersectionObserver(smoothSection, {
    root: null,
    threshold: 0.15,
  });

  //Initialisation
  sections.forEach(section => {
    section.classList.add('section--hidden');
    sectionObserver.observe(section);
  });
};

//  Lazy image loading
const lazyImageLoading = function () {
  //Elements
  const featureImages = document.querySelectorAll('img[data-src]');

  //Functions
  const loadImageProperly = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    const img = entry.target;
    if (!img.classList.contains('lazy-img')) return;
    img.src = img.dataset.src;
    const unblur = function () {
      img.classList.remove('lazy-img');
      img.removeEventListener('load', unblur);
    };
    img.addEventListener('load', unblur);
    observer.unobserve(img);
  };

  const imageObserver = new IntersectionObserver(loadImageProperly, {
    root: null,
    threshold: 0,
    rootMargin: '200px',
  });

  //Initialisation
  featureImages.forEach(img => imageObserver.observe(img));
};

//Tab component
const tabComponent = function () {
  //Elements
  const opsTabContainer = document.querySelector('.operations__tab-container');
  const opsTabs = document.querySelectorAll('.operations__tab');
  const opsContent = document.querySelectorAll('.operations__content');

  //Initialisation
  opsTabContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');
    if (!clicked) return;
    opsTabs.forEach(el => el.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');
    opsContent.forEach(el =>
      el.classList.remove('operations__content--active')
    );
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  });
};

//  Slider menu
const sliderMenu = function () {
  //Elements
  const slides = document.querySelectorAll('.slide');
  const sliderBtnLeft = document.querySelector('.slider__btn--left');
  const sliderBtnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  //Variables
  let curSlide = 0;

  //Functions
  const newActiveDot = function () {
    dotContainer.querySelectorAll('.dots__dot').forEach((btn, i) => {
      if (i !== curSlide) btn.classList.remove('dots__dot--active');
      else btn.classList.add('dots__dot--active');
    });
  };

  const shiftSlides = function (newCurSlide) {
    slides.forEach(function (slide, i) {
      slide.style.transform = `TranslateX(${100 * (i - newCurSlide)}%)`;
    });
    curSlide = newCurSlide;
    newActiveDot();
  };

  const shiftLeft = function () {
    if (curSlide === 0) curSlide = slides.length - 1;
    else curSlide--;
    shiftSlides(curSlide);
  };

  const shiftRight = function () {
    if (curSlide === slides.length - 1) curSlide = 0;
    else curSlide++;
    shiftSlides(curSlide);
  };

  const createDots = function () {
    slides.forEach((_, i) => {
      const html = `<button class="dots__dot ${
        i === 0 ? 'dots__dot--active' : ''
      }" data-slide="${i}"></button>`;
      dotContainer.insertAdjacentHTML('beforeend', html);
    });
    dotContainer.addEventListener('click', function (e) {
      const button = e.target;
      if (!button.classList.contains('dots__dot')) return;
      shiftSlides(+button.dataset.slide);
    });
    dotContainer.addEventListener('mouseover', function (e) {
      const button = e.target.closest('.dots__dot');
      if (!button) return;
      button.classList.add('dots__dot--active');
    });
    dotContainer.addEventListener('mouseout', function (e) {
      const button = e.target.closest('.dots__dot');
      console.log(button);
      if (!button) return;
      if (+button.dataset.slide !== curSlide)
        button.classList.remove('dots__dot--active');
    });
  };

  //Initialisation
  const sliderInit = function () {
    createDots();
    shiftSlides(0);
    sliderBtnLeft.addEventListener('click', shiftLeft);
    sliderBtnRight.addEventListener('click', shiftRight);
    document.addEventListener('keydown', function (e) {
      //Preventing scrolling the page to the left with the keys
      e.preventDefault();
      if (e.key === 'ArrowRight') {
        shiftRight();
        return;
      }
      if (e.key === 'ArrowLeft') shiftLeft();
    });
  };
  sliderInit();
};

const init = function () {
  modalWindow();
  navigation();
  smoothSectionReveal();
  lazyImageLoading();
  tabComponent();
  sliderMenu();
};

init();
