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
exp["足軽"] = 1;
exp["長槍足軽"] = 1;
exp["武士"] = 2;
exp["国人衆"] = 1;
exp["浪人"] = 1;
exp["弓足軽"] = 1;
exp["長弓兵"] = 1;
exp["弓騎馬"] = 2;
exp["海賊衆"] = 1;
exp["抜け忍"] = 1;
exp["騎馬兵"] = 1;
exp["精鋭騎馬"] = 1;
exp["赤備え"] = 2;
exp["母衣衆"] = 1;
exp["野盗"] = 1;
exp["破城鎚"] = 1;
exp["攻城櫓"] = 1;
exp["大筒兵"] = 2;
exp["鉄砲足軽"] = 2;
exp["騎馬鉄砲"] = 2;
exp["雑賀衆"] = 1;
exp["農民"] = 1;
exp["鬼"] = 3;
exp["天狗"] = 4;

//兵士の防御力
var def = [];
def["-"] = 0;
def["足軽"] = 11;
def["長槍足軽"] = 16;
def["武士"] = 18;
def["国人衆"] = 13;
def["浪人"] = 12;
def["弓足軽"] = 12;
def["長弓兵"] = 17;
def["弓騎馬"] = 19;
def["海賊衆"] = 17;
def["抜け忍"] = 12;
def["騎馬兵"] = 12;
def["精鋭騎馬"] = 16;
def["赤備え"] = 20;
def["母衣衆"] = 16;
def["野盗"] = 12;
def["破城鎚"] = 8;
def["攻城櫓"] = 5;
def["大筒兵"] = 12;
def["鉄砲足軽"] = 26;
def["騎馬鉄砲"] = 18;
def["雑賀衆"] = 17;
def["農民"] = 5;
def["鬼"] = 88;
def["天狗"] = 112;

//兵士の兵科
var heika = [];
heika["-"] = "yari";
heika["足軽"] = "yari";
heika["長槍足軽"] = "yari";
heika["武士"] = "yari";
heika["国人衆"] = "yari";
heika["浪人"] = "yari";
heika["弓足軽"] = "yumi";
heika["長弓兵"] = "yumi";
heika["弓騎馬"] = "yumi";
heika["海賊衆"] = "yumi";
heika["抜け忍"] = "yumi";
heika["騎馬兵"] = "kiba";
heika["精鋭騎馬"] = "kiba";
heika["赤備え"] = "kiba";
heika["母衣衆"] = "kiba";
heika["野盗"] = "kiba";
heika["破城鎚"] = "heiki";
heika["攻城櫓"] = "heiki";
heika["大筒兵"] = "heiki";
heika["鉄砲足軽"] = "heiki";
heika["騎馬鉄砲"] = "heiki";
heika["雑賀衆"] = "heiki";
heika["農民"] = "heiki";
heika["鬼"] = "heiki";
heika["天狗"] = "heiki";
//兵士のスキル属性
var sheika = [];
sheika["-"] = "yari";
sheika["足軽"] = "yari";
sheika["長槍足軽"] = "yari";
sheika["武士"] = "yari:jou";
sheika["国人衆"] = "yari";
sheika["浪人"] = "yari";
sheika["弓足軽"] = "yumi";
sheika["長弓兵"] = "yumi";
sheika["弓騎馬"] = "yumi:jou";
sheika["海賊衆"] = "yumi";
sheika["抜け忍"] = "yumi";
sheika["騎馬兵"] = "kiba";
sheika["精鋭騎馬"] = "kiba";
sheika["赤備え"] = "kiba:jou";
sheika["母衣衆"] = "kiba";
sheika["野盗"] = "kiba";
sheika["破城鎚"] = "heiki";
sheika["攻城櫓"] = "heiki";
sheika["大筒兵"] = "heiki";
sheika["鉄砲足軽"] = "hou";
sheika["騎馬鉄砲"] = "hou:jou";
sheika["雑賀衆"] = "hou";
sheika["農民"] = "heiki";
sheika["鬼"] = "heiki";
sheika["天狗"] = "heiki";

//兵士の攻撃力
var att = [];
att["-"] = 0;
att["足軽"] = 11;
att["長槍足軽"] = 16;
att["武士"] = 18;
att["国人衆"] = 17;
att["弓足軽"] = 10;
att["長弓兵"] = 15;
att["弓騎馬"] = 17;
att["海賊衆"] = 16;
att["騎馬兵"] = 12;
att["精鋭騎馬"] = 17;
att["赤備え"] = 21;
att["母衣衆"] = 19;
att["破城鎚"] = 3;
att["攻城櫓"] = 14;
att["大筒兵"] = 10;
att["鉄砲足軽"] = 18;
att["騎馬鉄砲"] = 26;
att["雑賀衆"] = 23;

//兵士の統率
var toSet = [];
toSet["-"] = "yari:yumi:kiba:heiki";
toSet["足軽"] = "yari";
toSet["長槍足軽"] = "yari";
toSet["国人衆"] = "yari";
toSet["武士"] = "yari:yumi";
toSet["弓足軽"] = "yumi";
toSet["長弓兵"] = "yumi";
toSet["海賊衆"] = "yumi";
toSet["弓騎馬"] = "yumi:kiba";
toSet["騎馬兵"] = "kiba";
toSet["精鋭騎馬"] = "kiba";
toSet["母衣衆"] = "kiba";
toSet["赤備え"] = "yari:kiba";
toSet["破城鎚"] = "heiki";
toSet["攻城櫓"] = "heiki";
toSet["大筒兵"] = "yumi:heiki";
toSet["鉄砲足軽"] = "yari:heiki";
toSet["雑賀衆"] = "yari:heiki";
toSet["騎馬鉄砲"] = "kiba:heiki";

//空地兵士
var enData = [];
enData["1-10000"] = "2,農民:25,抜け忍:5";
enData["1-01000"] = "2,浪人:5,農民:25";
enData["2-10010"] = "4,浪人:5,抜け忍:5,野盗:15,農民:20";
enData["2-00200"] = "4,浪人:10,抜け忍:10,野盗:10,農民:20";
enData["3-11100"] = "2,浪人:80,農民:50";
enData["3-11110"] = "2,農民:50,抜け忍:80";
enData["3-01101"] = "2,野盗:80,農民:50";
enData["4-20001"] = "3,海賊衆:95,農民:348,抜け忍:40";
enData["4-12000"] = "3,国人衆:120,農民:288,浪人:70";
enData["4-00210"] = "3,母衣衆:120,農民:336,野盗:25";
enData["4-11021"] = "2,雑賀衆:120,農民:360";
enData["5-50002"] = "3,浪人:520,抜け忍:520,雑賀衆:70";
enData["5-30021"] = "3,国人衆:120,母衣衆:650,農民:312";
enData["5-13020"] = "4,浪人:260,抜け忍:260,野盗:260,雑賀衆:260";
enData["5-02300"] = "4,国人衆:65,浪人:260,野盗:520,農民:260";
enData["5-01520"] = "3,海賊衆:600,母衣衆:100,農民:400";
enData["5-30140"] = "4,国人衆:600,海賊衆:100,農民:130,浪人:260";
enData["6-30210"] = "3,国人衆:1600,浪人:1200,雑賀衆:234";
enData["6-14321"] = "3,武士:800,国人衆:500,抜け忍:1500";
enData["6-23122"] = "3,海賊衆:1600,抜け忍:1300,雑賀衆:80";
enData["6-13432"] = "3,海賊衆:1500,野盗:1300,農民:880";
enData["6-22242"] = "3,国人衆:1000,浪人:1000,抜け忍:1100";
enData["6-03340"] = "3,母衣衆:1500,雑賀衆:130,野盗:1300";
enData["7-42402"] = "3,抜け忍:8000,農民:1000,鬼:150";
enData["7-89331"] = "2,弓騎馬:1500,抜け忍:7000";
enData["7-13221"] = "3,浪人:8000,農民:2500,鬼:40";
enData["7-41151"] = "2,武士:1500,浪人:7000";
enData["7-52630"] = "2,赤備え:1300,野盗:7500";
enData["7-43510"] = "4,野盗:7500,農民:800,鬼:150,天狗:50";
enData["8-62211"] = "6,国人衆:700,海賊衆:2000,抜け忍:6000,雑賀衆:200,鬼:200,天狗:10";
enData["8-15112"] = "4,母衣衆:1500,野盗:2600,鬼:800,天狗:5";
enData["8-21601"] = "6,国人衆:2000,浪人:6000,母衣衆:800,雑賀衆:180,鬼:200,天狗:5";
enData["8-33310"] = "2,鬼:1100,天狗:250";

enData["五1-10000"] = "2,農民:25,抜け忍:5";
enData["五1-01000"] = "2,野盗:5,農民:25";
enData["五2-11020"] = "4,浪人:10,抜け忍:10,野盗:10,農民:20";
enData["五2-00201"] = "4,浪人:5,抜け忍:5,野盗:15,農民:20";
enData["五3-11110a"] = "2,浪人:85,農民:45";
enData["五3-11110b"] = "2,抜け忍:85,農民:45";
enData["五3-11101"] = "2,農民:45,野盗:85";
enData["五4-11101"] = "2,雑賀衆:160,農民:485";
enData["五4-12100"] = "3,海賊衆:130,農民:455,抜け忍:65";
enData["五4-11210"] = "3,国人衆:140,農民:460,浪人:95";
enData["五4-21131"] = "3,母衣衆:155,農民:465,野盗:30";
enData["五5-50201"] = "3,国人衆:185,母衣衆:810,農民:310";
enData["五5-32010"] = "3,浪人:790,抜け忍:395,雑賀衆:160";
enData["五5-10501"] = "4,浪人:245,抜け忍:245,野盗:245,雑賀衆:485";
enData["五5-01520"] = "3,海賊衆:765,母衣衆:130,農民:380";
enData["五5-23010"] = "4,国人衆:725,海賊衆:120,農民:360,浪人:305";
enData["五5-04150"] = "4,国人衆:220,浪人:360,野盗:725,農民:220";
enData["五6-43311"] = "3,国人衆:2155,浪人:1615,雑賀衆:270";
enData["五6-22210"] = "3,国人衆:1410,浪人:1410,抜け忍:1410";
enData["五6-11450"] = "3,海賊衆:1870,抜け忍:1520,雑賀衆:115";
enData["五6-32431"] = "3,海賊衆:1715,野盗:1485,農民:1025";
enData["五6-45232"] = "3,武士:1070,国人衆:665,抜け忍:2005";
enData["五6-25132"] = "3,母衣衆:1890,雑賀衆:130,野盗:1635";
enData["五7-33341"] = "3,抜け忍:7230,農民:725,鬼:725";
enData["五7-52222"] = "3,弓騎馬:1810,抜け忍:9065,野盗:905";
enData["五7-22230"] = "3,野盗:11025,農民:1575,鬼:160";
enData["五7-12630"] = "2,武士:1715,浪人:10265";
enData["五7-15152"] = "2,赤備え:1680,野盗:10045";
enData["五7-9 10 651"] = "5,野盗:2600,農民:650,鬼:650,浪人:2600,抜け忍:2600";
enData["五8-27213"] = "6,国人衆:515,海賊衆:1545,抜け忍:4115,雑賀衆:515,鬼:1025,天狗:5";
enData["五8-22702"] = "4,母衣衆:2205,野盗:4130,鬼:1105,天狗:5";
enData["五8-72221"] = "6,国人衆:2450,浪人:7335,母衣衆:1225,雑賀衆:1830,鬼:125,天狗:5";
enData["五8-33342"] = "2,鬼:1265,天狗:635";

enData["二1-10000"] = "2,農民:25,抜け忍:5";
enData["二1-01000"] = "2,野盗:5,農民:25";
enData["二2-11020"] = "4,浪人:10,抜け忍:10,野盗:10,農民:20";
enData["二2-00201"] = "4,浪人:5,抜け忍:5,野盗:15,農民:20";
enData["二3-11110a"] = "2,浪人:85,農民:45";
enData["二3-11110b"] = "2,抜け忍:85,農民:45";
enData["二3-11101"] = "2,農民:45,野盗:85";
enData["二4-11101"] = "2,雑賀衆:125,農民:375";
enData["二4-12100"] = "3,海賊衆:100,農民:350,抜け忍:50";
enData["二4-11210"] = "3,国人衆:110,農民:355,浪人:75";
enData["二4-21131"] = "3,母衣衆:120,農民:360,野盗:25";
enData["二5-50201"] = "3,国人衆:145,母衣衆:625,農民:240";
enData["二5-32010"] = "3,浪人:610,抜け忍:305,雑賀衆:125";
enData["二5-10501"] = "4,浪人:190,抜け忍:190,野盗:190,雑賀衆:375";
enData["二5-01520"] = "3,海賊衆:590,母衣衆:100,農民:295";
enData["二5-23010"] = "4,国人衆:560,海賊衆:95,農民:280,浪人:235";
enData["二5-04150"] = "4,国人衆:170,浪人:280,野盗:560,農民:170";
enData["二6-43311"] = "3,国人衆:1660,浪人:1245,雑賀衆:210";
enData["二6-22210"] = "3,国人衆:1085,浪人:1085,抜け忍:1085";
enData["二6-11450"] = "3,海賊衆:1440,抜け忍:1170,雑賀衆:90";
enData["二6-32431"] = "3,海賊衆:1320,野盗:1145,農民:790";
enData["二6-45232"] = "3,武士:825,国人衆:515,抜け忍:1545";
enData["二6-25132"] = "3,母衣衆:1455,雑賀衆:100,野盗:1260";
enData["二7-33341"] = "3,抜け忍:5680,農民:570,鬼:570";
enData["二7-52222"] = "3,弓騎馬:1420,抜け忍:7120,野盗:715";
enData["二7-22230"] = "3,野盗:8660,農民:1235,鬼:125";
enData["二7-12630"] = "2,武士:1345,浪人:8065";
enData["二7-15152"] = "2,赤備え:1320,野盗:7890";
enData["二7-9 10 651"] = "5,野盗:2045,農民:510,鬼:510,浪人:2045,抜け忍:2045";
enData["二8-27213"] = "6,国人衆:405,海賊衆:1215,抜け忍:3230,雑賀衆:405,鬼:805,天狗:5";
enData["二8-22702"] = "4,母衣衆:1730,野盗:3245,鬼:865,天狗:5";
enData["二8-72221"] = "6,国人衆:1925,浪人:5760,母衣衆:960,雑賀衆:1440,鬼:95,天狗:5";
enData["二8-33342"] = "2,鬼:995,天狗:500";

enData["一1-10000"] = "2,農民:25,抜け忍:5";
enData["一1-01000"] = "2,野盗:5,農民:25";
enData["一2-11020"] = "4,浪人:10,抜け忍:10,野盗:10,農民:20";
enData["一2-00201"] = "4,浪人:5,抜け忍:5,野盗:15,農民:20";
enData["一3-11110a"] = "2,浪人:85,農民:45";
enData["一3-11110b"] = "2,抜け忍:85,農民:45";
enData["一3-11101"] = "2,農民:45,野盗:85";
enData["一4-11101"] = "2,雑賀衆:125,農民:375";
enData["一4-12100"] = "3,海賊衆:100,農民:350,抜け忍:50";
enData["一4-11210"] = "3,国人衆:110,農民:355,浪人:75";
enData["一4-21131"] = "3,母衣衆:120,農民:360,野盗:25";
enData["一5-50201"] = "3,国人衆:145,母衣衆:625,農民:240";
enData["一5-32010"] = "3,浪人:610,抜け忍:305,雑賀衆:125";
enData["一5-10501"] = "4,浪人:190,抜け忍:190,野盗:190,雑賀衆:375";
enData["一5-01520"] = "3,海賊衆:590,母衣衆:100,農民:295";
enData["一5-23010"] = "4,国人衆:560,海賊衆:95,農民:280,浪人:235";
enData["一5-04150"] = "4,国人衆:170,浪人:280,野盗:560,農民:170";
enData["一6-43311"] = "3,国人衆:1660,浪人:1245,雑賀衆:210";
enData["一6-22210"] = "3,国人衆:1085,浪人:1085,抜け忍:1085";
enData["一6-11450"] = "3,海賊衆:1440,抜け忍:1170,雑賀衆:90";
enData["一6-32431"] = "3,海賊衆:1320,野盗:1145,農民:790";
enData["一6-45232"] = "3,武士:825,国人衆:515,抜け忍:1545";
enData["一6-25132"] = "3,母衣衆:1455,雑賀衆:100,野盗:1260";
enData["一7-33341"] = "3,抜け忍:5165,農民:520,鬼:520";
enData["一7-52222"] = "3,弓騎馬:1295,抜け忍:6475,野盗:650";
enData["一7-22230"] = "3,野盗:7875,農民:1125,鬼:115";
enData["一7-12630"] = "2,武士:1225,浪人:7335";
enData["一7-15152"] = "2,赤備え:1200,野盗:7175";
enData["一7-9 10 651"] = "5,野盗:1860,農民:465,鬼:465,浪人:1860,抜け忍:1860";
enData["一8-27213"] = "6,国人衆:370,海賊衆:1105,抜け忍:2940,雑賀衆:370,鬼:735,天狗:5";
enData["一8-22702"] = "4,母衣衆:1575,野盗:2950,鬼:790,天狗:5";
enData["一8-72221"] = "6,国人衆:1750,浪人:5240,母衣衆:875,雑賀衆:1310,鬼:90,天狗:5";
enData["一8-33342"] = "2,鬼:905,天狗:455";

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
        DispOption("足軽");
        DispOption("弓足軽");
        DispOption("騎馬兵");
        DispOption("破城鎚");
        DispOption("長槍足軽");
        DispOption("長弓兵");
        DispOption("精鋭騎馬");
        DispOption("攻城櫓");
        DispOption("鉄砲足軽");
        DispOption("武士");
        DispOption("弓騎馬");
        DispOptionS("赤備え");
        DispOption("大筒兵");
        DispOption("騎馬鉄砲");
        DispOption("国人衆");
        DispOption("海賊衆");
        DispOption("母衣衆");
        DispOption("雑賀衆");
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
    DispOption2("8-33310", "8-33310全");
    DispOption2("8-21601", "8-21601弓");
    DispOption2("8-15112", "8-15112槍");
    DispOption2("8-62211", "8-62211馬");
    DispOption2("7-43510", "7-43510槍");
    DispOption2("7-52630", "7-52630槍");
    DispOption2("7-41151", "7-41151弓");
    DispOption2("7-13221", "7-13221弓");
    DispOption2S("7-89331", "7-89331馬");
    DispOption2("7-42402", "7-42402馬");
    DispOption2("6-03340", "6-03340槍");
    DispOption2("6-22242", "6-22242弓");
    DispOption2("6-13432", "6-13432馬");
    DispOption2("6-23122", "6-23122馬");
    DispOption2("6-14321", "6-14321弓");
    DispOption2("6-30210", "6-30210弓");
    DispOption2("5-30140", "5-30140弓");
    DispOption2("5-01520", "5-01520馬");
    DispOption2("5-02300", "5-02300槍");
    DispOption2("5-13020", "5-13020器");
    DispOption2("5-30021", "5-30021槍");
    DispOption2("5-50002", "5-50002弓");
    DispOption2("4-11021", "4-11021全");
    DispOption2("4-00210", "4-00210槍");
    DispOption2("4-12000", "4-12000弓");
    DispOption2("4-20001", "4-20001馬");
    DispOption2("3-11100", "3-11100弓");
    DispOption2("3-11110", "3-11110馬");
    DispOption2("3-01101", "3-01101槍");
    DispOption2("2-00200", "2-00200器");
    DispOption2("2-10010", "2-10010槍器");
    DispOption2("1-01000", "1-01000弓");
    DispOption2("1-10000", "1-10000馬");

    DispOption2("五8-33342", "五8-33342全");
    DispOption2("五8-22702", "五8-22702槍");
    DispOption2("五8-27213", "五8-27213馬");
    DispOption2("五8-72221", "五8-72221弓");
    DispOption2("五7-33341", "五7-33341馬");
    DispOption2("五7-52222", "五7-52222馬");
    DispOption2("五7-12630", "五7-12630弓");
    DispOption2("五7-15152", "五7-15152槍");
    DispOption2("五7-9 10 651", "五7-9 10 651器");
    DispOption2("五7-22230", "五7-22230槍");
    DispOption2("五6-25132", "五6-25132槍");
    DispOption2("五6-43311", "五6-43311器");
    DispOption2("五6-45232", "五6-45232弓");
    DispOption2("五6-22210", "五6-22210弓");
    DispOption2("五6-11450", "五6-11450馬");
    DispOption2("五6-32431", "五6-32431馬");
    DispOption2("五5-32010", "五5-32010弓");
    DispOption2("五5-01520", "五5-01520馬");
    DispOption2("五5-23010", "五5-23010弓");
    DispOption2("五5-10501", "五5-10501器");
    DispOption2("五5-04150", "五5-04150槍");
    DispOption2("五5-50201", "五5-50201槍");
    DispOption2("五4-11210", "五4-11210弓");
    DispOption2("五4-12100", "五4-12100馬");
    DispOption2("五4-11101", "五4-11101全");
    DispOption2("五4-21131", "五4-21131槍");
    DispOption2("五3-11110a", "五3-11110(鉱)弓");
    DispOption2("五3-11110b", "五3-11110(森)馬");
    DispOption2("五3-11101", "五3-11101槍");
    DispOption2("五2-00201", "五2-00201槍器");
    DispOption2("五2-11020", "五2-11020器");
    DispOption2("五1-01000", "五1-01000槍");
    DispOption2("五1-10000", "五1-10000馬");


    DispOption2("二8-33342", "二8-33342全");
    DispOption2("二8-22702", "二8-22702槍");
    DispOption2("二8-27213", "二8-27213馬");
    DispOption2("二8-72221", "二8-72221弓");
    DispOption2("二7-33341", "二7-33341馬");
    DispOption2("二7-52222", "二7-52222馬");
    DispOption2("二7-12630", "二7-12630弓");
    DispOption2("二7-15152", "二7-15152槍");
    DispOption2("二7-9 10 651", "二7-9 10 651器");
    DispOption2("二7-22230", "二7-22230槍");
    DispOption2("二6-25132", "二6-25132槍");
    DispOption2("二6-43311", "二6-43311器");
    DispOption2("二6-45232", "二6-45232弓");
    DispOption2("二6-22210", "二6-22210弓");
    DispOption2("二6-11450", "二6-11450馬");
    DispOption2("二6-32431", "二6-32431馬");
    DispOption2("二5-32010", "二5-32010弓");
    DispOption2("二5-01520", "二5-01520馬");
    DispOption2("二5-23010", "二5-23010弓");
    DispOption2("二5-10501", "二5-10501器");
    DispOption2("二5-04150", "二5-04150槍");
    DispOption2("二5-50201", "二5-50201槍");
    DispOption2("二4-11210", "二4-11210弓");
    DispOption2("二4-12100", "二4-12100馬");
    DispOption2("二4-11101", "二4-11101全");
    DispOption2("二4-21131", "二4-21131槍");
    DispOption2("二3-11110a", "二3-11110(鉱)弓");
    DispOption2("二3-11110b", "二3-11110(森)馬");
    DispOption2("二3-11101", "二3-11101槍");
    DispOption2("二2-00201", "二2-00201槍器");
    DispOption2("二2-11020", "二2-11020器");
    DispOption2("二1-01000", "二1-01000槍");
    DispOption2("二1-10000", "二1-10000馬");

    DispOption2("一8-33342", "一8-33342全");
    DispOption2("一8-22702", "一8-22702槍");
    DispOption2("一8-27213", "一8-27213馬");
    DispOption2("一8-72221", "一8-72221弓");
    DispOption2("一7-33341", "一7-33341馬");
    DispOption2("一7-52222", "一7-52222馬");
    DispOption2("一7-12630", "一7-12630弓");
    DispOption2("一7-15152", "一7-15152槍");
    DispOption2("一7-9 10 651", "一7-9 10 651器");
    DispOption2("一7-22230", "一7-22230槍");
    DispOption2("一6-25132", "一6-25132槍");
    DispOption2("一6-43311", "一6-43311器");
    DispOption2("一6-45232", "一6-45232弓");
    DispOption2("一6-22210", "一6-22210弓");
    DispOption2("一6-11450", "一6-11450馬");
    DispOption2("一6-32431", "一6-32431馬");
    DispOption2("一5-32010", "一5-32010弓");
    DispOption2("一5-01520", "一5-01520馬");
    DispOption2("一5-23010", "一5-23010弓");
    DispOption2("一5-10501", "一5-10501器");
    DispOption2("一5-04150", "一5-04150槍");
    DispOption2("一5-50201", "一5-50201槍");
    DispOption2("一4-11210", "一4-11210弓");
    DispOption2("一4-12100", "一4-12100馬");
    DispOption2("一4-11101", "一4-11101全");
    DispOption2("一4-21131", "一4-21131槍");
    DispOption2("一3-11110a", "一3-11110(鉱)弓");
    DispOption2("一3-11110b", "一3-11110(森)馬");
    DispOption2("一3-11101", "一3-11101槍");
    DispOption2("一2-00201", "一2-00201槍器");
    DispOption2("一2-11020", "一2-11020器");
    DispOption2("一1-01000", "一1-01000槍");
    DispOption2("一1-10000", "一1-10000馬");
}


//[3]動的枠表示

function DispEnemy() {
    GetEnemyInfo();
    $("#temple").remove(); // tbody以下を削除
    $("#enemytable").append('<tbody id="temple"></tbody>'); //tbodyを再構成

    $("#temple").append('<tr><th>兵種</th><th colspan="2">兵数</th><th>防御力</th><th>補正防御力</th></tr>'); //title行
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
    $("#enr").append('<th>計</th>');
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
        $("#attackState").text("勝利");
        AttackHPCalc();
        DefenceSolCalc();
        AttackSolCalc();
    } else { //敗北
        $("#allDefence").css("color", "red");
        $("#allAttack").css("color", "blue");
        $("#attackState").text("敗北");
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
                $("#state" + i).text("正常");
            } else {
                $("#state" + i).text("負傷");
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
                $("#state" + i).text("壊滅");
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