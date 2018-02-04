let bannerRender=(function($){
    let $tnBannerBox=$('#tnBannerBox'),
        $tnCenter=$('#tnCenter'),
        $tnGgCenter=$tnCenter.find('.tnGgCenter'),
        $tnFocus=$tnGgCenter.find('.tnFocus'),
        $arrow=$tnGgCenter.find('.arrow'),
        $tnActivityLink=$tnGgCenter.find('.tnActivityLink'),
        $tnAccordion=$tnGgCenter.find('.tnAccordion'),
        $tnGgRight=$tnCenter.find('.tnGgRight'),
        $hot_point=$tnGgRight.find('.hot_point'),
        $statics=$tnGgRight.find('.statics'),
        $order_list=$tnGgRight.find('.order_list'),
        $imgList=null,
        $focusList=null,
        $acList=null,
        initIndex=0,
        acIndex=0,
        hot=0,
        $plan=$.Callbacks();
    //绑定数据
    $plan.add(result=>{
        let bannerChange=result.bannerChange,
            accor=result.accor,
            hotBox=result.hotBox,
            travel=result.travel,
            str=``,
            strFocus=``,
            strAccor=``,
            strTravel=``;
        bannerChange.forEach(item=>{
            str+=`<li><a href="${item.link}" style="background-image: url('img/${item.img}')"></a></li>`;
            strFocus+=`<li>${item.title}</li>`;
        });
        accor.forEach(item=>{
            strAccor+=`<li><a href="${item.link}"><img src="img/${item.img}"></a></li>`;
        });
        strHot=`<span class="hot_num" data-hot="${hotBox.hot}">${hotBox.hot}</span>`;
        strNumber=` <p class="item_common first_item">出游人数：<em>${hotBox.numberTravel}+</em></p>
                <p class="item_common">点评人数：<em>${hotBox.commentNumber}+</em></p>`;
        travel.forEach(item=>{
            //時間處理
            let nowTime=Date.parse(new Date()),
                tarTime=Date.parse(new Date(item.time)),
                spanTime=nowTime-tarTime;
            let day=Math.floor(spanTime/(1000*60*60*24));
            spanTime-=day*86400000;
            let hours=Math.floor(spanTime/(1000*60*60));
            spanTime-=hours*3600000;
            let minus=Math.floor(spanTime/(1000*60));
            spanTime-=minus*60000;
            let second=Math.floor(spanTime/1000);
            let travelTime=day>0?day+'天':hours>0?hours+'小時':minus>0?minus+'分鐘':'剛剛預定';

            //用戶名處理
            let userName=item.userName;
            resultN=userName.replace(/\d{5}/,'***');
            strTravel+=`<li>
                        <p class="order_title"><a href="#" title="${item.title}">${item.title}</a></p>
                        <p class="order_info">
                            <span class="order_info_user">用户 ${resultN}</span>
                            <span class="order_info_item">${travelTime}前预定</span>
                        </p>
                    </li>`;
        });
        $tnBannerBox.html(str);
        $tnFocus.html(strFocus);
        $tnAccordion.html(strAccor);
        $hot_point.prepend(strHot);
        $statics.append(strNumber);
        $order_list.append(strTravel);
        $imgList=$tnBannerBox.find('li');
        $focusList=$tnFocus.find('li');
        $acList=$tnAccordion.find('li');
        $acImg=$tnAccordion.find('img');
        $orderList=$order_list.find('li');
    });
    //initImage
    $plan.add((result)=>{
        let link=$imgList.eq(initIndex).find('a').attr('href');
        $imgList.css({'opacity':0,zIndex:0}).eq(initIndex).css({'opacity':1,zIndex:1});
        $focusList.removeClass('current').eq(initIndex).addClass('current');
        $tnActivityLink.attr('href',link);
        //  手风琴切换效果默认展示
        $acList.eq(acIndex).css('width','122px');
        $acImg.eq(acIndex).css('left','-100px');
    });
    let autoTimer=null,
        $curList=null;
    //banner切换
    $plan.add((result)=>{
        //自动切换
        let change=function () {
            initIndex=initIndex===$imgList.length?0:initIndex;
            let link=$imgList.eq(initIndex).find('a').attr('href');
            $tnActivityLink.attr('href',link);
            $curList=$imgList.eq(initIndex);
            $curList.css('zIndex', 1)
                .siblings().css('zIndex', 0);
            $curList.stop().animate({opacity: 1}, 1000, function () {
                $curList.siblings().css('opacity', 0);
            });
            $focusList.eq(initIndex).addClass('current')
                .siblings().removeClass('current');

        };
        let autoShow=function () {
            initIndex++;
            change();
        };
        autoTimer=setInterval(autoShow,3000);
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
            clearInterval(autoTimer);
            change();
        });
        $focusList.on('mouseleave',function () {
            autoTimer=setInterval(autoShow,2000);
        });
    //  手风琴切换效果

        $acList.on('mouseenter',function () {
            acIndex=$(this).index();
            $acList.stop().animate({width:'97px'},200);
            $acList.eq(acIndex).stop().animate({width:'122px'},200);
            $acImg.stop().animate({left:'0'},200);
            $acImg.eq(acIndex).stop().animate({left:'-100px'},200);
        });
    });
    //圆形进度
    $plan.add((result)=>{
        let $hot_num=$hot_point.find('.hot_num'),
            hotNum=$hot_num.attr('data-hot');
        $(document).ready(function () {
            let hotNumTimer=setInterval(function () {
                hot+=10;
                if(hot>hotNum-1){
                    hot=hotNum;
                    clearInterval(hotNumTimer);
                }
                let bgTop=-hot*70+'px';
                $hot_num.text(hot);
                $hot_point.stop().animate({backgroundPositionY:'0'},10,function () {
                    $hot_point.stop().animate({backgroundPositionY: '-1750px'}, 10,function () {
                        $hot_point.stop().animate({backgroundPositionY: '-3500px'}, 10,function () {
                            $hot_point.stop().animate({backgroundPositionY: '-5250px'}, 10,function () {
                                $hot_point.stop().animate({backgroundPositionY: bgTop}, 10);
                            });
                        });
                    });
                });
            },20);
            setTimeout(hotNumTimer,100);
        });

    });
    //滚动播报
    $plan.add(result=>{
        let titInitIndex=0,
            titleAutoTimer=null,
            titlrTop=-titInitIndex*55+'px',
            step=$orderList.length;
        console.log(step);
        $order_list.append($orderList[0].cloneNode(true));
        console.log($orderList[0].cloneNode(true));
        $order_list.css('top',titlrTop);
        changeTitle=function () {
            titlrTop=-titInitIndex*56+'px';
            $order_list.stop().animate({'top':titlrTop},500);
        };
        let titleAuto=function () {
            titInitIndex++;
            if(titInitIndex>=step+1){
                $order_list.css('top',0);
                titInitIndex=1;
            }
            changeTitle();
        };
        titleAutoTimer=setInterval(titleAuto,2000);
        $order_list.on('mouseenter',function () {
           clearInterval(titleAutoTimer);
        });
        $order_list.on('mouseleave',function () {
            titleAutoTimer=setInterval(titleAuto,2000);
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