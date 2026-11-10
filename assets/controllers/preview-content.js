(() => {
  document.querySelectorAll(".direction .ui").forEach((ui) => {
    const main = ui.querySelector(":scope > .main");
    if (!main) return;
    const wrapper = document.createElement("div");
    wrapper.className = "ui-content";
    main.before(wrapper);
    wrapper.append(main);
  });
})();
