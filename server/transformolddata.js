const axios = require('axios')

var data = [["Yellow","452","51","0","0","2","EXEX","98.53"],
["The secret garden","297","100","1","1","1","EX","92.55"],
["Tell Your World","423","46","1","1","7","EXEX","93.93"],
["愛言葉","383","45","1","0","4","EXEX","97.14"],
["Weekender Girl","380","53","0","1","1","EX","101.68"],
["歌に形はないけれど","379","51","1","0","0","EXEX","100.4"],
["えれくとりっく・えんじぇぅ","436","151","1","0","9","EXEX","87.83"],
["神曲","386","30","0","1","4","EX","97.79"],
["カンタレラ","389","111","10","7","21","EXEX","78.54"],
["巨大少女","412","58","1","0","7","EXEX","98.5"],
["クローバー♣クラブ","443","68","3","0","2","EXEX","94.59"],
["恋スルVOC@LOID","355","86","3","3","8","EXEX","90.46"],
["桜ノ雨","389","1","1","0","0","EX","102.16"],
["39","510","86","3","0","7","EXEX","93.37"],
["深海シティアンダーグラウンド","496","132","28","9","46","EXEX","76.01"],
["深海少女","580","77","1","1","5","EXEX","95.48"],
["積乱雲グラフィティ","430","38","0","0","2","EXEX","100.78"],
["千年の独奏歌","383","83","14","17","13","EXEX","78.91"],
["ダブルラリアット","498","105","2","1","13","EXEX","89.54"],
["ハジメテノオト","307","74","2","0","6","EXEX","92.84"],
["初めての恋が終わる時","330","101","11","8","13","EXEX","76.01"],
["packaged","302","29","0","0","1","EXEX","100.89"],
["Palette","222","127","13","5","19","EXEX","82.33"],
["FREELY TOMORROW","371","50","2","0","1","EX","100.66"],
["from Y to Y","332","63","7","2","10","EXEX","78.58"],
["みくみくにしてあげる♪","265","41","1","1","3","EXEX","92.62"],
["メルト","336","55","6","1","8","EXEX","92.83"],
["モノクロ∞ブルースカイ","432","62","2","0","4","EX","94.11"],
["ゆめゆめ","609","48","3","0","3","EXEX","97.52"],
["1/6 -out of the gravity-","545","55","0","0","0","EX","103.67"],
["ACUTE","460","76","2","1","10","EX","89.01"],
["インタビュア","358","94","6","0","15","EX","82.34"],
["LOL -lots of laugh-","446","89","5","3","10","EX","88.33"],
["Glory 3usi9","459","49","3","0","2","EX","97.4"],
["soundless voice","328","95","20","15","6","EX","72.62"],
["ジェミニ","406","102","8","4","3","EX","87"],
["白い雪のプリンセスは","434","60","2","0","8","EXEX","93.6"],
["スキキライ","444","67","3","1","7","EX","92.21"],
["タイムマシン","353","58","3","0","3","EX","93.25"],
["Dear","416","42","1","3","5","EXEX","94.86"],
["DECORATOR","475","64","1","0","3","EX","100.77"],
["トリコロール・エア・ライン","239","65","13","4","20","EX","65.34"],
["トリコロール・エア・ライン","347","55","12","7","19","EX","89.02"],
["Nostalogic","317","97","13","8","19","EX","79.53"],
["Hand in Hand","419","38","1","0","1","EX","101.59"],
["Fire◎Flower","257","40","13","7","21","EXEX","60.46"],
["Fire◎Flower","400","67","14","2","21","EXEX","87.91"],
["ブラック★ロックシューター","299","67","7","6","19","EX","79.52"],
["メテオ","446","88","0","0","4","EX","98.42"],
["ワールドイズマイン","304","108","3","1","3","EXEX","87.65"],
["アマツキツネ","516","63","1","0","4","EX","97.57"],
["erase or zero","445","54","6","0","9","EX","96.23"],
["エレクトロサチュレイタ","378","60","2","0","1","EX","97.9"],
["on the rocks","402","148","2","4","19","EXEX","81.82"],
["からくりピエロ","424","84","2","0","4","EX","93.46"],
["カラフル×メロディ","470","66","8","2","15","EXEX","89.91"],
["Catch the Wave","596","76","1","1","2","EX","96.85"],
["FREELY TOMORROW","365","59","0","0","0","EX","102.73"],
["え？あぁ、そう。","439","121","11","5","43","EXEX","77.11"],
["キャットフード","567","105","9","2","32","EXEX","84.65"],
["サマーアイドル","363","58","5","5","10","EX","84.32"],
["shake it!","580","80","0","4","7","EX","96.03"],
["どういうことなの！？","448","85","2","0","3","EX","95.01"],
["キャットフード","573","117","8","3","14","EXEX","87.63"],
["サマーアイドル","390","43","2","3","13","EX","90.82"],
["shake it!","563","102","1","1","4","EX","96.67"],
["Just Be Friends","491","117","10","0","17","EXEX","81.24"],
["スイートマジック","506","68","0","0","0","EX","102.51"],
["SPiCa -39's Giving Day Edition-","435","240","13","1","12","EX","80.49"],
["番凩","332","83","11","4","16","EXEX","64.67"],
["番凩","436","123","11","5","24","EXEX","82.88"],
["テレカクシ思春期","491","75","3","3","11","EX","92.43"],
["天樂","367","51","2","3","7","EX","96.34"],
["どういうことなの！？","450","75","1","2","10","EX","93.79"],
["東京テディベア","453","78","5","6","31","EXEX","77.49"],
["東京テディベア","503","97","8","3","32","EXEX","86.12"],
["どりーみんチュチュ","597","112","5","3","6","EX","94.34"],
["トリノコシティ","465","74","6","3","16","EX","91.28"],
["ネトゲ廃人シュプレヒコール","610","105","17","9","46","EXEX","76.68"],
["No Logic","435","124","18","16","30","EX","73.95"],
["ハイハハイニ","331","140","20","7","67","EXEX","69.71"],
["ハイハハイニ","362","125","31","6","41","EXEX","73.09"],
["ハイハハイニ","382","139","14","6","33","EXEX","76.8"],
["ハイハハイニ","388","133","15","7","41","EXEX","77.12"],
["はじめまして地球人さん","500","124","6","0","8","EX","90.05"],
["＊ハロー、プラネット。 (I.M.PLSE-EDIT)","375","176","17","2","17","EX","79.2"],
["Hello, Worker","430","121","9","2","17","EXEX","85.89"],
["忘却心中","359","87","27","10","35","EXEX","77.41"],
["magnet","426","110","12","5","40","EXEX","77.34"],
["右肩の蝶","212","58","10","8","21","EX","35.27"],
["右肩の蝶","400","82","27","15","24","EX","71.02"],
["結ンデ開イテ羅刹ト骸","82","32","7","9","18","EXEX","10.29"],
["結ンデ開イテ羅刹ト骸","322","105","18","10","44","EXEX","49.98"],
["結ンデ開イテ羅刹ト骸","444","134","22","9","46","EXEX","69.93"],
["結ンデ開イテ羅刹ト骸","471","123","10","5","46","EXEX","74.19"],
["メランコリック","506","102","10","8","19","EXEX","88.35"],
["リモコン","568","86","2","1","12","EX","89.29"],
["ルカルカ★ナイトフィーバー","544","90","6","4","31","EXEX","84.65"],
["炉心融解","475","56","4","0","2","EXEX","93.99"],
["WORLD'S END UMBRELLA","469","135","8","5","25","EX","80.69"],
["アカツキアライヴァル","465","174","34","11","25","EX","69.73"],
["アカツキアライヴァル","543","111","18","11","26","EX","76.82"],
["ココロ","327","25","2","0","0","H","98.89"],
["システマティック・ラヴ","415","76","11","5","3","H","85.08"],
["Knife","442","121","12","3","3","H","86.69"],
["二息歩行","405","43","4","3","0","H","99.04"],
["test","459","134","19","5","25","EXEX","75.41"],
["Knife","464","147","19","17","36","EX","71.68"],
["システマティック・ラヴ","119","47","16","6","17","EX","23.05"],
["システマティック・ラヴ","405","96","26","14","42","EX","71.3"],
["夢喰い白黒バク","452","132","15","7","47","EX","71.07"],
["二息歩行","415","46","15","8","4","EX","87.2"],
["アゲアゲアゲイン","612","86","4","1","15","EX","91.56"],
["1925","492","128","11","1","36","EX","77.78"],
["え？あぁ、そう。","490","97","4","3","21","EXEX","83.24"],
["エイリアンエイリアン","532","191","1","0","7","EX","91.4"],]

function transformData(data) {
	for (var i=0;i<data.length;i++) {
		var obj = {username:"sigonasr2",authentication_token:"sig"}
		for (var j=0;j<data[i].length;j++) {
			var value = data[i][j];
			switch (j) {
				case 0:{
					obj.song=value;
				}break;
				case 1:{
					obj.cool=Number(value);
				}break;
				case 2:{
					obj.fine=Number(value);
				}break;
				case 3:{
					obj.safe=Number(value);
				}break;
				case 4:{
					obj.sad=Number(value);
				}break;
				case 5:{
					obj.worst=Number(value);
				}break;
				case 6:{
					obj.difficulty=value;
				}break;
				case 7:{
					obj.percent=Number(value);
				}break;
			}
		}
		axios.post("http://45.33.13.215:4501/submit",obj).catch((err)=>{console.log("Failed to submit "+JSON.stringify(obj)) 
		console.log(err.message)})
	}
}

console.log(transformData(data));