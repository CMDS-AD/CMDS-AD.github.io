document.documentElement.classList.add("has-js");

const revealItems = [...document.querySelectorAll(".reveal")];

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("reveal-visible"));
}

const navLinks = [...document.querySelectorAll(".nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && sections.length > 0) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!activeEntry) {
        return;
      }

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${activeEntry.target.id}`;
        link.classList.toggle("is-active", isActive);
      });
    },
    {
      threshold: 0.35,
      rootMargin: "-20% 0px -55% 0px",
    }
  );

  sections.forEach((section) => navObserver.observe(section));
}

const copyButton = document.querySelector("[data-copy-target]");
const copyStatus = document.querySelector("[data-copy-status]");

if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const targetId = copyButton.getAttribute("data-copy-target");
    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    try {
      await navigator.clipboard.writeText(target.textContent.trim());
      if (copyStatus) {
        copyStatus.textContent = "BibTeX copied to clipboard.";
      }
    } catch (error) {
      if (copyStatus) {
        copyStatus.textContent = "Copy failed. Please copy the BibTeX manually.";
      }
    }
  });
}
