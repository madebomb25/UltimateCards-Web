
//////// CASTLE COLOR CHANGING ANIMATION ////////

const parent = document.querySelector('.brick-lane.set-1');

const targets = document.querySelectorAll('.brick-lane.set-1 .brick');

const timer = (parseFloat(window.getComputedStyle(parent).animationDuration) * 1000) / targets.length;

const timeToRestart = 3;
let times = timeToRestart;

parent.addEventListener('animationiteration', event => {

    if (timeToRestart == times) {
        const originalColor = targets[0].style.backgroundColor;

        for (let i = 0; i < targets.length; i++) {
            setTimeout(() => {
                targets[i].style.backgroundColor = '#BCBEFA';
            }, i * timer);

            setTimeout(() => {
                targets[i].style.backgroundColor = originalColor;
            }, (i * timer) + timer * 1.1);
        }
        times = 0;
    } else {
        times++;
    }
});

