(function () {
    var editable_selectors = "input,textarea,[contenteditable='true']";
    $(document).on("keydown", editable_selectors, function (e) {
        //console.log(e.which+" "+document.activeElement.selectionStart+" "+document.activeElement.selectionEnd);

        if (e.shiftKey && e.which == 32 && e.ctrlKey) {
            //ctrl + shift + space
            AddCurrentWordToDictionary();
        }
        else if ((e.which == 9 || (e.which == 32 && e.ctrlKey)) && document.activeElement.selectionStart != document.activeElement.selectionEnd) {
            //tab - works on most sites
            //ctrl + space - where tab doesn't work
            e.preventDefault();
            document.activeElement.selectionStart = document.activeElement.selectionEnd;
            if(document.activeElement.value[document.activeElement.value.length-1] != " "){
                document.activeElement.value += " ";
            }
        }
        else if (e.which == 32 || e.which == 188 || e.which == 190 || e.which == 186) {
            //space or comma or period or semi-colon
            //AddCurrentWordToDictionary();
            RemoveSelectedText();
            var lastWord = GetCurrentWord();
            if(lastWord){
                //console.log(lastWord);
                BestReplacementForCurrentWord(lastWord.toLowerCase(),function (replacement) {
                    if (replacement.length) {
                        document.activeElement.value = document.activeElement.value.replace(lastWord, replacement);
                        document.activeElement.focus();
                    }
                });
            }
        }
        //TODO | Handle cases for caret position changes using cursor keys. These are fucking it up.
    });
    $(document).on("keyup", editable_selectors, function (e) {
        if (e.which == 8) {
            //backspace
        }
        else if (e.which == 13) {
            //enter
            RemoveSelectedText();
        }
        else if(e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40){
            //left or up or right or down arrow
            //nothing to do
        }
        else {
            var lastWord = GetCurrentWord();
            if (lastWord) {
                if (lastWord.trim().length) {
                    BestMatch(lastWord, function (match, iterations, time) {
                        if (match.trim().length) {
                            //console.log(match + " found in " + iterations + " iterations after " + time + " ms.");
                            var sub = match.substr(lastWord.length, match.length);
                            if (document.activeElement.selectionStart == document.activeElement.selectionEnd) {
                                var start = document.activeElement.selectionStart;
                                AddText(document.activeElement, sub);
                                document.activeElement.selectionStart = start;
                                document.activeElement.selectionEnd = start + (match.length - lastWord.length);

                                AE = document.activeElement;
                            }
                        }
                    });
                }
            }
        }
    });
}());