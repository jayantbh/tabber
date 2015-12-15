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
        });
        $(document).on("keyup", "input,textarea", function (e) {
            if(e.keyCode == 8){
                //backspace
            }
            else{
                var word = $(this).val();
                var lastWord = GetLastWord(word);
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


    var observerConfig = {
        childList: true,
        subtree: true,
        characterData: true
    };

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            Array.prototype.slice.call(mutation.addedNodes).forEach(function (addedNode) {
                //console.log(addedNode.innerText);
            });
        });
    });

    var targetNode = document;
    observer.observe(targetNode, observerConfig);

}());