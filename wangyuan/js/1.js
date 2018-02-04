let bannerRender=(function($){
    let $wyBannerBox=$('#wyBannerBox'),
        $tnActivity=$('#tnActivity'),
        $tnBannerBox=$('#tnBannerBox'),
        $tnCenter=$('#tnCenter'),
        $tnGgCenter=$tnCenter.find('.tnGgCenter'),
        $tnFocus=$tnGgCenter.find('.tnFocus'),
        $arrow=$tnGgCenter.find('.arrow'),
        $tnActivityLink=$tnGgCenter.find('.tnActivityLink'),
        $imgList=null,
        $focusList=null,
        initIndex=0,
        $plan=$.Callbacks();
    //绑定数据
    $plan.add(result=>{
        let str=``,
            strFocus=``;
        result.forEach(item=>{
            str+=`<li><a href="${item.link}" style="background-image: url('img/${item.img}')"></a></li>`;
            strFocus+=`<li>${item.title}</li>`;
        });
        $tnBannerBox.html(str);
        $tnFocus.html(strFocus);
        $imgList=$tnBannerBox.find('li');
        $focusList=$tnFocus.find('li');
    });
    //initImage
    $plan.add(()=>{
        $imgList.css({'opacity':0,zIndex:0}).eq(initIndex).css({'opacity':1,zIndex:1});
        $focusList.removeClass('current').eq(initIndex).addClass('current');
    });
    let autoTimer=null,
        $curList=null;
    $plan.add(()=>{
        //自动切换
        let change=function () {
            initIndex=initIndex===$imgList.length?0:initIndex;
            $curList=$imgList.eq(initIndex);
            $curList.css('zIndex', 1)
                .siblings().css('zIndex', 0);
            $curList.stop().animate({opacity: 1}, 500, function () {
                $curList.siblings().css('opacity', 0);
            });
            $focusList.eq(initIndex).addClass('current')
                .siblings().removeClass('current');
        };
        let autoShow=function () {
            initIndex++;
            change();
        };
        autoTimer=setInterval(autoShow,2000);
        //其它切换
        //左右切换
        $tnGgCenter.on('mouseenter',function () {
            $arrow.css('display','block');
        });
        $tnGgCenter.on('mouseleave',function () {
            $arrow.css('display','none');
        });
        $tnActivityLink.on('mouseenter',function () {
            clearInterval(autoTimer);
        });
        $tnActivityLink.on('mouseleave',function () {
            autoTimer=setInterval(autoShow,2000);
        });
        $arrow.on('mouseenter',function () {
            clearInterval(autoTimer);
        });
        $arrow.on('mouseleave',function () {
            autoTimer=setInterval(autoShow,2000);
        });
        $arrow.eq(0).on('click',function () {
            initIndex--;
            initIndex=initIndex<0?$focusList.length-1:initIndex;
            change();
        });
        $arrow.eq(1).on('click',function () {
            initIndex++;
            change();
        });
        //焦点切换
        $focusList.on('mouseenter',function () {
            initIndex=$(this).index();
            change();
        });
    });
    return{
        init:function () {
            $.ajax({
                url:'json/banner.json',
                dataType:'json',
                cache:false,
                success:$plan.fire
            });
        }
    }
})(jQuery);
bannerRender.init();