GE.Misc = {

    //
    //  Color
    //

    /**
     * Returns a random color.
     * @returns {Number} A random hexadecimal color.
     */
    getRandomColor: function() {
        return Math.floor(Math.random() * 16777215);
    },

    //
    //  Canvas
    //

    wrapText: function(context, text, maxWidth) {

        // TODO: fix when a single word's with > maxWidth

        var words = text.split(' ');
        var line = '';
        var result = '';

        for(var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;

            if (testWidth > maxWidth && n > 0) {
                result += line + "\n";
                line = words[n] + ' ';
            }
            else {
                line = testLine;
            }
        }

        result += line;

        return result;
    }

};