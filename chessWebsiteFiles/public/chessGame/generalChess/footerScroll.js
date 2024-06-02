
window.addEventListener("scroll", scrollFunction);

let footer = document.querySelector("#bottom-footer");
let lastScrollLeft = 0;

function scrollFunction(e){
    let ticking = false;
    if(ticking === false){
        requestAnimationFrame(() => {
            
            if(lastScrollLeft !== Math.floor(window.scrollX)){
                /*
                console.log("scroll x");
                console.log(lastScrollLeft);
                console.log(Math.floor(window.scrollX));
                */

                if(Math.floor(window.scrollX) <= 384){
                    lastScrollLeft = Math.floor(window.scrollX);
                }
                else{
                    lastScrollLeft = 384;
                    return;
                }
    
                //footer.style.marginLeft = lastScrollLeft + "px";
                if(footer !== undefined && footer !== null){
                    footer.style.marginLeft = (lastScrollLeft/16) + "rem";
                }
            }
            ticking = false;
        });

        ticking = true;
    }
}

