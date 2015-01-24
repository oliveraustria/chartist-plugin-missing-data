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

                    if(missingData[pointLineIndex][data.index])
                        data.element.remove();
                }
              });
            }
        }
    }
}