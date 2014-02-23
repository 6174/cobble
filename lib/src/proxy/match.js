/**
 * sublime text search 
 */
function match(search, text) {
    search = search.toUpperCase();
    text = text.toUpperCase();

    var j = -1; // remembers position of last found character

    // consider each search character one at a time
    for (var i = 0; i < search.length; i++) {
        var l = search[i];
        if (l == ' ') continue;     // ignore spaces

        j = text.indexOf(l, j+1);     // search for character & update position
        if (j == -1) return false;  // if it's not found, exclude this item
    }
    return true;
}