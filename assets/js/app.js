/**
 *TODO: 1.Render Song: innerHTML => OK
 *TODO: 2.Scroll Top: kéo lên bao nhiêu thì thu nhỏ lại bấy nhiêu và ngc lại => OK
 *TODO: 3.Play/Pause/Seek : HTML Audio/Video DOM reference => OK
 *TODO: 4.CD rotate: đĩa đang quay ở đâu thì khi pause phải giữ vị trí đó => OK
 *TODO: Sử dụng Web Animation API để tạo ra keyframe trong JS
 *TODO: 5.Next / prev: index++ / index-- => OK
 *TODO: 6.Random : bỏ qua index hiện tại => OK
 *TODO: 7.Next when end: thêm hành động click vào btn khi end => OK
 *TODO: 8.Repeat when end => OK
 *TODO: 9.Active Song: thêm css rồi add class vào song có index hiện tại khi render => OK
 *TODO: 10.Scroll active song into view: thêm phương thức của element là scrollIntoView: element.scrollIntoView() => OK
 *TODO: 11.Play song when click => OK
 */

/**
 ** Khi đọc DOC thì lắng nghe sự kiện đọc phần EVENTS
 ** Khi muốn lấy/set giá trị gì đó thì đọc ở phần Property
 ** Khi thực hiện hành động nào đó thì đọc phần Method
 */

//* NHững hành động có hoặc không thì đều tư duy theo kiểu boolean

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'WINZ_PLAYER';

const heading = $('.dashboard-header__playing h2');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat')
const playlist = $('.play-list');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs : [
        {
            name: 'Save your tears',
            singer: 'The weeknd',
            path: './assets/music/song1.mp3',
            image: './assets/img/image1.jpg'
        },
        {
            name: 'Blinding Light',
            singer: 'The weeknd',
            path: './assets/music/song2.mp3',
            image: './assets/img/image2.jpg'
        },
        {
            name: 'Cooler than me',
            singer: 'Lucky Luke',
            path: './assets/music/song3.mp3',
            image: './assets/img/image3.jpg'
        },
        {
            name: 'Bang Bang',
            singer: 'Knaan ft Adam Levine',
            path: './assets/music/song4.mp3',
            image: './assets/img/image4.jpg'
        },
        {
            name: 'STAY',
            singer: 'Laroi ft Justin Bieber',
            path: './assets/music/song5.mp3',
            image: './assets/img/image5.jpg'
        },
        {
            name: 'Slow dancing in the dark',
            singer: 'Joji',
            path: './assets/music/song6.mp3',
            image: './assets/img/image6.jpg'
        },
        {
            name: 'Double take',
            singer: 'Dhruv',
            path: './assets/music/song7.mp3',
            image: './assets/img/image7.jpg'
        },
        {
            name: '7 Years',
            singer: 'Lukas Graham',
            path: './assets/music/song8.mp3',
            image: './assets/img/image8.jpg'
        },
        {
            name: 'Arcade',
            singer: 'Duncan Laurence',
            path: './assets/music/song9.mp3',
            image: './assets/img/image9.jpg'
        },
        {
            name: 'Thuc giac',
            singer: 'DA lAB',
            path: './assets/music/song10.mp3',
            image: './assets/img/image10.jpg'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    //* Define property
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    //* Render
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                    <div class="song__thumb" style="background-image: url('${song.image}')"></div>
                    <div class="song__body">
                        <h3 class="song__title">${song.name}</h3>
                        <p class="song__author">${song.singer}</p>
                    </div>
                    <div class="song__option">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `
        });
        playlist.innerHTML = htmls.join('');
    },

    handleEvents: function() {
        const _this = this;

        //* Xử lí khi CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10s
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //* Scroll Top
        const cdWidth = cd.offsetWidth;
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCDWidth = cdWidth - scrollTop;
            cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0 ;
            cd.style.opacity = newCDWidth / cdWidth;
        }

        //* Play / Pause / Seek
        //* Click Play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        //* Khi bài hát được PLAY / bị PAUSE
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play();
        }

        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //* Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                // từ second ra %
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }
        //* Xử lí khi tua bài hát
        progress.onchange = function(event) {
            // từ % tính ra seccond
            const seekTime = (event.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        }

        //* Xử lí Next Song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrolltoActiveSong();
        }

        //* Xử lí Prev Song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrolltoActiveSong();
        }

        //* Xử lí Random Song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            // toggle: true thì add class, false thì bỏ classs
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        //* Xử lí lặp lại 1 bài hát
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        //* Xử lí next song khi bài hát kết thúc
        audio.onended = function() {
            if(_this.isRepeat){
                audio.play();
            } else {
                nextBtn.click()
            }
        }

        //* lắng nghe hành vi click vào play list
        playlist.onclick = function(e) {
            const songElement = e.target.closest('.song:not(active)');
            // closet trả về chính nó hoặc thẻ cha của nó
            if(songElement || e.target.closest('.song__option')) {
                //* xử lí khi click vào song thì chuyển đến song đó
                if(songElement) {
                    _this.currentIndex = Number(songElement.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                //* Xử lí khi click vào song option
                if(e.target.closest('.song__option')) {

                }
            }
        }
    },

    //* Scroll to active song
    scrolltoActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 300)
    },

    //* Load Current Song
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    //* Load config
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        repeatBtn.classList.toggle('active', this.isRepeat);
        randomBtn.classList.toggle('active', this.isRandom);
    },

    //* Next song
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    //* Prev Song
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },

    //* Random Song
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong()
    },

    start: function() {
        //? Gán cấu hình từ config vào object
        this.loadConfig()

        //? định nghĩa các thuộc tính cho Object
        this.defineProperties()

        //? Lắng nghe và xử lí các sự kiện
        this.handleEvents()

        //? Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        //? render ra playlist
        this.render()

        //? next song
        this.nextSong()

        //? prev song
        this.prevSong()

        //? random song()
        this.playRandomSong()
    }
}

app.start();







