let player;
let isVideoPlaying = false;

const video = document.querySelector('#videoPlayer');
const audio = document.querySelector('#videoAudio');
const soundToggle = document.querySelector('#soundToggle');
let audioEnabled = false;

// Enable sound on click
soundToggle.addEventListener('click', () => {
    if (!audioEnabled) {
        audioEnabled = true;
        audio.volume = 0.5;
        soundToggle.textContent = '🔊 Sound On';
        if (!video.paused) {
            audio.currentTime = video.currentTime;
            audio.play();
        }
    } else {
        audioEnabled = false;
        audio.pause();
        soundToggle.textContent = '🔊 Enable Sound';
    }
});

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const deepScrollSection = document.querySelector('.deep-scroll');
    const wrapper = document.querySelector('.wrapper');
    const content = document.querySelector('.content');
    const transitionPoint = deepScrollSection.offsetHeight;
    const pauseDuration = window.innerHeight;
    const videoContainer = document.querySelector('.video-container');
    const darknessEndPoint = transitionPoint * (275/300);
    
    if (scrollTop <= transitionPoint) {
        document.documentElement.style.setProperty('--scrollTop', `${scrollTop}px`);
        wrapper.style.display = 'none';
        wrapper.classList.remove('active');
        
        if (scrollTop >= darknessEndPoint) {
            videoContainer.style.opacity = '1';
            videoContainer.classList.add('active');
            video.play().catch(e => console.log("Video play failed:", e));
            if (audioEnabled) {
                audio.play().catch(e => console.log("Audio play failed:", e));
            }
        } else {
            videoContainer.style.opacity = '0';
            videoContainer.classList.remove('active');
            video.pause();
            if (audioEnabled) {
                audio.pause();
            }
        }
    } else {
        wrapper.style.display = 'block';
        videoContainer.style.opacity = '0';
        video.pause();
        audio.pause();
        audio.currentTime = 0;
        
        const forestScrollTop = scrollTop - transitionPoint;
        
        if (forestScrollTop <= pauseDuration) {
            wrapper.classList.add('active');
            document.documentElement.style.setProperty('--scrollTop', '0px');
            content.style.transform = 'translateY(0)';
        } else {
            const adjustedScroll = (forestScrollTop - pauseDuration) * 0.7;
            document.documentElement.style.setProperty('--scrollTop', `${adjustedScroll}px`);
            content.style.transform = `translateY(${-adjustedScroll}px)`;
        }
    }
});

// Initialize GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
ScrollSmoother.create({
    wrapper: '.wrapper',
    content: '.content',
    smooth: 2.5,
    effects: true,
    normalizeScroll: true,
    smoothTouch: 0.1,
    ease: "power2.out"
});