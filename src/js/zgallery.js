
/* ZGallery
 *
 * id: The ID of the element to hold the gallery.
 * objs: An array of objects holding the data we need. See below for template.
 */
var ZGallery = function(id, objs) {
    if (id == "") {
        throw("ZGallery: id undefined. init was not completed!");
    }
    else
    {
        var checkText = document.querySelector(id);
        this.setText = ("textContent" in checkText) ? "textContent" : "innerText"; // Polyfill for "innerText"
        /* TEMPLATE
        [{
            title: "String of text",
            points: ["Something.", "Something else!", "More stuff.", "Many points", "Practically infinite."],
            href: "http://web.site",
            img: "img/image.jpg"
        },
        { ... }]
        */
        this.zid = id;
        this.objs = objs;
        this.busy = false; // Bool for when the gallery is animating.
        this.ind = 0; // Index of which item is on the center slide.
        this.hcenters = [];
        
        this.init();
    }
}
ZGallery.prototype = {
    init: function(){
        var that = this;
        /* Fills our desired element with our html. */
        document.body.querySelector(this.zid).innerHTML = `
        <div class="absheighttable noselect">
            <a class="chev txtstroke" id="zg-chevl">‹</a>
        </div>
        <div class="absheighttable right noselect">
            <a class="chev txtstroke" id="zg-chevr">›</a>
        </div>
        <div class="backwrap noselect">
            <div class="zg-hcenter backimg"><img /></div><div class="zg-hcenter blur"><img /></div>
        </div>
        <div class="contwrap">
            <div class="contcent">
                <div class="innerwrap">
                    <div id="zg-cont0" class="content">
                        <h1 class="txtstroke"></h1>
                        <div class="info">
                            <div class="half center contcent">
                                <div class="prev"></div>
                            </div>
                            <div class="half contcent mpadtop">
                                <ul class="txtstroke1"></ul>
                                <div class="center noselect">
                                    <a id="zg-sitebtn" target="_blank">View Site</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="zg-contmain" class="content">
                        <h1 class="txtstroke"></h1>
                        <div class="info">
                            <div class="half center contcent">
                                <div class="prev"></div>
                            </div>
                            <div class="half contcent mpadtop">
                                <ul class="txtstroke1"></ul>
                                <div class="center noselect">
                                    <a id="zg-sitebtn" target="_blank">View Site</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="zg-cont1" class="content">
                    <h1 class="txtstroke"></h1>
                        <div class="info">
                            <div class="half center contcent">
                                <div class="prev"></div>
                            </div>
                            <div class="half contcent mpadtop">
                                <ul class="txtstroke1"></ul>
                                <div class="center noselect">
                                    <a id="zg-sitebtn" target="_blank">View Site</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        /* Set up our inital blurry background image. We center it later. */
        var obj = this.objs[0],
        backImg = document.body.querySelector(this.zid + " .backimg img");
        backImg.setAttribute("src", obj.img);
        var blur = document.body.querySelector(this.zid + " .blur img");
        backImg.parentElement.style.backgroundImage = "url('"+obj.img+"')";
        blur.setAttribute("src", obj.img);
        blur.parentElement.style.backgroundImage = "url('"+obj.img+"')";
        
        /* Populate the fields of our default slides. */
        var IDarr = [" #zg\\-cont0"," #zg\\-contmain"," #zg\\-cont1"]; // Array of IDs of each item. We have 3 so we can simulate a spinning carousel.
        for(i = 0; i < 3; i++){
            if (i-1 < 0) {
                obj = this.objs[this.objs.length - 1];
            } else if(i-1 >= this.objs.length){
                obj = this.objs[0];
            }
            else obj = this.objs[i-1];
            Cont = document.querySelector(this.zid+IDarr[i]);
            Cont.querySelector("h1")[this.setText] = obj.title;
            Cont.querySelector(".prev").style.background = "#000000 url('"+obj.img+"') center / contain no-repeat";
            var ul = Cont.querySelector("ul");
            ul.innerHTML = "";
            Array.prototype.forEach.call(obj.points, function(itm, i){
                ul.innerHTML += "<li>"+itm+"</li>";
            });
            Cont.querySelector("#zg\\-sitebtn").setAttribute("href", obj.href);
        }
        
        /* EVENTS */
        document.querySelector(this.zid+" #zg\\-chevl").addEventListener("click", function() {
            if (!that.busy) {
                that.busy = true;
                that.ind--;
                if (that.ind < 0) {
                    that.ind = that.objs.length - 1;
                }
                that.next(-1, -500, document.querySelector(that.zid+" #zg\\-cont0"), document.querySelector(that.zid+" #zg\\-cont1"));
            }
        });
        document.querySelector(this.zid+" #zg\\-chevr").addEventListener("click", function() {
            if (!that.busy) {
                that.busy = true;
                that.ind++;
                if (that.ind >= that.objs.length) {
                    that.ind = 0;
                }
                that.next(1, -4500, document.querySelector(that.zid+" #zg\\-cont1"), document.querySelector(that.zid+" #zg\\-cont0"))
            }
        });
        
        /* Center the backgrounds after a delay. Seems to be affected by load time for some reason, even with this at the end... */
        setTimeout(function(){
            that.hcenters = document.querySelectorAll(that.zid+" .zg\\-hcenter");
            that.center();
        }, 60);
    },
    /* prototype.center
     *
     * Centers our background images.
     */
    center: function(){
        Array.prototype.forEach.call(this.hcenters, function(el, i){
            var bounds = el.children[0].getBoundingClientRect();
            el.style.width = bounds.width;
            el.style.height = bounds.height;
            el.style.marginLeft = -((el.children[0].getBoundingClientRect().width - Math.max(document.documentElement.clientWidth, window.innerWidth || 0))/2);
        });
    },
    /* prototype.next
     *
     * Change to the next (or previous) slide.
     * 
     * after: integer to add to this.ind, to determine which way we are going (-/+)
     * marginLeft: Integer to slide the slides (either left or right).
     * nxtCont: The next slide to switch to.
     * prvCont: The previous slide to put our old slide in.
     */
    next: function(after, marginLeft, nxtCont, prvCont){
        var obj = this.objs[this.ind];
        var backImg = document.querySelector(this.zid + " .backimg img");
        backImg.setAttribute("src", obj.img);
        var blur = document.querySelector(this.zid + " .blur img");
        backImg.parentElement.style.backgroundImage = "url('"+obj.img+"')";
        blur.setAttribute("src", obj.img);
        blur.parentElement.style.backgroundImage = "url('"+obj.img+"')";
        this.center(document.querySelectorAll(this.zid+" .zg\\-hcenter"));
        var contwrap = document.querySelector(this.zid + " .contwrap");
        contwrap.style.transition = "margin-left .5s ease-in-out";
        contwrap.style.marginLeft = marginLeft + "px";
        
        var that = this; // Keeping context for the setTimeout.
        setTimeout(function(){ // After .5s, the animation duration.
            var contmain = document.querySelector(that.zid+" #zg\\-contmain");
            prvCont.innerHTML = contmain.innerHTML;
            contmain.innerHTML = nxtCont.innerHTML;
            contwrap.style.transition = "";
            contwrap.style.marginLeft = (-2500) + "px";
            var n = that.ind + after;
            if (n >= that.objs.length) {
                n = 0;
            }
            else if (n < 0) {
                n = that.objs.length - 1;
            }
            obj = that.objs[n];
            nxtCont.querySelector("h1")[that.setText] = obj.title;
            nxtCont.querySelector(".prev").style.background = "#000000 url('"+obj.img+"') center / contain no-repeat";
            var ul = nxtCont.querySelector("ul");
            ul.innerHTML = "";
            Array.prototype.forEach.call(obj.points, function(itm, i){
                ul.innerHTML += "<li>"+itm+"</li>";
            });
            nxtCont.querySelector("#zg\\-sitebtn").setAttribute("href", obj.href);
            that.busy = false;
        }, 501);
    }
};

(function(){
    /* Centers our background images on resize. Not dynamic friendly at the moment. */
    hcenters = document.querySelectorAll(".zg\\-hcenter");
    center = function(){
        Array.prototype.forEach.call(hcenters, function(el, i){
            var bounds = el.children[0].getBoundingClientRect()
            el.style.marginLeft = -((bounds.width - Math.max(document.documentElement.clientWidth, window.innerWidth || 0))/2);
            el.style.width = bounds.width;
            el.style.height = bounds.height;
        });
    }
    window.onresize = function(){
        if (hcenters.length < 1) {
            hcenters = document.querySelectorAll(".zg\\-hcenter");
        }
        center();
    }
})()