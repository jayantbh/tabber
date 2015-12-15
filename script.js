(function () {
    $(document).ready(function () {

        $(document).on("keydown", "input,textarea", function (e) {
            if(e.keyCode == 9 && document.activeElement.selectionStart != document.activeElement.selectionEnd){
                //tab
                e.preventDefault();
                document.activeElement.selectionStart = document.activeElement.selectionEnd;
            }
            if(e.keyCode == 13){
                //enter
            }
            if(e.keyCode == 32){
                var word = GetCurrentWord().trim();
                if(word.length){
                    console.log(word+" added.");
                    AddToDictionary(word);
                }
            }
        });
        $(document).on("keyup", "input,textarea", function (e) {
            if(e.keyCode == 8){
                //backspace
            }
            else{
                var lastWord = GetCurrentWord();
                if (lastWord.trim().length) {
                    BestMatch(lastWord, function (match, iterations, time) {
                        if (match.trim().length) {
                            console.log(match + " found in " + iterations + " iterations after " + time + " ms.");
                            var sub = match.substr(lastWord.length, match.length);
                            if (document.activeElement.selectionStart == document.activeElement.selectionEnd) {
                                var start = document.activeElement.selectionStart;
                                AddText(document.activeElement, sub);
                                document.activeElement.selectionStart = start;
                                document.activeElement.selectionEnd = start + (match.length - lastWord.length);
                            }
                        }
                    });
                }
            }
        });
    });
}());