$(function(){
    
    windRes();
    $(window).resize(windRes);
    
    function windRes(){
        $("body").height($(window).height());
        $("body").width($(window).width());
    }
    
    var carts = new Array();
    
    function ConcstrKart(name, value, image){
        this.name = name;
        this.value = value;
        this.image = image;
    }
    
    var karta_1 = new ConcstrKart("Туз", 11, "1.");
    var karta_2 = new ConcstrKart("Два", 2, "2.");
    var karta_3 = new ConcstrKart("Три", 3, "3.");
    var karta_4 = new ConcstrKart("Чотири", 4, "4.");
    var karta_5 = new ConcstrKart("П'ять", 5, "5.");
    var karta_6 = new ConcstrKart("Шість", 6, "6.");
    var karta_7 = new ConcstrKart("Сім", 7, "7.");
    var karta_8 = new ConcstrKart("Вісім", 8, "8.");
    var karta_9 = new ConcstrKart("Дев'ять", 9, "9.");
    var karta_10 = new ConcstrKart("Десять", 10, "10.");
    var karta_11 = new ConcstrKart("Валет", 10, "11.");
    var karta_12 = new ConcstrKart("Дама", 10, "12.");
    var karta_13 = new ConcstrKart("Король", 10, "13.");
    
    var array_karti = [karta_1, karta_2, karta_3, karta_4, karta_5, karta_6, karta_7, karta_8, karta_9, karta_10, karta_11, karta_12, karta_13];
    
    var before = '<div class="carta"><img src="img/all/' ;
    var after = '.png" alt="back"></div>';
    
    var deal = false;
    var stant  = false;
    
    var money = 1000;
    var rate = 1;
    var freeMoney;
    
    var myValue = 0;
    var yourValue = 0;
    var myMass = new Array();
    var youMass = new Array();
    var usedKarts = new Array();
    
    myMoney();
    
    function myMoney(){
        if(rate > money){
            rate = money;
        }
        freeMoney = money - rate;
        $("#money").text(freeMoney);
        $("#rate").text(rate);
        
    }
    
    $(".buttonRate").click(clickButtonRate);
    
    function clickButtonRate(obj){
        
        var attrRate = $(this);
        var valueRate = attrRate.attr("value");
//        alert(valueRate);
        if(valueRate == "Clear"){
            $("#message").html(" ");
            rate = 1;
            myMoney();
        }else if(valueRate == "Double"){
            $("#message").html(" ");
            
            if((rate*2) > money){
                $("#message").html("<span style='color: red'>Не вистачає грошей на таку ставку! <span>");
            }else{
                rate = rate*2;
                myMoney();
//                $(this).attr("disabled", "disabled");
                clickHit();
            }
        }else if(!deal){
            valueRate = Number(valueRate);
            
            $("#message").html(" ");
            rate = rate + valueRate;
            myMoney();
            
        }else{
            $("#message").html("<span style='color: red'>На протязі гри не дозволено змінювати ставку!<span>");
        }

    }
    
    $("#Deal").click(clickDeal);
    $("#Hit").click(clickHit);
    $("#Stand").click(clickStand);
    
    function clickDeal(){
        if(!deal){
            if(money !== 0){
                usedKarts = [];
                $(".my").html("");
                $(".your").html("");
                $("#message").html(" ");

                $("input#double").removeAttr("disabled");
                $("input#clearRate").attr("disabled", "disabled");

                myMass = [];
                youMass = [];

                deal = true;
                stant = false;

                my();
                your();
                my();
                $(".your").append("<div class='carta' id='delBack'><img src='img/back1.png'alt='back'></div>");
            }else{
                $("#message").html("<span style='color: red'>Ви вже програли всі гроші!<span>");
            } 
        }else{
            $("#message").html("<span style='color: red'>Завершіть розпочату гру!<span>");
        } 
    }
    
    function clickHit(){
        if(deal && !stant){
            $("#message").html(" ");
            my();
        }else{
            $("#message").html("<span style='color: red'>Розпочніть нову гру!<span>");
        }
        
    }
    
    function clickStand(){
        if(!stant){
            $("#message").html(" ");
            deal = false;
            stant = true;
            yourMove();
        }else{
            $("#message").html("<span style='color: red'>Розпочніть нову гру!<span>");
        }
    }
    
    function r(){
        var a = Math.floor(Math.random()*array_karti.length);
        var b = Math.ceil(Math.random()*4); 
        var name = array_karti[a].name;
        var value = array_karti[a].value;
        var img = array_karti[a].image + b;

        var q = usedKarts.indexOf(img);
        
        if(q === -1){
            usedKarts.push(img);
            
            var param = {
                name: name,
                value: value,
                img: img
            }
            return param;   
        }else{
            var param = r();
            return param; 
        }
    }
    
    function my(){
        var karta = r();
        $(".my").append(before + karta.img + after); 
//        myValue = myValue + karta.value;
        myMass.push(karta.value);
        myValue = getSum(myMass);
        $("#myValue").text(myValue).css("display", "block");
        if(myValue > 21){
            deal = false;
            stant = true;
            loss();
            $("#message").html("<span style='color: red'>Перебор! " + myValue + " You LOSS! <span>");
        }
    }
    
    function your(){
        var karta = r();
        $(".your").append(before + karta.img + after); 
//        yourValue = yourValue + karta.value;
        youMass.push(karta.value);
        yourValue = getSum(youMass);
        
        $("#yourValue").text(yourValue).css("display", "block");
    }
    
    function yourMove(){
        $("#delBack").remove();
        
        do{
            your();
        }while((yourValue <= myValue) && (yourValue < 21));

        if(yourValue > 21){
            deal = false;
            stant = true;
            win();
            $("#message").html("<span style='color: green'>В противника перебор! " + myValue + " You WIN! <span>");
            return;
        }else{
            
            if(yourValue < myValue){
                win();
            }else if(yourValue > myValue){
                loss();
            }else{
                noWinNoLoss();
            }
        }
    }
    
    function getSum(mass){
        
        var tuzMass = new Array();
        
        var suma = 0;
        for(var i = 0; i < mass.length; i++){
            if(mass[i] !== 11){
                suma = suma + mass[i];
            }else{
                tuzMass.push(mass[i]);
            }    
        }
        for(var i = 0; i < tuzMass.length; i++){
            if(suma > 10){
                suma = suma + 1;
            }else{
                suma = suma + 11;
            }
        }
        return suma;
    }
    
    function win(){
        money = money + rate;
        myMoney();
        $("#message").html("<span style='color: green'>Ти виграв: Ти: " + myValue + " Він: " + yourValue  + "<span>");
        
        $("input#clearRate").removeAttr("disabled");
        $("input#double").attr("disabled", "disabled");
    }
    
    function loss(){
        money = money - rate;
        myMoney();
        $("#message").html("<span style='color: red'>Ти програв: Ти: " + myValue + " Він: " + yourValue  + "<span>");
        
        $("input#clearRate").removeAttr("disabled");
        $("input#double").attr("disabled", "disabled");
    }
    
    function noWinNoLoss(){
        money = money;
        myMoney();
        $("#message").html("<span style='color: red'>Нічія... Ти: " + myValue + " Він: " + yourValue  + "<span>");
        
        $("input#clearRate").removeAttr("disabled");
        $("input#double").attr("disabled", "disabled");
    }
    
});