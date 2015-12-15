/**
 * Created by jayantbhawal on 14/12/15.
 */
var Dictionary;
if(localStorage.dict){
    Dictionary = JSON.parse(localStorage.dict);
    console.log("Dictionary loaded with " + Dictionary.length + " words.");
}
else{
    $.get(chrome.extension.getURL('dict.txt'), function (words) {
        Dictionary = words.split("\n");
        console.log("Dictionary loaded with " + Dictionary.length + " words.");
        localStorage.dict = JSON.stringify(Dictionary);
    });
}

function StartsWith (string, prefix) {
    string = string.toLowerCase();
    prefix = prefix.toLowerCase();
    return string.slice(0, prefix.length) == prefix;
}

function AddText(el, newText) {
    var start = el.selectionStart;
    var end = el.selectionEnd;
    var text = el.value;
    var before = text.substring(0, start);
    var after  = text.substring(end, text.length);
    el.value = (before + newText + after);
    el.selectionStart = el.selectionEnd = start + newText.length;
}

function GetLastWord(str) {
    var n = str.split(" ");
    return n[n.length - 1];
}

function BestMatch(str,callback) {
    var old_time = (new Date()).getTime();
    var new_time, seconds_passed;
    var val = "";
    var distance = 9999;
    var word = "";
    var iterations = 0;
    var length = Dictionary.length;
    for(var i = 0; i < length; i++){
        val = Dictionary[i];
        iterations++;
        if (val.length > str.length) {
            if(StartsWith(val,str)){
                var ld = Levenshtein(val, str);
                if (ld < distance) {
                    distance = ld;
                    word = val;
                    if(distance <= 1){
                        new_time = (new Date()).getTime();
                        seconds_passed = new_time - old_time;
                        callback(word,iterations,seconds_passed);
                        break;
                    }
                }
            }
        }
    }
    new_time = (new Date()).getTime();
    seconds_passed = new_time - old_time;
    callback(word,iterations,seconds_passed);
}