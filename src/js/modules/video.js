import $ from 'jquery'
import Hls from 'hls.js'

//ffmpeg -i input.mp4 out.m3u8
// http://www.renevolution.com/ffmpeg/2013/03/16/how-to-install-ffmpeg-on-mac-os-x.html

// Interesting article about autplay videoPlayer on iOs
// https://webkit.org/blog/6784/new-video-policies-for-ios/

export var videoPlayer = {

    path: 'https://interactive.guim.co.uk/embed/aus/2018/oct/climate-change/',

    mobile: null,

    database: [],

    vidType: null,

    isMobile: null,

    preloadering: null,

    init: function() {

        videoPlayer.isMobile = videoPlayer.mobile_check()

        videoPlayer.vidType = videoPlayer.checker()

        $( ".video-wrapper" ).each(function( index ) {

            var videoType = $(this).data('type')

            var width = $(this).width()

            var target = $(this).data('vid')

            var title = $(this).data('video')

            var video = document.getElementById(target);

            var obj = {}

            obj["video"] = target

            obj["title"] = title

            obj["loading"] = true

            obj["muted"] = false

            videoPlayer.database.push(obj)

            function getHlsLevel(width) {

                return (width < 416) ? 1 :
                    (width < 480) ? 2 :
                    (width < 640) ? 3 :
                    (width < 960) ? 5 :
                    (width < 1280) ? 7 : 9 ;

            }

            function getBestVideo(width) {

                return (width < 640) ? 320 :
                    (width < 1024) ? 640 :
                    (width < 1420) ? 1024 : 1920 ;


            }

            if (videoPlayer.vidType.src==='.m3u8') {

                let startLevel = getHlsLevel(width)

                // console.log("This is where it begins: " + startLevel)

                /*
                1 416
                2 480
                3 640
                5 960
                7 1280
                9 1920
                */

                var hls = new Hls({autoStartLoad: true});

                hls.attachMedia(video);
                hls.on(Hls.Events.MEDIA_ATTACHED, function () {

                    if (startLevel < 6) {

                        hls.loadSource( videoPlayer.path + title + '/' + 'index.m3u8' );

                    } else {

                        hls.loadSource( videoPlayer.path + 'hires/' + title + '/' + 'index.m3u8' );

                    }

                });

            } else {

                let dir = getBestVideo(width)

                $('#' + target).attr({
                    "src": videoPlayer.path + dir + '/' + title + '_' + dir + videoPlayer.vidType.src,
                    "type": videoPlayer.vidType.type,
                    "poster": videoPlayer.path + dir + '/' + title + '_' + dir + '.jpg',      
                })

            }

        });

    },

    initScroll: function() {

        $( window ).scroll(function() {

            clearTimeout($.data(this, 'resizeTimer'));

            $.data(this, 'resizeTimer', setTimeout(function() {

                // console.log("Stopped scrolling")

                // Only trigger once the user has stopped scrolling
                $( ".video-wrapper" ).each(function( index ) {
                  var elementTop = $(this).offset().top;
                  var elementBottom = elementTop + $(this).outerHeight();
                  var viewportTop = $(window).scrollTop();
                  var viewportBottom = viewportTop + $(window).height();

                  if (elementBottom > viewportTop && elementTop < viewportBottom) {

                    if ($(this).hasClass('vactive')) {

                    } else {

                      let vid = $(this).data('vid')

                      let type = $(this).data('type')

                      $(this).addClass('vactive')

                      videoPlayer.scroller(vid, type)

                    }
                    
                  } else {

                    if ($(this).hasClass('vactive')) {

                      let vid = $(this).data('vid')

                      $(this).removeClass('vactive')

                      videoPlayer.pauseVideo(vid)

                      if (videoPlayer.preloadering!=null) {
                        clearInterval(videoPlayer.preloadering);
                      }

                      videoPlayer.preloadering = null

                    }

                  }

                });


            }, 200));

        });

    },

    checker: function() {

        var vinfo = { src: '.mp4', type: 'video/mp4' }

        var isApp = (window.location.origin === "file://" && /(android)/i.test(navigator.userAgent) || window.location.origin === "file://" && /(iPad)/i.test(navigator.userAgent)) ? true : false;

        if (Hls.isSupported() && videoPlayer.isMobile == false && navigator.userAgent.toLowerCase().indexOf('firefox') == -1) {

            vinfo = { src: '.m3u8', type: 'application/x-mpegURL' }

        } else {

            let sUsrAg = navigator.userAgent;

            // console.log("Video shizzle")

            if (sUsrAg.indexOf("Opera") > -1) {

                vinfo = { src: '.ogv', type: 'video/ogg' }

            } else if (sUsrAg.indexOf("Firefox") > -1) {

                vinfo = { src: '.ogv', type: 'video/ogg' }

            }

        }

        return  vinfo

    },

    scroller: function(vid, type) {

        var video = document.getElementById(vid);

        //video.muted = false

        //$(video).stop().animate({volume: 1}, 2000);

        if (type=='progress') {

            //videoPlayer.preload(vid);

        }

        video.play()

        if (!videoPlayer.mobile) {

           //video.play()

        } else {

            //$( ".video_overlay" ).addClass('video_prompt');

            //$(video).parent().parent().next().addClass('video_prompt');

        }

    },

    videoProgress: function(vid) {

        var video = document.getElementById(vid);

        var duration = video.duration;

        /*

        var distance = $('#progress-holder').width();

        $('#progress-holder').click(function(e) {

            var offset = $(this).offset();

            video.currentTime = Math.floor(duration / 100 * (100 / distance * (e.pageX - offset.left)));
        });

        */

    },

    activate: function(vid) {

        var video = document.getElementById(vid);

        var video_overlay = $(video).parent().parent().next()

        $('.video_overlay').unbind();

        $(video_overlay).click(function() {

            if ($(this).parent().hasClass('loaded')) {

                if (!$(video).get(0).paused) {

                    video.pause()

                    setTimeout(function(){
                        $(video_overlay).removeClass('video_play')
                        $(video_overlay).addClass('video_pause')
                    }, 10);
                    
                } else {

                    video.play()

                    setTimeout(function(){
                        $(video_overlay).removeClass('video_pause')
                        $(video_overlay).addClass('video_play')
                    }, 10);

                }

            }

        });

        videoPlayer.playVideo(vid);

    },

    preload: function(vid) {

        var video = document.getElementById(vid);

        let track = videoPlayer.database.filter( (value) => {

            return value.video === vid

        });

        $(video).parent().parent().next().next().children().css('width','0%');
        
        //$('.progress-bar').css('width','0%');

        if (track[0].loading) {

            var loader = setInterval(function() { 

                if (video.readyState === 4) {

                    clearInterval(loader);

                    track[0].loading = false;

                    $(video).parent().parent().parent().addClass('loaded')

                    videoPlayer.activate(vid);

                }

            }, 150);

        } else {

            videoPlayer.activate(vid);

        }


    },

    playVideo: function(vid) {

        videoPlayer.videoProgress(vid);

        var video = document.getElementById(vid);

        var duration = video.duration;

        var ph = $(video).parent().parent().next().next().width()

        var pb = $(video).parent().parent().next().next().children()

        if (videoPlayer.preloadering == null) {

            videoPlayer.preloadering = setInterval(function() {  

                var curtime = Math.ceil((video.currentTime / duration) * 100);

                if (curtime < 99) {

                    $(pb).css('width', curtime + '%');

                } else if (curtime >= 99) {

                    $(pb).css('width','0%');

                }


            }, 1000);

        }

    }, 

    pauseVideo: function(vid) {

        var video = document.getElementById(vid);

        video.pause()

    },

    mobile_check: function() {
        var e = !1;
        ! function(t) {
            (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) && (e = !0)
        }(navigator.userAgent || navigator.vendor || window.opera);
        var t = null != navigator.userAgent.match(/iPad/i);
        return e || t ? !0 : !1
    }

 };

