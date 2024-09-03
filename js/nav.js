function openNav(){
    document.getElementById("mySidepanel").style.width = "300px";
    document.getElementById("mySidepanel").style.padding = "20px";
    document.getElementById("map").style.marginLeft = "350px";
    document.getElementById("myFooter").style.marginLeft = "350px";
/*     document.getElementById("openbtn").style.display = 'none'; */
/*     document.getElementById("closebtn").style.display = 'block'; */
    document.getElementById("myMain").style.marginLeft = "350px";
    document.getElementById("myCloseButton").style.zIndex = "3";
    document.getElementById("header").style.paddingLeft = "0px";
}
function closeNav(){
    document.getElementById("mySidepanel").style.width = "0px";
    document.getElementById("mySidepanel").style.padding = "0px";
    document.getElementById("map").style.marginLeft ="0px";
    document.getElementById("myFooter").style.marginLeft ="0px";
/*     document.getElementById("closebtn").style.display = 'none';
    document.getElementById("openbtn").style.display = 'block'; */
    document.getElementById("myMain").style.marginLeft = "0px";
    document.getElementById("myCloseButton").style.zIndex = "0";
    document.getElementById("header").style.paddingLeft = "80px";
}

function sidebarBtn(){
    var x = document.getElementById("myMain");
    if (x.style.marginLeft === "350px"){
        closeNav();
        console.log("close", x.style.marginLeft)
    }else{
        openNav();
    }
}
