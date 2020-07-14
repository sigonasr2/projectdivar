var characterFrequency = function (string) {
  let tempArray=[...string]; // stores [ 'f', 'u', 'n' ]
  let finalArray = []
  console.log(JSON.stringify(tempArray)+"/"+JSON.stringify(finalArray))
  for (var i=0; i<tempArray.length; i++){
      //console.log("current letter",tempArray[i])
	  var found=false;
      for (var x=0; x<finalArray.length; x++){
          console.log(finalArray) //[ <1 empty item>, [ 'f', 1 ], [ 'u', 1 ], [ 'n', 1 ] ]
          if (tempArray[i] === finalArray[x][0]){ //always fails
          //    if (tempArray[i] == finalArray[x][0]){   //breaks it but seems like the right answer
              console.log(finalArray[x][1])
              finalArray[x][1]+=1
			  found=true;
          }
      }
	  if (!found) {
		  finalArray.push([tempArray[i],1])
	  }
  }
  return finalArray
};

console.log(characterFrequency("Testing more letters!"));