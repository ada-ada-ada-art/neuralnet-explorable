/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

/**
 * A function that does nothing, so it can be passed as parameter. Shitty solution, I know.
 */
function emptyFunction() {};

/**
 * A function that helps to pass parameters on to callbacks
 * @param {function} What function should be called?
 * @param {Array} What items are getting passed as parameters?
 */
function callbackHelper(callback, params) {
	callback.apply(this, params);
}

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}