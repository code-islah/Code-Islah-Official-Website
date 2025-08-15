function abstractActive() {
  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.margin = "10rem auto";
  document.body.appendChild(container);

  const elements = Array.from({ length: 6 }, () => {
    const el = document.createElement("div");
    el.style.position = "absolute";
    el.style.top = "50%";
    el.style.left = "50%";
    el.style.transform = "translate(-50%, -50%)";
    el.style.height = "200px";
    el.style.width = "200px";
    return el;
  });

  function zero(p) {
    return p <= 0 ? 1 : p;
  }

  function generateRandomPoint() {
    return [
      zero(Math.floor(Math.random() * 50 + 1)) + "%",
      zero(Math.floor(Math.random() * 100 + 1)) + "%",
    ].join(" ");
  }

  const clipPathOptions = Array.from({ length: 10 }, () =>
    generateRandomPoint()
  );

  elements.forEach((el, i) => {
    // Random scale
    el.style.transform = `translate(-50%, -50%) scale(${0.5 + i * 0.2})`;

    // Random color
    el.style.backgroundColor = `hsl(${Math.floor(
      Math.random() * 310
    )}, ${Math.floor(Math.random() * 100)}%, ${Math.floor(
      Math.random() * 100
    )}%)`;

    // Random clip-path
    if (i === 0) {
      el.style.clipPath = `polygon(
                    0% 20%, 10% 80%, 35% 100%, 70% 100%, 90% 80%, 
                    100% 50%, 90% 20%, 70% 0%, 35% 0%, 20% 20%
                    )`;
    } else {
      const randomPoints = clipPathOptions
        .slice(
          0,
          Math.max(3, Math.floor(Math.random() * clipPathOptions.length))
        )
        .join(", ");
      el.style.clipPath = `polygon(${randomPoints})`;
    }

    container.appendChild(el);
  });
}
