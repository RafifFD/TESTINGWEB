// Button Event
document.getElementById("Start").addEventListener("click", function () {
  const animationContainer = document.querySelector(".animation-container");
  const animation = document.querySelector(".animation");
  const content = document.querySelector(".content");
  const foot = document.querySelector(".foot");

  // Show animation
  window.scrollTo(0, 0);
  animation.style.display = "block";
  animation.style.animation = "rotate-scale-up 0.9s linear both";
  animation.style.setProperty(
    "-webkit-animation",
    "rotate-scale-up 0.9s linear both;"
  );
  setTimeout(() => {
    animationContainer.style.display = "block";
    content.style.animation = "contentIn .4s ease both";
    foot.style.animation = "fadeUp .4s ease both";
    foot.style.animationDelay = "0.4s";
  }, 900);
  setTimeout(() => {
    window.location.href = "./FEATURE/main.html";
  }, 2500);
});
