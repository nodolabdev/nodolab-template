var timeline = new TL.Timeline('e-learning-timeline', 'content/timeline/e-learning-timeline.json', { slide_padding_lr: 80, language: "es", use_bc: true });


var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutationRecord) {
    if (target.clientWidth < 1024) return;
    const panelCurrentStatus = mutationRecord.target.classList.contains('panel-open');

    if (panelStatus !== panelCurrentStatus) {
      setTimeout(() => {
        timeline.updateDisplay();
      }, 380);
      panelStatus = panelCurrentStatus
    }
  });
});

let target = document.body;
let panelStatus = target.classList.contains("panel-open");

observer.observe(target, { attributes: true, attributeFilter: ['class'] });

