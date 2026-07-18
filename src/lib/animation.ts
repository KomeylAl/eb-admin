import gsap from "gsap";

// animatePageIn فقط مسئول محو کردن بنر
export const animatePageIn = () => {
  const banner = document.getElementById("banner");

  if (banner) {
    gsap.killTweensOf(banner);
    const tl = gsap.timeline();

    tl.to(banner, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => {
        banner.style.display = "none";
      },
    });
  }
};

// animatePageOut فقط مسئول ظاهر کردن بنر
export const animatePageOut = () => {
  const banner = document.getElementById("banner");

  if (banner) {
    gsap.killTweensOf(banner);
    return new Promise<void>((resolve) => {
      banner.style.display = "flex"; // برای flex بودن وسط‌چین
      const tl = gsap.timeline();

      tl.fromTo(
        banner,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: resolve,
        }
      );
    });
  }

  return Promise.resolve();
};
