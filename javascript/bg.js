function choiceFunction() {
    var backgroundChoice = 0;
    console.log("backgroundChoice = " + backgroundChoice);

    if (document.getElementById('bg0').checked==true){
          backgroundChoice = 0;
    }
    else if (document.getElementById('bg1').checked==true){
          backgroundChoice = 1;
    }
    else if (document.getElementById('bg2').checked==true){
          backgroundChoice = 2;
    }
    console.log("NEW backgroundChoice = " + backgroundChoice);


    var queryString = "?bg=" + backgroundChoice;
    window.location.href = repository_name + "index.html" + queryString;
}
