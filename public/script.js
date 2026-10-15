// ================================
// Animated Counter
// ================================

const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {

    const target = Number(counter.dataset.target);

    let current = 0;

    const speed = target / 120;

    const updateCounter = () => {

        current += speed;

        if(current < target){

            counter.innerText = Math.floor(current);

            requestAnimationFrame(updateCounter);

        }else{

            counter.innerText = target;

        }

    }

    updateCounter();

});