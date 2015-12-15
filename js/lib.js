/**
 * Created by jayantbhawal on 14/12/15.
 */
var Dictionary;

(function () {
    var storage = chrome.storage.local;
    storage.get("dict", function (dict) {
        dict = dict.dict;
        if (dict.length) {
            Dictionary = dict;
            console.log("Dictionary loaded with " + Dictionary.length + " words.");
        }
        else {
            $.get(chrome.extension.getURL('dict.txt'), function (words) {
                Dictionary = words.split("\n");
                console.log("Dictionary loaded with " + Dictionary.length + " words.");
                storage.set({"dict": Dictionary});
            });
        }
    });
})();

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

function StartsWith(string, prefix) {
    string = string.toLowerCase();
    prefix = prefix.toLowerCase();
    return string.slice(0, prefix.length) == prefix;
}

function AddText(el, newText) {
    var start = el.selectionStart;
    var end = el.selectionEnd;
    var text = el.value;
    var before = text.substring(0, start);
    var after = text.substring(end, text.length);
    el.value = (before + newText + after);
    el.selectionStart = el.selectionEnd = start + newText.length;
}

function GetCaretPosition(ctrl) {
    var CaretPos = 0;   // IE Support
    if (document.selection) {
        ctrl.focus();
        var Sel = document.selection.createRange();
        Sel.moveStart('character', -ctrl.value.length);
        CaretPos = Sel.text.length;
    }
    // Firefox support
    else if (ctrl.selectionStart || ctrl.selectionStart == '0')
        CaretPos = ctrl.selectionStart;
    return (CaretPos);
}

function ReturnWord(text, caretPos) {
    var index = text.indexOf(caretPos);
    var preText = text.substring(0, caretPos);
    if (preText.indexOf(" ") > 0) {
        var words = preText.split(" ");
        return words[words.length - 1]; //return last word
    }
    else {
        return preText;
    }
}

function GetCurrentWord() {
    var caretPos = GetCaretPosition(document.activeElement);
    var word = ReturnWord(document.activeElement.value, caretPos);
    if (word) {
        if (isLetter(word[word.length - 1])) {
            word = word.replace(/[^\w]/g, "");
            return word;
        }
    }
}

function AddCurrentWordToDictionary() {
    var str = GetCurrentWord();

    var storage = chrome.storage.local;
    if ($.inArray(str, Dictionary) == -1 && $.inArray(str.toLowerCase(), Dictionary) == -1) {
        str = str.toLowerCase();
        Dictionary = Dictionary.concat(str);
        storage.set({"dict": Dictionary});
        console.log(str+" added.");
    }
}

function BestMatch(str, callback) {
    var old_time = (new Date()).getTime();
    var new_time, seconds_passed;
    var val = "";
    var distance = 9999;
    var word = "";
    var iterations = 0;
    var length = Dictionary.length;
    for (var i = 0; i < length; i++) {
        val = Dictionary[i];
        iterations++;
        if (val.length > str.length) {
            if (StartsWith(val, str)) {
                var ld = Levenshtein(val, str);
                if (ld < distance) {
                    distance = ld;
                    word = val;
                    if (distance <= 1) {
                        new_time = (new Date()).getTime();
                        seconds_passed = new_time - old_time;
                        callback(word, iterations, seconds_passed);
                        break;
                    }
                }
            }
        }
    }
    new_time = (new Date()).getTime();
    seconds_passed = new_time - old_time;
    callback(word, iterations, seconds_passed);
}