function openNav(){
    document.getElementById("mySidepanel").style.width = "300px";
    document.getElementById("mySidepanel").style.padding = "20px";
    document.getElementById("map").style.marginLeft = "350px";
    document.getElementById("myFooter").style.marginLeft = "350px";
    document.getElementById("myMain").style.marginLeft = "350px";
    document.getElementById("myCloseButton").style.zIndex = "3";
    document.getElementById("header").style.paddingLeft = "0px";
    document.getElementById("chart-container").style.zIndex = "3";
}

function closeNav(){
    document.getElementById("mySidepanel").style.width = "0px";
    document.getElementById("mySidepanel").style.padding = "0px";
    document.getElementById("map").style.marginLeft ="0px";
    document.getElementById("myFooter").style.marginLeft ="0px";
    document.getElementById("myMain").style.marginLeft = "0px";
    document.getElementById("myCloseButton").style.zIndex = "0";
    document.getElementById("header").style.paddingLeft = "80px";
    document.getElementById("chart-container").style.zIndex = "0";
}

function sidebarBtn(){
    var x = document.getElementById("myMain");
    if (x.style.marginLeft === "350px"){
        closeNav();
    }else{
        openNav();
    }
}
