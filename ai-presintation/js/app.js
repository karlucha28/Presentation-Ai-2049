let player;
let isVideoPlaying = false;

const video = document.querySelector('#videoPlayer');
const audio = document.querySelector('#videoAudio');
let audioEnabled = false;

// Show alert when page loads
window.addEventListener('load', () => {
    if (confirm('This experience includes sound. Would you like to enable audio?')) {
        audioEnabled = true;
        audio.volume = 0.5;
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
    
    const finalVideo = document.querySelector('#finalVideo');
    const finalVideoContainer = document.querySelector('.final-video-container');
    const finalVideoSection = document.querySelector('.final-video-section');
    
    // Check if we've scrolled to the final section
    const finalVideoStart = transitionPoint + content.offsetHeight;
    
    if (scrollTop >= finalVideoStart) {
        finalVideoContainer.classList.add('active');
        finalVideo.play()
            .then(() => console.log("Final video playing"))
            .catch(e => console.log("Final video play failed:", e));
    } else {
        finalVideoContainer.classList.remove('active');
        finalVideo.pause();
    }
    
    const resourceGraph = document.querySelector('.graph-overlay:not(.social)');
    const socialGraph = document.querySelector('.graph-overlay.social');
    
    // Check if we've scrolled to the social cost section
    const socialGraphStart = finalVideoStart + window.innerHeight;
    
    if (scrollTop >= socialGraphStart) {
        resourceGraph.classList.add('hidden');
        socialGraph.classList.add('active');
    } else {
        resourceGraph.classList.remove('hidden');
        socialGraph.classList.remove('active');
    }
    
    const govGraph = document.querySelector('.graph-overlay.government');
    
    // Check if we've scrolled to the government spending section
    const govGraphStart = socialGraphStart + window.innerHeight;
    
    if (scrollTop >= govGraphStart) {
        resourceGraph.classList.add('hidden');
        socialGraph.classList.add('hidden');
        govGraph.classList.add('active');
    } else if (scrollTop >= socialGraphStart) {
        resourceGraph.classList.add('hidden');
        socialGraph.classList.add('active');
        socialGraph.classList.remove('hidden');
        govGraph.classList.remove('active');
    } else {
        resourceGraph.classList.remove('hidden');
        socialGraph.classList.remove('active');
        govGraph.classList.remove('active');
    }
    
    const aiGraph = document.querySelector('.graph-overlay.ai-budget');
    
    // Check if we've scrolled to the AI budget section
    const aiBudgetStart = govGraphStart + window.innerHeight;
    
    if (scrollTop >= aiBudgetStart) {
        socialGraph.classList.add('hidden');
        govGraph.classList.add('hidden');
        aiGraph.classList.add('active');
    } else if (scrollTop >= govGraphStart) {
        socialGraph.classList.add('hidden');
        govGraph.classList.add('active');
        govGraph.classList.remove('hidden');
        aiGraph.classList.remove('active');
    } else if (scrollTop >= socialGraphStart) {
        resourceGraph.classList.add('hidden');
        socialGraph.classList.add('active');
        socialGraph.classList.remove('hidden');
        govGraph.classList.remove('active');
        aiGraph.classList.remove('active');
    } else {
        resourceGraph.classList.remove('hidden');
        socialGraph.classList.remove('active');
        govGraph.classList.remove('active');
        aiGraph.classList.remove('active');
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