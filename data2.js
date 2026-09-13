// ============================================================
// 《飘·黛玉重归》数据文件（二）：第二章 + 第三章
// 文案全部逐字取自《终稿66》，未作修改
// ============================================================

const NODES2 = {

// ---------------- 第二章 四选一 ----------------
c_ch2: { t: 'choice', who: '旁白', opts: [
  { label: '【择缘入口】', fx: {}, next: 'z2a' },
  { label: '【游园自愈】', fx: { ti: 6, dm: 1 }, next: 'c2r1' },
  { label: '【勘破浮华】', fx: { zhi: 6, ti: -3, dm: 1 }, next: 'c2r2' },
  { label: '【悲悯众生】', fx: { shan: 6, zhi: -3, dm: 1 }, next: 'c2r3' }
]},
c2r1: { t: 'line', who: '你', text: '满园繁花，这一世，我不再为落花题诗寄愁。', next: 'ch3pre1' },
c2r2: { t: 'line', who: '你', text: '我早知众人结局，故而看待周遭，只剩一片沉静。', next: 'ch3pre1' },
c2r3: { t: 'line', who: '你', text: '我怜悯他们的命运，却清楚，自己无力渡尽世人。', next: 'ch3pre1' },

// ---------------- 第二章 择缘入口 ----------------
z2a: { t: 'line', who: '紫鹃', text: '园子里，三位公子都在。', next: 'z2b' },
z2b: { t: 'line', who: '你', text: '那便去走走。紫鹃，我今日模样，尚可入眼吗？', next: 'z2c' },
z2c: { t: 'line', who: '紫鹃', text: '姑娘日日都好，今日格外动人。', next: 'z2d' },
z2d: { t: 'line', who: '你', text: '那就好，走吧。', next: 'z2e' },
z2e: { t: 'line', who: '旁白', text: '你已不是前世那个只能等别人来选的黛玉。', next: 'z2f' },
z2f: { t: 'line', who: '旁白', text: '这一次，是你决定要不要走近谁。', next: 'c_ze2' },

c_ze2: { t: 'choice', who: '旁白', opts: [
  { label: '【贾宝玉】', fx: { jia: 10, bei: -5, zhen: -5, zhi: 6, ti: 5, shan: -4 }, next: 'jb2_intro' },
  { label: '【北静王】', fx: { bei: 10, jia: -5, zhen: -5, ti: 6, shan: 5, zhi: -3 }, next: 'bw2_intro' },
  { label: '【甄宝玉】', fx: { zhen: 10, jia: -5, bei: -5, zhi: 5, shan: 6, ti: -4 }, next: 'zb2_intro' }
]},

// ---------------- 第二章 分支一：贾宝玉 ----------------
jb2_intro: { t: 'line', who: '贾宝玉', text: '满园花开灼灼，终究要随风飘零。这般美好留不住，实在令人怅惘。', next: 'c_jb2' },
c_jb2: { t: 'choice', who: '贾宝玉', opts: [
  { label: '【温柔共情，安稳治愈】', fx: { jia: 15, shan: 5 }, next: 'jb2s1' },
  { label: '【点破兴衰，先知醒世】', fx: { jia: 19, zhi: 10 }, next: 'jb2s2' },
  { label: '【淡然观物，随性自在】', fx: { jia: 12, ti: 3 }, next: 'jb2s3' }
]},
jb2s1: [
  { t: 'line', who: '你', text: '花开自有花期，凋零亦是常理。宝玉哥哥，与其为落花伤怀，不如看看眼前之人。' },
  { t: 'line', who: '贾宝玉', text: '眼前人？妹妹指的是……' },
  { t: 'line', who: '你', text: '我说的便是我。方才你看了我几回？' },
  { t: 'line', who: '贾宝玉', text: '我未曾细数……' },
  { t: 'line', who: '你', text: '那便从此刻开始数，数清楚了再来告诉我。' },
  { t: 'line', who: '贾宝玉', text: '妹妹！' },
  { t: 'line', who: '你', text: '不敢数？' },
  { t: 'line', who: '贾宝玉', text: '并非不敢，只怕数出来，要遭妹妹取笑。' },
  { t: 'line', who: '你', text: '我不会笑你，只管数便是。' },
  { t: 'line', who: '贾宝玉', text: '那妹妹也要数我。' },
  { t: 'line', who: '你', text: '你就在我面前，不必数，我看得见。' },
  { t: 'line', who: '贾宝玉', text: '那不一样。妹妹心里有数，才算。' },
  { t: 'line', who: '你', text: '……好，我依你。' }
],
jb2s2: [
  { t: 'line', who: '你', text: '飞花散尽本是寻常，园林繁华、世家鼎盛，终有落幕之时。' },
  { t: 'line', who: '贾宝玉', text: '妹妹是说，这座园子，甚至整个贾府，终有离散倾颓一日？' },
  { t: 'line', who: '你', text: '确是如此。我问你，若大厦倾颓，你打算何以自处？' },
  { t: 'line', who: '贾宝玉', text: '我……我不知。妹妹又当如何？' },
  { t: 'line', who: '你', text: '我一直在为自己谋求生路。你可愿意同我一道筹谋退路？' },
  { t: 'line', who: '贾宝玉', text: '与妹妹一道？' },
  { t: 'line', who: '你', text: '是。学着看账目，辨人心，风雨将至之前，先站稳脚跟。我可以教你。' },
  { t: 'line', who: '贾宝玉', text: '好！妹妹教我，我定然用心学。' },
  { t: 'line', who: '你', text: '但你需应我一事。' },
  { t: 'line', who: '贾宝玉', text: '妹妹尽管吩咐。' },
  { t: 'line', who: '你', text: '待到危难来临，莫要只顾自己脱身，带上我。' },
  { t: 'line', who: '贾宝玉', text: '那是自然！就算我身陷险境，也必护妹妹周全。' },
  { t: 'line', who: '你', text: '呆子。我说的，是我们一同离开。' },
  { t: 'line', who: '贾宝玉', text: '一同离开。记下了。' }
],
jb2s3: [
  { t: 'line', who: '你', text: '四时流转风物更迭，皆是寻常，不必耿耿于怀。宝玉哥哥，何必站得那般远，过来坐。' },
  { t: 'line', who: '贾宝玉', text: '妹妹唤我过去？' },
  { t: 'line', who: '你', text: '亭子本就不大，隔远了说话费力。' },
  { t: 'line', who: '贾宝玉', text: '好。' },
  { t: 'line', who: '你', text: '方才你心中疑惑，问我是否对万事都淡漠了。' },
  { t: 'line', who: '贾宝玉', text: '……是。' },
  { t: 'line', who: '你', text: '并非万事皆无所谓。于我，你是不同的。' },
  { t: 'line', who: '贾宝玉', text: '何处不同？' },
  { t: 'line', who: '你', text: '你自己猜。' },
  { t: 'line', who: '贾宝玉', text: '我猜不透，妹妹直接告诉我吧。' },
  { t: 'line', who: '你', text: '猜到了，才算你的本事。' },
  { t: 'line', who: '贾宝玉', text: '那若是我想出来，妹妹可要认。' },
  { t: 'line', who: '你', text: '等你想出来再说。走吧，随我去别处看花。' },
  { t: 'line', who: '贾宝玉', text: '好。' }
],

// ---------------- 第二章 分支二：北静王 ----------------
bw2_intro: { t: 'line', who: '北静王', text: '贾府看似烈火烹油，内里早已奢靡耗损根基，一阵大风，便足以摇摇欲坠。', next: 'c_bw2' },
c_bw2: { t: 'choice', who: '北静王', opts: [
  { label: '【深度共鸣，知己同心】', fx: { bei: 19, zhi: 12 }, next: 'bw2s1' },
  { label: '【谨言守分，知礼藏锋】', fx: { bei: 17, zhi: 6 }, next: 'bw2s2' },
  { label: '【浅叹时序，温柔共情】', fx: { bei: 16, shan: 5 }, next: 'bw2s3' }
]},
bw2s1: [
  { t: 'line', who: '你', text: '王爷所言极是。只是站得这般高，山风凛冽，可觉得冷？' },
  { t: 'line', who: '北静王', text: '……' },
  { t: 'line', who: '你', text: '我上来陪王爷站一会儿，不碍事吧。' },
  { t: 'line', who: '北静王', text: '姑娘请。' },
  { t: 'line', who: '你', text: '站在此处，眼界便开阔了。你看那些楼宇，看着巍峨，实则根基晃动；再看往来众人，终日奔忙，却不知自己究竟所求何物。' },
  { t: 'line', who: '北静王', text: '一介闺阁少女，竟能看透世家倾覆之根源。' },
  { t: 'line', who: '你', text: '看透容易，破局千难万难。只不过——' },
  { t: 'line', who: '北静王', text: '只不过什么？' },
  { t: 'line', who: '你', text: '若是王爷愿意与我共谋出路，这困局，也未必不能解开。' },
  { t: 'line', who: '北静王', text: '姑娘，这算是向本王邀约吗？' },
  { t: 'line', who: '你', text: '王爷若这般理解，便是。' },
  { t: 'line', who: '北静王', text: '那本王便应下。' },
  { t: 'line', who: '你', text: '一言为定。' }
],
bw2s2: [
  { t: 'line', who: '你', text: '王爷洞察世事，晚辈见识浅薄，不敢妄议世家大局。' },
  { t: 'line', who: '北静王', text: '知分寸，懂敛锋芒，这般心性最为难得。' },
  { t: 'line', who: '你', text: '王爷过誉。只是晚辈心中有一问。' },
  { t: 'line', who: '北静王', text: '但说无妨。' },
  { t: 'line', who: '你', text: '王爷身处朝堂，是否凡事皆压于心底，从不轻易吐露？' },
  { t: 'line', who: '北静王', text: '……' },
  { t: 'line', who: '你', text: '我虽一介女子，却看得出来。像王爷这般人，万事思虑周全，最缺一个可以随心闲谈之人。' },
  { t: 'line', who: '北静王', text: '姑娘倒是敢直言。' },
  { t: 'line', who: '你', text: '我还敢问一句，王爷，可愿将我视作那个可以倾诉心事之人？' },
  { t: 'line', who: '北静王', text: '……本王愿意。' },
  { t: 'line', who: '你', text: '往后心中有郁结，尽可同我说，我口风严实，不会外泄半分。' },
  { t: 'line', who: '北静王', text: '本王记住了。' }
],
bw2s3: [
  { t: 'line', who: '你', text: '繁华难久，盛衰无常。王爷见惯起落沉浮，心中会不会也觉疲惫？' },
  { t: 'line', who: '北静王', text: '……' },
  { t: 'line', who: '你', text: '不必作答。我便陪王爷静立片刻，不语亦可。' },
  { t: 'line', who: '北静王', text: '林姑娘。' },
  { t: 'line', who: '你', text: '嗯。' },
  { t: 'line', who: '北静王', text: '朝堂之上，日日见人来人往，我早已麻木。你这一句话，倒叫我忆起故人。' },
  { t: 'line', who: '你', text: '那位故人，如今尚在王爷身侧吗？' },
  { t: 'line', who: '北静王', text: '早已不在。' },
  { t: 'line', who: '你', text: '那从今往后，便换我陪王爷望月临风。' },
  { t: 'line', who: '北静王', text: '姑娘此话……' },
  { t: 'line', who: '你', text: '句句真心。王爷若嫌聒噪，我便少言；若想叙话，我便听着。' },
  { t: 'line', who: '北静王', text: '好。本王记下。' }
],

// ---------------- 第二章 分支3：甄宝玉 ----------------
zb2_intro: { t: 'line', who: '甄宝玉', text: '人人都说我虚假，处处拿我相较，何为真，何为假，我已然分不清……', next: 'c_zb2' },
c_zb2: { t: 'choice', who: '甄宝玉', opts: [
  { label: '【笃定救赎，立心破妄】', fx: { zhen: 20, zhi: 10 }, next: 'zb2s1' },
  { label: '【温柔陪伴，静渡彷徨】', fx: { zhen: 17, shan: 8 }, next: 'zb2s2' },
  { label: '【理性开导，破除外扰】', fx: { zhen: 15, shan: 3 }, next: 'zb2s3' }
]},
zb2s1: [
  { t: 'line', who: '你', text: '旁人的评判做不得准，真假，该由你自己定义。' },
  { t: 'line', who: '甄宝玉', text: '我……我不知道。' },
  { t: 'line', who: '你', text: '不知便慢慢思索，我陪你。不必困在旁人给你的标签里面。你就是甄宝玉，不必和另一个宝玉比较高低。' },
  { t: 'line', who: '甄宝玉', text: '好，我不再被那些闲话搅乱心神。' },
  { t: 'line', who: '你', text: '往后再有闲言入耳，守住自己本心便够，不必向外人争辩。' },
  { t: 'line', who: '甄宝玉', text: '我记下了。' }
],
zb2s2: [
  { t: 'line', who: '你', text: '世人大多随世事浮沉飘摇，你只需守住本心。甄宝玉，往后你想做些什么？' },
  { t: 'line', who: '甄宝玉', text: '我……我尚无方向。姑娘呢？' },
  { t: 'line', who: '你', text: '我想开一间书肆。若是你愿意，可来帮我打理。' },
  { t: 'line', who: '甄宝玉', text: '我？我真的可以吗？' },
  { t: 'line', who: '你', text: '可以，只是要学好账目算数。' },
  { t: 'line', who: '甄宝玉', text: '我会用心学！' },
  { t: 'line', who: '你', text: '切莫敷衍，学得不好，我是不会收留你的。' },
  { t: 'line', who: '甄宝玉', text: '我必定勤勉，静待姑娘。' },
  { t: 'line', who: '你', text: '好，我等着。' }
],
zb2s3: [
  { t: 'line', who: '你', text: '旁人闲言如风，不入心底，便不会为之动摇。甄宝玉，你信我吗？' },
  { t: 'line', who: '甄宝玉', text: '信。' },
  { t: 'line', who: '你', text: '那你信你自己吗？' },
  { t: 'line', who: '甄宝玉', text: '……' },
  { t: 'line', who: '你', text: '不信也无妨。自今日起，每日对着镜中，告诉自己一句：我是甄宝玉，不是任何人的影子。' },
  { t: 'line', who: '甄宝玉', text: '这般，真的有用吗？' },
  { t: 'line', who: '你', text: '试过方知结果，不妨一试。' },
  { t: 'line', who: '甄宝玉', text: '好，我照做。' },
  { t: 'line', who: '你', text: '试过之后，记得来同我说。' },
  { t: 'line', who: '甄宝玉', text: '我定会前来。' },
  { t: 'line', who: '你', text: '我等你消息。' }
],

// ---------------- 第三章开场旁白 + 四选一 ----------------
ch3pre1: { t: 'line', who: '旁白', text: '又一日宴席，府中人多口杂。', next: 'ch3pre2' },
ch3pre2: { t: 'line', who: '旁白', text: '紫鹃替你揉着肩，小声道：', next: 'ch3pre3' },
ch3pre3: { t: 'line', who: '紫鹃', text: '“姑娘，今儿席上有人拿甄公子和宝二爷比，甄公子脸都白了。北静王那边也遣人问过姑娘安。”', next: 'ch3pre4' },
ch3pre4: { t: 'line', who: '旁白', text: '你心中明白，贾府里没有一件事是偶然。', next: 'ch3pre5' },
ch3pre5: { t: 'line', who: '旁白', text: '人人都在试探你，人人都在看你与谁亲近。', next: 'ch3pre6' },
ch3pre6: { t: 'line', who: '旁白', text: '你可以继续应酬，也可以抽身自守。', next: 'ch3pre7' },
ch3pre7: { t: 'line', who: '旁白', text: '这一选，会决定你接下来是卷入人心，还是稳住自身。', next: 'c_ch3' },

c_ch3: { t: 'choice', who: '旁白', opts: [
  { label: '【择缘入口】', fx: {}, next: 'z3a' },
  { label: '【托辞静养】', fx: { ti: 6, dm: 1 }, next: 'c3r1' },
  { label: '【洞察人心】', fx: { zhi: 6, shan: -4, dm: 1 }, next: 'c3r2' },
  { label: '【悲悯飘摇】', fx: { shan: 6, ti: -4, dm: 1 }, next: 'c3r3' }
]},
c3r1: { t: 'line', who: '你', text: '不站队，不曲意逢迎，不勉强自己强作欢颜。', next: 'ch4pre1' },
c3r2: { t: 'line', who: '你', text: '前世看不破的人心，今生洞若观火，心境也随之寒凉几分。', next: 'ch4pre1' },
c3r3: { t: 'line', who: '你', text: '我懂众人心中惶惑，亦知自己的不安。只是我不会再将所有人的重担，全都揽到自己肩上。', next: 'ch4pre1' },

// ---------------- 第三章 择缘入口 ----------------
z3a: { t: 'line', who: '紫鹃', text: '宴上人声嘈杂，姑娘打算去往何处？', next: 'z3b' },
z3b: { t: 'line', who: '你', text: '先观望片刻。紫鹃，那三位公子今日，各穿什么颜色衣衫？', next: 'z3c' },
z3c: { t: 'line', who: '紫鹃', text: '姑娘这是……', next: 'z3d' },
z3d: { t: 'line', who: '你', text: '总要瞧瞧，哪一位入眼。', next: 'z3e' },
z3e: { t: 'line', who: '紫鹃', text: '姑娘如今说话，竟是这般坦荡。', next: 'z3f' },
z3f: { t: 'line', who: '你', text: '坦荡又何妨，走吧。', next: 'c_ze3' },

c_ze3: { t: 'choice', who: '旁白', opts: [
  { label: '【贾宝玉】', fx: { jia: 10, bei: -5, zhen: -5, shan: 7, ti: 4, zhi: -4 }, next: 'jb3_intro' },
  { label: '【北静王】', fx: { bei: 10, jia: -5, zhen: -5, zhi: 6, shan: 5, ti: -4 }, next: 'bw3_intro' },
  { label: '【甄宝玉】', fx: { zhen: 10, jia: -5, bei: -5, ti: 6, zhi: 4, shan: -4 }, next: 'zb3_intro' }
]},

// ---------------- 第三章 分支1：贾宝玉 ----------------
jb3_intro: { t: 'line', who: '贾宝玉', text: '妹妹快看，梨花漫天纷飞，纵然开得再盛，终究难逃凋零。方才我一直在寻你。', next: 'c_jb3' },
c_jb3: { t: 'choice', who: '贾宝玉', opts: [
  { label: '【轻声共情落花之叹】', fx: { jia: 18, zhi: 9 }, next: 'jb3s1' },
  { label: '【点破繁花之下的隐患】', fx: { jia: 16, zhi: 5 }, next: 'jb3s2' },
  { label: '【浅淡闲谈，避谈沉重世事】', fx: { jia: 14 }, next: 'jb3s3' }
]},
jb3s1: [
  { t: 'line', who: '你', text: '花开花落本是常理。只是你方才说，一直在寻我——寻到之后，又当如何？' },
  { t: 'line', who: '贾宝玉', text: '寻到妹妹，心中便安定。' },
  { t: 'line', who: '你', text: '仅此而已？再无别的念想？' },
  { t: 'line', who: '贾宝玉', text: '妹妹想要听什么？' },
  { t: 'line', who: '你', text: '想听真心话。你四处寻我，是怕寻不见，还是心底想要见我？' },
  { t: 'line', who: '贾宝玉', text: '……是想要见妹妹。' },
  { t: 'line', who: '你', text: '既如此，下次不必四处寻觅，径直来找我便是。' },
  { t: 'line', who: '贾宝玉', text: '好。那妹妹愿意见我吗？' },
  { t: 'line', who: '你', text: '你若来，我便见。我也会寻你。' },
  { t: 'line', who: '贾宝玉', text: '也让妹妹寻我？' },
  { t: 'line', who: '你', text: '只许你找我，不许我寻你吗？' },
  { t: 'line', who: '贾宝玉', text: '自然准许！妹妹何时来，我何时都在。' },
  { t: 'line', who: '你', text: '我们就此说好。' }
],
jb3s2: [
  { t: 'line', who: '你', text: '眼下梨花烂漫，可树根早已遭虫蛀蚀。宝玉哥哥，可愿同我看看这藏在繁华底下的隐患？' },
  { t: 'line', who: '贾宝玉', text: '妹妹此言……莫非这园子，乃至整个贾府，已经潜藏大祸？' },
  { t: 'line', who: '你', text: '不是潜藏，是裂痕早已显露，只是众人不愿睁眼看清。' },
  { t: 'line', who: '贾宝玉', text: '为何唯独妹妹看得明白？' },
  { t: 'line', who: '你', text: '我若不去看，便无人替我警醒。如今我拉上你，你便要一同看清现实。' },
  { t: 'line', who: '贾宝玉', text: '好，我随妹妹，还请妹妹教我。' },
  { t: 'line', who: '你', text: '第一，莫要终日沉溺风月闲愁；第二，留心府中银钱往来；第三，切莫轻易卷入派系纷争。' },
  { t: 'line', who: '贾宝玉', text: '我一一记下。' },
  { t: 'line', who: '你', text: '那我考你，若是旁人劝你站队，你该如何？' },
  { t: 'line', who: '贾宝玉', text: '我……我先来问妹妹主意。' },
  { t: 'line', who: '你', text: '不可事事依赖我，你要有自己的决断。' },
  { t: 'line', who: '贾宝玉', text: '那我便既不应允，也不回绝，先观望妹妹态度。' },
  { t: 'line', who: '你', text: '……也算一条可行的法子。' },
  { t: 'line', who: '贾宝玉', text: '妹妹方才，是笑了吧！' },
  { t: 'line', who: '你', text: '我并未笑。' },
  { t: 'line', who: '贾宝玉', text: '嘴⻆分明扬起来了！' },
  { t: 'line', who: '你', text: '……看花。' }
],
jb3s3: [
  { t: 'line', who: '你', text: '宴席佳肴满桌，何苦对着落花暗自伤怀。宝玉哥哥，可用过膳⻝？' },
  { t: 'line', who: '贾宝玉', text: '我……还未曾。' },
  { t: 'line', who: '你', text: '那便陪我稍用些，一味看花，腹中会饥。' },
  { t: 'line', who: '贾宝玉', text: '好。' },
  { t: 'line', who: '你', text: '方才你说，我不在，这宴席便少了意趣。' },
  { t: 'line', who: '贾宝玉', text: '确是如此。' },
  { t: 'line', who: '你', text: '往后可以常来找我，我让日子多几分意趣。' },
  { t: 'line', who: '贾宝玉', text: '好，我日日都来！' },
  { t: 'line', who: '你', text: '日日来可不行，你尚需读书向学。' },
  { t: 'line', who: '贾宝玉', text: '那我读完书便来。' },
  { t: 'line', who: '你', text: '如此安排才算妥当。' }
],

// ---------------- 第三章 分支2：北静王 ----------------
bw3_intro: { t: 'line', who: '北静王', text: '林姑娘。方才见你立于梨花树下，似有心事萦怀。', next: 'c_bw3' },
c_bw3: { t: 'choice', who: '北静王', opts: [
  { label: '【和他共论世家盛衰】', fx: { bei: 19, zhi: 10 }, next: 'bw3s1' },
  { label: '【守礼应答，不多妄议家事】', fx: { bei: 16, zhi: 6 }, next: 'bw3s2' },
  { label: '【温和感慨四时流转】', fx: { bei: 15, shan: 5 }, next: 'bw3s3' }
]},
bw3s1: [
  { t: 'line', who: '你', text: '王爷看得出来？那我便不隐瞒。我在思忖，贾府这棵大树，还能支撑多久。' },
  { t: 'line', who: '北静王', text: '姑娘眼界，胜过府中一众掌权⻓辈。' },
  { t: 'line', who: '你', text: '王爷莫要过多夸赞，夸得重了，我反倒不敢直言。我想问王爷，若有朝一日大厦倾覆，王爷会抽身离去吗？' },
  { t: 'line', who: '北静王', text: '本王走或留，要看姑娘尚在不在此处。' },
  { t: 'line', who: '你', text: '王爷这句话，我记下了。' },
  { t: 'line', who: '北静王', text: '姑娘打算如何记？' },
  { t: 'line', who: '你', text: '刻在心底。王爷若要离去，我为你饯行；王爷若留下，我便相陪。' },
  { t: 'line', who: '北静王', text: '林姑娘，这番话，本王听得心悦。' },
  { t: 'line', who: '你', text: '可否再复述一遍方才那句，我尚未听够。' },
  { t: 'line', who: '北静王', text: '本王走不走，看姑娘在不在。' },
  { t: 'line', who: '你', text: '好。也请王爷记住我今日所言——我会陪着王爷。' }
],
bw3s2: [
  { t: 'line', who: '你', text: '晚辈见识浅薄，不敢妄议世家祸福，只陪王爷共赏这一树梨花便好。' },
  { t: 'line', who: '北静王', text: '懂得藏锋，是乱世自保的良方。只是一味收敛锋芒，旁人便会以为你全无棱⻆。' },
  { t: 'line', who: '你', text: '那王爷觉得，我应当何时展露？' },
  { t: 'line', who: '北静王', text: '该展露之时。' },
  { t: 'line', who: '你', text: '那如今，算不算时机？' },
  { t: 'line', who: '北静王', text: '姑娘想展露给谁看？' },
  { t: 'line', who: '你', text: '展露给王爷看。王爷看我，可否当得？' },
  { t: 'line', who: '北静王', text: '当得。本王静待。' },
  { t: 'line', who: '你', text: '那王爷好好看着，若是我展露锋芒，绝不会手下留情。' },
  { t: 'line', who: '北静王', text: '好，本王拭目以待。' }
],
bw3s3: [
  { t: 'line', who: '你', text: '四季轮转，花开必有凋零。王爷，花谢之后，来年还会再开吗？' },
  { t: 'line', who: '北静王', text: '自是会开。' },
  { t: 'line', who: '你', text: '那这座园子，园中的人呢？' },
  { t: 'line', who: '北静王', text: '……' },
  { t: 'line', who: '你', text: '王爷不必作答。花落尚可重开，人散亦有重逢机缘。只要王爷愿意，来年花开，我依旧陪王爷赏玩。' },
  { t: 'line', who: '北静王', text: '林姑娘。' },
  { t: 'line', who: '你', text: '王爷不必言语，静看繁花就好，我就在这里。' }
],

// ---------------- 第三章 分支3：甄宝玉 ----------------
zb3_intro: { t: 'line', who: '甄宝玉', text: '姑娘……旁人总拿我和贾府那位宝玉相较，句句讥讽，我无处躲避。', next: 'c_zb3' },
c_zb3: { t: 'choice', who: '甄宝玉', opts: [
  { label: '【当众轻声为他辩白】', fx: { zhen: 20, shan: 7 }, next: 'zb3s1' },
  { label: '【轻声开导，劝他不必在意流言】', fx: { zhen: 18, zhi: 9 }, next: 'zb3s2' },
  { label: '【安静相伴，不多言语】', fx: { zhen: 16, shan: 5 }, next: 'zb3s3' }
]},
zb3s1: [
  { t: 'line', who: '你', text: '甄宝玉，过来。' },
  { t: 'line', who: '甄宝玉', text: '姑娘……' },
  { t: 'line', who: '你', text: '旁人怎么说，不必理会。我问你，今日你穿的是什么颜色衣裳？' },
  { t: 'line', who: '甄宝玉', text: '……⻘色。' },
  { t: 'line', who: '你', text: '甚好，远比那些流言闲话悦目。' },
  { t: 'line', who: '甄宝玉', text: '姑娘……' },
  { t: 'line', who: '你', text: '旁人愿意比较，便由他们去。活着的是你自己。往后若是烦闷，可以常来找我闲谈。' },
  { t: 'line', who: '甄宝玉', text: '姑娘愿意接纳我？' },
  { t: 'line', who: '你', text: '可以。但你要答应我，不要再一味躲闪。旁人非议之时，挺直脊背直视他们。你立得住，旁人便不敢肆意轻辱。' },
  { t: 'line', who: '甄宝玉', text: '好，我会挺直身子。' }
],
zb3s2: [
  { t: 'line', who: '你', text: '旁人闲言如同过堂之风，风过便散。甄宝玉，你信我吗？' },
  { t: 'line', who: '甄宝玉', text: '信。' },
  { t: 'line', who: '你', text: '那你信得过你自己吗？' },
  { t: 'line', who: '甄宝玉', text: '……' },
  { t: 'line', who: '你', text: '不信也无妨。教你一个法子，旁人再嘲讽你，便在心间默念：黛玉说，我便是甄宝玉。' },
  { t: 'line', who: '甄宝玉', text: '姑娘……' },
  { t: 'line', who: '你', text: '此法可行吗？' },
  { t: 'line', who: '甄宝玉', text: '可行。心中念及姑娘的话，惶恐便消减大半。' },
  { t: 'line', who: '你', text: '那就好。心中惶惑难安之时，只管来找我，我再同你说一遍。' },
  { t: 'line', who: '甄宝玉', text: '好，我一定前来。' }
],
zb3s3: [
  { t: 'line', who: '你', text: '甄宝玉，陪我缓步走走吧，不必多言。' },
  { t: 'line', who: '甄宝玉', text: '好。' },
  { t: 'line', who: '旁白', text: '（沉默同行）' },
  { t: 'line', who: '你', text: '甄宝玉。' },
  { t: 'line', who: '甄宝玉', text: '姑娘？' },
  { t: 'line', who: '你', text: '往后，你想成为什么样的人。' },
  { t: 'line', who: '甄宝玉', text: '我想像姑娘一般。' },
  { t: 'line', who: '你', text: '像我？' },
  { t: 'line', who: '甄宝玉', text: '姑娘清楚自己所求，我也想寻到属于我的方向。' },
  { t: 'line', who: '你', text: '那便慢慢找寻，寻到了，务必第一时间告知我。' },
  { t: 'line', who: '甄宝玉', text: '好，寻得答案，第一个便告诉姑娘。' },
  { t: 'line', who: '你', text: '切莫失信。' },
  { t: 'line', who: '甄宝玉', text: '绝不⻝言。' }
],

// ---------------- 第三章收尾 → 第四章开场旁白 ----------------
ch4pre1: { t: 'line', who: '旁白', text: '夜里风凉，紫鹃替你披上外衫。', next: 'ch4pre2' },
ch4pre2: { t: 'line', who: '紫鹃', text: '姑娘，三位公子都遣人来问过。宝玉公子问您今日可好，北静王那边送了一盏新茶，甄公子托人递了一首诗稿。', next: 'ch4pre3' },
ch4pre3: { t: 'line', who: '旁白', text: '你心中清楚，他们都在靠近你。', next: 'ch4pre4' },
ch4pre4: { t: 'line', who: '旁白', text: '可你更清楚，若此刻心软，便会重蹈前世覆辙。', next: 'ch4pre5' },
ch4pre5: { t: 'line', who: '旁白', text: '月色正好，清风归你，这一夜你只想好好想一想：这一世，你到底要什么。', next: 'c_ch4' }

};

// 第二章/第三章分支对话结束后汇入下一章开场
['jb2s1','jb2s2','jb2s3','bw2s1','bw2s2','bw2s3','zb2s1','zb2s2','zb2s3'].forEach(k => NODES2[k].next = 'ch3pre1');
['jb3s1','jb3s2','jb3s3','bw3s1','bw3s2','bw3s3','zb3s1','zb3s2','zb3s3'].forEach(k => NODES2[k].next = 'ch4pre1');
