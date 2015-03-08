
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
                            
                            // calculate interpolated values of missing data points and replace in data object
             
                            if(index==0){ // take next valid value
                                var newValue = dataArray[nextValue];
                            }else if(index+nextValue >= dataArray.length){ // take last valid value
                                var newValue = dataArray[index-1];
                            }else{ // interpolate between last and next valid value
                                var newValue = dataArray[index-1]+(dataArray[index+nextValue]-dataArray[index-1])/(nextValue+1)
                            }
                            data.data.series[dataArrayIndex][index]= newValue;
                        }
                    });

                });
            });
            
            // data points have to be removed
            if(!options.showMissingDataPoints){
                
                chart.on('draw', function(data) {
                    if(data.type == "point"){
                        
                        // calculate number of line
                        var pointLineIndex = data.element.parent().classes()[1].replace("ct-series-","").charCodeAt(0)-97;

                        // remove point graphic of interpolated values
                        if(missingData[pointLineIndex][data.index]){
                            data.element.remove();
                        }
                        
                    }

                    if(data.type == "line"){
                        
                        var pointLineIndex = data.element.parent().classes()[1].replace("ct-series-","").charCodeAt(0)-97;
                        
                 
                        // remove end of line
                        if(missingData[pointLineIndex][data.path.pathElements.length-1]){
                            
                            // Get last "real" data point
                            var lastDataPoint=data.path.pathElements.length-1;
                            while(missingData[pointLineIndex][lastDataPoint]){
                                lastDataPoint--;
                            }
                   
                            data.path
                              .position(lastDataPoint+1)
                              .remove(data.path.pathElements.length-lastDataPoint+1);

                            // Replace the current element path description attribute with the newly constructed one
                            data.element.attr({
                              d: data.path.stringify()
                            });
                        }            
                        
                        
                        // remove begin of line
                        if(missingData[pointLineIndex][0]){
                            
                            // Get first "real" data point
                            var firstDataPoint=1;
                            while(missingData[pointLineIndex][firstDataPoint]){
                                firstDataPoint++;
                            }
                            
                            
                            // Get the first line or curve instruction (at position 0 is the move instruction)
                            var firstLine = data.path.pathElements[firstDataPoint];

                            // Move cursor to position 0 and remove 2 elements (the move and first line instruction). Then we can add a new move instruction based on the corrdinates of firstLine
                            data.path
                              .position(0)
                              .remove(firstDataPoint+1)
                              .move(firstLine.x, firstLine.y);

                            // Replace the current element path description attribute with the newly constructed one
                            data.element.attr({
                              d: data.path.stringify()
                            });
                        }
               
                        
                                    
                        
                        

                    }
              });
                
            /*
             chart.on('draw', function(data) { 
                // ADDED THIS QUICK FIX BECAUSE THE "pointLineIndex" NEED TO RESET ON "draw" EVENT
                if (data.type === 'grid' && data.index === 0) {
                    pointLineIndex = -1;
                }

                if (data.type === 'point') {                 
                    if (data.index === 0) {
                        pointLineIndex++;
                    } 

                    // TODO store missingData in DOM to have access during resize

                    if (typeof (missingData) !== 'undefined') {
                        if (missingData[pointLineIndex][data.index]) {
                            data.element.remove();
                        }
                    }
                }
            });*/
                
                
                
                
                
            }
        }
    }
}