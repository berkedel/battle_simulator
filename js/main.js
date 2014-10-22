//[0]グローバル変数
//
var distHV, //距離補正
    //空地敵情報格納
    deN, //空地敵小隊数
    deSolNum, //空地兵士総数
    en, //兵種配列
    enN, //兵数配列
    enNA, //残兵数配列
    enHeika, //兵科配列
    deF, //小隊防御力
    squadDeF, //小隊補正防御力
    
    //攻撃兵情報格納
    atN, //攻撃小隊数
    solnumAt, //攻撃兵士総数
    sol, //兵種配列
    solnum, //兵数配列
    solnumA, //残兵数配列
    atHeika, //兵科配列
    to, //統率
    squadAt, //小隊攻撃力

    genAt, //将攻撃力
    hp, //将HP
    btl, //討伐ゲージ
    
    //戦闘力構成
    atFAll, //総攻撃力
    deFAll, //総防御力(補正前)
    deHFAll, //総防御力(補正後)

    atHeika, //兵科別攻撃力
    deHeika, //兵科別防御力
    deHHeika, //兵科別防御力
    hos; //相性補正係数
    
    //スキル
var sk = []; //武将攻撃スキル
var skp = []; //部隊攻撃スキル
//経験値
var expV1; //経験値ボーナス(加算)
var expV2; //経験値課金(乗算)
var btlG; //討伐G固定値(0の時討伐ゲージ参照)
var expH; //討伐率
var expbase; //討伐値



//兵士情報
//兵士経験値係数
var exp = [];
exp["-"] = 0;
exp["Ashigaru"] = 1;
exp["Nagayari"] = 1;
exp["Mononofu"] = 2;
exp["Kuni-shuu"] = 1;
exp["Rounin"] = 1;
exp["Yumihei"] = 1;
exp["Nagayumi"] = 1;
exp["Yumi Kiba"] = 2;
exp["Kaizoku-shuu"] = 1;
exp["Nukenin"] = 1;
exp["Kibahei"] = 1;
exp["Seiei Kiba"] = 1;
exp["Akazonae"] = 2;
exp["Horo-shuu"] = 1;
exp["Bandit"] = 1;
exp["Hajo-tsui"] = 1;
exp["Yagura"] = 1;
exp["Oozutsuhei"] = 2;
exp["Teppouhei"] = 2;
exp["Teppou Kiba"] = 2;
exp["Saika-shuu"] = 1;
exp["Petani"] = 1;
exp["Oni"] = 3;
exp["Tengu"] = 4;

//兵士の防御力
var def = [];
def["-"] = 0;
def["Ashigaru"] = 11;
def["Nagayari"] = 16;
def["Mononofu"] = 18;
def["Kuni-shuu"] = 13;
def["Rounin"] = 12;
def["Yumihei"] = 12;
def["Nagayumi"] = 17;
def["Yumi Kiba"] = 19;
def["Kaizoku-shuu"] = 17;
def["Nukenin"] = 12;
def["Kibahei"] = 12;
def["Seiei Kiba"] = 16;
def["Akazonae"] = 20;
def["Horo-shuu"] = 16;
def["Bandit"] = 12;
def["Hajo-tsui"] = 8;
def["Yagura"] = 5;
def["Oozutsuhei"] = 12;
def["Teppouhei"] = 26;
def["Teppou Kiba"] = 18;
def["Saika-shuu"] = 17;
def["Petani"] = 5;
def["Oni"] = 88;
def["Tengu"] = 112;

//兵士の兵科
var heika = [];
heika["-"] = "yari";
heika["Ashigaru"] = "yari";
heika["Nagayari"] = "yari";
heika["Mononofu"] = "yari";
heika["Kuni-shuu"] = "yari";
heika["Rounin"] = "yari";
heika["Yumihei"] = "yumi";
heika["Nagayumi"] = "yumi";
heika["Yumi Kiba"] = "yumi";
heika["Kaizoku-shuu"] = "yumi";
heika["Nukenin"] = "yumi";
heika["Kibahei"] = "kiba";
heika["Seiei Kiba"] = "kiba";
heika["Akazonae"] = "kiba";
heika["Horo-shuu"] = "kiba";
heika["Bandit"] = "kiba";
heika["Hajo-tsui"] = "heiki";
heika["Yagura"] = "heiki";
heika["Oozutsuhei"] = "heiki";
heika["Teppouhei"] = "heiki";
heika["Teppou Kiba"] = "heiki";
heika["Saika-shuu"] = "heiki";
heika["Petani"] = "heiki";
heika["Oni"] = "heiki";
heika["Tengu"] = "heiki";
//兵士のスキル属性
var sheika = [];
sheika["-"] = "yari";
sheika["Ashigaru"] = "yari";
sheika["Nagayari"] = "yari";
sheika["Mononofu"] = "yari:jou";
sheika["Kuni-shuu"] = "yari";
sheika["Rounin"] = "yari";
sheika["Yumihei"] = "yumi";
sheika["Nagayumi"] = "yumi";
sheika["Yumi Kiba"] = "yumi:jou";
sheika["Kaizoku-shuu"] = "yumi";
sheika["Nukenin"] = "yumi";
sheika["Kibahei"] = "kiba";
sheika["Seiei Kiba"] = "kiba";
sheika["Akazonae"] = "kiba:jou";
sheika["Horo-shuu"] = "kiba";
sheika["Bandit"] = "kiba";
sheika["Hajo-tsui"] = "heiki";
sheika["Yagura"] = "heiki";
sheika["Oozutsuhei"] = "heiki";
sheika["Teppouhei"] = "hou";
sheika["Teppou Kiba"] = "hou:jou";
sheika["Saika-shuu"] = "hou";
sheika["Petani"] = "heiki";
sheika["Oni"] = "heiki";
sheika["Tengu"] = "heiki";

//兵士の攻撃力
var att = [];
att["-"] = 0;
att["Ashigaru"] = 11;
att["Nagayari"] = 16;
att["Mononofu"] = 18;
att["Kuni-shuu"] = 17;
att["Yumihei"] = 10;
att["Nagayumi"] = 15;
att["Yumi Kiba"] = 17;
att["Kaizoku-shuu"] = 16;
att["Kibahei"] = 12;
att["Seiei Kiba"] = 17;
att["Akazonae"] = 21;
att["Horo-shuu"] = 19;
att["Hajo-tsui"] = 3;
att["Yagura"] = 14;
att["Oozutsuhei"] = 10;
att["Teppouhei"] = 18;
att["Teppou Kiba"] = 26;
att["Saika-shuu"] = 23;

//兵士の統率
var toSet = [];
toSet["-"] = "yari:yumi:kiba:heiki";
toSet["Ashigaru"] = "yari";
toSet["Nagayari"] = "yari";
toSet["Kuni-shuu"] = "yari";
toSet["Mononofu"] = "yari:yumi";
toSet["Yumihei"] = "yumi";
toSet["Nagayumi"] = "yumi";
toSet["Kaizoku-shuu"] = "yumi";
toSet["Yumi Kiba"] = "yumi:kiba";
toSet["Kibahei"] = "kiba";
toSet["Seiei Kiba"] = "kiba";
toSet["Horo-shuu"] = "kiba";
toSet["Akazonae"] = "yari:kiba";
toSet["Hajo-tsui"] = "heiki";
toSet["Yagura"] = "heiki";
toSet["Oozutsuhei"] = "yumi:heiki";
toSet["Teppouhei"] = "yari:heiki";
toSet["Saika-shuu"] = "yari:heiki";
toSet["Teppou Kiba"] = "kiba:heiki";

//空地兵士
var enData = [];
// enData["1-10000"] = "2,Petani:25,Nukenin:5";
// enData["1-01000"] = "2,Rounin:5,Petani:25";
// enData["2-10010"] = "4,Rounin:5,Nukenin:5,Bandit:15,Petani:20";
// enData["2-00200"] = "4,Rounin:10,Nukenin:10,Bandit:10,Petani:20";
// enData["3-11100"] = "2,Rounin:80,Petani:50";
// enData["3-11110"] = "2,Petani:50,Nukenin:80";
// enData["3-01101"] = "2,Bandit:80,Petani:50";
// enData["4-20001"] = "3,Kaizoku-shuu:95,Petani:348,Nukenin:40";
// enData["4-12000"] = "3,Kuni-shuu:120,Petani:288,Rounin:70";
// enData["4-00210"] = "3,Horo-shuu:120,Petani:336,Bandit:25";
// enData["4-11021"] = "2,Saika-shuu:120,Petani:360";
// enData["5-50002"] = "3,Rounin:520,Nukenin:520,Saika-shuu:70";
// enData["5-30021"] = "3,Kuni-shuu:120,Horo-shuu:650,Petani:312";
// enData["5-13020"] = "4,Rounin:260,Nukenin:260,Bandit:260,Saika-shuu:260";
// enData["5-02300"] = "4,Kuni-shuu:65,Rounin:260,Bandit:520,Petani:260";
// enData["5-01520"] = "3,Kaizoku-shuu:600,Horo-shuu:100,Petani:400";
// enData["5-30140"] = "4,Kuni-shuu:600,Kaizoku-shuu:100,Petani:130,Rounin:260";
// enData["6-30210"] = "3,Kuni-shuu:1600,Rounin:1200,Saika-shuu:234";
// enData["6-14321"] = "3,Mononofu:800,Kuni-shuu:500,Nukenin:1500";
// enData["6-23122"] = "3,Kaizoku-shuu:1600,Nukenin:1300,Saika-shuu:80";
// enData["6-13432"] = "3,Kaizoku-shuu:1500,Bandit:1300,Petani:880";
// enData["6-22242"] = "3,Kuni-shuu:1000,Rounin:1000,Nukenin:1100";
// enData["6-03340"] = "3,Horo-shuu:1500,Saika-shuu:130,Bandit:1300";
// enData["7-42402"] = "3,Nukenin:8000,Petani:1000,Oni:150";
// enData["7-89331"] = "2,Yumi Kiba:1500,Nukenin:7000";
// enData["7-13221"] = "3,Rounin:8000,Petani:2500,Oni:40";
// enData["7-41151"] = "2,Mononofu:1500,Rounin:7000";
// enData["7-52630"] = "2,Akazonae:1300,Bandit:7500";
// enData["7-43510"] = "4,Bandit:7500,Petani:800,Oni:150,Tengu:50";
// enData["8-62211"] = "6,Kuni-shuu:700,Kaizoku-shuu:2000,Nukenin:6000,Saika-shuu:200,Oni:200,Tengu:10";
// enData["8-15112"] = "4,Horo-shuu:1500,Bandit:2600,Oni:800,Tengu:5";
// enData["8-21601"] = "6,Kuni-shuu:2000,Rounin:6000,Horo-shuu:800,Saika-shuu:180,Oni:200,Tengu:5";
// enData["8-33310"] = "2,Oni:1100,Tengu:250";

// enData["五1-10000"] = "2,Petani:25,Nukenin:5";
// enData["五1-01000"] = "2,Bandit:5,Petani:25";
// enData["五2-11020"] = "4,Rounin:10,Nukenin:10,Bandit:10,Petani:20";
// enData["五2-00201"] = "4,Rounin:5,Nukenin:5,Bandit:15,Petani:20";
// enData["五3-11110a"] = "2,Rounin:85,Petani:45";
// enData["五3-11110b"] = "2,Nukenin:85,Petani:45";
// enData["五3-11101"] = "2,Petani:45,Bandit:85";
// enData["五4-11101"] = "2,Saika-shuu:160,Petani:485";
// enData["五4-12100"] = "3,Kaizoku-shuu:130,Petani:455,Nukenin:65";
// enData["五4-11210"] = "3,Kuni-shuu:140,Petani:460,Rounin:95";
// enData["五4-21131"] = "3,Horo-shuu:155,Petani:465,Bandit:30";
// enData["五5-50201"] = "3,Kuni-shuu:185,Horo-shuu:810,Petani:310";
// enData["五5-32010"] = "3,Rounin:790,Nukenin:395,Saika-shuu:160";
// enData["五5-10501"] = "4,Rounin:245,Nukenin:245,Bandit:245,Saika-shuu:485";
// enData["五5-01520"] = "3,Kaizoku-shuu:765,Horo-shuu:130,Petani:380";
// enData["五5-23010"] = "4,Kuni-shuu:725,Kaizoku-shuu:120,Petani:360,Rounin:305";
// enData["五5-04150"] = "4,Kuni-shuu:220,Rounin:360,Bandit:725,Petani:220";
// enData["五6-43311"] = "3,Kuni-shuu:2155,Rounin:1615,Saika-shuu:270";
// enData["五6-22210"] = "3,Kuni-shuu:1410,Rounin:1410,Nukenin:1410";
// enData["五6-11450"] = "3,Kaizoku-shuu:1870,Nukenin:1520,Saika-shuu:115";
// enData["五6-32431"] = "3,Kaizoku-shuu:1715,Bandit:1485,Petani:1025";
// enData["五6-45232"] = "3,Mononofu:1070,Kuni-shuu:665,Nukenin:2005";
// enData["五6-25132"] = "3,Horo-shuu:1890,Saika-shuu:130,Bandit:1635";
// enData["五7-33341"] = "3,Nukenin:7230,Petani:725,Oni:725";
// enData["五7-52222"] = "3,Yumi Kiba:1810,Nukenin:9065,Bandit:905";
// enData["五7-22230"] = "3,Bandit:11025,Petani:1575,Oni:160";
// enData["五7-12630"] = "2,Mononofu:1715,Rounin:10265";
// enData["五7-15152"] = "2,Akazonae:1680,Bandit:10045";
// enData["五7-9 10 651"] = "5,Bandit:2600,Petani:650,Oni:650,Rounin:2600,Nukenin:2600";
// enData["五8-27213"] = "6,Kuni-shuu:515,Kaizoku-shuu:1545,Nukenin:4115,Saika-shuu:515,Oni:1025,Tengu:5";
// enData["五8-22702"] = "4,Horo-shuu:2205,Bandit:4130,Oni:1105,Tengu:5";
// enData["五8-72221"] = "6,Kuni-shuu:2450,Rounin:7335,Horo-shuu:1225,Saika-shuu:1830,Oni:125,Tengu:5";
// enData["五8-33342"] = "2,Oni:1265,Tengu:635";

enData["三1-10000"] = "2,Petani:25,Nukenin:5";
enData["三1-01000"] = "2,Bandit:5,Petani:25";
enData["三2-11020"] = "4,Rounin:10,Nukenin:10,Bandit:10,Petani:20";
enData["三2-00201"] = "4,Rounin:5,Nukenin:5,Bandit:15,Petani:20";
enData["三3-11110a"] = "2,Rounin:85,Petani:45";
enData["三3-11110b"] = "2,Nukenin:85,Petani:45";
enData["三3-11101"] = "2,Petani:45,Bandit:85";
enData["三4-11101"] = "2,Saika-shuu:135,Petani:410";
enData["三4-12100"] = "3,Kaizoku-shuu:110,Petani:385,Nukenin:55";
enData["三4-11210"] = "3,Kuni-shuu:120,Petani:390,Rounin:80";
enData["三4-21131"] = "3,Horo-shuu:130,Petani:395,Bandit:25";
enData["三5-50201"] = "3,Kuni-shuu:155,Horo-shuu:685,Petani:260";
enData["三5-32010"] = "3,Rounin:670,Nukenin:335,Saika-shuu:135";
enData["三5-10501"] = "4,Rounin:205,Nukenin:205,Bandit:205,Saika-shuu:410";
enData["三5-01520"] = "3,Kaizoku-shuu:645,Horo-shuu:110,Petani:320";
enData["三5-23010"] = "4,Kuni-shuu:615,Kaizoku-shuu:100,Petani:305,Rounin:255";
enData["三5-04150"] = "4,Kuni-shuu:185,Rounin:305,Bandit:615,Petani:185";
enData["三6-43311"] = "3,Kuni-shuu:1825,Rounin:1365,Saika-shuu:230";
enData["三6-22210"] = "3,Kuni-shuu:1190,Rounin:1190,Nukenin:1190";
enData["三6-11450"] = "3,Kaizoku-shuu:1580,Nukenin:1285,Saika-shuu:95";
enData["三6-32431"] = "3,Kaizoku-shuu:1450,Bandit:1255,Petani:865";
enData["三6-45232"] = "3,Mononofu:905,Kuni-shuu:565,Nukenin:1695";
enData["三6-25132"] = "3,Horo-shuu:1600,Saika-shuu:110,Bandit:1385";
enData["三7-33341"] = "3,Nukenin:6195,Petani:620,Oni:620";
enData["三7-52222"] = "3,Yumi Kiba:1550,Nukenin:7770,Bandit:780";
enData["三7-22230"] = "3,Bandit:9450,Petani:1350,Oni:135";
enData["三7-12630"] = "2,Mononofu:1470,Rounin:8800";
enData["三7-15152"] = "2,Akazonae:1440,Bandit:8610";
enData["三7-9 10 651"] = "5,Bandit:2230,Petani:555,Oni:555,Rounin:2230,Nukenin:2230";
enData["三8-27213"] = "6,Kuni-shuu:440,Kaizoku-shuu:1325,Nukenin:3525,Saika-shuu:440,Oni:880,Tengu:5";
enData["三8-22702"] = "4,Horo-shuu:1890,Bandit:3540,Oni:945,Tengu:5";
enData["三8-72221"] = "6,Kuni-shuu:2100,Rounin:6285,Horo-shuu:1050,Saika-shuu:1570,Oni:105,Tengu:5";
enData["三8-33342"] = "2,Oni:1085,Tengu:545";

enData["二1-10000"] = "2,Petani:25,Nukenin:5";
enData["二1-01000"] = "2,Bandit:5,Petani:25";
enData["二2-11020"] = "4,Rounin:10,Nukenin:10,Bandit:10,Petani:20";
enData["二2-00201"] = "4,Rounin:5,Nukenin:5,Bandit:15,Petani:20";
enData["二3-11110a"] = "2,Rounin:85,Petani:45";
enData["二3-11110b"] = "2,Nukenin:85,Petani:45";
enData["二3-11101"] = "2,Petani:45,Bandit:85";
enData["二4-11101"] = "2,Saika-shuu:125,Petani:375";
enData["二4-12100"] = "3,Kaizoku-shuu:100,Petani:350,Nukenin:50";
enData["二4-11210"] = "3,Kuni-shuu:110,Petani:355,Rounin:75";
enData["二4-21131"] = "3,Horo-shuu:120,Petani:360,Bandit:25";
enData["二5-50201"] = "3,Kuni-shuu:145,Horo-shuu:625,Petani:240";
enData["二5-32010"] = "3,Rounin:610,Nukenin:305,Saika-shuu:125";
enData["二5-10501"] = "4,Rounin:190,Nukenin:190,Bandit:190,Saika-shuu:375";
enData["二5-01520"] = "3,Kaizoku-shuu:590,Horo-shuu:100,Petani:295";
enData["二5-23010"] = "4,Kuni-shuu:560,Kaizoku-shuu:95,Petani:280,Rounin:235";
enData["二5-04150"] = "4,Kuni-shuu:170,Rounin:280,Bandit:560,Petani:170";
enData["二6-43311"] = "3,Kuni-shuu:1660,Rounin:1245,Saika-shuu:210";
enData["二6-22210"] = "3,Kuni-shuu:1085,Rounin:1085,Nukenin:1085";
enData["二6-11450"] = "3,Kaizoku-shuu:1440,Nukenin:1170,Saika-shuu:90";
enData["二6-32431"] = "3,Kaizoku-shuu:1320,Bandit:1145,Petani:790";
enData["二6-45232"] = "3,Mononofu:825,Kuni-shuu:515,Nukenin:1545";
enData["二6-25132"] = "3,Horo-shuu:1455,Saika-shuu:100,Bandit:1260";
enData["二7-33341"] = "3,Nukenin:5680,Petani:570,Oni:570";
enData["二7-52222"] = "3,Yumi Kiba:1420,Nukenin:7120,Bandit:715";
enData["二7-22230"] = "3,Bandit:8660,Petani:1235,Oni:125";
enData["二7-12630"] = "2,Mononofu:1345,Rounin:8065";
enData["二7-15152"] = "2,Akazonae:1320,Bandit:7890";
enData["二7-9 10 651"] = "5,Bandit:2045,Petani:510,Oni:510,Rounin:2045,Nukenin:2045";
enData["二8-27213"] = "6,Kuni-shuu:405,Kaizoku-shuu:1215,Nukenin:3230,Saika-shuu:405,Oni:805,Tengu:5";
enData["二8-22702"] = "4,Horo-shuu:1730,Bandit:3245,Oni:865,Tengu:5";
enData["二8-72221"] = "6,Kuni-shuu:1925,Rounin:5760,Horo-shuu:960,Saika-shuu:1440,Oni:95,Tengu:5";
enData["二8-33342"] = "2,Oni:995,Tengu:500";

enData["一1-10000"] = "2,Petani:25,Nukenin:5";
enData["一1-01000"] = "2,Bandit:5,Petani:25";
enData["一2-11020"] = "4,Rounin:10,Nukenin:10,Bandit:10,Petani:20";
enData["一2-00201"] = "4,Rounin:5,Nukenin:5,Bandit:15,Petani:20";
enData["一3-11110a"] = "2,Rounin:85,Petani:45";
enData["一3-11110b"] = "2,Nukenin:85,Petani:45";
enData["一3-11101"] = "2,Petani:45,Bandit:85";
enData["一4-11101"] = "2,Saika-shuu:125,Petani:375";
enData["一4-12100"] = "3,Kaizoku-shuu:100,Petani:350,Nukenin:50";
enData["一4-11210"] = "3,Kuni-shuu:110,Petani:355,Rounin:75";
enData["一4-21131"] = "3,Horo-shuu:120,Petani:360,Bandit:25";
enData["一5-50201"] = "3,Kuni-shuu:145,Horo-shuu:625,Petani:240";
enData["一5-32010"] = "3,Rounin:610,Nukenin:305,Saika-shuu:125";
enData["一5-10501"] = "4,Rounin:190,Nukenin:190,Bandit:190,Saika-shuu:375";
enData["一5-01520"] = "3,Kaizoku-shuu:590,Horo-shuu:100,Petani:295";
enData["一5-23010"] = "4,Kuni-shuu:560,Kaizoku-shuu:95,Petani:280,Rounin:235";
enData["一5-04150"] = "4,Kuni-shuu:170,Rounin:280,Bandit:560,Petani:170";
enData["一6-43311"] = "3,Kuni-shuu:1660,Rounin:1245,Saika-shuu:210";
enData["一6-22210"] = "3,Kuni-shuu:1085,Rounin:1085,Nukenin:1085";
enData["一6-11450"] = "3,Kaizoku-shuu:1440,Nukenin:1170,Saika-shuu:90";
enData["一6-32431"] = "3,Kaizoku-shuu:1320,Bandit:1145,Petani:790";
enData["一6-45232"] = "3,Mononofu:825,Kuni-shuu:515,Nukenin:1545";
enData["一6-25132"] = "3,Horo-shuu:1455,Saika-shuu:100,Bandit:1260";
enData["一7-33341"] = "3,Nukenin:5165,Petani:520,Oni:520";
enData["一7-52222"] = "3,Yumi Kiba:1295,Nukenin:6475,Bandit:650";
enData["一7-22230"] = "3,Bandit:7875,Petani:1125,Oni:115";
enData["一7-12630"] = "2,Mononofu:1225,Rounin:7335";
enData["一7-15152"] = "2,Akazonae:1200,Bandit:7175";
enData["一7-9 10 651"] = "5,Bandit:1860,Petani:465,Oni:465,Rounin:1860,Nukenin:1860";
enData["一8-27213"] = "6,Kuni-shuu:370,Kaizoku-shuu:1105,Nukenin:2940,Saika-shuu:370,Oni:735,Tengu:5";
enData["一8-22702"] = "4,Horo-shuu:1575,Bandit:2950,Oni:790,Tengu:5";
enData["一8-72221"] = "6,Kuni-shuu:1750,Rounin:5240,Horo-shuu:875,Saika-shuu:1310,Oni:90,Tengu:5";
enData["一8-33342"] = "2,Oni:905,Tengu:455";

//統率
var tosotu = [];
tosotu.SSS = "120";
tosotu.SS = "115";
tosotu.S = "110";
tosotu.A = "105";
tosotu.B = "100";
tosotu.C = "95";
tosotu.D = "90";
tosotu.E = "85";
tosotu.F = "80";

//[2/固定表示

//小隊行を表示
function SquadRow(a) {
    document.write('<td class="hp">' + a + '</td>'); //小隊
    document.write('<td><select id="sol' + (a - 1) + '" tabindex="1"><script>DispSolList();</script></select></td>'); //兵種
    document.write('<td><input type="text" class="solnum" id="solnum' + (a - 1) + '" tabindex="2" value="0"></td>'); //兵数
    document.write('<td class="solnum"><span id="solnumA' + (a - 1) + '">0</span></td>'); //残兵数

    document.write('<td style="font-size: 70%;">');
    document.write('Inf <select id="toyari' + (a - 1) + '" tabindex="3" class="toCel"><script>DispTo()</script></select>');
    document.write(' Kav<select id="tokiba' + (a - 1) + '" tabindex="3" class="toCel"><script>DispTo()</script></select><br>');
    document.write('Pnh<select id="toyumi' + (a - 1) + '" tabindex="3" class="toCel"><script>DispTo()</script></select>');
    document.write(' Msn<select id="toheiki' + (a - 1) + '" tabindex="3" class="toCel"><script>DispTo()</script></select>');
    document.write('</td>');
    document.write('<td id="to' + (a - 1) + '" width="35">' + 115 + '</td>');

    document.write('<td><input type="text" class="solnum" id="genAt' + (a - 1) + '" tabindex="4" value="0"></td>'); //将攻
    document.write('<td class="force"><span id="squadAt' + (a - 1) + '">0</span></td>'); //小隊攻撃力
    document.write('<td><input type="text" class="hp" id="hp' + (a - 1) + '" tabindex="5" value="100"></td>'); //HP
    document.write('<td class="hp" ><span id= "hpA' + (a - 1) + '">100</span></td>'); //残HP
    document.write('<td><input type="text" class="hp" id="btl' + (a - 1) + '" tabindex="6" value="300"></td>'); //討伐ゲージ
    document.write('<td class="hp" ><span id= "btlA' + (a - 1) + '">50</span></td>'); //残討伐ゲージ
    document.write('<td class="solnum"><span id="expH' + (a - 1) + '">0</span></td>'); //討伐率
    document.write('<td class="force"><span id="expV' + (a - 1) + '">2500</span></td>'); //経験値
    document.write('<td class="force"><span id="state' + (a - 1) + '">正常</span></td>'); //状態
}

//[1]選択表示を表示
//基礎表示
function DispOption(val) {
    document.write('<option value="' + val + '">' + val + '</option>');
}

function DispOptionS(val) {
    document.write('<option value="' + val + '" selected="selected">' + val + '</option>');
}

function DispOption2(val, cap) {
    document.write('<option value="' + val + '">' + cap + '</option>');
}

function DispOption2S(val, cap) {
    document.write('<option value="' + val + '" selected="selected">' + cap + '</option>');
}

//兵種一覧を表示
function DispSolList() {
        DispOption("-");
        DispOption("Ashigaru");
        DispOption("Yumihei");
        DispOption("Kibahei");
        DispOption("Hajo-tsui");
        DispOption("Nagayari");
        DispOption("Nagayumi");
        DispOption("Seiei Kiba");
        DispOption("Yagura");
        DispOption("Teppouhei");
        DispOption("Mononofu");
        DispOption("Yumi Kiba");
        DispOptionS("Akazonae");
        DispOption("Oozutsuhei");
        DispOption("Teppou Kiba");
        DispOption("Kuni-shuu");
        DispOption("Kaizoku-shuu");
        DispOption("Horo-shuu");
        DispOption("Saika-shuu");
    }
    //統率一覧を表示
function DispTo() {
    DispOption("SSS");
    DispOption("SS");
    DispOption("S");
    DispOption("A");
    DispOptionS("B");
    DispOption("C");
    DispOption("D");
    DispOption("E");
    DispOption("F");
}

//空地一覧を表示
function DispFieldList() {
    // DispOption2("8-33310", "8-33310全");
    // DispOption2("8-21601", "8-21601弓");
    // DispOption2("8-15112", "8-15112槍");
    // DispOption2("8-62211", "8-62211馬");
    // DispOption2("7-43510", "7-43510槍");
    // DispOption2("7-52630", "7-52630槍");
    // DispOption2("7-41151", "7-41151弓");
    // DispOption2("7-13221", "7-13221弓");
    // DispOption2S("7-89331", "7-89331馬");
    // DispOption2("7-42402", "7-42402馬");
    // DispOption2("6-03340", "6-03340槍");
    // DispOption2("6-22242", "6-22242弓");
    // DispOption2("6-13432", "6-13432馬");
    // DispOption2("6-23122", "6-23122馬");
    // DispOption2("6-14321", "6-14321弓");
    // DispOption2("6-30210", "6-30210弓");
    // DispOption2("5-30140", "5-30140弓");
    // DispOption2("5-01520", "5-01520馬");
    // DispOption2("5-02300", "5-02300槍");
    // DispOption2("5-13020", "5-13020器");
    // DispOption2("5-30021", "5-30021槍");
    // DispOption2("5-50002", "5-50002弓");
    // DispOption2("4-11021", "4-11021全");
    // DispOption2("4-00210", "4-00210槍");
    // DispOption2("4-12000", "4-12000弓");
    // DispOption2("4-20001", "4-20001馬");
    // DispOption2("3-11100", "3-11100弓");
    // DispOption2("3-11110", "3-11110馬");
    // DispOption2("3-01101", "3-01101槍");
    // DispOption2("2-00200", "2-00200器");
    // DispOption2("2-10010", "2-10010槍器");
    // DispOption2("1-01000", "1-01000弓");
    // DispOption2("1-10000", "1-10000馬");

    // DispOption2("五8-33342", "五8-33342全");
    // DispOption2("五8-22702", "五8-22702槍");
    // DispOption2("五8-27213", "五8-27213馬");
    // DispOption2("五8-72221", "五8-72221弓");
    // DispOption2("五7-33341", "五7-33341馬");
    // DispOption2("五7-52222", "五7-52222馬");
    // DispOption2("五7-12630", "五7-12630弓");
    // DispOption2("五7-15152", "五7-15152槍");
    // DispOption2("五7-9 10 651", "五7-9 10 651器");
    // DispOption2("五7-22230", "五7-22230槍");
    // DispOption2("五6-25132", "五6-25132槍");
    // DispOption2("五6-43311", "五6-43311器");
    // DispOption2("五6-45232", "五6-45232弓");
    // DispOption2("五6-22210", "五6-22210弓");
    // DispOption2("五6-11450", "五6-11450馬");
    // DispOption2("五6-32431", "五6-32431馬");
    // DispOption2("五5-32010", "五5-32010弓");
    // DispOption2("五5-01520", "五5-01520馬");
    // DispOption2("五5-23010", "五5-23010弓");
    // DispOption2("五5-10501", "五5-10501器");
    // DispOption2("五5-04150", "五5-04150槍");
    // DispOption2("五5-50201", "五5-50201槍");
    // DispOption2("五4-11210", "五4-11210弓");
    // DispOption2("五4-12100", "五4-12100馬");
    // DispOption2("五4-11101", "五4-11101全");
    // DispOption2("五4-21131", "五4-21131槍");
    // DispOption2("五3-11110a", "五3-11110(鉱)弓");
    // DispOption2("五3-11110b", "五3-11110(森)馬");
    // DispOption2("五3-11101", "五3-11101槍");
    // DispOption2("五2-00201", "五2-00201槍器");
    // DispOption2("五2-11020", "五2-11020器");
    // DispOption2("五1-01000", "五1-01000槍");
    // DispOption2("五1-10000", "五1-10000馬");


    DispOption2("三8-33342", "Season5-3: 8-33342 Semua");
    DispOption2("三8-22702", "Season5-3: 8-22702 Inf");
    DispOption2("三8-27213", "Season5-3: 8-27213 Kav");
    DispOption2("三8-72221", "Season5-3: 8-72221 Pnh");
    DispOption2("三7-33341", "Season5-3: 7-33341 Kav");
    DispOption2("三7-52222", "Season5-3: 7-52222 Kav");
    DispOption2("三7-12630", "Season5-3: 7-12630 Pnh");
    DispOption2("三7-15152", "Season5-3: 7-15152 Inf");
    DispOption2("三7-9 10 651", "Season5-3: 7-9 10 651 Msn");
    DispOption2("三7-22230", "Season5-3: 7-22230 Inf");
    DispOption2("三6-25132", "Season5-3: 6-25132 Inf");
    DispOption2("三6-43311", "Season5-3: 6-43311 Msn");
    DispOption2("三6-45232", "Season5-3: 6-45232 Pnh");
    DispOption2("三6-22210", "Season5-3: 6-22210 Pnh");
    DispOption2("三6-11450", "Season5-3: 6-11450 Kav");
    DispOption2("三6-32431", "Season5-3: 6-32431 Kav");
    DispOption2("三5-32010", "Season5-3: 5-32010 Pnh");
    DispOption2("三5-01520", "Season5-3: 5-01520 Kav");
    DispOption2("三5-23010", "Season5-3: 5-23010 Pnh");
    DispOption2("三5-10501", "Season5-3: 5-10501 Msn");
    DispOption2("三5-04150", "Season5-3: 5-04150 Inf");
    DispOption2("三5-50201", "Season5-3: 5-50201 Inf");
    DispOption2("三4-11210", "Season5-3: 4-11210 Pnh");
    DispOption2("三4-12100", "Season5-3: 4-12100 Kav");
    DispOption2("三4-11101", "Season5-3: 4-11101 Semua");
    DispOption2("三4-21131", "Season5-3: 4-21131 Inf");
    DispOption2("三3-11110a", "Season5-3: 3-11110(Besi) Pnh");
    DispOption2("三3-11110b", "Season5-3: 3-11110(Kayu) Kav");
    DispOption2("三3-11101", "Season5-3: 3-11101 Inf");
    DispOption2("三2-00201", "Season5-3: 2-00201 Inf Msn");
    DispOption2("三2-11020", "Season5-3: 2-11020 Msn");
    DispOption2("三1-01000", "Season5-3: 1-01000 Inf");
    DispOption2("三1-10000", "Season5-3: 1-10000 Kav");



    DispOption2("二8-33342", "Season5-2: 8-33342 Semua");
    DispOption2("二8-22702", "Season5-2: 8-22702 Inf");
    DispOption2("二8-27213", "Season5-2: 8-27213 Kav");
    DispOption2("二8-72221", "Season5-2: 8-72221 Pnh");
    DispOption2("二7-33341", "Season5-2: 7-33341 Kav");
    DispOption2("二7-52222", "Season5-2: 7-52222 Kav");
    DispOption2("二7-12630", "Season5-2: 7-12630 Pnh");
    DispOption2("二7-15152", "Season5-2: 7-15152 Inf");
    DispOption2("二7-9 10 651", "Season5-2: 7-9 10 651 Msn");
    DispOption2("二7-22230", "Season5-2: 7-22230 Inf");
    DispOption2("二6-25132", "Season5-2: 6-25132 Inf");
    DispOption2("二6-43311", "Season5-2: 6-43311 Msn");
    DispOption2("二6-45232", "Season5-2: 6-45232 Pnh");
    DispOption2("二6-22210", "Season5-2: 6-22210 Pnh");
    DispOption2("二6-11450", "Season5-2: 6-11450 Kav");
    DispOption2("二6-32431", "Season5-2: 6-32431 Kav");
    DispOption2("二5-32010", "Season5-2: 5-32010 Pnh");
    DispOption2("二5-01520", "Season5-2: 5-01520 Kav");
    DispOption2("二5-23010", "Season5-2: 5-23010 Pnh");
    DispOption2("二5-10501", "Season5-2: 5-10501 Msn");
    DispOption2("二5-04150", "Season5-2: 5-04150 Inf");
    DispOption2("二5-50201", "Season5-2: 5-50201 Inf");
    DispOption2("二4-11210", "Season5-2: 4-11210 Pnh");
    DispOption2("二4-12100", "Season5-2: 4-12100 Kav");
    DispOption2("二4-11101", "Season5-2: 4-11101 Semua");
    DispOption2("二4-21131", "Season5-2: 4-21131 Inf");
    DispOption2("二3-11110a", "Season5-2: 3-11110(Besi) Pnh");
    DispOption2("二3-11110b", "Season5-2: 3-11110(Kayu) Kav");
    DispOption2("二3-11101", "Season5-2: 3-11101 Inf");
    DispOption2("二2-00201", "Season5-2: 2-00201 Inf Msn");
    DispOption2("二2-11020", "Season5-2: 2-11020 Msn");
    DispOption2("二1-01000", "Season5-2: 1-01000 Inf");
    DispOption2("二1-10000", "Season5-2: 1-10000 Kav");

    DispOption2("一8-33342", "Season5-1: 8-33342 Semua");
    DispOption2("一8-22702", "Season5-1: 8-22702 Inf");
    DispOption2("一8-27213", "Season5-1: 8-27213 Kav");
    DispOption2("一8-72221", "Season5-1: 8-72221 Pnh");
    DispOption2("一7-33341", "Season5-1: 7-33341 Kav");
    DispOption2("一7-52222", "Season5-1: 7-52222 Kav");
    DispOption2("一7-12630", "Season5-1: 7-12630 Pnh");
    DispOption2("一7-15152", "Season5-1: 7-15152 Inf");
    DispOption2("一7-9 10 651", "Season5-1: 7-9 10 651 Msn");
    DispOption2("一7-22230", "Season5-1: 7-22230 Inf");
    DispOption2("一6-25132", "Season5-1: 6-25132 Inf");
    DispOption2("一6-43311", "Season5-1: 6-43311 Msn");
    DispOption2("一6-45232", "Season5-1: 6-45232 Pnh");
    DispOption2("一6-22210", "Season5-1: 6-22210 Pnh");
    DispOption2("一6-11450", "Season5-1: 6-11450 Kav");
    DispOption2("一6-32431", "Season5-1: 6-32431 Kav");
    DispOption2("一5-32010", "Season5-1: 5-32010 Pnh");
    DispOption2("一5-01520", "Season5-1: 5-01520 Kav");
    DispOption2("一5-23010", "Season5-1: 5-23010 Pnh");
    DispOption2("一5-10501", "Season5-1: 5-10501 Msn");
    DispOption2("一5-04150", "Season5-1: 5-04150 Inf");
    DispOption2("一5-50201", "Season5-1: 5-50201 Inf");
    DispOption2("一4-11210", "Season5-1: 4-11210 Pnh");
    DispOption2("一4-12100", "Season5-1: 4-12100 Kav");
    DispOption2("一4-11101", "Season5-1: 4-11101 Semua");
    DispOption2("一4-21131", "Season5-1: 4-21131 Inf");
    DispOption2("一3-11110a", "Season5-1: 3-11110(Besi) Pnh");
    DispOption2("一3-11110b", "Season5-1: 3-11110(Kayu) Kav");
    DispOption2("一3-11101", "Season5-1: 3-11101 Inf");
    DispOption2("一2-00201", "Season5-1: 2-00201 Inf Msn");
    DispOption2("一2-11020", "Season5-1: 2-11020 Msn");
    DispOption2("一1-01000", "Season5-1: 1-01000 Inf");
    DispOption2("一1-10000", "Season5-1: 1-10000 Kav");
}


//[3]動的枠表示

function DispEnemy() {
    GetEnemyInfo();
    $("#temple").remove(); // tbody以下を削除
    $("#enemytable").append('<tbody id="temple"></tbody>'); //tbodyを再構成

    $("#temple").append('<tr><th>Unit</th><th colspan=2>Jumlah</th><th>Pertahanan</th><th>Total Pertahanan</th></tr>'); //title行
    for (var i = 0; i < en.length; i++) { //小隊情報
        $("#temple").append('<tr id="enr' + i + '"></tr>'); //防御小隊行
        $("#enr" + i).append('<td class="force" id="en' + i + '"></td>'); //兵種
        $("#en" + i).text(en[i]);
        $("#enr" + i).append('<td class="solnum" id="enN' + i + '"></td>'); //兵士数
        $("#enN" + i).text(enN[i]);
        $("#enr" + i).append('<td class="solnum" id="enNA' + i + '"></td>'); //残兵士数
        $("#enr" + i).append('<td class="force" id="deF' + i + '"></td>'); //防御力(補正前)
        $("#deF" + i).text(deF[i]);
        $("#enr" + i).append('<td class="force" id="squadDe' + i + '"></td>'); //補正防御
    }

    $("#temple").append('<tr id="enr"></tr>'); //合計表示行
    $("#enr").append('<th>Total</th>');
    $("#enr").append('<td class="solnum" id="deSolNum"></td>'); //総兵士数
    $("#deSolNum").text(deSolNum);
    $("#enr").append('<td class="solnum" id="deSolNumA"></td>'); //総残兵士数
    $("#enr").append('<td class="force" id="deFAll"></td>'); //総防御(補正前)
    $("#deFAll").text(deFAll);
    $("#enr").append('<td class="force" id="deHFAll"></td>'); //総補正防御
}

//[4]情報設定
//距離補正
function CalcDistance() {
    var dist;
    switch ($("#dist:checked").val()) {
        case "xy":
            var divx = $("#divX").val();
            var divy = $("#divY").val();
            dist = Math.sqrt(divx * divx + divy * divy);
            $("#distV").val(Math.round(dist * 100) / 100);
            break;
        default:
            dist = Number($("#distV").val());
            break;
    }
    var distD = 10;
    if ($("#DistGold").is(":checked")) {
        distD = 20;
    }
    if (dist > distD) {
        distHV = Math.floor(1900 / (dist + 9));
    } else {
        distHV = 100;
    }
    $("#distHV").text(distHV);
}

//空地敵情報
function GetEnemyInfo() {
    var edata = enData[$("#fieldType option:selected").val()];
    var edataArr = edata.split(",");
    en = new Array(edataArr[0]);
    enN = new Array(edataArr[0]);
    for (i = 0; i < edataArr[0]; i++) {
        en[i] = edataArr[i + 1].split(":")[0];
        enN[i] = Number(edataArr[i + 1].split(":")[1]);
    }
    deFAll = 0;
    deSolNum = 0;
    deN = en.length;
    enHeika = new Array(deN);
    deF = new Array(deN);
    deHeika = new Array()
    deHeika["yari"] = 0;
    deHeika["yumi"] = 0;
    deHeika["kiba"] = 0;
    deHeika["heiki"] = 0;
    for (var i = 0; i < deN; i++) {
        deSolNum = deSolNum + enN[i];
        enHeika[i] = heika[en[i]];
        deF[i] = def[en[i]] * enN[i];
        deHeika[heika[en[i]]] = deHeika[heika[en[i]]] + deF[i];
        deFAll = deFAll + deF[i];
    }
}

function SetTo(i, s) {
    if (s == "-") {
        $("#to" + i).text(100);
    } else {
        var toS = toSet[s].split(":");
        $("#to" + i).text((Number(tosotu[$("#to" + toS[0] + i).val()]) + Number(tosotu[$("#to" + toS[toS.length - 1] + i).val()])) / 2);
    }
}

function CalcOffence() { //攻撃部隊計算
    sk["gen"] = $("#skgen").val();
    sk["yari"] = $("#skyari").val();
    sk["yumi"] = $("#skyumi").val();
    sk["kiba"] = $("#skkiba").val();
    sk["heiki"] = $("#skheiki").val();
    sk["hou"] = $("#skhou").val();
    sk["jou"] = $("#skjou").val();
    //	//部隊スキル設定槍弓馬砲を設定すると器も設定：全攻を想定。薩摩隼人に対しては器攻を修正）
    if (skp["yari"] != $("#skpyari").val()) {
        $("#skpheiki").val($("#skpyari").val());
    }
    skp["yari"] = $("#skpyari").val();
    skp["yumi"] = skp["yari"];
    skp["kiba"] = skp["yari"];
    skp["hou"] = skp["yari"];
    skp["heiki"] = $("#skpheiki").val();

    sol = new Array(4);
    solnum = new Array(4);
    to = new Array(4);
    genAt = new Array(4);
    hp = new Array(4);
    btl = new Array(4);
    expH = new Array(4);
    squadAt = new Array(4);
    atHeika = new Array();
    atHeika["yari"] = 0;
    atHeika["yumi"] = 0;
    atHeika["kiba"] = 0;
    atHeika["heiki"] = 0;
    atN = 0;
    var genAtSum = 0;
    var sheikaAr;
    solnumAt = 0;
    atFAll = 0;
    CalcExpV();
    var tmp = 0;
    for (var i = 0; i < 4; i++) {
        sol[i] = $("#sol" + i).val();
        SetTo(i, sol[i]);

        to[i] = Number($("#to" + i).text());
        solnum[i] = Number($("#solnum" + i).val());
        hp[i] = Number($("#hp" + i).val());
        if ((sol[i] != "-") && (hp[i] > 0)) {
            solnumAt = solnumAt + solnum[i];
        }
        tmp = tmp + solnum[i];
        genAt[i] = Number($("#genAt" + i).val());
        genAtSum = genAtSum + Number(genAt[i]);
        if ((solnum[i] > 0) && (hp[i] > 0) && (sol[i] != "-")) {
            atN = atN + 1;
            sheikaAr = sheika[sol[i]].split(":");
            if ((sheikaAr.length == 2) && ($("#skjou").val() > 0)) {
                squadAt[i] = to[i] * (genAt[i] * (1 + sk["gen"] / 100) + att[sol[i]] * solnum[i]) * (1 + sk[sheikaAr[0]] / 100 + sk[sheikaAr[1]] / 100) * (1 + skp[sheikaAr[0]] / 100) * distHV / 10000;

            } else {
                squadAt[i] = to[i] * (genAt[i] * (1 + sk["gen"] / 100) + att[sol[i]] * solnum[i]) * (1 + sk[sheikaAr[0]] / 100) * (1 + skp[sheikaAr[0]] / 100) * distHV / 10000;
            }
            atFAll = atFAll + squadAt[i];
            atHeika[heika[sol[i]]] = atHeika[heika[sol[i]]] + squadAt[i];
        } else {
            squadAt[i] = 0;
            $("#state" + i).text("");
        }
        $("#squadAt" + i).text(Math.round(squadAt[i] * 100) / 100);
        btl[i] = Number($("#btl" + i).val());
        if (btlG == 0) {
            expH[i] = btl[i] + expV1;
        } else {
            expH[i] = btlG + expV1;
        }
        $("#expH" + i).text(expH[i]);
    }
    $("#atN").text(atN);
    $("#solnumAt").text(tmp);
    $("#genAtSum").text(genAtSum);
    $("#atFAll").text(Math.round(atFAll * 100) / 100);
    $("#allAttack").text($("#atFAll").text());

}

function CalcExpV() { //経験値設定計算
    var alv = $("#aLv").val();
    switch (alv) {
        case "1":
            expV1 = 0;
            break;
        default:
            expV1 = 0.5 * alv;
            break;
    }
    $("#aLvV").text(expV1);
    if ($("#tozaimuso").is(":checked")) {
        expV1 = expV1 + 2;
        $("#tozaimusoV").text(2);
    } else {
        $("#tozaimusoV").text(0);
    }
    if ($("#expGold").is(":checked")) {
        expV2 = 30.0;
        $("#expGoldV").text(expV2);

    } else {
        expV2 = 0;
        $("#expGoldV").text(expV2);
    }
    $("#expVS1").text(expV1);
    $("#expVS2").text(expV2);
    switch ($("#enemyType:checked").val()) {
        case "field":
            btlG = 0;
            break;
        default:
            btlG = 100;
            break;
    }
}

function CalcDefence() {
    //戦闘力テーブル描画
    $("#atHeikayari").text(Math.round(atHeika["yari"] * 100) / 100);
    $("#atHeikayumi").text(Math.round(atHeika["yumi"] * 100) / 100);
    $("#atHeikakiba").text(Math.round(atHeika["kiba"] * 100) / 100);
    $("#atHeikaheiki").text(Math.round(atHeika["heiki"] * 100) / 100);
    $("#deHeikayari").text(Math.round(deHeika["yari"] * 100) / 100);
    $("#deHeikayumi").text(Math.round(deHeika["yumi"] * 100) / 100);
    $("#deHeikakiba").text(Math.round(deHeika["kiba"] * 100) / 100);
    $("#deHeikaheiki").text(Math.round(deHeika["heiki"] * 100) / 100);

    //相性補正計算
    hos = new Array();
    hos["heiki"] = 1;
    if (atFAll > 0) {
        hos["yari"] = (atHeika["yari"] + atHeika["yumi"] * 0.5 + atHeika["kiba"] * 2 + atHeika["heiki"] * 0.8) / atFAll;
        hos["yumi"] = (atHeika["yari"] * 2 + atHeika["yumi"] + atHeika["kiba"] * 0.5 + atHeika["heiki"] * 1.3) / atFAll;
        hos["kiba"] = (atHeika["yari"] * 0.5 + atHeika["yumi"] * 2 + atHeika["kiba"] + atHeika["heiki"] * 0.8) / atFAll;
    } else {
        hos["yari"] = 1;
        hos["yumi"] = 1;
        hos["kiba"] = 1;
    }
    $("#Hosyari").text(Math.round(hos["yari"] * 100) / 100);
    $("#Hosyumi").text(Math.round(hos["yumi"] * 100) / 100);
    $("#Hoskiba").text(Math.round(hos["kiba"] * 100) / 100);
    $("#Hosheiki").text(Math.round(hos["heiki"] * 100) / 100);

    deHHeika = new Array(); //兵科別補正防御
    deHHeika["yari"] = deHeika["yari"] * hos["yari"];
    deHHeika["yumi"] = deHeika["yumi"] * hos["yumi"];
    deHHeika["kiba"] = deHeika["kiba"] * hos["kiba"];
    deHHeika["heiki"] = deHeika["heiki"] * hos["heiki"];
    deHFAll = deHHeika["yari"] + deHHeika["yumi"] + deHHeika["kiba"] + deHHeika["heiki"];
    $("#deHHeikayari").text(Math.round(deHHeika["yari"] * 100) / 100);
    $("#deHHeikayumi").text(Math.round(deHHeika["yumi"] * 100) / 100);
    $("#deHHeikakiba").text(Math.round(deHHeika["kiba"] * 100) / 100);
    $("#deHHeikaheiki").text(Math.round(deHHeika["heiki"] * 100) / 100);
    $("#deHFAll").text(Math.round(deHFAll * 100) / 100);
    $("#allDefence").text($("#deHFAll").text());
    //単一兵科時計算
    var oHeika = new Array();
    oHeika["yari"] = deHeika["yari"] + deHeika["yumi"] * 2 + deHeika["kiba"] * 0.5 + deHeika["heiki"];
    oHeika["yumi"] = deHeika["yari"] * 0.5 + deHeika["yumi"] + deHeika["kiba"] * 2 + deHeika["heiki"];
    oHeika["kiba"] = deHeika["yari"] * 2 + deHeika["yumi"] * 0.5 + deHeika["kiba"] + deHeika["heiki"];
    oHeika["heiki"] = deHeika["yari"] * 0.8 + deHeika["yumi"] * 1.3 + deHeika["kiba"] * 0.8 + deHeika["heiki"];
    $("#oHeikayari").text(Math.round(oHeika["yari"] * 100) / 100);
    $("#oHeikayumi").text(Math.round(oHeika["yumi"] * 100) / 100);
    $("#oHeikakiba").text(Math.round(oHeika["kiba"] * 100) / 100);
    $("#oHeikaheiki").text(Math.round(oHeika["heiki"] * 100) / 100);

    //小隊防御力補正
    squadDeF = new Array(deN);
    for (i = 0; i < deN; i++) {
        squadDeF[i] = deF[i] * hos[enHeika[i]];
        $("#squadDe" + i).text(Math.round(squadDeF[i] * 100) / 100);
    }
}

function Justify() {
    if (atFAll > deHFAll) { //勝利
        $("#allDefence").css("color", "blue");
        $("#allAttack").css("color", "red");
        $("#attackState").text("Menang");
        AttackHPCalc();
        DefenceSolCalc();
        AttackSolCalc();
    } else { //敗北
        $("#allDefence").css("color", "red");
        $("#allAttack").css("color", "blue");
        $("#attackState").text("Kalah");
        AttackHPCalc();
        AttackSolCalc();
        DefenceSolCalc();
    }
}

function CalcExp() {
    for (i = 0; i < 4; i++) {
        var tmp = expbase * expH[i] / 100 * (1 + expV2 / 100) / atN;
        if ((hp[i] > 0) && (solnum[i] > 0) && (sol[i] != "-")) {
            $("#expV" + i).text(Math.floor(tmp));
            if (btlG == 0) {
                if (btl[i] > 100) {
                    $("#btlA" + i).text(50);
                } else if (btl[i] < 40) {
                    $("#btlA" + i).text(20);
                } else {
                    $("#btlA" + i).text(Math.round(btl[i] / 2));
                }
            } else {
                $("#btlA" + i).text(btl[i]);
            }
        } else {
            $("#expV" + i).text(Math.floor(0));
            $("#btlA" + i).text(btl[i]);
        }
    }
}

function AttackHPCalc() {
    var tmp;
    for (var i = 0; i < 4; i++) {
        if ((solnum[i] > 0) && (sol[i] != "-") && (hp[i] > 0)) {
            if (atFAll > deHFAll) {
                tmp = hp[i] - 58 / atFAll * deHFAll;
            } else {
                tmp = hp[i] + 42 * atFAll / deHFAll - 105;
            }
            if (tmp < 0) tmp = 0;
            $("#hpA" + i).text(Math.ceil(tmp));
            if (tmp > 0) {
                $("#state" + i).text("Selamat");
            } else {
                $("#state" + i).text("Terluka");
            }
        } else {
            $("#state" + i).text("");
            $("#hpA" + i).text(hp[i]);
        }
    }
}


function DefenceSolCalc() {
    var LosSolNum;
    var i;
    enNA = new Array(deN);
    for (i = 0; i < deN; i++) {
        enNA[i] = enN[i];
    }
    if (atFAll > deHFAll) { //防衛側敗北	先に計算
        if (atFAll < 4 * deHFAll) { //
            LossSolNum = (1 - 0.6 * deHFAll / atFAll) * deSolNum
            LostLossDivide(LossSolNum, squadDeF, enNA);
        } else { //圧倒的敗北
            for (var i = 0; i < deN; i++) {
                enNA[i] = 0;
            }
        }


    } else { //防衛側勝利
        if (4 * atFAll <= deHFAll) { //圧倒的勝利
            LossSolNum = Math.min(0.4 * atFAll / deHFAll * deSolNum, solnumAt);
        } else {
            LossSolNum = 0.4 * atFAll / deHFAll * deSolNum;
        }
        WinLossDivide(LossSolNum, squadDeF, enNA);
    }

    var tmp = 0; //残兵合計
    expbase = 0; //一戦撃破
    for (i = 0; i < deN; i++) {
        $("#enNA" + i).text(enNA[i]);
        tmp = tmp + enNA[i];
        expbase = expbase + (enN[i] - enNA[i]) * exp[en[i]];
    }
    $("#deSolNumA").text(tmp);
    $("#OneAttack").text(expbase);
}

function AttackSolCalc() {
    var i;
    solnumA = new Array(4);
    for (i = 0; i < 4; i++) {
        if ((sol[i] != "-") && (hp[i] > 0)) {
            solnumA[i] = solnum[i];
        } else {
            solnumA[i] = 0;
        }
    }
    if (atFAll > deHFAll) {
        if (atFAll < 4 * deHFAll) { //攻撃側勝利
            LossSolNum = 0.4 * deHFAll / atFAll * solnumAt;
        } else { //圧倒的勝利			
            LossSolNum = Math.min(0.4 * deHFAll / atFAll * solnumAt, deSolNum);
        }
        WinLossDivide(LossSolNum, squadAt, solnumA);

    } else {
        if (atFAll * 4 <= deHFAll) { //圧倒的敗北
            for (var i = 0; i < 4; i++) {
                if ((sol[i] != "-") && (hp[i] > 0)) {
                    solnumA[i] = 0;
                }
            }
        } else { //敗北
            LossSolNum = (1 - 0.6 * atFAll / deHFAll) * solnumAt;
            LostLossDivide(LossSolNum, squadAt, solnumA);
        }
    }
    var tmp = 0;
    for (var i = 0; i < 4; i++) {
        if ((sol[i] != "-") && (hp[i] > 0)) {
            $("#solnumA" + i).text(solnumA[i]);
            tmp = tmp + solnumA[i];
            if ((solnumA[i] == 0) && (solnum[i] > 0)) {
                $("#state" + i).text("Hancur");
            }
        } else {
            $("#solnumA" + i).text(solnum[i]);
            tmp = tmp + solnum[i];
        }
    }
    $("#solnumAtA").text(tmp);
}

function LostLossDivide(lossN, FAr, NAr) {
    var i;
    var LosF;
    var nokori = 0;
    var sumDivF = 0;

    for (i = 0; i < NAr.length; i++) {
        if (NAr[i] > 0) sumDivF = sumDivF + 1 / FAr[i];
    }
    for (i = 0; i < NAr.length; i++) {
        if (NAr[i] > 0) {
            LosF = Math.round(lossN / FAr[i] / sumDivF) + 1;
            if (LosF > NAr[i]) {
                nokori = nokori + (LosF - NAr[i]);
                NAr[i] = 0;
            } else {
                NAr[i] = NAr[i] - LosF;
            }
        }
    }
    lossN = nokori;
    if (lossN > 0) WinLossDivide(lossN, FAr, NAr);
}

function WinLossDivide(lossN, FAr, NAr) {
    var i;
    var LosF;
    var nokori = 0;
    var sumDivF = 0;
    for (i = 0; i < NAr.length; i++) {
        if (NAr[i] > 0) sumDivF = sumDivF + 1 / FAr[i];
    }
    for (i = 0; i < NAr.length; i++) {
        if (NAr[i] > 0) {
            LosF = Math.floor(lossN / FAr[i] / sumDivF);
            if (LosF > NAr[i]) {
                nokori = nokori + (LosF - NAr[i]);
                NAr[i] = 0;
            } else {
                NAr[i] = NAr[i] - LosF;
            }
        }
    }
    lossN = nokori;
    if (lossN > 0) WinLossDivide(lossN, FAr, NAr);
}

function CalcAndDisp() {
    CalcDistance(); //距離情報計算
    CalcOffence(); //攻撃力計算
    DispEnemy(); //敵情報設定
    CalcDefence(); //防御力計算
    Justify();
    CalcExp();
}

$(function() {
    CalcAndDisp();
});

$(function() {
    $("input").change(function() {
        CalcAndDisp();
    });

    $("select").click(function() {
        CalcAndDisp();
    });
    $("input").click(function() {
        CalcAndDisp();
    });
});