-- 藥輪位置 seed。由 packages/spec/medicine-wheel-spec.json 產生（請勿手改；改 spec 後以 scripts 重生）。
-- 灌入：supabase db push 後 \i supabase/seed.sql 或 supabase db reset。

insert into positions
  (id, layer, name, date_start, date_end, zodiac, element, family, direction, north_animal, tw_animal, path_dir, path_name, knowledge)
values
(1,'center','造物者',null,null,null,null,null,null,null,null,null,null,'{"title":"造物者 ☉ 中心","tags":["中央群集","一切的顏色（黃）"],"html":"<p><b>關鍵句：</b>為了與圓滿的自己相遇而行動。</p><p>造物者就是「自己」——我看到、我定義、我認得，你才存在；沒有你就沒有藥輪。藥輪起點從你出生開始算，每個人起點都不同。</p><p><b>議題：</b>我們就是中心、就是造物者；光明與黑暗都在其中。提問「你知道自己是誰嗎？」內在決定外在。</p><p><b>礦石：</b>阿帕契黑曜岩（忘憂石／火山玻璃）。<b>植物：</b>竹子（能力與資源都在體內，如何解除封印、使用自己）。</p>"}'::jsonb),
(2,'sky','大地母親',null,null,null,null,null,null,null,null,null,null,'{"title":"大地母親 ・ 天群","tags":["土","正：豐饒・多產・支持","綠"],"html":"<p><b>關鍵句：</b>我享受自己天然的愛用來展開。</p><p>原始力量所在；理解才能、建立新開始、對外探索理解價值；反之「躲」也可以是有品質的休息。你自己就是你的安全感。</p><p><b>動物：</b>陸龜／台灣食蛇龜（黃緣閉殼龜，遭濫捕，請收走捕獸籠）。<b>植物：</b>玉米、南瓜、豆類（成熟才能吃＝時間治癒）。<b>礦石：</b>黏土（連結能量・龜龜）。</p>"}'::jsonb),
(3,'sky','太陽父親',null,null,null,null,null,null,null,null,null,null,'{"title":"太陽父親 ・ 天群","tags":["火／風","正：展現天賦・拒絕的勇氣","天空藍"],"html":"<p><b>關鍵句：</b>從我內在的陽光照亮我的感情。</p><p>能見是非、指引夢想、資源再利用。核心議題＝<b>權威</b>（老闆、父母、信仰、「瘦」等標準）。權威可傷害你但不能控制你。太陽另一功能：<b>歸零再出發</b>。</p><p><b>動物：</b>蜥蜴／台灣草蜥；陰性太陽＝壁虎（陰影現形＝問題可解）。<b>植物：</b>向日葵。<b>礦石：</b>太陽石（say no 的勇氣）。</p>"}'::jsonb),
(4,'sky','月亮祖母',null,null,null,null,null,null,null,null,null,null,'{"title":"月亮祖母／星星 ・ 天群","tags":["逐字稿未深入"],"html":"<p>天群順序為大地→太陽→月亮（先立足點，再抬頭看天，最後看月亮）。</p><p><b>月亮概念（散論）：</b>太陽讓我們看清、形成習慣與行動；黑暗中因不確定而趨於不行動，是安全問題、非缺陷。行動與不行動<b>等值</b>（太極日夜均等）。</p><p class=\"muted small\">逐字稿未提供月亮祖母／星星的專屬動植礦與關鍵句。</p>"}'::jsonb),
(5,'family','海龜家族',null,null,null,'土','海龜',null,null,null,null,'{"title":"海龜家族 ・ 地群（土）","tags":["土","共識・根基"],"html":"<p><b>神話：</b>海龜循哭聲找到寂寞女神、邀她遊海解寂寞；女神為報答把海龜變成一塊土地（沒問過海龜）。</p><p><b>性格：</b>有理想，為「共存共好」行動，用自己會的方法幫人；沒苦硬吞、標準嚴格、極重<b>建立共識</b>。議題：缺乏自我、易過度服務群體（唯「收穫」這隻海龜有自我）。</p><p><b>家族植物：</b>香蒲（隱蔽的力量）。<b>家族礦石：</b>矽化木（變形之石，陪伴前世議題）。</p>"}'::jsonb),
(6,'family','青蛙家族',null,null,null,'水','青蛙',null,null,null,null,'{"title":"青蛙家族 ・ 地群（水）","tags":["水","情感・直覺・療癒"],"html":"<p>對應南方烈日之月與西方蛇月。共通議題：與<b>負向情緒</b>較相關；禮物是「理解自己可能傷害別人、進而自我檢討」。</p><p><b>關鍵分辨：</b>自殘是青蛙、自殺是雷鳥。痛苦是青蛙活下去的動力。</p>"}'::jsonb),
(7,'family','雷鳥家族',null,null,null,'火','雷鳥',null,null,null,null,'{"title":"雷鳥家族 ・ 地群（火）","tags":["火","激情・領導・試煉"],"html":"<p>對應採莓（彩梅）之月與長雪（馬・駝鹿）月。講師自稱天生雷鳥。</p><p><b>議題：榮辱</b>是逼死雷鳥的捷徑；長血（射手）是「雷鳥的終極形態」。</p>"}'::jsonb),
(8,'family','蝴蝶家族',null,null,null,'風','蝴蝶',null,null,null,null,'{"title":"蝴蝶家族 ・ 地群（風）","tags":["風","蛻變・溝通・愛的通道"],"html":"<p>對應渡鴉月（天秤）、玉米之月（東方最後一月）。</p><p><b>性格：</b>「我們是愛的通道」，不用教就會愛人；很容易客製化別人需求，卻對自己不感興趣。<b>不在南方</b>：蝴蝶本身就是「愛」這個課題。</p>"}'::jsonb),
(9,'direction','北方',null,null,null,'土','海龜','北',null,null,null,'{"title":"北方（冬）","tags":["方位・土","智慧・整合"],"html":"<p>北方守護靈主題：心靈智慧、祖先連結、過往經驗整合。生命循環 東→南→西→北→回到東。</p><p class=\"muted small\">課程對北方三月（大地復原・休眠淨化・強風）著墨少，僅提「先活著」是其動力。</p>"}'::jsonb),
(10,'direction','東方',null,null,null,'風','蝴蝶','東',null,null,null,'{"title":"東方（春）","tags":["方位・風","新生・願景"],"html":"<p>東方守護靈主題：新生、靈性願景、天賦展現。對應月份：樹萌芽・蛙回歸・玉米種植（玉米為東方最後一月）。</p>"}'::jsonb),
(11,'direction','南方',null,null,null,'火','雷鳥','南',null,null,null,'{"title":"南方（夏）","tags":["方位・火","愛・行動・青春"],"html":"<p>南方是「愛的季節」，對應青少年，一天中為正午。愛的旅程：烈日（原生家庭）→採莓/彩梅（同儕）→收穫（做回自己）。</p>"}'::jsonb),
(12,'direction','西方',null,null,null,'水','青蛙','西',null,null,null,'{"title":"西方（秋）","tags":["方位・水","內省・轉化・陰影"],"html":"<p>西方守護靈主題：內省、轉化課題、陰影整合。對應月份：群鴨飛遷（渡鴉）・結凍（蛇）・長雪（馬・駝鹿）。</p>"}'::jsonb),
(13,'moon','大地復原之月','12/22','1/19','摩羯','土','海龜','北','雪雁','',null,null,'{"title":"大地復原之月","tags":["北・冬","摩羯","土・海龜"],"html":"<p>北方第一月（12/22–1/19），本命動物雪雁。屬海龜家族（土）。<span class=\"muted\">課程未深入北方。</span></p>"}'::jsonb),
(14,'moon','休眠淨化之月','1/20','2/18','水瓶','風','蝴蝶','北','水獺','',null,null,'{"title":"休眠淨化之月","tags":["北・冬","水瓶","風・蝴蝶"],"html":"<p>北方第二月（1/20–2/18），本命動物水獺。屬蝴蝶家族（風）。<span class=\"muted\">課程未深入北方。</span></p>"}'::jsonb),
(15,'moon','強風之月','2/19','3/20','雙魚','水','青蛙','北','美洲獅','',null,null,'{"title":"強風之月","tags":["北・冬","雙魚","水・青蛙"],"html":"<p>北方第三月（2/19–3/20），本命動物美洲獅。屬青蛙家族（水）。<span class=\"muted\">北方動力為「先活著」。</span></p>"}'::jsonb),
(16,'moon','樹萌芽之月','3/21','4/19','白羊','火','雷鳥','東','紅尾鷹','',null,null,'{"title":"樹萌芽之月","tags":["東・春","白羊","火・雷鳥"],"html":"<p>東方第一月（3/21–4/19），本命動物紅尾鷹。屬雷鳥家族（火）。<span class=\"muted\">課程未深入此月。</span></p>"}'::jsonb),
(17,'moon','蛙回歸之月','4/20','5/20','金牛','土','海龜','東','海狸','',null,null,'{"title":"蛙回歸之月","tags":["東・春","金牛","土・海龜"],"html":"<p>東方第二月（4/20–5/20），本命動物海狸。屬海龜家族（土）。<span class=\"muted\">課程未深入此月。</span></p>"}'::jsonb),
(18,'moon','玉米種植之月','5/21','6/20','雙子','風','蝴蝶','東','鹿','',null,null,'{"title":"玉米種植之月","tags":["東・春","雙子","風・蝴蝶"],"html":"<p>東方<b>最後一月</b>（5/21–6/20），本命動物鹿。屬蝴蝶家族（風）。性格：最成熟、力量開始轉弱；善變但不傷害別人、創造選項；易微過勞但不犯大錯。</p>"}'::jsonb),
(19,'moon','烈日之月','6/21','7/22','巨蟹','水','青蛙','南','紅翼啄木鳥','紅頭啄木鳥／五色鳥',null,null,'{"title":"烈日之月","tags":["南・夏","巨蟹","水・青蛙"],"html":"<p>藥輪中分類最長的月份（6/21–7/22）。核心是「<b>媽媽手冊</b>」型照顧——恩威並施、逼你前進；付出後需被感謝否則易爆炸。案例：戴安娜王妃。</p><p><b>動物：</b>啄木鳥（樹林醫生）／台灣紅頭啄木鳥、五色鳥。<b>植物：</b>紅玫瑰。<b>礦石：</b>紅玉髓（補氣血、海底輪/臍輪）。<b>顏色：</b>玫瑰紅。</p>"}'::jsonb),
(20,'moon','採莓之月（彩梅）','7/23','8/22','獅子','火','雷鳥','南','鱘魚','',null,null,'{"title":"採莓之月（彩梅）","tags":["南・夏","獅子","火・雷鳥"],"html":"<p>南方第二月（7/23–8/22）。<span class=\"muted\">課程未深入完整知識卡。</span></p><p>散見：動物為鱘魚；「外表朗朗厚、距離感是自己設限」；把最早的標籤做大、門檻極高（前提是你不能傷害他）。植物／礦石／顏色逐字稿未提供。</p>"}'::jsonb),
(21,'moon','收穫之月','8/23','9/22','處女','土','海龜','南','棕熊','',null,null,'{"title":"收穫之月（挖回歸／海龜之月）","tags":["南・夏","處女","土・海龜"],"html":"<p>南方第三月（8/23–9/22），南方海龜中「<b>唯一有做自己</b>」的一格——共識標準建得很高、但自我價值極低。不怕得罪人。</p><p><b>性格：</b>把關係「加密化」圈進熟悉圈；改變不了別人就改變自己；易出「恐怖情人」，常送香氛/氣味型禮物想改造你。</p><p class=\"muted small\">植物/礦石以海龜家族整體呈現：香蒲、矽化木（見「海龜家族」）。</p>"}'::jsonb),
(22,'moon','群鴨飛遷之月（渡鴉）','9/23','10/23','天秤','風','蝴蝶','西','渡鴉','星鴉',null,null,'{"title":"群鴨飛遷之月（渡鴉）","tags":["西・秋","天秤","風・蝴蝶"],"html":"<p>西方第一月（9/23–10/23）。關鍵字：<b>先弦先列、優化、公平</b>（他自己的公平）。</p><p>長壽巨型鴉科（25–90 年）；神話與盜火相關、有計謀、會製作工具、與狼同盟；對自己最壞、眼高手低（自我價值與世俗價值的矛盾）。</p><p><b>動物：</b>渡鴉／台灣星鴉。<b>植物：</b>毛蕊花（劈開停滯；喉輪/心輪）。<b>礦石：</b>碧玉（紅活化、綠療舊傷）。</p>"}'::jsonb),
(23,'moon','結凍之月（蛇）','10/24','11/21','天蠍','水','青蛙','西','蛇','金絲蛇',null,null,'{"title":"結凍之月（蛇）","tags":["西・秋","天蠍","水・青蛙"],"html":"<p>西方第二月（10/24–11/21）。三關鍵字：<b>誤解、厭世、半死</b>；陪伴半死之人。</p><p>蛇每次成長都靠<b>蛻皮／痛苦</b>；理解自己與世界不相容而充滿距離、容易修行。22 歲後極難靠近。</p><p><b>動物：</b>蛇／台灣金絲蛇。<b>植物：</b>乳薊（護肝排毒）。<b>礦石：</b>孔雀石（清成年舊傷；吸附過多負面情緒會自裂）。</p><p class=\"hint\">陪伴提醒：絕不說「我也蠻想死」「少了你我該怎麼辦」；不會協助就不要出現。</p>"}'::jsonb),
(24,'moon','長雪之月（馬・駝鹿）','11/22','12/21','射手','火','雷鳥','西','麋鹿／馬・駝鹿','台灣水鹿',null,null,'{"title":"長雪之月（馬・駝鹿）","tags":["西・秋","射手","火・雷鳥"],"html":"<p>西方第三月（11/22–12/21），講師稱「長血」。代表<b>遊子歸鄉、老靈魂</b>；能看見問題但太目標導向、太求全；整合力極好、最難拆；犧牲型人格。</p><p><b>反句：</b>節奏太快、「雷鳥終極形態」、有優越感、會<b>忽悠</b>。</p><p><b>動物：</b>馬與駝鹿／台灣水鹿。<b>植物：</b>黑雲杉（台灣最高樹種）。<b>礦石：</b>黑曜石（帶來大地母親訊息、形成更堅固新形態）。</p>"}'::jsonb),
(25,'path','淨化',null,null,null,null,null,null,null,null,'北','淨化',null),
(26,'path','重建',null,null,null,null,null,null,null,null,'北','重建',null),
(27,'path','純潔',null,null,null,null,null,null,null,null,'北','純潔',null),
(28,'path','清晰',null,null,null,null,null,null,null,null,'東','清晰',null),
(29,'path','智慧',null,null,null,null,null,null,null,null,'東','智慧',null),
(30,'path','光明',null,null,null,null,null,null,null,null,'東','光明',null),
(31,'path','成長',null,null,null,null,null,null,null,null,'南','成長',null),
(32,'path','信任',null,null,null,null,null,null,null,null,'南','信任',null),
(33,'path','愛',null,null,null,null,null,null,null,null,'南','愛',null),
(34,'path','體驗',null,null,null,null,null,null,null,null,'西','體驗',null),
(35,'path','內省',null,null,null,null,null,null,null,null,'西','內省',null),
(36,'path','力量',null,null,null,null,null,null,null,null,'西','力量',null)
on conflict (id) do update set
  layer=excluded.layer, name=excluded.name, date_start=excluded.date_start, date_end=excluded.date_end,
  zodiac=excluded.zodiac, element=excluded.element, family=excluded.family, direction=excluded.direction,
  north_animal=excluded.north_animal, tw_animal=excluded.tw_animal, path_dir=excluded.path_dir,
  path_name=excluded.path_name, knowledge=excluded.knowledge;
