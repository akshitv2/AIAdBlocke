// 1. Immediately hide all images via CSS injection
const style = document.createElement('style');
style.innerHTML = 'img { visibility: hidden !important; }';
document.documentElement.appendChild(style);

const vetImages = async () => {
    const images = Array.from(document.querySelectorAll('img'));
    const imageUrls = images.map(img => img.src).filter(src => src.startsWith('http'));

    if (imageUrls.length === 0) return;

    // 2. Send URLs to background script for API vetting
    chrome.runtime.sendMessage({ type: 'VET_IMAGES', urls: imageUrls }, (responses) => {
        if (!responses) return;

        images.forEach(img => {
            // Check if the specific image URL was allowed by the API
            const isAllowed = responses[img.src];
            if (isAllowed) {
                img.style.visibility = 'visible';
            } else {
                img.style.display = 'none'; // Completely remove if not allowed
            }
        });
    });
};

// Run vetting once the DOM is interactive
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', vetImages);
} else {
    vetImages();
}