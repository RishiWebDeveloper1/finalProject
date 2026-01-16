document.addEventListener("scroll", () => {
    const textBlocks = document.querySelectorAll(".text-block");
    textBlocks.forEach((block) => {
        const rect = block.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            block.classList.add("visible");
        }
    });document.addEventListener("DOMContentLoaded", () => {
        const textBlocks = document.querySelectorAll(".text-block");
    
        const revealTextBlocks = () => {
            textBlocks.forEach((block) => {
                const rect = block.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    block.classList.add("visible");
                }
            });
        };
    
        // Trigger on scroll and initial load
        revealTextBlocks();
        window.addEventListener("scroll", revealTextBlocks);
    });
    
});
