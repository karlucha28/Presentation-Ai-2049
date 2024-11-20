let player;
let isVideoPlaying = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('videoPlayer', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    player.mute();
    // Store player reference globally
    window.youtubePlayer = player;
}

function onPlayerStateChange(event) {
    // Track video state
    isVideoPlaying = event.data === YT.PlayerState.PLAYING;
}

// Load YouTube API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Handle deep scroll animations
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const deepScrollSection = document.querySelector('.deep-scroll');
    const wrapper = document.querySelector('.wrapper');
    const content = document.querySelector('.content');
    const transitionPoint = deepScrollSection.offsetHeight;
    const pauseDuration = window.innerHeight; // 100vh pause
    const video = document.querySelector('.video-container');
    const videoTriggerPoint = transitionPoint - window.innerHeight;
    const darknessEndPoint = transitionPoint * (275/300); // Match with CSS animation range
    
    if (scrollTop <= transitionPoint) {
        // Deep scroll section (30%)
        document.documentElement.style.setProperty('--scrollTop', `${scrollTop}px`);
        wrapper.style.display = 'none';
        wrapper.classList.remove('active');
        
        // Update video trigger point to match darkness transition
        if (scrollTop >= darknessEndPoint) {
            video.style.opacity = '1';
            if (!isVideoPlaying && window.youtubePlayer) {
                window.youtubePlayer.unMute();
                window.youtubePlayer.playVideo();
            }
        } else {
            video.style.opacity = '0';
            if (isVideoPlaying && window.youtubePlayer) {
                window.youtubePlayer.mute();
                window.youtubePlayer.pauseVideo();
            }
        }
    } else {
        // Fairy forest section (70%)
        wrapper.style.display = 'block';
        video.style.opacity = '0';
        if (player && player.pauseVideo) {
            player.pauseVideo();
            player.mute();
        }
        
        const forestScrollTop = scrollTop - transitionPoint;
        
        // During pause, handle fade in
        if (forestScrollTop <= pauseDuration) {
            wrapper.classList.add('active');
            document.documentElement.style.setProperty('--scrollTop', '0px');
            content.style.transform = 'translateY(0)';
        } else {
            // Slower, smoother scrolling after pause
            const adjustedScroll = (forestScrollTop - pauseDuration) * 0.7; // Reduced from (7/3)
            document.documentElement.style.setProperty('--scrollTop', `${adjustedScroll}px`);
            content.style.transform = `translateY(${-adjustedScroll}px)`;
        }
    }
    
    // Updated video handling logic
    if (scrollTop >= videoTriggerPoint && scrollTop <= transitionPoint) {
        if (!isVideoPlaying && window.youtubePlayer) {
            window.youtubePlayer.unMute();
            window.youtubePlayer.playVideo();
        }
    } else {
        if (isVideoPlaying && window.youtubePlayer) {
            window.youtubePlayer.mute();
            window.youtubePlayer.pauseVideo();
        }
    }
});

// Initialize GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
ScrollSmoother.create({
    wrapper: '.wrapper',
    content: '.content',
    smooth: 2.5, // Increased from 1.5
    effects: true,
    normalizeScroll: true,
    smoothTouch: 0.1,
    ease: "power2.out" // Added easing function
});