function parseSVGPath(code){

}

//parseSVGPath("M45,93C83.16666666666667,93,197.66666666666666,93,274,93C350.3333333333333,93,426.6666666666667,93,503,93C579.3333333333334,93,655.6666666666666,93,732,93C808.3333333333334,93,884.6666666666666,93,961,93C1037.3333333333333,93,1151.8333333333333,93,1190,93");
                        
/*
M 45,93
C
83.16666666666667,
93,
197.66666666666666,
93,
274,
93
C
350.3333333333333,
93,
426.6666666666667,
93,
503,
93
C579.3333333333334,93,655.6666666666666,93,732,93C808.3333333333334,93,884.6666666666666,93,961,93C1037.3333333333333,93,1151.8333333333333,93,1190,93
*/



ctMissingData = function (options) {
    return function ctMissingData(chart) {

        var defaultOptions = {showMissingDataPoints: false};
        options = Chartist.extend({}, defaultOptions, options);

        if(chart instanceof Chartist.Line) {

          var missingData = new Array();
          chart.on('data', function(data) {

              data.data.series.forEach(function(dataArray, dataArrayIndex){

                missingData[dataArrayIndex] = new Array();
                    dataArray.forEach(function(value, index){

                        if(value === null){
                            missingData[dataArrayIndex][index]=true;
                            var nextValue = 1;
                            while(dataArray[index+nextValue] === null || dataArray.length < index+nextValue ){
                                nextValue++;
                            }
                            data.data.series[dataArrayIndex][index]=dataArray[index-1]+(dataArray[index+nextValue]-dataArray[index-1])/(nextValue+1);
                        }
                    });
                });
            });
            if(!options.showMissingDataPoints){
                // data points have to be removed
                var pointLineIndex=-1;
                chart.on('draw', function(data) {
                if(data.type == "point"){
                    if(data.index == 0){
                        pointLineIndex++;
                    }

                    // TODO store missingData in DOM to have access during resize 
                    if(missingData && missingData[pointLineIndex][data.index])
                        data.element.remove();
                    }
                    
                    if(data.type == "line"){
                        
                        //var svgCode = data.element._node.getAttribute("d");
                    
                    };
              });
            }
        }
    }
}