var songs = [
['ストロボナイツ (Strobe Nights)','Strobe Nights','kz, yae','Miku'],
['VOiCE','VOiCE','Lovely-P','Miku'],
['恋色病棟 (Koi Iro Byoutou)','Love-Colored Ward','OSTER project','Miku'],
['ねこみみスイッチ (Nekomimi Switch)','Cat Ear Switch','daniwellP','Miku'],
['パラジクロロベンゼン (Paradichlorobenzene)','Paradichlorobenzene','Owata-P','Len'],
['カラフル×セクシィ (Colorful × Sexy)','Colorful × Sexy','Team MOER','Luka, MEIKO'],
['劣等上等 (Rettou Joutou)','BRING IT ON','Giga-P, Reol','Rin, Len'],
['Star Story','Star Story','kz','Miku'],
['パズル (Puzzle)','Puzzle','Kuwagata-P','Miku'],
['キップル・インダストリー (Kipple Industry)','Kipple Industry','millstones','Miku'],
['夢の続き (Yume no Tsuzuki)','Continuing Dream','Dixie Flatline','Miku, Rin, Len, Luka'],
['MEGANE','Glasses','Ultra-Noob','Luka'],
['Change me','Change me','shu-tP','MEIKO'],
]


function getSQLString(songs) {
	var finalString = "";
	for (var i=0;i<songs.length;i++) {
		finalString += "insert into songs(name,romanized_name,english_name,artist,vocaloid) values ("
		for (var j=0;j<songs[i].length;j++) {
			var item = songs[i][j].replace('\'','\\\'')
			switch (j) {
				case 0:{
					if (item.includes("(")) {
						var song = item.slice(0,item.indexOf(' ('))+item.slice(item.indexOf(')')+1);
						var romanized = item.slice(item.indexOf('(')+1,item.indexOf(')'));
						
						finalString+="E'"+song+"',E'"+romanized+"'"
					} else {
						finalString+="E'"+item+"',E''"
					}
				}break;
				default:{
					finalString+=",E'"+item+"'"
				}
			}
		}
		finalString+=");\n"
	}
	return finalString;
}

console.log(getSQLString(songs));