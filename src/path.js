GE.Path = {

    combine: function(){
        var result = "",
            c = "/",
            a;

        for (var i = 0; i < arguments.length; ++i){

            a = String(arguments[i]);

            result += a;

            if(a.indexOf(c) != a.length-1 && i < arguments.length - 1) {
                result += c;
            }

        }

        if(result.indexOf(c) == result.length-1) {
            result = result.substr(0, result.length-1);
        }

        return result;
    }

};