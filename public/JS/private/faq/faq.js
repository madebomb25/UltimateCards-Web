/*
For unfolding FAQ questions.
*/
function unfoldFaq(element) {
    const data = element.querySelector('span');
    const icon = element.querySelector('i');

    if (data.style.display == 'none') {
        data.style.display = 'flex';
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
    } else {
        data.style.display = 'none';
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
    }
}