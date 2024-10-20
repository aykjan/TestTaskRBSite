const sliderModule = (() => {
    let slider;
    let dotsContainer;
    let dots;
    let slides;
    let currentSlideIndex = 0;
    let totalSlides;
    let isDragging = false;
    let startPosition = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let slideWidth;

    const init = () => {
        slider = document.querySelector('.products-slider__container');
        dotsContainer = document.querySelector('.slider-dots');
        slides = document.querySelectorAll('.product-card--slider');
        totalSlides = slides.length;

        // Рассчитываем ширину слайда
        slideWidth = slides[0].offsetWidth;

        createDots(totalSlides);
        updateActiveDot(0);
        updateSlideOpacity();

        // Добавляем обработчики для свайпа
        slider.addEventListener('touchstart', touchStart);
        slider.addEventListener('touchend', touchEnd);
        slider.addEventListener('touchmove', touchMove);

        window.addEventListener('resize', updateSlideWidth);
    };

    const updateSlideWidth = () => {
        slideWidth = slides[0].offsetWidth;
        setSliderPositionByIndex();
    };

    const createDots = (total) => {
        dotsContainer.innerHTML = ''; 
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        }
        dots = document.querySelectorAll('.slider-dot');
    };

    const updateActiveDot = (index) => {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    };

    const updateSlideOpacity = () => {
        slides.forEach((slide, index) => {
            if (index === currentSlideIndex) {
                slide.classList.remove('inactive');
            } else {
                slide.classList.add('inactive');
            }
        });
    };

    const touchStart = (event) => {
        isDragging = true;
        startPosition = event.touches[0].clientX;
        slider.style.transition = 'none'; 
    };

    const touchEnd = () => {
        isDragging = false;
        slider.style.transition = 'transform 0.3s ease-out'; 

        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -50 && currentSlideIndex < totalSlides - 1) {
            currentSlideIndex++;
        } else if (movedBy > 50 && currentSlideIndex > 0) {
            currentSlideIndex--;
        }

        updateActiveDot(currentSlideIndex);
        updateSlideOpacity();
        setSliderPositionByIndex();
    };

    const touchMove = (event) => {
        if (isDragging) {
            const currentPosition = event.touches[0].clientX;
            currentTranslate = prevTranslate + currentPosition - startPosition;

            // Ограничиваем движение слайдера
            if (currentTranslate > 0) {
                currentTranslate = 0;
            } else if (Math.abs(currentTranslate) > slideWidth * (totalSlides - 1)) {
                currentTranslate = -slideWidth * (totalSlides - 1);
            }

            slider.style.transform = `translateX(${currentTranslate}px)`;
        }
    };

    const setSliderPositionByIndex = () => {
        currentTranslate = currentSlideIndex * -slideWidth;
        prevTranslate = currentTranslate;
        slider.style.transform = `translateX(${currentTranslate}px)`;
    };

    return {
        init,
    };
})();

export default sliderModule;
