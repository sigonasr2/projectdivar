
create table songs(id serial,name text, romanized_name text, english_name text, artist text, vocaloid text);
create table users(id serial,username text,email text,authentication_token text,user_data text,code integer,registered boolean);
create table plays(id serial,songId integer, userId integer, difficulty text, cool integer, fine integer, safe integer, sad integer, worst integer, percent numeric(5,2), date timestamp with time zone, score real);
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'Catch the Wave',E'',E'Catch the Wave',E'kz',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'エイリアンエイリアン',E'Alien Alien',E'Alien Alien',E'NayutalieN',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'39みゅーじっく！',E'39 Music!',E'39 Music!',E'Mikito-P',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'どりーみんチュチュ',E'Dreamin Chuchu',E'Dreamin Chuchu',E'emon(Tes.)',E'Luka');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ヒバナ',E'Hibana',E'HIBANA',E'DECO*27',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'大江戸ジュリアナイト',E'Ohedo Julia-Night',E'Ohedo Julia-Night',E'Mitchie M',E'Miku, KAITO');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'テオ',E'Teo',E'Teo',E'Omoi',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ジターバグ',E'Jitter Bug',E'Jitter Bug',E'Hachiya Nanashi',E'MEIKO, Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ジグソーパズル',E'Jigsaw Puzzle',E'Jigsaw Puzzle',E'Mafumafu',E'Len');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ロキ',E'Roki',E'ROKI',E'Mikito-P',E'Rin, Len');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ワールドイズマイン',E'World is Mine',E'World is Mine',E'ryo',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'メルト',E'Melt',E'Melt',E'ryo',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ミラクルペイント',E'Miracle Paint',E'Miracle Paint',E'OSTER project',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'桜ノ雨',E'Sakura no Ame',E'Rain of Cherry Blossoms',E'halyosy',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'えれくとりっく・えんじぇぅ',E'Electric Angel',E'Electric Angel',E'Yasuo-P',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'初音ミクの消失 -DEAD END-',E'Hatsune Miku no Shoushitsu -DEAD END-',E'The Disappearance of Hatsune Miku -DEAD END-',E'cosMo',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'みくみくにしてあげる♪',E'Miku Miku ni Shite Ageru♪',E'I\'ll Miku-Miku You♪ (For Reals)',E'ika',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ロミオとシンデレラ',E'Romeo to Cinderella',E'Romeo and Cinderella',E'doriko',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'magnet',E'',E'magnet',E'minato',E'Miku, Luka');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'愛言葉',E'Ai Kotoba',E'Love Words',E'DECO*27',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'Just Be Friends',E'',E'Just Be Friends',E'Dixie Flatline',E'Luka');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'from Y to Y',E'',E'from Y to Y',E'JimmyThumb-P',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ぽっぴっぽー',E'PoPiPo',E'PoPiPo (Vegetable Juice)',E'LamazeP',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'カンタレラ',E'Cantarella',E'Cantarella',E'Kurousa-P',E'KAITO, Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ジェミニ',E'Gemini',E'Gemini',E'Dixie Flatline',E'Rin, Len');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ハジメテノオト',E'Hajimete no Oto',E'The First Sound',E'malo',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'サイハテ',E'Saihate',E'The Farthest Ends',E'Kobayashi Onyx',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'カラフル×メロディ',E'Colorful × Melody',E'Colorful × Melody',E'Team MOER',E'Miku, Rin');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'初音ミクの激唱',E'Hatsune Miku no Gekishou',E'The Intense Voice of Hatsune Miku',E'cosMo',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'Palette',E'',E'Palette',E'Yuyoyuppe, meola',E'Luka');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'SPiCa -39\'s Giving Day Edition-',E'',E'SPiCa -39\'s Giving Day Edition-',E'Toku-P, kentax',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'番凩',E'Tsugai Kogarashi',E'Wintry Winds',E'sigotositeP',E'MEIKO, KAITO');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ルカルカ★ナイトフィーバー',E'Luka Luka★Night Fever',E'Luka Luka★Night Fever',E'samfree',E'Luka');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'＊ハロー、プラネット。 (I.M.PLSE-EDIT)',E'*Hello, Planet.',E'*Hello, Planet. (I.M.PLSE-EDIT)',E'sasakure.UK',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'裏表ラバーズ',E'Ura-omote Lovers',E'Two-Sided Lovers',E'wowaka',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ローリンガール',E'Rolling Girl',E'Rolling Girl',E'wowaka',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'トリコロール・エア・ライン',E'Tricolor Airline',E'Tricolore Airline',E'Atsuzou-kun',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'on the rocks',E'',E'on the rocks',E'OSTER project',E'MEIKO, KAITO');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'LOL -lots of laugh-',E'',E'LOL -lots of laugh-',E'mikumix',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'深海少女',E'Shinkai Shoujo',E'Deep Sea Girl',E'Yuuyu-P',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'君の体温',E'Kimi no Taion',E'Your Body Temperature',E'Kuwagata-P',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'キャットフード',E'Cat Food',E'Cat Food',E'doriko',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'秘密警察',E'Himitsu Keisatsu',E'Secret Police',E'Buriru-P',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'メランコリック',E'Melancholic',E'Melancholic',E'Junky',E'Rin');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'Weekender Girl',E'',E'Weekender Girl',E'kz, Hachioji-P',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'タイムマシン',E'Time Machine',E'Time Machine',E'1640mP',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'DYE',E'',E'DYE',E'AVTechNO!',E'Luka');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'Fire◎Flower',E'',E'Fire◎Flower',E'halyosy',E'Len');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ACUTE',E'',E'ACUTE',E'Kurousa-P',E'KAITO, Miku, Luka');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'トリノコシティ',E'Torinoko City',E'Left-Behind City',E'40mP',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'リモコン',E'Rimokon',E'Remote Controller',E'Jesus-P',E'Rin, Len');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'FREELY TOMORROW',E'',E'FREELY TOMORROW',E'Mitchie M',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'モノクロ∞ブルースカイ',E'Monochro∞Blue Sky',E'Monochrome ∞ Blue Sky',E'Noboru↑-P',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ワールズエンド・ダンスホール',E'World\'s End Dancehall',E'World\'s End Dancehall',E'wowaka',E'Miku, Luka');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ネトゲ廃人シュプレヒコール',E'Netoge Haijin Sprechchor',E'The MMORPG Addict\'s Anthem',E'TENKOMORI',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'Nostalogic',E'',E'Nostalogic',E'yuukiss, rose',E'MEIKO');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'アンハッピーリフレイン',E'Unhappy Refrain',E'Unhappy Refrain',E'wowaka',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ODDS&ENDS',E'',E'ODDS&ENDS',E'ryo',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'天樂',E'Tengaku',E'Music of Heavens',E'Yuuyu-P',E'Rin');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ブラック★ロックシューター',E'Black★Rock Shooter',E'Black★Rock Shooter',E'ryo',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'Sadistic.Music∞Factory',E'',E'Sadistic.Music∞Factory',E'cosMo',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'Tell Your World',E'',E'Tell Your World',E'kz',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'東京テディベア',E'Tokyo Teddy Bear',E'Tokyo Teddy Bear',E'Neru',E'Rin');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'Sweet Devil',E'',E'Sweet Devil',E'Hachioji-P, q*Left',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'千本桜',E'Senbonzakura',E'A Thousand Cherry Blossoms',E'Kurousa-P',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'スイートマジック',E'Sweet Magic',E'Sweet Magic',E'Junky',E'Rin');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'テレカクシ思春期',E'Terekakushi Shishunki',E'Embarrassment-Hiding Adolescence',E'HoneyWorks',E'Len');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'アマツキツネ',E'Amatsukitsune',E'The Celestial Fox',E'marasy',E'Rin');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'アゲアゲアゲイン',E'Ageage Again',E'Ageage Again',E'Mitchie M',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'1/6 -out of the gravity-',E'',E'1/6 -out of the gravity-',E'Vocaliod-P',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'1925',E'',E'1925',E'T-POCKET',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'サンドリヨン',E'Cendrillon',E'Cendrillon',E'Signal-P, orange',E'Miku, KAITO');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'スノーマン',E'Snowman',E'Snowman',E'halyosy',E'KAITO');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'骸骨楽団とリリア',E'Gaikotsu Gakudan to Lilia',E'Skeleton Orchestra and Lilia',E'Tohma',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ありふれたせかいせいふく',E'Arifureta Sekai Seifuku',E'Common World Domination',E'Pinocchio-P',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'インタビュア',E'Interviewer',E'Interviewer',E'Kuwagata-P',E'Luka');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ピアノ×フォルテ×スキャンダル',E'Piano × Forte × Scandal',E'Piano × Forte × Scandal',E'OSTER project',E'MEIKO');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'shake it!',E'',E'shake it!',E'emon(Tes.)',E'Miku, Rin, Len');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'アカツキアライヴァル',E'Akatsuki Arrival',E'Daybreak Arrival',E'Last Note.',E'Miku, Luka');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'Glory 3usi9',E'',E'Glory 3usi9',E'Hoehoe-P',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'スキキライ',E'Suki Kirai',E'Love-Hate',E'HoneyWorks',E'Rin, Len');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'指切り',E'Yubikiri',E'Pinky Swear',E'Scop',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'Blackjack',E'',E'Blackjack',E'Yucha-P',E'Luka');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'からくりピエロ',E'Karakuri Pierrot',E'Clockwork Clown',E'40mP',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'なりすましゲンガー',E'Narisumashi Genga',E'Doubleganger',E'KulfiQ',E'Rin, Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'こちら、幸福安心委員会です。',E'Kochira, Koufuku Anshin Iinkai desu.',E'This is the Happiness and Peace of Mind Committee',E'Utata-P, Tory Hitsuji',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'Hello, Worker',E'',E'Hello, Worker',E'Hayashikei',E'Luka');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'メテオ',E'Meteor',E'Meteor',E'John',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'soundless voice',E'',E'soundless voice',E'Hitoshizuku-P',E'Len');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'erase or zero',E'',E'erase or zero',E'Crystal-P',E'Len, KAITO');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'エンヴィキャットウォーク',E'Envy Cat Walk',E'Envy Cat Walk',E'Tohma',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'DECORATOR',E'',E'DECORATOR',E'kz',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'二次元ドリームフィーバー',E'Nijigen Dream Fever',E'2D Dream Fever',E'PolyphonicBranch',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'はじめまして地球人さん',E'Hajimemashite Chikyuujin-san',E'Nice to Meet You, Mr. Earthling',E'Pinocchio-P',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'Hand in Hand',E'',E'Hand in Hand',E'kz',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'白い雪のプリンセスは',E'Shiroi Yuki no Princess wa',E'The Snow White Princess is',E'Noboru↑-P',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'39',E'',E'39',E'DECO*27, sasakure.UK',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ブラックゴールド',E'Black Gold',E'Black Gold',E'otetsu',E'Luka');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ヒビカセ',E'Hibikase',E'Resonate',E'Giga-P, Reol',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ゴーストルール',E'Ghost Rule',E'Ghost Rule',E'DECO*27',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'砂の惑星',E'Suna no Wakusei',E'DUNE',E'Hachi',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'The secret garden',E'',E'The secret garden',E'Satoru Kosaki, Aki Hata',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'こっち向いて Baby',E'Kocchi Muite Baby',E'Look This Way, Baby',E'ryo',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'積乱雲グラフィティ',E'Sekiranun Graffiti',E'Cumulonimbus Cloud Graffiti',E'ryo, Dixie Flatline',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ゆめゆめ',E'YUMEYUME',E'DREAM DREAM',E'DECO*27',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'結ンデ開イテ羅刹ト骸',E'Musunde Hiraite Rasetsu to Mukuro',E'Close and Open, Demons and The Dead',E'Hachi',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'エレクトロサチュレイタ',E'electro saturator',E'electro saturator',E'tilt-six',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'炉心融解',E'Roshin Yuukai',E'Meltdown',E'iroha(sasaki), kuma(alfred)',E'Rin');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ダブルラリアット',E'Double Lariat',E'Double Lariat',E'Agoaniki-P',E'Luka');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ハイハハイニ',E'Hai wa Hai ni',E'Ashes to Ashes',E'Tennen, niboshi',E'KAITO');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'壊セ壊セ',E'Kowase Kowase',E'Break It, Break It!',E'E.L.V.N',E'MEIKO');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'初めての恋が終わる時',E'Hajimete no Koi ga Owaru Toki',E'When First Love Ends',E'ryo',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'妄想スケッチ',E'Mousou Sketch',E'Delusion Sketch',E'40mP',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'デンパラダイム',E'Den Paradigm',E'Den Paradigm',E'lumo',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'孤独の果て -extend edition-',E'Kodoku no Hate',E'Solitude\'s End -extend edition-',E'Hikarisyuyo',E'Rin, Len');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'右肩の蝶',E'Migikata no Chou',E'Butterfly on Your Right Shoulder',E'Nori-P, Yura Mizuno',E'Len');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'No Logic',E'',E'No Logic',E'JimmyThumb-P',E'Luka');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'え？あぁ、そう。',E'E? Aa, Sou.',E'Hm? Ah, Yes.',E'Chouchou-P',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'packaged',E'',E'packaged',E'kz',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'巨大少女',E'Kyodai Shoujo',E'Gigantic Girl',E'40mP',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'サマーアイドル',E'Summer Idol',E'Summer Idol',E'OSTER project',E'Miku, Rin');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'千年の独奏歌',E'Sennen no Dokusou Ka',E'Thousand Year Solo',E'yanagi-P',E'KAITO');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'忘却心中',E'Boukyaku Shinjuu',E'Lover\'s Suicide Oblivion',E'OPA, Asaki No\'9',E'MEIKO');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'WORLD\'S END UMBRELLA',E'',E'WORLD\'S END UMBRELLA',E'Hachi',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'恋スルVOC@LOID',E'Koisuru VOC@LOID',E'VOC@LOID in Love',E'OSTER project',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'神曲',E'Kami Kyoku',E'God-Tier Tune',E'Onew-P',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'Yellow',E'',E'Yellow',E'kz',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ネガポジ＊コンティニューズ',E'Negaposi*Continues',E'Negaposi*Continues',E'sasakure.UK',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'SING&SMILE',E'',E'SING&SMILE',E'Re:nG',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'歌に形はないけれど',E'Uta ni Katachi wa Nai Keredo',E'Though My Song Has No Form',E'doriko',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'Dear',E'',E'Dear',E'19\'s Sound Factory',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'どういうことなの！？',E'Dou Iu Koto na no!?',E'What Do You Mean!?',E'Kuchibashi-P',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'クローバー♣クラブ',E'Clover♣Club',E'Clover♣Club',E'Yuuyu-P',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'リンちゃんなう！',E'Rin-chan Nau!',E'Rin-chan Now!',E'Owata-P, sezu',E'Miku, Luka');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'深海シティアンダーグラウンド',E'Shinkai City Underground',E'Deep Sea City Underground',E'Tanaka-B',E'Rin');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'二息歩行',E'Nisoku Hokou',E'Two Breaths Walking',E'DECO*27',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'PIANO*GIRL',E'',E'PIANO*GIRL',E'OSTER project',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'システマティック・ラヴ',E'Systematic Love',E'Systematic Love',E'Camellia, TENKOMORI',E'Miku');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'ココロ',E'Kokoro',E'Heart',E'Toraboruta-P',E'Rin');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'夢喰い白黒バク',E'Yumekui Shirokuro Baku',E'Dream-Eating Monochrome Baku',E'Nem',E'Len');
insert into songs(name,romanized_name,english_name,artist,vocaloid) values (E'Knife',E'',E'Knife',E'rerulili, mal',E'Rin, Miku, Len');
create database ngsplanner2;
\c ngsplanner2
CREATE TABLE "food_mult" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "amount" int,
  "potency" float,
  "pp" int,
  "dmg_res" float,
  "hp" float,
  "pp_consumption" float,
  "pp_recovery" float,
  "weak_point_dmg" float,
  "hp_recovery" float
);

CREATE TABLE "food" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "material" text,
  "potency" boolean,
  "pp" boolean,
  "dmg_res" boolean,
  "hp" boolean,
  "pp_consumption" boolean,
  "pp_recovery" boolean,
  "weak_point_dmg" boolean,
  "hp_recovery" boolean
);

CREATE TABLE "class" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text,
  "icon" text
);

CREATE TABLE "class_weapon_type_data" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "class_id" int,
  "weapon_type_id" int
);

CREATE TABLE "class_level_data" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "class_id" int,
  "level" int,
  "hp" int,
  "atk" int,
  "def" int
);

CREATE TABLE "weapon" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text,
  "rarity" int,
  "level_req" int,
  "atk" int,
  "potential_id" int,
  "variance" float,
  "base_affix_slots" int,
  "drop_info" text,
  "pb_gauge_build" float,
  "icon" text
);

CREATE TABLE "weapon_type" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text,
  "icon" text
);

CREATE TABLE "potential" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text,
  "icon" text
);

CREATE TABLE "potential_data" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "potential_id" int,
  "level" int,
  "mel_dmg" float,
  "rng_dmg" float,
  "tec_dmg" float,
  "crit_rate" float,
  "crit_dmg" float,
  "pp_cost_reduction" float,
  "active_pp_recovery" float,
  "natural_pp_recovery" float,
  "dmg_res" float,
  "all_down_res" float,
  "burn_res" float,
  "freeze_res" float,
  "blind_res" float,
  "shock_res" float,
  "panic_res" float,
  "poison_res" float,
  "battle_power_value" int,
  "pb_gauge_build" float
);

CREATE TABLE "armor" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text,
  "rarity" int,
  "level_req" int,
  "def" int,
  "hp" int,
  "pp" int,
  "mel_dmg" float,
  "rng_dmg" float,
  "tec_dmg" float,
  "crit_rate" float,
  "crit_dmg" float,
  "pp_cost_reduction" float,
  "active_pp_recovery" float,
  "natural_pp_recovery" float,
  "dmg_res" float,
  "all_down_res" float,
  "burn_res" float,
  "freeze_res" float,
  "blind_res" float,
  "shock_res" float,
  "panic_res" float,
  "poison_res" float,
  "battle_power_value" int,
  "pb_gauge_build" float,
  "icon" text
);

CREATE TABLE "augment" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "augment_type_id" int,
  "level" int,
  "variance" float,
  "hp" int,
  "pp" int,
  "mel_dmg" float,
  "rng_dmg" float,
  "tec_dmg" float,
  "crit_rate" float,
  "crit_dmg" float,
  "pp_cost_reduction" float,
  "active_pp_recovery" float,
  "natural_pp_recovery" float,
  "dmg_res" float,
  "affix_success_rate" float,
  "all_down_res" float,
  "burn_res" float,
  "freeze_res" float,
  "blind_res" float,
  "shock_res" float,
  "panic_res" float,
  "poison_res" float,
  "battle_power_value" int,
  "pb_gauge_build" float
);

CREATE TABLE "skill" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text,
  "skill_type_id" int,
  "icon" text
);

CREATE TABLE "skill_data" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "skill_id" int,
  "level" int,
  "variance" float,
  "mel_dmg" float,
  "rng_dmg" float,
  "tec_dmg" float,
  "crit_rate" float,
  "crit_dmg" float,
  "pp_cost_reduction" float,
  "active_pp_recovery" float,
  "natural_pp_recovery" float,
  "dmg_res" float
);

CREATE TABLE "skill_type" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" text UNIQUE,
  "email" text UNIQUE,
  "password_hash" text,
  "created_on" timestamptz,
  "role_id" int,
  "avatar" text
);

CREATE TABLE "roles" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text
);

CREATE TABLE "builds" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "user_id" int,
  "creator" text,
  "build_name" text,
  "class1" int,
  "class2" int,
  "created_on" timestamptz,
  "last_modified" timestamptz,
  "likes" int,
  "data" text
);

CREATE TABLE "weapon_existence_data" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "weapon_type_id" int,
  "weapon_id" int
);

CREATE TABLE "augment_type" (
  "id" SERIAL UNIQUE PRIMARY KEY,
  "name" text,
  "icon" text
);

ALTER TABLE "class_weapon_type_data" ADD FOREIGN KEY ("class_id") REFERENCES "class" ("id");

ALTER TABLE "class_level_data" ADD FOREIGN KEY ("class_id") REFERENCES "class" ("id");

ALTER TABLE "class_weapon_type_data" ADD FOREIGN KEY ("weapon_type_id") REFERENCES "weapon_type" ("id");

ALTER TABLE "weapon" ADD FOREIGN KEY ("potential_id") REFERENCES "potential" ("id");

ALTER TABLE "potential_data" ADD FOREIGN KEY ("potential_id") REFERENCES "potential" ("id");

ALTER TABLE "skill_data" ADD FOREIGN KEY ("skill_id") REFERENCES "skill" ("id");

ALTER TABLE "skill" ADD FOREIGN KEY ("skill_type_id") REFERENCES "skill_type" ("id");

ALTER TABLE "builds" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "builds" ADD FOREIGN KEY ("class1") REFERENCES "class" ("id");

ALTER TABLE "builds" ADD FOREIGN KEY ("class2") REFERENCES "class" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");

ALTER TABLE "weapon_existence_data" ADD FOREIGN KEY ("weapon_id") REFERENCES "weapon" ("id");

ALTER TABLE "weapon_existence_data" ADD FOREIGN KEY ("weapon_type_id") REFERENCES "weapon_type" ("id");

ALTER TABLE "augment" ADD FOREIGN KEY ("augment_type_id") REFERENCES "augment_type" ("id");
delete from food_mult;delete from food;delete from armor;delete from augment;
delete from augment_type;delete from skill_data;delete from skill;delete from skill_type;delete from builds;delete from users;delete from roles;
delete from weapon_existence_data;delete from class_weapon_type_data;delete from class_level_data;delete from potential_data;delete from weapon;delete from weapon_type;delete from class;delete from potential;
insert into food_mult(amount,potency,pp,dmg_res,hp,pp_consumption,pp_recovery,weak_point_dmg,hp_recovery)
	values(0,1,0,1,1,1,1,1,1);
insert into food_mult(amount,potency,pp,dmg_res,hp,pp_consumption,pp_recovery,weak_point_dmg,hp_recovery)
	values(1,1.05,10,1.05,1.05,1,1,1,1);

insert into food(material,potency,pp,dmg_res,hp,pp_consumption,pp_recovery,weak_point_dmg,hp_recovery)
	values('Rich Aelio Meat',true,false,false,false,true,false,false,false);
insert into food(material,potency,pp,dmg_res,hp,pp_consumption,pp_recovery,weak_point_dmg,hp_recovery)
	values('Light Aelio Meat',true,false,false,false,false,true,false,false);
	
insert into class(name,icon) values('Hunter','/icons/UINGSClassHu.png');
insert into class(name,icon) values('Fighter','/icons/UINGSClassFi.png');
insert into class(name,icon) values('Ranger','/icons/UINGSClassRa.png');
insert into class(name,icon) values('Gunner','/icons/UINGSClassGu.png');
insert into class(name,icon) values('Force','/icons/UINGSClassFo.png');
insert into class(name,icon) values('Techter','/icons/UINGSClassTe.png');

insert into weapon_type(name,icon) values('Sword','/icons/NGSUIItemSwordMini.png');
insert into weapon_type(name,icon) values('Spear','/icons/NGSUIItemPartizanMini.png');
insert into weapon_type(name,icon) values('Wired Lance','/icons/NGSUIItemWiredLanceMini.png');
insert into weapon_type(name,icon) values('Twin Dagger','/icons/NGSUIItemTwinDaggersMini.png');
insert into weapon_type(name,icon) values('Double Saber','/icons/NGSUIItemDoubleSaberMini.png');
insert into weapon_type(name,icon) values('Knuckles','/icons/NGSUIItemKnuckleMini.png');
insert into weapon_type(name,icon) values('Assault Rifle','/icons/NGSUIItemAssaultRifleMini.png');
insert into weapon_type(name,icon) values('Launcher','/icons/NGSUIItemLauncherMini.png');
insert into weapon_type(name,icon) values('Twin Machine Guns','NGSUIItemTwinMachinegunsMini.png');
insert into weapon_type(name,icon) values('Rod','/icons/NGSUIItemRodMini.png');
insert into weapon_type(name,icon) values('Talis','/icons/NGSUIItemTalisMini.png');
insert into weapon_type(name,icon) values('Wand','/icons/NGSUIItemWandMini.png');
insert into weapon_type(name,icon) values('Legacy','');

insert into potential(name,icon) values('Recycler Unit','/icons/NGSUIItemPotentialAbility.png');
insert into potential(name,icon) values('Indomitable Unit','/icons/NGSUIItemPotentialAbility.png');
insert into potential(name,icon) values('Defensive Formation','/icons/NGSUIItemPotentialAbility.png');
insert into potential(name,icon) values('Offensive Formation','/icons/NGSUIItemPotentialAbility.png');
insert into potential(name,icon) values('Bastion Unit','/icons/NGSUIItemPotentialAbility.png');
insert into potential(name,icon) values('Meditation Unit','/icons/NGSUIItemPotentialAbility.png');
insert into potential(name,icon) values('Mustered Might Unit','/icons/NGSUIItemPotentialAbility.png');
insert into potential(name,icon) values('Dynamo Unit','/icons/NGSUIItemPotentialAbility.png');
insert into potential(name,icon) values('Berserk Unit','/icons/NGSUIItemPotentialAbility.png');
insert into potential(name,icon) values('Wellspring Unit','/icons/NGSUIItemPotentialAbility.png');
insert into potential(name,icon) values('Endurance Unit','/icons/NGSUIItemPotentialAbility.png');

insert into class_level_data(class_id,level,hp,atk,def)
	values((SELECT id from class WHERE name='Hunter'),1,300,450,304);
insert into class_level_data(class_id,level,hp,atk,def)
	values((SELECT id from class WHERE name='Hunter'),2,303,459,309);
insert into class_level_data(class_id,level,hp,atk,def)
	values((SELECT id from class WHERE name='Fighter'),1,280,454,301);
insert into class_level_data(class_id,level,hp,atk,def)
	values((SELECT id from class WHERE name='Ranger'),1,240,448,300);
	
insert into class_weapon_type_data(class_id,weapon_type_id)
	values((SELECT id from class WHERE name='Hunter'),(SELECT id from weapon_type WHERE name='Sword'));
insert into class_weapon_type_data(class_id,weapon_type_id)
	values((SELECT id from class WHERE name='Hunter'),(SELECT id from weapon_type WHERE name='Spear'));
insert into class_weapon_type_data(class_id,weapon_type_id)
	values((SELECT id from class WHERE name='Hunter'),(SELECT id from weapon_type WHERE name='Wired Lance'));
insert into class_weapon_type_data(class_id,weapon_type_id)
	values((SELECT id from class WHERE name='Fighter'),(SELECT id from weapon_type WHERE name='Twin Dagger'));
insert into class_weapon_type_data(class_id,weapon_type_id)
	values((SELECT id from class WHERE name='Fighter'),(SELECT id from weapon_type WHERE name='Double Saber'));
insert into class_weapon_type_data(class_id,weapon_type_id)
	values((SELECT id from class WHERE name='Fighter'),(SELECT id from weapon_type WHERE name='Knuckles'));
	
insert into weapon(name,rarity,level_req,atk,potential_id,variance,base_affix_slots,drop_info,pb_gauge_build,icon)
	values('Primm',1,1,177,(select id from potential where name='Recycler Unit'),0.7,2,'Central City Item Shop, Common Drop',0,'/icons/uc1iBck.png');
insert into weapon(name,rarity,level_req,atk,potential_id,variance,base_affix_slots,drop_info,pb_gauge_build,icon)
	values('Tzvia',2,4,195,(select id from potential where name='Indomitable Unit'),0.7,2,'Central City Item Shop, Common Drop',0,'/icons/uc1iBck.png');
insert into weapon(name,rarity,level_req,atk,potential_id,variance,base_affix_slots,drop_info,pb_gauge_build,icon)
	values('Primm',1,1,200,(select id from potential where name='Recycler Unit'),0.7,2,'Central City Item Shop, Common Drop',0,'/icons/uc1iBck.png');
	
insert into potential_data(potential_id,level,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from potential where name='Recycler Unit'),1,1.18,1.18,1.18,0,0,0,0,0,0,0,0,0,0,0,0,0,10,0);
insert into potential_data(potential_id,level,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from potential where name='Recycler Unit'),2,1.20,1.20,1.20,0,0,0,0,0,0,0,0,0,0,0,0,0,20,0);
insert into potential_data(potential_id,level,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from potential where name='Indomitable Unit'),1,1.18,1.18,1.18,0,0,0,0,0,0,1.10,0,0,0,0,0,0,10,0);
	
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Sword'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Spear'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Wired Lance'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Twin Dagger'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Double Saber'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Knuckles'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Assault Rifle'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Launcher'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Twin Machine Guns'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Rod'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Talis'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Wand'),(select id from weapon where name='Primm'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Sword'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Spear'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Wired Lance'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Twin Dagger'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Double Saber'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Knuckles'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Assault Rifle'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Launcher'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Twin Machine Guns'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Rod'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Talis'),(select id from weapon where name='Tzvia'));
insert into weapon_existence_data(weapon_type_id,weapon_id)
	values((select id from weapon_type where name='Wand'),(select id from weapon where name='Tzvia'));
	
	
insert into roles(name)
	values('Administrator');
insert into roles(name)
	values('Editor');
insert into roles(name)
	values('Guest');
	
insert into users(username,email,password_hash,created_on,role_id,avatar)
	values('sigonasr2','sigonasr2@gmail.com','ABCDEFG','2021-07-13 04:30+00',(select id from roles where name='Administrator'),'');
insert into users(username,email,password_hash,created_on,role_id,avatar)
	values('sigonasr3','sigonasr3@gmail.com','ABCDEF','2021-07-14 05:30+00',(select id from roles where name='Editor'),'');
	
insert into builds(user_id,creator,build_name,class1,class2,created_on,last_modified,likes,data)
	values((select id from users where username='sigonasr2'),'sigonasr2','Test Build',(select id from class where name='Ranger'),(select id from class where name='Force'),'2021-07-13 04:30+00','2021-07-13 04:30+00',5,'<DATA STRING>');
insert into builds(user_id,creator,build_name,class1,class2,created_on,last_modified,likes,data)
	values((select id from users where username='sigonasr3'),'sigonasr3','Test Build2',(select id from class where name='Techter'),(select id from class where name='Fighter'),'2021-07-13 06:30+00','2021-07-13 07:30+00',27,'<DATA STRING>');
	
insert into skill_type(name)
	values('Weapon');
insert into skill_type(name)
	values('Armor');
	
insert into skill(name,skill_type_id,icon)
	values('Fixa Attack',(select id from skill_type where name='Weapon'),'/icons/UINGSItemPresetAbility.png');
insert into skill(name,skill_type_id,icon)
	values('Fixa Guard',(select id from skill_type where name='Armor'),'/icons/UINGSItemPresetAbility.png');
insert into skill(name,skill_type_id,icon)
	values('Fixa Termina',(select id from skill_type where name='Weapon'),'/icons/UINGSItemPresetAbility.png');
	
insert into skill_data(skill_id,level,variance,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res)
	values((select id from skill where name='Fixa Attack'),1,0,1.02,1.02,1.02,0,0,0,0,0,0);
insert into skill_data(skill_id,level,variance,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res)
	values((select id from skill where name='Fixa Attack'),2,0,1.03,1.03,1.03,0,0,0,0,0,0);
insert into skill_data(skill_id,level,variance,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res)
	values((select id from skill where name='Fixa Attack'),3,0,1.04,1.04,1.04,0,0,0,0,0,0);
insert into skill_data(skill_id,level,variance,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res)
	values((select id from skill where name='Fixa Guard'),1,0,0,0,0,0,0,0,0,0,1.01);
insert into skill_data(skill_id,level,variance,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res)
	values((select id from skill where name='Fixa Guard'),2,0,0,0,0,0,0,0,0,0,1.02);
insert into skill_data(skill_id,level,variance,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res)
	values((select id from skill where name='Fixa Guard'),3,0,0,0,0,0,0,0,0,0,1.03);
insert into skill_data(skill_id,level,variance,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res)
	values((select id from skill where name='Fixa Termina'),1,0,0,0,0,0,1.05,0,0,0,0);
insert into skill_data(skill_id,level,variance,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res)
	values((select id from skill where name='Fixa Termina'),2,0,0,0,0,0,1.08,0,0,0,0);
insert into skill_data(skill_id,level,variance,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res)
	values((select id from skill where name='Fixa Termina'),3,0,0,0,0,0,1.10,0,0,0,0);
	
insert into augment_type(name,icon)
	values('Stamina','');
insert into augment_type(name,icon)
	values('Spirit','');
insert into augment_type(name,icon)
	values('Might','');
insert into augment_type(name,icon)
	values('Precision','');

insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Stamina'),1,0,5,0,0,0,0,0,0,0,0,0,0,0.1,0,0,0,0,0,0,0,3,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Stamina'),2,0,10,0,0,0,0,0,0,0,0,0,0,0.1,0,0,0,0,0,0,0,4,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Stamina'),3,0,15,0,0,0,0,0,0,0,0,0,0,0.09,0,0,0,0,0,0,0,5,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Spirit'),1,0,0,3,0,0,0,0,0,0,0,0,0,0.1,0,0,0,0,0,0,0,2,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Spirit'),2,0,0,4,0,0,0,0,0,0,0,0,0,0.1,0,0,0,0,0,0,0,3,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Spirit'),3,0,0,5,0,0,0,0,0,0,0,0,0,0.09,0,0,0,0,0,0,0,4,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Might'),1,0,0,0,1.01,0,0,0,0,0,0,0,0,0.1,0,0,0,0,0,0,0,4,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Might'),2,0,0,0,1.015,0,0,0,0,0,0,0,0,0.1,0,0,0,0,0,0,0,5,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Might'),3,0,0,0,1.02,0,0,0,0,0,0,0,0,0.09,0,0,0,0,0,0,0,6,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Precision'),1,0,0,0,0,1.01,0,0,0,0,0,0,0,0.1,0,0,0,0,0,0,0,4,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Precision'),2,0,0,0,0,1.015,0,0,0,0,0,0,0,0.1,0,0,0,0,0,0,0,5,0);
insert into augment(augment_type_id,level,variance,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,affix_success_rate,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build)
	values((select id from augment_type where name='Precision'),3,0,0,0,0,1.02,0,0,0,0,0,0,0,0.09,0,0,0,0,0,0,0,6,0);
	
insert into armor(name,rarity,level_req,def,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build,icon)
	values('Primm Armor',1,1,8,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,'/icons/20M6Z7t.png');
insert into armor(name,rarity,level_req,def,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build,icon)
	values('Tzvia Armor',2,1,9,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2,0,'/icons/F0t58xP.png');
insert into armor(name,rarity,level_req,def,hp,pp,mel_dmg,rng_dmg,tec_dmg,crit_rate,crit_dmg,pp_cost_reduction,active_pp_recovery,natural_pp_recovery,dmg_res,all_down_res,burn_res,freeze_res,blind_res,shock_res,panic_res,poison_res,battle_power_value,pb_gauge_build,icon)
	values('Theseus Armor',3,5,10,10,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.1,0,'/icons/uldt9lR.png');