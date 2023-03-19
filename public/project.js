//Use when updating info
document.getElementById("editB").onclick = function() {edit()};
function edit() {
    console.log("click to edit");
    var terms = document.getElementsByClassName("edit");
    for (var term of terms) {
        term.style.display = "inline";
    }
    var shows = document.getElementsByClassName("show");
    for (var showitem of shows) {
        showitem.style.display = "none";
    }
    document.getElementById("editB").style.display = "none";
    document.getElementById("editF").style.display = "inline";
}
