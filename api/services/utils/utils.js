module.exports = {

    getCopyIndex: function(filenameBody) {

        var indexOfLine = filenameBody.lastIndexOf('-');
        if(indexOfLine==-1) return;

        var possibleCopyIndex = filenameBody.substring(indexOfLine+1);
        var indexOfC = possibleCopyIndex.indexOf('c');
        if(indexOfC!=0) return;

        var copyIndexString = possibleCopyIndex.substring(indexOfC+1);
        var copyIndexInt = parseInt(copyIndexString);
        if(copyIndexString!=copyIndexInt) return;

        return ++copyIndexInt;

    },

    riseCopyIndex: function(filename) {

        var lastIndexOfPoint = filename.lastIndexOf('.');
        var filenameBody = filename.substring(0, lastIndexOfPoint)
        var extension = filename.substring(lastIndexOfPoint)
        var copyIndex = this.getCopyIndex(filenameBody);

        if(copyIndex) filenameBody = filenameBody.substring(0, filenameBody.lastIndexOf('-'))
        else copyIndex = 1;

        return filenameBody + '-c' + copyIndex + extension;

    }


};


